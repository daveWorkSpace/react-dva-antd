import React from 'react';
import { Button, Table, Tooltip, Icon } from 'antd';
import { OrderTrackEvent, StockOrdersErrorFlag, SellerOrdersErrorFlag, SellerOrdersColsedType, ExportState } from '../../application/define';
import { prctoMinute } from '../../utils/newUtils';
import dot from 'dot-prop';

const {
  stateTransform,
  utcToDate,
  numberDateToStr,
} = window.tempAppTool;

//显示隐藏回调
function modifyText(visible, reminderText) {
  if (visible) {
    document.querySelector('.history-tooltip .ant-tooltip-inner').innerHTML = reminderText
  }
}

//枚举顶部模块表格头
export const OPERATIONS_SEARCH_ORDER_COLUMNS = callback => [{
  title: '订单编号',
  dataIndex: 'org_order_id',
  key: 'org_order_id',
  render: (text, record, index) => {
    return callback(record)
  },
}, {
  title: '商家名称',
  dataIndex: 'seller.name',
  key: 'seller.name',
}, {
  title: '所属区域',
  dataIndex: 'area.name',
  key: 'area.name',
}, {
  title: '骑士名称',
  dataIndex: 'courier.name',
  key: 'courier.name',
}, {
  title: '骑士手机',
  dataIndex: 'courier.mobile',
  key: 'courier.mobile',
}, {
  title: (
    <div>结算方式
        <Tooltip title="结算方式为配送费结算方式" arrowPointAtCenter>
        <Icon type="info-circle" />
      </Tooltip>
    </div>
  ),
  dataIndex: 'pay_type',
  key: 'pay_type',
  render: (text) => {
    return stateTransform('pay_type', text);
  },
}, {
  title: '配送距离（km）',
  dataIndex: 'distance',
  key: 'distance',
  render: (text, record, index) => {
    return text / 1000;
  },
}, {
  title: (
    <div>配送时效（min）
        <Tooltip title="配送时效即送达时间与期望送达时间的差值，带括号的为早达时长" arrowPointAtCenter>
        <Icon type="info-circle" />
      </Tooltip>
    </div>
  ),
  dataIndex: 'deliveryTime',
  key: 'deliveryTime',
  render: (text, record) => {
    if (record.delivery_state === 100) {
      const plan_date = numberDateToStr(record.plan_shipping_date).split('-');
      const plan_time = record.plan_shipping_time.split(':');
      const _done = new Date(record.done_at);
      plan_date[1] -= 1;
      const _plan = new Date(...plan_date, ...plan_time);
      const _showMins = ((_done - _plan) / 1000 / 60).toFixed(1) * 1;
      return _showMins > 0 ? _showMins : `(${_showMins * -1})`;
    }
    return '--';
  },
}, {
  title: '运单状态',
  dataIndex: 'state',
  key: 'state',
  render: (text, record) => {
    return stateTransform('delivery_state', text)
  },
}, {
  title: '订单金额（元）',
  dataIndex: 'o3_order_amount',
  key: 'o3_order_amount',
  render: (text) => {
    let text1 = text / 100;
    text1 = text1.toFixed(2)
    return text1;
  },
}, {
  title: '代付商家（元）',
  dataIndex: 'extra_services.payment.amount',
  key: 'extra_services.payment.amount',
  render: (text) => {
    return text ? (Number(text) / 100).toFixed(2) : '0.00'
  },
}, {
  title: '代收顾客（元）',
  dataIndex: 'extra_services.cod.amount',
  key: 'extra_services.cod.amount',
  render: (text) => {
    return text ? (Number(text) / 100).toFixed(2) : '0.00'
  },
}, {
  title: '创建时间',
  dataIndex: 'created_at',
  key: 'created_at',
  render: (text, record, index) => {
    const date = utcToDate(text);
    date.time.length = 2;
    return `${date.date.join('-')}  ${date.time.join(':')}`;
  },
}, {
  title: '期望送达',
  dataIndex: 'shipping_time',
  key: 'shipping_time',
  render: (text, record, index) => {
    const date = utcToDate(text);
    date.time.length = 2;
    return `${date.date.join('-')}  ${date.time.join(':')}`;
  },
}, {
  title: '送达时间',
  dataIndex: 'done_at',
  key: 'done_at',
  render: (text, record, index) => {
    if (record.state === 100) {
      const date = utcToDate(text);
      date.time.length = 2;
      return `${date.date.join('-')}  ${date.time.join(':')}`;
    }
    return '--'
  },
}]

