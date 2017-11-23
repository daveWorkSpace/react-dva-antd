/**
 * 分拨管理核心模块
 * 到站收货，揽收入站，骑士领货，中转出站，退货入站共用同一逻辑
 * 1.通过扫描骑士获取骑士信息
 * 2.通过扫描单号，获取仓库订单信息
 * 3.仓库单通过状态，服务商，骑士，去重等验证进入可操作表单
 * 4.进行配送入站，中转入站，批量删除，标记异常等操作
 */

import dot from 'dot-prop';
import React, { Component } from 'react';
import { Form, Row, Col, Card, Tabs, message, Input, Button, Icon, Table, Select, Pagination, Popconfirm, Modal, Dropdown, Menu } from 'antd';
import { connect } from 'dva';

import { DispatcherActions, BusinessStock } from '../../actions';
import { authorize } from '../../../application';
import { StockOrdersState } from '../../../application/define';

//入站订单列表组件
import InboundOrder from './inboundOrder';
import style from './style.less';

//引用通用枚举值
import {
  ARRIVE_DELIVERY,
  PULL_INBOUND,
  KNIGHT_DELIVERY,
  TRANSFER_OUTBOUND,
  SALES_INBOUND,
  SALES_OUTBOUND,
  EXCEPTION_ORDER,
  EXCEPTION_ORDER_COLUMNS,
  ARRIVE_DELIVERY_COLUMNS,
  PULL_INBOUND_COLUMNS,
  KNIGHT_DELIVERY_COLUMNS,
  KNIGHT_DELIVERY_SCAN_COLUMNS,
  TRANSFER_OUTBOUND_COLUMNS,
  INBOUND_SCAN_COLUMNS,
  TRANSFER_OUTBOUND_SCAN_COLUMNS,
  SALES_INBOUND_SCAN_COLUMNS,
} from './enumerate';

const [FormItem, Option, TabPane, confirm] = [Form.Item, Select.Option, Tabs.TabPane, Modal.confirm];
const {
  getCouriersInfoById,
  getPurposeStandByScan,
  orderSignException,
  orderSignRemark,
  getStockOrdersList,         //获取仓订单列表
  fetchStockOrdersMarkError,  //标记异常
  fetchStockOrdersIn,         //订单入站
  fetchStockOrdersOut,        //仓订单批量出站
  fetchStockOrdersAssigned,   //批量分配
  getCouriersDetails,         //获取骑士详情
  getVoiceAccessToken,        //获取百度语音token
  getStockListByNext,         //获取所有下一站列表
  clearStockListByNext,       //清空下一站列表
  updateStateByStockOrderFunc, //请求仓订单列表更新函数
  clearStockOrder,             //清空数据
} = DispatcherActions;

const { getStockDispatchRuleByDirect } = BusinessStock;

class ScanOrder extends Component {
  constructor(props) {
    super(props);
    const { dispatch, activeStockId, SiteOperate } = props;

    this.state = {
      showDriver: false,         //司机模块，已废弃
      showKnight: false,         //骑士模块
      showCar: false,            //卡车模块，已废弃
      showScan: false,           //扫描模块
      showStoreroom: false,      //仓库模块
      showCard: false,           //卡片模块
      showNext: false,           //下一站模块
      audioString: '',           //百度语音播放模板
      fDataSource: [],           //第一个表格列表数据
      sDataSource: [],           //第二个表格列表数据
      activeCourierName: '',     //扫描得出当前骑士
      activeCourierMobile: '',   //扫描得出当前骑士手机号
      activeCourierId: '',       //当前骑士id
      activeCourierVendorId: '', //当前骑士所属服务商id
      activeCourierVendorName: '', //当前骑士所属服务商名称
      activeStockId,               //  当前配送站id
      vender: '',                  //扫描得出当前服务商
      doneStockName: '',           //扫描得出当前目的站
      errorString: '',             //语音播报错误信息
      barCode: '',                 //扫描得出当前条码
      orderCount: 0,               //扫描得出当前订单总数
      nextStand: '',               //当前选择下一站
      fOperateState: false,        //操作来自table 1
      sOperateState: false,        //操作来自table 2
      fClearState: false,          //清空表格选中项  from table 1
      sClearState: false,          //清空表格选中项  from table 2
      accessToken: '',             //百度语音token
      stockListByNext: SiteOperate.stockListByNext,      //下一站列表
      // 当前仓库规则
      stockDispatchRule: {
        _meta: {},
        data: [],
      },
    };

    //局部枚举值
    this.private = {
      dispatch,
      vendorId: authorize.auth.vendorId, //服务商ID
      cityCode: dot.get(authorize.vendor, 'city.code'), //城市编号
      deliveryIn: 2, //到站收货入站类型(2:配送入）
      transferIn: 3, //到站收货入站类型(3:中转入）
      deliveryByInTake: 4, //揽收入站类型(4:揽收配送入,5:揽收中转入）
      operationTypeByIn: 1, //操作类型(1:揽收入站,2:到站收货）
      operationTypeByArrive: 2,  //到站收货
      errorNote: '其他', //异常备注
      errorFlag: '42', //异常原因，表示其他
      audioState: false, //语音播放开关
      updateState: false, //扫描条码更新列表开关
      exceptionState: -50, //  仓订单异常状态

      enteredState: 25, //已确认状态
      inboundState: 30, // 已入站状态
      distributedState: 45, //已分配

      one: 1, //第一个表格
      two: 2, //第二个表格

      nextStockId: '', //下一站配送站id
      nextStockParams: {
        vendorId: '',
        cityCode: authorize.vendor.city_code,
        state: 100, //仓库状态（100：启用 -100：禁用）
        isDelivery: true, //是否有配送能力（true：是 false：否）
        // ifTotal: true,    //是否返回直营和加盟仓库[此时vendor_id必须]（true：是 false：否）
        page: 1,
        size: 999,
        sort: '{"_id":-1}',
      }, //下一站获取参数
      transferStockParams: {
        vendorId: '',
        sellerId: '',
        contractId: '',
        state: 100, //仓库状态（100：启用 -100：禁用）
        ruleType: 30, //规则类型（10：配送站 20：库房 30：中转仓）
      }, //请求中转仓设置规则参数
    };

    this.itemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };

    this.title = {
      deliveryIn: '配送入站',
      transferIn: '中转入站',
      transferOut: '中转出站',
      remove: '批量移除',
      removeOne: '移除',
      enterDelivery: '确认分配',
      enterIn: '确认入站',
      deliveryDesc: '配送入站：默认显示目的站【即订单所属配送站】是当前站的订单',
      transferDesc: '中转入站：默认显示目的站【即订单所属配送站】不是当前站的订单',
    };

    this.warning = {
      noWarn: '订单不存在',
      stateWarn: stateDesc => `该订单${stateDesc}`,
      stateError: '该订单状态不匹配',
      arriveWarn: '该订单到站不匹配',
      outWarn: '该订单出站不匹配',
      repeatWarn: '该订单已存在于列表中',
      courierWarn: '该订单不能分配给当前服务商骑士',
    };

    // 渲染司机模块
    this.renderDriver = this.renderDriver.bind(this);
    // 渲染骑士模块
    this.renderKnight = this.renderKnight.bind(this);
    // 渲染车牌号模块
    this.renderCarNumber = this.renderCarNumber.bind(this);
    // 渲染扫描单号模块
    this.renderScanOrder = this.renderScanOrder.bind(this);
    // 渲染扫描信息卡片模块
    this.renderCard = this.renderCard.bind(this);
    // 渲染下一站模块
    this.renderNextStation = this.renderNextStation.bind(this);
    // 渲染库房模块
    this.renderStoreroom = this.renderStoreroom.bind(this);
    // 百度语音合成模块
    this.renderBaiduVideo = this.renderBaiduVideo.bind(this);
    // 渲染表格模块
    this.renderTable = this.renderTable.bind(this);
    // 选择下一站
    this.handleChange = this.handleChange.bind(this);

