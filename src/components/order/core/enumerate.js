import React from 'react';
import { OrderTrackEvent, StockOrdersErrorFlag, SellerOrdersErrorFlag } from '../../../application/define';
import dot from 'dot-prop';

const {
  stateTransform,
  utcToDate,
} = window.tempAppTool;

//订单明细下载 -> 日订单明细
export const DOWNLOAD_DAILY_DETAIL = 'DOWNLOAD_DAILY_DETAIL';

//订单明细下载 -> 月订单明细
export const DOWNLOAD_MONTHLY_DETAIL = 'DOWNLOAD_MONTHLY_DETAIL';

//直营
export const DERECT = 'DERECT';

//加盟
export const AFFILIATE = 'AFFILIATE';

// 直营明细
export const DERECT_DETAIL = 'DERECT_DETAIL';

// 加盟明细
export const AFFILIATE_DETAIL = 'AFFILIATE_DETAIL';

// 分单管理 - 订单详情 - 订单明细 columns
export const VENDOR_ORDER_DETAILS_INFO_COLUMNS = [{
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

//  分单管理 - 订单详情 - 订单追踪 columns
export const VENDOR_ORDER_TRACE_INFO_COLUMNS = bizMode => [{
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
      case 'shipment-accepted':
        if (bizMode === 30) {
          result = `骑士接单，详情请联系骑士：${courierName}，联系电话：${courierMobile}，准备揽收，关联运单号：${shipmentId}；`
        } else {
          result = `骑士${courierName}接单，正赶往取货点取货，联系电话：${courierMobile}`;
        }
        break;
      case 'shipment-error':
        if (bizMode === 30) {
          result = `配送异常，原因：${SellerOrdersErrorFlag.description(record.error_flag)}`
        } else {
          result = `运单异常，异常原因：${SellerOrdersErrorFlag.description(record.error_flag)}`;
        }
        break;
      case 'shipment-reassigned':
        result = `订单改派给骑士${courierName}，联系电话：${courierMobile}`;
        break;
      case 'stock-order-confirmed':
        result = `${OrderTrackEvent.message(text, stock)}`
        break;
      case 'stock-order-stock-in':
        if (bizMode === 30) {
          if (record.stock_in_type === 4 || record.stock_in_type === 5) {
            result = `${stock}揽收入站，备注${note}，联系电话：${courierMobile}，关联仓库单号：${stockOrderId}`
          } else if (record.stock_in_type === 3) {
            result = `${stock}入站，备注${note}，联系电话：${courierMobile}，关联仓库单号：${stockOrderId}`
          } else if (record.stock_in_type === 6) {
            result = `${stock}退货入站，备注${note}，联系电话：${courierMobile}，关联仓库单号：${stockOrderId}`
          } else if (record.stock_in_type === 2) {
            result = `订单已到达配送站${stock}，备注${note}，联系电话：${courierMobile}，关联仓库单号：${stockOrderId}`
          }
        } else {
          result = `订单已到达配送站${stock}，备注${note}，关联仓库单号：${stockOrderId}`
        }
        break;
      case 'stock-order-done':
        if (bizMode === 30) {
          if (record.stock_out_type === 3) {
            const nextStock = dot.get(record, 'next_stock.name', '')
            result = `${stock}出站，下一站：${nextStock}仓库`
          } else {
            result = `${OrderTrackEvent.message(text, note)}`
          }
        }
        break;
      case 'stock-order-assigned':
        result = `订单商品已分配给骑士，准备配送，详情请联系骑士：${courierName}，电话：${courierMobile}，关联运单号：${shipmentId}`
        break;
      case 'seller-order-closed':
      case 'vendor-order-closed':
      case 'stock-order-redispatch':
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
