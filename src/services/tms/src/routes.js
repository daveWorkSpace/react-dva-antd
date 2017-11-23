
const subRoutes = [
  {
    path: 'control_panel',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('./pages/control_panel'));
      })
    },
  },{
    path: 'control_panel/detail',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('./pages/control_panel/detail'));
      })
    },
  }
];
module.exports = {
  path: 'tms',
  childRoutes: subRoutes
}
