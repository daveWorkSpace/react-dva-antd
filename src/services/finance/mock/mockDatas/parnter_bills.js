const createData = require('./createDatas.js');
const data = {
      "id":"82h34dfddswr2r9dshif121292",
      "date":"2016-4-07",
      "name":"戈兵",
      "business_circle":"酒仙桥",
      "orders":"110000",
      "order_amount":"100",
      "packing_fee":5,
      "commission":3,
      "settlement_amount":108,
      "actual_amount":108,
      "check_state":true,
      "check_date":"2016-6-8",
      "operation":'对账'

  };
module.exports = createData(data);
