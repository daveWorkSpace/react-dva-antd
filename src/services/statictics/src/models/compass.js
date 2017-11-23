//TODO: 未开发
import dot from 'dot-prop'
import { hashHistory, routerRedux } from 'dva/router';
import { message } from 'antd';
import { compass_find } from 'aoao-core-api-service/lib/compass';
import { area_find_500 } from 'aoao-core-api-service/lib/business';
import { authorize } from './../../../../application';

module.exports = {
  namespace: 'statictics_compass',
  state: {
    areas: [],
    income: {
      yes_income: '',
      yes_line_income: '',
      yes_offline_income: '',
      yesterday_income: [],
      average_income: [],
      yesterday_order: [],
      average_order: [],
    },
    stats_data: {
      profit: '',
      Earnings: '',
      gain: '',
      Payoff: '',
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const vendor_id = authorize.auth.vendorId;
        const city_code = dot.get(authorize.vendor, 'city.code');
        if (location.pathname === '/statictics/compass') {
          dispatch({
            type: 'fetchCompass',
            payload: location.query,
          });
          dispatch({
            type: 'fetchCompassArea',
            payload: { city_code, vendor_id },
          });
        }
      });
    },
  },
  effects: {
    // 数据罗盘
    * fetchCompass(params, { call, put }) {
      const { data } = yield call(compass_find, params.payload);
      if (data === undefined) {
        return;
      }
      yield put({
        type: 'reduceCompass',
        payload: {
          data: data.data,
        },
      });
    },

    // 数据罗盘模块区域查询
    * fetchCompassArea(params, { call, put }) {
      const result_areas = yield call(area_find_500, params.payload);
      if (result_areas.err) {
        message.error('区域查询失败！');
      } else {
        yield put({
          type: 'reduceCompassArea',
          payload: result_areas.data.data,
        });
      }
    },
  },

  reducers: {
    reduceCompass(state, action) {
      const income = {
        ...state.income,
        ...action.payload.data,
      };
      return {
        ...state,
        income,
      };
    },
    reduceCompassArea(state, action) {
      state.areas = action.payload;
      return state;
    },
  },
}
