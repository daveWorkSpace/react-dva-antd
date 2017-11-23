/**
 * 枚举值模块
 * 分拨管理模块所有 table 的columns信息
 */

import dot from 'dot-prop';
import React from 'react';
import { Link } from 'dva/router';
import { authorize } from '../../../application';
import {
  BusinessMode,
  GoodsType,
  PaymentType,
  OrderTrackEvent,
  SellerOrdersErrorFlag,
  StockOrdersState,
  StockOrdersErrorFlag,
  StockOrdersErrorType,
  StockOrdersLogType,
} from '../../../application/define';

const { stateTransform, utcToDate } = window.tempAppTool;

//到站收货
export const ARRIVE_DELIVERY = 'ARRIVE_DELIVERY';
// 揽收入站
export const PULL_INBOUND = 'PULL_INBOUND';
// 骑士领货
export const KNIGHT_DELIVERY = 'KNIGHT_DELIVERY';
// 中转出站
export const TRANSFER_OUTBOUND = 'TRANSFER_OUTBOUND';
// 退货入站
export const SALES_INBOUND = 'SALES_INBOUND';
// 退货出站
export const SALES_OUTBOUND = 'SALES_OUTBOUND';
// 待骑士确认订单
export const KNIGHT_AFFIRM_ORDER = 'KNIGHT_AFFIRM_ORDER';
// 异常单处理
export const EXCEPTION_ORDER = 'EXCEPTION_ORDER';
// 配送单查询
export const DISTRIBUTION_ORDER = 'DISTRIBUTION_ORDER';
// 中转单查询
export const TRANSFER_ORDER = 'TRANSFER_ORDER';
// 入站记录
export const INBOUND_RECORD = 'INBOUND_RECORD';
// 出站记录
export const OUTBOUND_RECORD = 'OUTBOUND_RECORD';

//到站收货统计 columns
export const ARRIVE_IN_STATISTICS_COLUMNS = [
  {
    title: '今日未到货',
    dataIndex: 'today_not_arrival',
    key: 'today_not_arrival',
  },
  {
    title: '历史未到货',
    dataIndex: 'history_not_arrival',
    key: 'history_not_arrival',
  },
  {
    title: '今日到货',
    dataIndex: 'today_arrival',
    key: 'today_arrival',
  },
  {
    title: '异常',
    dataIndex: 'error',
    key: 'error',
    className: 'stockErrorStyle',
  },
];
// 揽收入站
export const PULL_INBOUND_STATISTICS_COLUMNS = [
  {
    title: '今日揽收未入站',
    dataIndex: 'today_not_stock_in',
    key: 'today_not_stock_in',
  },
  {
    title: '历史揽收未入站',
    dataIndex: 'history_not_stock_in',
    key: 'history_not_stock_in',
  },
  {
    title: '今日揽收到站',
    dataIndex: 'today_stock_in',
    key: 'today_stock_in',
  },
  {
    title: '异常',
    dataIndex: 'error',
    key: 'error',
    className: 'stockErrorStyle',
  },
];
// 骑士领货
export const KNIGHT_STATISTICS_COLUMNS = [
  {
    title: '今日未领货',
    dataIndex: 'today_not_consignment',
    key: 'today_not_consignment',
  },
  {
    title: '历史未领货',
    dataIndex: 'history_not_consignment',
    key: 'history_not_consignment',
  },
  {
    title: '今日已领货',
    dataIndex: 'today_consignment',
    key: 'today_consignment',
  },
  {
    title: '异常',
    dataIndex: 'error',
    key: 'error',
    className: 'stockErrorStyle',
  },
  {
    title: '今日配送中',
    dataIndex: 'today_delivering',
    key: 'today_delivering',
  },
];
// 中转出战
export const TRANSFER_OUTBOUND_STATISTICS_COLUMNS = [
  {
    title: '今日未中转出站',
    dataIndex: 'today_not_stock_out',
    key: 'today_not_stock_out',
  },
  {
    title: '历史未中转出站',
    dataIndex: 'history_not_stock_out',
    key: 'history_not_stock_out',
  },
  {
    title: '异常',
    dataIndex: 'error',
    key: 'error',
    className: 'stockErrorStyle',
  },
  {
    title: '今日已中转出站',
    dataIndex: 'today_stock_out',
    key: 'today_stock_out',
  },
];

