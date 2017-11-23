
const subRoutes = [
  //商家列表
  {
    path: 'order/seller',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('./pages/seller'));
      })
    },
  },

];

module.exports = {
  path: 'operation',
  childRoutes: subRoutes,
};
