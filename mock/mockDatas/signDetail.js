
const createData = require('./createDatas.js');
const data ={
    "id":"82hdfwr2r9dshif92",
    "shipping_time_interval" : 120,
    "seller_id" : "57e6093c421aa9d424478b4b",
    "operator_id" :"57e6093c421aa9d424478b55",
    "operate_time_span" : [
      "00:00",
      "24:00"
    ],
    "vendor_id":"57e60901421aa9d424478b12",
    "unsigned_at": "2016-09-24T05:30:39.145Z",
    "updated_at":"2016-11-03T07:04:17.291Z",
    "verify_note" : null,
    "state" : 100,
    "verify_at" : "2016-09-24T05:30:39.145Z",
    "service_id" : "57e60e25421aa9d424478c70",
    "shipping_time_interval_unit" : "分钟",
    "created_at" : "2016-09-24T05:30:39.145Z",
    "delivery_time" : 120,
    "biz_time" : [
      "09:00",
      "22:00"
    ],
    "shipping_fee_vendor_rate" : 30,
    "tip_fee_vendor_rate" : 0,
    "plan_type" : 21,
    "biz_mode" : 10,
    "shipping_fee_courier_rate" : 70,
    "price_mode" : 2,
    "tip_fee_courier_rate" : 100,
    "price_plan" : [
      {
        "ext_distance" : 1000,
        "time_span" : [
          "09:00",
          "12:00"
        ],
        "ext_price" : 0,
        "max_distance" : 3000,
        "min_distance" : 0,
        "base_price" : 500
      },
      {
        "ext_distance" : 1000,
        "time_span" : [
          "12:00",
          "22:00"
        ],
        "ext_price" : 0,
        "max_distance" : 5000,
        "min_distance" : 3000,
        "base_price" : 1000
      }
    ]
  }

// module.exports = createData(data);
module.exports = data;
