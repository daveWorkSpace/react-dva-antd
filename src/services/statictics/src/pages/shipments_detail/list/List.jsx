import React, {Component, PropTypes} from 'react';
import {Button, Table, Pagination } from 'antd';
import { Link } from 'dva/router';
import { isEmptyObject } from '../../../../../../utils/newUtils';
const {stateTransform, utcToDate, numberDateToStr} =  window.tempAppTool;
const List = ({ data, _meta, page, loading, onPageChange}) => {


  const columns = [
    {
      "title": "订单编号",
      "dataIndex": "org_order_id",
      "key": "org_order_id",
      render: (text, record) => (
        <Link to={"/statictics/shipments_detail/list/detail?id=" + record.id}>{record.org_order_id}</Link>
      )
    }, {
      "title": "商家名称",
      "dataIndex": "seller.name",
      "key": "seller.name",
      'width':100
    }, {
      'title': '供应商',
      'dataIndex': 'supply_vendor_info',
      render:(text, record)=>{
        return (
          <span>{record.supply_vendor_info?record.supply_vendor_info.name:''}</span>
        )
      }
    },{
      "title": "区域",
      "dataIndex": "area.name",
      "key": "area.name"
    },{
      "title": "骑士",
      "dataIndex": "courier",
      "key": "courier_key",
      render: (text) => {
        if(text) {
          return text.name;
        }
      }
    }, {
      "title": "配送距离（km）",
      "dataIndex": "distance",
      "key": "distance",
      render: (text) => {

        let text1 = text / 1000 ;
        text1 = text1.toFixed(3)

        return text1;
      }
    }, {
      "title": '配送费（元）',
      "dataIndex": "shipping_fee",
      "key": "shipping_fee",
      render: (text) => {

        let text1 = text / 100;
        text1 = text1.toFixed(2)
        return text1;
      }
    }, {
      "title": "骑士提成（元）",
      "dataIndex": "shipping_fee_courier_rate",
      "key": "percentage",
      render: (text, record) => {
       let text1 = (record.shipping_fee_courier + record.tip_fee_courier) / 100
        text1 = text1.toFixed(2)
        return text1;
      }
    }, {
      "title": "佣金（元）",
      "dataIndex": "shipping_fee_courier_rate",
      "key": "Commission",
      render: (text, record) => {
        let text1 = (record.shipping_fee_vendor + record.tip_fee_vendor ) / 100
        text1 = text1.toFixed(2)
        return text1;
      }
    }, {
      "title": "结算方式",
      "dataIndex": "pay_type",
      "key": "Modes",
      render: (text) => {
        return stateTransform('pay_type',text);
      }
    }, {
      "title": "配送状态",
      "dataIndex": "delivery_state",
      "key": "delivery_state",
      render: (text) => {
        return stateTransform('delivery_state',text);
      }
    }, {
      "title": "配送时效（min）",
      "dataIndex": "created_at",
      "key": "created_at_key",
      render: (text,record) => {
        if (record.delivery_state === 100) {
          let plan_date = numberDateToStr(record.plan_shipping_date).split('-');
          let plan_time = record.plan_shipping_time.split(':');
          const _done = new Date(record.done_at);
          plan_date[1] = plan_date[1] - 1;
          const _plan = new Date(...plan_date,...plan_time);
          const _showMins = ((_done -_plan) / 1000 / 60).toFixed(1) * 1;
          return _showMins > 0 ? _showMins : `(${_showMins * -1})`;
        } else {
          return '--';
        };
      }
    }, {
      "title": "订单金额（元）",
      "dataIndex": "o3_order_amount",
      "key": "id2",
      render: (text) => {
        let text1 = text / 100;
        text1 = text1.toFixed(2)
        return text1;
      }
    },{
      "title": "代付商家 (元) ",
      "dataIndex": "extra_services.payment",
      "key": "extra_services.payment",
      render: (text) => {
        if(text && !isEmptyObject(text)) {
          return (Number(text.amount)/100).toFixed(2);
        } else {
          return '0.00';
        }
      }
    }, {
      "title": "代收顾客 (元) ",
      "dataIndex": "extra_services.cod",
      "key": "extra_services.cod",
      render: (text) => {
        if(text && !isEmptyObject(text)) {
          return (Number(text.amount)/100).toFixed(2);
        } else {
          return '0.00';
        }
      }
    },{
      "title": "下单时间",
      "dataIndex": "created_at",
      "key": "created_at",
      render: (text) => {

        const _date = utcToDate(text);
        _date.time.length =2;
        return `${_date.date.join('-')}  ${_date.time.join(':')}`;
      },
      sorter: (a, b) => { return new Date(a.created_at) - new Date(b.created_at)},
    }, {
      "title": "期望送达",
      "dataIndex": "plan_shipping_date",
      "key": "plan_shipping_date",
      render: (text,record) => {
        return `${numberDateToStr(text)}  ${record.plan_shipping_time}`;
      }
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
      <Table rowKey={record => record.org_order_id}  columns={columns} dataSource={data} loading={loading} rowKey={record => record.id} pagination={false}/>
      <Pagination
        className="ant-table-pagination"
        {...pagination}
        showTotal={total1 => `共 ${total1} 条`}
      />
    </div>
  );

};

module.exports =  List;
