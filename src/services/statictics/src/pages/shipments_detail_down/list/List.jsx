import React, {Component, PropTypes} from 'react';
import {Button, Table, Pagination,Icon } from 'antd';
import { Link } from 'dva/router';
const {stateTransform, utcToDate, numberDateToStr} =  window.tempAppTool;
const List = ({ data, down_info, _meta, page, loading, onPageChange,onFileDownUrl}) => {

  function downLoadFile (fileName){
   onFileDownUrl(fileName)
  }

  const columns = [
    {
      "title": "日期",
      "dataIndex": "day",
      "key": "day",
      width: '25%',
      render: (text) => {
        return numberDateToStr(text);
      }
    }, {
      "title": "总订单量",
      "dataIndex": "total",
      "key": "total",
      width: '25%',
    },
    {
      "title": "更新时间",
      "dataIndex": "updated_at",
      "key": "updated_at",
      width: '25%',
      render: (text,record) => {
        const _date = utcToDate(text);
        _date.time.length = 2;
        return `${_date.date.join('-')}  ${_date.time.join(':')}`;
      },
      // sorter: (a, b) => { return new Date(a.created_at) - new Date(b.created_at)},
    },
    {
      "title": "操作",
      "dataIndex": "filename",
      "key": "filename",
      width: '25%',
      render: (text, record) => (
          <a  className="down_link" onClick={downLoadFile.bind(this,text)}>
            <Icon style={{fontWeight:'700',fontSize:16}}  type="download" />
          </a>
      )
    }
  ];
  const pagination = {
    total: _meta.result_count || 0,
    current: page,
    pageSize: 10,
    onChange: onPageChange
  };
  let total1 = _meta.result_count;
  return (
    <div>
      <Table rowKey={(record, index) => { return index }} columns={columns} dataSource={data} loading={loading} pagination={false}/>
      <Pagination
        className="ant-table-pagination"
        {...pagination}
        showTotal={total1 => `共 ${total1} 条`}
      />
    </div>
  );


};

module.exports =  List;
