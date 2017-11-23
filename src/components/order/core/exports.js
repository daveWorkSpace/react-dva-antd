

//订单页面常用参数
const OrderParams = {
  rgReg: /\-/g,
  requestPagerSize: 20,   //size
  requestPageNumber: 1,   //默认页码
};

//结算方式（订单支付方式）
const PayType = {
  cash: 1,          //现金
  balance: 2,       //余额
  afterPayment: 3,  //后付费

  //使用初始化
  description(rawValue) {
    switch (rawValue) {
      case this.cash:
        return '现金';
      case this.balance:
        return '余额';
      case this.afterPayment:
        return '后付费';
      default:
        return '未知';
    }
  },
};

//订单状态（分单状态）
const OrderState = {
  //本地状态
  total: 9999,    //总数 = 已创建 + 已确认 + 配送中 + 已完成 + 已关闭 + 异常
  undone: 9998,   //未完成 = 总数 - 已关闭 - 已完成

  //服务器状态
  created: 1,     //已创建
  confirmed: 25,  //已确认
  shipping: 50,   //配送中
  done: 100,      //已完成 （已送达）
  closed: -100,   //已关闭 （已取消）
  error: -50,     //异常

  //使用初始化
  description(rawValue) {
    switch (rawValue) {
      case this.total:
        return '总订单';
      case this.undone:
        return '未完成';
      case this.created:
        return '已创建';
      case this.confirmed:
        return '已确认';
      case this.shipping:
        return '配送中';
      case this.done:
        return '已完成';
      case this.closed:
        return '已关闭';
      case this.error:
        return '异常';
      default:
        return '未知';
    }
  },
};

//订单列表状态
const OrderListState = {
  total: 8888,          //总订单
  confirmed: 25,        //已确认 ＊
  done: 100,            //已完成 ＊
  unDistribution: 10,   //待分配 ＊
  distribution: 50,     //配送中 ＊
  exception: -50,       //异常   ＊
  canceled: -100,       //已取消 ＊
  created: 1,           //已创建 ＊
  completeRate: 0.88,   //成功率

  //使用初始化
  description(rawValue) {
    switch (rawValue) {
      case this.total:
        return 'total';
      case this.undone:
        return 'undone';
      case this.created:
        return 'created';
      case this.done:
        return 'done';
      case this.unDistribution:
        return 'unDistribution';
      case this.distribution:
        return 'distribution';
      case this.exception:
        return 'exception';
      case this.canceled:
        return 'canceled';
      case this.completeRate:
        return 'completeRate';
      default:
        return 'other';
    }
  },
};

//枚举方法－－－公共
const OrderStatisticsState = {
  total: 8888,          //总订单
  confirmed: 25,        //已确认 ＊
  done: 100,            //已完成 ＊
  unDistribution: 10,   //待分配
  distribution: 50,     //配送中
  exception: -50,       //异常
  canceled: -100,       //已取消 ＊
  undone: 0,            //未完成
  created: 1,           //已创建 ＊
  completeRate: 0.88,   //成功率

  //使用初始化
  description(rawValue) {
    switch (rawValue) {
      case this.total:
        return '总订单';
      case this.created:
        return '已创建';
      case this.confirmed:
        return '已确认';
      case this.undone:
        return '未完成';
      case this.done:
        return '已送达';
      case this.unDistribution:
        return '待分配';
      case this.distribution:
        return '配送中';
      case this.exception:
        return '异常';
      case this.canceled:
        return '已取消';
      case this.completeRate:
        return '完成率';
      default:
        return '其他';
    }
  },
};
//计算完成率
const OrderStatistics = (method, text, record) => {
  /*if (dataSource && dataSource.length > 0) {
    dataSource.forEach((item,index)=>{

    })
  }
  //总订单
  const getTotalNumber: () => {

  };
  //未完成
  const getUndoneNumber: (text, record) => {
   //总数:   ＊＊总数为0
   const totalNum = record.order_count ? record.order_count : 0;
   //已完成: ＊＊完成数为0
   const doneNum = text[OrderListState.done] ? text[OrderListState.done] : 0;
   //完成率：＊＊总数为0
   const rate = totalNum !== 0 ? doneNum / totalNum : 0;
   let completeRate = rate * 100;
   //取两位小数
   completeRate = `${completeRate.toFixed(2).toString()}%`;
   return completeRate && completeRate;
  };
  //完成率
  const getCompleteRate: (text, record) => {
   //总数:   ＊＊总数为0
   const totalNum = record.order_count ? record.order_count : 0;
   //已完成: ＊＊完成数为0
   const doneNum = text[OrderListState.done] ? text[OrderListState.done] : 0;
   //完成率：＊＊总数为0
   const rate = totalNum !== 0 ? doneNum / totalNum : 0;
   let completeRate = rate * 100;
   //取两位小数
   completeRate = `${completeRate.toFixed(2).toString()}%`;
   return completeRate && completeRate;
  };*/
};

module.exports.OrderParams = OrderParams;
module.exports.PayType = PayType;
module.exports.OrderState = OrderState;
module.exports.OrderListState = OrderListState;
module.exports.OrderStatisticsState = OrderStatisticsState;
