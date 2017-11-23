import React, { Component, PropTypes } from 'react';
import { Button, Table, Pagination, Popconfirm } from 'antd';
import { Link } from 'dva/router';

const { stateTransform, utcToDate } = window.tempAppTool;
const List = ({ data, _meta, page, loading, onPageChange }) => {
// 表格的列
  const columns = [
    {
      title: '城市',
      dataIndex: 'city_name',
      key: 'city_name',
    },
    {
      title: '商户号',
      dataIndex: 'seller_no',
      key: 'seller_no',
      render: (text, record) => (
        <Link to={`/business/seller/list/detail?id=${record.id}`}>{text}</Link>
        ),
    },
    {
      title: '商户名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    }, {
      title: '法人姓名',
      dataIndex: 'biz_profile.legal_name',
      key: 'owner_name',
    }, {
      title: '商户状态',
      dataIndex: 'state',
      key: 'state',
      render: (text) => {
        return stateTransform('seller_state', text);
      },
    },
    {
      title: '签约状态',
      dataIndex: 'contract_state',
      key: 'contract_state',
      render: (text) => {
        const state = text === 100 ? '签约' : text === -100 ? '解约' : ''
        return state;
      },
    },
    {
      title: '注册手机',
      dataIndex: 'mobile',
      key: 'mobile',
      render: (text) => {
        return text || '';
      },
    },
    {
      title: '注册日期',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => {
        const _date = utcToDate(text);
        _date.time.length = 2;
        return `${_date.date.join('-')}  ${_date.time.join(':')}`;
      },
    }, {
      title: '审核状态',
      dataIndex: 'verify_state',
      key: 'verify_state',
      render: (text) => {
        return stateTransform('verify_state', text);
      },
    }, {
      title: '操作',
      dataIndex: 'verify_state',
      key: 'verify_state2',
      render: (text, record) => {
        const { seller } = record;
        return (
          <p>
            { text * 1 === 1 ? <Link style={{ color: '#00CFA1' }} to={`/business/seller/list/check?id=${record.id}`}>审核</Link> : '' }
          </p>
        )
      },
    },
  ];

  // 分页信息
  const pagination = {
    total: _meta.result_count || 0,
    current: page,
    pageSize: 10,
    onChange: onPageChange,
  };
  const total1 = _meta.result_count;
  return (
    <div>
      {/* 数据 */}
      <Table rowKey={(record, index) => { return index }} columns={columns} dataSource={data} loading={loading} pagination={false} />
      {/* 分页 */}
      <Pagination className="ant-table-pagination" {...pagination} showTotal={total1 => `共 ${total1} 条`} />
    </div>
  );
};
module.exports = List;
