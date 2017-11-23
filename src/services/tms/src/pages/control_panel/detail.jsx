import React, { Component, PropTypes } from 'react';
import { Form, Table, Row, Col, Modal, Button } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { isEmptyObject, prctoMinute } from '../../../../../utils/newUtils';
import { CONTROL_PANEL } from '../../ActionsName';
import { authorize } from '../../../../../application';

const { stateTransform, utcToDate, numberDateToStr } = window.tempAppTool;
const [FormItem, confirm] = [Form.Item, Modal.confirm];

const reasons = {};
/**
 *
 *
 * @param {any} { tmsControlPanel, dispatch }
 * @returns
 */
const View = ({ tmsControlPanel, dispatch }) => {
    // 从model获取details信息
  const { shipment_detail, pushOrderDetails = { data: [] }, shipment_log = { data: [] }, shipment_area } = tmsControlPanel;
  const { order_info = {}, vendor_info = {}, shop_info = {} } = shipment_detail;
    // 关闭类型
  const closed_type = reasons[shipment_detail.closed_type];
    // 服务商名字
  const vendor_name = authorize.vendor.name;
    // 骑士
  const courier = shipment_detail.courier || {};
  let [shipping_time, created_at] = ['', ''];

  if (shipment_detail.created_at && shipment_detail.created_at.length !== 0) {
    const _date1 = utcToDate(shipment_detail.created_at);
    _date1.time.length = 2;
    created_at = `${_date1.date.join('-')}  ${_date1.time.join(':')}`;
    shipping_time = `${numberDateToStr(shipment_detail.plan_shipping_date)}  ${shipment_detail.plan_shipping_time}`;
  }
  const _local_calc_fee_vendor = (shipment_detail.shipping_fee_vendor + shipment_detail.tip_fee_vendor) / 100;
  const _local_calc_fee_courier = (shipment_detail.shipping_fee_courier + shipment_detail.tip_fee_courier) / 100;
  const data = shipment_log.data;

    //推单数据
  const push_order_details = pushOrderDetails.data || [];

  /*if (data) {
    data = data.reverse();
  }*/
    // 商家姓名
  let _seller_name = '';

  if (shipment_detail.seller) {
    _seller_name = shipment_detail.seller.name
  }
    // 关闭运单
  function handleConfirm() {
    const { id, error_note, error_flag } = shipment_detail;
    dispatch({
      type: CONTROL_PANEL.shipments.close, //关闭运单
      payload: {
        close: {
          shipment_ids: [id],
          closed_note: error_note,
          closed_type: error_flag,
        },
        id,
      },
    });
  }
    // 表格的列
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

    // 表格的列
  const pushOrderColumns = [
    {
      title: '推送时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text, record) => {
        const _result = prctoMinute(text, 3);
        return _result;
      },
      sorter: (a, b) => {
        const result_a = prctoMinute(a.created_at, 3);
        const result_b = prctoMinute(b.created_at, 3);
        const time_a = (new Date(result_a)).getTime();
        const time_b = (new Date(result_b)).getTime();
        return time_a - time_b
      },
    },
    {
      title: '骑士',
      dataIndex: 'courier',
      key: 'courier',
      render: (text, record) => {
        return text && text.name
      },
    }, {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      render: (text, record) => {
        switch (text) {
          case 100:
            return '已完成';
          case -100:
            return '已关闭';
          case 50:
            return '进行中';
          default:
            return '异常';
        }
      },
      sorter: (a, b) => {
        return a.state - b.state
      },
    }, {
      title: '有效时间(min)',
      dataIndex: 'expired_ttl',
      key: 'expired_ttl',
      render: (text, record) => {
        return text ? (Number(text) / 60).toFixed(0) : '';
      },
    }, {
      title: '过期时间',
      dataIndex: 'expired_at',
      key: 'expired_at',
      render: (text, record) => {
        const _result = prctoMinute(text, 3);
        return _result;
      },
    }, {
      title: '关闭时间',
      dataIndex: 'closed_at',
      key: 'closed_at',
      render: (text, record) => {
        if (record.state === -100) {
          const _result = prctoMinute(text, 3);
          return _result;
        }
        return ''
      },
    }, {
      title: '是否超时',
      dataIndex: 'overtime',
      key: 'overtime',
      render: (text, record) => {
        const result = record.error_flag === 1 ? '是' : record.error_flag === 2 ? '已分配' : record.error_flag === 0 ? '否' : ''
        return result;
      },
    }, {
      title: '关闭原因',
      dataIndex: 'closed_note',
      key: 'closed_note',
      render: (text, record) => {
        const result = record.closed_type === 10 ? '重新计算' : record.closed_type === 20 ? '其他人已接单' : record.closed_type === 30 ? '运单关闭' : ''
        return result;
      },
    },
  ];

    // 布局配置参数
  const itemLayout = { '4_18': { labelCol: { span: 4 }, wrapperCol: { span: 18 } } };

  let text = '';
  if (shipment_detail.error_flag == 1) {
    text = '当前由于商家原因异常关闭订单，将正常收取商家配送费，是否确认关闭该订单?'
  } else if (shipment_detail.error_flag == 2) {
    text = '当前由于骑士原因异常关闭订单，将不收取商家配送费，是否确认关闭该订单？'
  }

    // 关闭订单的弹出框
  function showConfirm() {
    confirm({
      title: '您是否确认要关闭该订单',
      content: text,
      onOk() {
        handleConfirm();
      },
      onCancel() { },
    });
  }

  return (
    <div className="con-body">
      <div className="bd-header">
        <Form layout="horizontal" className="main-form">
          <h3 className="form-divider-header" style={{ margin: '0px' }}>订单基本信息</h3>
          <Row type="flex" justify="center">
            <Col sm={10}>
              <FormItem label="订单编号" {...itemLayout['4_18']}>
                {shipment_detail.org_order_id}
              </FormItem>
              <FormItem label="条形编码" {...itemLayout['4_18']}>
                {shipment_detail.barcode}
              </FormItem>
              <FormItem label="业务模式" {...itemLayout['4_18']}>
                {_seller_name}
              </FormItem>
              <FormItem label="中转仓" {...itemLayout['4_18']}>
                {_seller_name}
              </FormItem>
              <FormItem label="发货信息" {...itemLayout['4_18']}>
                {_seller_name}
              </FormItem>
              <FormItem label="商家名称" {...itemLayout['4_18']}>
                {_seller_name}
              </FormItem>
              <FormItem label="商家联系人" {...itemLayout['4_18']}>
                {stateTransform('seller_type', shipment_detail.seller_type)}
              </FormItem>
              <FormItem label="商家电话" {...itemLayout['4_18']}>
                {shipment_detail.consignor_mobile || shipment_detail.consignor_tel}
              </FormItem>
              <FormItem label="发货地址" {...itemLayout['4_18']}>
                {shipment_detail.consignor_address} {shipment_detail.consignor_address_detail}
              </FormItem>
              <FormItem label="代付商家" {...itemLayout['4_18']}>
                {shipment_detail.extra_services && shipment_detail.extra_services.payment && !isEmptyObject(shipment_detail.extra_services.payment) ? (Number(shipment_detail.extra_services.payment.amount) / 100).toFixed(2) : '0.00'} 元
                            </FormItem>
            </Col>
            <Col sm={10}>
              <FormItem label="期望送达" {...itemLayout['4_18']}>
                {shipping_time}
              </FormItem>
              <FormItem label="下单时间" {...itemLayout['4_18']}>
                {created_at}
              </FormItem>
              <FormItem label="配送区域" {...itemLayout['4_18']}>
                {created_at}
              </FormItem>
              <FormItem label="揽收站" {...itemLayout['4_18']}>
                {shipment_detail.consignee_name}
              </FormItem>
              <FormItem label="收货信息" {...itemLayout['4_18']}>
                {shipment_area.name}
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
              <FormItem label="配送距离" {...itemLayout['4_18']}>
                {shipment_detail.consignee_address}
              </FormItem>
              <FormItem label="代收顾客" {...itemLayout['4_18']}>
                {shipment_detail.extra_services && shipment_detail.extra_services.cod && !isEmptyObject(shipment_detail.extra_services.cod) ? (Number(shipment_detail.extra_services.cod.amount) / 100).toFixed(2) : '0.00'} 元
                            </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <div className="bd-content">
        <h3 className={`form-divider-header ${style.tableLabel}`}>订单明细</h3>
        <Row type="flex" justify="center">
          <Col sm={10}>
            <FormItem label="备注" {...itemLayout['6_18']}>
                            123123213123131
                        </FormItem>
            <FormItem label="货品类型" {...itemLayout['6_18']}>
                            外卖美食
                        </FormItem>
          </Col>
          <Col sm={10}>
            <FormItem label="订单金额" {...itemLayout['6_18']}>
                            34.50元
                        </FormItem>
          </Col>
        </Row>
        <p>以下为货品详情</p>
        <Table rowKey={(record, index) => { return index }} columns={DISTRIBUTION_ORDER_DETAIL_COLUMNS} dataSource={[]} />
        <p>以下为配送费支付信息</p>
        <Row type="flex" justify="center">
          <Col sm={10}>
            <FormItem label="配送费" {...itemLayout['6_18']}>
                            123123213123131
                        </FormItem>
            <FormItem label="支付方式" {...itemLayout['6_18']}>
                            外卖美食
                        </FormItem>
          </Col>
          <Col sm={10}>
            <FormItem label="小费" {...itemLayout['6_18']}>
                            34.50元
                        </FormItem>
            <FormItem label="结算方式" {...itemLayout['6_18']}>
                            34.50元
                        </FormItem>
          </Col>
        </Row>
      </div>
      <div className="bd-content">
        <h3 className={`form-divider-header ${style.tableLabel}`}>订单追踪</h3>
        <p>配送单号： 23412314341242314124</p>
        <Table rowKey={(record, index) => { return index }} columns={DISTRIBUTION_ORDER_TRACE_COLUMNS} dataSource={[]} />
      </div>
    </div>
  );
};
/*
 {shipment_detail.delivery_state !== -50
 ? ''
 : <Col sm={5}><Popconfirm placement="topRight" title={text} onConfirm={handleConfirm}> <Button>关闭</Button> </Popconfirm></Col>
 }

 */
function mapStateToProps({ tmsControlPanel }) {
  return { tmsControlPanel };
}

module.exports = connect(mapStateToProps)(View);
