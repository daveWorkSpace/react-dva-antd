import is from 'is_js';
import { hashHistory, routerRedux } from 'dva/router';
import { message } from 'antd';
import { createService, updateService, fetchServiceListByFilter, fetchServiceDetail } from 'aoao-core-api-service/lib/service';

import { geography, authorize } from '../../application';
import { Roles, Modules, PriceMode, DeliveryMode, Errors, ServiceState } from '../../application/define';
import { List, Service } from '../../application/object/';

module.exports = {
  namespace: 'BusinessService',
  state: {
    list: [],                 //设置列表
    detail: new Service(),    //产品详情 (默认值)

    isCreateServiceCallback: false, //创建成功回调
    isUpdateServiceCallback: false, //更新成功回调
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        //判断是否访问列表页
        if (Modules.equalPath(Modules.businessServiceList, pathname)) {
          //获取列表页数据
          dispatch({ type: 'fetchServiceList', payload: { state: ServiceState.on, page: 1 } });
        }
      });
    },
  },

  effects: {

    //获取列表数据
    * fetchServiceList({ payload }, { call, put }) {
      const { page, size, serviceId, name, state } = payload
      const vendorId = authorize.vendor.id;
      const response = yield call(fetchServiceListByFilter, { vendorId, page, size, serviceId, name, state });
      if (is.truthy(response.error) && is.not.empty(response.data)) {
        message.error(`获取产品服务列表失败 : ${Errors.message(response.error)}`);
        return;
      }

      //遍历列表对象数据，获取产品服务设置列表
      const result = List.mapper(response, Service);

      //设置列表的当前页码和分页条数
      result.page = page;
      result.size = size;

      yield put({ type: 'reduceList', payload: { list: result } });
    },

    //获取详情
    * fetchServiceDetail({ payload }, { call, put }) {
      const { serviceId } = payload;
      const response = yield call(fetchServiceDetail, { serviceId });
      if (is.truthy(response.error) && is.not.empty(response.data)) {
        message.error(`获取产品详情失败 : ${Errors.message(response.error)}`);
        return;
      }

      //获取详情数据
      const result = Service.mapper(response.data);
      yield put({ type: 'reduceDetail', payload: { detail: result } });
    },

    //创建设置数据
    * createService({ payload }, { call, put }) {
      const { vendorId, operatorId, name, serviceState, businessMode, businessTime, deliveryMode, deliveryTime, deliveryDistanceMax, priceMode, revertPricePlan, priceType } = payload;
      const params = {
        vendorId,
        operatorId: authorize.account.id,
        name,
        serviceState: serviceState.value,
        businessMode: businessMode.value,
        businessTime: [businessTime.start, businessTime.finish],
        deliveryMode: deliveryMode.value,
        deliveryDistanceMax,
        priceMode: priceMode.value,
        pricePlan: revertPricePlan,
      }

      //判断，如果是即使达，则传递配送时间参数
      if (deliveryMode.value === DeliveryMode.immediateMode) {
        params.deliveryTime = deliveryTime;
      }

      //判断，如果是阶梯定价，则传递定价模式参数
      if (priceMode.value === PriceMode.levelPriceMode) {
        params.priceType = priceType.value;
      }

      //创建产品服务
      const response = yield call(createService, params);
      if (is.truthy(response.error) && is.not.empty(response.data)) {
        message.error(`创建服务产品设置失败 : ${Errors.message(response.error)}`);
        return;
      }

      yield put({ type: 'reduceCreateService', payload: { isCreateServiceCallback: true } });
    },

    //更新设置数据
    * updateService({ payload }, { call, put }) {
      const { id, name, serviceState, businessMode, businessTime, deliveryMode, deliveryTime, deliveryDistanceMax, priceMode, revertPricePlan, priceType } = payload;
      const params = {
        serviceId: id,
        operatorId: authorize.account.id,
        name,
        serviceState: serviceState.value,
        businessMode: businessMode.value,
        businessTime: [businessTime.start, businessTime.finish],
        deliveryMode: deliveryMode.value,
        deliveryDistanceMax,
        priceMode: priceMode.value,
        pricePlan: revertPricePlan,
      }

      //判断，如果是即使达，则传递配送时间参数
      if (deliveryMode.value === DeliveryMode.immediateMode) {
        params.deliveryTime = deliveryTime;
      }

      //判断，如果是阶梯定价，则传递定价模式参数
      if (priceMode.value === PriceMode.levelPriceMode) {
        params.priceType = priceType.value;
      }

      const response = yield call(updateService, params);
      if (is.truthy(response.error) && is.not.empty(response.data)) {
        message.error(`创建服务产品设置失败 : ${Errors.message(response.error)}`);
        return;
      }
      message.success('更新服务产品设置成功');

      yield put({ type: 'reduceUpdateService', payload: { isUpdateServiceCallback: true } });
    },

    //重置创建成功回调
    * resetCreateService({ payload }, { call, put }) {
      yield put({ type: 'reduceResetCreateService', payload: { isCreateServiceCallback: false } });
    },

    //重置更新成功回调
    * resetUpdateService({ payload }, { call, put }) {
      yield put({ type: 'reduceResetUpdateService', payload: { isUpdateServiceCallback: false } });
    },

  },

  reducers: {

    reduceList(state, { payload }) {
      const { list } = payload;
      return { ...state, list };
    },

    reduceDetail(state, { payload }) {
      const { detail } = payload;
      return { ...state, detail };
    },

    reduceCreateService(state, { payload }) {
      const { isCreateServiceCallback } = payload;
      return { ...state, isCreateServiceCallback };
    },

    reduceUpdateService(state, { payload }) {
      const { isUpdateServiceCallback } = payload;
      return { ...state, isUpdateServiceCallback };
    },

    reduceResetCreateService(state, { payload }) {
      const { isCreateServiceCallback } = payload;
      return { ...state, isCreateServiceCallback, detail: new Service() };
    },

    reduceResetUpdateService(state, { payload }) {
      const { isUpdateServiceCallback } = payload;
      return { ...state, isUpdateServiceCallback, detail: new Service() };
    },
  },
}
