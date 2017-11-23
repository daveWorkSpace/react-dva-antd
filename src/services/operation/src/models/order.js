/**
 * Created by user on 17/2/16.
 */
import { hashHistory, routerRedux } from 'dva/router';
import { message } from 'antd';
import moment from 'moment';

import aoaoAppSystemFlag from './../../../../utils/systemConfig';
import { authorize } from './../../../../application';

import {
  fetchTotalOrderStatistics,   //获取订单状态
  fetchSellerOrderStatistics,  //获取服务商订单状态
  fetchOrderCityList,          //获取城市列表

  fetchSellerOrderList,        //获取商家订单列表

  fetchAreaOrderList,          //获取区域订单列表

  fetchCloseOrderList,         //异常订单列表
  fetchCloseOrderDetail,       //异常订单详情
  fetchCloseOrderLog,          //异常订单日志
  fetchCloseOrderRedivides,    //异常订单操作－－－重新分单
  fetchCloseOrder,             //异常订单操作－－－关闭订单
} from '../services/order';

module.exports = {
  //module层命名
  namespace: 'operationOrder',

  // 初始化数据源
  state: {
    totalOrderStatistics: [],  //总订单状态
    sellerOrderStatistics: [], //供应商订单状态
    cityList: [],              //城市选择清单

    sellerOrderList: [],       //商家订单列表

    areaOrderList: [],         //区域订单列表

    closeOrderList: [],        //异常订单列表
    closeOrderDetail: [],      //异常订单详情
    closeOrderLog: [],         //异常订单日志
    redivideOder: {},          //异常订单操作---重新分单
    closeOrder: {},            //异常订单操作---关闭订单

    sellerMeta: {},            //商家
    closeMeta: {},             //异常订单列表
    detailMeta: {},            //详情
    areaMeta: {},              //服务商（区域）列表
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const vendor_id = authorize.auth.vendorId;
        const { pathname } = location;
        const vendorId = vendor_id;

        //---------pathname用于监视是否当前路径需要请求接口----------

        //分单中心
        if (pathname === '/operation/order') {
          //filter获取此服务商存在的城市列表
          dispatch({
            type: 'fetchOrderCityList',
            payload: vendorId,
          });
        }

        //异常订单查看
        if (pathname === '/operation/order/close') {
          //filter获取此服务商存在的城市列表
          dispatch({
            type: 'fetchOrderCityList',
            payload: vendorId,
          });
        }
      });
    },
  },

  effects: {

    //获取城市列表
    * fetchOrderCityList({ payload: vendorId }, { call, put }) {
      if (aoaoAppSystemFlag.IS_API_CITY_DATA === true) {
        const response = yield call(fetchOrderCityList, vendorId);
        yield put({ type: 'reducerOrderCityList', payload: response });
      }
    },

    //获取订单状态
    * fetchTotalOrderStatistics({ payload }, { call, put }) {
      const { vendorId, cityCode, shippingDate, isDirect } = payload;
      const response = yield call(fetchTotalOrderStatistics, vendorId, cityCode, shippingDate, isDirect);
      yield put({ type: 'reducerTotalOrderStatistics', payload: response });
    },

    //获取商家订单状态
    * fetchSellerOrderStatistics({ payload }, { call, put }) {
      const { vendorId, sellerId, cityCode, shippingDate, isDirect } = payload;
      const response = yield call(fetchSellerOrderStatistics, vendorId, sellerId, cityCode, shippingDate, isDirect);
      yield put({ type: 'reducerSellerOrderStatistics', payload: response });
    },

    //获取商家订单列表---, page, limit, sort
    * fetchSellerOrderList({ payload }, { call, put }) {
      const { vendorId, cityCode, shippingDate, isDirect, page, limit, sort } = payload;
      const response = yield call(fetchSellerOrderList, vendorId, cityCode, shippingDate, isDirect, page, limit, sort);
      const payloadData = { sellerOrderList: response.data, sellerMeta: response._meta };
      yield put({ type: 'reducerSellerOrderList', payloadData });
    },

    //获取区域订单列表---, page, limit, sort
    * fetchAreaOrderList({ payload }, { call, put }) {
      const { sellerId, vendorId, cityCode, shippingDate, isDirect, page, limit, sort } = payload;
      const response = yield call(fetchAreaOrderList, sellerId, vendorId, cityCode, shippingDate, isDirect, page, limit, sort);
      const payloadData = { areaOrderList: response.data, areaMeta: response._meta };
      yield put({ type: 'reducerAreaOrderList', payloadData });
    },

    //获取异常订单列表
    * fetchCloseOrderList({ payload }, { call, put }) {
      const response = yield call(fetchCloseOrderList, payload);
      const payloadData = { closeOrderList: response.data, closeMeta: response._meta };
      yield put({ type: 'reducerCloseOrderList', payloadData });
    },

    //获取异常订单详情
    * fetchCloseOrderDetail({ payload: orderId }, { call, put }) {
      const response = yield call(fetchCloseOrderDetail, orderId);
      yield put({ type: 'reducerCloseOrderDetail', payload: response });
    },

    //获取异常订单日志
    * fetchCloseOrderLog({ payload }, { call, put }) {
      const { shipmentId, page, limit, sort } = payload;
      const response = yield call(fetchCloseOrderLog, shipmentId, page, limit, sort);
      // const response = yield call(fetchCloseOrderLog, shipmentId);
      const payloadData = { closeOrderLog: response.data, detailMeta: response._meta };
      yield put({ type: 'reducerCloseOrderLog', payloadData });
    },

    //获取异常订单操作－－-重新分单
    * fetchCloseOrderRedivides({ payload }, { call, put }) {
      const { vendorId, orderId, operatorId, note } = payload;
      const response = yield call(fetchCloseOrderRedivides, vendorId, orderId, operatorId, note);
      const payloadData = { redivideOder: response.data };
      yield put({ type: 'reducerCloseOrderRedivides', payloadData });
    },

    //获取异常订单操作－－-关闭订单
    * fetchCloseOrder({ payload }, { call, put }) {
      const { orderId, closedType, closedNote, operatorId } = payload;
      const response = yield call(fetchCloseOrder, orderId, closedType, closedNote, operatorId);
      const payloadData = { closeOrder: response.data };
      yield put({ type: 'reducerCloseOrder', payloadData });
    },
  },

  reducers: {

    //分单中心城市列表
    reducerOrderCityList(state, { payload: cityList }) {
      return { ...state, cityList };
    },

    //订单状态
    reducerTotalOrderStatistics(state, { payload: totalOrderStatistics }) {
      return { ...state, totalOrderStatistics };
    },

    //获取商家订单状态
    reducerSellerOrderStatistics(state, { payload: sellerOrderStatistics }) {
      return { ...state, sellerOrderStatistics };
    },

    //商家订单列表
    reducerSellerOrderList(state, payload) {
      return {
        ...state,
        sellerOrderList: payload.payloadData.sellerOrderList,
        sellerMeta: payload.payloadData.sellerMeta,
      };
    },

    //区域订单列表
    reducerAreaOrderList(state, payload) {
      return { ...state, areaOrderList: payload.payloadData.areaOrderList, areaMeta: payload.payloadData.areaMeta };
    },

    //异常订单列表
    reducerCloseOrderList(state, payload) {
      return { ...state, closeOrderList: payload.payloadData.closeOrderList, closeMeta: payload.payloadData.closeMeta };
    },

    //异常订单详情
    reducerCloseOrderDetail(state, { payload: closeOrderDetail }) {
      return { ...state, closeOrderDetail };
    },

    //异常订单日志
    reducerCloseOrderLog(state, payload) {
      return { ...state, closeOrderLog: payload.payloadData.closeOrderLog, detailMeta: payload.payloadData.detailMeta };
    },

    //异常订单操作－－－重新分单
    reducerCloseOrderRedivides(state, payload) {
      return { ...state, redivideOder: payload.payloadData.redivideOder };
    },

    //异常订单操作－－－关闭异订单
    reducerCloseOrder(state, payload) {
      return { ...state, closeOrder: payload.payloadData.closeOrder };
    },
  },
};
