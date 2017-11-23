import is from 'is_js';
import dot from 'dot-prop'
import { hashHistory, routerRedux } from 'dva/router';
import { message } from 'antd';
import { fetchAccountInfo } from 'aoao-core-api-service/lib/account';
import {
  getContractSellers,
  getSellerInfoMessage,
  getSellerShops,
  getSignedInfo,
  getSignSellerList,
} from 'aoao-core-api-service/lib/retail';

import {
  fetchContractServiceDetail,
  updateContractService,
} from 'aoao-core-api-service/lib/service';

import {
  fetchAddContractsActive,
} from 'aoao-core-api-service/lib/business';
import { geography, authorize } from '../../../application';
import { List, Service, Contract } from '../../../application/object/';
import { PriceMode, DeliveryMode } from '../../../application/define';

import {
  stateTransform,
  numberDateToStr,
  dateFormatNew,
  sqlit,
  utcToDate,
  dateFormat,
} from '../../../utils/newUtils';

module.exports = {
  namespace: 'ProjectManage',
  state: {
    detail: new Service(),                  //产品详情 (默认值)
    isUpdateContractServiceCallback: false, //更新签约信息回调
    projectList: {
      _meta: [],
      data: [],
    }, //项目列表
    newProjectList: {
      _meta: [],
      data: [],
    }, //新项目列表
    sellerList: {
      _meta: [],
      data: [],
    }, //签约合作项目
    // 商家基本信息
    basicInfoData: [{
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
    }],
    //商户店铺列表
    shopList: {
      _meta: {},
      data: [],
    },
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
    // 添加项目状态
    addprojectState: false,
  },

  subscriptions: {
    setup({
      dispatch,
      history,
    }) {
      history.listen((location) => {});
    },
  },

  effects: {
    // 获取项目列表
    * getProjectList({ payload }, { call, put }) {
      const vendor_id = authorize.auth.vendorId;
      const city_code = dot.get(authorize.vendor, 'city.code');
      const {
        contract_type,
        page,
      } = payload;
      const pages = page || 1;
      const limit = 10;
      const sort = '{"created_at":-1}';
      const projectList = yield call(getContractSellers, vendor_id, city_code, contract_type, pages, limit, sort);
      yield put({
        type: 'reduceProjectList',
        payload: projectList,
      })
    },

    // 查询新项目列表
    * getNewProjectList({
      payload,
    }, {
      call,
      put,
    }) {
      yield put({
        type: 'reduceNewProjectList',
        payload: {
          _meta: [],
          data: [{
            seller_no: 123123,
            name: '宋家宝',
            legal_person: '何子怡',
            mobile: 1390232333,
            city: '北京',
            sign_time: '2017-02-02',
          }],
        },
      })
    },

    // 添加新项目
    * addNewProject({ payload }, { call, put }) {
      const result = yield call(fetchAddContractsActive, payload);
      if (result === undefined) {
        message.error('添加失败');
        return;
      }
      if (result.ok) {
        const addprojectState = true;
        yield put({
          type: 'reduceAddNewProject',
          payload: {
            addprojectState,
          },
        })
      }
    },

    // 添加新项目状态更新函数
    * updateAddNewProjectState({
      payload,
    }, {
      call,
      put,
    }) {
      const addprojectState = payload.state;
      yield put({
        type: 'reduceAddNewProject',
        payload: {
          addprojectState,
        },
      })
    },

    // 获取签约产品接口
    * getSignSellerLists({
      payload,
    }, {
      call,
      put,
    }) {
      const sellerList = yield call(getSignSellerList, payload);
      yield put({
        type: 'reduceSignSellerList',
        payload: sellerList,
      })
    },

    // 获取商户详情
    * getSellerInfo(params, {
      call,
      put,
    }) {
      const resultValue = yield call(getSellerInfoMessage, params.payload);
      yield put({
        type: 'reduceSellerInfo',
        payload: {
          resultValue,
        },
      })
    },

    // 获取商户店铺列表
    * getSellerShopList(params, {
      call,
      put,
    }) {
      const shopList = yield call(getSellerShops, params.payload);
      yield put({
        type: 'reduceSellerShopList',
        payload: shopList,
      })
    },

    // 获取签约详细信息
    * getSignedInfos(params, {
      call,
      put,
    }) {
      const signedInfo = yield call(getSignedInfo, params.payload);
      yield put({
        type: 'reduceSignedInfo',
        payload: {
          signedInfo,
        },
      })
    },

    // 获取签约信息，返回数据为Service对象
    * fetchContractServiceDetail({ payload }, { call, put }) {
      const { contractId } = payload;
      const response = yield call(fetchContractServiceDetail, { contractId });
      //获取详情数据
      if (!response.data) {
        message.error('获取签约信息失败')
        return;
      }
      const result = Service.mapper(response.data);
      result.id = response.data.service_id;
      result.name = response.data.service.name;
      result.cityCode = response.data.city_code[0];
      result.contract = Contract.mapper(response.data);
      yield put({ type: 'reduceContractService', payload: { detail: result } })
    },

    //更新签约信息
    * updateContractService({ payload }, { call, put }) {
      const { contractId, service, cityCode } = payload;
      const { businessMode, businessTime, deliveryMode, deliveryTime, deliveryDistanceMax, priceMode, revertPricePlan, priceType, regionRule } = service;
      const params = {
        contractId,
        cityCode,
        businessMode: businessMode.value,
        businessTime: [businessTime.start, businessTime.finish],
        deliveryMode: deliveryMode.value,
        deliveryDistanceMax,
        priceMode: priceMode.value,
        pricePlan: revertPricePlan,
        regionRule: regionRule.value,
      }

      //判断，如果是即使达，则传递配送时间参数
      if (deliveryMode.value === DeliveryMode.immediateMode) {
        params.deliveryTime = deliveryTime;
      }

      //判断，如果是阶梯定价，则传递定价模式参数
      if (priceMode.value === PriceMode.levelPriceMode) {
        params.priceType = priceType.value;
      }
      const response = yield call(updateContractService, params);
      //获取详情数据
      if (!response.data.ok) {
        message.error('更新签约信息失败')
        return;
      }
      yield put({ type: 'reduceUpdateContractService', payload: { isUpdateContractServiceCallback: true } })
    },

    //重置请求成功回调
    * resetContractServiceCallback({ payload }, { call, put }) {
      yield put({ type: 'reduceUpdateContractService', payload: { isUpdateContractServiceCallback: false } })
    },
  },

  reducers: {
    // 获取项目列表
    reduceProjectList(state, {
      payload,
    }) {
      const {
        projectList,
      } = state;
      Object.assign(projectList, payload)
      return { ...state,
        projectList,
      }
    },

    // 查询新项目列表
    reduceNewProjectList(state, {
      payload,
    }) {
      const {
        newProjectList,
      } = state;
      Object.assign(newProjectList, payload)
      return { ...state,
        newProjectList,
      }
    },

    // 添加新项目
    reduceAddNewProject(state, {
      payload,
    }) {
      const { addprojectState } = payload;
      return { ...state,
        addprojectState,
      }
    },

    // 获取历史合作项目
    reduceSignSellerList(state, {
      payload,
    }) {
      const {
        sellerList,
      } = state;
      Object.assign(sellerList, payload)
      return { ...state,
        sellerList,
      }
    },

    // 获取商户详情
    reduceSellerInfo(state, {
      payload,
    }) {
      const {
        basicInfoData,
      } = state;
      const {
        resultValue,
      } = payload;
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
        basicInfoData,
      }
    },

    // 商家店铺列表
    reduceSellerShopList(state, {
      payload,
    }) {
      const {
        shopList,
      } = state;
      Object.assign(shopList, payload);
      return {
        ...state,
        shopList,
      }
    },

    //签约信息详情
    reduceSignedInfo(state, action) {
      const {
        signedInfoData,
        signedInfos,
      } = state;
      const {
        signedInfo,
      } = action.payload;
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

    // 签约信息详情映射版
    reduceContractService(state, { payload }) {
      const { detail } = payload;
      return { ...state, detail };
    },

    //签约信息更新成功回调
    reduceUpdateContractService(state, { payload }) {
      const { isUpdateContractServiceCallback } = payload;
      return { ...state, isUpdateContractServiceCallback };
    },
  },
}
