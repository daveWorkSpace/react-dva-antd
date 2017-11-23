//新手指南
module.exports = {
  path: 'guide',
  childRoutes: [
    //介绍
    {
      path: 'introduce',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/introduce'));
        })
      },
    },
    //文档
    // {
    //   path: 'document',
    //   getComponent: (location, callback) => {
    //     require.ensure([], (require) => {
    //       callback(null, require('./pages/document'));
    //     })
    //   },
    // },
    {
      path: 'greenhands',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/greenHands'));
        })
      },
    },
    {
      path: 'newbusiness',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/newBusiness'));
        })
      },
    },

  ],
}
