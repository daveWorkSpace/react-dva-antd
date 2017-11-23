//404
module.exports =
{
  path: '*',
  getComponent: (location, callback) => {
    require.ensure([], (require) => {
        /*eslint import/no-unresolved: [2, { caseSensitive: false }]*/
      callback(null, require('../../components/interface/components/notFind'));
    })
  },
};