//枚举扫描模块表格头

/**
 *  columns
 *  到站收货
 *  揽收入站
 */
export const INBOUND_SCAN_COLUMNS = callback => [
  {
    title: '订单编号',
    dataIndex: 'org_order_id',
    key: 'org_order_id',
    render: (text, record, index) => {
      return (
        <Link>
          {text}
        </Link>
      );
    },
  },
  {
    title: '配送站',
    dataIndex: 'done_stock_name',
    key: 'done_stock_name',
  },
  {
    title: '商家名称',
    dataIndex: 'seller_order_info.seller.name',
    key: 'seller_order_info.seller.name',
  },
  {
    title: '货品类型',
    dataIndex: 'seller_order_info.item_type',
    key: 'seller_order_info.item_type',
    render: (text, record, index) => {
      return GoodsType.description(text);
    },
  },
  {
    title: '期望送达',
    dataIndex: 'seller_order_info.shipping_time',
    key: 'seller_order_info.shipping_time',
    render: (text) => {
      const _date = utcToDate(text);
      _date.time.length = 2;
      return `${_date.date.join('-')}  ${_date.time.join(':')}`;
    },
  },
  {
    title: '顾客姓名',
    dataIndex: 'seller_order_info.consignee.name',
    key: 'seller_order_info.consignee.name',
  },
  {
    title: '顾客地址',
    dataIndex: 'seller_order_info.consignee.address',
    key: 'seller_order_info.consignee.address',
  },
  {
    title: '订单状态',
    dataIndex: 'state',
    key: 'state',
    render: (text, record, index) => {
      return StockOrdersState.description(text);
    },
  },
  {
    title: '异常标记',
    dataIndex: 'error_flag',
    key: 'error_flag',
    render: (text, record, index) => {
      return StockOrdersErrorFlag.description(text);
    },
  },
  {
    title: '操作人',
    dataIndex: 'operator',
    render: () => {
      return authorize.account.name
    },
  },
  {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
    render: (text, record, index) => callback(record, index),
  },
];

/**
 *  columns
 *  骑士领货
 */
export const KNIGHT_DELIVERY_SCAN_COLUMNS = callback => [
  {
    title: '订单编号',
    dataIndex: 'org_order_id',
    key: 'org_order_id',
    render: (text, record, index) => {
      return (
        <Link>
          {text}
        </Link>
      );
    },
  },
  {
    title: '商家名称',
    dataIndex: 'seller_order_info.seller.name',
    key: 'seller_order_info.seller.name',
  }, {
    title: '下一站',
    dataIndex: 'next-station',
  }, {
    title: '目的站',
    dataIndex: 'destination-station',
  },
  {
    title: '运力服务商',
    dataIndex: 'shipment.vendor_info.name',
    key: 'shipment.vendor_info.name',
  },
  {
    title: '业务模式',
    dataIndex: 'biz_mode',
    key: 'biz_mode',
    render: (text, record, index) => {
      return BusinessMode.description(text);
    },
  },
  {
    title: '货品类型',
    dataIndex: 'seller_order_info.item_type',
    key: 'seller_order_info.item_type',
    render: (text, record, index) => {
      return GoodsType.description(text);
    },
  },
  {
    title: '期望送达',
    dataIndex: 'seller_order_info.shipping_time',
    key: 'seller_order_info.shipping_time',
    render: (text) => {
      const _date = utcToDate(text);
      _date.time.length = 2;
      return `${_date.date.join('-')}  ${_date.time.join(':')}`;
    },
  },
  {
    title: '顾客姓名',
    dataIndex: 'seller_order_info.consignee.name',
    key: 'seller_order_info.consignee.name',
  },
  {
    title: '顾客地址',
    dataIndex: 'seller_order_info.consignee.address',
    key: 'seller_order_info.consignee.address',
  },
  {
    title: '状态',
    dataIndex: 'state',
    render: (text, record, index) => {
      return StockOrdersState.description(text);
    },
  },
  {
    title: '操作人',
    dataIndex: 'operator',
    render: () => {
      return authorize.account.name
    },
  },
  {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
    render: (text, record, index) => callback(record, index),
  },
];

