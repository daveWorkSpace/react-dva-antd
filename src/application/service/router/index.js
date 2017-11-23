import is from 'is_js';
import _ from 'lodash';

import { getFlatterRoles } from './roleMatcher';
import { Roles, Modules, Router } from '../../define';

//TODO： 用户登陆后，获取角色，通过角色获取路由列表，动态生成。没有权限的模块则不会有对应路由，则不需要进行路由层级的过滤。
// 从机制上避免了路由层多校验一次
class RouterClass {

  //处理路由数据，扩展路由详情和权限数据
  static reduceRouter = (router, role) => {
    const tree = [];
    router.forEach((value, index, objs) => {
      const module = value;

      //获取路由详情数据（提供菜单栏使用）
      module.detail = Modules.getDetail(value.id);

      //判断是否有子级路由
      if (module.routes) {
        //递归处理子级路由数据(递归判断路由数据和权限数据)
        const routes = RouterClass.reduceRouter(module.routes, role);
        module.routes = routes;

        //父级别模块的权限，应该是子模块权限的合集（因为模块的逐级访问形式，父模块如果缺少权限，将会导致子模块缺少访问入口）
        //子模块权限 [子模块A roles:[RoleA], 子模块B roles:RoleB]
        //父模块权限 [父模块 roles:[RoleA,RoleB]]
        const flatRoles = getFlatterRoles(routes, module);
        module.roles = flatRoles;
      }

      //判断如果角色拥有访问权限，则将菜单数据添加到展示结构中
      if (_(module.roles).includes(role)) {
        tree.push(module);
      }
    });
    return tree;
  }

  //根据角色获取路由数据
  static getRouterByRole(role) {
    return RouterClass.reduceRouter(Router, role);
  }

  //判断当前角色和路径是否可以访问
  static isAccess(routes, path, role) {
    //将数组拉平为一维数组
    const deepflat = (e) => {
      return _(e).flatMap((children) => {
        if (children.routes) {
          return _(children).concat(deepflat(children.routes)).value()
        }
        return children;
      }).value();
    }

    //过滤访问权限
    const filterAccess = (e) => {
      //判断路径和访问路径一致，并且拥有访问权限
      return (e.detail.path.replace('/#', '') === path && _(e.roles).includes(role));
    }

    //判断过滤数据后，路由数据存在，则可以访问返回true，反之不可访问，返回false
    return _.chain(deepflat(routes))
    .filter(filterAccess)
    .value().length > 0;
  }
}

module.exports = RouterClass
