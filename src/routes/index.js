import { authorize } from '../application'
import routerHelper from '../utils/routerHelper';
import { Modules } from '../application/define'

const routes = {
  path: '/',
  //TODO: 因为原始布局和开发的原因，初始化布局和权限判断会混到一起，后续的模版布局和权限判断要独立分开
  getComponent: (nextState, callback) => {
    const pathname = nextState.location.pathname
    // console.log(`pathname ${pathname}`);

    //如果未登录，并且地址判断失败
    if (authorize.isLogin() !== true) {
      callback();
      return
    }

    //修复onEnter不调用的问题
    if (routerHelper.isRedirctToDashboard(pathname)) {
      window.location.href = Modules.getPath(Modules.accountInfo);
      return;
    }

    //判断是否有权限访问模块，如果没有则直接跳转到404
    if (authorize.isAccess(pathname) === false) {
      //如果已经登陆，则跳转到404页面，如果为登陆，则跳转到登陆页
      window.location.href = Modules.getPath(Modules.commonNotFind);
      return;
    }

    //加载后台框架的布局
    callback(null, require('../components/interface/layout'))
  },
  onEnter: routerHelper.redictWithAuthCheck,
  childRoutes: [
    require('./core/authorize.js'),
  ],
};

//判断用户是否登陆，如果未登陆，则不添加路由
if (authorize.isLogin() === true) {
  routes.childRoutes = routes.childRoutes.concat([
    require('./core/common.js'),
    require('./core/account.js'),
    require('./core/business.js'),
    require('./core/dispatcher.js'),
    require('./core/order.js'),
    require('./core/operations.js'),
    require('../services/business/src/routes'),
    require('../services/statictics/src/routes'),
    require('../services/team/src/routes'),
    require('../services/tms/src/routes'),
    require('../services/finance/src/routes'),
    require('../services/guide/routes'),
    require('../services/operation/src/routes'),
  ]);
}

//错误处理的路由
routes.childRoutes.push(require('./core/error.js'));

export default routes;