// 订单管理 - 服务商订单导出
export const EXPOER_TABLE = callback => [{
  title: '任务创建时间',
  dataIndex: 'created_at',
  key: 'created_at',
  render: (text, record) => {
    const date = utcToDate(text);
    date.time.length = 2;
    return `${date.date.join('-')} ${date.time.join(':')}`;
  }
}, {
  title: '类型',
  dataIndex: 'time_type',
  key: 'timeType',
  render: (text, record) => {
    let timeType = '';
    if (text == 1) {
      timeType = '按创建时间';
    }else {
      timeType = '按期望送达时间';
    }
    return timeType;
  },
}, {
  title: '时间段',
  dataIndex: 'docs',
  key: 'dateTime',
  render: (text, record) => {
    const start = new Date(text.start_time.$date);
    const starTime =utcToDate(start) ;
    const end = new Date(text.end_time.$date);
    const endTime = utcToDate(end);
    starTime.time.length = 2;
    endTime.time.length = 2;
    return `${starTime.date.join('-')} ${starTime.time.join(':')} 至 ${endTime.date.join('-')} ${endTime.time.join(':')}`;
  },
}, {
  title: '状态',
  dataIndex: 'state',
  key: 'state',
  render: (text, record) => {
    let content = '';
    switch (text) {
      case 0: content = '待处理'
        break;
      case 50: content = '处理中'
        break;
      case 100: content = '处理成功'
        break;
      case -100: content = '处理失败'
        break;
      default: content = '其他'
    }
    return content;
  }
}, {
  title: '操作人',
  dataIndex: 'operator_info',
  key: 'operator_id',
  render: (text,record)=>{
    return text && text.name;
  }
}, {
  title: '操作',
  dataIndex: 'path',
  key: 'operation',
  render: (text, record) => {
    // 已完成状态 显示下载
    if (record.state === ExportState.succes) {
      return (
        <a className="down_link" onClick={() => callback(text)}>
          <Icon style={{ fontWeight: '700', fontSize: 16 }} type="download" />
        </a>
      )
    }else {
      return '---'
    }

  },
}
]

// 运营管理 - 运单详情 - 订单追踪 columns
export const OPERATIONS_DETAILS_TRACE_INFO_COLUMNS = [{
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
    const stock = dot.get(record, 'stock.name', '') ? `${dot.get(record, 'stock.name')}` : '';
    const stockOrderId = dot.get(record, 'stock_order_id', '')
    const courierName = dot.get(record, 'courier.name', '')
    const courierMobile = dot.get(record, 'courier.mobile', '')
    switch (text) {
      case 'shipment-accepted':
        result = `骑士${courierName}接单，正赶往取货点取货，联系电话：${courierMobile}`;
        break;
      case 'shipment-error':
        result = `运单异常，异常原因：${SellerOrdersErrorFlag.description(record.error_flag)}`;
        break;
      case 'shipment-reassigned':
        result = `订单改派给骑士${courierName}，联系电话：${courierMobile}`;
        break;
      case 'stock-order-assigned':
        result = `订单商品已分配给骑士，准备配送，详情请联系骑士：${courierName}，电话：${courierMobile}，关联单号：${stockOrderId}`
        break;
      case 'shipment-closed':
        result = `运单已关闭，关闭原因：${SellerOrdersColsedType.description(record.closed_type)}，备注：${note}`;
        break;
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
}]

// 运营管理 - 运单详情 - 推单记录 columns
export const OPERATIONS_DETAILS_PUSH_RECORD_COLUMNS = [{
  title: '推送时间',
  dataIndex: 'created_at',
  key: 'created_at',
  render: (text, record) => {
    const date = utcToDate(text);
    return `${date.date.join('-')}  ${date.time.join(':')}`;
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
    return '-- --'
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
    let result =
      record.closed_type === 10 ? '重新计算' :
        record.closed_type === 20 ? '其他人已接单' :
          record.closed_type === 30 ? '运单关闭' : '';

    if (record.closed_type === -100) {
      result =
        record.error_flag === 40 ? '有单无货' :
          record.error_flag === 41 ? '货损' :
            record.error_flag === 42 ? '其他原因' : ''
    }

    return result;
  },
},
];
