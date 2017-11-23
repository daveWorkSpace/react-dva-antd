/**
 * 业务数据类型定义
 */

// 单位类型定义（价格，距离）
const Unit = {
  price: 100,     //价格单位（元）换算／100
  distance: 1000, //距离单位（米）换算／1000
  description(rawValue) {
    switch (rawValue) {
      case this.price: return '元';
      case this.distance: return '千米';
      default: return '未定义';
    }
  },
  //换算价格, 换算成元
  exchangePriceToYuan(price) {
    return price / Unit.price;
  },
  //换算价格, 换算成分
  exchangePriceToCent(price) {
    return price * Unit.price;
  },
  //换算距离, 换算成千米
  exchangeDistanceToKilometre(distance) {
    return distance / Unit.distance;
  },
  //换算距离, 换算成米
  exchangeDistanceToMetre(distance) {
    return distance * Unit.distance;
  },
}

// 性别
const Gender = {
  male: 1,
  female: 2,
  description(rawValue) {
    switch (rawValue) {
      case this.female: return '男';
      case this.male: return '女';
      default: return '未定义';
    }
  },
}

//业务角色类型
const BusinessType = {
  driect: 10,       //直营
  affiliate: 20,    //加盟
  description(rawValue) {
    switch (rawValue) {
      case this.driect: return '直营';
      case this.affiliate: return '加盟';
      default: return '未定义';
    }
  },
}

//业务模式
const BusinessMode = {
  localLife: 10,  //本地生活圈
  noStorage: 20,  //落地配无存储
  storage: 25,    //落地配有存储
  localCity: 30,  //同城快递
  description(rawValue) {
    switch (rawValue) {
      case this.localLife: return '本地生活圈';
      case this.noStorage: return '落地配(无存储)';
      case this.storage: return '落地配(有存储)';
      case this.localCity: return '同城快递';
      default: return '未定义';
    }
  },
}

//配送模式
const DeliveryMode = {
  immediateMode: 10,  //即时达
  scheduleMode: 20,   //预约达
  description(rawValue) {
    switch (rawValue) {
      case this.immediateMode: return '即时达';
      case this.scheduleMode: return '预约达';
      default: return '未定义';
    }
  },
}

//配送类型
const DeliveryType = {
  deliveryBySeller: 10,   //商家发货
  deliveryByStation: 20,  //站点发货
  description(rawValue) {
    switch (rawValue) {
      case this.deliveryBySeller: return '商家发货';
      case this.deliveryByStation: return '站点发货';
      default: return '未定义';
    }
  },
}

//服务状态
const ServiceState = {
  on: 100,      //启用
  off: -100,    //禁用
  draft: 0,      //兼容服务器的草稿状态（禁用）
  description(rawValue) {
    switch (rawValue) {
      case this.on: return '启用';
      case this.off: return '禁用';
      case this.draft: return '禁用';
      default: return '未定义';
    }
  },
}

//区域状态
const AreaState = {
  all: '',    //全部状态
  draft: 0,   //草稿
  on: 100,    //启用
  off: -100,  //禁用
  description(rawValue) {
    switch (rawValue) {
      case this.all:
        return '全部';
      case this.draft:
        return '禁用';
      case this.on:
        return '启用';
      case this.off:
        return '禁用';
      default:
        return '未定义';
    }
  },
}

//定价模式
const PriceMode = {
  standPriceMode: 1,  //一口价
  levelPriceMode: 2,  //阶梯定价
  description(rawValue) {
    switch (rawValue) {
      case this.standPriceMode: return '一口价';
      case this.levelPriceMode: return '阶梯定价';
      default: return '未定义';
    }
  },
}

//定价类型
const PriceType = {
  distanceAndTime: 21,  //距离加时间阶梯价
  distanceAndLevel: 22, //距离阶梯价
  timeAndLevel: 23,     //时间阶梯价
  description(rawValue) {
    switch (rawValue) {
      case this.distanceAndTime: return '距离加时间阶梯价';
      case this.distanceAndLevel: return '距离阶梯价';
      case this.timeAndLevel: return '时间阶梯价';
      default: return '未定义';
    }
  },
}

// 货品类型
const GoodsType = {
  food: 1,          //美食餐饮
  vegetable: 2,     //生鲜蔬菜
  supermarket: 3,   //超市商品
  flower: 4,        //鲜花蛋糕
  other: 5,         //其他
  description(rawValue) {
    switch (rawValue) {
      case this.food: return '美食餐饮';
      case this.vegetable: return '生鲜蔬菜';
      case this.supermarket: return '超市商品';
      case this.flower: return '鲜花蛋糕';
      case this.other: return '其他';
      default: return '未定义';
    }
  },
}

