/**
 * 日志，事件，错误，异常等数据类型定义
 */
import dot from 'dot-prop';

//错误信息
const Errors = {
  1000: '芯易系统环境错误',
  1001: '芯易签名错误',
  1002: '芯易参数传递错误',
  1003: '芯易appid错误',
  1004: '芯易请求的命令方法错误',
  405002: '产品更新失败',
  410007: '订单催单失败',
  410018: '订单催单时间错误',
  422008: '骑士分单规则没有找到',
  423002: '区域合作没有找到',
  401010: '获取地址经纬度失败',
  425001: '骑士结算规则已存在',
  410013: '订单配送距离计算失败',
  404005: '区域发布失败',
  404008: '区域围栏更新失败',
  424002: '分单记录没有找到',
  410009: '订单收货地超出配送区域',
  410015: '上传任务不存在',
  426005: '判区规则已存在',
  402006: '不在配送时间内',
  418001: '无权限操作',
  425012: '服务商结算规则发布失败',
  409004: '骑士状态错误',
  405006: '产品状态错误',
  421002: '供应商信息更新错误',
  427006: '标准规则更新失败',
  425009: '服务商结算规则创建失败',
  422009: '骑士分单规则创建失败',
  421003: '供应商信息没有找到',
  412001: '角色创建',
  410002: '订单没有找到',
  412003: '角色没有找到',
  410001: '订单发单失败',
  410012: '订单发货地判区失败',
  415005: 'Qrcode Token创建失败',
  428003: '开发者信息更新失败',
  430002: '仓库名称已存在',
  405007: '产品已启用',
  419001: '充值渠道不支持',
  410003: '订单状态错误',
  414001: '店铺创建失败',
  416002: '创建七牛Token失败',
  405001: '产品创建失败',
  600101: '验签失败',
  402002: '服务商更新错误',
  403008: '商户禁止编辑',
  422012: '骑士分单规则发布失败',
  430003: '已关联仓库规则，请在先在仓库规则中取消',
  422011: '骑士分单规则状态错误',
  401006: '手机号没有找到',
  417001: '审核失败',
  402003: '服务商没有找到',
  417002: '提交审核失败',
  413003: '权限没有找到',
  420003: '团队没有找到',
  421004: '供应商信息已存在',
  426002: '判区规则状态错误',
  421001: '供应商信息创建失败',
  425005: '骑士结算规则状态错误',
  410008: '订单配送费估算失败',
  422010: '骑士分单规则更新失败',
  403009: '商户已签约该产品',
  403011: '未找到签约记录',
  413001: '权限创建失败',
  420001: '团队创建失败',
  428001: '开发者信息已存在',
  402007: '服务商状态错误',
  422001: '运力分单规则已存在',
  409007: '骑士离岗失败',
  419004: '钱包状态错误',
  403006: '商户未签约',
  428002: '开发者信息创建失败',
  410004: '订单不允许关闭',
  411007: '运单取消标记异常',
  411009: '运单未完成',
  416001: '发送验证码失败',
  415003: 'Invalid_Refresh_Token Refresh token invalid, refresh access-token failed',
  410014: '订单超出配送区域',
  409005: '骑士审核状态错误',
  500101: '系统配置错误',
  414002: '店铺更新失败',
  407001: '账号创建失败',
  411003: '运单已超时',
  401009: '简称已存在',
  425011: '服务商结算规则状态错误',
  404004: '区域状态错误',
  404007: '区域围栏创建失败',
  415001: '无效token或token已过期',
  421005: '开启业务失败',
  422015: '存在正在使用的分单规则',
  409001: '骑士创建失败',
  411004: '运单已抢',
  427002: '标准规则状态错误',
  499999: '未知异常',
  422003: '运力分单规则创建失败',
  404006: '父区域没有找到',
  404009: '区域围栏没有找到',
  426004: '判区规则创建失败',
  413002: '权限更新失败',
  420002: '团队更新失败',
  431002: '仓库分单规则已存在',
  425010: '服务商结算规则更新失败',
  500200: 'RPC错误',
  407004: '账号不可用',
  430001: '仓库没有找到',
  418003: '权限状态不可用',
  422005: '运力分单规则状态错误',
  422007: '骑士分单规则已存在',
  407002: '账号更新失败',
  403007: '商户签约失败',
  402004: '服务商状态不可用',
  426001: '判区规则没有找到',
  410011: '订单发货地超出配送区域',
  425002: '骑士结算规则没有找到',
  405004: '产品不可用',
  401007: '商户订单编号已存在',
  422006: '运力分单规则发布失败',
  425006: '骑士结算规则发布失败',
  419003: '钱包没有找到',
  426003: '判区规则发布失败',
  423001: '区域合作已存在',
  415007: 'qrcode过期',
  423003: '区域合作创建失败',
  422014: '禁用分单规则失败',
  423005: '区域合作状态错误',
  421006: '关闭业务失败',
  403003: '商户没有找到',
  404001: '区域创建失败',
  403005: '商户未审核通过,或商户审核状态错误',
  428004: '开发者信息没有找到',
  425003: '骑士结算规则创建失败',
  411006: '运单不能改派给自己',
  422013: '分单规则的优先级已存在',
  408002: '注册失败',
  411001: '运单没有找到',
  500100: '系统错误',
  401005: 'code已存在',
  403002: '商户更新失败',
  417003: '审核记录没有找到',
  422004: '运力分单规则更新失败',
  415006: 'Qrcode Token没有找到',
  425008: '服务商结算规则没有找到',
  410005: '订单关闭失败',
  402005: '服务商未审核通过',
  405003: '产品没有找到',
  401002: '名称已经存在',
  414004: '店铺状态不可用',
  414003: '店铺没有找到',
  407005: '账号权限没有找到',
  426006: '判区规则更新失败',
  401001: '参数缺失或错误',
  410010: '订单收货地判区失败',
  410016: '上传任务状态错误',
  419005: '钱包金额不足',
  419002: '充值单创建失败',
  427005: '标准规则创建失败',
  409002: '骑士更新失败',
  404002: '区域更新失败',
  431001: '仓库分单规则没有找到',
  432001: '仓库订单没有找到',
  427004: '标准规则已存在',
  401011: '地址超区',
  430004: '仓库有分单规则，无法禁用',
  422002: '运力分单规则没有找到',
  403001: '商户创建失败',
  427003: '标准规则发布失败',
  425007: '服务商结算规则已存在',
  401004: 'mobile已存在',
  412002: '角色更新失败',
  415004: 'Request Token创建失败',
  429001: 'DSL配置信息没有找到',
  403010: '商户解约失败',
  403012: '签约记录状态错误',
  427001: '标准规则没有找到',
  410006: '订单不可催单',
  405005: '产品启用失败',
  425004: '骑士结算规则更新失败',
  409006: '骑士上岗失败',
  418002: '接口权限配置错误',
  401003: 'account已存在',
  411008: '运单关闭类型错误',
  402001: '服务商创建失败',
  400320: '骑士抢单失败',
  423004: '区域合作更新失败',
  403004: '商户被禁用',
  411005: '运单状态错误',
  409003: '骑士没有找到',
  411002: '运单标记异常失败',
  401008: '验证码错误',
  415008: 'Qrcode Token错误',
  415002: 'Invalid_Requst_ Token Request token invalid, expired or not exists. ',
  405008: '产品版本没有找到',
  404003: '区域没有找到',
  407003: '账号没有找到',
  408001: '登录失败',

  //根据错误码，获取错误信息
  message: (error = undefined) => {
    //获取error code
    let code = dot.get(error, 'code');
    if (!code) {
      code = dot.get(error, 'err_code');
    }

    if (error && code && error.message) {
      const defaultMessage = `${code} ${error.message}`;
      return dot.get(Errors, `${code}`, defaultMessage);
    }
    return `未知错误信息${error.message}`;
  },
}

