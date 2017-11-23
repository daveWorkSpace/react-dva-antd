// 商铺列表
import React, { Component } from 'react';
import { Table } from 'antd';
import { dateFormatNew } from '../../../../utils/newUtils';

const columns = [{
        title: '店铺ID',
        dataIndex: 'id',
      }, {
        title: '店铺名称',
        dataIndex: 'name',
      }, {
        title: '联系人',
        dataIndex: 'linkman',
      }, {
        title: '联系电话',
        dataIndex: 'mobile',
      }, {
        title: '店铺地址',
        dataIndex: 'address',
      }, {
        title: '创建时间',
        dataIndex: 'created_at',
        render:function (text, record) {
          return (
            <span>{dateFormatNew(text)}</span>
          )
        },
      }]

const shopInfo = (params) => {
    const { shopTitle, shopList } = params;
    //表格分页设置
    const pagination = {
        total: shopList._meta.result_count,
        showTotal: (total) => {
            return `总共 ${total} 条`;
        },
        onShowSizeChange: (current, pageSize) => {
        },
        onChange: (current) => {
        },
    }
    return (
        <div className="bd-content">
            <div className="content-title">{ shopTitle }</div>
            <Table
                rowKey={(record, index) => { return index }}
                columns={ columns }
                dataSource={ shopList.data }
                pagination={ pagination }
            />
        </div>
    )
}

export default shopInfo;

