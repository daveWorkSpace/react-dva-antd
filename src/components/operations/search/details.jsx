import dot from 'dot-prop';
import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { hashHistory, Link } from 'dva/router';
import { Form, Row, Col, Button, Tooltip, Icon, Table, Modal } from 'antd';
import { OperationsManage } from '../../actions';
import { authorize } from '../../../application';
import { BusinessMode, GoodsType, DeliveryOrderState } from '../../../application/define';
import { utcTo, isEmptyObject } from '../../../utils/newUtils';
import {
  OPERATIONS_DETAILS_DETAILS_INFO_COLUMNS,
  OPERATIONS_DETAILS_TRACE_INFO_COLUMNS,
  OPERATIONS_DETAILS_PUSH_RECORD_COLUMNS,
} from '../enumerate';
import style from './style.less';


const { stateTransform, numberDateToStr, utcToDate } = window.tempAppTool;
const FormItem = Form.Item;
const warning = Modal.warning;
const {
  getShipmentsDetails,
  getShipmentsTrackLogs,
  getPushOrderRecord,
} = OperationsManage;
const itemLayout = { '6_18': { labelCol: { span: 6 }, wrapperCol: { span: 18 } } };

class DetailsComponent extends Component {
  constructor(props) {
    super();
    const { dispatch, OperationsManage } = props;
    this.state = {
      shipmentsDetails: OperationsManage.shipmentsDetails,        //运单详情
      shipmentsTrackLogs: OperationsManage.shipmentsTrackLogs,    //运单追踪日志
      pushOrderRecord: OperationsManage.pushOrderRecord,          //推单记录
    }

    this.private = {
      dispatch,
      location: props.location,
      vendorId: authorize.auth.vendorId,
      cityCode: dot.get(authorize.vendor, 'city.code'),
      pushPage: 1,            //初始化推单记录分页
      trackPage: 1,           //初始化追踪日志分页
      limit: 10,
      event: 'shipment-created,vendor-order-confirmed,shipment-accepted,shipment-arrived,shipment-error,shipment-pickup,shipment-done,shipment-reassigned,shipment-recover-state,shipment-closed,stock-order-redispatch,stock-order-closed,stock-order-error,stock-order-assigned',
    }
    // 基本信息模块
    this.renderBasicInfo = this.renderBasicInfo.bind(this)
    // 订单明细模块
    this.renderOrderDetails = this.renderOrderDetails.bind(this)
    // 订单追踪
    this.renderTrace = this.renderTrace.bind(this)
    // 订单推单记录
    this.renderPushRecord = this.renderPushRecord.bind(this)
    // 获取运单物流跟踪信息
    this.renderShipmentsTrackLogs = this.renderShipmentsTrackLogs.bind(this);
  }

