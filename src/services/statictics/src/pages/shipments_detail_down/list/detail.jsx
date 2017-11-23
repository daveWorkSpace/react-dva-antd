import React, { Component, PropTypes } from 'react';
import { Form, Table, Row, Col, Popconfirm, Button } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { authorize } from '../../../../../../application';

const { stateTransform, numberDateToStr, utcToDate } = window.tempAppTool;

const [FormItem] = [Form.Item];
const event_dict = {
  created: '创建',
  accepted: '接单',
};

const reasons = {};

const View = ({ staticticsShipmentsDetail, dispatch }) => {
  const { shipment_detail, shipment_log = { data: [] }, shipment_area } = staticticsShipmentsDetail;
  const { order_info = {}, vendor_info = {}, shop_info = {} } = shipment_detail;
  const closed_type = reasons[shipment_detail.closed_type];
  const vendor_name = authorize.vendor.name;
  const courier = shipment_detail.courier || {};
  let [shipping_time, created_at] = ['', ''];
  // 服务商提成
  const _local_calc_fee_vendor = (shipment_detail.shipping_fee_vendor + shipment_detail.tip_fee_vendor) / 100;
  // 骑士提成
  const _local_calc_fee_courier = (shipment_detail.shipping_fee_courier + shipment_detail.tip_fee_courier) / 100;

  if (shipment_detail.created_at && shipment_detail.created_at.length !== 0) {
    const _date1 = utcToDate(shipment_detail.created_at);
    _date1.time.length = 2;
    created_at = `${_date1.date.join('-')}  ${_date1.time.join(':')}`;
    shipping_time = `${numberDateToStr(shipment_detail.plan_shipping_date)}  ${shipment_detail.plan_shipping_time}`;
  }
  const itemLayout = { '4_18': { labelCol: { span: 4 }, wrapperCol: { span: 18 } } };
  const columns = [
    {
      title: '运单状态',
      dataIndex: 'event_state',
      key: 'event_state',
      render: (text, record) => {
        return stateTransform('event_name', record.event)
      },
    },
    {
      title: '操作',
      dataIndex: 'event',
      key: 'event',
      render: (text) => {
        return stateTransform('state_operation', text)
      },
    }, {
      title: '操作时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text, record) => {
        const _result = utcToDate(text);
        _result.time.length = 2;
        return `${_result.date.join('-')}  ${_result.time.join(':')}`;
      },
    }, {
      title: '操作人(手机号)',
      dataIndex: 'operator',
      key: 'operator',
      render: (text, record) => {
        if (record.event === 'created') {
          return `${shipment_detail.consignor_name}(${shipment_detail.consignee_mobile})` || `(${shipment_detail.consignor.tel})`;
        }
        if (record.event === 'confirmed' && (record.operator_info === '' || record.operator_info === undefined)) {
          return '系统自动操作';
        }
        if (record.operator_info) {
          return `${record.operator_info.name}(${record.operator_info.mobile})`;
        }
        if (record.courier_info) {
          return `${record.courier_info.name}(${record.courier_info.mobile})`;
        }
      },
    }, {
      title: '备注',
      dataIndex: 'note',
      key: 'note',
    },
  ];

  return (
    <div className="con-body">
      <div className="bd-header">
        <Form layout="horizontal" className="main-form">
          <h3 className="form-divider-header">订单基本信息</h3>
          <Row type="flex" justify="center">
            <Col sm={10}>
              <FormItem label="订单编号" {...itemLayout['4_18']}>
                {shipment_detail.org_order_id}
              </FormItem>
              <FormItem label="商家名称" {...itemLayout['4_18']}>
                {shipment_detail.consignor_name}
              </FormItem>
              <FormItem label="商品类型" {...itemLayout['4_18']}>
                {stateTransform('seller_type', shipment_detail.seller_type)}
              </FormItem>
              <FormItem label="商家电话" {...itemLayout['4_18']}>
                {shipment_detail.consignor_mobile || shipment_detail.consignor_tel}
              </FormItem>
              <FormItem label="店铺地址" {...itemLayout['4_18']}>
                {shipment_detail.consignor_address} {shipment_detail.consignor_address_detail}
              </FormItem>
              <FormItem label="配送距离" {...itemLayout['4_18']}>
                {shipment_detail.local_calc_distance}km
              </FormItem>
              <FormItem label="订单备注" {...itemLayout['4_18']}>
                {shipment_detail.delivery_note}
              </FormItem>
              <FormItem label="订单金额" {...itemLayout['4_18']}>
                {shipment_detail.local_calc_o3_order_amount}元
              </FormItem>
              <FormItem label="服务商佣金" {...itemLayout['4_18']}>
                {_local_calc_fee_vendor || 0 }元
              </FormItem>
              <FormItem label="关闭原因" {...itemLayout['4_18']}>
                {shipment_detail.closed_note}
              </FormItem>
              <FormItem label="小费" {...itemLayout['4_18']}>
                {shipment_detail.local_calc_tip_fee}元
              </FormItem>
            </Col>
            <Col sm={10}>
              <FormItem label="期望送达" {...itemLayout['4_18']}>
                {shipping_time}
              </FormItem>
              <FormItem label="下单时间" {...itemLayout['4_18']}>
                {created_at}
              </FormItem>
              <FormItem label="顾客姓名" {...itemLayout['4_18']}>
                {shipment_detail.consignee_name}
              </FormItem>
              <FormItem label="顾客电话" {...itemLayout['4_18']}>
                {shipment_detail.consignee_mobile || shipment_detail.consignee_tel}
              </FormItem>
              <FormItem label="顾客地址" {...itemLayout['4_18']}>
                {shipment_detail.consignee_address}
              </FormItem>
              <FormItem label="物流商" {...itemLayout['4_18']}>
                {vendor_name}
              </FormItem>
              <FormItem label="所属区域" {...itemLayout['4_18']}>
                {shipment_area.name}
              </FormItem>
              <FormItem label="配送费" {...itemLayout['4_18']}>
                {shipment_detail.local_calc_shipping_fee} 元
              </FormItem>
              <FormItem label="结算方式" {...itemLayout['4_18']}>
                {stateTransform('pay_type', shipment_detail.pay_type)}
              </FormItem>
              <FormItem label="骑士提成" {...itemLayout['4_18']}>
                {_local_calc_fee_courier || 0} 元
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>

      <div className="bd-content">
        <Form layout="horizontal" className="main-form">
          <h3 className="form-divider-header">物流追踪</h3>
          <Row type="flex" justify="center">
            <Col sm={24}>
              <Col sm={6}>运单号:{shipment_detail.id}</Col>
              <Col sm={4}>配送区域：{shipment_area.name} </Col>
              <Col sm={4}>骑士：{courier.name}</Col>
              <Col sm={4}>联系电话：{courier.mobile}</Col>
            </Col>
          </Row>
          <br />
          <Row type="flex" justify="center">
            <Col sm={22}>
              <Table rowKey={(record, index) => { return index }} columns={columns} dataSource={data} />
            </Col>
          </Row>
          <Row type="flex" justify="center" align="top">
            <Col sm={5}>
              <Button ><Link to="/statictics/shipments_detail/list">返回</Link></Button>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};

function mapStateToProps({ staticticsShipmentsDetail }) {
  return { staticticsShipmentsDetail };
}

module.exports = connect(mapStateToProps)(View);
