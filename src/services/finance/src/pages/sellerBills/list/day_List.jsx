import React, {Component, PropTypes} from 'react';
import {Button, Table, Pagination, Popconfirm } from 'antd';
import { Link } from 'dva/router';

const List = ({data,_meta, total,page, dayOnPageChange,current,loading, onShowItem, onEditItem}) => {
// 表格的列
  const columns = [
  {
    "title": "商家名称",
    "dataIndex": "seller.name",
    "key": "seller.name",
    render: (text, record) => (
      <Link to={"/statictics/shipments_detail/list"}>{text}</Link>
    )
  }, {
    "title": "成交订单量",
    "dataIndex": "finish_order",
    "key": "finish_order"
  }, {
    "title": "结算总额(元)",
    "dataIndex": "settlement_amount",
    "key": "settlement_amount",
      render: (text) => {

        let text1 = text/100;
        text1 = text1.toFixed(2)
        return text1;
      }
  }, {
    "title": "账户余额结算(元)",
    "dataIndex": "balance_pay_amount",
    "key": "balance_pay_amount",
      render: (text) => {
        let text1 = text/100;
        text1 = text1.toFixed(2)
        return text1;
      }
  }, {
    "title": "现金结算(元)",
    "dataIndex": "cash_pay_amount",
    "key": "cash_pay_amount",
      render: (text) => {
        let text1 = text/100;
        text1 = text1.toFixed(2)
        return text1;
      }
  }, {
    "title": "配送费(元)",
    "dataIndex": "shipping_fee",
    "key": "shipping_fee",
      render: (text) => {
        let text1 = text/100;
        text1 = text1.toFixed(2)
        return text1;
      }
  }, {
    "title": "手续费(元)",
    "dataIndex": "procedure_fee",
    "key": "procedure_fee",
      render: (text) => {
        let text1 = text/100;
        text1 = text1.toFixed(2)
        return text1;
      }
  }, {
    "title": "小费(元)",
    "dataIndex": "tip_fee",
    "key": "tip_fee",
      render: (text) => {
        let text1 = text/100;
        text1 = text1.toFixed(2)
        return text1;
      }
  }
];
// 分页信息
  const pagination = {
    total: _meta.result_count || 0,
    current: page,
    pageSize: 8,
    onChange: dayOnPageChange
  };
// 日账单的总条数
  let total1 = _meta.result_count;
  return (
    <div>
      <Table rowKey={(record, index) => { return index }} columns={columns} dataSource={data}  loading={loading}  pagination={false}/>
      <Pagination
        className="ant-table-pagination"
        {...pagination}
        showTotal={total1 => `共 ${total1} 条`}
      />
    </div>
  );
};

module.exports =  List;
