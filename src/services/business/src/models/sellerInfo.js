/**
 *  Created by dave 17/1/7
 *  项目管理-商家信息model层
 */
import dot from 'dot-prop'
import { hashHistory, routerRedux } from 'dva/router';
import { message } from 'antd';
import {
  getSellerInfoMessage,
  getSellerShops,
  getSignedInfo,
  getOrderRuleList,
  getOrderRuleDetail,
  getAreas,
  getServiceProvider,
  addOrderRules,
  publishOrderRules,
  editOrderRuleS,
  deleteOrderRule,
  getKnightRuleDetail,
  getVenderNameS,
  getCanSelectTeam,
  addKnightRules,
  publishKnightRules,
  editKnightRuleS,
  deleteKnightRule,
} from 'aoao-core-api-service/lib/retail';
import { fetchCityList } from 'aoao-core-api-service/lib/public';
import {
  stateTransform,
  numberDateToStr,
  dateFormatNew,
  sqlit,
  utcToDate,
  dateFormat,
} from '../../../../utils/newUtils';
import { geography, authorize } from '../../../../application';
import aoaoAppSystemFlag from './../../../../utils/systemConfig';

//添加后跳转
function addSuccess() {
  setTimeout(() => {
    window.location.href = '/#/business/manage/retail/orderDispatchRules';
  }, 1000)
}
module.exports = {
  namespace: 'retailSellerInfo',
  state: {
    seller_id: '', //商家id
    contract_id: '', // 签约id
    seller_Message: '', // 商家信息(包含商家id、签约Id)
    city_code: '110000', //城市
    current: 1, //分页：当前页数
    shopList: {
      _meta: {},
      data: [],
    },
    // 商家基本信息
    basicInfoData: [
      {
        noun: '商户号',
        value: '',
      }, {
        noun: '审核状态',
        value: ' ',
      }, {
        noun: '注册日期',
        value: ' ',
      }, {
        noun: '商家名称',
        value: ' ',
      }, {
        noun: '所属城市',
        value: ' ',
      }, {
        noun: '联系人',
        value: ' ',
      }, {
        noun: '商家类型',
        value: ' ',
      }, {
        noun: '商户状态',
        value: ' ',
      }, {
        noun: '注册手机',
        value: ' ',
      },
    ],
    // 签约基本信息
    signedInfoData: [{
      noun: '产品名称',
      value: '',
    }, {
      noun: '配送时间',
      value: ' ',
    }, {
      noun: '营业时间',
      value: ' ',
    }, {
      noun: '签约时间',
      value: ' ',
    }, {
      noun: '业务模式',
      value: ' ',
    }, {
      noun: '最新修改时间',
      value: ' ',
    }],
    // 签约产品定价信息
    signedInfos: {
      price_mode: '', // 定价模式
      plan_type: '', // 定价方案
      price_plan: [], // 定价方案详情
    },
    //商家的订单分单规则列表
    orderRuleList: {
      _meta: {},
      data: [{ id: '22222222', area_info: { id: '333', name: '区域三' } }],
    },
    // 订单分单规则详情
    orderRuleListDetail: {
      _meta: {},
      data: [],
    },
    //商家骑士分单规则列表
    knightRuleList: {
      _meta: {},
      data: [],
    },
    // 骑士分单规则详情
    knightRuleListDetail: {
      _meta: {},
      data: [],
    },
    // 所有区域列表
    areaList: {
      _meta: {},
      data: [],
    },
    // 所有区域包含子区域列表
    areaChildList: {
      _meta: {},
      data: [],
    },
    // 添加订单分单规则
    addOrderRule: {
      _meta: {},
      data: [],
    },
    // 编辑订单分单规则
    editOrderRule: {
      area_info: {
        id: '',
        name: '',
      },
      rule_class: '',
      priority: '',
      supply_vendor_list: [],
      sub_area_list: [],
    },
    // 添加骑士分单规则
    addCourierRule: {
      _meta: {},
      data: [],
    },
    // 服务商列表
    serviceProvider: {
      _meta: {},
      data: [],
    },
    // 添加骑士规则时可选择的团队列表
    teamList: {
      _meta: {},
      data: [],
    },
    // 当前登录的服务商信息
    serviceMessage: {},
    // 更新开关（添加、编辑、删出后需要重新获取最新数据）
    upData: false,
    // 可服务的城市列表
    serviceCityList: [],
    pageFlag: false,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location;
        const vendor_id = authorize.auth.vendorId;
        const city_code = dot.get(authorize.vendor, 'city.code');
        const seller_id = sessionStorage.getItem('sellerId');
        const contract_id = sessionStorage.getItem('contractId');
        const state = 100;//区域状态 100启用 -100 禁用
        const relate_type = 10; // 区域类型 10 直营 20 加盟
        const is_filter_sub_area = true; //是否过滤子区
        const is_set_order_delivery_rule = true;  //是否返回设置订单分单规则状态
        const is_set_courier_delivery_rule = true; //是否返回设置骑士分单规则状态
        // 监测路由进入直营项目
        if (pathname === '/business/manage/retail/shop') {
          // 商家信息
          dispatch({
            type: 'getSellerInfoManage',
            payload: { seller_id, vendor_id, city_code },
          });

          // 店铺列表
          dispatch({
            type: 'getSellerShopsE',
            payload: { seller_id, city_code },
          });
        }

        // 签约信息初始化
        if (pathname === '/business/manage/retail/signed') {
          // 商家信息
          dispatch({
            type: 'getSignedInfoE',
            payload: { contract_id },
          });
        }

        // 监测路由进入订单分担规则
        if (pathname === '/business/manage/retail/orderDispatchRules') {
          const limit = 1000;
          // 区域列表
          dispatch({
            type: 'getAreaE',
            payload: {
              vendor_id,
              state,
              relate_type,
              is_filter_sub_area,
              is_set_order_delivery_rule,
              contract_id,
              limit,
            },
          });

          // 商家信息
          dispatch({
            type: 'getSellerInfoManage',
            payload: { seller_id, vendor_id, city_code },
          });

          // 订单规则设置 区域及其规则列表
          /* dispatch({
           type: 'getOrderDispatchRulesE',
           payload: { seller_id, vendor_id },
           });*/

          // 分单规则设置的某个详情(存在优先级)
          dispatch({
            type: 'getSellerShopsE',
            payload: { seller_id, city_code },
          });

          // 获取可服务的城市列表
          dispatch({
            type: 'manageGetServiceCityListE',
            payload: { vendor_id },
          });
        }

        //清除列表数据
        if (pathname !== '/business/manage/retail/orderDispatchRules') {
          const orderRuleListDetail = {
            _meta: {},
            data: [],
          }

          dispatch({
            type: 'getOrderRuleDetailR',
            payload: orderRuleListDetail,
          })
        }

        if (pathname !== '/business/manage/retail/knightDispatchRules' || pathname !== '/business/manage/affiliates/knigh') {
          const areaList = {
            _meta: {},
            data: [],
          }
          const knightRuleListDetail = {
            _meta: {},
            data: [],
          }

          dispatch({
            type: 'getAreaR',
            payload: areaList,
          });

          dispatch({
            type: 'getKnightRuleDetailR',
            payload: knightRuleListDetail,
          })
        }

        // 监测路由进入骑士分担规则
        if (pathname === '/business/manage/retail/knightDispatchRules') {
          const limit = 1000;
          // 区域列表
          dispatch({
            type: 'getAreaE',
            payload: {
              vendor_id,
              state,
              relate_type,
              is_filter_sub_area,
              is_set_courier_delivery_rule,
              contract_id,
              limit,
            },
          });

          // 商家信息
          dispatch({
            type: 'getSellerInfoManage',
            payload: { seller_id, vendor_id, city_code },
          });

          // 订单规则设置 区域及其规则列表
          dispatch({
            type: 'getOrderDispatchRulesE',
            payload: { seller_id, vendor_id },
          });

          // 分单规则设置的某个详情(存在优先级)
          dispatch({
            type: 'getSellerShopsE',
            payload: { seller_id, city_code },
          });

          // 获取可服务的城市列表
          dispatch({
            type: 'manageGetServiceCityListE',
            payload: { vendor_id },
          })
        }
      });
    },
  },

  effects: {

    // 获取该服务商下所有的区域
    * getAreaE(params, { call, put }) {
      const areaList = yield call(getAreas, params.payload);
      yield put({
        type: 'getAreaR',
        payload: areaList,
      })
    },

    // 获取该商家所在的区域、包括子区域的区域列表
    * getAreaChildE(params, { call, put }) {
      const areaChildList = yield call(getAreas, params.payload);
      yield put({
        type: 'getAreaChildR',
        payload: areaChildList,
      })
    },

    // 获取商户详情
    * getSellerInfoManage(params, { call, put }) {
      const resultValue = yield call(getSellerInfoMessage, params.payload);
      yield put({
        type: 'sellerInfoInit',
        payload: { resultValue },
      })
    },

    // 获取商户店铺列表
    * getSellerShopsE(params, { call, put }) {
      const shopList = yield call(getSellerShops, params.payload);
      yield put({
        type: 'getSellerShopsR',
        payload: shopList,
      })
    },

    // 获取签约详细信息
    * getSignedInfoE(params, { call, put }) {
      const signedInfo = yield call(getSignedInfo, params.payload);
      yield put({
        type: 'getSignedInfoR',
        payload: { signedInfo },
      })
    },

    // 获取订单分单规则(添加分担规则时所要用的服务商列表)
    * getOrderDispatchRulesE(params, { call, put }) {
      const orderRuleList = yield call(getOrderRuleList, params.payload);
      yield put({
        type: 'getOrderDispatchRulesR',
        payload: { orderRuleList },
      })
    },

    // 获取订单分单规则详情
    * getOrderRuleDetailE(params, { call, put }) {
      const orderRuleListDetail = yield call(getOrderRuleDetail, params.payload);
      yield put({
        type: 'getOrderRuleDetailR',
        payload: orderRuleListDetail,
      })
    },

    // 获取骑士分单规则详情
    * getKnightRuleDetailE(params, { call, put }) {
      const knightRuleListDetail = yield call(getKnightRuleDetail, params.payload);
      yield put({
        type: 'getKnightRuleDetailR',
        payload: knightRuleListDetail,
      })
    },

    // 获取服务商列表
    * getServiceProviderE(params, { call, put }) {
      const serviceProvider = yield call(getServiceProvider, params.payload);
      yield put({
        type: 'getServiceProviderR',
        payload: serviceProvider,
      })
    },

    // 获取服务商详情
    * getVenderNameE(params, { call, put }) {
      const serviceMessage = yield call(getVenderNameS, params.payload);
      yield put({
        type: 'getVenderNameR',
        payload: serviceMessage,
      })
    },

    // 获取可选择团队列表
    * getAddTeamListE(params, { call, put }) {
      params.payload.limit = 1000;
      const teamList = yield call(getCanSelectTeam, params.payload);
      yield put({
        type: 'getAddTeamListR',
        payload: teamList,
      })
    },

    // 添加订单分担规则
    * addOrderRuleE(params, { call, put }) {
      const result = yield call(addOrderRules, params.payload);
      if (result === undefined) {
        message.error('此优先级已经存在');
        return;
      }
      if (result.id != '') {
        const rule_id = result.id;
        const relult = yield call(publishOrderRules, rule_id);
        if (relult.ok) {
          message.success('添加成功');
          const upDataState = true;
          yield put({
            type: 'upDataR',
            payload: { upDataState },
          })
        }
      }
    },

    // 添加骑士分担规则
    * addKnightRuleE(params, { call, put }) {
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
            type: 'upDataR',
            payload: { upDataState },
          })
        }
      }
    },

    // 编辑订单分单规则
    * editOrderRuleE(params, { call, put }) {
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
            type: 'upDataR',
            payload: { upDataState },
          })
        }
      }
    },

    // 编辑骑士分单规则
    * editKnightRuleE(params, { call, put }) {
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
            type: 'upDataR',
            payload: { upDataState },
          })
        }
      }
    },

    // 删除订单分单规则
    * deleteOrderRuleE(params, { call, put }) {
      const result = yield call(deleteOrderRule, params.payload);
      if (result.ok) {
        message.success('删除成功');
        const upDataState = true;
        yield put({
          type: 'upDataR',
          payload: { upDataState },
        })
      }
    },

    // 删除骑士分单规则
    * deleteKnightRuleE(params, { call, put }) {
      const result = yield call(deleteKnightRule, params.payload);
      if (result.ok) {
        message.success('删除成功');
        const upDataState = true;
        yield put({
          type: 'upDataR',
          payload: { upDataState },
        })
      }
    },

    // 获取服务商服务城市
    * manageGetServiceCityListE(params, { call, put }) {
      if (aoaoAppSystemFlag.IS_API_CITY_DATA === true) {
        const serviceCityList = yield call(fetchCityList, params.payload.vendor_id);
        yield put({
          type: 'manageGetServiceCityListR',
          payload: serviceCityList,
        })
      }
    },
  },


  reducers: {

    //获取区域列表
    getAreaR(state, action) {
      const { areaList } = state;
      Object.assign(areaList, action.payload);
      return {
        ...state,
        areaList,
      }
    },

    // 获取 某一商家下所在的区域的父级及子集区域
    getAreaChildR(state, action) {
      const { areaChildList } = state;
      Object.assign(areaChildList, action.payload);
      return {
        ...state,
        areaChildList,
      }
    },

    // 初始化数据(商户信息详情)
    sellerInfoInit(state, action) {
      const { basicInfoData } = state;
      const { resultValue } = action.payload;
      basicInfoData[0].value = resultValue.seller_no;
      basicInfoData[1].value = stateTransform('verify_state', resultValue.verify_state);
      basicInfoData[2].value = dateFormatNew(resultValue.created_at);
      basicInfoData[3].value = resultValue.name;
      basicInfoData[4].value = geography.cityName(resultValue.city_code);
      basicInfoData[5].value = resultValue.biz_profile.legal_name;
      basicInfoData[6].value = stateTransform('seller_type', resultValue.seller_type);
      basicInfoData[7].value = stateTransform('seller_state', resultValue.state);
      basicInfoData[8].value = resultValue.mobile;
      return {
        ...state,
        city_code: resultValue.city_code,
        basicInfoData,
      }
    },

    // 商家店铺列表
    getSellerShopsR(state, action) {
      const { shopList } = state;
      Object.assign(shopList, action.payload);
      return {
        ...state,
        shopList,
      }
    },

    //签约信息详情
    getSignedInfoR(state, action) {
      const { signedInfoData, signedInfos } = state;
      const { signedInfo } = action.payload;
      const _date = utcToDate(signedInfo.created_at);
      const date2 = utcToDate(signedInfo.updated_at)
      _date.time.length = 2;
      date2.time.length = 2;
      const create_at = `${_date.date.join('-')}  ${_date.time.join(':')}`;
      const updated_at = `${date2.date.join('-')}  ${date2.time.join(':')}`;
      signedInfoData[0].value = signedInfo.service.name;
      signedInfoData[1].value = `${signedInfo.delivery_time}(分钟)`;
      signedInfoData[2].value = sqlit(signedInfo.biz_time, '-');
      signedInfoData[3].value = create_at;

      signedInfoData[4].value = signedInfo.biz_mode == 10 ? '本地生活圈即时送' : '--';
      signedInfoData[5].value = updated_at;
      signedInfos.price_mode = signedInfo.price_mode;
      signedInfos.plan_type = signedInfo.plan_type;
      signedInfos.price_plan = signedInfo.price_plan;
      return {
        ...state,
        signedInfoData,
      }
    },

    //保存 骑士id
    saveSellerId(state, action) {
      let { seller_id, contract_id, seller_Message } = state;
      const { sellerId, contractId, sellerMessage } = action.payload;
      seller_id = sellerId;
      contract_id = contractId;
      seller_Message = sellerMessage;
      return {
        ...state,
        seller_id,
        contract_id,
        sellerMessage,
      }
    },

    //保存 签约id
    saveContractId(state, action) {
      const { contract_id } = state;
      Object.assign(contract_id, action.payload)
      return {
        ...state,
        contract_id,
      }
    },

    //获取商户下的区域及其分单规则列表)
    getOrderDispatchRulesR(state, action) {
      const { orderRuleList } = state;
      Object.assign(orderRuleList, action.payload);
      return {
        ...state,
        orderRuleList,
      }
    },

    //获取订单分单规则详情
    getOrderRuleDetailR(state, action) {
      const { orderRuleListDetail } = state;
      Object.assign(orderRuleListDetail, action.payload);
      return {
        ...state,
        orderRuleListDetail,
      }
    },

    //获取骑士分单规则详情
    getKnightRuleDetailR(state, action) {
      const { knightRuleListDetail } = state;
      Object.assign(knightRuleListDetail, action.payload);
      return {
        ...state,
        knightRuleListDetail,
      }
    },

    // 城市的更改
    cityChange(state, action) {
      let { city_code } = state;
      const { city_codes } = action.payload;
      /*Object.assign({ city_code }, action.payload);*/
      city_code = city_codes;
      return {
        ...state,
        city_code,
      }
    },

    //添加订单分单规则
    addOrderRuleR(state, action) {
      const { addOrderRule } = state;
      Object.assign(addOrderRule, action.payload);
      return {
        ...state,
        addOrderRule,
      }
    },

    //添加骑士分担规则
    addCourierRule(state, action) {
      const { addCourierRule } = state;
      Object.assign(addCourierRule, action.payload);
      return {
        ...state,
        addCourierRule,
      }
    },

    //获取服务商列表
    getServiceProviderR(state, action) {
      const { serviceProvider } = state;
      Object.assign(serviceProvider, action.payload);
      return {
        ...state,
        serviceProvider,
      }
    },

    //获取当前服务商信息
    getVenderNameR(state, action) {
      const { serviceMessage } = state;
      Object.assign(serviceMessage, action.payload);
      return {
        ...state,
        serviceMessage,
      }
    },

    //更新数据开关
    upDataR(state, action) {
      let { upData } = state;
      const { upDataState } = action.payload;
      upData = upDataState;
      return {
        ...state,
        upData,
      }
    },

    //编辑订单分单规则
    editOrderRuleR(state, action) {
      const { editOrderRule } = state;
      Object.assign(editOrderRule, action.payload);
      return {
        ...state,
        editOrderRule,
      }
    },

    //获取可用团队列表
    getAddTeamListR(state, action) {
      const { teamList } = state;
      Object.assign(teamList, action.payload);
      return {
        ...state,
        teamList,
      }
    },

    // 服务商可服务城市
    manageGetServiceCityListR(state, action) {
      const { serviceCityList } = state;
      Object.assign(serviceCityList, action.payload);
      return {
        ...state,
        serviceCityList,
      }
    },

    // 分页的开关
    pageFlagChange(state, action) {
      const { pageFlag } = state;
      return {
        ...state,
        pageFlag: action.payload.pageFlag,
      }
    },

  },
}
