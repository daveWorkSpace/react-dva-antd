module.exports = {
  path: 'account',
  childRoutes: [
    //账户相关 - 服务商信息
    {
      path: 'vendor/profile',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('../../components/account/vendor/profile'));
        })
      },
    },
    //账户相关 - 服务商信息 编辑
    {
      path: 'vendor/edit',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('../../components/account/vendor/edit'));
        })
      },
    },
    //账户相关 - 账户信息
    {
      path: 'profile',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('../../components/account/profile'));
        })
      },
    },
  ],
}