/**
 *  columns
 *  中转出站
 */
export const TRANSFER_OUTBOUND_SCAN_COLUMNS = callback => [
  {
    title: '订单编号',
    dataIndex: 'org_order_id',
    key: 'org_order_id',
    render: (text, record, index) => {
      return (
        <Link>
          {text}
        </Link>
      );
    },
  },
  {
    title: '商家名称',
    dataIndex: 'seller_order_info.seller.name',
    key: 'seller_order_info.seller.name',
  },
  {
    title: '目的站',
    dataIndex: 'done_stock_name',
    key: 'done_stock_name',
  },
  {
    title: '货品类型',
    dataIndex: 'seller_order_info.item_type',
    key: 'seller_order_info.item_type',
    render: (text, record, index) => {
      return GoodsType.description(text);
    },
  },
  {
    title: '期望送达',
    dataIndex: 'seller_order_info.shipping_time',
    key: 'seller_order_info.shipping_time',
    render: (text) => {
      const _date = utcToDate(text);
      _date.time.length = 2;
      return `${_date.date.join('-')}  ${_date.time.join(':')}`;
    },
  },
  {
    title: '顾客姓名',
    dataIndex: 'seller_order_info.consignee.name',
    key: 'seller_order_info.consignee.name',
  },
  {
    title: '顾客地址',
    dataIndex: 'seller_order_info.consignee.address',
    key: 'seller_order_info.consignee.address',
  },
  {
    title: '订单状态',
    dataIndex: 'state',
    key: 'state',
    render: (text, record, index) => {
      return StockOrdersState.description(text);
    },
  },
  {
    title: '操作人',
    dataIndex: 'operator',
    render: () => {
      return authorize.account.name
    },
  },
  {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
    render: (text, record, index) => callback(record, index),
  },
];

/**
 *  columns
 *  退货入站
 */
export const SALES_INBOUND_SCAN_COLUMNS = callback => [
  {
    title: '订单编号',
    dataIndex: 'org_order_id',
    key: 'org_order_id',
    render: (text, record, index) => {
      return (
        <Link>
          {text}
        </Link>
      );
    },
  },
  {
    title: '商家名称',
    dataIndex: 'seller_order_info.seller.name',
    key: 'seller_order_info.seller.name',
  },
  {
    title: '配送站',
    dataIndex: 'done_stock_name',
    key: 'done_stock_name',
  },
  {
    title: '业务模式',
    dataIndex: 'biz_mode',
    key: 'biz_mode',
    render: (text, record, index) => {
      return BusinessMode.description(text);
    },
  },
  {
    title: '货品类型',
    dataIndex: 'seller_order_info.item_type',
    key: 'seller_order_info.item_type',
    render: (text, record, index) => {
      return GoodsType.description(text);
    },
  },
  {
    title: '期望送达',
    dataIndex: 'seller_order_info.shipping_time',
    key: 'seller_order_info.shipping_time',
    render: (text) => {
      const _date = utcToDate(text);
      _date.time.length = 2;
      return `${_date.date.join('-')}  ${_date.time.join(':')}`;
    },
  },
  {
    title: '顾客姓名',
    dataIndex: 'seller_order_info.consignee.name',
    key: 'seller_order_info.consignee.name',
  },
  {
    title: '顾客地址',
    dataIndex: 'seller_order_info.consignee.address',
    key: 'seller_order_info.consignee.address',
  },
  {
    title: '异常标记',
    dataIndex: 'error_flag',
    key: 'error_flag',
    render: (text, record, index) => {
      return StockOrdersErrorFlag.description(text);
    },
  },
  {
    title: '操作人',
    dataIndex: 'operator',
    render: () => {
      return authorize.account.name
    },
  },
  {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
    render: (text, record, index) => callback(record, index),
  },
];

