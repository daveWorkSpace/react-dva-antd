import is from 'is_js';
import { hashHistory, routerRedux } from 'dva/router';
import { message } from 'antd';
import {
    fetchAccountInfo,
} from 'aoao-core-api-service/lib/account';
import {
  getAreas,

  getOrderRuleDetail,
  getServiceProvider,
  addOrderRules,
  publishOrderRules,
  deleteOrderRule,
  editOrderRuleS,

  getKnightRuleDetail,
  getCanSelectTeam,
  addKnightRules,
  publishKnightRules,
  deleteKnightRule,
  editKnightRuleS,
  getSopRulesList,
  updateSopRulesList,
  createSopRulesList,
} from 'aoao-core-api-service/lib/retail';
import { geography, authorize } from '../../../application';
import {
  stateTransform,
  numberDateToStr,
  dateFormatNew,
  sqlit,
  utcToDate,
  dateFormat,
} from '../../../utils/newUtils';

module.exports = {
  namespace: 'SendOrderRules',
  state: {
    // 所有区域列表
    areaList: {
      _meta: {},
      data: [],
    },
    // 所有分单规则区域列表
    orderAreaList: {
      _meta: {},
      data: [],
    },
    // 所有骑士规则区域列表
    courierAreaList: {
      _meta: {},
      data: [],
    },

    // 订单分单规则详情
    orderRuleListDetail: {
      _meta: {},
      data: [],
    },
    // 骑士分单规则详情
    knightRuleListDetail: {
      _meta: {},
      data: [],
    },
    // 服务商列表
    serviceProviderList: {
      _meta: {},
      data: [],
    },
    // 添加骑士规则时可选择的团队列表
    teamList: {
      _meta: {},
      data: [],
    },
    // 更新开关（添加、编辑、删出后需要重新获取最新数据）
    upDataState: false,
    //
    sopRulesList: {
      _meta: null,
      data: [],
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
      });
    },
  },

  effects: {
    // 获取该服务商下所有的区域
    * getAreaList(params, { call, put }) {
      console.log(params.payload)
      const areaList = yield call(getAreas, params.payload);
      const isOrder = params.payload.is_set_order_delivery_rule;
      const isCourier = params.payload.is_set_courier_delivery_rule;
      const areaParams = {
        isOrder,
        isCourier,
      }
      yield put({
        type: 'reduceAreaList',
        payload: {
          areaParams,
          areaList,
        },
      })
    },

    // 获取订单分单规则详情
    * getOrderRuleDetails(params, { call, put }) {
      const orderRuleListDetail = yield call(getOrderRuleDetail, params.payload);
      yield put({
        type: 'reduceOrderRuleDetail',
        payload: orderRuleListDetail,
      })
    },

    // 获取骑士分单规则详情
    * getKnightRuleDetails(params, { call, put }) {
      const knightRuleListDetail = yield call(getKnightRuleDetail, params.payload);
      yield put({
        type: 'reduceKnightRuleDetail',
        payload: knightRuleListDetail,
      })
    },

    // 获取服务商列表
    * getServiceProviders(params, { call, put }) {
      const serviceProvider = yield call(getServiceProvider, params.payload);
      yield put({
        type: 'reduceServiceProvider',
        payload: serviceProvider,
      })
    },

    // 获取可选择团队列表
    * getCanSelectTeams(params, { call, put }) {
      params.payload.limit = 1000;
      const teamList = yield call(getCanSelectTeam, params.payload);
      yield put({
        type: 'reduceCanSelectTeams',
        payload: teamList,
      })
    },

    // 添加订单分担规则
    * addOrderRule(params, { call, put }) {
      const result = yield call(addOrderRules, params.payload);
      if (result === undefined) {
        message.error('此优先级已经存在');
        return;
      }
      if (result.id !== '') {
        const rule_id = result.id;
        const relult = yield call(publishOrderRules, rule_id);
        if (relult.ok) {
          message.success('添加成功');
          const upDataState = true;
          yield put({
            type: 'reduceUpDate',
            payload: { upDataState },
          })
        }
      }
    },

    // 添加骑士分担规则
    * addKnightRule(params, { call, put }) {
      const result = yield call(addKnightRules, params.payload);
      if (result === undefined) {
        message.error('此优先级已经存在');
        return;
      }
      if (result.id != '') {
        const rule_id = result.id;
        const relult = yield call(publishKnightRules, rule_id);
        if (relult.ok) {
          message.success('添加成功');
          const upDataState = true;
          yield put({
            type: 'reduceUpDate',
            payload: { upDataState },
          })
        }
      }
    },

    // 编辑订单分单规则
    * editOrderRule(params, { call, put }) {
      const result = yield call(editOrderRuleS, params.payload);
      if (result === undefined) {
        message.error('此优先级已选');
        return;
      }
      if (result.ok) {
        message.success('修改成功');
        const pubResult = yield call(publishOrderRules, params.payload.rule_id);
        if (pubResult.ok) {
          const upDataState = true;
          yield put({
            type: 'reduceUpDate',
            payload: { upDataState },
          })
        }
      }
    },

    // 编辑骑士分单规则
    * editKnightRule(params, { call, put }) {
      const result = yield call(editKnightRuleS, params.payload);
      if (result === undefined) {
        message.error('此优先级已选');
        return;
      }
      if (result.ok) {
        message.success('修改成功');
        const pubResult = yield call(publishKnightRules, params.payload.rule_id);
        if (pubResult.ok) {
          const upDataState = true;
          yield put({
            type: 'reduceUpDate',
            payload: { upDataState },
          })
        }
      }
    },

    // 删除订单分单规则
    * deleteOrderRules(params, { call, put }) {
      const result = yield call(deleteOrderRule, params.payload);
      if (result.ok) {
        message.success('删除成功');
        const upDataState = true;
        yield put({
          type: 'reduceUpDate',
          payload: { upDataState },
        })
      }
    },

    // 删除骑士分单规则
    * deleteKnightRules(params, { call, put }) {
      const result = yield call(deleteKnightRule, params.payload);
      if (result.ok) {
        message.success('删除成功');
        const upDataState = true;
        yield put({
          type: 'reduceUpDate',
          payload: { upDataState },
        })
      }
    },

    // 更新数据状态信号
    * updataStateFunc(params, { call, put }) {
      const { state } = params.payload;
      yield put({
        type: 'reduceUpDate',
        payload: { upDataState: state },
      })
    },

    // 获取仓库列表
    * getStockList(params, { call, put }) {
            // const result = yield call(xxxxx, params.payload)
      const result = [];
      yield put({
        type: 'reduceStockList',
        payload: result,
      })
    },

    // 获取标准规则列表
    * getSopRulesList(params, { call, put }) {
      const sopRulesList = yield call(getSopRulesList, params.payload);
      if (!sopRulesList.data) {
        message.info('标准规则列表获取失败');
        return;
      }
      yield put({
        type: 'reducerSopRulesList',
        payload: { sopRulesList },
      })
    },

    // 更新标准规则
    * updateSopRulesList(params, { call, put }) {
      const sopRulesList = yield call(updateSopRulesList, params.payload);
      if (!sopRulesList.data) {
        message.info('标准规则修改失败');
        return;
      }
      yield put({
        type: 'getSopRulesList',
        payload: { contract_id: params.payload.values.contract_id },
      })
    },
    // 创建标准规则
    * createSopRulesList(params, { call, put }) {
      const sopRulesList = yield call(createSopRulesList, params.payload);
      if (!sopRulesList.data) {
        message.info('标准规则创建失败');
        return;
      }
      yield put({
        type: 'getSopRulesList',
        payload: { contract_id: params.payload.contract_id },
      })
    },

  },

  reducers: {
    // 获取该服务商下所有的区域
    reduceAreaList(state, { payload }) {
      const { areaList, orderAreaList, courierAreaList } = state;
      if (payload.areaParams.isOrder) {
        Object.assign(orderAreaList, payload.areaList);
      }
      if (payload.areaParams.isCourier) {
        Object.assign(courierAreaList, payload.areaList);
      }
      Object.assign(areaList, payload.areaList);
      return {
        ...state,
        areaList,
        orderAreaList,
        courierAreaList,
      }
    },

        //获取订单分单规则详情
    reduceOrderRuleDetail(state, { payload }) {
      const { orderRuleListDetail } = state;
      Object.assign(orderRuleListDetail, payload);
      return {
        ...state,
        orderRuleListDetail,
      }
    },

        // 获取骑士分单规则详情
    reduceKnightRuleDetail(state, { payload }) {
      const { knightRuleListDetail } = state;
      Object.assign(knightRuleListDetail, payload);
      return {
        ...state,
        knightRuleListDetail,
      }
    },


        //获取服务商列表
    reduceServiceProvider(state, { payload }) {
      const { serviceProviderList } = state;
      Object.assign(serviceProviderList, payload);
      return {
        ...state,
        serviceProviderList,
      }
    },

        //获取可用团队列表
    reduceCanSelectTeams(state, { payload }) {
      const { teamList } = state;
      Object.assign(teamList, payload);
      return {
        ...state,
        teamList,
      }
    },

    //更新数据开关
    reduceUpDate(state, { payload }) {
            // let { upDataState } = state;
      const { upDataState } = payload;
      return {
        ...state,
        upDataState,
      }
    },
    // 更新标准规则列表
    reducerSopRulesList(state, { payload }) {
      const { sopRulesList } = payload;
      return {
        ...state,
        sopRulesList,
      }
    },

  },
}
