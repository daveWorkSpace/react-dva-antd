import is from 'is_js';
import dot from 'dot-prop'
import { hashHistory, routerRedux } from 'dva/router';
import { fetchAreaList, fetchAreaListBySupplier } from 'aoao-core-api-service/lib/area';
import { message } from 'antd';
import {
  getSupplierList,
  getSupplierDetail,
  editSupplierDetail,
  closeBusiness,
  openBusiness,
  getVendorSupplier,
  addSupplier,
  getAreas,
  submitAdd,
  editArea,
  getAddAreas,
} from 'aoao-core-api-service/lib/supplier';

import {
  fetchAllSuppliers,
} from 'aoao-core-api-service/lib/newSupplier';

import { Modules, Errors } from '../../../application/define';
import { authorize } from '../../../application';
import { List, Vendor, Area } from '../../../application/object/';

module.exports = {
  namespace: 'BusinessSupplierService',
  state: {
    areas: [],  //区域列表
    stocks: [], //仓库列表
    allSuppliers: [], //所有供应商列表
    // 供应商列表
    supplierList: {
      _meta: {},
      data: [],
    },
    // 供应商信息详情
    supplierDetail: {
      company_business_assets: ['', '', ''],
      integrate_paper_assets: [''],
      legal_passport_assets: ['', '', ''],
      food_paper_assets: [''],
      expresses_paper_assets: [''],
    },
    // 可供添加的区域
    addAreaList: {
      _meta: {},
      data: [],
    },
    // 合作区域列表
    areaList: {
      _meta: {},
      data: [],
    },
    // 更新开关（添加、编辑、删出后需要重新获取最新数据）
    upDataState: false,
    // 添加合作区域开关
    submitAreaState: false,
    // 获取可用承运商列表
    vendorSupplierList: [],
    // 增加承运商开关
    addSuppliersState: false,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        //区域承运表
        if (Modules.equalPath(Modules.businessSupplierAreaServices, pathname)) {
          dispatch({ type: 'fetchAreaList' });
        }

        //仓库创建页面，获取所有承运商数据
        if (Modules.equalPath(Modules.businessStockCreate, pathname)) {
          dispatch({
            type: 'fetchAllSuppliers',
            payload: {
              vendorId: authorize.vendor.id,
              cityCode: dot.get(authorize.vendor, 'city.code'),
            }
          });
        }
      });
    },
  },

  effects: {

    //区域承运表
    * fetchAreaListBySupplier({ payload }, { call, put }) {
      const { vendorId, cityCode, businessType, state, areaId, name, page, size } = payload;
      const params = { vendorId, cityCode, businessType, areaId, state, name, page, size };
      const response = yield call(fetchAreaListBySupplier, params);

      if (is.truthy(response.error) && is.not.empty(response.data)) {
        message.error(`获取区域承运表失败 : ${Errors.message(response.error)}`);
        return;
      }
      //遍历列表对象数据，获取产品服务设置列表
      const result = List.mapper(response, Area);

      //设置列表的当前页码和分页条数
      result.page = page;
      result.size = size;

      yield put({ type: 'reduceAreas', payload: { areas: result } });
    },

    // 获取承运商列表
    * getSupplierLists({ payload }, { call, put }) {
      const supplierList = yield call(getSupplierList, payload);
      yield put({
        type: 'reduceSupplierList',
        payload: supplierList,
      })
    },

    // 请求全部承运商
    * fetchAllSuppliers({ payload }, { call, put }) {
      const { cityCode, vendorId } = payload;
      const response = yield call(fetchAllSuppliers, { cityCode, vendorId });

      if (is.truthy(response.error) && is.not.empty(response.data)) {
        message.error(`获取承运商列表失败 : ${response.error.message}`);
        return;
      }

      //遍历列表对象数据，获取产品服务设置列表
      const result = List.mapper(response, Vendor);

      yield put({
        type: 'reduceAllSuppliers',
        payload: { allSuppliers: result },
      })
    },

    // 获取供应商信息详情
    * getSupplierDetails({ payload }, { call, put }) {
      const allSuppliers = yield call(getSupplierDetail, payload);
      yield put({
        type: 'reduceSupplierDetail',
        payload: allSuppliers,
      })
    },

    // 可供选择添加的区域列表
    * getAddAreaList({ payload }, { call, put }) {
      const addAreaList = yield call(getAddAreas, payload);
      yield put({
        type: 'reduceAddAreaList',
        payload: addAreaList,
      })
    },

    // 获取区域列表
    * getAreaList({ payload }, { call, put }) {
      const areaList = yield call(getAreas, payload);
      yield put({
        type: 'reduceAreaList',
        payload: areaList,
      })
    },

    // 编辑合作区域信息
    * editAreas({ payload }, { call, put }) {
      const result = yield call(editArea, payload);
      if (result === undefined) {
        message.error('请检查是否有正在使用的订单规则');
        return;
      }
      const upDataState = true;
      yield put({
        type: 'reduceUpDate',
        payload: { upDataState },
      })
    },

    // 更新数据状态信号
    * updataStateFunc(params, { call, put }) {
      const { state } = params.payload;
      yield put({
        type: 'reduceUpDate',
        payload: { upDataState: state },
      })
    },

    // 提交添加的区域信息
    * submitAdds(params, { call, put }) {
      const result = yield call(submitAdd, params.payload);
      if (result === undefined) {
        message.error('添加失败,已经存在');
        return;
      }
      const submitAreaState = true;
      yield put({
        type: 'reducesubmitArea',
        payload: { submitAreaState },
      })
    },

    // 更新添加合作区域状态信号
    * submitAreaStateFunc(params, { call, put }) {
      const { state } = params.payload;
      yield put({
        type: 'reducesubmitArea',
        payload: { submitAreaState: state },
      })
    },

    // 服务商关闭业务
    * closeBusinessE(params, { call, put }) {
      const result = yield call(closeBusiness, params.payload);
      if (result.ok) {
        message.success('已关闭')
      }
    },

    // 服务商开启业务
    * openBusinessE(params, { call, put }) {
      const result = yield call(openBusiness, params.payload);
      if (result.ok) {
        message.success('已开启')
      }
    },

    // 业务状态修改时改变model state
    * modifyBusinessState(params, { call, put }) {
      const supplierDetail = params;
      yield put({
        type: 'reduceSupplierDetail',
        payload: supplierDetail,
      })
    },

    // 查询某服务商所有承运商列表
    * getVendorSupplierList(params, { call, put }) {
      const value = yield call(getVendorSupplier, params.payload);
      console.log(value)
      const vendorSupplierList = value.data.data;
      yield put({
        type: 'reduceVendorSupplierList',
        payload: vendorSupplierList,
      })
    },

    // 增加承运商
    * addSuppliers(params, { call, put }) {
      const result = yield call(addSupplier, params.payload);
      // const city_code = params.payload.city_code;
      if (result === undefined) {
        message.error('请检查该供应商是否已经添加', 2);
        return;
      }
      const upDataState = true;
      yield put({
        type: 'reduceUpDate',
        payload: { upDataState },
      })
    },
  },

  reducers: {
    // 区域承运表
    reduceAreas(state, { payload }) {
      const { areas } = payload;
      return { ...state, areas };
    },

    // 仓库承运表
    reduceStocks(state, { payload }) {
      const { stocks } = payload;
      return { ...state, stocks };
    },

    // 获取承运商列表
    reduceSupplierList(state, { payload }) {
      const { supplierList } = state;
      Object.assign(supplierList, payload);
      return {
        ...state,
        supplierList,
      }
    },

    // 获取供应商信息详情
    reduceSupplierDetail(state, { payload }) {
      const { supplierDetail } = state;
      Object.assign(supplierDetail, payload);
      return {
        ...state,
        supplierDetail,
      }
    },

    // 可供添加选择的区域列表
    reduceAddAreaList(state, { payload }) {
      const { addAreaList } = state;
      Object.assign(addAreaList, payload);
      return {
        ...state,
        addAreaList,
      }
    },

    // 获取区域列表
    reduceAreaList(state, { payload }) {
      const { areaList } = state;
      Object.assign(areaList, payload);
      return {
        ...state,
        areaList,
      }
    },

    //更新数据开关
    reduceUpDate(state, { payload }) {
      const { upDataState } = payload;
      return {
        ...state,
        upDataState,
      }
    },

    //更新添加合作区域状态信号
    reducesubmitArea(state, { payload }) {
      const { submitAreaState } = payload;
      return {
        ...state,
        submitAreaState,
      }
    },

    // 查询某服务商所有供应商列表
    reduceVendorSupplierList(state, { payload }) {
      const { vendorSupplierList } = state;
      Object.assign(vendorSupplierList, payload);

      return {
        ...state,
        vendorSupplierList,
      }
    },

    //获取所有的承运商
    reduceAllSuppliers(state, { payload }) {
      const { allSuppliers } = payload;
      return { ...state, allSuppliers }
    },

  },
}