/**
 * columns
 * 待骑士确认订单
 */
export const KNIGHT_AFFIRM_ORDER_COLUMNS = callback => [
  {
    title: '订单编号',
    dataIndex: 'org_order_id',
    key: 'org_order_id',
    render: (text, record, index) => {
      return (
        <Link to={`/dispatcher/order/details?id=${record.id}`}>
          {text}
        </Link>
      );
    },
  },
  {
    title: '商家名称',
    dataIndex: 'seller_order_info.seller.name',
    key: 'seller_order_info.seller.name',
  },
  {
    title: '业务模式',
    dataIndex: 'biz_mode',
    key: 'biz_mode',
    render: (text, record, index) => {
      return BusinessMode.description(text);
    },
  },
  {
    title: '配送区域',
    dataIndex: 'vendor_order.area_info.name',
    key: 'vendor_order.area_info.name',
  },
  {
    title: '配送站',
    dataIndex: 'done_stock_name',
    key: 'done_stock_name',
  },
  {
    title: '订单状态',
    dataIndex: 'state',
    key: 'state',
    render: (text, record, index) => {
      return StockOrdersState.description(text);
    },
  },
  {
    title: '订单金额（元）',
    dataIndex: 'seller_order_info.order_amount',
    key: 'seller_order_info.order_amount',
    render: (text) => {
      return text ? (Number(text) / 100).toFixed(2) : '0.00'
    },
  },
  {
    title: '代付商家（元）',
    dataIndex: 'seller_order_info.extra_services.payment.amount',
    key: 'seller_order_info.extra_services.payment.amount',
    render: (text) => {
      return text ? (Number(text) / 100).toFixed(2) : '0.00'
    },
  },
  {
    title: '代收顾客（元）',
    dataIndex: 'seller_order_info.extra_services.cod.amount',
    key: 'seller_order_info.extra_services.cod.amount',
    render: (text) => {
      return text ? (Number(text) / 100).toFixed(2) : '0.00'
    },
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    key: 'created_at',
    render: (text) => {
      const _date = utcToDate(text);
      _date.time.length = 2;
      return `${_date.date.join('-')}  ${_date.time.join(':')}`;
    },
  },
  {
    title: '期望送达',
    dataIndex: 'seller_order_info.shipping_time',
    key: 'seller_order_info.shipping_time',
    render: (text) => {
      const _date = utcToDate(text);
      _date.time.length = 2;
      return `${_date.date.join('-')}  ${_date.time.join(':')}`;
    },
  },
  {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
    render: (text, record, index) => callback(record),
  },
];

/**
 * columns
 * 异常单处理
 */

