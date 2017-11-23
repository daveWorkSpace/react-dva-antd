import React, {Component, PropTypes} from 'react';
import {Button, Table, Icon } from 'antd';
import { Link } from 'dva/router';

//引入枚举值
import { DOWNLOAD_DAILY_DETAIL, DOWNLOAD_MONTHLY_DETAIL } from '../core/enumerate.js'

const {stateTransform, utcToDate, numberDateToStr} =  window.tempAppTool;
const List = ({ shipmentsDaily, pagination, downloadFile, type}) => {

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
          <a className="down_link" onClick={() => downloadFile(text)}>
            <Icon style={{fontWeight:'700',fontSize:16}}  type="download" />
          </a>
      )
    }
  ];

  return (
    <div>
      <Table rowKey={(record, index) => { return index }} columns={columns} dataSource={shipmentsDaily.data} pagination={pagination} />
    </div>
  );


};

module.exports =  List;
