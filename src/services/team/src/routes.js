
const subRoutes = [
  {
    path: 'employee',
    childRoutes: [{
      path: 'list',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/employee/list/index'));
        })
      },
    }, {
      path: 'list/edit',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/employee/list/form'));
        })
      },
    }, {
      path: 'list/add',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/employee/list/form'));
        })
      },
    }, {
      path: 'list/detail',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/employee/list/detail'));
        })
      },
    }],
  },
  {
    path: 'courier',
    childRoutes: [{
      path: 'list',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/courier/list'));
        })
      },
    }, {
      path: 'list/edit',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/courier/list/edit'));
        })
      },
    }, {
      path: 'list/add',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/courier/list/add'));
        })
      },
    }, {
      path: 'list/detail',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/courier/list/detail'));
        })
      },
    }, {
      path: 'list/check',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/courier/list/check'));
        })
      },
    }],
  },
];
module.exports = {
  path: 'team',
  childRoutes: subRoutes,
};
