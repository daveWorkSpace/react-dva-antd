import dot from 'dot-prop';
import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { hashHistory, Link } from 'dva/router';
import { Form, Row, Col, Button, Tooltip, Icon, Table, Modal } from 'antd';
import { OrderManage } from '../../actions';
import { authorize } from '../../../application';
import { utcTo, isEmptyObject } from '../../../utils/newUtils';
import { VendorOrderState } from '../../../application/define';
import {
  VENDOR_ORDER_DETAILS_INFO_COLUMNS,
  VENDOR_ORDER_TRACE_INFO_COLUMNS,
} from './enumerate'
import style from './style.less';

const { stateTransform, numberDateToStr, utcToDate } = window.tempAppTool;
const FormItem = Form.Item;
const warning = Modal.warning;
const { getOrderDetails, getOrderTrackLogs } = OrderManage;
const itemLayout = { '6_18': { labelCol: { span: 6 }, wrapperCol: { span: 18 } } };

class OrderDetails extends Component {
  constructor(props) {
    super();
    const { dispatch, OrderManage } = props;
    this.state = {
      vendorOrderDetails: OrderManage.vendorOrderDetails,
      vendorOrderTrackLogs: OrderManage.vendorOrderTrackLogs,
    }

    this.private = {
      dispatch,
      location: props.location,
      vendorId: authorize.auth.vendorId,
      cityCode: dot.get(authorize.vendor, 'city.code'),
      page: 1,           //订单追踪页数
      limit: 10,
      orderId: '',    //取操作日志的参数订单id
      getOrderId: false,
      event: '',
      // 本地生活圈事件
      localLifeEvent: 'seller-order-published,vendor-order-confirmed,shipment-accepted,shipment-arrived,shipment-error,shipment-pickup,shipment-done,shipment-reassigned,shipment-recover-state,seller-order-closed,vendor-order-closed',
      // 落地配不带存储
      noStorageEvent: 'seller-order-published,stock-order-confirmed,stock-order-stock-in,stock-order-error,stock-order-assigned,shipment-pickup,shipment-error,shipment-done,shipment-recover-state,seller-order-closed,vendor-order-closed,stock-order-redispatch,stock-order-closed',
      // 同城快递
      cityEvent: 'seller-order-published,vendor-order-confirmed,shipment-accepted,shipment-error,stock-order-stock-in,stock-order-done,stock-order-stock-in,stock-order-done,stock-order-stock-in,stock-order-assigned,shipment-pickup,shipment-error,shipment-reassigned,shipment-recover-state,seller-order-closed,vendor-order-closed,stock-order-redispatch,stock-order-closed,shipment-done',
    }
  }

