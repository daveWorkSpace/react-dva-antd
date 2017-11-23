'use strict';
const qs = require('qs');

const [
  areas,
  employees,
  couriers,
  partners,
  shimpents
] = [
  require('./mockDatas/areas.js'),
  require('./mockDatas/employees.js'),
  require('./mockDatas/couriers.js'),
  require('./mockDatas/partners.js'),
  require('./mockDatas/shipments.js'),
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
  'GET /areas/': function (req, res) {
    let _result = query('id', qs.parse(req.query).id, areas);
    setTimeout(function () { res.json(_result); }, 500);
  },
  'GET /accounts/': function (req, res) {
    let _result = query('code', qs.parse(req.query).id, employees);
    setTimeout(function () { res.json(_result); }, 500);
  },
  'GET /couriers/': function (req, res) {
    let _result = query('courier_id', qs.parse(req.query).id, couriers);
    setTimeout(function () { res.json(_result); }, 500);
  },
  'GET /sellers/': function (req, res) {
    let _result = query('seller_id', qs.parse(req.query).id,partners);
    setTimeout(function () { res.json(_result); }, 500);
  },
  'GET /shipments/': function (req, res) {
    let _result = query('id', qs.parse(req.query).id,shimpents);
    setTimeout(function () { res.json(_result); }, 500);
  },
};
