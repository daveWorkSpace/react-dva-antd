module.exports = {
  path: 'authorize/:route',
  getComponent: (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../../components/account/authorize'));
    });
  },
}
