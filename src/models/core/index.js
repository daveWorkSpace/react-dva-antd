import { hashHistory, routerRedux } from 'dva/router';
import { message } from 'antd';
import { coreSystemNotification } from 'aoao-core-api-service/lib/core';
import { authorize } from '../../application'

//系统设置
const SystemConfig = {
  appCode: 'aoao_pc',
}

//通知状态
const NotificationState = {
  enable: 100,    //可用
  disable: -100,  //不可用
}

let systemNotificationUpdateTimestamp = 0   //系统通知更新的时间戳

module.exports = {
  namespace: 'coreModule',
  state: {
    systemNotification: [],               //系统通知
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        dispatch({ type: 'fetchSystemNotification' });
      })
    },
  },

  effects: {
    //获取系统通知
    * fetchSystemNotification({ payload }, { call, put }) {
      //判断是否登陆，如果未登陆，则直接返回
      if (authorize.isLogin() === false) {
        return;
      }

      //判断时间是否在两分钟之内，两分钟以内不再重新获取
      const timestamp = new Date().getTime() - (1000 * 60 * 2);
      if ((timestamp - systemNotificationUpdateTimestamp) < 0) {
        return
      }

      //获取系统通知
      const response = yield call(coreSystemNotification, SystemConfig.appCode, NotificationState.enable);
      yield put({ type: 'reduceSystemNotification', payload: response })
    },
  },

  reducers: {

    //保存成功后回调
    reduceSystemNotification(state, { payload }) {
      //获取通知数据
      let systemNotification = payload.data;
      if (systemNotification === undefined || systemNotification.length < 1) {
        systemNotification = [];
      }
      systemNotificationUpdateTimestamp = new Date().getTime()
      return { ...state, systemNotification };
    },
  },
}
