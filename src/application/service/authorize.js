import is from 'is_js';
import dot from 'dot-prop';
import Storage from '../library/storage';
import Router from './router';

class Authorize {
  constructor() {
    //授权信息
    this._auth = new Storage('aoao.app.authorize', { container: 'auth' });
    //服务商信息
    this._vendor = new Storage('aoao.app.authorize', { container: 'vendor' });
    //服务商列表
    this._vendors = new Storage('aoao.app.authorize', { container: 'vendors' });
    //账户信息
    this._account = new Storage('aoao.app.authorize', { container: 'account' });
  }

  get auth() {
    return this._auth.data;
  }

  set auth(info) {
    //保存用户信息
    this._auth.set(info);
  }

  get vendor() {
    return this._vendor.data;
  }

  set vendor(info) {
    this._vendor.set(info);
  }

  get vendors() {
    return this._vendors.data;
  }

  set vendors(info) {
    this._vendors.set(info);
  }

  get account() {
    return this._account.data;
  }

  set account(info) {
    this._account.set(info);
  }

  get routes() {
    const role = dot.get(this.auth, 'role.value');
    return Router.getRouterByRole(role);
  }

  //判断是否登陆
  isLogin() {
    if (is.not.empty(this._account.data)
    && is.not.empty(this._auth.data)
    && is.not.empty(this._vendor.data)
    && is.existy(this._account.data)
    && is.existy(this._auth.data)
    && is.existy(this._auth.data.accountId)
    && is.existy(this._auth.data.accessToken)
    && is.existy(this._vendor.data)) {
      return true;
    }
    return false;
  }

  //是否已经获取到授权信息
  isAuth() {
    return !!((
      is.not.empty(this._auth.data)
      && is.existy(this._auth.data)
      && is.not.empty(this._vendors.data)
      && is.existy(this._vendors.data)
    ));
  }

  //判断模块是否可以被访问
  isAccess(path) {
    const role = dot.get(this.auth, 'role.value');
    return Router.isAccess(this.routes, path, role);
  }

  //清空数据
  clear() {
    this._auth.clear();
    this._vendor.clear();
    this._account.clear();

    //TODO:临时做兼容清除
    window.sessionStorage.clear();
    //清除全部缓存
    window.localStorage.clear();
  }

  debug() {
    const storage = new Storage('aoao.app.authorize');
    console.log('storage', storage);
    console.log('this.auth', this.auth);
    console.log('this.routes', this.routes);
    console.log('this.vendor', this.vendor);
    console.log('this.vendors', this.vendors);
    console.log('this.account', this.account);
    console.log('isAuth', this.isAuth());
    console.log('isLogin', this.isLogin());
  }
}

module.exports = Authorize
