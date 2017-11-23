const subRoutes = [
  //商家管理
  {
    path: 'seller',
    childRoutes: [{
      path: 'list',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/seller/list'));
        })
      },
    }, {
      path: 'list/edit',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/seller/list/edit'));
        })
      },
    }, {
      path: 'list/detail',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/seller/list/detail'));
        })
      },
    }, {
      path: 'list/check',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/seller/list/check'));
        })
      },
    },
    ],
  },
];
module.exports = {
  path: 'business',
  childRoutes: subRoutes,
}
