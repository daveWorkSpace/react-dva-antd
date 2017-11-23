const createData = require('./createDatas.js');
const data =  {
            id:'12334',
            pay_date: '2016-8-9',
            pay_way: '使用微信扫码充值',
            pay_count: '500.00元',
            cut_payment: '充值',
            payment_state:'交易成功',
            payment_detail:'详情'
  }
module.exports = createData(data);
