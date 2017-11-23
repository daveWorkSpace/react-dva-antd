'use strict';
const qs = require('qs');

const [areas,sign,signDetail,shipment_down,shipment_down_file_url,
  shipment_down_file_url22,
  shipment_down_file_url33
] = [
        require('./mockDatas/areas.js'),
        require('./mockDatas/sign.js'),
         require('./mockDatas/signDetail.js'),
         require('./mockDatas/shipment_down.js'),
  require('./mockDatas/shipment_down_file_url.js'),
  require('./mockDatas/shipment_down_file_url22.js'),
  require('./mockDatas/shipment_down_file_url33.js'),

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
    _meta: {
      has_more: true,
      result_count:50,
    }
  };
};

//let [_body,_query] = [qs.parse(req.body),qs.parse(req.query)];
module.exports = {

  'GET /areas/': function (req, res) {
    let _result = query('id', qs.parse(req.query).id, areas);
    setTimeout(function () { res.json(_result); }, 500);
  },

  'GET /contracts/': function (req, res) {
    let _result = query('id', qs.parse(req.query).id, sign);
    setTimeout(function () { res.json(_result); }, 500);
  },

  'GET /contracts/82hdfwr2r9dshif92/': function (req, res) {
    let _result = query('id', qs.parse(req.query).id, signDetail);
    setTimeout(function () { res.json(_result); }, 500);
  },
    'GET /reports/shipments/daily/by_vendor/': function (req, res) {
      let _result = query('id', qs.parse(req.query).id, shipment_down);
      setTimeout(function () { res.json(_result); }, 500);
    },

'GET /reports/download_file/': function (req, res) {
  let _result = query('id', qs.parse(req.query).id, shipment_down_file_url);
  setTimeout(function () { res.json(_result); }, 500);
},
  //
  // 'GET /reports/download_file/': function (req, res) {
  //   let _result = query('id', qs.parse(req.query).id, shipment_down_file_url22);
  //   setTimeout(function () { res.json(_result); }, 500);
  // },
  //
  // 'GET /reports/download_file/': function (req, res) {
  //   let _result = query('id', qs.parse(req.query).id, shipment_down_file_url33);
  //   setTimeout(function () { res.json(_result); }, 500);
  // },


  'POST /contracts/82hdfwr2r9dshif92/': function (req, res) {
    let _result = {ok: true};
    setTimeout(function () { res.json(_result); }, 500);
  },

};
