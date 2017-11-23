
import React from 'react';
import { Table, Badge, Pagination } from 'antd';
import { Link } from 'dva/router';
import { OrderParams } from '../exports';
import { BusinessMode, VendorOrderState, Unit } from '../../../../application/define';

const { rgReg, requestPagerSize, requestPageNumber } = OrderParams;

//引入枚举值
import { AFFILIATE, DIRECT } from '../enumerate'

const {
  stateTransform,
  utcToDate,
} = window.tempAppTool;// 全局变量 来自aoao-core-api-service/src/utils/utils.js

class StateTable extends React.Component {
  constructor(props) {
    super();

    this.columns = [{
      title: '订单编号',
      dataIndex: 'org_order_id',
      key: 'org_order_id',
      render: (text, record) => (
        <span>
          <Link to={`/order/details?id=${record.id}`}>{ text }</Link>
        </span>
      ),
    }, {
      title: '商家名称',
      dataIndex: 'seller_order.seller.name',
      key: 'seller_order.seller.name',
      render: (text, record, index) => { return text; },
    }, {
      title: '业务模式',
      dataIndex: 'biz_mode',
      key: 'biz_mode',
      render: (text, record) => {
        return BusinessMode.description(text);
      },
    }, {
      title: '配送区域',
      dataIndex: 'area_info.name',
      key: 'area_info.name',
      render: (text, record, index) => { return text; },
    }, {
      title: '配送站',
      dataIndex: 'delivery_stock.name',
      key: 'delivery_stock.name',
      render: (text, record) => {
        return text || '无';
      },
    }, {
      title: '配送距离(km)',
      dataIndex: 'seller_order.distance',
      key: 'seller_order.distance',
      render: (text, record, index) => { return text / 1000; },
    }, {
      title: '订单状态',
      dataIndex: 'state',
      key: 'state',
      render: (text, record, index) => { return VendorOrderState.description(text); },
    }, {
      title: '订单金额（元）',
      dataIndex: 'seller_order.order_amount',
      key: 'seller_order.order_amount',
      render: (text) => {
        return Unit.exchangePriceToYuan(text) || '0.00';
      },
    }, {
      title: '代付商家',
      dataIndex: 'seller_order.extra_services.payment.amount',
      key: 'seller_order.extra_services.payment.amount',
      render: (text, record, index) => {
        return (text && (Number(text) / 100).toFixed(2)) || '0.00';
      },
    }, {
      title: '代收顾客',
      dataIndex: 'seller_order.extra_services.cod.amount',
      key: 'seller_order.extra_services.cod.amount',
      render: (text, record, index) => {
        return (text && (Number(text) / 100).toFixed(2)) || '0.00';
      },
    }, {
      title: '下单时间',
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
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      render: (text, record, index) => {
        return (
          <div>
            <Link onClick={() => this.props.showOrHideNoticePanel(1, true, record.id)}>取消订单</Link>&nbsp;&nbsp;
            {/*<Link onClick={ () => this.props.showOrHideNoticePanel(2, true, record.id) }>重新分单</Link>*/}
          </div>
        )
      },
    }];
  }

  componentWillMount() {
    const { type } = this.props;
    const deliveryCost = {
      title: '配送费（元）',
      dataIndex: 'shipping_fee',
      key: 'shipping_fee',
      render: (text) => {
        return (text && (Number(text) / 100).toFixed(2)) || '0.00';
      },
    }
    if (type === AFFILIATE) {
      // 加盟订单 table columns 与 直营订单 差异化
      this.columns.splice(6, 0, deliveryCost)
      this.columns[this.columns.length - 1] = {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        render: (text, record, index) => {
          return (
            <Link onClick={() => this.props.showOrHideNoticePanel(true, record.id)}>取消订单</Link>
          )
        },
      }
    }
  }

  componentWillReceiveProps = (nextProps) => {
    //update 商家列表
    this.setState({
      closeOrderList: nextProps.closeOrderList,
      closeMeta: nextProps.closeMeta,
      current: nextProps.current,
    });
  };
  render() {
    const { pagination, vendorOrderList } = this.props;
    const { columns } = this;
    return (
      <Table
        rowKey={(record, index) => { return index }}
        dataSource={vendorOrderList.data}
        columns={columns}
        pagination={pagination}
      />
    );
  }
}
module.exports = StateTable;