export const EXCEPTION_ORDER_COLUMNS = callback => [
  {
    title: '订单编号',
    dataIndex: 'org_order_id',
    key: 'org_order_id',
    render: (text, record, index) => {
      return (
        <Link to={`/dispatcher/order/details?id=${record.id}`}>
          {text}
        </Link>
      );
    },
  },
  {
    title: '商家名称',
    dataIndex: 'seller_order_info.seller.name',
    key: 'seller_order_info.seller.name',
  },
  {
    title: '业务模式',
    dataIndex: 'biz_mode',
    key: 'biz_mode',
    render: (text, record, index) => {
      return BusinessMode.description(text);
    },
  },
  {
    title: '配送区域',
    dataIndex: 'vendor_order.area_info.name',
    key: 'vendor_order.area_info.name',
  },
  {
    title: '配送站',
    dataIndex: 'done_stock_name',
    key: 'done_stock_name',
  },
  {
    title: '结算方式',
    dataIndex: 'seller_order_info.pay_type',
    key: 'seller_order_info.pay_type',
    render: (text) => {
      return PaymentType.description(text);
    },
  },
  {
    title: '订单状态',
    dataIndex: 'state',
    key: 'state',
    render: (text, record, index) => {
      return StockOrdersState.description(text);
    },
  },
  {
    title: '异常类型',
    dataIndex: 'error_type',
    key: 'error_type',
    render: (text, record, index) => {
      return StockOrdersErrorType.description(text);
    },
  },
  {
    title: '异常标记',
    dataIndex: 'error_flag',
    key: 'error_flag',
    render: (text, record, index) => {
      return StockOrdersErrorFlag.description(text);
    },
  },
  {
    title: '异常备注',
    dataIndex: 'error_note',
    key: 'error_note',
  },
  {
    title: '订单金额（元）',
    dataIndex: 'seller_order_info.order_amount',
    key: 'seller_order_info.order_amount',
    render: (text) => {
      return text ? (Number(text) / 100).toFixed(2) : '0.00'
    },
  },
  {
    title: '代付商家（元）',
    dataIndex: 'seller_order_info.extra_services.payment.amount',
    key: 'seller_order_info.extra_services.payment.amount',
    render: (text) => {
      return text ? (Number(text) / 100).toFixed(2) : '0.00'
    },
  },
  {
    title: '代收顾客（元）',
    dataIndex: 'seller_order_info.extra_services.cod.amount',
    key: 'seller_order_info.extra_services.cod.amount',
    render: (text) => {
      return text ? (Number(text) / 100).toFixed(2) : '0.00'
    },
  },
  {
    title: '下单时间',
    dataIndex: 'created_at',
    key: 'created_at',
    render: (text) => {
      const _date = utcToDate(text);
      _date.time.length = 2;
      return `${_date.date.join('-')}  ${_date.time.join(':')}`;
    },
  },
  {
    title: '期望送达',
    dataIndex: 'seller_order_info.shipping_time',
    key: 'seller_order_info.shipping_time',
    render: (text) => {
      const _date = utcToDate(text);
      _date.time.length = 2;
      return `${_date.date.join('-')}  ${_date.time.join(':')}`;
    },
  },
  {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
    render: (text, record, index) => callback(record, index),
  },
];
/**
 * columns
 * 配送单查询
 */
export const DISTRIBUTION_ORDER_COLUMNS = callback => [
  {
    title: '订单编号',
    dataIndex: 'org_order_id',
    key: 'org_order_id',
    render: (text, record, index) => {
      return (
        <Link to={`/dispatcher/order/details?id=${record.id}`}>
          {text}
        </Link>
      );
    },
  },
  {
    title: '商家名称',
    dataIndex: 'seller_order_info.seller.name',
    key: 'seller_order_info.seller.name',
  },
  {
    title: '业务模式',
    dataIndex: 'biz_mode',
    key: 'biz_mode',
    render: (text, record, index) => {
      return BusinessMode.description(text);
    },
  },
  {
    title: '配送站',
    dataIndex: 'done_stock_name',
    key: 'done_stock_name',
  },
  {
    title: '结算方式',
    dataIndex: 'seller_order_info.pay_type',
    key: 'seller_order_info.pay_type',
    render: (text) => {
      return PaymentType.description(text);
    },
  },
  {
    title: '订单状态',
    dataIndex: 'state',
    key: 'state',
    render: (text, record, index) => {
      return StockOrdersState.description(text);
    },
  },
  {
    title: '订单金额（元）',
    dataIndex: 'seller_order_info.order_amount',
    key: 'seller_order_info.order_amount',
    render: (text) => {
      return text ? (Number(text) / 100).toFixed(2) : '0.00'
    },
  },
  {
    title: '代付商家（元）',
    dataIndex: 'seller_order_info.extra_services.payment.amount',
    key: 'seller_order_info.extra_services.payment.amount',
    render: (text) => {
      return text ? (Number(text) / 100).toFixed(2) : '0.00'
    },
  },
  {
    title: '代收顾客（元）',
    dataIndex: 'seller_order_info.extra_services.cod.amount',
    key: 'seller_order_info.extra_services.cod.amount',
    render: (text) => {
      return text ? (Number(text) / 100).toFixed(2) : '0.00'
    },
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    key: 'created_at',
    render: (text) => {
      if (text === undefined) {
        return '-- --';
      }
      const _date = utcToDate(text);
      _date.time.length = 2;
      return `${_date.date.join('-')}  ${_date.time.join(':')}`;
    },
  },
  {
    title: '期望送达',
    dataIndex: 'seller_order_info.shipping_time',
    key: 'seller_order_info.shipping_time',
    render: (text) => {
      if (text === undefined) {
        return '-- --';
      }
      const _date = utcToDate(text);
      _date.time.length = 2;
      return `${_date.date.join('-')}  ${_date.time.join(':')}`;
    },
  },
  {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
    render: (text, record, index) => callback(record),
  },
];

