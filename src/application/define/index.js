//公共类型定义

import {
  Roles,
  Modules,
  Router,
} from './router'

import {
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
  OrderState,
  DeliveryOrderState,
  SellerType,
  StockOrdersState,
  sopRulesType,
  ExportState
} from './define'

import {
  Errors,
  OrderTrackEvent,
  SellerOrdersErrorFlag,
  StockOrdersErrorFlag,
  StockOrdersErrorType,
  StockOrdersLogType,
  SellerOrdersColsedType
  
} from './event'

module.exports = {
  Roles,          //角色列表
  Modules,        //模块列表
  Router,         //路由表（顶级模块 -> 扩展模块 -> 扩展模块 -> ...）

  Unit,                   //单位换算
  Gender,                 //性别（男,女）
  BusinessType,           //业务角色类型 (直营,加盟)
  BusinessMode,           //业务模式 (本地生活圈, 落地配无存储, 落地配有存储, 同城快递)
  DeliveryMode,           //配送模式 (即时达, 预约达)
  DeliveryType,           //配送类型 (商家发货, 站点发货)
  ServiceState,           //服务状态 (启用, 禁用)
  AreaState,              //区域状态 (全部，草稿，启用, 禁用)
  PriceMode,              //定价模式 (一口价, 阶梯定价)
  PriceType,              //定价类型（距离加时间阶梯价, 距离阶梯价, 时间阶梯价）
  GoodsType,              //商品类型（美食餐饮,生鲜蔬菜,超市商品,鲜花蛋糕,其他）
  WorkType,               //工作类型（全职, 兼职）
  RegionRule,             //判区规则
  VerifyState,            //审核状态（待提交, 待审核, 驳回, 通过）
  PaymentType,            //结算方式（现金,余额,后付费）
  OrganizationType,       //组织类型 (服务商, 商户, 平台, 骑士)
  VendorOrderState,       //服务商订单状态
  StockOrdersState,       //仓库订单状态
  DeliveryOrderState,     //运单状态

  Errors,                 //错误信息
  OrderTrackEvent,        //订单事件

  SellerOrdersErrorFlag,  //运单异常原因
  StockOrdersErrorFlag,
  StockOrdersErrorType,
  StockOrdersLogType,
  SellerOrdersColsedType,   //运单关闭类型
  sopRulesType,             //标准规则类型
  ExportState
}
