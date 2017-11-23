import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Input, Button, Form, Table, Radio, Breadcrumb, Alert, Icon, Popover, Badge, Pagination } from 'antd';
import OrderStatistics from '../order/components/orderStatistics';
import style from './style.less';
import { OrderListState, OrderParams } from '../exports'
import { OperationOrder } from '../../ActionName';
import { authorize } from './../../../../../application';

import HeaderTitle from './detailHeader';

//请求的每页数据条数
const { rgReg, requestPagerSize, requestPageNumber } = OrderParams;
class Seller extends React.Component {

  constructor(props) {
    super();
    const { operationOrder } = props;

    //接收传递参数
    const { sellerId, date, sellerName, cityCode, isDirect } = props.location.query;

    //订单状态
    const { sellerOrderStatistics, areaOrderList, areaMeta } = operationOrder;

    //初始化状态
    this.state = {
      sellerOrderStatistics,
      areaOrderList,
      areaMeta,
      sellerId,
      isDirect,
      date,
      sellerName,
      current: requestPageNumber,             //当前页码
      cityCode,
    };

    //私有变量属性－－－不要把方法直接挂在this上，固定不变的属性放在 private中
    this.private = {
      dispatch: props.dispatch,              //dispatch函数
    };
  }

  componentDidMount = () => {
    const { fetchSellerMethod } = this;
    fetchSellerMethod();
  };

  componentWillReceiveProps = (nextProps) => {
    const { operationOrder, current } = nextProps;
    const { sellerOrderStatistics, areaOrderList, areaMeta } = operationOrder;
    this.setState({
      sellerOrderStatistics,
      areaOrderList,
      areaMeta,
    })
  };

  //update 分页请求
  onPageChange = (page) => {
    this.setState({ current: page });
    const vendor_id = authorize.auth.vendorId;
    const { dispatch } = this.props;
    const { sellerId, date, cityCode, isDirect } = this.state;
    //服务商订单列表
    dispatch({
      type: OperationOrder.fetchAreaOrderList,
      payload: {
        sellerId,                    //商户ID
        vendorId: vendor_id,
        cityCode,
        shippingDate: date,
        isDirect,
        page,                        //页码
        limit: requestPagerSize,     //分页
        sort: '{created_at: -1}',    //排序按照创建时间排序：－1代表倒叙排列；默认按照 最早创建的显示在最前面。
      },
    })
  };

  //请求
  fetchSellerMethod = () => {
    const vendor_id = authorize.auth.vendorId;
    const { dispatch } = this.props;
    const { sellerId, date, cityCode, isDirect } = this.state;
    //请求订单数据状态
    dispatch({
      type: OperationOrder.fetchSellerOrderStatistics,
      payload: {
        vendorId: vendor_id,
        sellerId,
        cityCode,
        shippingDate: date,
        isDirect,
      },
    });

    //服务商订单列表
    dispatch({
      type: OperationOrder.fetchAreaOrderList,
      payload: {
        sellerId,                    //商户ID
        vendorId: vendor_id,
        cityCode,
        shippingDate: date,
        isDirect,
        page: requestPageNumber,     //页码
        limit: requestPagerSize,     //分页
        sort: '{created_at: -1}',   //排序按照创建时间排序：－1代表倒叙排列；默认按照 最早创建的显示在最前面。
      },
    })
  };

  //渲染商家订单状态统计
  renderStateDashboardComponent = () => {
    const { sellerOrderStatistics } = this.state;
    const props = {
      orderStatistics: sellerOrderStatistics,     //订单状态
    };
    return (
      <OrderStatistics {...props} />
    )
  };

