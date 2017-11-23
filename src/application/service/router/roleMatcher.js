import _ from 'lodash';

// gets all roles assigned to the current route (passed to the 'authorize' attribute in routing config)
// 合并角色数据为一维数组
export function getFlatterRoles(routeObjects, concatObject) {
  return _.chain(routeObjects)
    .concat(concatObject)
    .filter(item => item.roles)
    .map(item => item.roles)
    .flattenDeep()
    .union()
    .value();
}

// check if any user role matches any allowed role
export function rolesMatched(allowedRoles, userRoles) {
  return _.intersection(allowedRoles, userRoles).length > 0;
}

// checks if allowed roles are exactly the same as user roles
export function rolesMatchedExact(allowedRoles, userRoles) {
  return _.isEqual(allowedRoles, userRoles);
}
