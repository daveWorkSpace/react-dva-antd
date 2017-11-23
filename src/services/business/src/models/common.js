/**
 *  Created by dave 17/2/19
 *  公共模块model层
 */
import { hashHistory, routerRedux } from 'dva/router';
import { fetchCityList } from 'aoao-core-api-service/lib/public.js';

module.exprots = {
  // 公共model的标志
  namespace: 'commonStateModel',

  // 公共模块的 存储的状态
  state: {
    cityList: [],
  },

  // 监听事件
  subscriptions: {
    setup ({ dispatch, history}) {
      history.listen((location) =>{
        if (pathname === '/business/supplier/list') {
        }
      })
    },
  },

  // 异步处理业务逻辑
  effects: {
    // 服务商可以服务的城市
    *getVenderServiceCityE(params, { call, put }) {
      const cityList = yield call(fetchCityList,params.vendor_id);
      yield put({
        type: 'getVenderServiceCityR',
        payload: cityList ,

      })
    },
  },

  // 处理后的状态 重新生产 用于页面渲染(状态生成器);
  reducers: {

    // 服务商可以服务的城市
    getVenderServiceCityR(state, action) {
      const { cityList } = state;
      Object.assign(cityList, action.payload);
      return {
        ...state,
        cityList,
      }
    }
  },
}
