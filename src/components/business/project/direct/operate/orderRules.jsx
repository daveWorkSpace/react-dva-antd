import dot from 'dot-prop'
import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col } from 'antd';
import RulesSlide from '../../core/rulesSlide';
import OrderRulesContent from './orderRulesContent';
import { SendOrderRules, BusinessStock } from '../../../../actions';
import Storage from '../../../../../application/library/storage';
import { geography, authorize } from '../../../../../application';
import style from '../../style.less';

const { getAreaList, getOrderRuleDetails } = SendOrderRules;

const { fetchStockListByArea, getStockDispatchRuleByDirect } = BusinessStock;

class OrderRules extends Component {
  constructor(props) {
    super(props);
    const { dispatch, SendOrderRules } = props;
    this.state = {
      activeAreaName: '',             //当前区域名称
      activeAreaRecord: [],           //当前区域信息
      treeList: [],                   //区域平铺列表（包括区域及子区域））
      freezeAreaList: [],             //缓存一个全局区域列表，为了选择区域时选择全部时调用
      areaList: [],                   //区域列表
      stockList: [],                  //配送站列表
      orderRuleListDetail: [],        //分单规则详情信息
      directStockListByArea: {        //直营配送站列表
        _meta: {},
        data: [],
      },
      stockDispatchRuleByArea: {      //规则
        _meta: {},
        data: [],
      },
      columns: freezeAreaList => [
        {
          title: <span>服务区域 <br /><span style={{ color: 'd#00CFA1' }}>总计({freezeAreaList.length})</span></span>,
          dataIndex: 'name',
          key: 'name',
          width: '50%',
        }, {
          title: '分单规则',
          dataIndex: 'is_set_order_delivery_rule',
          key: 'is_set_order_delivery_rule',
          render: (text, record) => {
            return (<span>{ text === true ? '已设置' : '未设置'}</span>)
          },
          filters: [{ text: '未设置', value: false }, { text: '已设置', value: true }],
          filterMultiple: false,
          onFilter: (value, record, current) => {
            return `${record.is_set_order_delivery_rule}` === value;
          },
        },
      ],
    }
    this.private = {
      dispatch,
      storage: new Storage('direct', { useSession: true }),              //缓存实例
      vendor_id: authorize.auth.vendorId,
      city_code: dot.get(authorize.vendor, 'city.code'),
      city_name: dot.get(authorize.vendor, 'city.name'),
      state: 100,                             //区域状态 100启用 -100 禁用
      relate_type: 10,                        // 区域类型 10 直营 20 加盟
      is_filter_sub_area: true,               //是否过滤子区
      is_set_order_delivery_rule: true,       //是否返回设置订单分单规则状态
      limit: 1000,
      disable: false,                         //关闭禁止开关

    }
    // 区域关键字搜索
    this.areaSearch = this.areaSearch.bind(this);
    // 刷新开关方法
    this.reflush = this.reflush.bind(this);
    // 表格每列点击函数
    this.onRowClick = this.onRowClick.bind(this);
    // 获取区域列表
    this.getAreaListFunc = this.getAreaListFunc.bind(this);
    // 通知model 层 通过区域id 获取此区域的分单规则详情信息
    this.getOrderRuleDetailsFunc = this.getOrderRuleDetailsFunc.bind(this);
    // 通过区域获得仓库
    this.getStockByArea = this.getStockByArea.bind(this);
    // 根据区域获取配送站设置
    this.getStockDispatchRuleByArea = this.getStockDispatchRuleByArea.bind(this);
  }

  componentWillMount() {
    this.getAreaListFunc()
  }

  componentWillReceiveProps(nextProps) {
    const { SendOrderRules, BusinessStock } = nextProps;
    const { disable } = this.private;
    const { orderAreaList, orderRuleListDetail } = SendOrderRules;
    const { listByArea, directStockListByArea, stockDispatchRuleByArea } = BusinessStock;

    const state = {
      stockList: listByArea.data,
      freezeAreaList: orderAreaList.data,
      orderRuleListDetail: orderRuleListDetail.data,
      directStockListByArea,
      stockDispatchRuleByArea,
    };

    // areaList 设置为了防止点击某一区域时， model 数据重新覆盖 areaList
    if (disable === false) {
      state.areaList = orderAreaList.data;
    }
    console.log('仓库列表', listByArea.data);
    this.setState(state)
  }

  // 获取区域列表
  getAreaListFunc() {
    const {
      dispatch,
      storage,
      vendor_id,
      state,
      relate_type,
      city_code,
      is_filter_sub_area,
      is_set_order_delivery_rule,
      limit,
    } = this.private;
    const contract_id = storage.get('contract_id')
    const params = {
      vendor_id,
      state,
      relate_type,
      city_code,
      is_filter_sub_area,
      is_set_order_delivery_rule,
      contract_id,
      limit,
    }
    dispatch({ type: getAreaList, payload: params })
  }