  componentWillMount() {
    const { location, dispatch } = this.private;
    const orderId = location.query.id;
    if (orderId) {
      const params = {
        orderId,
      }
      // 获取运单详情
      dispatch({ type: getOrderDetails, payload: params })
    } else {
      warning({
        title: '无法获取资源，点击跳转至服务商订单查询页面',
        onOk() {
          hashHistory.push('/order/search')
          console.log('OK');
        },
        maskClosable: false,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { OrderManage } = nextProps;
    const {
      vendorOrderDetails,
      vendorOrderTrackLogs,
    } = OrderManage;

    // 拿到取操作日志的参数
    if (vendorOrderDetails.order_id && !this.private.getOrderId) {
      this.private.orderId = vendorOrderDetails.order_id;
      this.private.getOrderId = true;
      const bizMode = dot.get(vendorOrderDetails, 'biz_mode', '');
      // 本地生活圈
      if (bizMode === 10) {
        this.private.event = this.private.localLifeEvent;
      }
      // 落地配不带存储
      if (bizMode === 20) {
        this.private.event = this.private.noStorageEvent;
      }

      if (bizMode === 30) {
        this.private.event = this.private.cityEvent;
      }
      // 获取运单物流跟踪信息
      this.renderOrderTrackLogs()
    }

    this.setState({
      vendorOrderDetails,
      vendorOrderTrackLogs,
    })
  }

  componentWillUnmount() {
    this.private.orderId = '';
    this.private.getOrderId = false;
    this.private.event = '';
  }

  // 获取运单物流跟踪信息
  renderOrderTrackLogs = () => {
    const { location, dispatch, page, limit, orderId, event } = this.private;
    if (orderId) {
      const params = {
        orderId,
        page,
        limit,
      }
      if (event) {
        params.event = event;
      }
      dispatch({ type: getOrderTrackLogs, payload: params })
    }
  }

  // 基本信息模块
  renderBasicInfo = () => {
    const { vendorOrderDetails } = this.state;
    //下单时间
    let createdAtStr = '';
    if (dot.get(vendorOrderDetails, 'created_at')) {
      const createdAt = utcToDate(dot.get(vendorOrderDetails, 'created_at'));
      createdAt.time.length = 2;
      createdAtStr = `${createdAt.date.join('-')}  ${createdAt.time.join(':')}`;
    }
    //业务模式
    let bizMode = '';
    //业务模式
    switch (dot.get(vendorOrderDetails, 'biz_mode')) {
      case 10:
        bizMode = '本地生活圈';
        break;
      case 20:
        bizMode = '落地配（无存储）';
        break;
      case 25:
        bizMode = '落地配（有存储)';
        break;
      case 30:
        bizMode = '同城快递';
        break;
      default:
        bizMode = '';
        break;
    }
    return (
      <div className="bd-content">
        <div className="content-title">基本信息</div>
        <div className="content">
          <Row type="flex" justify="center">
            <Col sm={10}>
              <FormItem label="订单编号" {...itemLayout['6_18']}>
                {
                  dot.get(vendorOrderDetails, 'org_order_id', '')
                }
              </FormItem>
              <FormItem label="条形编码" {...itemLayout['6_18']}>
                {
                  dot.get(vendorOrderDetails, 'seller_order.barcode', '')
                }
              </FormItem>
              <FormItem label="业务模式" {...itemLayout['6_18']}>
                {
                  bizMode
                }
              </FormItem>
              {/* <FormItem label="中转仓" {...itemLayout['6_18']}>
                --
              </FormItem> */}
              <FormItem label="订单状态" {...itemLayout['6_18']}>
                {
                  dot.get(vendorOrderDetails, 'state') ? VendorOrderState.description(dot.get(vendorOrderDetails, 'state')) : ''
                }
              </FormItem>
              <FormItem label="订单类型" {...itemLayout['6_18']}>
                {
                  dot.get(vendorOrderDetails, 'is_direct_contracted') ? '直营' : '加盟'
                }
              </FormItem>
              <FormItem label="商家名称" {...itemLayout['6_18']}>
                {
                  dot.get(vendorOrderDetails, 'seller_order.seller.name', '')
                }
              </FormItem>
              <FormItem label="商家联系人" {...itemLayout['6_18']}>
                {
                  dot.get(vendorOrderDetails, 'seller_order.consignor.name', '')
                }
              </FormItem>
              <FormItem label="商家电话" {...itemLayout['6_18']}>
                {
                  dot.get(vendorOrderDetails, 'seller_order.consignor.mobile', '')
                }
              </FormItem>
              <FormItem label="发货地址" {...itemLayout['6_18']}>
                {
                  dot.get(vendorOrderDetails, 'seller_order.consignor.address', '')
                }
              </FormItem>
              <FormItem label="代付商家" {...itemLayout['6_18']}>
                {
                  dot.get(vendorOrderDetails, 'seller_order.extra_services.payment.amount') ? (Number(dot.get(vendorOrderDetails, 'seller_order.extra_services.payment.amount')) / 100).toFixed(2) : '0.00'
                }
                元
              </FormItem>
            </Col>
            <Col sm={10}>
              <FormItem label="期望送达" {...itemLayout['6_18']}>
                {
                  dot.get(vendorOrderDetails, 'plan_shipping_date') ? (`${numberDateToStr(dot.get(vendorOrderDetails, 'plan_shipping_date'))} ${dot.get(vendorOrderDetails, 'plan_shipping_time', '')}`) : ''
                }
              </FormItem>
              <FormItem label="下单时间" {...itemLayout['6_18']}>
                {
                  createdAtStr
                }
              </FormItem>
              <FormItem label="配送区域" {...itemLayout['6_18']}>
                {
                  dot.get(vendorOrderDetails, 'area_info.name', '')
                }
              </FormItem>
              <FormItem label="揽收站" {...itemLayout['6_18']}>
                {
                  dot.get(vendorOrderDetails, 'pickup_stock.name', '')
                }
              </FormItem>
              {/* <FormItem label="库房" {...itemLayout['6_18']}>
                --
              </FormItem> */}
              <FormItem label="配送站" {...itemLayout['6_18']}>
                {
                  dot.get(vendorOrderDetails, 'delivery_stock.name', '')
                }
              </FormItem>
              <FormItem label="顾客姓名" {...itemLayout['6_18']}>
                {
                  dot.get(vendorOrderDetails, 'seller_order.consignee.name', '')
                }
              </FormItem>
              <FormItem label="顾客电话" {...itemLayout['6_18']}>
                {
                  dot.get(vendorOrderDetails, 'seller_order.consignee.mobile', '')
                }
              </FormItem>
              <FormItem label="顾客地址" {...itemLayout['6_18']}>
                {
                  dot.get(vendorOrderDetails, 'seller_order.consignee.address', '')
                }
              </FormItem>
              <FormItem label="配送距离" {...itemLayout['6_18']}>
                {
                  dot.get(vendorOrderDetails, 'seller_order.distance') ? (Number(dot.get(vendorOrderDetails, 'seller_order.distance')) / 1000).toFixed(3) : '0.000'
                }
                km
              </FormItem>
              <FormItem label="代收顾客" {...itemLayout['6_18']}>
                {
                  dot.get(vendorOrderDetails, 'seller_order.extra_services.cod.amount') ? (Number(dot.get(vendorOrderDetails, 'seller_order.extra_services.cod.amount')) / 100).toFixed(2) : '0.00'
                }
                元
              </FormItem>
            </Col>
          </Row>
        </div>
      </div>
    )
  }

  // 订单明细模块
  renderOrderDetails = () => {
    const { vendorOrderDetails } = this.state;
    return (
      <div className="bd-content">
        <div className="content-title">订单明细</div>
        <div className="content">
          <Row type="flex" justify="center">
            <Col sm={10}>
              <FormItem label="备注" {...itemLayout['6_18']}>
                {
                  dot.get(vendorOrderDetails, 'seller_order.note', '')
                }
              </FormItem>
              <FormItem label="商品类型" {...itemLayout['6_18']}>
                {
                  stateTransform('seller_type', dot.get(vendorOrderDetails, 'seller_order.seller.seller_type', ''))
                }
              </FormItem>
            </Col>
            <Col sm={10}>
              <FormItem label="订单金额" {...itemLayout['6_18']}>
                {
                  dot.get(vendorOrderDetails, 'seller_order.order_amount') ? (Number(dot.get(vendorOrderDetails, 'seller_order.order_amount')) / 100).toFixed(2) : '0.00'
                }
                元
              </FormItem>
            </Col>
          </Row>
          <p>以下为货品详情</p>
          <Table rowKey={(record, index) => { return index }} columns={VENDOR_ORDER_DETAILS_INFO_COLUMNS} dataSource={dot.get(vendorOrderDetails, 'seller_order.order_items', [])} />
          <p>以下为配送费支付信息</p>
          <Row type="flex" justify="center">
            <Col sm={10}>
              <FormItem label="配送费" {...itemLayout['6_18']}>
                {
                  dot.get(vendorOrderDetails, 'shipping_fee') ? (Number(dot.get(vendorOrderDetails, 'shipping_fee')) / 100).toFixed(2) : '0.00'
                }
                元
              </FormItem>
              <FormItem label="结算方式" {...itemLayout['6_18']}>
                {
                  dot.get(vendorOrderDetails, 'seller_order.pay_type') ? stateTransform('pay_type', dot.get(vendorOrderDetails, 'seller_order.pay_type')) : ''
                }
              </FormItem>
            </Col>
            <Col sm={10}>
              <FormItem label="小费" {...itemLayout['6_18']}>
                {
                  dot.get(vendorOrderDetails, 'seller_order.tip_fee') ? (Number(dot.get(vendorOrderDetails, 'seller_order.tip_fee')) / 100).toFixed(2) : '0.00'
                }
                元
              </FormItem>
            </Col>
          </Row>
        </div>
      </div>
    )
  }

  // 订单追踪
  renderTrace = () => {
    const { vendorOrderTrackLogs, vendorOrderDetails } = this.state;
    const { page, limit } = this.private;
    const pagination = {
      total: dot.get(vendorOrderTrackLogs, '_meta.result_count', 0),
      pageSize: limit,
      current: page,
      showTotal: (total) => {
        return `总共 ${total} 条`;
      },
      onShowSizeChange: (current, pageSize) => {
        this.props.onShowSizeChange(current, pageSize);
      },
      onChange: (current) => {
        this.private.page = current;
        // 获取运单物流跟踪信息
        this.renderOrderTrackLogs()
      },
    }
    const bizMode = dot.get(vendorOrderDetails, 'biz_mode', '');
    return (
      <div className="bd-content">
        <div className="content-title">订单追踪</div>
        <div className="content">
          {/* <ul className={style.traceContent}>
            <li>
              运力承运商：
            </li>
            <li>
              中转仓承运商：
            </li>
            <li>
              配送站承运商：
            </li>
          </ul> */}
          <Table rowKey={(record, index) => { return index }} columns={VENDOR_ORDER_TRACE_INFO_COLUMNS(bizMode)} dataSource={vendorOrderTrackLogs.data} pagination={pagination} />
        </div>
      </div>
    )
  }

  render = () => {
    const { renderBasicInfo, renderOrderDetails, renderTrace } = this;
    return (
      <div className="con-body">
        {/* 基本信息模块 */}
        {renderBasicInfo()}
        {/* 订单明细模块 */}
        {renderOrderDetails()}
        {/* 订单追踪 */}
        {renderTrace()}
      </div>
    )
  }
}
function mapStateToProps({ OrderManage }) {
  return { OrderManage };
}

module.exports = connect(mapStateToProps)(OrderDetails);
