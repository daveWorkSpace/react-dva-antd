import React, {Component, PropTypes} from 'react';
import {Button, Table, Pagination, Popconfirm} from 'antd';
import {Link} from 'dva/router';
const {numberDateToStr} = window.tempAppTool;

const List = ({data, _meta, page, loading, onPageChange}) => {

  const columns = [
    {
      "title": "商家名称",
      "dataIndex": "seller.name",
      "key": "seller_name"
    },
    {
      "title": "总接单量",
      "dataIndex": "total",
      "key": "total_orders"
    }, {
      "title": "完成订单量",
      "dataIndex": "done_count",
      "key": "Commission"
    }, {
      "title": "取消订单量",
      "dataIndex": "closed_count.total",
      "key": "Modes"
    }, {
      "title": "超时取消订单量",
      "dataIndex": "closed_count.overtime_closed_count",
      "key": "actual",
      render: (text,record) => {
        let num_50 = record.closed_count['50'];
        let num_51 = record.closed_count['51'];
        let num_52 = record.closed_count['52'];
        let overtime_total = num_50 + num_51 + num_52;
        return overtime_total

      }

    }, {
      "title": "异常取消订单量",
      "dataIndex": "closed_count.total",
      "key": "installment",
      render: (text,record) => {
        let num_50 = record.closed_count['50'];
        let num_51 = record.closed_count['51'];
        let num_52 = record.closed_count['52'];
        let overtime_total = num_50 + num_51 + num_52;
        return text - overtime_total

      }
    }
  ];

  const pagination = {
    total: _meta.result_count || 0,
    current: page,
    pageSize: 8,
    onChange: onPageChange
  };

  let total1 = _meta.result_count;
  return (
    <div>
      <Table rowKey={record => record.seller.name}  columns={columns} dataSource={data} pagination={false}/>
      <Pagination
        className="ant-table-pagination"
        {...pagination}
        showTotal={total1 => `共 ${total1} 条`}
      />
    </div>
  );
};

module.exports = List;
