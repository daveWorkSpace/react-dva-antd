/**
 * 仓订单详情模块
 */
import dot from 'dot-prop';
import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { hashHistory, Link } from 'dva/router';
import { Form, Row, Col, Button, Tooltip, Icon, Table, Modal } from 'antd';
import { OrderManage, DispatcherActions } from '../../actions';
import { authorize } from '../../../application';
import { utcTo, isEmptyObject } from '../../../utils/newUtils';
import {
  STOCK_ORDER_DETAILS_INFO_COLUMNS,
  STOCK_ORDER_TRACE_INFO_COLUMNS,
} from './enumerate'
import style from './style.less';
import { StockOrdersState } from '../../../application/define';

const { stateTransform, numberDateToStr, utcToDate } = window.tempAppTool;
const FormItem = Form.Item;
const warning = Modal.warning;
const {
  getOrderTrackLogs,
} = OrderManage;

const { getStockOrdersDetails } = DispatcherActions;

const itemLayout = { '6_18': { labelCol: { span: 6 }, wrapperCol: { span: 18 } } };

class OrderDetails extends Component {
  constructor(props) {
    super();
    const { dispatch, OrderManage, SiteOperate } = props;
    this.state = {
      stockOrderDetails: SiteOperate.stockOrderDetails,           //仓订单详情
      stockOrderTrackLogs: OrderManage.vendorOrderTrackLogs,      //仓订单追踪日志
    }

    this.private = {
      dispatch,
      location: props.location,                           //路由
      vendorId: authorize.auth.vendorId,                  //服务商id
      cityCode: dot.get(authorize.vendor, 'city.code'),   //城市code
      page: 1,                //订单追踪页数
      limit: 10,                                          //默认分页数
      orderId: '',            //取操作日志的参数仓库单id
      getOrderId: false,      //是否拿到订单id
      event: 'stock-order-created,stock-order-confirmed,stock-order-stock-in,stock-order-error,stock-order-assigned,shipment-pickup,shipment-error,shipment-done,shipment-recover-state,seller-order-closed,vendor-order-closed,stock-order-redispatch,stock-order-closed',
    }
    // 基本信息模块
    this.renderBasicInfo = this.renderBasicInfo.bind(this)
    // 订单明细模块
    this.renderOrderDetails = this.renderOrderDetails.bind(this)
    // 订单追踪
    this.renderTrace = this.renderTrace.bind(this)
    // 获取运单物流跟踪信息
    this.renderOrderTrackLogs = this.renderOrderTrackLogs.bind(this);
  }

