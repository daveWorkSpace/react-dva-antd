// 异常单处理页面
import dot from 'dot-prop'
import React, { Component } from 'react';
import { Modal, Button, Form, Row, Col, Input, DatePicker, TimePicker, message } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { DispatcherActions } from '../../actions';
import { authorize } from '../../../application';
//顶部搜索组件
import Search from '../core/search';
//订单数据表格
import OrderTable from '../core/table';

//引用通用枚举值
import { EXCEPTION_ORDER, EXCEPTION_ORDER_COLUMNS } from '../core/enumerate';

import moment from 'moment';
// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { dateFormat, utcToDate } = window.tempAppTool;
const FormItem = Form.Item;

const {
  getStockOrdersList,
  fetchStockOrdersClose,
  updateStateFunc,
  fetchStockOrdersCancleMarkError,
} = DispatcherActions;

class ExceptionOrder extends Component {
  constructor(props) {
    super(props);
    const { dispatch, SiteOperate } = props;
    this.state = {
      stockListByDelivery: SiteOperate.stockListByDelivery, //配送站列表
      stockOrdersList: SiteOperate.stockOrdersList,         //仓订单列表
      visible: false,     //判断弹窗是否显示
      ordersPage: 1,      //初始化分页
      stockOrderIds: [],  //当前选中的仓订单id列表
      activeStockId: '',  //当前选中的配送站，默认为列表第一个
      updateState: false, //更新状态
    };

    this.private = {
      dispatch,
      vendorId: authorize.auth.vendorId,                //服务商ID
      cityCode: dot.get(authorize.vendor, 'city.code'), //城市编号
      isDispatch: true, //是否有配送能力（true：是 false：否）
      closedType: 1,    //关闭原因，int类型，随便写的
      state: -50,       //异常单
      page: 1,            //默认分页
      size: 999,          //废弃参数
      limit: 10,          //默认分页数
      sort: '{"_id":-1}', //排序
      orgOrderId: '',      //商户订单编
      sellerId:'',          // 商户ID
      contractType:'',      // 签约类型
      itemLayout: {
        labelCol: { span: 5 },
        wrapperCol: { span: 16 },
      },
      deliveryError: 1,       //操作按钮 1
      receiveError: 2,        //异常类型，收货异常
      operateFlag: '',        //当前操作的按钮
      recallFlag: 1,          //操作按钮 撤销异常
      cancelFlag: 2,          //操作按钮 取消订单
      dateFormats: 'YYYY-MM-DD HH:mm',
      timeFormats: 'HH:mm',
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
    // 获取异常单列表
    this.renderStockOrdersList = this.renderStockOrdersList.bind(this);
    // 撤销异常
    this.recallError = this.recallError.bind(this);
    // 批量选择订单，传递给 table 组件用
    this.selectOrderByBatch = this.selectOrderByBatch.bind(this);
    // 时间禁止工具函数
    this.range = this.range.bind(this);
    // 禁止日期
    this.disabledDate = this.disabledDate.bind(this);
    // 禁止时
    this.disabledHours = this.disabledHours.bind(this);
    // 禁止分钟
    this.disabledMinutes = this.disabledMinutes.bind(this);
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
          // 获取仓订单列表
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

  // 获取仓订单列表
  renderStockOrdersList() {
    const { dispatch, vendorId, state, limit, orgOrderId, startTime, endTime , sellerId, contractType} = this.private;
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
    if(sellerId) {
      params.sellerId = sellerId;
    }
    dispatch({ type: getStockOrdersList, payload: params });
  }

  // 搜索函数钩子
  onSearch(values) {
    const { dispatch } = this.private;
    const activeStockId = values.stock ? values.stock : '';
    this.private.orgOrderId = values.org_order_id ? values.org_order_id : '';
    this.private.sellerId = values.sellerId ? values.sellerId : '';
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

  // 时间禁止工具函数
  range(start, end) {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  // 禁止日期
  disabledDate(current) {
    return current && current.valueOf() <= Date.now();
  }

  // 禁止时
  disabledHours(current) {
    const hoursArray = this.range(0, 60);
    const hours = (new Date()).getHours();
    hoursArray.splice(Number(hours), 24 - Number(hours))
    return hoursArray
  }

  // 禁止分钟
  disabledMinutes(current) {
    const minutesArray = this.range(0, 60);
    const minutes = (new Date()).getMinutes();
    minutesArray.splice(Number(minutes), minutesArray.length - Number(minutes))
    return minutesArray
  }

  //禁止时间选项
  disabledDateTime = () => {
    const { disabledHours, disabledMinutes } = this;
    return {
      disabledHours: () => disabledHours(),
      disabledMinutes: () => disabledMinutes(),
    }
  }

  // 订单操作面板
  operatePanel() {
    const { itemLayout, operateFlag, recallFlag, cancelFlag, dateFormats, timeFormats } = this.private;
    const { getFieldDecorator } = this.props.form;
    //如果当前操作的按钮是撤销异常按钮
    if (operateFlag === recallFlag) {
      const _date = dateFormat(Date.now()).join('-');
      const hours = (new Date()).getHours();
      const minutes = (new Date()).getMinutes();
      return (
        <Modal
          title="撤销异常"
          visible={this.state.visible}
          onOk={this.recallError}
          onCancel={() => this.showOrHideOperatePanel(operateFlag, false, [])}
        >
          <Form layout="horizontal">
            <Row gutter={24}>
              <FormItem label="调整配送时间" {...itemLayout}>
                {getFieldDecorator('shipping_date', {
                  initialValue: moment(`${_date} ${hours}:${minutes}`, dateFormats),
                  validate: [
                    {
                      rules: [{ required: true, message: '请选择配送日期' }],
                      trigger: 'onBlur',
                    },
                  ],
                })(<DatePicker showTime format={dateFormats} disabledDate={this.disabledDate} disabledTime={this.disabledDateTime} />)}
              </FormItem>
              <FormItem label="提示" {...itemLayout}>
                1.撤销异常后，订单将正常入站，可继续配送 <br />
                2.调整配送时间后，会同步订单期望送达时间
              </FormItem>
              {/* <FormItem label="选择具体时间" {...itemLayout}>
                {getFieldDecorator('shipping_time', {
                  initialValue: moment(`${hours}:${minutes}`, timeFormats),
                  validate: [
                    {
                      rules: [{ required: true, message: '请选择具体时间' }],
                      trigger: 'onBlur',
                    },
                  ],
                })(<TimePicker hideDisabledOptions disabledHours={this.disabledHours} disabledMinutes={this.disabledMinutes} format={timeFormats} />)}
              </FormItem> */}
            </Row>
          </Form>
        </Modal>
      );
    //如果当前操作的按钮是取消订单按钮
    } else if (operateFlag === cancelFlag) {
      return (
        <Modal
          title="取消订单"
          visible={this.state.visible}
          onOk={this.cancelOrderFunc}
          onCancel={() => this.showOrHideOperatePanel(operateFlag, false, [])}
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
  }

  // 显示 取消订单面板
  showOrHideOperatePanel(flag, state, stockOrderIds) {
    const { resetFields } = this.props.form;
    const { warning } = this.title;
    // 如果当前没有选中项
    if (state && stockOrderIds.length === 0) {
      message.warning(warning);
      return;
    }
    this.private.operateFlag = flag;
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

  // 撤销异常
  recallError(e) {
    e.preventDefault();
    const { dispatch } = this.private;
    const { stockOrderIds } = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const dateTime = utcToDate(values.shipping_date);
        dateTime.time.length = 2;
        const shippingDate = dateTime.date.join('') || '';
        const shippingTime = dateTime.time.join(':') || '';
        const params = {
          stockOrderIds,
          shippingDate,
          shippingTime,
        };
        dispatch({ type: fetchStockOrdersCancleMarkError, payload: params });
      }
    });
  }

  // 操作 回调函数
  operateCallBack(record) {
    const { deliveryError, receiveError, recallFlag, cancelFlag } = this.private;
    // 配送异常
    if (record.error_type === deliveryError) {
      return <Link to={'/dispatcher/sales/inbound'}>退货入站</Link>
    // 到货异常
    } else if (record.error_type === receiveError) {
      return (<div>
        <Link onClick={() => this.showOrHideOperatePanel(recallFlag, true, [record.id])}>撤销异常</Link>
        <Link onClick={() => this.showOrHideOperatePanel(cancelFlag, true, [record.id])}>取消订单</Link>
      </div>)
    }
    return '--'
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
      type: EXCEPTION_ORDER,
      stockListByDelivery,
      onSearch,
      showOrHideOperatePanel,
      stockOrderIds,
      activeStockId,
    };
    const tableParams = {
      type: EXCEPTION_ORDER,
      columns: EXCEPTION_ORDER_COLUMNS(operateCallBack),
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

export default connect(mapStateToProps)(Form.create()(ExceptionOrder));
