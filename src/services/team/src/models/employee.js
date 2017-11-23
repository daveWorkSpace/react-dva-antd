import { hashHistory, routerRedux } from 'dva/router';
import { message } from 'antd';
import { account_find, account_find_one, account_create, account_update } from 'aoao-core-api-service/lib/business';
import { getManageArea } from 'aoao-core-api-service/lib/team';
import { fetchCityList } from 'aoao-core-api-service/lib/public';
import { authorize } from './../../../../application';

function toDetail(id) {
  window.location.href = `/#/team/employee/list/detail?id=${id}`;
}
function toList() {
  setTimeout(() => {
    window.location.href = '/#/team/employee/list';
  }, 1500);
}
const { err_codeTransform } = window.tempAppTool;
module.exports = {
  namespace: 'businessEmployee',
  state: {
    list_tables: {
      _meta: {},
      data: [],
    },
    list_adds: {},
    list_edits: {},
    employeeDetail: {},   //员工详情
    areaList: {},
    cityList: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        //服务商id
        const vendor_id = authorize.auth.vendorId;
        const { pathname } = location;

        //员工列表页面
        if (pathname === '/team/employee/list') {
          //获取员工列表数据
          dispatch({ type: 'fetchEmployeeList', payload: { org_id: vendor_id, state: 100 } });
          return;
        }

        //添加新员工页面
        if (pathname === '/team/employee/list/add') {
          //获取服务商区域列表
          dispatch({ type: 'fetchAreaList', payload: { vendor_id, state: 100 } });
          return;
        }

        //员工详情，员工编辑页面
        const detailPaths = [
          '/team/employee/list/detail',
          '/team/employee/list/edit',
        ];
        if (detailPaths.includes(pathname) === true) {
          //获取服务商区域列表
          dispatch({ type: 'fetchAreaList', payload: { vendor_id, state: 100 } });

          //获取员工信息
          dispatch({ type: 'fetchEmployeeDetail', payload: { id: location.query.id } });
        }
      });
    },
  },

  effects: {
    // 员工查询
    * fetchEmployeeList(params, { call, put }) {
      const result_account = yield call(account_find, params.payload);
      if (result_account.err) {
        const _response = result_account.err.response.json();
        _response.then((err_obj) => {
          message.error(`员工查询失败,${err_codeTransform(err_obj.err_code)}`);
        });
      } else {
        yield put({
          type: 'reduceEmployeeList',
          payload: result_account.data,
        });
      }
    },

    // 创建员工
    * createEmployee(params, { call, put }) {
      const result_account = yield call(account_create, params.payload);
      if (result_account.err) {
        const _response = result_account.err.response.json();
        _response.then((err_obj) => {
          message.error(`账号添加失败,${err_codeTransform(err_obj.err_code)}`);
        });
      } else {
        message.success('账号添加成功！');
        //跳转到列表
        toList();
      }

      //跳转到详情页
      // toDetail(result_account.user_id);
    },

    // 更新员工信息
    * updateEmployeeDetail(params, { call, put }) {
      const result_account = yield call(account_update, params.payload);
      if (result_account.err) {
        const _response = result_account.err.response.json();
        _response.then((err_obj) => {
          message.error(`账号更新失败,${err_codeTransform(err_obj.err_code)}`);
        });
      } else {
        //跳转到列表
        toList();
        message.success('账号更新成功！');
      }

      //跳转到详情页
      // toDetail(area_id);
    },

    // 获取员工详情
    * fetchEmployeeDetail({ payload }, { call, put }) {
      const { id } = payload;
      const result = yield call(account_find_one, id);
      if (result.err) {
        const response = result.err.response.json();
        response.then((err_obj) => {
          message.error(`账号查询失败,${err_codeTransform(err_obj.err_code)}`);
        });
        return;
      }

      yield put({ type: 'reduceUpdateEmployee', payload: result.data });
    },

    //获取可分配管理的区域
    * fetchAreaList(params, { call, put }) {
      const { vendor_id } = params.payload;
      const areaList = yield call(getManageArea, vendor_id);
      yield put({
        type: 'reduceAreaList',
        payload: { areaList },
      })
    },

    // 服务商服务的城市
    * getEmployeeServiceCityE(params, { call, put }) {
      const cityList = yield call(fetchCityList, params.payload.vendor_id);
      yield put({
        type: 'getEmployeeServiceCityR',
        payload: { cityList },
      })
    },
  },

  reducers: {
    reduceEmployeeList(state, action) {
      const { list_tables } = state;
      Object.assign(list_tables, action.payload);
      return {
        ...state,
        list_tables,
      };
    },

    reduceUpdateEmployee(state, action) {
      return {
        ...state,
        ...{ employeeDetail: action.payload },
      };
    },

    reduceAreaList(state, { payload }) {
      return {
        ...state,
        ...{ areaList: payload.areaList },
      }
    },

    getEmployeeServiceCityR(state, action) {
      return {
        ...state,
        ...{ cityList: action.payload },
      }
    },
  },
}
