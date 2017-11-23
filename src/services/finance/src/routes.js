const subRoutes = [
  {
    path: 'sellerBills',
    childRoutes: [
      {
        path: 'list',
        getComponent: (location, callback) => {
          require.ensure([], (require) => {
            callback(null, require('./pages/sellerBills/list'));
          })
        },
      }],
  },
];
module.exports = {
  path: 'finance',
  childRoutes: subRoutes,
};
