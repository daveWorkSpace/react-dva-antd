import is from 'is_js';
import { hashHistory, routerRedux } from 'dva/router';
import { message } from 'antd';
import { fetchStockOrdersLog } from 'aoao-core-api-service/lib/dispatcher';
module.exports = {
  namespace: 'OperateRecord',
  state: {
    stockOrdersLog: {
      _meta: {},
      data: [],
    },  //仓订单操作日志
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {});
    },
  },

  effects: {
    // 获取仓订单日志
    * getStockOrdersLog({ payload }, { call, put }) {
      const stockOrdersLog = yield call(fetchStockOrdersLog, payload);
      if (!stockOrdersLog) {
        message.error('获取仓订单日志失败');
        return;
      }
      yield put({
        type: 'reduceStockOrdersLog',
        payload: stockOrdersLog,
      });
    },
  },

  reducers: {
    // 获取仓订单日志
    reduceStockOrdersLog(state, { payload }) {
      const { stockOrdersLog } = state;
      Object.assign(stockOrdersLog, payload);
      return {
        ...state,
        stockOrdersLog,
      };
    },
  },
};
