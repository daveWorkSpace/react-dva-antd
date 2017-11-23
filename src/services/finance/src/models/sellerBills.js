
import { hashHistory, routerRedux } from 'dva/router';
import { message } from 'antd';
import { seller_day_bills_find, seller_month_bills_find } from 'aoao-core-api-service/lib/finance';
import { authorize } from '../../../../application';

const dateFormat = window.tempAppTool.dateFormat;
const { stateTransform, utcToDate, numberDateToStr } = window.tempAppTool;

module.exports = {
  namespace: 'businessSellerBills',
  state: {
    Day_list_tables: {  //商户日账单信息
      data: [], //日账单数据
      _meta: {}, //服务器端返回的附带信息（包括总共多少条，后面还有没有数据的一个对象）
    },
    Month_list_tables: {//商户月账单信息
      data: [], //月账单数据
      _meta: {}, //服务器端返回的附带信息（包括总共多少条，后面还有没有数据的一个对象）
    },
  },

  subscriptions: {

    setup({ dispatch, history }) {
      const start_date = 0;
      const end_date = 0;
      // 取当前日期的前一天
      let yes_date = new Date(new Date() - 24 * 60 * 60 * 1000);
      yes_date = utcToDate(yes_date);
      yes_date = yes_date.date.join('');
      //取上个月的日期
      let last_month = new Date();
      last_month = last_month.getMonth() + 1
      last_month = (last_month < 10) ? `0${last_month}` : last_month;
      let month_date = dateFormat();
      month_date.length = 1;
      month_date = month_date.join('') + last_month;


      history.listen((location) => {
        const vendor_id = authorize.auth.vendorId;

        if (location.pathname === '/finance/sellerBills/list') {
        //获取日账单的列表数据 初始查昨日的账单
          dispatch({
            type: 'fetchSellerBills',
            payload: { vendor_id, start_date: yes_date, end_date: yes_date },
          });
        // 获取月账单的列表数据默认查上个月的信息
          dispatch({
            type: 'fetchSellerBillsByMonth',
            payload: { vendor_id, start_date: month_date, end_date: month_date },
          });
        }
      });
    },
  },

  effects: {
    // 财务模块的商家账单列表
    * fetchSellerBills(params, { call, put }) {
      //请求接口
      const result_seller = yield call(seller_day_bills_find, params.payload);
      // 返回数据的处理
      if (result_seller.err) {
        const _response = result_seller.err.response.json();
        _response.then((err_obj) => {
          message.error(`操作失败,${err_codeTransform(err_obj.err_code)}`);
        });
      } else {
        //财务模块的商家账单列表
        yield put({
          type: 'reduceSellerBills',
          payload: {
            data: result_seller.data.data,
            _meta: result_seller.data._meta,
          },
        });
      }
    },

    // 商家月账单
    * fetchSellerBillsByMonth(params, { call, put }) {
      //获取到月账单的数据//请求接口
      const { data } = yield call(seller_month_bills_find, params.payload);
      if (data === undefined) {
        return;
      }
      //获取月账单列表
      yield put({
        type: 'reduceSellerBillsByMonth',
        payload: {
          data: data.data,
          _meta: data._meta,
        },
      });
    },
  },

  reducers: {
    // 财务管理模块的商家日账单列表数据
    reduceSellerBills(state, action) {
      const Day_list_tables = {
        ...state.Day_list_tables,
        ...action.payload,
      };
      return {
        ...state,
        Day_list_tables,
      };
    },

    // 财务管理模块的商家月账单列表数据
    reduceSellerBillsByMonth(state, action) {
      const Month_list_tables = {
        ...state.Month_list_tables,
        ...action.payload,
      };
      return {
        ...state,
        Month_list_tables,
      };
    },
  },
}
