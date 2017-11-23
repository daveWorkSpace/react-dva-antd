import dot from 'dot-prop'
import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Form, Row, Col, Button, Tooltip, Icon } from 'antd';
import Search from '../../common/search';
import Table from './table';
import { OperationsManage } from '../../actions';
import { authorize } from '../../../application';
import { OPERATIONS_SEARCH_ORDER_COLUMNS } from '../enumerate';

const { dateFormat } = window.tempAppTool;
const {
  getShipmentsList,
} = OperationsManage;
class IndexComponent extends React.Component {
  constructor(props) {
    super();
    const { dispatch, OperationsManage } = props;
    this.state = {
      shipmentsList: OperationsManage.shipmentsList,      //运单列表
      page: 1,    //初始化分页
    }

    this.private = {
      dispatch,
      vendorId: authorize.auth.vendorId,
      cityCode: dot.get(authorize.vendor, 'city.code'),
      limit: 10,
      /** 搜索条件 */
      search: {
        orgOrderId: '',     //订单编号
        state: '',          //订单状态
        startDate: '',
        endDate: '',
        courierMobile: '',  //骑士手机号
        sellerId: '',       //商户ID
        areaId: '',
      }
    }
    // 获取运单列表数据
    this.fetchShipmentsList = this.fetchShipmentsList.bind(this)
  }

  componentWillMount() {
    this.fetchShipmentsList()
  }

  componentWillReceiveProps(nextProps) {
    const { OperationsManage } = nextProps;
    const {
            shipmentsList,
        } = OperationsManage;

    this.setState({
      shipmentsList,
    })
  }

  // 获取运单列表数据
  fetchShipmentsList() {
    const { dispatch, vendorId, cityCode, limit, orgOrderId, state, startDate, endDate, courierMobile, sellerId, areaId } = this.private;
    const { page } = this.state;

    const listParams = {
      vendorId,
      cityCode,
      page,
      limit,
    }
    if (startDate) {
      listParams.startDate = startDate
    }
    if (endDate) {
      listParams.endDate = endDate
    }
    if (courierMobile) {
      listParams.courierMobile = courierMobile;
    }
    if (orgOrderId) {
      listParams.orgOrderId = orgOrderId
    }
    if (state) {
      listParams.state = state
    }
    if (sellerId) {
      listParams.sellerId = sellerId;
    }
    if (areaId) {
      listParams.areaId = areaId
    }
    dispatch({ type: getShipmentsList, payload: listParams })
  }
  // search
  searchHandle = (values) => {
    if (values) {
      this.private.search.orgOrderId = values.orgOrderId ? values.orgOrderId : '';
      this.private.search.startDate = values.startDate ? values.startDate : '';
      this.private.search.endDate = values.endDate ? values.endDate : '';
      this.private.search.sellerId = values.sellerId ? values.sellerId : '';
      this.private.search.contractType = values.contractType ? values.contractType : '';
      this.private.state = values.state ? values.state : '';
      this.private.courierMobile = values.courierMobile ? values.courierMobile : '';
      this.private.areaId = values.areaId ? values.areaId : '';
    } else {
      this.private.search.orgOrderId = '';
      this.private.search.startDate = '';
      this.private.search.endDate = '';
      this.private.search.sellerId = ''
      this.private.search.contractType = '';
      this.private.state = '';
      this.private.courierMobile = '';
      this.private.areaId = '';
    }
    this.setState({
      page: 1,
    }, () => {
      this.fetchShipmentsList();
    });

  }

  render() {
    const { shipmentsList, page } = this.state;
    const { fetchShipmentsList, searchHandle } = this;
    const { limit } = this.private;
    const pagination = {
      total: shipmentsList._meta.result_count || 0,
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
          // 初始化请求，获取全部直营项目管理列表
          fetchShipmentsList()
        })
      },
    }

    const callback = (record) => {
      return (
        <Link to={`/operations/details?id=${record.id}`}>{record.org_order_id}</Link>
      )
    }

    const searchParams = {
      searchHandle,
    }

    const tableParams = {
      shipmentsList,
      pagination,
      columns: OPERATIONS_SEARCH_ORDER_COLUMNS(callback),
    }
    return (
      <div className="con-body main-list">
        {/* 渲染标题 */}
        <Search {...searchParams} />

        {/* 渲染列表 */}
        <Table {...tableParams} />
      </div>
    )
  }
}
function mapStateToProps({ OperationsManage }) {
  return { OperationsManage };
}

module.exports = connect(mapStateToProps)(IndexComponent);
