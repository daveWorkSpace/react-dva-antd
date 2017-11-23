import dot from 'dot-prop'
import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Button, Switch, Row, Col, Form, Input, Icon, Select, Popconfirm, message } from 'antd';
import Storage from '../../../../application/library/storage';
import style from '../style.less';
import { authorize } from '../../../../application';
import { BusinessSupplierService } from '../../../actions';
import AreaHeader from './areaHeader';
import AreaTable from './areaTable';
import { SUPPLIER_AREA_COLUMNS } from '../core/enumerate';

const [FormItem, Option] = [Form.Item, Select.Option];

const { getAreaList, editAreas, updataStateFunc, submitAreaStateFunc } = BusinessSupplierService;

class SupplierArea extends React.Component {
  constructor(props) {
    super(props);
    const { dispatch, BusinessSupplierService } = props;
    this.state = {
      areaList: BusinessSupplierService.areaList,                 //区域列表
      page: 1,                                                    //分页
    }
    this.private = {
      dispatch,
      storage: new Storage('supplier', { useSession: true }),     //承运商缓存实例
      vendor_id: authorize.auth.vendorId,                         //服务商id
      city_code: dot.get(authorize.vendor, 'city.code'),
      limit: 10,                                                  //分页
      sort: '{"created_at":-1}',                                  //排序
      columns: [],                                                
      /** 搜索条件 */
      state: 100,                                                 //状态
    }
    // 根据条件查询合作区域
    this.searchHandle = this.searchHandle.bind(this);
    // 切换合作区域状态
    this.onConfirm = this.onConfirm.bind(this);
    // 取消切换合作区域状态
    this.onCancel = this.onCancel.bind(this);
    // 返回区域合作列表
    this.renderAreaList = this.renderAreaList.bind(this);
  }

  componentWillMount() {
    const { onConfirm, onCancel, renderAreaList } = this;
    const switchCallback = record => (
      <div>
        <Popconfirm
          style={{ width: '200px!important' }}
          title={record.state == 100 ? `关闭合作后，该区域中的业务订单将不再分配
            给该服务商您确定要关闭此配送区域的合作关系吗?` : `开启合作后，可以将该区域中的业务订单分配
            给该服务商，确认现在开启该配送区域的合作关系吗?`}
          onConfirm={() => onConfirm(record)}
          onCancel={onCancel} okText="确认" cancelText="取消"
        >
          <a href="#"><Switch
            checked={record.state == 100} checkedChildren={'开'}
            unCheckedChildren={'关'}
          /></a>
        </Popconfirm>
      </div>
    )

    const operateCallback = record => (
      <Link to={`/business/area/list?id=${record.area_id}`}>查看区域</Link>
    )

    this.private.columns = SUPPLIER_AREA_COLUMNS(switchCallback, operateCallback)
    // 请求合作区域列表
    renderAreaList()
  }

  componentWillReceiveProps(nextProps) {
    const { renderAreaList } = this;
    const { BusinessSupplierService } = nextProps;
    const { dispatch } = this.private;
    const { areaList, upDataState, submitAreaState } = BusinessSupplierService;

    this.setState({
      areaList,
    })

    // 当切换合作状态时，成功状态返回
    if (upDataState === true) {
      message.success('编辑成功');
      renderAreaList(params)
      // 完成操作后 重置 返回状态
      dispatch({ type: updataStateFunc, payload: false })
    }
    // 当添加合作区域成功后，更新合作区域列表
    if (submitAreaState === true) {
      message.success('添加成功');
      renderAreaList()
      // 完成操作后 重置 返回状态
      dispatch({ type: submitAreaStateFunc, payload: false })
    }
  }

  // 切换合作区域状态
  onConfirm(record) {
    const { dispatch } = this.private;
    const biz_area_id = record.id;
    let state = '';
    if (record.state > 0) {
      state = -100;
    }
    if (record.state < 1) {
      state = 100;
    }
    const values = {
      biz_area_id,
      state,
    };
    // 编辑合作区域信息
    dispatch({ type: editAreas, payload: { values } })
  }

  // 取消切换合作区域状态
  onCancel() {

  }

  // 返回区域合作列表
  renderAreaList() {
    const { dispatch, storage, vendor_id, city_code, limit, sort, state } = this.private;
    const { page } = this.state;
    const supply_vendor_id = storage.get('supply_vendor_id');
    const params = {
      vendor_id,
      city_code,
      supply_vendor_id,
      page,
      limit,
      sort,
    }
    if (state) {
      params.state = state
    }
    dispatch({ type: getAreaList, payload: params });
  }

  // 根据条件查询合作区域
  searchHandle(values) {
    this.private.state = values.state;
    this.setState({
      page: 1,
    }, () => {
      this.renderAreaList()
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { searchHandle, renderAreaList } = this;
    const { areaList, page } = this.state;
    const { columns, limit } = this.private;
    const pagination = {
      total: areaList._meta.result_count || 0,
      pageSize: limit,
      showTotal: (total) => {
        return `总共 ${total} 条`;
      },
      onShowSizeChange: (current, pageSize) => {
        this.props.onShowSizeChange(current, pageSize);
      },
      current: page,
      onChange: (current) => {
        this.setState({
          page: current,
        }, () => {
          // 请求合作区域列表
          renderAreaList()
        })
      },
    }
    const areaHeaderProps = {
      searchHandle,
    }
    const areaTableProps = {
      areaList,
      pagination,
      columns,
    }
    return (
      <div className="bd-content">
        {/* 顶部搜索模块 */}
        <AreaHeader {...areaHeaderProps} />
        {/* 底部合作区域列表 */}
        <AreaTable {...areaTableProps} />
      </div>
    )
  }
}

function mapStateToProps({ BusinessSupplierService }) {
  return { BusinessSupplierService };
}

export default connect(mapStateToProps)(Form.create()(SupplierArea))
