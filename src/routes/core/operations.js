//运营管理
const subRoutes = [
  //运营管理 - 运力订单查询
  {
    path: 'search',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('../../components/operations/search/index'));
      })
    },
  },
  //运营管理 - 运力订单查询
  {
    path: 'details',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('../../components/operations/search/details'));
      })
    },
  },
  //运营管理 - 运力订单明细下载
  {
    path: 'download/day',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('../../components/operations/download/day'));
      })
    },
  },
];

module.exports = {
  path: 'operations',
  childRoutes: subRoutes,
}