  componentWillMount() {
    const { location, dispatch } = this.private;
    const shipmentId = location.query.id;
    if (shipmentId) {
      const params = {
        shipmentId,
      }
      // 获取运单详情
      dispatch({ type: getShipmentsDetails, payload: params })
      // 获取运单物流跟踪信息
      this.renderShipmentsTrackLogs()
      // 获取订单推单记录
      this.renderPushOrderRecord();
    } else {
      warning({
        title: '无法获取资源，点击跳转至运力订单查询页面',
        onOk() {
          hashHistory.push('/operations/search')
          console.log('OK');
        },
        maskClosable: false,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { OperationsManage } = nextProps;
    const {
      shipmentsDetails,
      shipmentsTrackLogs,
      pushOrderRecord,
    } = OperationsManage;

    this.setState({
      shipmentsDetails,
      shipmentsTrackLogs,
      pushOrderRecord,
    })
  }

  // 获取订单推单记录
  renderPushOrderRecord() {
    const { location, dispatch, pushPage, limit } = this.private;
    const shipmentId = location.query.id;
    if (shipmentId) {
      const params = {
        shipmentId,
        limit,
        page: pushPage,
      }
      // 获取运单物流跟踪信息
      dispatch({ type: getPushOrderRecord, payload: params })
    }
  }

  // 获取运单物流跟踪信息
  renderShipmentsTrackLogs() {
    const { location, dispatch, trackPage, limit, event } = this.private;
    const shipmentId = location.query.id;
    if (shipmentId) {
      const params = {
        shipmentId,
        event,
        limit,
        page: trackPage,
      }
      // 获取运单物流跟踪信息
      dispatch({ type: getShipmentsTrackLogs, payload: params })
    }
  }

  // 基本信息模块
  renderBasicInfo() {
    const { shipmentsDetails } = this.state;
    //下单时间
    let createdAtStr = '';
    if (dot.get(shipmentsDetails, 'created_at')) {
      const createdAt = utcToDate(dot.get(shipmentsDetails, 'created_at'));
      createdAt.time.length = 2;
      createdAtStr = `${createdAt.date.join('-')}  ${createdAt.time.join(':')}`;
    }
    //业务模式
    let bizMode = '';
    //业务模式
    switch (dot.get(shipmentsDetails, 'biz_mode')) {
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
                  dot.get(shipmentsDetails, 'org_order_id', '')
                }
              </FormItem>
              <FormItem label="条形编码" {...itemLayout['6_18']}>
                {
                  dot.get(shipmentsDetails, 'barcode', '')
                }
              </FormItem>
              <FormItem label="配送区域" {...itemLayout['6_18']}>
                {
                  dot.get(shipmentsDetails, 'area_name', '')
                }
              </FormItem>
              <FormItem label="运单状态" {...itemLayout['6_18']}>
                {
                  dot.get(shipmentsDetails, 'state') ? DeliveryOrderState.description(dot.get(shipmentsDetails, 'state')) : ''
                }
              </FormItem>
              <FormItem label="业务模式" {...itemLayout['6_18']}>
                {
                  BusinessMode.description(dot.get(shipmentsDetails, 'biz_mode'))
                }
              </FormItem>
              <FormItem label="商家名称" {...itemLayout['6_18']}>
                {
                  dot.get(shipmentsDetails, 'seller.name', '')
                }
              </FormItem>
              <FormItem label="商家联系人" {...itemLayout['6_18']}>
                {
                  dot.get(shipmentsDetails, 'consignor_name', '')
                }
              </FormItem>
              <FormItem label="商家手机" {...itemLayout['6_18']}>
                {
                  dot.get(shipmentsDetails, 'consignor_tel', '')
                }
              </FormItem>
              <FormItem label="商家电话" {...itemLayout['6_18']}>
                {
                  dot.get(shipmentsDetails, 'consignor_mobile', '')
                }
              </FormItem>
              <FormItem label="代付商家" {...itemLayout['6_18']}>
                {
                  dot.get(shipmentsDetails, 'extra_services.payment.amount') ? (Number(dot.get(shipmentsDetails, 'extra_services.payment.amount')) / 100).toFixed(2) : '0.00'
                }
                元
              </FormItem>
            </Col>
            <Col sm={10}>
              <FormItem label="期望送达" {...itemLayout['6_18']}>
                {
                  dot.get(shipmentsDetails, 'plan_shipping_date') ? (`${numberDateToStr(dot.get(shipmentsDetails, 'plan_shipping_date'))} ${dot.get(shipmentsDetails, 'plan_shipping_time', '')}`) : ''
                }
              </FormItem>
              <FormItem label="下单时间" {...itemLayout['6_18']}>
                {
                  createdAtStr
                }
              </FormItem>
              <FormItem label="配送距离" {...itemLayout['6_18']}>
                {
                  dot.get(shipmentsDetails, 'distance') ? (Number(dot.get(shipmentsDetails, 'distance')) / 1000).toFixed(3) : '0.000'
                }
                km
              </FormItem>
              <FormItem label="顾客姓名" {...itemLayout['6_18']}>
                {
                  dot.get(shipmentsDetails, 'consignee_name', '')
                }
              </FormItem>
              <FormItem label="顾客电话" {...itemLayout['6_18']}>
                {
                  dot.get(shipmentsDetails, 'consignee_mobile', '')
                }
              </FormItem>
              <FormItem label="顾客地址" {...itemLayout['6_18']}>
                {
                  `${dot.get(shipmentsDetails, 'consignee_address', '')} ${dot.get(shipmentsDetails, 'consignee_address_detail', '')}`
                }
              </FormItem>
              <FormItem label="代收顾客" {...itemLayout['6_18']}>
                {
                  dot.get(shipmentsDetails, 'extra_services.cod.amount') ? (Number(dot.get(shipmentsDetails, 'extra_services.cod.amount')) / 100).toFixed(2) : '0.00'
                }
                元
              </FormItem>
              <FormItem label="商品类型" {...itemLayout['6_18']}>
                {
                  GoodsType.description(dot.get(shipmentsDetails, 'seller.seller_type'))
                }
              </FormItem>
              <FormItem label="取货地址" {...itemLayout['6_18']}>
                {
                  `${dot.get(shipmentsDetails, 'consignor_address', '')} ${dot.get(shipmentsDetails, 'consignor_address_detail', '')}`
                }
              </FormItem>
            </Col>
          </Row>
        </div>
      </div>
    )
  }

  // 订单明细模块
  renderOrderDetails() {
    const { shipmentsDetails } = this.state;
    return (
      <div className="bd-content">
        <div className="content-title">订单明细</div>
        <div className="content">
          <Row type="flex" justify="center">
            <Col sm={10}>
              <FormItem label="备注" {...itemLayout['6_18']}>
                {
                  dot.get(shipmentsDetails, 'note', '')
                }
              </FormItem>
              <FormItem label="商品类型" {...itemLayout['6_18']}>
                {
                  stateTransform('seller_type', dot.get(shipmentsDetails, 'seller.seller_type', ''))
                }
              </FormItem>
            </Col>
            <Col sm={10}>
              <FormItem label="订单金额" {...itemLayout['6_18']}>
                {
                  dot.get(shipmentsDetails, 'o3_order_amount') ? (Number(dot.get(shipmentsDetails, 'o3_order_amount')) / 100).toFixed(2) : '0.00'
                }
                元
              </FormItem>
            </Col>
          </Row>
          <p>以下为货品详情</p>
          <Table rowKey={(record, index) => { return index }} columns={OPERATIONS_DETAILS_DETAILS_INFO_COLUMNS} dataSource={dot.get(shipmentsDetails, 'shipment_items', [])} />
          <p>以下为配送费支付信息</p>
          <Row type="flex" justify="center">
            <Col sm={10}>
              <FormItem label="配送费" {...itemLayout['6_18']}>
                {
                  dot.get(shipmentsDetails, 'shipping_fee') ? (Number(dot.get(shipmentsDetails, 'shipping_fee')) / 100).toFixed(2) : '0.00'
                }
                元
              </FormItem>
              <FormItem label="结算方式" {...itemLayout['6_18']}>
                {
                  dot.get(shipmentsDetails, 'pay_type') ? stateTransform('pay_type', dot.get(shipmentsDetails, 'pay_type')) : ''
                }
              </FormItem>
            </Col>
            <Col sm={10}>
              <FormItem label="小费" {...itemLayout['6_18']}>
                {
                  dot.get(shipmentsDetails, 'tip_fee') ? (Number(dot.get(shipmentsDetails, 'tip_fee')) / 100).toFixed(2) : '0.00'
                }
                元
              </FormItem>
              {/*<FormItem label="支付方式" {...itemLayout['6_18']}>
              </FormItem>*/}
            </Col>
          </Row>
        </div>
      </div>
    )
  }

  // 订单追踪
  renderTrace() {
    const { shipmentsDetails, shipmentsTrackLogs } = this.state;
    const { trackPage, limit } = this.private;
    const pagination = {
      total: shipmentsTrackLogs._meta.result_count || 0,
      pageSize: limit,
      current: trackPage,
      showTotal: (total) => {
        return `总共 ${total} 条`;
      },
      onShowSizeChange: (current, pageSize) => {
        this.props.onShowSizeChange(current, pageSize);
      },
      onChange: (current) => {
        this.private.trackPage = current;
        // 获取运单物流跟踪信息
        this.renderShipmentsTrackLogs()
      },
    }
    return (
      <div className="bd-content">
        <div className="content-title">订单追踪</div>
        <div className="content">
          <ul className={style.traceContent}>
            <li>
              运单号：
            {
                dot.get(shipmentsDetails, 'id', '')
              }
            </li>
            <li>
              骑士姓名：
            {
                dot.get(shipmentsDetails, 'courier.name', '')
              }
            </li>
            <li>
              骑士手机：
            {
                dot.get(shipmentsDetails, 'courier.mobile', '')
              }
            </li>
          </ul>
          <Table rowKey={(record, index) => { return index }} columns={OPERATIONS_DETAILS_TRACE_INFO_COLUMNS} dataSource={shipmentsTrackLogs.data} pagination={pagination} />
        </div>
      </div>
    )
  }

  // 订单推单记录
  renderPushRecord() {
    const { pushOrderRecord } = this.state;
    const { pushPage, limit } = this.private;
    const pagination = {
      total: pushOrderRecord._meta.result_count || 0,
      pageSize: limit,
      current: pushPage,
      showTotal: (total) => {
        return `总共 ${total} 条`;
      },
      onShowSizeChange: (current, pageSize) => {
        this.props.onShowSizeChange(current, pageSize);
      },
      onChange: (current) => {
        this.private.pushPage = current;
        // 获取订单推单记录
        this.renderPushOrderRecord()
      },
    }
    return (
      <div className="bd-content">
        <div className="content-title">推单记录</div>
        <div className="content">
          <Table rowKey={(record, index) => { return index }} columns={OPERATIONS_DETAILS_PUSH_RECORD_COLUMNS} dataSource={pushOrderRecord.data} pagination={pagination} />
        </div>
      </div>
    )
  }

  render() {
    const { renderBasicInfo, renderOrderDetails, renderTrace, renderPushRecord } = this;
    return (
      <div className="con-body">
        {/* 基本信息模块 */}
        {renderBasicInfo()}
        {/* 订单明细模块 */}
        {renderOrderDetails()}
        {/* 订单追踪 */}
        {renderTrace()}
        {/* 订单推单记录 */}
        {renderPushRecord()}
      </div>
    )
  }
}
function mapStateToProps({ OperationsManage }) {
  return { OperationsManage };
}

module.exports = connect(mapStateToProps)(DetailsComponent);
