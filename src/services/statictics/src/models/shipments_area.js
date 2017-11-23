import dot from 'dot-prop'
import { hashHistory, routerRedux } from 'dva/router';
import { shipments_area_monthly_find, shipments_area_daily_find } from 'aoao-core-api-service/lib/statictics.js';
import { area_find_500 } from 'aoao-core-api-service/lib/business.js';
import { authorize } from './../../../../application';
import { fetchAreasTotalList, fetchAreasRetailOrJoin, getCityVendorList } from './../../../business/src/services/supplier';

const { stateTransform, utcToDate, numberDateToStr, getMonthDays } = window.tempAppTool;

module.exports = {
  namespace: 'staticticsShipmentsArea',
  state: {
    areas: {
      _meta: {},
      data: [],
    },
    list_tables: {  //区域订单统计
      data: [], //区域订单统计数据
      _meta: {}, // 服务器端返回的附带信息（包括总共多少条，后面还有没有数据的一个对象）
    },
    vendorList: {
      data: [],
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        // 获取的全局信息
        const vendor_id = authorize.auth.vendorId
        // 获取的城市编码信息
        const city_code = dot.get(authorize.vendor, 'city.code');

        const start_date = 0;
        const end_date = 0;
        // 取当前日期的前一天
        let yes_date = new Date(new Date() - 24 * 60 * 60 * 1000);
        yes_date = utcToDate(yes_date);
        yes_date = yes_date.date.join('');

        if (location.pathname === '/statictics/shipments_area/list') {
          // 触发行为 默认为前一天的日期
          dispatch({
            type: 'fetchShipmentAreaList',
            payload: { start_date: yes_date, end_date: yes_date, vendor_id },
          });

          // 查询该服务商所有的直营及加盟区域数据
          const is_filter_sub_area = true;
          const relate_type = 10;
          const limit = 500;
          /*dispatch({
            type: 'shipments_area/AreasTotalList',
            payload: { vendor_id, is_filter_sub_area },
          })*/

          // 默认获取区域列表
          dispatch({
            type: 'generalAreasListE',
            payload: { vendor_id, is_filter_sub_area, relate_type, city_code, limit },
          })
        }
      });
    },
  },

  effects: {
    //商家订单模块运单查询
    * fetchShipmentAreaList(params, { call, put }) {
      //请求接口
      const result_area = yield call(shipments_area_daily_find, params.payload);
      // 判断返回的类型值
      if (result_area.err) {
        const _response = result_area.err.response.json();
        _response.then((err_obj) => {
          message.error(`操作失败,${err_codeTransform(err_obj.err_code)}`);
        });
      } else {
        // 返回数据
        yield put({
          type: 'reduceShipmentAreaList', //商家订单模块运单查询成功
          payload: {
            data: result_area.data.data,
            _meta: result_area.data._meta,
          },
        });
      }
    },

    /**
     * Created by dave 2017/3/1
     * 兼容上版区域订单信息业务
     * add 'shipments_area/AreasTotalList'
     * add generalAreasListE
     * add getCityVendorListE
     * */
    // 获取直营以及加盟的区域总列表
    ['shipments_area/AreasTotalList']: function* (params, { call, put }) {
      const areas = yield call(fetchAreasTotalList, params.payload);
      yield put({
        type: 'reduceShipmentAreaTotalList',
        payload: areas,
      })
    },

    // 区域订单统计获取区域直营/加盟通用接口
    * generalAreasListE(params, { call, put }) {
      const areas = yield call(fetchAreasRetailOrJoin, params.payload);
      yield put({
        type: 'generalAreasListR',
        payload: areas,
      })
    },

    * getCityVendorListE(params, { call, put }) {
      const vendorList = yield call(getCityVendorList, params.payload);
      yield put({
        type: 'getCityVendorListR',
        payload: vendorList,
      })
    },
  },

  reducers: {
    //商家订单模块运单查询成功
    reduceShipmentAreaList(state, action) {
      const list_tables = {
        ...state.list_tables,
        ...action.payload,
      };
      return {
        ...state,
        list_tables,
      };
    },

    /**
     * Created by dave 2017/3/1
     * 兼容上版区域订单信息业务
     * add reduceShipmentAreaTotalList
     * add generalAreasListR
     * add getCityVendorListR
     * */
    // 获取直营以及加盟的区域总列表
    reduceShipmentAreaTotalList(state, action) {
      const { areas } = state;
      Object.assign(areas, action.payload);
      return {
        ...state,
        areas,
      }
    },

    // 区域订单统计获取区域直营/加盟通用接口
    generalAreasListR(state, action) {
      const { areas } = state;
      Object.assign(areas, action.payload);
      return {
        ...state,
        areas,
      }
    },

    // 加盟商给列表
    getCityVendorListR(state, action) {
      const { vendorList } = state;
      Object.assign(vendorList, action.payload);
      return {
        ...state,
        vendorList,
      }
    },
  },
}
