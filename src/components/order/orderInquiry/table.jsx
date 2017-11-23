import React, { Component, PropTypes } from 'react';
import { Button, Table, Tooltip, Icon } from 'antd';
import { Link } from 'dva/router';
import { isEmptyObject } from '../../../utils/newUtils';
import { BusinessMode, VendorOrderState, Unit } from '../../../application/define';

const { stateTransform, utcToDate, numberDateToStr } = window.tempAppTool;

const popContent = (
      <span>为配送费支付方式包括：余额支付、现金支付<br />
      1.余额支付：为使用账户余额支付 <br />
      2.现金支付：为先发布订单，后期与商家进行现金结算<br />
      </span>
    )
const columns = [
  {
    title: '订单编号',
    dataIndex: 'org_order_id',
    key: 'org_order_id',
    render: (text, record) => (
      <Link to={`/order/details?id=${record.id}`}>{ text }</Link>
    ),
  }, {
    title: '商家名称',
    dataIndex: 'seller_order.seller.name',
    key: 'seller_order.seller.name',
    width: 100,
  }, {
    title: '业务模式',
    dataIndex: 'biz_mode',
    key: 'biz_mode',
    render: (text, record) => {
      return BusinessMode.description(text);
    },
  }, {
    title: '订单类型',
    dataIndex: 'is_direct_contracted',
    render: (text, record) => {
      return text ? '直营' : '加盟';
    },
  }, {
    title: '配送区域',
    dataIndex: 'area_info.name',
    key: 'area_info.name',
    render: (text, record) => {
      return text || '无';
    },
  }, {
    title: '配送站',
    dataIndex: 'delivery_stock.name',
    key: 'delivery_stock.name',
    render: (text, record) => {
      return text || '无';
    },
  }, {
    title: '配送距离（km）',
    dataIndex: 'seller_order.distance',
    key: 'seller_order.distance',
    render: (text) => {
      let text1 = text / 1000;
      text1 = text1.toFixed(3)
      return text1;
    },
  }, {
    title: '配送费（元）',
    dataIndex: 'shipping_fee',
    key: 'shipping_fee',
    render: (text) => {
      return (text && (Number(text) / 100).toFixed(2)) || '0.00';
    },
  }, {
    title: (
        <div>结算方式
        <Tooltip title={ popContent } arrowPointAtCenter>
          <Icon type="info-circle" />
        </Tooltip>
        </div>
      ),
    dataIndex: 'seller_order.pay_type',
    key: 'seller_order.pay_type',
    render: (text, record) => {
      return stateTransform('pay_type', text);
    },
  },
  // {
  //   title: '支付方式',
  //   dataIndex: 'seller_order.pay_type',
  //   key: 'seller_order.pay_type',
  //   filterDropdown: (
  //     <div />
  //   ),
  //   filterDropdownVisible: true,
  //   filterIcon: <Tooltip
  //     placement="top"
  //     overlayClassName="history-tooltip"
  //     onVisibleChange={visible => modifyText(visible, payWayContent)}
  //     title={<span />}
  //   >
  //     <Icon type="info-circle" />
  //   </Tooltip>,
  //   render: (text) => {
  //     return stateTransform('pay_type', text);
  //   },
  // },
  {
    title: '订单状态',
    dataIndex: 'state',
    key: 'state',
    render: (text) => {
      return VendorOrderState.description(text);
    },

  }, {
    title: '订单金额（元）',
    dataIndex: 'seller_order.order_amount',
    key: 'seller_order.order_amount',
    render: (text) => {
      return Unit.exchangePriceToYuan(text) || '0.00';
    },
  }, {
    title: '代付商家 (元) ',
    dataIndex: 'seller_order.extra_services.payment',
    key: 'seller_order.extra_services.payment',
    render: (text) => {
      if (text && !isEmptyObject(text)) {
        return (Number(text.amount) / 100).toFixed(2);
      }
      return '0.00';
    },
  }, {
    title: '代收顾客 (元) ',
    dataIndex: 'seller_order.extra_services.cod',
    key: 'seller_order.extra_services.cod',
    render: (text) => {
      if (text && !isEmptyObject(text)) {
        return (Number(text.amount) / 100).toFixed(2);
      }
      return '0.00';
    },
  }, {
    title: '下单时间',
    dataIndex: 'created_at',
    key: 'created_at',
    render: (text) => {
      const _date = utcToDate(text);
      _date.time.length = 2;
      return `${_date.date.join('-')}  ${_date.time.join(':')}`;
    },
    sorter: (a, b) => { return new Date(a.created_at) - new Date(b.created_at) },
  }, {
    title: '期望送达',
    dataIndex: 'plan_shipping_date',
    key: 'plan_shipping_date',
    render: (text, record) => {
      return `${numberDateToStr(text)}  ${record.plan_shipping_time}`;
    },
  }, {
    title: '送达时间',
    dataIndex: 'done_at',
    key: 'done_at',
    render: (text) => {
      if (text !== '') {
        const _date = utcToDate(text);
        _date.time.length = 2;
        return `${_date.date.join('-')}  ${_date.time.join(':')}`;
      }
      return '-- --'
    },
  },
];

//显示隐藏回调
function modifyText(visible, reminderText) {
  if (visible) {
    document.querySelector('.history-tooltip .ant-tooltip-inner').innerHTML = reminderText
  }
}

class VendorOrderTable extends Component {
  constructor(props) {
    super();
    this.state = {
    }
    this.private = {
    }
  }

  render() {
    const { vendorOrderList, pagination, rowSelection } = this.props;
    return (
      <Table
        bordered
        rowKey={(record, index) => { return index }}
        columns={columns}
        dataSource={vendorOrderList.data}
        pagination={pagination}
        rowSelection={rowSelection}
      />
    );
  }
}

export default VendorOrderTable;
