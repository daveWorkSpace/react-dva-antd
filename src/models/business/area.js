import is from 'is_js';
import dot from 'dot-prop';
import { hashHistory, routerRedux } from 'dva/router';
import { message } from 'antd';
import {
  fetchAllAreas,
  fetchAreaRules,
  fetchSupplyVendorList,
  fetchVendors,
  fetchCityList,
  fetchAreaList,
  fetchAreaDetail,
  fetchAreaDraftDetail,
  publishArea,
  createArea,
  updateArea,
} from 'aoao-core-api-service/lib/area';

import { authorize } from '../../application';
import { Errors, Modules, ServiceState, BusinessType, AreaState } from '../../application/define';
import { List, Area } from '../../application/object/';

//请求的每页数据条数
const requestPagerSize = 12;

module.exports = {

  namespace: 'BusinessArea',
  state: {
    areas: [],  //区域列表
    rules: [],  //区域规则列表

    supplyVendorList: [],       //当前服务商的供应商的列表
    cityList: [],               //城市选择清单

    directAreaList: [],         //直营区域列表
    franchiseAreaList: [],      //加盟区域列表

    areaDetail: {},             //选中的区域详情
    areaDraftDetail: {},        //选中的区域草稿详情

    createAreaId: '',             //创建区域成功后的数据id
    isCreateAreaCallback: false,  //创建区域后的回调

    publishAreaId: '',            //发布区域的id
    isPublishAreaCallback: false, //发布成功后的回调

    isUpdateAreaCallback: false,  //保存成功后的回调
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname, query }) => {
        //仓库规则列表
        if (Modules.equalPath(Modules.businessRulesStock, pathname)) {
          dispatch({ type: 'fetchAreas',
            payload: {
              vendorId: authorize.vendor.id,
              serviceState: ServiceState.on,
              relateType: BusinessType.driect,
              cityCode: dot.get(authorize.vendor, 'city.code'),
            } });
        }

        //区域规则管理
        if (Modules.equalPath(Modules.businessRulesArea, pathname)) {
          dispatch({ type: 'fetchAreaRules', payload: { state: ServiceState.on, page: 1 } });
        }

        //配送区域管理
        if (Modules.equalPath(Modules.businessArea, pathname)) {
          const vendorId = dot.get(authorize.auth, 'vendorId');
          const cityCode = dot.get(authorize.vendor, 'city.code');

           //filter获取此服务商存在的城市列表
          dispatch({
            type: 'fetchCityList',
            payload: vendorId,
          });

          //获取当前服务商的供应商列表
          dispatch({
            type: 'fetchSupplyVendorList',
            payload: { vendorId, cityCode: cityCode || 110000 },
          });
        }

        //绘制全部区域
        if (Modules.equalPath(Modules.businessAreaMap, pathname)) {
          const params = {
            vendorId: dot.get(authorize.auth, 'vendorId'),
            cityCode: dot.get(authorize.vendor, 'city.code'),
            relateType: BusinessType.driect,
            areaState: AreaState.on,
            page: 1,
            size: 999,
          }
          dispatch({ type: 'fetchDirectAreaList', payload: params });
        }
      });
    },
  },

  effects: {

    //获取区域列表数据
    * fetchAreas({ payload }, { call, put }) {
      const { vendorId, serviceState, relateType, cityCode } = payload;
      const response = yield call(fetchAllAreas, { vendorId, serviceState, relateType, cityCode });

      if (is.truthy(response.error) && is.not.empty(response.data)) {
        message.error(`获取区域列表失败 : ${response.error.message}`);
        return;
      }

      //遍历列表对象数据，获取产品服务设置列表
      const result = List.mapper(response, Area);

      yield put({ type: 'reduceAreas', payload: { areas: result } });
    },

    //获取区域规则列表
    * fetchAreaRules({ payload }, { call, put }) {
      const { areaId, name, state, page = 1, size } = payload
      const vendorId = authorize.vendor.id;
      const response = yield call(fetchAreaRules, { vendorId, areaId, name, state, page, size });

      if (is.truthy(response.error) && is.not.empty(response.data)) {
        message.error(`获取区域列表失败 : ${response.error.message}`);
        return;
      }
      //遍历列表对象数据，获取产品服务设置列表
      const result = List.mapper(response, Area);

      //设置列表的当前页码和分页条数
      result.page = page;
      result.size = size;

      yield put({ type: 'reduceRules', payload: { rules: result } });
    },

    //获取城市列表
    * fetchCityList({ payload: vendorId }, { call, put }) {
      const response = yield call(fetchCityList, vendorId);
      yield put({ type: 'reduceCityList', payload: response });
    },

    //当前服务商的供应商的列表
    * fetchSupplyVendorList({ payload }, { call, put }) {
      const { cityCode, vendorId } = payload;
      const response = yield call(fetchSupplyVendorList, vendorId, cityCode);
      yield put({ type: 'reduceSupplyVendorList', payload: response });
    },

    //获取直营区域列表
    * fetchDirectAreaList({ payload }, { call, put }) {
      const { vendorId, cityCode, relateType, areaState, page, size = requestPagerSize,areaId } = payload;
      const response = yield call(fetchAreaList, vendorId, '', relateType, cityCode, areaState, page, size,areaId);
      if (response === undefined) {
        return;
      }
      //处理分页数据
      const result = {
        data: response.data,
        total: response._meta.result_count,
        page,
        size: requestPagerSize,
        totalPage: Math.ceil(response._meta.result_count / requestPagerSize),
      }
      yield put({ type: 'reduceDirectAreaList', payload: result });
    },

    //获取加盟区域列表
    * fetchFranchiseAreaList({ payload }, { call, put }) {
      const { vendorId, supplyVendorId, cityCode, relateType, areaState, page } = payload;
      const response = yield call(fetchAreaList, vendorId, supplyVendorId, relateType, cityCode, areaState, page, requestPagerSize);

      if (response === undefined) {
        return;
      }
      //处理分页数据
      const result = {
        data: response.data,
        total: response._meta.result_count,
        page,
        size: requestPagerSize,
        totalPage: Math.ceil(response._meta.result_count / requestPagerSize),
      }
      yield put({ type: 'reduceFranchiseAreaList', payload: result });
    },

    //获取区域详情
    * fetchAreaDetail({ payload: areaId }, { call, put }) {
      const response = yield call(fetchAreaDetail, areaId);
      yield put({ type: 'reduceAreaDetail', payload: response });
    },

    //获取区域草稿详情
    * fetchAreaDraftDetail({ payload: areaId }, { call, put }) {
      const response = yield call(fetchAreaDraftDetail, areaId);
      yield put({ type: 'reduceAreaDraftDetail', payload: response });
    },

    //发布区域
    * publishArea({ payload }, { call, put }) {
      //更新区域数据
      const { areaId, areaName, areaState, vendorId, cityCode, coordinates } = payload;
      const updateResponse = yield call(updateArea, areaId, areaName, areaState, vendorId, cityCode, coordinates);
      if (updateResponse.error) {
        message.error(`区域更新失败 : ${Errors.message(updateResponse.error)}`);
        return;
      }

      //发布数据
      const response = yield call(publishArea, areaId);
      if (response.error) {
        message.error(`区域发布失败 : ${Errors.message(response.error)}`);
      } else {
        message.success('区域发布成功！')
        yield put({ type: 'reducePublishArea', payload: { publishAreaId: areaId, isPublishAreaCallback: true } });
      }
    },

    //创建父区域
    * createArea({ payload }, { call, put }) {
      const { vendorId, areaName, cityCode } = payload;
      const response = yield call(createArea, vendorId, areaName, cityCode);
      if (response.error) {
        message.error(`区域创建失败 : ${Errors.message(response.error)}`);
      } else {
        message.success('区域创建成功！');
        yield put({ type: 'reduceCreateArea', payload: { createAreaId: response.data.id, isCreateAreaCallback: true } });
      }
    },

    //创建子区域
    * createSubArea({ payload }, { call, put }) {
      const { vendorId, areaName, cityCode, parentId } = payload;
      const response = yield call(createArea, vendorId, areaName, cityCode, parentId);
      if (response.error) {
        message.error(`区域创建失败 : ${Errors.message(response.error)}`);
      } else {
        message.success('区域创建成功！');
        yield put({ type: 'reduceCreateArea', payload: { createAreaId: response.data.id, isCreateAreaCallback: true } });
      }
    },

    //更新区域
    * updateArea({ payload }, { call, put }) {
      const { areaId, areaName, areaState, vendorId, cityCode, coordinates } = payload;
      const response = yield call(updateArea, areaId, areaName, areaState, vendorId, cityCode, coordinates);
      if (response.error) {
        message.error(`区域更新失败 : ${Errors.message(response.error)}`);
      } else {
        message.success('区域更新成功！');
        yield put({ type: 'reduceUpdateArea', payload: { isUpdateAreaCallback: true } });
      }
    },

    //重置保存成功后的回调
    * resetUpdateAreaCallback({ payload }, { call, put }) {
      yield put({ type: 'reduceUpdateArea', payload: { isUpdateAreaCallback: false } });
    },

    //重置创建区域后的回调
    * resetCreateAreaCallback({ payload }, { call, put }) {
      yield put({ type: 'reduceCreateArea', payload: { createAreaId: '', isCreateAreaCallback: false } });
    },

    //重置发布成功后的回调
    * resetPublishAreaCallback({ payload }, { call, put }) {
      yield put({ type: 'reducePublishArea', payload: { publishAreaId: '', isPublishAreaCallback: false } });
    },

    //重置区域详情数据
    * resetAreaDetail({ payload }, { call, put }) {
      yield put({ type: 'reduceAreaDetail', payload: [] });
    },

    //重置草稿数据
    * resetAreaDraftDetail({ payload }, { call, put }) {
      yield put({ type: 'reduceAreaDraftDetail', payload: [] });
    },

    //重置加盟列表数据
    * resetFranchiseAreaList({ payload }, { call, put }) {
      yield put({ type: 'reduceFranchiseAreaList', payload: [] });
    },

    //重置直营列表数据
    * resetDirectAreaList({ payload }, { call, put }) {
      yield put({ type: 'reduceDirectAreaList', payload: [] });
    },

  },

  reducers: {

    reduceRules(state, { payload }) {
      const { rules } = payload;
      return { ...state, rules };
    },

    reduceAreas(state, { payload }) {
      const { areas } = payload;
      return { ...state, areas };
    },

    //区域城市列表
    reduceSupplyVendorList(state, { payload: supplyVendorList }) {
      return { ...state, supplyVendorList };
    },

    //区域城市列表
    reduceCityList(state, { payload: cityList }) {
      return { ...state, cityList };
    },

    //获取直营区域列表
    reduceDirectAreaList(state, { payload: directAreaList }) {
      return { ...state, directAreaList };
    },

    //获取加盟区域列表
    reduceFranchiseAreaList(state, { payload: franchiseAreaList }) {
      return { ...state, franchiseAreaList };
    },

    //获取区域详情
    reduceAreaDetail(state, { payload: areaDetail }) {
      return { ...state, areaDetail };
    },

    //获取区域草稿
    reduceAreaDraftDetail(state, { payload: areaDraftDetail }) {
      return { ...state, areaDraftDetail };
    },

    //创建成功后回调
    reduceCreateArea(state, { payload }) {
      const { createAreaId, isCreateAreaCallback } = payload;
      return { ...state, createAreaId, isCreateAreaCallback };
    },

    //发布成功后回调
    reducePublishArea(state, { payload }) {
      const { isPublishAreaCallback, publishAreaId } = payload;
      return { ...state, publishAreaId, isPublishAreaCallback };
    },

    //保存成功后回调
    reduceUpdateArea(state, { payload }) {
      const { isUpdateAreaCallback } = payload;
      return { ...state, isUpdateAreaCallback };
    },

  },
}
