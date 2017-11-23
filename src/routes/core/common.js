//common
module.exports =
//公共页面
{
  path: 'common/interface',
  getComponent: (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../../components/common/interface'));
    })
  },
};
