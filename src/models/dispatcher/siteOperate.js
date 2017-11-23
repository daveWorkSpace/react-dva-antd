import is from 'is_js';
import dot from 'dot-prop'
import { hashHistory, routerRedux } from 'dva/router';
import { message } from 'antd';
import {
  stockOrdersCancleMarkError,
  stockOrdersOut,
  fetchStockOrdersList,
  stockOrdersClose,
  stockOrdersMarkError,
  fetchStockOrdersDetail,
  stockOrdersIn,
  stockOrdersAssigned,
  stockOrdersRedispatch,
  fetchCouriersDetails,
  fetchStockOrdersStatistic,
  fetchVoiceAccessToken,
} from 'aoao-core-api-service/lib/dispatcher';
import { fetchStockListByDelivery } from 'aoao-core-api-service/lib/stock';
import { fetchBaiduAccessToken, fetchBaiduText2Audio } from 'aoao-core-api-service/lib/core';
import { authorize } from '../../application';
import { Errors } from '../../application/define';

module.exports = {
  namespace: 'SiteOperate',
  state: {
    accessToken: '',    //百度语音token
    stockOrdersList: {
      _meta: {},
      data: [],
    }, //仓订单列表
    updateState: false, //更新状态
    updateStateByStockOrder: false, //请求仓订单列表更新状态
    stockListByDelivery: { _meta: {}, data: [] }, // 配送站列表
    stockListByNext: { _meta: {}, data: [] },     //下一站列表
    successList: [], //操作成功订单列表
    couriersDetails: {}, //骑士详情
    stockOrderDetails: {},      //仓订单详情
    stockOrdersStatistic: {},     //仓库日订单实时统计
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        // 分拨模块调用
        if (pathname.indexOf('/dispatcher/') !== -1) {
          // 获取所有配送站列表
          const params = {
            vendorId: authorize.auth.vendorId,
            cityCode: dot.get(authorize.vendor, 'city.code'),
            state: 100, //仓库状态（100：启用 -100：禁用）
            isDelivery: true, //是否有配送能力（true：是 false：否）
            ifTotal: true,    //是否返回直营和加盟仓库[此时vendor_id必须]（true：是 false：否）
            page: 1,
            size: 999,
            sort: '{"_id":-1}',
          };
          // 请求配送站列表
          dispatch({ type: 'getStockListByDelivery', payload: params });
          // 请求百度语音的token
          dispatch({ type: 'getVoiceAccessToken', payload: {} });
        }
        // if (pathname.indexOf('/dispatcher/arrive') !== -1 || pathname.indexOf('/dispatcher/knight/delivery') !== -1 || pathname.indexOf('/dispatcher/sales/inbound') !== -1) {
        // }
      });
    },
  },

  effects: {
    // 百度语音合成token
    * getVoiceAccessToken({ payload }, { call, put }) {
      const accessToken = yield call(fetchVoiceAccessToken, payload);
      if (!accessToken) {
        console.log('获取百度语音token失败')
        return;
      }
      yield put({
        type: 'reduceAccessToken',
        payload: accessToken.access_token,
      });
    },

    // 获取所有配送站列表
    * getStockListByDelivery({ payload }, { call, put }) {
      const stockListByDelivery = yield call(fetchStockListByDelivery, payload);
      yield put({
        type: 'reduceStockListByDelivery',
        payload: stockListByDelivery,
      });
    },

    // 获取所有下一站列表
    * getStockListByNext({ payload }, { call, put }) {
      const stockListByNext = yield call(fetchStockListByDelivery, payload);
      yield put({
        type: 'reduceStockListByNext',
        payload: stockListByNext,
      });
    },

    // 清空下一站列表
    * clearStockListByNext({ payload }, { call, put }) {
      yield put({
        type: 'reduceStockListByNext',
        payload: { _meta: {}, data: [] },
      });
    },

    // 仓库日订单实时统计接口 
    * getStockOrdersStatistic({ payload }, { call, put }) {
      const result = yield call(fetchStockOrdersStatistic, payload);
      if (!result) {
        message.error('获取实时统计失败');
        return;
      }
      yield put({
        type: 'reduceStockOrdersStatistic',
        payload: result,
      });
    },

    // 仓订单批量取消标记异常接口
    * fetchStockOrdersCancleMarkError({ payload }, { call, put }) {
      const result = yield call(stockOrdersCancleMarkError, payload);
      if (!result) {
        message.error('撤销异常失败');
        return;
      }
      message.success(`成功${result._meta.success_count}单`);
      message.error(`失败${result._meta.error_count}单`);
      const state = true;
      yield put({
        type: 'reduceUpdateState',
        payload: { updateState: state },
      });
    },

    // 仓订单批量出站接口
    * fetchStockOrdersOut({ payload }, { call, put }) {
      const result = yield call(stockOrdersOut, payload);
      if (!result) {
        message.error('出站失败');
        return;
      }
      message.success(`成功${result._meta.success_count}单`);
      message.error(`失败${result._meta.error_count}单`);
      const state = true;
      yield put({
        type: 'reduceUpdateState',
        payload: { updateState: state },
      });
    },

    // 查询仓订单
    * getStockOrdersList({ payload }, { call, put }) {
      const stockOrdersList = yield call(fetchStockOrdersList, payload);
      if (!stockOrdersList) {
        message.error('查询失败');
        return;
      }
      // 只用于站点操作 仓订单请求成功开启：updateStateByStockOrder 用户控制仓订单数据请求开始-结束
      if (!dot.has(payload,'page')) {
        yield put({
          type: 'updateStateByStockOrder',
          payload: true,
        })
      }
      
      yield put({
        type: 'reduceStockOrdersList',
        payload: stockOrdersList,
      });
    },
    
    // 更新state函数
    * updateStateByStockOrderFunc({ payload }, { call, put }) {
      yield put({
        type: 'updateStateByStockOrder',
        payload,
      })
    },

    // 仓订单批量关闭接口
    * fetchStockOrdersClose({ payload }, { call, put }) {
      const result = yield call(stockOrdersClose, payload);
      if (!result) {
        message.error('取消订单失败');
        return;
      }
      message.success(`成功${result._meta.success_count}单`);
      message.error(`失败${result._meta.error_count}单`);
      const state = true;
      yield put({
        type: 'reduceUpdateState',
        payload: { updateState: state },
      });
    },

    // 纯更新状态函数
    * updateStateFunc({ payload }, { call, put }) {
      const { state } = payload;
      yield put({
        type: 'reduceUpdateState',
        payload: { updateState: state },
      });
    },

    // 仓订单标记异常
    * fetchStockOrdersMarkError({ payload }, { call, put }) {
      const result = yield call(stockOrdersMarkError, payload);
      if (is.truthy(result.error) && is.not.empty(result.data)) {
        message.error(`标记异常失败 : ${Errors.message(response.error)}`);
        return;
      }
      const successList = [];
      for (let i = 0, j = result.data.length; i < j; i++) {
        if (result.data[i].ok) {
          successList.push(result.data[i].id);
        }
      }
      message.success(`成功${result._meta.success_count}单`);
      message.error(`失败${result._meta.error_count}单`);
      yield put({
        type: 'reduceSuccessList',
        payload: successList,
      });
    },

    // 仓订单详情
    * getStockOrdersDetails({ payload }, { call, put }) {
      const stockOrderDetails = yield call(fetchStockOrdersDetail, payload);
      if (!stockOrderDetails) {
        message.error('获取仓订单详情失败');
        return;
      }
      yield put({
        type: 'reduceStockOrderDetails',
        payload: stockOrderDetails,
      });
    },

    // 仓订单入站
    * fetchStockOrdersIn({ payload }, { call, put }) {
      const result = yield call(stockOrdersIn, payload);
      if (is.truthy(result.error) && is.not.empty(result.data)) {
        message.error(`入站失败 : ${Errors.message(response.error)}`);
        return;
      }
      const successList = [];
      for (let i = 0, j = result.data.length; i < j; i++) {
        if (result.data[i].ok) {
          successList.push(result.data[i].id);
        }
      }
      message.success(`成功${result._meta.success_count}单`);
      message.error(`失败${result._meta.error_count}单`);
      yield put({
        type: 'reduceSuccessList',
        payload: successList,
      });
    },

    // 仓订单批量分配
    * fetchStockOrdersAssigned({ payload }, { call, put }) {
      const result = yield call(stockOrdersAssigned, payload);
      if (is.truthy(result.error) && is.not.empty(result.data)) {
        message.error(`分配失败 : ${Errors.message(response.error)}`);
        return;
      }
      const successList = [];
      for (let i = 0, j = result.data.length; i < j; i++) {
        if (result.data[i].ok) {
          successList.push(result.data[i].id);
        }
      }
      message.success(`成功${result._meta.success_count}单`);
      message.error(`失败${result._meta.error_count}单`);
      yield put({
        type: 'reduceSuccessList',
        payload: successList,
      });
    },

    // 根据骑士id 获取骑士详情
    * getCouriersDetails({ payload }, { call, put }) {
      const couriersDetails = yield call(fetchCouriersDetails, payload);
      if (is.truthy(couriersDetails.error) && is.not.empty(couriersDetails.data)) {
        message.error(`获取骑士详情失败 : ${Errors.message(response.error)}`);
        return;
      }
      yield put({
        type: 'reduceCouriersDetails',
        payload: couriersDetails,
      });
    },

    // 仓订单重新分配接口
    * fetchStockOrdersRedispatch({ payload }, { call, put }) {
      const result = yield call(stockOrdersRedispatch, payload);
      if (!result) {
        message.error('重新分配失败');
        return;
      }
      message.success(`成功${result._meta.success_count}单`);
      message.error(`失败${result._meta.error_count}单`);
      const state = true;
      yield put({
        type: 'reduceUpdateState',
        payload: { updateState: state },
      });
    },
  },

  reducers: {
    // 获取百度语音token
    reduceAccessToken(state, { payload }) {
      const accessToken = payload;
      return {
        ...state,
        accessToken,
      };
    },

    // 获取配送站列表
    reduceStockListByDelivery(state, { payload }) {
      const { stockListByDelivery } = state;
      Object.assign(stockListByDelivery, payload);
      return {
        ...state,
        stockListByDelivery,
      };
    },

    // 获取下一站列表，需跟配送站列表分开
    reduceStockListByNext(state, { payload }) {
      const stockListByNext = payload;
      // Object.assign(stockListByNext, payload);
      return {
        ...state,
        stockListByNext,
      };
    },

    // 更新状态
    reduceUpdateState(state, { payload }) {
      const { updateState } = payload;
      return {
        ...state,
        updateState,
      };
    },

    // 请求仓订单列表更新状态
    updateStateByStockOrder(state, { payload }) {
      const updateStateByStockOrder  = payload;
      return {
        ...state,
        updateStateByStockOrder,
      };
    },

    // 仓库日订单实时统计接口
    reduceStockOrdersStatistic(state, { payload }) {
      const stockOrdersStatistic = payload;
      return {
        ...state,
        stockOrdersStatistic,
      };
    },

    // 仓订单操作，返回成功的订单列表，直接覆盖
    reduceSuccessList(state, { payload }) {
      const successList = payload;
      return {
        ...state,
        successList,
      };
    },

    // 返回骑士信息
    reduceCouriersDetails(state, { payload }) {
      const { couriersDetails } = state;
      Object.assign(couriersDetails, payload);
      return {
        ...state,
        couriersDetails,
      };
    },

    // 仓订单查询
    reduceStockOrdersList(state, { payload }) {
      // const { stockOrdersList } = state;
      // Object.assign(stockOrdersList, payload);
      const stockOrdersList = payload;
      return {
        ...state,
        stockOrdersList,
      };
    },
    // 清除数据-站点曹组跳转页面时
    clearStockOrder (state, { payload }){
      return {
        ...state,
        stockOrdersList: [],  // 清空仓订单信息
        couriersDetails: {},  // 清空骑士信息
      };
    },
    // 获取仓订单详情
    reduceStockOrderDetails(state, { payload }) {
      const { stockOrderDetails } = state;
      Object.assign(stockOrderDetails, payload);
      return {
        ...state,
        stockOrderDetails,
      };
    },
  },
};
