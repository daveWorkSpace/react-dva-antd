
import React from 'react';
import { Table, Badge, Pagination } from 'antd';
import { Link } from 'dva/router';
import { OrderListState, OrderParams } from './../../exports';

const { rgReg, requestPagerSize, requestPageNumber } = OrderParams;

const {
  stateTransform,
  utcToDate,
} = window.tempAppTool;// 全局变量 来自aoao-core-api-service/src/utils/utils.js

const columns = [{
  title: '订单编号',
  dataIndex: 'data',
  key: 'id',
  render: (text, record) => (
    <span>
      <Link to={{ pathname: '/operation/order/close/detail', query: { orderId: record.id, shipmentId: record.shipment_id } }}>{ record.org_order_id }</Link>
    </span>
  ),
}, {
  title: '商家名称',
  dataIndex: 'shipment',
  key: 'seller_name',
  render: (text, record, index) => { return text.seller.name; },
}, {
  title: '业务模式',
  dataIndex: 'business-pattern',
  key: 'business-pattern',
  render: (text, record, index) => { return text.supply_vendor_info.name; },
}, {
  title: '配送区域',
  dataIndex: 'area',
  key: 'area',
  render: (text, record, index) => { return text.distance / 1000; },
}, {
  title: '配送站',
  dataIndex: 'delivery-stand',
  key: 'delivery-stand',
  render: (text, record, index) => { return text.distance / 1000; },
}, {
  title: '配送距离(km)',
  dataIndex: 'shipment',
  key: 'distance',
  render: (text, record, index) => { return text.distance / 1000; },
}, {
  title: '订单状态',
  dataIndex: 'state',
  key: 'state',
  render: (text, record, index) => { return text.shipping_fee / 100; },
}, {
  title: '订单金额（元）',
  dataIndex: 'order-money',
  key: 'order-money',
  render: (text, record, index) => { return stateTransform('pay_type', text.pay_type); },
}, {
  title: '代付商家',
  dataIndex: 'pay-merchant',
  key: 'pay-merchant',
  render: (text, record, index) => {
    const orderState = text === OrderListState.exception ? '异常' : '其他';
    return orderState;
  },
}, {
  title: '代收顾客',
  dataIndex: 'collection-client',
  key: 'collection-client',
  render: (text, record, index) => { return text.o3_order_amount / 100; },
}, {
  title: '下单时间',
  dataIndex: 'created_at',
  key: 'created_at',
  render: (text, record, index) => {
    const date = utcToDate(text);
    date.time.length = 2;
    return `${date.date.join('-')}  ${date.time.join(':')}`;
  },
}, {
  title: '期望送达',
  dataIndex: 'shipment',
  key: 'plan_shipping_time',
  render: (text, record, index) => {
    const date = utcToDate(text.shipping_time);
    date.time.length = 2;
    return `${date.date.join('-')}  ${date.time.join(':')}`;
  },
}, {
  title: '操作',
  dataIndex: 'operate',
  key: 'operate',
  render: (text, record, index) => {

  },
}];

class StateTable extends React.Component {
  constructor(props) {
    super();

    //初始化商家列表---状态
    this.state = {
      closeOrderList: props.closeOrderList,
      closeMeta: props.closeMeta,
      current: props.current,
    };

    //初始化商家列表－方法
    this.private = {
      onPageChange: props.onPageChange,
    }
  }

  componentWillReceiveProps = (nextProps) => {
    //update 商家列表
    this.setState({
      closeOrderList: nextProps.closeOrderList,
      closeMeta: nextProps.closeMeta,
      current: nextProps.current,
    });
  };

  //update 页码
  onPageChange = (page) => {     //当前页
    this.setState({ current: page });
    this.private.onPageChange(page);
  };

  render() {
    const { onPageChange } = this;
    const { closeOrderList, closeMeta, current } = this.state;
    const totalNum = closeMeta && closeMeta.result_count > 0 ? closeMeta.result_count : 0;
    const pagination = {
      total: totalNum,
      current,
      pageSize: requestPagerSize,
      onChange: onPageChange,
    };
    const paginationShow = totalNum > 0 ? <Pagination className="ant-table-pagination" {...pagination} showTotal={total1 => `共 ${totalNum} 条`} /> : '';
    return (
      <div>
        {/*<Table dataSource={closeOrderList} columns={columns} pagination={false} />*/}
        <Table rowKey={record => record.org_order_id} dataSource={closeOrderList} columns={columns} pagination={false} />
        { paginationShow }
      </div>
    );
  }
}
module.exports = StateTable;
