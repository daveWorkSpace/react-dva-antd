const subRoutes = [
  {
    path: 'compass',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('./pages/compass'));
      })
    },
  },
  {
    path: 'monito',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('./pages/monito'));
      })
    },
  },
  {
    path: 'shipments_detail',
    childRoutes: [{
      path: 'list',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/shipments_detail/list'));
        })
      },
    }, {
      path: 'list/detail',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/shipments_detail/list/detail'));
        })
      },
    }],
  },
  {
    path: 'shipments_detail_down',
    childRoutes: [{
      path: 'list',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/shipments_detail_down/list'));
        })
      },
    }, {
      path: 'list/detail',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/shipments_detail_down/list/detail'));
        })
      },
    }],
  },
  {
    path: 'shipments_area',
    childRoutes: [{
      path: 'list',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/shipments_area/list'));
        })
      },
    }, {
      path: 'list/detail',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/shipments_area/list/detail'));
        })
      },
    }],
  },
  {
    path: 'shipments_seller',
    childRoutes: [{
      path: 'list',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/shipments_seller/list'));
        })
      },
    }, {
      path: 'list/detail',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/shipments_seller/list/detail'));
        })
      },
    }],
  },
  {
    path: 'shipments_courier',
    childRoutes: [{
      path: 'list',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/shipments_courier/list'));
        })
      },
    }, {
      path: 'list/detail',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/shipments_courier/list/detail'));
        })
      },
    }],
  },
];
module.exports = {
  path: 'statictics',
  childRoutes: subRoutes,
}
