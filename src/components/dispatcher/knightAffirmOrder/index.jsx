// 待骑士确认订单页面
import dot from 'dot-prop'
import React, { Component } from 'react';
import { Modal, Button, Form, Row, Col, Input, DatePicker, message } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { DispatcherActions } from '../../actions';
import { authorize } from '../../../application';
//顶部搜索组件
import Search from '../core/search';
//订单数据表格
import OrderTable from '../core/table';

import style from './style.less';

//引用通用枚举值
import { KNIGHT_AFFIRM_ORDER, KNIGHT_AFFIRM_ORDER_COLUMNS } from '../core/enumerate';

const [FormItem, confirm] = [Form.Item, Modal.confirm];
const { dateFormat, utcToDate } = window.tempAppTool;
const { getStockOrdersList, updateStateFunc, fetchStockOrdersRedispatch } = DispatcherActions;

class KnightAffirmOrder extends Component {
  constructor(props) {
    super(props);
    const { dispatch, SiteOperate } = props;
    this.state = {
      stockListByDelivery: SiteOperate.stockListByDelivery, //配送站列表
      stockOrdersList: SiteOperate.stockOrdersList,         //仓订单列表
      ordersPage: 1,          //仓订单默认分页
      activeStockId: '', //当前选中的配送站，默认为列表第一个
    };

    this.private = {
      dispatch,
      vendorId: authorize.auth.vendorId, //服务商ID
      cityCode: dot.get(authorize.vendor, 'city.code'), //城市编号
      isDispatch: true, //是否有配送能力（true：是 false：否）
      closedType: 1, //关闭原因，int类型，随便写的
      state: 45, //已分配
      page: 1,                    //默认分页
      limit: 10,                  //默认分页数
      sort: '{"_id":-1}',         //排序
      orgOrderId: '',               //商户订单编号
      itemLayout: {
        labelCol: { span: 5 },
        wrapperCol: { span: 16 },
      },
    };

    this.title = {
      warning: '请先选择订单',
    };

    // 搜索钩子函数
    this.onSearch = this.onSearch.bind(this);
    // 操作回调函数
    this.operateCallBack = this.operateCallBack.bind(this);
    // 获取单列表
    this.renderStockOrdersList = this.renderStockOrdersList.bind(this);
    // 撤销分配
    this.stockOrdersRedispatch = this.stockOrdersRedispatch.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.private;
    const { SiteOperate } = nextProps;
    const { stockOrdersList, updateState, stockListByDelivery } = SiteOperate;

    // 开始更新数据
    if (updateState) {
      const { stockOrderIndexs, stockOrdersList } = this.state;
      // 获取仓订单列表
      this.renderStockOrdersList();
      // 重置更新开关
      const params = {
        state: false,
      };
      dispatch({ type: updateStateFunc, payload: params });
    }
    // 仅初始化一次，防止污染
    if (!this.state.activeStockId && stockListByDelivery.data.length > 0) {
      this.setState({
        activeStockId: stockListByDelivery.data[0].id,
      }, () => {
        // 获取仓订单列表
        this.renderStockOrdersList();
      });
    }
    this.setState({
      stockOrdersList,
    });
  }

  // 获取仓订单列表
  renderStockOrdersList() {
    const { dispatch, vendorId, state, limit, orgOrderId, startTime, endTime } = this.private;
    const { ordersPage, activeStockId } = this.state;
    const params = {
      vendorId,
      stockId: activeStockId,
      page: ordersPage,
      state,
      limit,
    };
    if (startTime) {
      params.startTime = startTime;
    }
    if (endTime) {
      params.endTime = endTime;
    }
    if (orgOrderId) {
      params.orgOrderId = orgOrderId;
    }
    dispatch({ type: getStockOrdersList, payload: params });
  }

  // 搜索函数钩子
  onSearch(values) {
    const { dispatch } = this.private;
    const activeStockId = values.stock ? values.stock : '';
    this.private.orgOrderId = values.org_order_id ? values.org_order_id : '';
    try {
      if (values.date[0]) {
        const dateTime = utcToDate(values.date[0]);
        const date = dateTime.date.join('-');
        const time = dateTime.time.join(':');
        this.private.startTime = `${date} ${time}`;
      }
      if (values.date[1]) {
        const dateTime = utcToDate(values.date[1]);
        const date = dateTime.date.join('-');
        const time = dateTime.time.join(':');
        this.private.endTime = `${date} ${time}`;
      }
      if (values.date.length === 0) {
        this.private.startTime = ''
        this.private.endTime = ''
      }
    } catch (error) {
      this.private.startTime = ''
      this.private.endTime = ''
    }
    this.setState({
      activeStockId,
      ordersPage: 1,
    }, () => {
      this.renderStockOrdersList();
    })
  }

  // 操作 回调函数
  operateCallBack(record) {
    return <Link onClick={() => this.stockOrdersRedispatch([record.id])}>撤销分配</Link>;
  }

  // 撤销分配
  stockOrdersRedispatch(stockOrderIds) {
    const { dispatch } = this.private;
    confirm({
      title: '撤销分配',
      content: '当前选中 1 笔，确认撤销分配',
      onOk() {
        const params = {
          stockOrderIds,
        };
        dispatch({ type: fetchStockOrdersRedispatch, payload: params });
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  render() {
    const { stockOrdersList, updateState, stockListByDelivery, ordersPage, activeStockId } = this.state;
    const { renderStockOrdersList, onSearch, operateCallBack } = this;
    const { limit } = this.private;
    const pagination = {
      total: dot.get(stockOrdersList,'_meta.result_count',0),
      pageSize: limit,
      showTotal: (total) => {
        return `总共 ${total} 条`;
      },
      onShowSizeChange: (current, pageSize) => {
        this.props.onShowSizeChange(current, pageSize);
      },
      current: ordersPage,
      onChange: (current) => {
        this.setState(
          {
            ordersPage: current,
          },
          () => {
            renderStockOrdersList();
          },
        );
      },
    };
    const searchParams = {
      type: KNIGHT_AFFIRM_ORDER,
      stockListByDelivery,
      onSearch,
      activeStockId,
    };
    const tableParams = {
      type: KNIGHT_AFFIRM_ORDER,
      columns: KNIGHT_AFFIRM_ORDER_COLUMNS(operateCallBack),
      stockOrdersList,
      pagination,
    };
    return (
      <div className="con-body main-list">
        {/* 顶部搜索组件 */}
        <Search {...searchParams} />
        {/* 订单数据表格 */}
        <OrderTable {...tableParams} />
      </div>
    );
  }
}

function mapStateToProps({ SiteOperate }) {
  return { SiteOperate };
}

export default connect(mapStateToProps)(KnightAffirmOrder);
