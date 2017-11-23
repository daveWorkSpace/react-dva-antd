import dot from 'dot-prop'
import { hashHistory, routerRedux } from 'dva/router';
import { shipments_courier_monthly_find, shipments_courier_daily_find } from 'aoao-core-api-service/lib/statictics.js';
import { authorize } from './../../../../application';

const { stateTransform, utcToDate, numberDateToStr, getMonthDays } = window.tempAppTool;
module.exports = {
  namespace: 'staticticsShipmentsCourier',
  state: {
    list_tables: {//骑士订单统计
      data: [], //骑士订单统计数据
      _meta: {}, // 服务器端返回的附带信息（包括总共多少条，后面还有没有数据的一个对象）
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        // 获取相关的账户信息
        const vendor_id = authorize.auth.vendorId
        const city_code = dot.get(authorize.vendor, 'city.code');

        const start_date = 0;
        const end_date = 0;
        // 取当前日期的前一天
        let yes_date = new Date(new Date() - 24 * 60 * 60 * 1000);
        yes_date = utcToDate(yes_date);
        yes_date = yes_date.date.join('');


        if (location.pathname === '/statictics/shipments_courier/list') {
          // 触发请求默认是前一天的日期
          dispatch({
            type: 'fetchShipmentCourierList',
            payload: { vendor_id, start_date: yes_date, end_date: yes_date },
          });
        }
      });
    },
  },

  effects: {
    // 查询骑士的运单列表
    * fetchShipmentCourierList(params, { call, put }) {
      //请求接口
      const result_courier = yield call(shipments_courier_daily_find, params.payload);
      // 返回数据的处理
      if (result_courier.err) {
        const _response = result_courier.err.response.json();
        _response.then((err_obj) => {
          message.error(`操作失败,${err_codeTransform(err_obj.err_code)}`);
        });
      } else if (result_courier.data) {
          // 返回数据成功
        yield put({
          type: 'reductShipmentCourierList',  // 查询骑士的运单列表数据成功
          payload: {
            data: result_courier.data.data,
            _meta: result_courier.data._meta,
          },
        });
      }
    },
  },

  reducers: {
    // 查询骑士的运单列表数据成功
    reductShipmentCourierList(state, action) {
      const list_tables = {
        ...state.list_tables,
        ...action.payload,
      };
      return {
        ...state,
        list_tables,
      };
    },
  },
}