/**
 * columns
 * 中转单查询
 */

export const TRANSFER_ORDER_COLUMNS = callback => [
  {
    title: '订单编号',
    dataIndex: 'org_order_id',
    key: 'org_order_id',
    render: (text, record, index) => {
      return (
        <Link to={`/dispatcher/order/details?id=${record.id}`}>
          {text}
        </Link>
      );
    },
  },
  {
    title: '商家名称',
    dataIndex: 'seller_order_info.seller.name',
    key: 'seller_order_info.seller.name',
  },
  {
    title: '业务模式',
    dataIndex: 'biz_mode',
    key: 'biz_mode',
    render: (text, record, index) => {
      return BusinessMode.description(text);
    },
  },
  {
    title: '来源站',
    dataIndex: 'stock_info.name',
    key: 'stock_info.name',
  },
  {
    title: '配送站',
    dataIndex: 'done_stock_name',
    key: 'done_stock_name',
  },
  {
    title: '结算方式',
    dataIndex: 'seller_order_info.pay_type',
    key: 'seller_order_info.pay_type',
    render: (text) => {
      return PaymentType.description(text);
    },
  },
  {
    title: '订单状态',
    dataIndex: 'state',
    key: 'state',
    render: (text, record, index) => {
      return StockOrdersState.description(text);
    },
  },
  {
    title: '订单金额（元）',
    dataIndex: 'seller_order_info.order_amount',
    key: 'seller_order_info.order_amount',
    render: (text) => {
      return text ? (Number(text) / 100).toFixed(2) : '0.00'
    },
  },
  {
    title: '代付商家（元）',
    dataIndex: 'seller_order_info.extra_services.payment.amount',
    key: 'seller_order_info.extra_services.payment.amount',
    render: (text) => {
      return text ? (Number(text) / 100).toFixed(2) : '0.00'
    },
  },
  {
    title: '代收顾客（元）',
    dataIndex: 'seller_order_info.extra_services.cod.amount',
    key: 'seller_order_info.extra_services.cod.amount',
    render: (text) => {
      return text ? (Number(text) / 100).toFixed(2) : '0.00'
    },
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    key: 'created_at',
    render: (text) => {
      const _date = utcToDate(text);
      _date.time.length = 2;
      return `${_date.date.join('-')}  ${_date.time.join(':')}`;
    },
  },
  {
    title: '期望送达',
    dataIndex: 'seller_order_info.shipping_time',
    key: 'seller_order_info.shipping_time',
    render: (text) => {
      const _date = utcToDate(text);
      _date.time.length = 2;
      return `${_date.date.join('-')}  ${_date.time.join(':')}`;
    },
  },
  {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
    render: (text, record, index) => callback(record),
  },
];

/**
 * 配送单查询详情
 */

export const DISTRIBUTION_ORDER_DETAIL_COLUMNS = callback => [
  {
    title: '商品名称',
    dataIndex: 'product-name',
    key: 'product-name',
    render: (text, record) => {
      return stateTransform('event_name', record.event);
    },
  },
  {
    title: '商品单价（元）',
    dataIndex: 'product-price',
    key: 'product-price',
    render: (text) => {
      return stateTransform('state_operation', text);
    },
  },
  {
    title: '商品数量（单位）',
    dataIndex: 'product-num',
    key: 'product-num',
    render: (text, record) => {
      return record;
    },
  },
  {
    title: '合计（元）',
    dataIndex: 'total',
    key: 'total',
  },
];

