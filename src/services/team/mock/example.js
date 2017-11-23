'use strict';
const qs = require('qs');

const [
  areas,
  employees,
  couriers,
  partners
] = [
  require('./mockDatas/areas.js'),
  require('./mockDatas/employees.js'),
  require('./mockDatas/couriers.js'),
  require('./mockDatas/partners.js'),
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
  'POST /sms/send': function (req, res) {
    setTimeout(function () { res.json({
      success: true,
      data: {
        verify_code: '4321'
      },
      page: {
        total: 3,
        current:1,
      }
    }); }, 500);
  },
  'POST /qiniu/tokens/': function (req, res) {
    setTimeout(function () { res.json({
      success: true,
      data: {
        token: '44223311'
      },
      page: {
        total: 3,
        current:1,
      }
    }); }, 500);
  },
  'POST /assets/': function (req, res) {
    setTimeout(function () { res.json({
      success: true,
      data: { url: '/assetssa/12323' },
      page: { total: 3, current:1, }
    }); }, 500);
  }
};
