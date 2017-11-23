//运力订单查询
import is from 'is_js';
import dot from 'dot-prop'
import { hashHistory, routerRedux } from 'dva/router';
import { message, notification } from 'antd';

import {
  fetchVendorOrderList,
  vendorOrderClose,
  fetchVendorOrderDetails,
  fetchSellerOrdersTrackLog,
  fetchShipmentsDailyByVendor,
  fetchDownloadFile,
} from 'aoao-core-api-service/lib/order';

const { utcToDate, downloadURI } = window.tempAppTool;

module.exports = {
  namespace: 'OrderManage',
  state: {
    vendorOrderList: { _meta: {}, data: [] }, //服务商订单列表
    updateState: false,     //更新状态
    vendorOrderDetails: [], //订单详情
    vendorOrderTrackLogs: { _meta: {}, data: [] },  //获取订单操作日志
    shipmentsDaily: { _meta: {}, data: [] },        //日订单统计接口

    isCloseVendorOrderSuccess: false,  //是否回调关闭订单操作
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {});
    },
  },

  effects: {
    //获取服务商订单列表数据
    * getVendorOrderList({ payload }, { call, put }) {
      const vendorOrderList = yield call(fetchVendorOrderList, payload);
      if (!vendorOrderList) {
        message.error('查询失败');
        return;
      }
      yield put({
        type: 'reduceVendorOrderList',
        payload: vendorOrderList,
      });
    },

    //关闭一个订单
    * closeSingleVendorOrder({ payload }, { call, put }) {
      const result = yield call(vendorOrderClose, payload);
      if (!result) {
        message.error('取消订单失败, 接口返回错误');
        return;
      }

      //判断取消单个订单的数据，如果错误，则报错
      // if (dot.get(result, '0.ok') !== true) {
      //   message.success(`取消订单失败: ${dot.get(result, '0.msg')}`);
      // }

      message.success('取消订单成功');
      yield put({ type: 'reduceUpdateState', payload: { updateState: true } });
    },

    //批量关闭订单
    * closeMultiVendorOrders({ payload }, { call, put }) {
      const result = yield call(vendorOrderClose, payload);
      if (!result) {
        message.error('取消订单失败, 接口返回错误');
        return;
      }
      // [{"id": "59686e05998269739ee581c0", "msg": "服务商订单非异常状态，不允许关闭.", "ok": false}]
      //失败的订单
      // const failOrders = [];
      // const successOrders = []
      // //处理结果数据
      // result.forEach((order, array) => {
      //   if (order.ok === false) {
      //     failOrders.push(`${order.id} : ${order.msg} `);
      //   } else {
      //     successOrders.push(`${order.id} : ${order.msg} `);
      //   }
      // });

      // const description = `${successOrders} ${failOrders}`;

      //取消失败的订单。
      // notification.open({
      //   message: '批量处理结果',
      //   description,
      //   style: {
      //     width: 500,
      //     marginLeft: 335 - 500,
      //   },
      //   duration: null,
      // });

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

    // 获取服务商订单详情
    * getOrderDetails({ payload }, { call, put }) {
      const vendorOrderDetails = yield call(fetchVendorOrderDetails, payload);
      if (!vendorOrderDetails) {
        message.error('查询失败');
        return;
      }
      yield put({
        type: 'reduceVendorOrderDetails',
        payload: vendorOrderDetails,
      });
    },

    // 通过订单ID获取该订单的物流信息
    * getOrderTrackLogs({ payload }, { call, put }) {
      const vendorOrderTrackLogs = yield call(fetchSellerOrdersTrackLog, payload);
      if (!vendorOrderTrackLogs) {
        message.error('查询失败');
        return;
      }
      yield put({
        type: 'reduceVendorOrderTrackLogs',
        payload: vendorOrderTrackLogs,
      });
    },

    // 日订单统计接口
    * getShipmentsDailyByVendor({ payload }, { call, put }) {
      const shipmentsDaily = yield call(fetchShipmentsDailyByVendor, payload);
      if (!shipmentsDaily) {
        message.error('查询失败');
        return;
      }
      yield put({
        type: 'reduceShipmentsDaily',
        payload: shipmentsDaily,
      });
    },

    // 下载统计文件接口
    * getDownloadFileUrl({ payload }, { call, put }) {
      const downloadFileUrl = yield call(fetchDownloadFile, payload);
      if (!downloadFileUrl) {
        message.error('查询失败');
        return;
      }
      if (downloadFileUrl.ok) {
        // 动态下载文件
        downloadURI(downloadFileUrl.url);
      }
    },
  },

  reducers: {
    // 获取服务商订单列表数据
    reduceVendorOrderList(state, { payload }) {
      const { vendorOrderList } = state;
      Object.assign(vendorOrderList, payload);
      return {
        ...state,
        vendorOrderList,
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

    // 获取服务商订单详情
    reduceVendorOrderDetails(state, { payload }) {
      const { vendorOrderDetails } = state;
      Object.assign(vendorOrderDetails, payload);

      return {
        ...state,
        vendorOrderDetails,
      };
    },

    // 通过订单ID获取该订单的物流信息
    reduceVendorOrderTrackLogs(state, { payload }) {
      const { vendorOrderTrackLogs } = state;
      Object.assign(vendorOrderTrackLogs, payload);
      return {
        ...state,
        vendorOrderTrackLogs,
      };
    },

    // 日订单统计接口
    reduceShipmentsDaily(state, { payload }) {
      const { shipmentsDaily } = state;
      Object.assign(shipmentsDaily, payload);
      return {
        ...state,
        shipmentsDaily,
      };
    },
  },
};