/**
 * columns
 * 中转单详情
 */
export const DISTRIBUTION_ORDER_TRACE_COLUMNS = [
  {
    title: '处理时间',
    dataIndex: 'dispose-time',
    key: 'dispose-time',
    render: (text, record) => {
      return stateTransform('event_name', record.event);
    },
  },
  {
    title: '处理信息',
    dataIndex: 'dispose-news',
    key: 'dispose-news',
    render: (text) => {
      return stateTransform('state_operation', text);
    },
  },
  {
    title: '操作人（联系电话）',
    dataIndex: 'operator',
    key: 'operator',
    render: (text, record) => {
      return record;
    },
  },
];

/**
 * columns
 * 入站记录表
 */
export const INBOUND_RECORD_COLUMNS = [
  {
    title: '订单编号',
    dataIndex: 'org_order_id',
    key: 'org_order_id',
  },
  {
    title: '仓订单编号',
    dataIndex: 'stock_order_id',
    key: 'stock_order_id',
  },
  {
    title: '商家名称',
    dataIndex: 'order.seller.name',
    key: 'order.seller.name',
  },
  {
    title: '业务模式',
    dataIndex: 'order.biz_mode',
    key: 'order.biz_mode',
    render: (text, record, index) => {
      return BusinessMode.description(text);
    },
  },
  {
    title: '配送站',
    dataIndex: 'stock.name',
    key: 'stock.name',
  },
  {
    title: '顾客姓名',
    dataIndex: 'order.consignee.name',
    key: 'order.consignee.name',
  },
  {
    title: '顾客地址',
    dataIndex: 'order.consignee.address',
    key: 'order.consignee.address',
  },
  {
    title: '订单金额（元）',
    dataIndex: 'order.order_amount',
    key: 'order.order_amount',
    render: (text) => {
      return text ? (Number(text) / 100).toFixed(2) : '0.00'
    },
  },
  {
    title: '入站时间',
    dataIndex: 'created_at',
    key: 'created_at',
    render: (text) => {
      const _date = utcToDate(text);
      _date.time.length = 2;
      return `${_date.date.join('-')}  ${_date.time.join(':')}`;
    },
  },
  {
    title: '操作人（电话）',
    dataIndex: 'operator_info.name',
    key: 'operator_info.name',
    render: (text, record, index) => {
      return `${text} (${record.operator_info.mobile})`
    },
  },
  {
    title: '入站类型',
    dataIndex: 'stock_in_type',
    key: 'stock_in_type',
    render: (text, record, index) => {
      return StockOrdersLogType.description('in', text)
    },
  },
];

/**
 * columns
 * 出站记录表
 */

export const OUTBOUND_RECORD_COLUMNS = [
  {
    title: '订单编号',
    dataIndex: 'org_order_id',
    key: 'org_order_id',
  },
  {
    title: '仓订单编号',
    dataIndex: 'stock_order_id',
    key: 'stock_order_id',
  },
  {
    title: '商家名称',
    dataIndex: 'order.seller.name',
    key: 'order.seller.name',
  },
  {
    title: '业务模式',
    dataIndex: 'order.biz_mode',
    key: 'order.biz_mode',
    render: (text, record, index) => {
      return BusinessMode.description(text);
    },
  },
  {
    title: '配送站',
    dataIndex: 'stock.name',
    key: 'stock.name',
  },
  {
    title: '顾客姓名',
    dataIndex: 'order.consignee.name',
    key: 'order.consignee.name',
  },
  {
    title: '顾客地址',
    dataIndex: 'order.consignee.address',
    key: 'order.consignee.address',
  },
  {
    title: '订单金额（元）',
    dataIndex: 'order.order_amount',
    key: 'order.order_amount',
    render: (text) => {
      return text ? (Number(text) / 100).toFixed(2) : '0.00'
    },
  },
  {
    title: '出站时间',
    dataIndex: 'created_at',
    key: 'created_at',
    render: (text) => {
      const _date = utcToDate(text);
      _date.time.length = 2;
      return `${_date.date.join('-')}  ${_date.time.join(':')}`;
    },
  },
  {
    title: '操作人（电话）',
    dataIndex: 'operator_info.name',
    key: 'operator_info.name',
    render: (text, record, index) => {
      const operatorInfo = record.operator_info ? record.operator_info.mobile ? record.operator_info.mobile : '' : ''
      if (operatorInfo) {
        return `${text} (${operatorInfo})`
      }
      return text || ''
    },
  },
  {
    title: '出站类型',
    dataIndex: 'stock_out_type',
    key: 'stock_out_type',
    render: (text, record, index) => {
      return StockOrdersLogType.description('out', text)
    },
  },
];