  // 区域关键字搜索
  areaSearch(value) {
    const { freezeAreaList } = this.state;
    let searchIndex = 0;
    if (value === '0' || value === '' || value === undefined) {       //枚举 0:全部区域
      this.setState({
        areaList: freezeAreaList,
        pagination: {
          total: freezeAreaList.length,
          current: 1,
        },
      })
    } else {
      freezeAreaList.forEach((item, index) => {
        if (item.id == value) {
          searchIndex = index;
        }
      });

      const areaChangeValue = freezeAreaList[searchIndex];
      this.setState({
        areaList: [areaChangeValue],
        pagination: {
          total: 1,
          current: 1,
        },
      })
    }
  }

  // 分单规则区域刷新机制
  reflush(value) {
    if (value === true) {
      // console.log('---------------禁止刷新-------------------')
    } else {
      // console.log('---------------允许刷新-------------------')
    }
    this.private.disable = value
  }

  // 通知model 层 通过区域id 获取此区域的分单规则详情信息
  getOrderRuleDetailsFunc(record) {
    const { dispatch, storage, vendor_id } = this.private;
    // 通知model 层 通过区域id 获取此区域的分单规则详情信息
    const params = {
      area_id: record.id,
      vendor_id,
      state: 100,         // 签约状态
      seller_id: storage.get('seller_id'),
      contract_id: storage.get('contract_id'),
      limit: 100,
    }
    dispatch({ type: getOrderRuleDetails, payload: params });
  }

  //通过区域获得仓库
  getStockByArea(areaId) {
    const { dispatch } = this.private;
    dispatch({ type: fetchStockListByArea, payload: { areaId } });
  }

  // 根据区域获取配送站设置
  getStockDispatchRuleByArea(record) {
    const { dispatch, storage, vendor_id } = this.private;
    const params = {
      vendorId: vendor_id,
      areaId: record.id,
      sellerId: storage.get('seller_id'),
      contractId: storage.get('contract_id'),
      state: 100,         // 仓库状态（100：启用 -100：禁用）
      ruleType: 10,        // 规则类型（10：配送站 20：库房 30：中转仓）
      limit: 999,
    }
    dispatch({ type: getStockDispatchRuleByDirect, payload: params });
  }

  // 根据左侧的区域获取右侧的订单规则详情的代码
  onRowClick = (record, index) => {
    // 禁止区域刷新
    this.reflush(true);
    console.log('------------------click slide one -------')
    // 请求分单规则详情
    this.getOrderRuleDetailsFunc(record);
    // 请求仓库列表
    this.getStockByArea(record.id);
    // 请求配送站规则
    this.getStockDispatchRuleByArea(record);

    //获取区域及子区域列表
    const treeList = record.sub_areas ? record.sub_areas : [];

    //防止重复区域导致key值不唯一的报错
    let flag = false;
    if (treeList.length > 0) {
      for (const i in treeList) {
        if (treeList[i].id === record.id) {
          flag = true;
          break;
        }
      }
    }

    !flag && treeList.push({ id: record.id, name: record.name });

    this.setState({
      treeList,
      activeAreaName: record.name,
      activeAreaRecord: record,
    });
  };

  //渲染区域模块
  renderAreas=() => {
    const { areaSearch, onRowClick } = this;
    const { areaList, freezeAreaList, columns } = this.state;
    const { city_name, storage } = this.private;
    const sellerName = storage.get('seller_name')

    const props = {
      columns: columns(freezeAreaList),
      cityName: city_name,
      sellerName,
      areaList,
      freezeAreaList,
      areaSearch,
      onRowClick,
    }

    return <RulesSlide {...props} />
  }

  //渲染规则模块
  renderRules=() => {
    const { reflush, getAreaListFunc, getOrderRuleDetailsFunc, getStockDispatchRuleByArea } = this;
    const { directStockListByArea, stockDispatchRuleByArea, activeAreaName, activeAreaRecord, orderRuleListDetail, treeList, stockList } = this.state;

    const props = {
      activeAreaName,
      activeAreaRecord,
      stockList,
      treeList,
      reflush,
      directStockListByArea,
      stockDispatchRuleByArea,
      orderRuleListDetail,
      getAreaListFunc,
      getOrderRuleDetailsFunc,
      getStockDispatchRuleByArea,
    }

    return <OrderRulesContent {...props} />
  }

  render() {
    const { renderAreas, renderRules } = this;
    return (
      <div className={`${style.component} rules-body con-body main-list`}>
        <Row type="flex" align={'center'}>
          {/* 左侧区域选择 */}
          {renderAreas()}

          {/* 右侧主体区域 */}
          {renderRules()}
        </Row>
      </div>
    )
  }
}

function mapStateToProps({ SendOrderRules, BusinessStock }) {
  return { SendOrderRules, BusinessStock };
}

export default connect(mapStateToProps)(OrderRules);
