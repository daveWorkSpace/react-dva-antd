import dot from 'dot-prop'
import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col } from 'antd';
import RulesSlide from '../../core/rulesSlide';
import KnightRulesContent from '../../core/knightRulesContent';
import { SendOrderRules } from '../../../../actions';
import Storage from '../../../../../application/library/storage';
import { geography, authorize } from '../../../../../application';
import style from '../../style.less';

const {
  getAreaList,
    getKnightRuleDetails,
} = SendOrderRules;

class KnightRules extends Component {
  constructor(props) {
    super(props);
    const { dispatch, SendOrderRules } = props;
    this.state = {
      activeAreaName: '',                   //当前选中区域名
      activeAreaRecord: [],                 //当前选中区域信息
      treeList: [],                         //区域平铺列表（包括区域及子区域））
      freezeAreaList: [],                   //缓存一个全局区域列表，为了选择区域时选择全部时调用
      areaList: [],                         //区域列表
      knightRuleListDetail: [],             //分单规则详情信息
      columns: freezeAreaList => [
        {
          title: <span>服务区域 <br /><span style={{ color: 'd#00CFA1' }}>总计({freezeAreaList.length})</span></span>,
          dataIndex: 'name',
          key: 'name',
          width: '50%',
        }, {
          title: '分单规则',
          dataIndex: 'is_set_courier_delivery_rule',
          key: 'is_set_courier_delivery_rule',
          render: (text, record) => {
            return (
              <span>{ text == true ? '已设置' : '未设置'}</span>
            )
          },
          filters: [
            { text: '未设置', value: false },
            { text: '已设置', value: true },
          ],
          filterMultiple: false,
          onFilter: (value, record, current) => {
            return `${record.is_set_courier_delivery_rule}` === value;
          },
        },
      ],
    }
    
    this.private = {
      dispatch,
      type: 'affiliate',            //加盟
      storage: new Storage('affiliate', { useSession: true }),              //缓存实例
      supply_vendor_id: authorize.auth.vendorId,                  //承运商id
      city_code: dot.get(authorize.vendor, 'city.code'),          //城市code
      city_name: dot.get(authorize.vendor, 'city.name'),          //城市名
      state: 100,                             //区域状态 100启用 -100 禁用
      relate_type: 20,                        // 区域类型 10 直营 20 加盟
      is_filter_sub_area: true,               //是否过滤子区
      is_set_courier_delivery_rule: true,       //是否返回设置骑士分单规则状态
      limit: 1000,
      disable: false,
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
    this.getKnightRuleDetailsFunc = this.getKnightRuleDetailsFunc.bind(this);
  }

  componentWillMount() {
    this.getAreaListFunc()
  }

  // 获取区域列表
  getAreaListFunc() {
    const {
        dispatch,
        storage,
        supply_vendor_id,
        state,
        relate_type,
        is_filter_sub_area,
        is_set_courier_delivery_rule,
        limit,
    } = this.private;
    const vendor_id = storage.get('vendor_id')
    const contract_id = storage.get('contract_id')
    console.log('vendor_id', vendor_id)
    console.log('supply_vendor_id', supply_vendor_id)
    const params = {
      vendor_id,
      supply_vendor_id,
      state,
      relate_type,
      is_filter_sub_area,
      is_set_courier_delivery_rule,
      contract_id,
      limit,
    }
    dispatch({ type: getAreaList, payload: params })
  }


  componentWillReceiveProps(nextProps) {
    const { SendOrderRules } = nextProps;
    const { disable } = this.private;
    const {
      courierAreaList,
      knightRuleListDetail,
    } = SendOrderRules;

        // areaList 设置为了防止点击某一区域时， model 数据重新覆盖 areaList
    if (disable === false) {
      this.setState({
        areaList: courierAreaList.data,
      })
    }

    this.setState({
      freezeAreaList: courierAreaList.data,
      knightRuleListDetail: knightRuleListDetail.data,
    })
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

    // 区域关键字搜索
  areaSearch(value) {
    const { freezeAreaList } = this.state;
    let searchIndex = 0;
    if (value === '0' || value === '' || value === undefined) {       //枚举 0:全部区域
      this.setState({
        areaList: freezeAreaList,
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
      })
    }
  }

    // 通知model 层 通过区域id 获取此区域的分单规则详情信息
  getKnightRuleDetailsFunc(record) {
    const { storage } = this.private;
    const { dispatch } = this.props;
    const { vendorId } = authorize.auth;

    // 通知model 层 通过区域id 获取此区域的分单规则详情信息
    const params = {
      area_id: record.id,
      vendor_id: vendorId,
      state: 100,         // 签约状态
      seller_id: storage.get('seller_id'),
      contract_id: storage.get('contract_id'),
      limit: 100,
    }
    dispatch({ type: getKnightRuleDetails, payload: params });
  }

    // 根据左侧的区域获取右侧的订单规则详情的代码
  onRowClick = (record, index) => {
        // 禁止区域刷新
    this.reflush(true);
    console.log('------------------click slide one -------')
    this.getKnightRuleDetailsFunc(record);

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

  render() {
    const { areaSearch, reflush, onRowClick, getAreaListFunc, getKnightRuleDetailsFunc } = this;
    const { areaList, columns, freezeAreaList, activeAreaName, activeAreaRecord, treeList, knightRuleListDetail } = this.state;
    const { city_name, type } = this.private;
    const { storage } = this.private;
    const sellerName = storage.get('seller_name')
    const slideProps = {
      columns: columns(freezeAreaList),
      city_name,
      sellerName,
      areaList,
      freezeAreaList,
      areaSearch,
      onRowClick,
    }
    const contentProps = {
      activeAreaName,
      activeAreaRecord,
      treeList,
      reflush,
      type,
      knightRuleListDetail,
      getAreaListFunc,
      getKnightRuleDetailsFunc,
    }
    return (
      <div className={`${style.component} rules-body con-body main-list`}>
        <Row type="flex" align={'center'}>
          {/* 左侧区域 */}
          <RulesSlide {...slideProps} />
          {/* 右侧主体区域 */}
          <KnightRulesContent {...contentProps} />
        </Row>
      </div>
    )
  }
}

function mapStateToProps({ SendOrderRules }) {
  return { SendOrderRules };
}
export default connect(mapStateToProps)(KnightRules);
