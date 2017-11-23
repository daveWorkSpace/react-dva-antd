'use strict';
const qs = require('qs');

const [ parnter_bills] = [
  require('./mockDatas/parnter_bills.js'),
];
function query(field,id,datas){
  let _result = null;
  if (id) {
    for (let data of datas) {
      if(data[field] === id) {
        _result = data;
        break;
      };
    };
  } else {
    _result = datas;
  };
  return {
    success: true,
    data: _result,
    page: {
      total: 3,
      current:1,
    }
  };

};


module.exports = {
  'GET /parnter/': function (req, res) {
    let _result = query('id', qs.parse(req.query).id, parnter_bills);
    setTimeout(function () { res.json(_result); }, 500);
  }
};