  //服务商列表（供应商列表）
  renderAreaOrderStateComponent= () => {
    const { onPageChange } = this;
    const { areaOrderList, areaMeta, current } = this.state;
    const columns = [{
      title: '服务区域',
      dataIndex: 'area_name',
      key: 'area_name',
    }, {
      title: '运力供应商',
      dataIndex: 'supply_vendor_name',
      key: 'supply_vendor_name',
    }, {
      title: '总订单',
      dataIndex: 'order_count',
      key: 'total',
      render(states, row, index) {
        const allStates = row.states || [];
        let total = 0;
        Object.keys(allStates).forEach((item) => {
          if (item !== OrderListState.total) {
            total += allStates[item];
          }
        })
        return total;
      },
    }, {
      title: <span><Badge className={style.minCircle_2} />已确认</span>,
      dataIndex: 'states',
      key: 'confirmed',
      render: (states, row, index) => { return states[OrderListState.confirmed] || 0 },
    }, {
      title: <span><Badge className={style.minCircle_3} />异常</span>,
      dataIndex: 'states',
      key: 'exception',
      render: (states, row, index) => { return states[OrderListState.exception] || 0 },
    }, {
      title: <span><Badge className={style.minCircle_4} />配送中</span>,
      dataIndex: 'states',
      key: 'distribution',
      render: (states, row, index) => { return states[OrderListState.distribution] || 0 },
    }, {
      title: <span><Badge className={style.minCircle_5} />未完成</span>,
      dataIndex: 'states',
      key: 'undone',
      render: (states, row, index) => {
        //已确认订单数
        const confirmedNumber = states[OrderListState.confirmed] ? states[OrderListState.confirmed] : 0;
        //配送中订单数
        const distributionNumber = states[OrderListState.distribution] ? states[OrderListState.distribution] : 0;
        //异常订单数
        const exceptionNumber = states[OrderListState.exception] ? states[OrderListState.exception] : 0;
        //未完成订单数
        return (confirmedNumber + distributionNumber + exceptionNumber);
      },
    }, {
      title: <span><Badge className={style.minCircle_6} />已送达</span>,
      dataIndex: 'states',
      key: 'done',
      render: (states, row, index) => { return states[OrderListState.done] || 0 },
    }, {
      title: <span><Badge className={style.minCircle_7} />已取消</span>,
      dataIndex: 'states',
      key: 'canceled',
      render: (states, row, index) => { return states[OrderListState.canceled] || '0' },
    }, {
      title: '完成率',
      dataIndex: 'states',
      key: 'completeRate',
      render: (text, record, index) => {
        const allStates = record.states || [];
        let total = 0;
        Object.keys(allStates).forEach((item) => {
          if (item !== OrderListState.total) {
            total += allStates[item];
          }
        })

        //总数
        const totalNum = total || 0;
        //已完成
        const doneNum = text[OrderListState.done] ? text[OrderListState.done] : 0;
        //完成率：＊＊总数为0
        const rate = totalNum !== 0 ? doneNum / totalNum : 0;
        let completeRate = rate * 100;
        //取两位小数
        completeRate = `${completeRate.toFixed(2).toString()}%`;
        return completeRate && completeRate;
      },
    }];


    //总条数
    const totalNum = areaMeta && areaMeta.result_count > 0 ? areaMeta.result_count : '0';
    //分页属性
    const pagination = {
      total: totalNum,
      pageSize: 20,
      current,
      onChange: onPageChange,
    };
    //显示or隐藏总条数
    const paginationShow = totalNum > 0 ? <Pagination className="ant-table-pagination" {...pagination} showTotal={total1 => `共 ${totalNum} 条`} /> : '';
    //标头
    return (
      <div>
        <Table rowKey={(record, index) => { return index }} dataSource={areaOrderList} columns={columns} pagination={false} />
        {
          paginationShow
        }
      </div>
    );
  };

  render() {
    const { sellerName } = this.state;
    const {
      renderStateDashboardComponent,
      renderAreaOrderStateComponent,
    } = this;
    return (
      <div className={`${style.component} con-body main-list`}>
        <Row>
          <Col>
            <HeaderTitle title={`${sellerName}商家列表 `} />
            {/* 渲染状态数据面板 */}
            <div className="bd-content">{renderStateDashboardComponent()}</div>
          </Col>
          <Col>
            {/* 渲染订单状态 */}
            <div className="bd-content">{renderAreaOrderStateComponent()}</div>
          </Col>
        </Row>
      </div>
    )
  }
}

function mapStateToProps({ operationOrder }) {
  return { operationOrder };
}

module.exports = connect(mapStateToProps)(Seller);