//订单追踪事件
const OrderTrackEvent = {
  /**  new start */
  //  公共
  'seller-order-published': '商家下单成功，结算方式为后付费',
  'shipment-pickup': '骑士已取货，正赶往送货点',
  'shipment-error': '骑士 XXX 标记异常，原因：XXX',
  'shipment-done': '商品已送达',
  'shipment-closed': '运单已关闭',
  'shipment-recover-state': '骑士点击继续配送',
  'seller-order-closed': '商家取消，订单关闭，备注',
  'vendor-order-closed': '服务商取消，订单关闭，备注',
  'stock-order-closed': '仓库单关闭，订单异常',
  'stock-order-redispatch': '仓库订单重新分配，备注',
  'stock-order-confirmed': '服务商已确认，等待商家将货品发到配送站',
  'stock-order-stock-in': '订单已到达配送站XXX，，关联单号：XXX',
  'stock-order-error': '货品到站收货，异常到站，',

  //分单(服务商订单)
  'vendor-order-created': '创建分单',
  'vendor-order-delivering': '分单配送中',
  'vendor-order-error': '分单异常',
  'vendor-order-done': '分单完成',

  // 服务商订单 本地生活圈
  'vendor-order-confirmed': '服务商已确认，等待骑士接单',
  'shipment-accepted': '骑士 XXX 接单，正赶往取货点取货，联系电话：XXX',
  'shipment-arrived': '骑士到达取货点，取货中',
  'shipment-reassigned': '订单改派给骑士 xxx ，联系电话：xxx',

  //仓库订单
  'stock-order-delivering': '仓库订单配送中',
  'stock-order-created': '仓库订单创建',
  'stock-order-assigned': '订单商品已分配给骑士，准备配送，详情请联系骑士：$1，电话：$2，关联单号：$3',
  'stock-order-done': '仓库订单完成(出站)',

  //运单(骑士)
  'shipment-created': '运单已创建',
  'shipment-confirmed': '服务商已确认，等待骑士接单',
  'shipment-assigned': '已分配',

  //商户订单
  'seller-order-created': '商户订单创建',
  'seller-order-pending-publish': '订单待发布',
  'seller-order-confirmed': '订单确认',
  'seller-order-delivering': '订单配送中',
  'seller-order-done': '订单完成',
  'seller-order-error': '订单异常',

  message: (event, details = '') => {
    return `${dot.get(OrderTrackEvent, `${event}`, '未知的追踪事件')}${details}`;
  },
}

