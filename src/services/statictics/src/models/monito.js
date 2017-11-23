//TODO: 未开发
import dot from 'dot-prop'
import { hashHistory, routerRedux } from 'dva/router';
import { MONITO } from '../ActionsName';
import { monito_find, monito_state } from 'aoao-core-api-service/lib/monito.js';
import { area_find_500 } from 'aoao-core-api-service/lib/business.js';
import { authorize } from './../../../../application';

module.exports = {
  namespace: 'staticticsMonitor',
  state: {

    areas: [],
    stats_data: {},
    couriers_data: {},
    shipments_data: {},
    imports_data: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const vendor_id = authorize.auth.vendorId;
        const city_code = dot.get(authorize.vendor, 'city.code');
        if (location.pathname === '/statictics/monito') {
          dispatch({
            type: 'fetchMonitorData',
            payload: location.query,
          });
          dispatch({
            type: 'fetchAreaMonitorData',
            payload: { city_code, vendor_id },
          });
        }
      });
    },
  },

  effects: {
    * fetchMonitorData(params, { call, put }) {
      const { data } = yield call(monito_find, params.payload);
      if (data === undefined) {
        return;
      }
      yield put({
        type: 'reduceMonito',
        payload: {
          data: data.data,
        },
      });
    },
    * fetchAreaMonitorData(params, { call, put }) {
      const result_areas = yield call(area_find_500, params.payload);
      if (result_areas.err) {
        message.error('区域查询失败！');
      } else {
        yield put({
          type: 'reduceAreaMonitorData',
          payload: result_areas.data.data,
        });
      }
    },

    * fetchCourierState(params, { call, put }) {
      const { data } = yield call(monito_state, params.payload);
      if (data === undefined) {
        return;
      }
      yield put({
        type: 'reduceCourierState',
        payload: {
          data: data.data,
          total: data.page.total,
          current: data.page.current,
        },
      });
    },
  },

  reducers: {
    reduceMonitorData(state, action) {
      const {
        on_guard,
        off_guard,
        order_data,
        yesterday_data,
        last_week_data,
        today_data,
      } = action.payload.data;
      const _data = {
        stats_data: {
          p1: 33,
          p2: 44,
          p3: 55,
          p4: 66,
        },
        couriers_data: { on_guard, off_guard },
        shipments_data: order_data,
        imports_data: {
          yesterday_data, last_week_data, today_data,
        },
      };

      return {
        ...state,
        ..._data,
      };
    },

    reduceAreaMonitorData(state, action) {
      state.areas = action.payload;
      return state;
    },

    reduceCourierState(state, action) {
      const courier_state = {
        ...state.courier_state,
        ...action.payload,
      };
      return {
        ...state,
        courier_state,
      };
    },
  },
}
