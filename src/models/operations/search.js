//运力订单查询

import is from 'is_js';
import {
  hashHistory,
  routerRedux,
} from 'dva/router';
import {
  message,
} from 'antd';

import {
  Modules,
} from '../../application/define';
import { Errors } from '../../application/define/event';
import {
  fetchShipmentsList,
  fetchShipmentsDetails,
  fetchShipmentsTrackLogs,
  operationsPushOrderRecord,
} from 'aoao-core-api-service/lib/operations';

import {
  fetchSellerOrdersTrackLog,
} from 'aoao-core-api-service/lib/order';

//设置清单数据
const mockListData = [{
  id: '1',
  sellerName: 'John Brown',
  areaName: '朝阳区',
  payType: 1,
  deliveryDistance: 3.5,
  deliveryTime: '2017-06-20 16:42:00',
  orderState: 32,
  orderSumOfMoney: 50,
  payForSeller: 24,
  payForCustomer: 26,
  deliveryExpectTime: '2017-06-20 16:42:00',
  createTime: '2017-06-20 16:42:00',
}, {
  id: '2',
  sellerName: 'John Brown',
  areaName: '朝阳区',
  payType: 1,
  deliveryDistance: 3.5,
  deliveryTime: '2017-06-20 16:42:00',
  orderState: 32,
  orderSumOfMoney: 50,
  payForSeller: 24,
  payForCustomer: 26,
  deliveryExpectTime: '2017-06-20 16:42:00',
  createTime: '2017-06-20 16:42:00',
}, {
  id: '3',
  sellerName: 'John Brown',
  areaName: '朝阳区',
  payType: 1,
  deliveryDistance: 3.5,
  deliveryTime: '2017-06-20 16:42:00',
  orderState: 32,
  orderSumOfMoney: 50,
  payForSeller: 24,
  payForCustomer: 26,
  deliveryExpectTime: '2017-06-20 16:42:00',
  createTime: '2017-06-20 16:42:00',
}];

module.exports = {
  namespace: 'OperationsManage',
  state: {
    shipmentsList: {
      _meta: {},
      data: [],
    }, //运单列表
    shipmentsDetails: [],   //运单详情
    shipmentsTrackLogs: {   //运单物流追踪
      _meta: {},
      data: [],
    },
    pushOrderRecord: {   //运单的推单记录
      _meta: {},
      data: [],
    },
  },

  subscriptions: {
    setup({
      dispatch,
      history,
    }) {
      history.listen(({
        pathname,
      }) => {
        //判断是否访问列表页
        // if (Modules.equalPath(Modules.operationsSearch, pathname)) {
        //   //获取列表页数据
        //   dispatch({ type: 'fetchList' });
        // }
      });
    },
  },

  effects: {

    //获取运单列表数据
    * getShipmentsList({ payload }, { call, put }) {
      const shipmentsList = yield call(fetchShipmentsList, payload)
      if (!shipmentsList) {
        message.error('查询失败');
        return;
      }
      yield put({
        type: 'reduceShipmentsList',
        payload: shipmentsList,
      });
    },

    //获取运单详情
    * getShipmentsDetails({ payload }, { call, put }) {
      const shipmentsDetails = yield call(fetchShipmentsDetails, payload)
      if (!shipmentsDetails) {
        message.error('查询失败');
        return;
      }
      yield put({
        type: 'reduceShipmentsDetails',
        payload: shipmentsDetails,
      });
    },

    //通过运单ID获取该运单的物流信息
    * getShipmentsTrackLogs({ payload }, { call, put }) {
      const shipmentsTrackLogs = yield call(fetchSellerOrdersTrackLog, payload)
      if (!shipmentsTrackLogs) {
        message.error('查询失败');
        return;
      }
      yield put({
        type: 'reduceShipmentsTrackLogs',
        payload: shipmentsTrackLogs,
      });
    },

    // 通过运单ID获取该运单的推单记录
    * getPushOrderRecord({
      payload,
    }, {
      call,
      put,
    }) {
      const pushOrderRecord = yield call(operationsPushOrderRecord, payload)
      if (!pushOrderRecord) {
        message.error('推单记录查询失败');
        return;
      }
      yield put({
        type: 'reducePushOrderRecord',
        payload: pushOrderRecord,
      });
    },
  },

  reducers: {

    reduceShipmentsList(state, {
      payload,
    }) {
      const {
        shipmentsList,
      } = state;
      Object.assign(shipmentsList, payload);
      return { ...state,
        shipmentsList,
      };
    },

    // 获取运单详情
    reduceShipmentsDetails(state, {
      payload,
    }) {
      const {
        shipmentsDetails,
      } = state;
      Object.assign(shipmentsDetails, payload);

      return { ...state,
        shipmentsDetails,
      };
    },

    // 通过运单ID获取该运单的物流信息
    reduceShipmentsTrackLogs(state, {
      payload,
    }) {
      const {
        shipmentsTrackLogs,
      } = state;
      Object.assign(shipmentsTrackLogs, payload);
      return { ...state,
        shipmentsTrackLogs,
      };
    },

    // 通过运单ID获取该运单的推单记录
    reducePushOrderRecord(state, {
      payload,
    }) {
      const {
        pushOrderRecord,
      } = state;
      Object.assign(pushOrderRecord, payload);
      return { ...state,
        pushOrderRecord,
      };
    },
  },
}
