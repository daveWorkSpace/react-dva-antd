// 中转单查询页面
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
import {
  TRANSFER_ORDER,
  TRANSFER_ORDER_COLUMNS,
} from '../core/enumerate'

const FormItem = Form.Item;
const { dateFormat, utcToDate } = window.tempAppTool;

const {
  getStockOrdersList,
  clearStockOrder,
  fetchStockOrdersClose,
  updateStateFunc,
} = DispatcherActions;

class TransferOrder extends Component {
  constructor(props) {
    super(props);
    const { dispatch, SiteOperate } = props;
    this.state = {
      stockListByDelivery: SiteOperate.stockListByDelivery, //配送站列表
      stockOrdersList: SiteOperate.stockOrdersList,         //仓订单列表
      visible: false,       //面板显示状态
      ordersPage: 1,        //初始化分页
      stockOrderIds: [],    //当前选中的仓订单id列表
      updateState: false,   //更新状态
    };

    this.private = {
      dispatch,
      vendorId: authorize.auth.vendorId,                //服务商ID
      cityCode: dot.get(authorize.vendor, 'city.code'), //城市编号
      state: 100,                                       //仓库状态（100：启用 -100：禁用）
      isDispatch: true,                                 //是否有配送能力（true：是 false：否）
      stockInType: '3,5',                               //入库类型(2:配送入3:中转入4:揽收配送入5:揽收中转入)
      closedType: 1,                                    //关闭原因，int类型，随便写的
      page: 1,              //默认分页
      size: 999,            //废弃参数
      limit: 10,            //默认分页数
      sort: '{"_id":-1}',   //排序
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
    // 取消订单回调函数
    this.cancelOrderFunc = this.cancelOrderFunc.bind(this);
    // 取消订单面板
    this.operatePanel = this.operatePanel.bind(this);
    // 弹出 取消订单面板
    this.showOrHideOperatePanel = this.showOrHideOperatePanel.bind(this);
    // 获取配送单列表
    this.renderStockOrdersList = this.renderStockOrdersList.bind(this);
    // 批量选择订单，传递给 table 组件用
    this.selectOrderByBatch = this.selectOrderByBatch.bind(this);
  }
  componentWillMount() {
    // 跳转页面 清除仓订单数据
    const { dispatch } = this.private;
    dispatch({
      type: clearStockOrder
    });
    
    // 获取配送单列表
    // this.renderStockOrdersList();
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.private;
    const { SiteOperate } = nextProps;
    const { stockOrdersList, updateState, stockListByDelivery } = SiteOperate;

    // 开始更新数据
    if (updateState) {
      const { stockOrderIndexs, stockOrdersList } = this.state;
      this.setState(
        {
          visible: false,
        },
        () => {
          // 获取配送单列表
          this.renderStockOrdersList();
          // 重置更新开关
          const params = {
            state: false,
          };
          dispatch({ type: updateStateFunc, payload: params });
        },
      );
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
      updateState,
    });
  }

  // 获取中转单列表
  renderStockOrdersList() {
    const { dispatch, vendorId, stockInType, limit, orgOrderId, sellerId, startTime, endTime } = this.private;
    const { ordersPage, activeStockId } = this.state;
    const params = {
      vendorId,
      stockInType,
      stockId: activeStockId,
      page: ordersPage,
      limit,
    };
    if (startTime) {
      params.startTime = startTime;
    }
    if (endTime) {
      params.endTime = endTime;
    }
    if(sellerId){
      params.sellerId = sellerId;
    }
    // 订单编号
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
    this.private.sellerId = values.sellerId ? values.sellerId : '';
    this.private.orderState = values.state

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

  // 取消订单面板
  operatePanel() {
    const { itemLayout } = this.private;
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        title="取消订单"
        visible={this.state.visible}
        onOk={this.cancelOrderFunc}
        onCancel={() => this.showOrHideOperatePanel(false, [])}
      >
        <Form layout="horizontal">
          <Row gutter={24}>
            <FormItem label="取消原因" {...itemLayout}>
              {getFieldDecorator('closed_note', {
                initialValue: '',
                validate: [
                  {
                    rules: [{ type: 'string', required: true, message: '请填写取消原因' }],
                    trigger: 'onBlur',
                  },
                ],
              })(<Input type="text" placeholder="请填写取消原因（必填）" />)}
            </FormItem>
          </Row>
        </Form>
      </Modal>
    );
  }

  // 显示 取消订单面板
  showOrHideOperatePanel(state, stockOrderIds) {
    const { resetFields } = this.props.form;
    const { warning } = this.title;

    if (state && stockOrderIds.length === 0) {
      message.warning(warning);
      return;
    }
    this.setState(
      {
        visible: state,
        stockOrderIds,
      },
        () => {
          resetFields();
        },
      );
  }

  // 批量选择订单，传递给 table 组件用
  selectOrderByBatch(selectedRows) {
    const stockOrderIds = [];
    for (let i = 0, j = selectedRows.length; i < j; i++) {
      stockOrderIds.push(selectedRows[i].id);
    }
    this.setState({
      stockOrderIds,
    });
  }

  // 取消订单回调函数
  cancelOrderFunc(e) {
    e.preventDefault();
    const { dispatch, closedType } = this.private;
    const { stockOrderIds } = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const params = {
          stockOrderIds,
          closedType,
          closedNote: values.closed_note,
        };
        dispatch({ type: fetchStockOrdersClose, payload: params });
      }
    });
  }

  // 操作 回调函数
  operateCallBack(record) {
    const { showOrHideOperatePanel } = this;
    if (record.state === 50 || record.state === 100 || record.state === -100) {
      return '--';
    }
    return <Link onClick={() => showOrHideOperatePanel(true, [record.id])}>取消</Link>;
  }
  render() {
    const { stockOrdersList, stockOrderIds, updateState, stockListByDelivery, ordersPage, activeStockId } = this.state;
    const {
      renderStockOrdersList,
      showOrHideOperatePanel,
      selectOrderByBatch,
      onSearch,
      operateCallBack,
      operatePanel,
    } = this;
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
      type: TRANSFER_ORDER,
      stockListByDelivery,
      onSearch,
      showOrHideOperatePanel,
      stockOrderIds,
      activeStockId,
    };
    const tableParams = {
      type: TRANSFER_ORDER,
      columns: TRANSFER_ORDER_COLUMNS(operateCallBack),
      stockOrdersList,
      pagination,
      selectOrderByBatch,
      updateState,
    };
    return (
      <div className="con-body main-list">
        {/*取消订单面板*/}
        {operatePanel()}
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

export default connect(mapStateToProps)(Form.create()(TransferOrder));
