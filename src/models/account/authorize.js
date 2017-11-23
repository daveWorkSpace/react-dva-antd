import is from 'is_js';
import { hashHistory, routerRedux } from 'dva/router';
import { message } from 'antd';
import {
  sendRegisterSms,
  sendLoginSms,
  accountLogin,
  accountRegister,
  exchangeAuth,
  fetchVendors,
  fetchVendorInfo,
  fetchAccountInfo,
} from 'aoao-core-api-service/lib/account';

import { geography, authorize } from '../../application';
import { Modules, Roles, Errors } from '../../application/define';
import { Auth, Account, List, Vendor } from '../../application/object'

//TODO: 服务器在用户数据中，更新成对应角色即可
const mockRole = Roles.superman;
// const mockRole = Roles.areaManager;
// const mockRole = Roles.tester;

module.exports = {
  namespace: 'AccountAuthorize',
  state: {
    loginSmsCode: '',         //登陆的手机验证码
    registerSmsCode: '',      //注册的手机验证码
    vendors: [],              //服务商列表
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
      });
    },
  },

  effects: {

    // 注册
    * register({ payload }, { call, put }) {
      const { mobile, verifyCode, name, cityCode, cityName, legalName } = payload

      //注册，获取授权信息
      const authResponse = yield call(accountRegister, mobile, verifyCode, name, cityCode, cityName, legalName);
      if (is.truthy(authResponse.error) && is.not.empty(authResponse.data)) {
        message.error(`授权失败 : ${Errors.message(authResponse.error)}`);
        return;
      }

      //TODO: mock Role
      const mockAuthInfo = authResponse.data;
      mockAuthInfo.role = mockRole;
      authorize.auth = Auth.mapper(mockAuthInfo);

      //保存授权信息
      // authorize.auth = authResponse.data;
      authorize.vendors = [];

      //获取账户信息并自动跳转
      const params = {
        accountId: authResponse.data.account_id,
        vendorId: authResponse.data.vendor_id,
      }
      yield put({ type: 'fetchAccount', payload: params });
    },

    //登陆
    * login({ payload }, { call, put }) {
      //请求登陆授权接口
      const { mobile, verifyCode } = payload;
      const authResponse = yield call(accountLogin, mobile, verifyCode);
      if (is.truthy(authResponse.error) && is.not.empty(authResponse.data)) {
        message.error(`授权失败 : ${Errors.message(authResponse.error)}`);
        return;
      }

      //获取服务商列表
      const vendorsResponse = yield call(fetchVendors, mobile);
      if (is.truthy(vendorsResponse.error) && is.not.empty(vendorsResponse.data)) {
        message.error(`获取服务商账户列表失败 : ${Errors.message(vendorsResponse.error)}`);
        return;
      }

      //TODO: mock Role
      const mockAuthInfo = authResponse.data;
      mockAuthInfo.role = mockRole;
      authorize.auth = Auth.mapper(mockAuthInfo);

      //保存全局变量
      authorize.vendors = vendorsResponse.data

      //判断，如果当前的服务商列表数据多于一条，则跳转到用户选择授权的页面选择
      if (vendorsResponse.data.length !== 1) {
        message.success('登陆成功');
        setTimeout(() => { window.location.href = '/#/authorize/auth'; }, 1000);
        return;
      }

      //获取账户信息并自动跳转
      const params = {
        accountId: authorize.auth.accountId,
        vendorId: authorize.auth.vendorId,
      }
      yield put({ type: 'fetchAccount', payload: params });
    },

    //授权账户
    * auth({ payload }, { call, put }) {
      const { vendorId } = payload;
      //判断参数
      if (!vendorId || vendorId.length !== 24) {
        message.error('服务商ID错误，无法获取账户信息');
        return;
      }

      //获取授权信息
      const authResponse = yield call(exchangeAuth, vendorId);
      if (is.truthy(authResponse.error) && is.not.empty(authResponse.data)) {
        message.error(`授权失败 : ${Errors.message(authResponse.error)}`);
      }

      //TODO: mock Role
      const mockAuthInfo = authResponse.data;
      mockAuthInfo.role = mockRole;
      authorize.auth = Auth.mapper(mockAuthInfo);

      //获取账户信息并自动跳转
      const params = {
        accountId: authorize.auth.accountId,
        vendorId: authorize.auth.vendorId,
      }
      yield put({ type: 'fetchAccount', payload: params });
    },

    //获取账户数据
    * fetchAccount({ payload }, { call, put }) {
      //获取当前账户的账户信息和服务商信息
      const { accountId, vendorId } = payload;

      //获取服务商信息
      const vendorResponse = yield call(fetchVendorInfo, vendorId);
      if (is.truthy(vendorResponse.error) && is.not.empty(vendorResponse.data)) {
        message.error(`获取服务商信息失败 : ${Errors.message(vendorResponse.error)}`);
        return;
      }

      //获取账号信息
      const accountResponse = yield call(fetchAccountInfo, accountId);
      if (is.truthy(accountResponse.error) && is.not.empty(accountResponse.data)) {
        message.error(`获取账号信息失败 : ${Errors.message(accountResponse.error)}`);
        return;
      }

      //保存服务商信息
      authorize.vendor = Vendor.mapper(vendorResponse.data);
      //保存账户信息
      authorize.account = Account.mapper(accountResponse.data);

      //跳转到用户选择授权的页面
      setTimeout(() => {
        window.location.href = Modules.getPath(Modules.accountVendorProfile);
        window.location.reload()
      }, 1000);
    },

    //获取授权列表数据
    * fetchVendors({ payload }, { call, put }) {
      const { mobile } = payload
      const response = yield call(fetchVendors, mobile);

      //判断请求是否错误
      if (is.truthy(response.error)) {
        message.error(`获取服务商账户列表失败 : ${Errors.message(response.error)}`);
        return;
      }

      const params = {
        vendors: response.data,  //授权账号的列表
      }

      yield put({ type: 'reduceVendors', payload: params });
    },

    //获取登录验证码
    * sendLoginSms({ payload }, { call, put }) {
      const { mobile } = payload;
      const response = yield call(sendLoginSms, mobile);

      //判断请求是否错误
      if (is.truthy(response.error)) {
        message.error(`验证码发送失败 : ${Errors.message(response.error)}`);
        return;
      }
      message.success('验证码发送成功');

      yield put({
        type: 'reduceLoginCode',
        payload: {
          loginSmsCode: response.data.code,  //发送成功的验证码
        },
      });
    },

    //获取注册验证码
    * sendRegisterSms({ payload }, { call, put }) {
      const { mobile } = payload;
      const response = yield call(sendRegisterSms, mobile);

      //判断请求是否错误
      if (is.truthy(response.error)) {
        message.error(`验证码发送失败 : ${Errors.message(response.error)}`);
        return;
      }
      message.success('验证码发送成功');

      yield put({
        type: 'reduceRegisterSmsCode',
        payload: {
          registerSmsCode: response.data.code,  //发送成功的验证码
        },
      });
    },

  },

  reducers: {

    reduceVendors(state, { payload }) {
      const { vendors } = payload;
      return { ...state, vendors };
    },

    reduceLoginCode(state, { payload }) {
      const { loginSmsCode } = payload;
      return { ...state, loginSmsCode };
    },

    reduceRegisterSmsCode(state, { payload }) {
      const { registerSmsCode } = payload;
      return { ...state, registerSmsCode };
    },
  },
}