//工作类型
const WorkType = {
  fullTime: 10,   //全职
  partTime: 20,   //兼职
  description(rawValue) {
    switch (rawValue) {
      case this.fullTime: return '全职';
      case this.partTime: return '兼职';
      default: return '未定义';
    }
  },
}

//判区规则
const RegionRule = {
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
  description(rawValue) {
    switch (rawValue) {
      case this.A: return '发货地与收货地均在配送区域内';
      case this.B: return '发货地在配送区域内';
      case this.C: return '收货地在配送区域内';
      case this.D: return '发货地与收货地在同一配送区域内';
      default: return '未定义';
    }
  },
}

//审核状态
const VerifyState = {
  pendingSubmit: 0,
  pendingVerify: 1,
  approve: 100,
  reject: -100,
  description(rawValue) {
    switch (rawValue) {
      case this.pendingSubmit: return '待提交';
      case this.pendingVerify: return '待审核';
      case this.approve: return '通过';
      case this.reject: return '驳回';
      default: return '未定义';
    }
  },
}

// 结算方式
const PaymentType = {
  cash: 1,      //现金
  balance: 2,   //余额
  pay: 3,       //后付费
  description(rawValue) {
    switch (rawValue) {
      case this.cash: return '现金';
      case this.balance: return '余额';
      case this.pay: return '后付费';
      default: return '未定义';
    }
  },
}

//组织类型
const OrganizationType = {
  vendor: 1,    //服务商
  seller: 2,    //商家
  platform: 3,  //平台
  courier: 4,   //骑士
  description(rawValue) {
    switch (rawValue) {
      case this.vendor: return '服务商';
      case this.seller: return '商家';
      case this.platform: return '平台';
      case this.courier: return '骑士';
      default: return '未定义';
    }
  },
}

//服务商订单状态
const VendorOrderState = {
  created: 1,     //已创建
  confirmed: 25,  //已确认
  delivery: 50,   //配送中
  finish: 100,    //异常
  cancle: -100,   //已完成
  expection: -50, //已关闭
  description(rawValue) {
    switch (rawValue) {
      case this.created: return '已创建';
      case this.confirmed: return '已确认';
      case this.delivery: return '配送中';
      case this.expection: return '异常';
      case this.finish: return '已完成';
      case this.cancle: return '已关闭';
      default: return '未定义';
    }
  },
}

//运单状态
const DeliveryOrderState = {
  init: 0,          //临时
  created: 5,       //已创建
  confirmed: 10,    //待分配
  assigned: 15,     //已分配
  pending: 16,      //待接单
  accepted: 20,     //已接单
  arrived: 22,      //已到店
  pickup: 24,       //已取货
  error: -50,       //异常
  done: 100,        //已完成
  closed: -100,     //已关闭
  description(rawValue) {
    switch (rawValue) {
      case this.init : return '临时';
      case this.created : return '已创建';
      case this.confirmed : return '待分配';
      case this.assigned : return '已分配';
      case this.pending : return '待接单';
      case this.accepted : return '已接单';
      case this.arrived : return '已到店';
      case this.pickup : return '已取货';
      case this.error : return '异常';
      case this.done : return '已完成';
      case this.closed : return '已关闭';
      default: return '未定义';
    }
  },
}

// 仓订单状态
const StockOrdersState = {
  created: 1,       //已创建
  entered: 25,      //已确认
  inbound: 30,      //已入站
  distributed: 45,  //已分配
  distributing: 50, //配送中
  completed: 100,   //已完成
  closed: -100,     //已关闭
  exception: -50,   //异常
  description(rawValue) {
    switch (rawValue) {
      case this.created: return '已创建';
      case this.entered: return '已确认';
      case this.inbound: return '已入站';
      case this.distributed: return '已分配';
      case this.distributing: return '配送中';
      case this.completed: return '已完成';
      case this.closed: return '已关闭';
      case this.exception: return '异常';
      default: return '未定义';
    }
  },
}
// 标准规则
const sopRulesType = {
  accepted: '骑士接单',
  stockIn: '订单入站',
  stockOut: '订单出站',
  pickUp: '骑士取货',
  ddd: '骑士送货',
}

// 导出状态
const ExportState = {
  all: '',
  pendding: 0,
  being: 50,
  succes: 100,
  fail: -100,
} 

module.exports = {
  Unit,
  Gender,
  BusinessType,
  BusinessMode,
  DeliveryMode,
  DeliveryType,
  ServiceState,
  AreaState,
  PriceMode,
  PriceType,
  GoodsType,
  WorkType,
  RegionRule,
  PaymentType,
  VerifyState,
  OrganizationType,
  VendorOrderState,
  StockOrdersState,
  DeliveryOrderState,
  sopRulesType,
  ExportState
}