  componentWillMount() {
    const { location, dispatch } = this.private;
    const stockOrderId = location.query.id;
    if (stockOrderId) {
      const params = {
        stockOrderId,
      }
      // 获取仓订单单详情
      dispatch({ type: getStockOrdersDetails, payload: params })
    } else {
      warning({
        title: '无法获取资源，点击跳转至待骑士确认订单查询页面',
        onOk() {
          hashHistory.push('/dispatcher/knight/affirm')
          console.log('OK');
        },
        maskClosable: false,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { OrderManage, SiteOperate } = nextProps;
    const {
      vendorOrderTrackLogs,
    } = OrderManage;

    const { stockOrderDetails } = SiteOperate

    // 拿到取操作日志的参数
    if (dot.get(stockOrderDetails, 'order_id', '') && !this.private.getOrderId) {
      this.private.orderId = dot.get(stockOrderDetails, 'order_id', '');
      this.private.getOrderId = true;
      // 获取运单物流跟踪信息
      this.renderOrderTrackLogs()
    }

    this.setState({
      stockOrderDetails,
      stockOrderTrackLogs: vendorOrderTrackLogs,
    })
  }

  // 获取运单物流跟踪信息
  renderOrderTrackLogs() {
    const { location, dispatch, page, limit, orderId, event } = this.private;
    if (orderId) {
      const params = {
        orderId,
        event,
        page,
        limit,
      }
      dispatch({ type: getOrderTrackLogs, payload: params })
    }
  }

  // 基本信息模块
  renderBasicInfo() {
    const { stockOrderDetails } = this.state;
    //下单时间
    let createdAtStr = '';
    if (dot.get(stockOrderDetails, 'created_at')) {
      const createdAt = utcToDate(dot.get(stockOrderDetails, 'created_at'));
      createdAt.time.length = 2;
      createdAtStr = `${createdAt.date.join('-')}  ${createdAt.time.join(':')}`;
    }

    // 期望送达
    let shippingTime = '';
    if (dot.get(stockOrderDetails, 'seller_order_info.shipping_time')) {
      const _date = utcToDate(dot.get(stockOrderDetails, 'seller_order_info.shipping_time'));
      _date.time.length = 2;
      shippingTime = `${_date.date.join('-')}  ${_date.time.join(':')}`;
    }

    //业务模式
    let bizMode = '';
    //业务模式
    switch (dot.get(stockOrderDetails, 'biz_mode')) {
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
                  dot.get(stockOrderDetails, 'org_order_id', '')
                }
              </FormItem>
              <FormItem label="条形编码" {...itemLayout['6_18']}>
                {
                  dot.get(stockOrderDetails, 'barcode', '')
                }
              </FormItem>
              <FormItem label="配送区域" {...itemLayout['6_18']}>
                {
                  dot.get(stockOrderDetails, 'vendor_order.area_info.name', '')
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
                  dot.get(stockOrderDetails, 'state') ? StockOrdersState.description(dot.get(stockOrderDetails, 'state')) : ''
                }
              </FormItem>
              <FormItem label="商家名称" {...itemLayout['6_18']}>
                {
                  dot.get(stockOrderDetails, 'seller_order_info.seller.name', '')
                }
              </FormItem>
              <FormItem label="商家联系人" {...itemLayout['6_18']}>
                {
                  dot.get(stockOrderDetails, 'seller_order_info.consignor.name', '')
                }
              </FormItem>
              <FormItem label="商家电话" {...itemLayout['6_18']}>
                {
                  dot.get(stockOrderDetails, 'seller_order_info.consignor.mobile', '') || dot.get(stockOrderDetails, 'seller_order_info.consignor.tel', '')
                }
              </FormItem>
              <FormItem label="发货地址" {...itemLayout['6_18']}>
                {
                  dot.get(stockOrderDetails, 'seller_order_info.consignor.address', '')
                }
              </FormItem>
              <FormItem label="代付商家" {...itemLayout['6_18']}>
                {
                  dot.get(stockOrderDetails, 'seller_order_info.extra_services.payment.amount') ? (Number(dot.get(stockOrderDetails, 'seller_order_info.extra_services.payment.amount')) / 100).toFixed(2) : '0.00'
                }
                元
              </FormItem>
            </Col>
            <Col sm={10}>
              <FormItem label="期望送达" {...itemLayout['6_18']}>
                {
                  shippingTime
                }
              </FormItem>
              <FormItem label="下单时间" {...itemLayout['6_18']}>
                {
                  createdAtStr
                }
              </FormItem>
              <FormItem label="发货库房" {...itemLayout['6_18']}>
                {
                  dot.get(stockOrderDetails, 'start_stock_name', '')
                }
              </FormItem>
              <FormItem label="配送站" {...itemLayout['6_18']}>
                {
                  dot.get(stockOrderDetails, 'done_stock_name', '')
                }
              </FormItem>
              <FormItem label="顾客姓名" {...itemLayout['6_18']}>
                {
                  dot.get(stockOrderDetails, 'seller_order_info.consignee.name', '')
                }
              </FormItem>
              <FormItem label="顾客电话" {...itemLayout['6_18']}>
                {
                  dot.get(stockOrderDetails, 'seller_order_info.consignee.mobile', '')
                }
              </FormItem>
              <FormItem label="顾客地址" {...itemLayout['6_18']}>
                {
                  dot.get(stockOrderDetails, 'seller_order_info.consignee.address', '')
                }
              </FormItem>
              {/* <FormItem label="配送距离" {...itemLayout['6_18']}>
                ---
                {
                  dot.get(stockOrderDetails, 'seller_order_info.distance') ? (Number(dot.get(stockOrderDetails, 'seller_order_info.distance')) / 1000).toFixed(2) : ''
                }
                km
              </FormItem> */}
              <FormItem label="代收顾客" {...itemLayout['6_18']}>
                {
                  dot.get(stockOrderDetails, 'seller_order_info.extra_services.cod.amount') ? (Number(dot.get(stockOrderDetails, 'seller_order_info.extra_services.cod.amount')) / 100).toFixed(2) : '0.00'
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
  renderOrderDetails() {
    const { stockOrderDetails } = this.state;
    return (
      <div className="bd-content">
        <div className="content-title">订单明细</div>
        <div className="content">
          <Row type="flex" justify="center">
            <Col sm={10}>
              <FormItem label="备注" {...itemLayout['6_18']}>
                {
                  dot.get(stockOrderDetails, 'seller_order_info.note', '')
                }
              </FormItem>
              <FormItem label="商品类型" {...itemLayout['6_18']}>
                {
                  stateTransform('seller_type', dot.get(stockOrderDetails, 'seller_order_info.item_type', ''))
                }
              </FormItem>
            </Col>
            <Col sm={10}>
              <FormItem label="订单金额" {...itemLayout['6_18']}>
                {
                  dot.get(stockOrderDetails, 'seller_order_info.order_amount') ? (Number(dot.get(stockOrderDetails, 'seller_order_info.order_amount')) / 100).toFixed(2) : '0.00'
                }
                元
              </FormItem>
            </Col>
          </Row>
          <p>以下为货品详情</p>
          <Table rowKey={(record, index) => { return index }} columns={STOCK_ORDER_DETAILS_INFO_COLUMNS} dataSource={dot.get(stockOrderDetails, 'seller_order_info.order_items', [])} />
          <p>以下为配送费支付信息</p>
          <Row type="flex" justify="center">
            <Col sm={10}>
              {/* <FormItem label="配送费" {...itemLayout['6_18']}>
                ---
                {
                  dot.get(stockOrderDetails, 'seller_order_info.shipping_amount', '0.00')
                }
                元
              </FormItem> */}
              <FormItem label="结算方式" {...itemLayout['6_18']}>
                {
                  dot.get(stockOrderDetails, 'seller_order_info.pay_type') ? stateTransform('pay_type', dot.get(stockOrderDetails, 'seller_order_info.pay_type')) : ''
                }
              </FormItem>
            </Col>
            {/* <Col sm={10}>
              <FormItem label="小费" {...itemLayout['6_18']}>
                {
                  dot.get(stockOrderDetails, 'seller_order_info.tip_fee', '0.00')
                }
                元
              </FormItem>
            </Col> */}
          </Row>
        </div>
      </div>
    )
  }

  // 订单追踪
  renderTrace() {
    const { stockOrderTrackLogs, stockOrderDetails } = this.state;
    const { page, limit } = this.private;
    const pagination = {
      total: stockOrderTrackLogs._meta.result_count || 0,
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
    return (
      <div className="bd-content">
        <div className="content-title">订单追踪</div>
        <div className="content">
          <p>仓库单号： { dot.get(stockOrderDetails, 'id') }</p>
          <Table rowKey={(record, index) => { return index }} columns={STOCK_ORDER_TRACE_INFO_COLUMNS} dataSource={stockOrderTrackLogs.data} pagination={pagination} />
        </div>
      </div>
    )
  }

  render() {
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
function mapStateToProps({ OrderManage, SiteOperate }) {
  return { OrderManage, SiteOperate };
}

module.exports = connect(mapStateToProps)(OrderDetails);