// 仓订单 - 订单详情 - 订单明细 columns
export const STOCK_ORDER_DETAILS_INFO_COLUMNS = [{
  title: '商家名称',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '商品单价（元）/（规格）',
  dataIndex: 'price',
  key: 'price',
  render: (text, record) => {
    const price = (text && (Number(text) / 100).toFixed(2)) || ''
    if (price) {
      return `${price} / ${record.specs}`
    }
    return ''
  },
}, {
  title: '商品数量',
  dataIndex: 'quantity',
  key: 'quantity',
}, {
  title: '合计（元）',
  dataIndex: 'money',
  key: 'money',
  render: (text, record) => {
    return (Number(record.price * record.quantity) / 100).toFixed(2) || '0.00'
  },
}];

//  仓订单 - 订单详情 - 订单追踪 columns
export const STOCK_ORDER_TRACE_INFO_COLUMNS = [{
  title: '处理时间',
  dataIndex: 'created_at',
  key: 'created_at',
  render: (text, record, index) => {
    const date = utcToDate(text);
    date.time.length = 2;
    return `${date.date.join('-')}  ${date.time.join(':')}`;
  },
}, {
  title: '处理信息',
  dataIndex: 'event',
  key: 'event',
  render(text, record) {
    let result = ''
    const note = record.note === '' ? '【 无 】' : `【 ${record.note} 】`;
    const stock = dot.get(record, 'stock.name', '') ? `${dot.get(record, 'stock.name')}仓库` : '';
    const stockOrderId = dot.get(record, 'stock_order_id', '')
    const shipmentId = dot.get(record, 'shipment_id', '')
    const courierName = dot.get(record, 'courier.name', '')
    const courierMobile = dot.get(record, 'courier.mobile', '')
    switch (text) {
      case 'stock-order-stock-in':
        result = `订单已到达配送站${stock}仓库，备注${note}，关联仓库单号：${stockOrderId}`;
        break;
      case 'shipment-error':
        result = `运单异常，异常原因：${OrderTrackEvent.message(record.error_flag)}`;
        break;
      case 'stock-order-assigned':
        result = `订单商品已分配给骑士，准备配送，详情请联系骑士：${courierName}，电话：${courierMobile}，关联运单号：${shipmentId}`
        break;
      case 'stock-order-confirmed':
        result = `${OrderTrackEvent.message(text, stock)}`
        break;
      case 'seller-order-closed':
      case 'vendor-order-closed':
      case 'stock-order-redispatch':
      case 'stock-order-error':
        result = `${OrderTrackEvent.message(text, note)}`;
        break;
      default:
        result = `${OrderTrackEvent.message(text)}`;
    }
    return result;
  },
}, {
  title: '操作人（联系电话）',
  dataIndex: 'operator_info',
  key: 'operator_info',
  render: (text, record, index) => {
    if (text) {
      return `${text.name} (${text.mobile})`
    } else if (record.courier) {
      return `${record.courier.name} (${record.courier.mobile})`
    }
    return ''
  },
}];
