import React, { Component, PropTypes } from 'react';
import { Button, Table, Pagination, Popconfirm } from 'antd';
import { Link } from 'dva/router';
import { stateTransform } from '../../../../../../utils/newUtils';
const { numberDateToStr, utcToDate } = window.tempAppTool;

const List = ({ data, _meta, page, loading, onPageChange }) => {
  const columns = [
    {
      title: '工号',
      dataIndex: 'code',
      key: 'code',
      render: (text, record) => (
        <Link style={{ color: '#00CFA1' }} to={`/team/employee/list/detail?id=${record.id}`}>{text}</Link>
      ),
    }, {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '手机号',
      dataIndex: 'mobile',
      key: 'mobile',
    },
    //  {
    //   "title": "岗位",
    //   "dataIndex": "field",
    //   "key": "field3"
    // },
    {
      title: '员工状态',
      dataIndex: 'state',
      key: 'state',
      render: (text) => {
        return stateTransform('work_state', text);
      },
    }, {
      title: '员工类型',
      dataIndex: 'work_type',
      key: 'state2',
      render: (text) => {
        return stateTransform('work_type', text);
        /*更改- 将员工类型中的状态转换工具替换成类型转换*/
      },
    }, {
      title: '入职时间',
      dataIndex: 'hired_date',
      key: 'hired_date',
      render: (text, record) => {
        if (text === 0) {
          return '';
        }

        return numberDateToStr(text);
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at_2',
      render: (text, record) => {
        if (text) {
          const date = window.tempAppTool.utcToDate(text).date;
          const time = window.tempAppTool.utcToDate(text).time;
          time.length = 2;
          return `${window.tempAppTool.sqlit(date, '-')} ${window.tempAppTool.sqlit(time, ':')}`
        }
      },
    },
    {
      title: '操作',
      dataIndex: null,
      key: null,
      render: (text, record) => {
        return (
          <p>
            <Link style={{ color: '#00CFA1' }} to={`/team/employee/list/edit?id=${record.id}`}>编辑</Link>
          </p>
        )
      },
    },
  ];
  const pagination = {
    total: _meta.result_count || 0,
    current: page,
    pageSize: 10,
    onChange: onPageChange,
  };

  const total1 = _meta.result_count;
  return (
    <div>
      <Table rowKey={record => record.code} columns={columns} dataSource={data} loading={loading} rowKey={record => record.id} pagination={false}/>
      <Pagination
        className="ant-table-pagination"
        {...pagination}
        showTotal={total1 => `共 ${total1} 条`}
      />
    </div>
  );
};


module.exports = List;
