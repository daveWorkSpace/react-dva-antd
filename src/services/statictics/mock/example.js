'use strict';
const qs = require('qs');

const [
  areas,
  employees,
  couriers,
  partners,
  statictics,
  business_circle,
  compass,
  monito,
  monito_state
] = [
  require('./mockDatas/areas.js'),
  require('./mockDatas/employees.js'),
  require('./mockDatas/couriers.js'),
  require('./mockDatas/partners.js'),
  require('./mockDatas/statictics.js'),
  require('./mockDatas/business_circle.js'),
  require('./mockDatas/compass.js'),
  require('./mockDatas/monito.js'),
  require('./mockDatas/monito_state.js')

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

    //let [_body,_query] = [qs.parse(req.body),qs.parse(req.query)];
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
    let _result = query('id', qs.parse(req.query).id,statictics);
    setTimeout(function () { res.json(_result); }, 500);
  },
  'GET /areas/find/': function (req, res) {
    let _result = business_circle
    setTimeout(function () { res.json(_result); }, 500);
  },
  'GET /compass/': function (req, res) {
    let _result = query('compass_id', qs.parse(req.query).id, compass);
    setTimeout(function () { res.json(_result); }, 500);
  },
  'GET /monito/': function (req, res) {
    let _result = query('monito_id', qs.parse(req.query).id, monito);
    setTimeout(function () { res.json(_result); }, 500);
  },
  'GET /monito/find/': function (req, res) {
    let _result = query('monito_state_id', qs.parse(req.query).id, monito_state);
    setTimeout(function () { res.json(_result); }, 500);
  }
};
