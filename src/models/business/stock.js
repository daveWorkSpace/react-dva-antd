import is from 'is_js';
import { hashHistory, routerRedux } from 'dva/router';
import { message, notification } from 'antd';
import {
    createStock,
    updateStock,
    createStockArea,
    deleteStockArea,
    fetchStockDetail,
    fetchStockListByArea,
    fetchStockListByDirect,
    fetchStockListByAffiliate,
    fetchStockListByFilter,
    fetchStockDispatchRuleByDirect,
    createStockDispatchRuleByDirect,
    updateStockDispatchRuleByDirect,
    fetchStockListByUnity,
    getStockList,
    unsignVendor,
    fetchStockListByDelivery,
} from 'aoao-core-api-service/lib/stock';

import { authorize } from '../../application';
import { Modules, Errors, ServiceState } from '../../application/define';
import { List, Stock } from '../../application/object/';

module.exports = {

  namespace: 'BusinessStock',
  state: {
    list: [],       //设置列表
    detail: {},     //详情
    listByArea: [], //根据区域获取的仓库列表

    isCreatStockCallback: false,    //创建仓库成功后的回调
    isUpdateStockCallback: false,   //更新仓库成功后的回调
    isCreatStockAreaCallback: false,  //创建仓库区域的回调
    isDeleteStockAreaCallback: false, //删除仓库区域的回调

    stockListByUnity: { _meta: {}, data: [] },        // 合作仓库列表
    directStockList: { _meta: {}, data: [] },         // 直营仓库列表
    directStockListByArea: { _meta: {}, data: [] },   // 根据区域取直营仓库列表
    stockListByDelivery: { _meta: {}, data: [] },        // 配送站列表
    stockDispatchRule: { _meta: {}, data: [] },       // 仓库分配规则
    stockDispatchRuleByArea: { _meta: {}, data: [] }, // 根据区域取仓库分配规则

    isStockRuleUpdateSuccess: false,     // 更新开关（添加、编辑、删出后需要重新获取最新数据）
    isStockRuleOperationSuccess: false,  // 仓库规则状态（添加、编辑、删除后需要重新获取最新数据）
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname, query }) => {
        //直营列表，仓库规则列表
        if (Modules.equalPath(Modules.businessStockDriect, pathname) || Modules.equalPath(Modules.businessRulesStock, pathname)) {
          dispatch({ type: 'fetchDriectList', payload: { state: ServiceState.on, page: 1 } });
        }

        //加盟列表
        if (Modules.equalPath(Modules.businessStockAffiliate, pathname)) {
          dispatch({ type: 'fetchAffiliateList', payload: { state: ServiceState.on, page: 1 } });
        }

        //根据请求参数，获取详情数据
        if (Modules.equalPath(Modules.businessStockDetail, pathname) || Modules.equalPath(Modules.businessStockUpdate, pathname)) {
          const { id } = query;
          dispatch({ type: 'fetchDetail', payload: { stockId: id } });
        }
      });
    },
  },

  effects: {

    //获取列表数据
    * fetchDriectList({ payload }, { call, put }) {
      const { stockId, name, state, isInventory, isDelivery, page = 1, size } = payload
      const vendorId = authorize.vendor.id;
      const response = yield call(fetchStockListByFilter, { vendorId, stockId, name, state, isInventory, isDelivery, page, size });

      if (is.truthy(response.error) && is.not.empty(response.data)) {
        message.error(`获取仓库列表失败 : ${Errors.message(response.error)}`);
        return;
      }

      //遍历列表对象数据，获取产品服务设置列表
      const result = List.mapper(response, Stock);

      //设置列表的当前页码和分页条数
      result.page = page;
      result.size = size;

      yield put({ type: 'reduceList', payload: { list: result } });
    },

    //获取列表数据
    * fetchAffiliateList({ payload }, { call, put }) {
      const { stockId, name, state, page, size } = payload
      const supplyVendorId = authorize.vendor.id;
      const response = yield call(fetchStockListByAffiliate, { supplyVendorId, stockId, name, state, page, size });

      if (is.truthy(response.error) && is.not.empty(response.data)) {
        message.error(`获取仓库列表失败 : ${Errors.message(response.error)}`);
        return;
      }

      //遍历列表对象数据，获取产品服务设置列表
      const result = List.mapper(response, Stock);

      //设置列表的当前页码和分页条数
      result.page = page;
      result.size = size;

      yield put({ type: 'reduceList', payload: { list: result } });
    },

    //根据区域，获取仓库列表
    * fetchStockListByArea({ payload }, { call, put }) {
      const { areaId } = payload
      const vendorId = authorize.vendor.id;
      const response = yield call(fetchStockListByArea, { vendorId, areaId });

      if (is.truthy(response.error) && is.not.empty(response.data)) {
        message.error(`获取仓库列表失败 : ${Errors.message(response.error)}`);
        return;
      }

      //遍历列表对象数据，获取产品服务设置列表
      const result = List.mapper(response, Stock);

      yield put({ type: 'reduceAreaList', payload: { listByArea: result } });
    },

    //获取详情
    * fetchDetail({ payload }, { call, put }) {
      const { stockId } = payload;
      if (is.not.existy(stockId) || is.empty(stockId)) {
        message.error('获取仓库详情失败 : 参数不正确');
        return;
      }
      const response = yield call(fetchStockDetail, { stockId });

      if (is.truthy(response.error) && is.not.empty(response.data)) {
        message.error(`获取仓库详情失败 : ${Errors.message(response.error)}`);
        return;
      }

      //遍历列表对象数据，获取产品服务设置列表
      const result = Stock.mapper(response.data);

      yield put({ type: 'reduceDetail', payload: { detail: result } });
    },

    //创建设置数据
    * createStock({ payload }, { call, put }) {
      const { vendorId, supplyVendorId, name, serviceState, city, address, addressDetail, poi, admin, mobile, isDelivery, isInventory } = payload;
      const params = {
        vendorId,
        supplyVendorId,
        name,
        state: serviceState.value,
        cityCode: city.code,
        address,
        addressDetail,
        poi: [
          poi.longitude,
          poi.latitude,
        ],
        admin,
        mobile,
        isDelivery: isDelivery.value,
        isInventory: isInventory.value,
      }
      const response = yield call(createStock, params);
      if (is.truthy(response.error) && is.not.empty(response.data)) {
        message.error(`创建仓库失败 : ${Errors.message(response.error)}`);
        return;
      }

      const { id } = response.data;
      message.success('创建仓库成功！')
      yield put({ type: 'reduceCreate', payload: { isCreatStockCallback: true } });
    },

    //更新设置数据
    * updateStock({ payload }, { call, put }) {
      const { id, supplyVendorId, name, serviceState, city, address, addressDetail, poi, admin, mobile, isDelivery, isInventory } = payload;
      const params = {
        stockId: id,
        supplyVendorId,
        name,
        state: serviceState.value,
        cityCode: city.code,
        address,
        addressDetail,
        poi: [
          poi.longitude,
          poi.latitude,
        ],
        admin,
        mobile,
        isDelivery: isDelivery.value,
        isInventory: isInventory.value,
      }
      const response = yield call(updateStock, params);
      if (is.truthy(response.error) && is.not.empty(response.data)) {
        message.error(`更新仓库失败 : ${Errors.message(response.error)}`, 5);
        return;
      }

      message.success('更新仓库成功！')
      yield put({ type: 'reduceUpdate', payload: { isUpdateStockCallback: true } });
    },

    //重置创建仓库回调
    * resetCreateStock({ payload }, { call, put }) {
      yield put({ type: 'reduceResetCreateStock', payload: { isCreatStockCallback: false, detail: {} } });
    },

    //重置更新仓库回调
    * resetUpdateStock({ payload }, { call, put }) {
      yield put({ type: 'reduceResetUpdateStock', payload: { isUpdateStockCallback: false, detail: {} } });
    },

    //添加仓库区域
    * createStockArea({ payload }, { call, put }) {
      const { stockId, areaIds } = payload;
      if (is.not.existy(stockId) || is.empty(stockId) || is.empty(areaIds)) {
        message.error('添加仓库区域失败 : 参数不正确');
        return;
      }
      const response = yield call(createStockArea, { stockId, areaIds });

      if (is.truthy(response.error) && is.not.empty(response.data)) {
        message.error(`添加仓库区域失败 : ${Errors.message(response.error)}`);
        return;
      }

      const failResponse = [];
      const successResponse = []
      //处理结果数据
      response.data.data.forEach((area, array) => {
        if (area.ok === false) {
          failResponse.push(`${area.id} : 添加仓库区域失败 `);
        } else {
          successResponse.push(`${area.id} : 添加仓库区域成功 `);
        }
      });

      // 批量关闭成功
      if (failResponse.length === 0) {
        message.success('添加仓库区域成功');
        yield put({ type: 'reduceCreateStockArea', payload: { isCreatStockAreaCallback: true } });
        return;
      }

      const description = `${successResponse} ${failResponse}`;

      //取消失败的订单。
      notification.open({
        message: '添加仓库区域结果',
        description,
        style: {
          width: 500,
          marginLeft: 335 - 500,
        },
        duration: null,
      });

      yield put({ type: 'reduceCreateStockArea', payload: { isCreatStockAreaCallback: true } });
    },

    //删除仓库区域
    * deleteStockArea({ payload }, { call, put }) {
      const { stockId, areaIds } = payload;
      if (is.not.existy(stockId) || is.empty(stockId) || is.empty(areaIds)) {
        message.error('添加仓库区域失败 : 参数不正确');
        return;
      }
      const response = yield call(deleteStockArea, { stockId, areaIds });

      if (is.truthy(response.error) && is.not.empty(response.data)) {
        message.error(`删除仓库区域失败 : ${Errors.message(response.error)}`);
        return;
      }
      message.success('删除仓库区域成功！')

      yield put({ type: 'reduceDeletaStockArea', payload: { isDeleteStockAreaCallback: true } });
    },

    //重置创建仓库区域回调
    * resetCreateStockArea({ payload }, { call, put }) {
      yield put({ type: 'reduceCreateStockArea', payload: { isCreatStockAreaCallback: false } });
    },

    //重置删除仓库区域回调
    * resetDeleteStockArea({ payload }, { call, put }) {
      yield put({ type: 'reduceDeletaStockArea', payload: { isDeleteStockAreaCallback: false } });
    },

    // 获取合作仓库列表
    * getStockListByUnity({ payload }, { call, put }) {
      const stockListByUnity = yield call(fetchStockListByUnity, payload);
      yield put({
        type: 'reduceStockListByUnity',
        payload: stockListByUnity,
      })
    },

    // 获取所有配送站列表
    * getStockListByDelivery({ payload }, { call, put }) {
      const stockListByDelivery = yield call(fetchStockListByDelivery, payload);
      yield put({
        type: 'reduceStockListByDelivery',
        payload: stockListByDelivery,
      })
    },

    // 解约产品接口
    * unsignVendors({ payload }, { call, put }) {
      const result = yield call(unsignVendor, payload);
      if (result === undefined) {
        message.error('解约失败');
        return;
      }
      if (result.ok) {
        const isStockRuleUpdateSuccess = true;
        yield put({
          type: 'reduceStockRuleUpdate',
          payload: { isStockRuleUpdateSuccess },
        })
      }
    },

    // 更新数据状态信号
    * updataStateFunc({ payload }, { call, put }) {
      const { state } = payload;
      yield put({
        type: 'reduceStockRuleUpdate',
        payload: { isStockRuleUpdateSuccess: state },
      })
    },

    // 更新仓库数据状态信号
    * updataStockStateFunc({ payload }, { call, put }) {
      const { state } = payload;
      yield put({
        type: 'reduceStockRule',
        payload: { isStockRuleOperationSuccess: state },
      })
    },

    // 获取直营仓库列表
    * getStockListByDirect({ payload }, { call, put }) {
      const directStockList = yield call(fetchStockListByDirect, payload);
      // 根据区域id 获取仓库 ->  配送站设置
      if (payload.areaId) {
        const directStockListByArea = directStockList
        yield put({
          type: 'reduceDirectStockListByArea',
          payload: directStockListByArea,
        })
      } else {
        // 中转仓设置
        yield put({
          type: 'reduceDirectStockList',
          payload: directStockList,
        })
      }
    },

    // 直营项目中转仓当前仓库分配规则查询
    * getStockDispatchRuleByDirect({ payload }, { call, put }) {
      const stockDispatchRule = yield call(fetchStockDispatchRuleByDirect, payload);
      if (payload.areaId) {
        // 根据区域id 获取仓库 ->  配送站设置
        const stockDispatchRuleByArea = stockDispatchRule
        yield put({
          type: 'reduceStockDispatchRuleByArea',
          payload: stockDispatchRuleByArea,
        })
      } else {
        // 中转仓设置
        yield put({
          type: 'reduceStockDispatchRule',
          payload: stockDispatchRule,
        })
      }
    },

    // 直营项目添加仓库分配规则
    * createStockDispatchRuleByDirect({ payload }, { call, put }) {
      const result = yield call(createStockDispatchRuleByDirect, payload);
      if (result === undefined) {
        message.error('添加失败');
        return;
      }
      if (payload.areaId) {
        // 配送站设置
        if (result.id) {
          message.success('添加成功');
          const isStockRuleOperationSuccess = true;
          yield put({
            type: 'reduceStockRule',
            payload: { isStockRuleOperationSuccess },
          })
        }
      } else {
        // 中转仓设置
        if (result.id) {
          message.success('添加成功');
        } else {
          message.error('添加失败');
        }
      }
    },

    // 直营项目编辑仓库分配规则
    * updateStockDispatchRuleByDirect({ payload }, { call, put }) {
      const result = yield call(updateStockDispatchRuleByDirect, payload);
      if (result === undefined || result.ok === false) {
        message.error('保存失败');
        return;
      }

      // 配送站设置
      if (result.ok) {
        message.success('编辑成功');
        const isStockRuleOperationSuccess = true;
        yield put({
          type: 'reduceStockRule',
          payload: { isStockRuleOperationSuccess },
        })
      }
    },
  },

  reducers: {

    //获取仓库列表
    reduceList(state, { payload }) {
      const { list } = payload;
      return { ...state, list };
    },
    //根据区域获取仓库列表
    reduceAreaList(state, { payload }) {
      const { listByArea } = payload;
      return { ...state, listByArea };
    },
    //获取仓库详情
    reduceDetail(state, { payload }) {
      const { detail } = payload;
      return { ...state, detail };
    },

    // 获取配送站列表
    reduceStockListByDelivery(state, { payload }) {
      const { stockListByDelivery } = state;
      Object.assign(stockListByDelivery, payload);
      return {
        ...state,
        stockListByDelivery,
      }
    },

    //创建仓库
    reduceCreate(state, { payload }) {
      const { isCreatStockCallback } = payload;
      return { ...state, isCreatStockCallback };
    },

    //更新仓库
    reduceUpdate(state, { payload }) {
      const { isUpdateStockCallback } = payload;
      return { ...state, isUpdateStockCallback };
    },

    //重置创建仓库回调
    reduceResetCreateStock(state, { payload }) {
      const { isCreatStockCallback, detail } = payload;
      return { ...state, isCreatStockCallback, detail };
    },

    //重置更新仓库回调
    reduceResetUpdateStock(state, { payload }) {
      const { isUpdateStockCallback, detail } = payload;
      return { ...state, isUpdateStockCallback, detail };
    },

    //创建仓库区域
    reduceCreateStockArea(state, { payload }) {
      const { isCreatStockAreaCallback } = payload;
      return { ...state, isCreatStockAreaCallback };
    },

    //删除仓库区域
    reduceDeletaStockArea(state, { payload }) {
      const { isDeleteStockAreaCallback } = payload;
      return { ...state, isDeleteStockAreaCallback };
    },

    // 获取合作仓库列表
    reduceStockListByUnity(state, { payload }) {
      const { stockListByUnity } = state;
      Object.assign(stockListByUnity, payload);
      return {
        ...state,
        stockListByUnity,
      }
    },

    //更新数据开关
    reduceStockRuleUpdate(state, { payload }) {
      const { isStockRuleUpdateSuccess } = payload;
      return {
        ...state,
        isStockRuleUpdateSuccess,
      }
    },

    //更新数据开关
    reduceStockRule(state, { payload }) {
      const { isStockRuleOperationSuccess } = payload;
      return {
        ...state,
        isStockRuleOperationSuccess,
      }
    },

    // 获取直营仓库列表
    reduceDirectStockList(state, { payload }) {
      const { directStockList } = state;
      Object.assign(directStockList, payload);
      return {
        ...state,
        directStockList,
      }
    },

    // 根据区域取直营仓库列表
    reduceDirectStockListByArea(state, { payload }) {
      const { directStockListByArea } = state;
      Object.assign(directStockListByArea, payload);
      return {
        ...state,
        directStockListByArea,
      }
    },

    // 直营项目中转仓当前仓库分配规则查询
    reduceStockDispatchRule(state, { payload }) {
      const { stockDispatchRule } = state;
      Object.assign(stockDispatchRule, payload);
      return {
        ...state,
        stockDispatchRule,
      }
    },

    // 根据区域  直营项目中转仓当前仓库分配规则查询
    reduceStockDispatchRuleByArea(state, { payload }) {
      const { stockDispatchRuleByArea } = state;
      Object.assign(stockDispatchRuleByArea, payload);
      return {
        ...state,
        stockDispatchRuleByArea,
      }
    },
  },
}