    // 仓订单单条标记异常回调
    this.stockOrderOneMarkError = this.stockOrderOneMarkError.bind(this);
    // 仓订单批量标记异常回调
    this.stockOrdersMarkError = this.stockOrdersMarkError.bind(this);
    // 仓订单标记异常公用方法
    this.markErrorUpdate = this.markErrorUpdate.bind(this);
    // 扫描条码获取仓库订单
    this.getOrderByScanBarCode = this.getOrderByScanBarCode.bind(this);
    // 操作回调函数
    this.operateCallback = this.operateCallback.bind(this);
    // 仓订单入站
    this.stockOrdersIn = this.stockOrdersIn.bind(this);
    // 更新列表对比方法
    this.differenceRows = this.differenceRows.bind(this);
    // 移除更新列表对比方法，因列表中可能存在重复的单子，移除不能跟其他操作更新用同样的方法
    this.removeDifferenceRows = this.removeDifferenceRows.bind(this);
    // 仓订单单条移除
    this.removeOneHandle = this.removeOneHandle.bind(this);
    // 仓订单批量移除
    this.removeHandle = this.removeHandle.bind(this);
    // 移除更新公用方法
    this.removeUpdate = this.removeUpdate.bind(this);
    // 仓订单批量分配
    this.stockOrdersAssigned = this.stockOrdersAssigned.bind(this);
    // 根据骑士Id获取骑士信息
    this.getCouriersDetail = this.getCouriersDetail.bind(this);
    // 播放百度语音
    this.playBaiduAudio = this.playBaiduAudio.bind(this);
    // 去重公共函数
    this.getNoRepeatList = this.getNoRepeatList.bind(this);
    // 重置清空选中状态
    this.resetClearState = this.resetClearState.bind(this);
    // 获取百度语音token
    this.getVoiceAccessTokens = this.getVoiceAccessTokens.bind(this);
    // 匹配单子是否存在于当前配送站内
    this.verifyDelivery = this.verifyDelivery.bind(this);
  }

  componentWillMount() {
    const { type } = this.props;
    const { dispatch } = this.private;
    let [showScan, showCard, showKnight, showNext] = [true, true, false, false];
    
    //根据不同页面传进的枚举值展示不同的模块, 并根据枚举值传不同的参数
    switch (type) {
      // 揽收入站
      // 骑士领货
      // 退货入站
      case PULL_INBOUND:
      case KNIGHT_DELIVERY:
      case SALES_INBOUND:
        showKnight = true;
        break;
      // 中转出站
      case TRANSFER_OUTBOUND:
        showNext = true;
        break;
      default:
        break;
    }

    this.setState({
      showKnight,
      showScan,
      showCard,
      showNext,
      audioString: '',
      errorString: '',
    });
  }

  componentDidMount() {
    const { dispatch } = this.private;
    const { type } = this.props;
    // 扫描单号 dom
    const scanOrder = document.getElementById('scanOrder');
    // 扫描骑士 dom
    const scanKnight = document.getElementById('knight');

    // 聚焦
    scanKnight ? scanKnight.focus() : scanOrder.focus();

    //扫码器事件
    document.onkeyup = (e) => {
      const event = e || window.event;
      const key = event.which || event.keyCode || event.charCode;
      // 13表示回车键的keycode值
      if (key === 13) {
        // 判断当前点击元素是否是来自于单号扫描 并且 扫码元素值不为空
        if (document.activeElement === scanOrder && scanOrder.value !== '') {
          // 判断页面是否为骑士领货 退货入站 揽收入站 并且当前骑士id是否存在
          if (
            (type === KNIGHT_DELIVERY || type === SALES_INBOUND || type === PULL_INBOUND) &&
            !this.state.activeCourierId
          ) {
            // 语音播报相关功能
            const audioString = '请先扫描骑士',
              errorString = '请先扫描骑士';
            this.setState(
              {
                audioString,
                errorString,
              },
              () => {
                this.playBaiduAudio();
                scanOrder.value = '';
              },
            );
            return;
          }
          //此处拿扫描条码请求单号信息
          console.log(scanOrder.value);
          this.setState(
            {
              barCode: scanOrder.value.trim(),
            },
            () => {
              //打开扫码更新列表开关
              this.private.updateState = true;
              // 根据条码获取订单列表
              this.getOrderByScanBarCode(scanOrder.value);
              scanOrder.value = '';
              // 中转出站界面
              if (type === TRANSFER_OUTBOUND) {
                // 清空下一站列表
                dispatch({ type: clearStockListByNext, payload: {} });
              }
            },
          );
        }
        // 判断当前点击元素是否是来自于骑士扫描 并且 骑士扫码元素值不为空
        if (document.activeElement === scanKnight && scanKnight.value !== '') {
          console.log(scanKnight.value);
          // 打开骑士语音播报
          this.private.audioState = true;
          //此处拿扫描骑士请求信息
          this.getCouriersDetail(scanKnight.value);
          scanKnight.value = '';
        }
      }
    };
  }

  /**
   * @param {any} nextProps
   * @memberof ScanOrder
   */
  componentWillReceiveProps(nextProps) {
    const {
	  dispatch,
      deliveryIn,
      deliveryByInTake,
      audioState,
      updateState,
      exceptionState,
      inboundState,
      enteredState,
    } = this.private;

    const { noWarn, stateWarn, stateError, arriveWarn, outWarn, repeatWarn, courierWarn } = this.warning;

    const { SiteOperate, activeStockId, type, changeState, BusinessStock } = nextProps;
    const { stockOrdersList, successList, couriersDetails, accessToken, stockListByNext, updateStateByStockOrder } = SiteOperate;
    const { stockDispatchRule } = BusinessStock;
    let [newList, fDataSource, sDataSource] = [[], [], []];
    const { activeCourierVendorId } = this.state;
    // 根据条码获取订单列表更新列表
    if (updateStateByStockOrder) {
      // 请求仓订单成功后，立即关闭开关
      dispatch({ type: updateStateByStockOrderFunc, payload: false })
      // 定义初始值
      // 语音播报信息
      let audioString = '',
        //错误信息
        errorString = '',
        // 终点站
        doneStockName = '',
        // 订单数量
        orderCount = 0;

      // 设置错误信息工具函数
      const stringCallback = (string) => {
        audioString = errorString = string;
      };

	    // 如果返回订单为空
	    console.log(stockOrdersList)
      if (stockOrdersList.data.length === 0) {
        // 当返回订单列表为空时
        stringCallback(noWarn);
      } else if (stockOrdersList.data.length === 1) {
        // 当返回订单列表数仅为一条时
        switch (type) {
          // 到站收货
          case ARRIVE_DELIVERY:
            // 防止变量冲突
            if (true) {
              // 匹配单子是否存在于当前配送站内
              const activestockOrder = stockOrdersList.data;
              if (activestockOrder[0].stock_id !== activeStockId) {
                stringCallback(arriveWarn);
                // audioString = errorString = '该订单到站不匹配';
                break;
              }
              // 匹配状态
              if (activestockOrder[0].state !== enteredState) {
                const stateDesc = StockOrdersState.description(activestockOrder[0].state);
                stringCallback(stateWarn(stateDesc));
                // audioString = errorString = `该订单${stateDesc}`;
                break;
              }

              // 去重
              const noRepeatList = this.getNoRepeatList(activestockOrder);
              if (noRepeatList.length === 0) {
                stringCallback(repeatWarn);
                // audioString = errorString = '该订单已存在于列表中';
                break;
              }
              // 匹配成功，可以进入列表
              const successResult = this.verifySuccessBySCountIsOne(noRepeatList, deliveryIn);
              doneStockName = successResult.doneStockName;
              orderCount = successResult.orderCount;
              audioString = successResult.audioString;
              fDataSource = successResult.fDataSource;
              sDataSource = successResult.sDataSource;
            }
            break;
          // 揽收入站
          case PULL_INBOUND:
            if (true) {
              // 匹配单子是否存在于当前配送站内
              const activestockOrder = stockOrdersList.data;
              if (activestockOrder[0].stock_id !== activeStockId) {
                stringCallback(arriveWarn);
                // audioString = errorString = '该订单到站不匹配';
                break;
              }
              // 匹配状态，已确认状态
              if (activestockOrder[0].state !== enteredState) {
                const stateDesc = StockOrdersState.description(activestockOrder[0].state);
                stringCallback(stateWarn(stateDesc));
                // audioString = errorString = `该订单${stateDesc}`;
                break;
              }
              // 匹配单子运力服务商是否与当前骑士服务商一致
              // 运力服务商id
              const shipmentVendorId = dot.get(activestockOrder[0], 'shipment.vendor_info.id', '');
              if (shipmentVendorId !== activeCourierVendorId) {
                stringCallback(courierWarn);
                // audioString = errorString = '该订单不能分配给当前服务商骑士';
                break;
              }
              // 去重
              const noRepeatList = this.getNoRepeatList(activestockOrder);
              if (noRepeatList.length === 0) {
                stringCallback(repeatWarn);
                // audioString = errorString = '该订单已存在于列表中';
                break;
              }
              // 匹配成功，可以进入列表
              const successResult = this.verifySuccessBySCountIsOne(noRepeatList, deliveryByInTake);
              doneStockName = successResult.doneStockName;
              orderCount = successResult.orderCount;
              audioString = successResult.audioString;
              fDataSource = successResult.fDataSource;
              sDataSource = successResult.sDataSource;
            }
            break;
          // 骑士领货
          case KNIGHT_DELIVERY:
            if (true) {
              // 匹配单子是否存在于当前配送站内
              const activestockOrder = stockOrdersList.data;
              if (activestockOrder[0].done_stock_id !== activeStockId) {
                stringCallback(outWarn);
                // audioString = errorString = '该订单出站不匹配';
                break;
              }
              // 匹配状态 ， 已入站状态
              if (activestockOrder[0].state !== inboundState) {
                const stateDesc = StockOrdersState.description(activestockOrder[0].state);
                stringCallback(stateWarn(stateDesc));
                // audioString = errorString = `该订单${stateDesc}`;
                break;
              }
              // 匹配单子运力服务商是否与当前骑士服务商一致
              // 运力服务商id
              const shipmentVendorId = dot.get(activestockOrder[0], 'shipment.vendor_info.id', '');
              if (shipmentVendorId !== activeCourierVendorId) {
                stringCallback(courierWarn);
                // audioString = errorString = '该订单不能分配给当前服务商骑士';
                break;
              }
              // 去重
              const noRepeatList = this.getNoRepeatList(activestockOrder);
              if (noRepeatList.length === 0) {
                stringCallback(repeatWarn);
                // audioString = errorString = '该订单已存在于列表中';
                break;
              }
              // 匹配成功，可以进入列表
              const successResult = this.verifySuccessByCountIsOne(noRepeatList);
              doneStockName = successResult.doneStockName;
              orderCount = successResult.orderCount;
              audioString = successResult.audioString;
              fDataSource = successResult.fDataSource;
            }
            break;
          // 中转出站
          case TRANSFER_OUTBOUND:
            if (true) {
              // 匹配单子是否存在于当前配送站内
              const activestockOrder = stockOrdersList.data;
              if (activestockOrder[0].stock_id !== activeStockId) {
                stringCallback(outWarn);
                // audioString = errorString = '该订单到站不匹配';
                break;
              }
			        // 匹配状态， 已入站状态
			        console.log('中转出站订单状态', activestockOrder[0].state, StockOrdersState.description(activestockOrder[0].state))
              if (activestockOrder[0].state !== inboundState) {
                const stateDesc = StockOrdersState.description(activestockOrder[0].state);
                stringCallback(stateWarn(stateDesc));
                // audioString = errorString = `该订单${stateDesc}`;
                break;
              }
              // 去重
              const noRepeatList = this.getNoRepeatList(activestockOrder);
              if (noRepeatList.length === 0) {
                stringCallback(repeatWarn);
                // audioString = errorString = '该订单已存在于列表中';
                break;
              }
              // 匹配成功，可以进入列表
              const successResult = this.verifySuccessByCountIsOne(noRepeatList);
              doneStockName = successResult.doneStockName;
              orderCount = successResult.orderCount;
              audioString = successResult.audioString;
              fDataSource = successResult.fDataSource;

              // 拿到当前订单列表的服务商id 去请求下一站列表
              this.private.nextStockParams.vendorId = dot.get(
                noRepeatList[0],
                'parent_vendor_order.vendor_id',
                '',
              );
              // 以下参数请求仓库中转仓规则
              this.private.transferStockParams.sellerId = dot.get(noRepeatList[0], 'seller_id', '');
              this.private.transferStockParams.vendorId = dot.get(
                noRepeatList[0],
                'parent_vendor_order.vendor_id',
                '',
              );
              this.private.transferStockParams.contractId = dot.get(
                noRepeatList[0],
                'vendor_order.contract_id',
                '',
              );
              // 请求仓库中转仓规则
              this.fetchStockDispatchRule();
              // 请求下一站列表
              this.fetchStockListByNext();
            }
            break;
          // 退货入站
          case SALES_INBOUND:
            if (true) {
              // 匹配单子是否存在于当前配送站内
              const activestockOrder = stockOrdersList.data;
              if (activestockOrder[0].stock_id !== activeStockId) {
                stringCallback(arriveWarn);
                // audioString = errorString = '该订单到站不匹配';
                break;
              }
              // 匹配状态 异常状态
              if (activestockOrder[0].state !== exceptionState) {
                const stateDesc = StockOrdersState.description(activestockOrder[0].state);
                stringCallback(stateWarn(stateDesc));
                // audioString = errorString = `该订单${stateDesc}`;
                break;
              }
              // 去重
              const noRepeatList = this.getNoRepeatList(activestockOrder);
              if (noRepeatList.length === 0) {
                stringCallback(repeatWarn);
                // audioString = errorString = '该订单已存在于列表中';
                break;
              }
              // 匹配成功，可以进入列表
              const successResult = this.verifySuccessByCountIsOne(noRepeatList);
              doneStockName = successResult.doneStockName;
              orderCount = successResult.orderCount;
              audioString = successResult.audioString;
              fDataSource = successResult.fDataSource;
            }
            break;
        }
      } else {
        // 当返回订单列表多条时
        switch (type) {
          case ARRIVE_DELIVERY:
            // 防止变量冲突，es6隔离变量，可以去除if（true）来优化
            if (true) {
              // 匹配单子是否存在于当前配送站内
              const deliveryList = this.verifyDelivery(stockOrdersList, activeStockId, ARRIVE_DELIVERY);
              if (deliveryList.length <= 0) {
                stringCallback(arriveWarn);
                // audioString = errorString = '该订单到站不匹配';
                break;
              }
              // 匹配状态，已确认状态
              const stateList = this.verifyState(deliveryList, enteredState);
              if (stateList.length <= 0) {
                stringCallback(stateError);
                // audioString = errorString = '该订单状态不匹配';
                break;
              }
              // 去重
              const noRepeatList = this.getNoRepeatList(stateList);
              if (noRepeatList.length === 0) {
                stringCallback(repeatWarn);
                // audioString = errorString = '该订单已存在于列表中';
                break;
              }
              // 匹配成功，可以进入列表
              const successResult = this.verifySuccessByS(noRepeatList, deliveryIn);
              doneStockName = successResult.doneStockName;
              orderCount = successResult.orderCount;
              audioString = successResult.audioString;
              errorString = successResult.errorString;
              fDataSource = successResult.fDataSource;
              sDataSource = successResult.sDataSource;
            }
            break;
          case PULL_INBOUND:
            if (true) {
              // 匹配单子是否存在于当前配送站内
              const deliveryList = this.verifyDelivery(stockOrdersList, activeStockId, PULL_INBOUND);
              if (deliveryList.length <= 0) {
                stringCallback(arriveWarn);
                // audioString = errorString = '该订单到站不匹配';
                break;
              }
              // 匹配状态，已确认状态
              const stateList = this.verifyState(deliveryList, enteredState);
              if (stateList.length <= 0) {
                stringCallback(stateError);
                // audioString = errorString = '该订单状态不匹配';
                break;
              }
              // 匹配单子运力服务商是否与当前骑士服务商一致
              const vendorList = this.verifyVendor(stateList);
              if (vendorList.length <= 0) {
                stringCallback(courierWarn);
                // audioString = errorString = '该订单不能分配给当前服务商骑士';
                break;
              }
              // 去重
              const noRepeatList = this.getNoRepeatList(vendorList);
              if (noRepeatList.length === 0) {
                stringCallback(repeatWarn);
                // audioString = errorString = '该订单已存在于列表中';
                break;
              }
              // 匹配成功，可以进入列表
              const successResult = this.verifySuccessByS(noRepeatList, deliveryByInTake);
              doneStockName = successResult.doneStockName;
              orderCount = successResult.orderCount;
              audioString = successResult.audioString;
              errorString = successResult.errorString;
              fDataSource = successResult.fDataSource;
              sDataSource = successResult.sDataSource;
            }
            break;
          case KNIGHT_DELIVERY:
            if (true) {
              // 匹配单子是否存在于当前配送站内
              const deliveryList = this.verifyDelivery(stockOrdersList, activeStockId, KNIGHT_DELIVERY);
              if (deliveryList.length <= 0) {
                stringCallback(outWarn);
                // audioString = errorString = '该订单出站不匹配';
                break;
              }
              // 匹配状态
              const stateList = this.verifyState(deliveryList, inboundState);
              if (stateList.length <= 0) {
                stringCallback(stateError);
                // audioString = errorString = '该订单状态不匹配';
                break;
              }
              // 匹配单子运力服务商是否与当前骑士服务商一致
              const vendorList = this.verifyVendor(stateList);
              if (vendorList.length <= 0) {
                stringCallback(courierWarn);
                // audioString = errorString = '该订单不能分配给当前服务商骑士';
                break;
              }
              // 去重
              const noRepeatList = this.getNoRepeatList(vendorList);
              if (noRepeatList.length === 0) {
                stringCallback(repeatWarn);
                // audioString = errorString = '该订单已存在于列表中';
                break;
              }
              // 匹配成功，可以进入列表
              const successResult = this.verifySuccess(noRepeatList);
              doneStockName = successResult.doneStockName;
              orderCount = successResult.orderCount;
              audioString = successResult.audioString;
              errorString = successResult.errorString;
              fDataSource = successResult.fDataSource;
            }
            break;
          case TRANSFER_OUTBOUND:
            if (true) {
              // 匹配单子是否存在于当前配送站内
              const deliveryList = this.verifyDelivery(stockOrdersList, activeStockId, TRANSFER_OUTBOUND);
              if (deliveryList.length <= 0) {
                stringCallback(outWarn);
                // audioString = errorString = '该订单出站不匹配';
                break;
              }
              // 匹配状态
              const stateList = this.verifyState(deliveryList, inboundState);
              if (stateList.length <= 0) {
                stringCallback(stateError);
                // audioString = errorString = '该订单状态不匹配';
                break;
              }
              // 去重
              const noRepeatList = this.getNoRepeatList(stateList);
              if (noRepeatList.length === 0) {
                stringCallback(repeatWarn);
                // audioString = errorString = '该订单已存在于列表中';
                break;
              }
              // 匹配成功，可以进入列表
              const successResult = this.verifySuccess(noRepeatList);
              doneStockName = successResult.doneStockName;
              orderCount = successResult.orderCount;
              audioString = successResult.audioString;
              errorString = successResult.errorString;
              fDataSource = successResult.fDataSource;

              // 拿到当前列表的服务商id 去请求下一站列表
              this.private.nextStockParams.vendorId = dot.get(
                fDataSource[0],
                'parent_vendor_order.vendor_id',
                '',
              );
              // 以下参数请求仓库中转仓规则
              this.private.transferStockParams.sellerId = dot.get(fDataSource[0], 'seller_id', '');
              this.private.transferStockParams.vendorId = dot.get(
                fDataSource[0],
                'parent_vendor_order.vendor_id',
                '',
              );
              this.private.transferStockParams.contractId = dot.get(
                fDataSource[0],
                'vendor_order.contract_id',
                '',
              );
              // 请求仓库中转仓规则
              this.fetchStockDispatchRule();
              // 请求下一站列表
              this.fetchStockListByNext();
            }
            break;
          case SALES_INBOUND:
            if (true) {
              // 匹配单子是否存在于当前配送站内
              const deliveryList = this.verifyDelivery(stockOrdersList, activeStockId, SALES_INBOUND);
              if (deliveryList.length <= 0) {
                stringCallback(arriveWarn);
                // audioString = errorString = '该订单到站不匹配';
                break;
              }
              // 匹配状态
              const stateList = this.verifyState(deliveryList, exceptionState);
              if (stateList.length <= 0) {
                stringCallback(stateError);
                // audioString = errorString = '该订单状态不匹配';
                break;
              }
              // 去重
              const noRepeatList = this.getNoRepeatList(stateList);
              if (noRepeatList.length === 0) {
                stringCallback(repeatWarn);
                // audioString = errorString = '该订单已存在于列表中';
                break;
              }
              // 匹配成功，可以进入列表
              const successResult = this.verifySuccess(noRepeatList);
              doneStockName = successResult.doneStockName;
              orderCount = successResult.orderCount;
              audioString = successResult.audioString;
              errorString = successResult.errorString;
              fDataSource = successResult.fDataSource;
            }
            break;
        }
      }

      // 最后统一更新状态及列表
      this.setState(
        {
          fDataSource: fDataSource.concat(this.state.fDataSource),
          sDataSource: sDataSource.concat(this.state.sDataSource),
          doneStockName,
          orderCount: this.state.orderCount + orderCount,
          audioString,
          errorString,
          accessToken,
        },
        () => {
          // 播报条码
          this.playBaiduAudio();
          // 关闭扫码开关
		      this.private.updateState = false;
        },
      );
    }

    // 骑士语音播报
    if (audioState) {
      const courierName = dot.get(couriersDetails, 'name', '');
      const courierMobile = dot.get(couriersDetails, 'mobile', '');
      // 更新当前骑士所属的服务商id
      const activeCourierVendorId = dot.get(couriersDetails, 'vendor_id', '');
      let audioString = '';
      if (courierName && courierMobile) {
        const m = courierMobile.slice(-4) || '';
        audioString = courierName + (m ? `，手机尾号${m}` : '');
      } else if (courierName) {
        audioString = courierName;
      } else if (courierMobile) {
        audioString = courierMobile;
      }
      audioString &&
        this.setState(
          {
            audioString,
            accessToken,
            activeCourierVendorId,
          },
          () => {
            this.playBaiduAudio();
            this.private.audioState = false;
          },
        );
    }

    // 根据操作 （入站，标记异常） 成功后，更新列表
    this.differenceRows(successList);

    // 切换配送站时，清空数据
    if (changeState) {
      this.setState(
        {
          audioString: '', //百度语音播放模板
          fDataSource: [], //第一个表格列表数据
          sDataSource: [], //第二个表格列表数据
          activeCourierName: '', //扫描得出当前骑士
          activeCourierMobile: '', //扫描得出当前骑士手机号
          activeCourierId: '', //当前骑士id
          activeCourierVendorId: '', //当前骑士所属服务商id
          activeStockId, //  当前配送站id
          vender: '', //扫描得出当前服务商
          doneStockName: '', //扫描得出当前目的站
          errorString: '', //语音播报错误信息
          barCode: '', //扫描得出当前条码
          orderCount: 0, //扫描得出当前订单总数
          nextStand: '', //当前选择下一站
        },
        () => {
          // 扫描单号 dom
          const scanOrder = document.getElementById('scanOrder');
          // 扫描骑士 dom
          const scanKnight = document.getElementById('knight');

          // 聚焦
          scanKnight ? scanKnight.focus() : scanOrder.focus();
          this.props.resetChangeState();
          // 切换配送站时清空骑士信息
          couriersDetails.id = couriersDetails.name = couriersDetails.mobile = '';
        },
      );
    } else {
      //TODO: fix cache
      this.setState({
        activeStockId,
        stockListByNext,
        stockDispatchRule,
        activeCourierName: dot.get(couriersDetails, 'name', ''),
        activeCourierMobile: dot.get(couriersDetails, 'mobile', ''),
        activeCourierId: dot.get(couriersDetails, 'id', ''),
        activeCourierVendorName: dot.get(couriersDetails, 'vendor.name', ''),
      });
    }
  }

  // 组件卸载时，清空
  componentWillUnmount(){
    const { dispatch } = this.private;
    this.setState({
      audioString: '', //百度语音播放模板
      fDataSource: [], //第一个表格列表数据
      sDataSource: [], //第二个表格列表数据
      activeCourierName: '', //扫描得出当前骑士
      activeCourierMobile: '', //扫描得出当前骑士手机号
      activeCourierId: '', //当前骑士id
      activeCourierVendorId: '', //当前骑士所属服务商id
      activeStockId: '', //  当前配送站id
      vender: '', //扫描得出当前服务商
      doneStockName: '', //扫描得出当前目的站
      errorString: '', //语音播报错误信息
      barCode: '', //扫描得出当前条码
      orderCount: 0, //扫描得出当前订单总数
      nextStand: '', //当前选择下一站
    });
    
    dispatch({ type: clearStockOrder, payload: {} });
  }
  // 匹配配送站
  verifyDelivery = (stockOrdersList, activeStockId, type) => {
    const deliveryList = [];
    // 如果是骑士领货页面则需判断终点站与当前配置站匹配
    if (type === KNIGHT_DELIVERY) {
      for (let i = 0, j = stockOrdersList.data.length; i < j; i++) {
        if (stockOrdersList.data[i].done_stock_id === activeStockId) {
          deliveryList.push(stockOrdersList.data[i]);
        }
      }
    } else {
      // 其他页面则需判断当前订单配送站与当前配送站匹配
      for (let i = 0, j = stockOrdersList.data.length; i < j; i++) {
        if (stockOrdersList.data[i].stock_id === activeStockId) {
          deliveryList.push(stockOrdersList.data[i]);
        }
      }
    }

    return deliveryList;
  };

  // 匹配状态
  verifyState = (deliveryList, activeState) => {
    const stateList = [];
    for (let i = 0, j = deliveryList.length; i < j; i++) {
      if (deliveryList[i].state === activeState) {
        stateList.push(deliveryList[i]);
      }
    }
    return stateList;
  };

  // 匹配运力服务商与骑士服务商
  verifyVendor = (stateList) => {
    const { activeCourierVendorId } = this.state;
    const vendorList = [];
    for (let i = 0, j = stateList.length; i < j; i++) {
      // 运力服务商id
      const shipmentVendorId = dot.get(stateList[i], 'shipment.vendor_info.id', '');
      if (shipmentVendorId === activeCourierVendorId) {
        vendorList.push(stateList[i]);
      }
    }
    return vendorList;
  };

  // 判断订单是否重复
  getNoRepeatList = (activestockOrders) => {
    // 判断重复
    const allDataSource = this.state.fDataSource.concat(this.state.sDataSource);
    const noRepeatList = [];
    for (let i = 0, j = activestockOrders.length; i < j; i++) {
      let flag = false;
      for (let x = 0, y = allDataSource.length; x < y; x++) {
        if (activestockOrders[i].id === allDataSource[x].id) {
          flag = true;
          break;
        }
      }
      !flag && noRepeatList.push(activestockOrders[i]);
    }
    return noRepeatList;
  };

  // 多表格匹配
  // 订单数据为1
  verifySuccessBySCountIsOne = (noRepeatList, type) => {
    let doneStockName,
      audioString,
      orderCount = '',
      fDataSource = [],
      sDataSource = [];
    doneStockName = dot.get(noRepeatList[0], 'done_stock_name', '');
    // count 增加 1
    orderCount = 1;
    // 仅有一条数据且正常可用时的播报语音
    audioString = `${noRepeatList[0].barcode},${doneStockName}` ? `目的站，${doneStockName}` : '';
    // 根据入库类型，判断仓订单属于哪一个列表
    // type (配送入,中转入）
    if (noRepeatList[0].stock_in_type === type) {
      // 配送入
      // 第一个dataSource
      fDataSource.push(noRepeatList[0]);
    } else {
      // 中转入
      // 第二个dataSource
      sDataSource.push(noRepeatList[0]);
    }
    return {
      doneStockName,
      audioString,
      orderCount,
      fDataSource,
      sDataSource,
    };
  };

  // 多表格匹配
  // 订单数据为1或多条
  verifySuccessByS = (noRepeatList, type) => {
    // 匹配成功，可以进入列表
    let doneStockName,
      audioString,
      errorString,
      orderCount = '',
      fDataSource,
      sDataSource = [];
    // 判断去重后订单数量为1
    if (noRepeatList.length === 1) {
      const successResult = this.verifySuccessBySCountIsOne(noRepeatList, type);
      doneStockName = successResult.doneStockName;
      orderCount = successResult.orderCount;
      audioString = successResult.audioString;
      fDataSource = successResult.fDataSource;
      sDataSource = successResult.sDataSource;
    } else {
      orderCount = noRepeatList.length;
      audioString = errorString = `当前条码对应${orderCount}笔订单请核对`;
      for (let i = 0, j = noRepeatList.length; i < j; i++) {
        // 根据入库类型，判断仓订单属于哪一个列表
        // type (配送入,中转入）
        if (noRepeatList[i].stock_in_type === type) {
          // 配送入
          fDataSource.push(noRepeatList[i]);
        } else {
          sDataSource.push(noRepeatList[i]);
        }
      }
    }
    return {
      doneStockName,
      audioString,
      errorString,
      orderCount,
      fDataSource,
      sDataSource,
    };
  };

  // 单表格
  // 订单数据为1
  verifySuccessByCountIsOne = (noRepeatList) => {
    let doneStockName,
      audioString,
      orderCount = '',
      fDataSource = [];
    // 匹配成功，可以进入列表
    fDataSource.push(noRepeatList[0]);
    doneStockName = dot.get(fDataSource[0], 'done_stock_name', '');
    // count 增加 1
    orderCount = 1;
    // 仅有一条数据且正常可用时的播报语音
    audioString = `${fDataSource[0].barcode},${doneStockName}` ? `目的站，${doneStockName}` : '';
    return {
      doneStockName,
      audioString,
      orderCount,
      fDataSource,
    };
  };

  // 单表格
  // 订单数量为1或多条
  // 语音播报不同
  verifySuccess = (noRepeatList) => {
    let doneStockName,
      audioString,
      errorString,
      orderCount = '',
      fDataSource = [];
    if (noRepeatList.length === 1) {
      // 匹配成功，可以进入列表
      const successResult = this.verifySuccessByCountIsOne(noRepeatList);
      doneStockName = successResult.doneStockName;
      orderCount = successResult.orderCount;
      audioString = successResult.audioString;
      fDataSource = successResult.fDataSource;
    } else {
      orderCount = noRepeatList.length;
      audioString = errorString = `当前条码对应${orderCount}笔订单请核对`;
      fDataSource = noRepeatList;
    }
    return {
      doneStockName,
      audioString,
      errorString,
      orderCount,
      fDataSource,
    };
  };

  // 获取下一站列表
  fetchStockListByNext = () => {
    const { dispatch, nextStockParams } = this.private;
    dispatch({ type: getStockListByNext, payload: nextStockParams });
  };

  // 获取当前仓订单中转仓设置
  fetchStockDispatchRule = () => {
    const { dispatch, transferStockParams } = this.private;
    dispatch({ type: getStockDispatchRuleByDirect, payload: transferStockParams });
  };

  // 更新列表对比方法  // 根据操作 入站，标记异常，更新列表
  differenceRows(successList) {
    if (successList.length > 0) {
      const { fDataSource, sDataSource, fOperateState, sOperateState } = this.state;
      if (fOperateState) {
        const newDataSource = [];
        for (let i = 0, j = fDataSource.length; i < j; i++) {
          let flag = false;
          for (let x = 0, y = successList.length; x < y; x++) {
            if (fDataSource[i].id === successList[x]) {
              flag = true;
              break;
            }
          }
          !flag && newDataSource.push(fDataSource[i]);
        }
        // 更新table 1
        this.setState({
          fDataSource: newDataSource,
          orderCount: newDataSource.length + sDataSource.length,
          fOperateState: false,
          fClearState: true,
        });
      }

      if (sOperateState) {
        const newDataSource = [];
        for (let i = 0, j = sDataSource.length; i < j; i++) {
          let flag = false;
          for (let x = 0, y = successList.length; x < y; x++) {
            if (sDataSource[i].id === successList[x]) {
              flag = true;
              break;
            }
          }
          !flag && newDataSource.push(sDataSource[i]);
        }
        // 更新table 2
        this.setState({
          sDataSource: newDataSource,
          orderCount: newDataSource.length + fDataSource.length,
          sOperateState: false,
          sClearState: true,
        });
      }
    }
  }

  // 预留函数，先不管
  onChange = (activeKey) => {
    this.setState({ activeKey });
  };

  // 扫描司机模块
  renderDriver() {
    return (
      <FormItem label="司机" {...this.itemLayout}>
        <Input
          className={style.inputWidth}
          prefix={<Icon type="user" style={{ fontSize: 13 }} />}
          placeholder="请输入司机姓名"
        />
      </FormItem>
    );
  }

  // 扫描骑士模块
  renderKnight() {
    const { activeCourierMobile, activeCourierName, activeCourierVendorName } = this.state;
    return (
      <FormItem label="骑士" {...this.itemLayout}>
        <Input
          id="knight"
          className={style.inputWidth}
          prefix={<Icon type="user" style={{ fontSize: 13 }} />}
          placeholder="请输入骑士姓名"
        />
        <div>
          <p>
            {activeCourierName && activeCourierMobile
              ? `${activeCourierName} (${activeCourierMobile})`
              : activeCourierName || ''}
          </p>
          <p>
            {activeCourierVendorName}
          </p>
        </div>
      </FormItem>
    );
  }

  // 扫描车牌号模块
  renderCarNumber() {
    return (
      <FormItem label="车牌号" {...this.itemLayout}>
        <Input
          className={style.inputWidth}
          prefix={<Icon type="user" style={{ fontSize: 13 }} />}
          placeholder="请输入车牌号"
        />
      </FormItem>
    );
  }

  // 扫描单号模块
  renderScanOrder() {
    return (
      <FormItem label="扫描单号 (条码)" {...this.itemLayout}>
        <Input
          id="scanOrder"
          className={`${style.inputWidth} ${style.enhanceHeight}`}
          prefix={<Icon type="user" style={{ fontSize: 13 }} />}
          placeholder="请输入扫描单号"
        />
      </FormItem>
    );
  }

  // 扫描信息卡片模块
  renderCard() {
    const { barCode, doneStockName, orderCount, errorString } = this.state;
    return (
      <Col className={style.cargoInfo}>
        <Card className={style.card}>
          <h4>
            条码： {barCode}
          </h4>
          <h2 className={style.errorStyle}>
            {doneStockName ? `目的站：${doneStockName}` : errorString}
          </h2>
        </Card>
        <Card className={`${style.card} ${style.cargoNumber} cargoNumber`}>
          {orderCount}
        </Card>
      </Col>
    );
  }

  // 扫描下一站模块
  renderNextStation() {
    const { handleChange } = this;
    const { stockListByNext, stockDispatchRule, activeStockId } = this.state;
    // const { nextStockId } = this.private;
    // 从中转仓规则设置里获取仓库列表，默认只有一条数据
    const nextStockId = dot.get(stockDispatchRule.data[0], 'stock_list', []);
    // let defaultValue = '';
    // if (nextStockId[0] === activeStockId) {
    // }
    // 默认下一站
    const defaultValue = nextStockId[0] || dot.get(stockListByNext.data[0], 'id', '');

    // 重新赋值
    this.private.nextStockId = defaultValue;
    return (
      <FormItem label="下一站" {...this.itemLayout}>
        {stockListByNext.data.length > 0
          ? <Select
            showSearch
            placeholder="请选择下一站"
            optionFilterProp="children"
            className={style.inputWidth}
            defaultValue={defaultValue}
            onChange={handleChange}
          >
            {stockListByNext.data.map((item, index) => {
              return (
                <Option key={index} value={item.id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
          : ''}
      </FormItem>
    );
  }

  // 库房模块
  renderStoreroom() {
    return (
      <FormItem label="库房" {...this.itemLayout}>
        <Select showSearch className={style.inputWidth} placeholder="请选择库房名称" optionFilterProp="children">
          <Option value="jack">Jack</Option>
          <Option value="lucy">Lucy</Option>
          <Option value="Yiminghe">yiminghe</Option>
        </Select>
      </FormItem>
    );
  }

  // 百度语音合成模块
  renderBaiduVideo() {
    const { audioString, accessToken } = this.state;
    console.log('-----------audioString------------', encodeURI(audioString));
    console.log('-----------accessToken------------', encodeURI(accessToken));
    return (
      // <video ref="baiduMp3" controls autoPlay name="media">
      //     {/*<source src={ `http://tsn.baidu.com/text2audio?tex=6922266454295&lan=zh&ctp=1&cuid=ac:bc:32:8e:20:31&tok=24.2de810053dc07c5536241b115b2682d7.2592000.1502196739.282335-9757154` } type="audio/mp3" />*/}
      //     <source src={ `http://tsn.baidu.com/text2audio?tex=${encodeURI(barCode)}&lan=zh&ctp=1&cuid=ac:bc:32:8e:20:31&tok=24.2de810053dc07c5536241b115b2682d7.2592000.1502196739.282335-9757154` } type="audio/mp3" />
      //   </video>
      <audio
        ref="baiduMp3"
        src={`http://tsn.baidu.com/text2audio?tex=${encodeURI(
          audioString,
        )}&lan=zh&ctp=1&cuid=ac:bc:32:8e:21:31&tok=${accessToken}`}
      />
    );
  }

  renderTable() {
    const { type } = this.props;
    const { fDataSource, sDataSource, fClearState, sClearState } = this.state;
    // 记住从title里面取枚举值
    const {
      deliveryIn,
      transferIn,
      transferOut,
      remove,
      deliveryDesc,
      transferDesc,
      enterDelivery,
      enterIn,
    } = this.title;
    const { one, two } = this.private;
    const {
      operateCallback,
      stockOrdersIn,
      stockOrdersOut,
      removeHandle,
      stockOrdersAssigned,
      stockOrdersMarkError,
      resetClearState,
    } = this;
    let table = '';
    switch (type) {
      case ARRIVE_DELIVERY:
      case PULL_INBOUND:
        const params = {
          sButton: remove,
        };
        //第一个table
        const props1 = {
          dataSource: fDataSource,
          fButton: deliveryIn,
          clearState: fClearState,
          resetClearState,
          fButtonHandle: stockOrdersIn(one),
          removeHandle: removeHandle(one),
          desc: deliveryDesc,
          columns: INBOUND_SCAN_COLUMNS(operateCallback(one)),
        };
        //第二个table
        const props2 = {
          dataSource: sDataSource,
          fButton: transferIn,
          clearState: sClearState,
          resetClearState,
          fButtonHandle: stockOrdersIn(two),
          removeHandle: removeHandle(two),
          desc: transferDesc,
          columns: INBOUND_SCAN_COLUMNS(operateCallback(two)),
        };
        table = (
          <div>
            <InboundOrder {...props1} {...params} />
            <InboundOrder {...props2} {...params} />
          </div>
        );
        break;
      case KNIGHT_DELIVERY:
        const knightProps = {
          dataSource: fDataSource,
          fButton: enterDelivery,
          sButton: remove,
          clearState: fClearState,
          resetClearState,
          fButtonHandle: stockOrdersAssigned(one),
          removeHandle: removeHandle(one),
          columns: KNIGHT_DELIVERY_SCAN_COLUMNS(operateCallback(one)),
        };
        table = <InboundOrder {...knightProps} />;
        break;
      case TRANSFER_OUTBOUND:
        const transferOutProps = {
          dataSource: fDataSource,
          fButton: transferOut,
          sButton: remove,
          clearState: fClearState,
          resetClearState,
          fButtonHandle: stockOrdersOut(one),
          removeHandle: removeHandle(one),
          columns: TRANSFER_OUTBOUND_SCAN_COLUMNS(operateCallback(one)),
        };
        table = <InboundOrder {...transferOutProps} />;
        break;
      case SALES_INBOUND:
        const salesInboundProps = {
          dataSource: fDataSource,
          fButton: enterIn,
          sButton: remove,
          clearState: fClearState,
          resetClearState,
          fButtonHandle: stockOrdersMarkError(one),
          removeHandle: removeHandle(one),
          columns: SALES_INBOUND_SCAN_COLUMNS(operateCallback(one)),
        };
        table = <InboundOrder {...salesInboundProps} />;
        break;
      default:
        break;
    }
    return table;
  }

  // 操作回调函数, mark 代表来自哪一个table , record代表 回调参数
  operateCallback(mark) {
    const { stockOrderOneMarkError, removeOneHandle } = this;
    const { type } = this.props;
    const menu = record =>
      <Menu onClick={value => stockOrderOneMarkError(mark, value.key, [record.id])}>
        <Menu.Item key="40">有单无货</Menu.Item>
        <Menu.Item key="41">货损</Menu.Item>
        <Menu.Item key="42">其他</Menu.Item>
      </Menu>;
    const operateCall = (record, index) =>
      <div className="operateBox">
        <Dropdown overlay={menu(record)}>
          <Button style={{ marginLeft: 8 }}>
            标记异常并入站 <Icon type="down" />
          </Button>
        </Dropdown>
        <p className={style.removeItem} onClick={() => removeOneHandle(mark, [index])}>
          移除
        </p>
      </div>;
    return (record, index) => {
      switch (type) {
        case ARRIVE_DELIVERY:
        case SALES_INBOUND:
          return operateCall(record, index);
        default:
          return (
            <div className="operateBox">
              <p className={style.removeItem} onClick={() => removeOneHandle(mark, [index])}>
                移除
              </p>
            </div>
          );
      }
    };
  }

  // 获取百度语音token
  getVoiceAccessTokens() {
    const { dispatch } = this.private;
    dispatch({ type: getVoiceAccessToken, payload: {} });
  }

  // 播放百度语音
  playBaiduAudio() {
    const baiduMp3 = this.refs.baiduMp3;
    const isPlaying = baiduMp3.currentTime > 0 && !baiduMp3.paused && !baiduMp3.ended && baiduMp3.readyState > 2;
    if (!isPlaying) {
      // 重置播放源
      baiduMp3.load();
      // 自动播放
      baiduMp3.play();
    }
  }

  // 重置清空选中状态
  resetClearState() {
    this.setState({
      fClearState: false,
      sClearState: false,
    });
  }

  // 仓订单入站
  stockOrdersIn(mark) {
    const { dispatch, one, two, operationTypeByArrive } = this.private;
    const _this = this;
    // 打开更新列表开关
    return (stockOrderIds) => {
      console.log(stockOrderIds);
      confirm({
        title: '批量入站',
        content: `当前选中 ${stockOrderIds.length} 笔，确认批量入站`,
        onOk() {
          _this.setState(
            {
              fOperateState: mark === one, //操作来自table 1
              sOperateState: mark === two, //操作来自table 2
            },
            () => {
              const params = {
                stockOrderIds,
                operationType: operationTypeByArrive,
              };
              dispatch({ type: fetchStockOrdersIn, payload: params });
            },
          );
          console.log('OK');
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    };
  }
  // 仓订单中转出站
  stockOrdersOut = (mark) => {
    const { dispatch, one, two } = this.private;
    const _this = this;
    // 打开更新列表开关
    return (stockOrderIds) => {
      const { nextStockId } = _this.private;
      confirm({
        title: '中转出站',
        content: `当前选中 ${stockOrderIds.length} 笔，确认中转出站`,
        onOk() {
          _this.setState(
            {
              fOperateState: mark === one, //操作来自table 1
              sOperateState: mark === two, //操作来自table 2
            },
            () => {
              const params = {
                stockOrderIds,
                stockOutId: nextStockId,
              };
              dispatch({ type: fetchStockOrdersOut, payload: params });
            },
          );
          console.log('OK');
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    };
  };

  // 仓订单批量分配
  stockOrdersAssigned(mark) {
    const { dispatch, one, two } = this.private;
    const { activeCourierId } = this.state;
    const _this = this;
    // 打开更新列表开关
    return (stockOrderIds) => {
      console.log(stockOrderIds);
      confirm({
        title: '批量分配',
        content: `当前选中 ${stockOrderIds.length} 笔，确认批量分配`,
        onOk() {
          _this.setState(
            {
              fOperateState: mark === one, //操作来自table 1
              sOperateState: mark === two, //操作来自table 2
            },
            () => {
              const params = {
                stockOrderIds,
                courierId: activeCourierId,
              };
              dispatch({ type: fetchStockOrdersAssigned, payload: params });
            },
          );
          console.log('OK');
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    };
  }

  // 根据骑士id 获取骑士信息
  getCouriersDetail(courierId) {
    const { dispatch } = this.private;
    const params = {
      courierId,
    };
    dispatch({ type: getCouriersDetails, payload: params });
  }

  // 仓订单条移除，解决mark传参问题，可与批量移除公用
  // mark表示来自哪一个table
  // rows表示传递的数据
  removeOneHandle(mark, rows) {
    const { removeOne } = this.title;
    this.removeUpdate(removeOne, mark, rows);
    const { dispatch } = this.private;
    // 移除订单时, 清空订单信息& 骑士信息
    dispatch({
      type: clearStockOrder,
    });
  }

  // 仓订单批量移除
  // mark表示来自哪一个table
  removeHandle(mark) {
    const { remove } = this.title;
    const _this = this;
    return rows => this.removeUpdate(remove, mark, rows);
  }

  // 移除更新公用方法
  removeUpdate(title, mark, rows) {
    const { dispatch, one, two } = this.private;
    const { type } = this.props;
    const _this = this;
    confirm({
      title: `${title}`,
      content: `当前选中 ${rows.length} 笔，确认${title}`,
      onOk() {
        // 判断来自哪一个表格的操作
        if (mark === one) {
          const { fDataSource, sDataSource } = _this.state;
          const newDataSource = _this.removeDifferenceRows(rows, fDataSource);
          _this.setState({
            fDataSource: newDataSource,
            fClearState: true,
            orderCount: newDataSource.length + sDataSource.length,
          });
        } else if (mark === two) {
          const { fDataSource, sDataSource } = _this.state;
          const newDataSource = _this.removeDifferenceRows(rows, sDataSource);
          _this.setState({
            sDataSource: newDataSource,
            sClearState: true,
            orderCount: newDataSource.length + fDataSource.length,
          });
        }
        // 中转出站界面
        if (type === TRANSFER_OUTBOUND) {
          // 清空下一站列表
          dispatch({ type: clearStockListByNext, payload: {} });
        }
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  // 当前选中列表与原列表差集，用于移除
  // 删除扫码列表数据
  removeDifferenceRows(rows, dataSource) {
    // 第一种方法 空间复杂度较大
    const newDataSource = [];
    for (let x = 0, y = dataSource.length; x < y; x++) {
      let flag = false;
      // rows数组中的为dataSource index坐标， 判断dataSource 当前坐标是否存在 rows 中，即可分出删除项
      for (let i = 0, j = rows.length; i < j; i++) {
        if (Number(rows[i]) === x) {
          flag = true;
          // 当存在时，结束 rows 循环
          break;
        }
      }
      // flag为true则过滤，为false则保留至新数组
      !flag && newDataSource.push(dataSource[x]);
    }
    return newDataSource;
    // 第二种方法 时间复杂度较大，即rows 排倒序，使 fDataSource 从后往前用 splice 删除元素, 最后得到删除元素之后的数组; 由于splice 是改变当前数组，所以不能从前往后
  }

  //仓订单批量标记异常回调，退货入站页面确认入站
  stockOrdersMarkError(mark) {
    const _this = this;
    const { errorFlag } = this.private;
    return (stockOrderIds) => {
      console.log(stockOrderIds);
      confirm({
        title: '退货入站',
        content: `当前退货入站 ${stockOrderIds.length} 笔，入站后需继续进行异常单处理，确认入站？`,
        onOk() {
          _this.markErrorUpdate(mark, errorFlag, stockOrderIds);
          console.log('OK');
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    };
  }

  // 仓订单单条标记异常回调
  stockOrderOneMarkError(mark, value, stockOrderIds) {
    this.markErrorUpdate(mark, value, stockOrderIds);
  }

  // 仓订单标记异常公用方法
  markErrorUpdate(mark, value, stockOrderIds) {
    const { dispatch, errorNote } = this.private;
    const { one, two } = this.private;
    // 打开更新列表开关
    this.setState({
      fOperateState: mark === one, //操作来自table 1
      sOperateState: mark === two, //操作来自table 2
    });
    console.log('------仓订单标记异常回调------');
    const params = {
      stockOrderIds,
      errorFlag: Number(value),
      errorNote,
    };
    dispatch({ type: fetchStockOrdersMarkError, payload: params });
  }

  // 选择下一站
  handleChange(value) {
    // this.setState({
    //   nextStand: value,
    // });
    this.private.nextStockId = value;
    console.log(this.private.nextStockId);
  }

  // 扫描条码获取仓库订单
  getOrderByScanBarCode(barcode) {
    const { dispatch, limit, vendorId } = this.private;
    const params = {
      vendorId,
      barcode,
    };
    dispatch({ type: getStockOrdersList, payload: params });
  }

  render() {
    const {
      renderDriver,
      renderKnight,
      renderCarNumber,
      renderScanOrder,
      renderCard,
      renderNextStation,
      renderStoreroom,
      renderTable,
      renderBaiduVideo,
    } = this;
    const { showDriver, showKnight, showCar, showScan, showCard, showNext, showStoreroom } = this.state;
    return (
      <div className="bd-content">
        <Tabs onChange={this.onChange} type="card">
          <TabPane tab={'扫描订单'} closable={false} key="1">
            <div>
              <Form layout="horizontal">
                <Row gutter={24}>
                  <Col sm={24}>
                    {/* 百度语音合成模块 */}
                    {renderBaiduVideo()}
                    {/* 扫描司机模块 */}
                    {/*{showDriver && renderDriver()}*/}
                    {/* 扫描骑士模块 */}
                    {showKnight && renderKnight()}
                    {/* 扫描车牌号模块 */}
                    {/*{showCar && renderCarNumber()}*/}
                    {/* 扫描单号模块 */}
                    {showScan && renderScanOrder()}
                    {/* 扫描下一站模块 */}
                    {showNext && renderNextStation()}
                    {/* 库房模块 */}
                    {/*{showStoreroom && renderStoreroom()}*/}
                    {/* 扫描信息卡片模块 */}
                    {showCard && renderCard()}
                    {/* 渲染表格信息 */}
                    {renderTable()}
                  </Col>
                </Row>
              </Form>
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

function mapStateToProps({ SiteOperate, BusinessStock }) {
  return { SiteOperate, BusinessStock };
}

export default connect(mapStateToProps)(Form.create()(ScanOrder));
