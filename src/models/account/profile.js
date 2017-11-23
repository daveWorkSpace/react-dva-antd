import is from 'is_js';
import { message } from 'antd';
import {
  fetchVendorInfo,
  fetchAccountInfo,
  requestVerify,
  updateVendorVerifyInfo,
} from 'aoao-core-api-service/lib/account';

import { qiniu_tokens, assets, qiniu_upload } from 'aoao-core-api-service/lib/public.js';

import { authorize } from '../../application';
import { Modules, Errors } from '../../application/define';
import { Account, Vendor } from '../../application/object'

module.exports = {
  namespace: 'AccountProfile',
  state: {
    isUploadSuccess: false,           //上传验证账户的图片信息
    isSubmitVerify: false,            //提交验证信息
    isUpdateVendorVerifyInfo: false,  //是否更新服务商验证信息
    vendor: '',                       //服务商信息
    account: '',                      //账户信息
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        //账户信息&商家信息页面
        if (Modules.equalPath(Modules.accountProfile, pathname) ||
            Modules.equalPath(Modules.accountVendorEdit, pathname) ||
            Modules.equalPath(Modules.accountVendorProfile, pathname)) {
          dispatch({ type: 'fetchAccount', payload: { accountId: authorize.account.id } });
          dispatch({ type: 'fetchVendor', payload: { vendorId: authorize.vendor.id } });
        }
      });
    },
  },

  effects: {
    //获取账户数据
    * fetchAccount({ payload }, { call, put }) {
      //获取当前账户的账户信息
      const { accountId } = payload;

      //获取账号信息
      const response = yield call(fetchAccountInfo, accountId);
      if (is.truthy(response.error) && is.not.empty(response.data)) {
        message.error(`获取账号信息失败 : ${Errors.message(response.error)}`);
        return;
      }

      //保存账户信息
      authorize.account = Account.mapper(response.data);

      yield put({ type: 'reduceAccount', payload: { account: authorize.account } });
    },

    //获取服务商数据
    * fetchVendor({ payload }, { call, put }) {
      //获取当前账户的服务商信息
      const { vendorId } = payload;

      //获取服务商信息
      const response = yield call(fetchVendorInfo, vendorId);
      if (is.truthy(response.error) && is.not.empty(response.data)) {
        message.error(`获取服务商信息失败 : ${Errors.message(response.error)}`);
        return;
      }

      //保存服务商信息
      authorize.vendor = Vendor.mapper(response.data);

      yield put({ type: 'reduceVendor', payload: { vendor: authorize.vendor } });
    },

    //服务商提交审核
    * requestVerify({ payload }, { call, put }) {
      const { vendorId, accountId, idCardSn } = payload;
      const response = yield call(requestVerify, { vendorId, idCardSn });

      if (is.truthy(response.error) && is.not.empty(response.data)) {
        message.error(`服务商提交审核 : ${Errors.message(response.error)}`);
        return;
      }

      message.success('信息已提交，后台审核中');

      yield put({
        type: 'reduceVerifyState',
        payload: { isSubmitVerify: true },
      });

      //更新账户信息和服务商信息
      yield put({ type: 'fetchAccount', payload: { accountId } });
      yield put({ type: 'fetchVendor', payload: { vendorId } });
    },

    //更新服务商验证信息
    * updateVendorVerifyInfo({ payload }, { call, put }) {
      const { vendorId, accountId, idCardSn, name, ownerName } = payload;
      const response = yield call(updateVendorVerifyInfo, { vendorId, idCardSn, name, ownerName });

      if (is.truthy(response.error) && is.not.empty(response.data)) {
        message.error(`审核信息提交失败 : ${Errors.message(response.error)}`);
        return;
      }

      message.success('审核信息提交成功');

      yield put({
        type: 'reduceUpdateVendorVerifyState',
        payload: { isUpdateVendorVerifyInfo: true },
      });

      //更新账户信息和服务商信息
      yield put({ type: 'fetchAccount', payload: { accountId } });
      yield put({ type: 'fetchVendor', payload: { vendorId } });
    },

    // 上传资质审核图片
    * uploadVerifyImage(params, { call, put }) {
      const { assetType, file, vendorId, accountId } = params.payload;
      if (['image/png', 'image/jpg', 'image/jpeg'].indexOf(file.type) === -1) {
        message.error('文件格式不对, 请上传png/jpg格式图片！');
        return;
      }

      if (file.size / 1024 > 1024) {
        message.error('图片尺寸过大, 请重新上传！');
        return;
      }

      //获取图片信息
      const assetInfo = {
        size: file.size,
        mime: file.type,
      };

      const reader = new FileReader();
      reader.onload = function (e) {
        const data = e.target.result;
        //加载图片获取图片真实宽度和高度
        const image = new Image();
        image.onload = function () {
          Object.assign(assetInfo, { width: image.width, height: image.height });
        };
        image.src = data;
      };

      reader.readAsDataURL(file);
      const resultToken = yield call(qiniu_tokens, {
        asset_type: assetType,
        target_type: 1,
        target_id: vendorId,
      });
      if (resultToken.err) {
        message.error('获取上传token失败！');
        return;
      }

      //上传七牛
      const { path, token } = resultToken.data;
      const uploadData = new FormData();
      uploadData.append('token', token);
      uploadData.append('key', path);
      uploadData.append('file', file);
      const resultUpload = yield call(qiniu_upload, uploadData);
      if (resultUpload.err) {
        message.error('图片上传失败！');
        return;
      }
      //资源持久化
      const resultAssets = yield call(assets, {
        asset_type: assetType,
        path,
        target_type: 1,
        target_id: vendorId,
        asset_info: assetInfo,
      });
      if (resultAssets.err) {
        message.error('更新图片失败！');
        return;
      }

      //获取服务商信息
      const response = yield call(fetchVendorInfo, vendorId);
      if (is.truthy(response.error) && is.not.empty(response.data)) {
        message.error(`获取服务商信息失败 : ${Errors.message(response.error)}`);
        return;
      }

      //保存服务商信息
      authorize.vendor = Vendor.mapper(response.data);

      yield put({ type: 'reduceUploadSuccess', payload: { isUploadSuccess: true, vendor: authorize.vendor } });
    },

    //重置上传成功的状态
    * resetUploadVerifyState(params, { call, put }) {
      yield put({ type: 'reduceUpload', payload: { isUploadSuccess: false } });
    },

    // 重置更新成功状态
    * resetUpdateVendorVerifyState(params, { call, put }) {
      yield put({ type: 'reduceUpdateVendorVerifyState', payload: { isUpdateVendorVerifyInfo: false } });
    },
  },

  reducers: {
    reduceVendor(state, { payload }) {
      const { vendor } = payload;
      return { ...state, vendor };
    },

    reduceAccount(state, { payload }) {
      const { account } = payload;
      return { ...state, account };
    },

    reduceUploadSuccess(state, { payload }) {
      const { isUploadSuccess, vendor } = payload;
      return { ...state, isUploadSuccess, vendor };
    },

    reduceUpload(state, { payload }) {
      const { isUploadSuccess } = payload;
      return { ...state, isUploadSuccess };
    },

    reduceVerifyState(state, { payload }) {
      const { isSubmitVerify } = payload;
      return { ...state, isSubmitVerify };
    },

    reduceUpdateVendorVerifyState(state, { payload }) {
      const { isUpdateVendorVerifyInfo } = payload;
      return { ...state, isUpdateVendorVerifyInfo };
    },
  },
}