// 仓订单异常标记
const StockOrdersErrorFlag = {
  noShip: 40,     //有单无货
  broken: 41,     //货损（货损）
  other: 42,      //其他原因
  nodelivery: 51, //超时未配送，系统标记异常
  description(rawValue) {
    switch (rawValue) {
      case this.noShip: return '有单无货';
      case this.broken: return '货损';
      case this.other: return '其他原因';
      case this.nodelivery: return '超时未配送，系统标记异常';
      default: return undefined;
    }
  },
}

// 仓订单异常类型
const StockOrdersErrorType = {
  delivery: 1,  //配送异常
  receive: 2,   //收货异常
  description(rawValue) {
    switch (rawValue) {
      case this.delivery: return '配送异常';
      case this.receive: return '收货异常';
      default: return '正常';
    }
  },
}

//仓库订单日志类型
const StockOrdersLogType = {
  delivery: 2,
  transfer: 3,
  deliveryByTake: 4,
  transferByTransfer: 5,
  salesReturn: 6,
  description(type, rawValue) {
    const title = (type === 'in') ? '入站' : '出站';
    switch (rawValue) {
      case this.delivery: return `配送${title}`;
      case this.transfer: return `中转${title}`;
      case this.deliveryByTake: return `揽收配送${title}`;
      case this.transferByTransfer: return `揽收中转${title}`;
      case this.salesReturn: return `退货${title}`;
      default: return undefined;
    }
  },
}

// 运单异常原因
const SellerOrdersErrorFlag = {
  deliveryCash: 1,
  sellerCancel: 2,
  broken: 3,
  notConnect: 4,
  notSign: 5,
  slowly: 6,
  addressError: 7,
  other: 8,
  sellerCause: 10,
  bikeBroken: 20,
  knightBroken: 21,
  knightOther: 22,
  vendorCause: 30,
  stockCause: 40,
  stockBroken: 41,
  stockOther: 42,
  timeBroken: 50,
  timeError: 51,
  otherVendor: 52,
  description(rawValue) {
    switch (rawValue) {
      case this.deliveryCash: return '配送费计算错误（商家）';
      case this.sellerCancel: return '商家取消（商家）';
      case this.broken: return '货损（商家）';
      case this.notConnect: return '顾客失联（商家）';
      case this.notSign: return '顾客拒签（商家）';
      case this.slowly: return '商家出餐太慢（商家）';
      case this.addressError: return '商家地址错误（商家）';
      case this.other: return '商家其他原因（商家）';
      case this.sellerCause: return '商家原因（商家）';
      case this.bikeBroken: return '骑士车坏了';
      case this.knightBroken: return '货损（骑士）';
      case this.knightOther: return '骑士其他原因（骑士';
      case this.vendorCause: return '服务商原因（服务商）';
      case this.stockCause: return '有单无货（仓库）';
      case this.stockBroken: return '货损（仓库）';
      case this.stockOther: return '仓库其他原因（仓库）';
      case this.timeBroken: return '超时未接单取消（系统）';
      case this.timeError: return '配送超时异常（系统）';
      case this.otherVendor: return '被其他服务商接单（系统）';
      default: return '其他原因';
    }
  },
}
// 运单关闭类型
const SellerOrdersColsedType = {
  sellerClose: 10,
  vendoeClose: 20,
  systemClose: 30,
  description(rawValue) {
    switch (rawValue){
      case this.sellerClose : return '商家取消';
      case this.vendoeClose : return '服务商取消';
      case this.systemClose : return '系统原因';
      default: return '其他原因';
    }
  },
}

module.exports = {
  Errors,
  OrderTrackEvent,
  SellerOrdersErrorFlag,
  StockOrdersErrorFlag,
  StockOrdersErrorType,
  StockOrdersLogType,
  SellerOrdersColsedType
}
