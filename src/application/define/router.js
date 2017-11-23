import _ from 'lodash';

//角色列表
const Roles = {
  superman: 9999, //超级管理员
  administer: 8888, //系统管理员
  operateManager: 7777, //运营管理员
  stockManager: 6666, //仓库管理员
  areaManager: 5555, //区域管理员
  anonymous: -1, //匿名
  tester: 1234, //测试角色

  //使用初始化
  description(rawValue) {
    switch (rawValue) {
      case this.anonymous:
        return '匿名角色';
      case this.areaManager:
        return '区域管理员';
      case this.stockManager:
        return '仓库管理员';
      case this.operateManager:
        return '运营管理员';
      case this.administer:
        return '系统管理员';
      case this.superman:
        return '超级管理员';
      case this.tester:
        return '测试角色';
      default:
        return undefined;
    }
  },
  //获取全部角色
  allValues() {
    //获取全部values，过滤其中不是数字的部分。
    return _(Roles).values().filter((e) => {
      return _.isInteger(e)
    }).value();
  },
}

//模块列表
const Modules = {
  common: 1000000,                //公共模块
  commonNotFind: 1100000,         //公共模块，404
  commonInterface: 1200000,       //公共界面模块
  commonPanel: 1300000,           //控制面板
  commonCompass: 1400000,         //数据罗盘（历史遗留功能，未上线）
  commonMonito: 1500000,          //数据监控（历史遗留功能，未上线）

  business: 100000,               //业务中心
  businessService: 110000,        //服务产品设置
  businessServiceList: 111000,    //服务产品设置（列表）
  businessServiceUpdate: 112000,  //服务产品设置（编辑）
  businessServiceDetail: 113000,  //服务产品设置（详情）
  businessServiceCreate: 114000,  //服务产品设置（创建）
  businessArea: 120000,           //配送区域管理
  businessAreaMap: 121000,        //区域地图
  businessStock: 130000,          //仓库管理
  businessStockDriect: 131000,    //直营仓库（列表）
  businessStockAffiliate: 132000, //加盟仓库（列表）
  businessStockUpdate: 133000,    //仓库管理（编辑）
  businessStockDetail: 134000,    //仓库管理（详情）
  businessStockCreate: 135000,    //仓库管理（添加）
  businessRules: 140000,          //规则管理
  businessRulesStock: 141000,     //仓库规则管理
  businessRulesArea: 142000,      //区域规则管理

  businessSeller: 150000,           //商家管理
  businessSellerEdit: 150100,       //商家管理 (编辑)
  businessSellerDetail: 150200,     //商家管理 (详情)
  businessSellerVerify: 150300,     //商家管理 (审核)
  businessSellerSign: 151000,       //签约列表
  businessSellerSignEdit: 151100,   //签约列表 (编辑)
  businessSellerSignDetail: 151200, //签约列表 (详情)

  businessProject: 160000,                    //项目管理
  businessProjectDirect: 161000,              //直营项目
  businessProjectDirectSellerInfo: 161100,    //直营项目 (商家信息)
  businessProjectDirectSignInfo: 161200,      //直营项目 (签约信息)
  businessProjectDirectSignEdit: 161210,      //直营项目 (签约信息/编辑)
  businessProjectDirectOrderRules: 161300,    //直营项目 (订单分单规则)
  businessProjectDirectCourierRules: 161400,  //直营项目 (骑士分单规则)
  businessProjectDirectAdd: 161500,           //添加新项目
  businessProjectDirectHistory: 161600,       //历史合作项目
  businessProjectDirectOperate: 161700,       //操作模块入口
  businessProjectAffiliate: 162000,           //加盟项目
  businessProjectAffiliateSellerInfo: 162100, //加盟项目 (商家信息)
  businessProjectAffiliateOrderRules: 162200, //加盟项目 (骑士分单规则)
  businessProjectAffiliateHistory: 162300,    //加盟项目 (历史合作项目)
  businessProjectAffiliateOperate: 162400,    //加盟项目操作模块入口

  businessSupplier: 170000,     //承运商管理（原供应商管理）
  businessSupplierList: 171000, //承运商列表

  businessSupplierInfo: 172000,           //承运商信息
  businessSupplierArea: 173000,           //合作区域
  businessSupplierStock: 174000,          //合作仓库
  businessSupplierSeller: 175000,         //服务商家
  businessSupplierAreaServices: 176000,   //区域承运表
  businessSupplierStockServices: 177000,  //仓库承运表
  businessSupplierOperate: 178000,        //承运商管理操作入口

  managentAccount: 200000,        //用户管理
  managentEmployee: 210000,       //员工管理
  managentEmployeeList: 211000,   //员工管理（列表）
  managentEmployeeEdit: 212000,   //员工管理 (编辑)
  managentEmployeeCreate: 213000, //员工管理 (创建)
  managentEmployeeDetail: 214000, //员工管理 (详情)
  managentCourier: 220000,        //骑士管理
  managentCourierList: 221000,    //骑士管理 (列表)
  managentCourierEdit: 222000,    //骑士管理 (编辑)
  managentCourierCreate: 223000,  //骑士管理 (创建)
  managentCourierDetail: 224000,  //骑士管理 (详情)
  managentCourierVerify: 225000,  //骑士管理 (审核)

  order: 300000,                    //订单管理
  orderBoard: 310000,               //订单看板
  orderBoardDriect: 311000,         //直营项目
  orderBoardAffiliate: 312000,      //加盟项目
  orderBoardSeller: 313000,         //商家管理
  orderException: 320000,           //异常单列表
  orderExceptionDriect: 321000,     //直营项目
  orderExceptionAffiliate: 322000,  //加盟项目
  orderExceptionDetail: 323000,     //异常订单详情
  orderSearch: 330000,              //订单查询
  orderSearchList: 331000,          //订单查询列表
  // orderSearchDetail: 332000,        //订单查询详情
  orderReport: 340000,              //订单明细查询
  orderReportDetail: 341000,        //订单明细详情
  orderReportDaily: 342000,         //日订单明细下载
  orderReportDay: 344000,           //日订单明细下载new
  orderReportMonthly: 343000,       //月订单明细下载
  orderDetails: 350000,             //月订单明细下载

  dispatcher: 400000,                   //分拨管理
  dispatcherSiteOperate: 410000,        //站点操作
  dispatcherArrive: 411000,             //到站收货
  dispatcherPullin: 412000,             //揽收入站
  dispatcherKnightDelivery: 413000,     //骑士领货
  dispatcherTransfer: 414000,           //中转出站
  dispatcherSalesInbound: 415000,       //退货入站
  dispatcherSalesOutbound: 416000,      //退货出站
  dispatcherKnightAffirm: 416000,       //待骑士确认订单
  dispatcherExceptionOrder: 417000,     //异常单处理
  dispatcherDistributionOrder: 418000,  //配送单查询
  dispatcherTransferOrder: 420000,      //中转单查询
  dispatcherOrderDetails: 421000,       //仓订单详情
  dispatcherOperateRecord: 430000,      //操作记录
  dispatcherInboundRecord: 431000,      //入站记录表
  dispatcherOutboundRecord: 432000,     //出站记录表


  operations: 500000,             //运营管理
  operationsPanel: 510000,        //运力调度
  operationsOrderDetails: 511000, //运单详情 (详情)
  operationsSearch: 520000,       //运力订单查询
  operationsDownloadDay:530000,   //运力订单明细下载
  statictics: 600000,             //数据统计
  staticticsCourier: 610000,      //骑士订单统计
  staticticsCourierDetail: 611000,//骑士订单统计详情
  staticticsDriect: 620000,       //直营数据统计
  staticticsDriectSeller: 621000, //商家数据统计
  staticticsDriectSellerDetail: 622000, //商家数据统计详情 (失效)
  staticticsDriectArea: 623000, //区域数据统计
  staticticsDriectAreaDetail: 624000, //区域数据统计详情 (失效)
  staticticsAffiliate: 630000, //加盟数据统计
  staticticsFinanceDetail: 640000,  //账单统计列表
  staticticsFinanceList: 650000,    //账单统计详情

  finance: 700000, //财务中心
  financeBills: 710000, //商家账单

  account: 800000,                //个人中心
  accountVendorProfile: 810000,   //我的服务商
  accountVendorEdit: 811000,      //我的服务商（编辑）
  accountProfile: 820000,         //我的账号

  document: 900000, //帮助中心
  documentManual: 910000, //新手指南
  documentBusiness: 920000, //业务指南

};

//模块详情
const Details = {
  //一级菜单（路由，无逻辑实现）
  [Modules.common]: {
    title: '嗷嗷管家',
    path: '',
    icon: 'layout',
    background: '#5EE2FF',
    hoverBackground: '#58DEFF',
    colorClass: 'dataColor',
    component: '',
    isHide: true,
  },
  [Modules.business]: {
    title: '业务中心',
    path: '',
    icon: 'appstore-o',
    background: 'rgb(204, 147, 213)',
    hoverBackground: 'rgb(170, 76, 186)',
    colorClass: 'businessColor',
    component: '',
  },
  [Modules.managentAccount]: {
    title: '用户管理',
    path: '',
    icon: 'solution',
    background: 'rgb(230, 120, 160)',
    hoverBackground: 'rgb(214, 33, 97)',
    colorClass: 'userColor',
    component: '',
  },
  [Modules.order]: {
    title: '订单管理',
    path: '',
    icon: 'file-text',
    background: 'rgb(250, 202, 129)',
    hoverBackground: 'rgb(247, 167, 56)',
    colorClass: 'orderColor',
    component: '',
  },
  [Modules.dispatcher]: {
    title: '分拨管理',
    path: '',
    icon: 'share-alt',
    background: 'rgb(250, 202, 129)',
    hoverBackground: 'rgb(247, 167, 56)',
    colorClass: 'dispatcherColor',
    component: '',
  },
  [Modules.operations]: {
    title: '运营管理',
    path: '',
    icon: 'global',
    background: 'rgb(140, 175, 144)',
    hoverBackground: 'rgb(64, 122, 71)',
    colorClass: 'operateColor',
    component: '',
  },
  [Modules.statictics]: {
    title: '数据统计',
    path: '',
    icon: 'line-chart',
    background: 'rgb(123, 185, 237)',
    hoverBackground: 'rgb(40, 138, 226)',
    colorClass: 'dataColor',
    component: '',
  },
  [Modules.finance]: {
    title: '财务中心',
    path: '',
    icon: 'bank',
    background: 'rgb(253, 154, 126)',
    hoverBackground: 'rgb(252, 88, 48)',
    colorClass: 'financeColor',
    component: '',
  },
  [Modules.account]: {
    title: '个人中心',
    path: '',
    icon: 'user',
    isHide: true,
    background: 'rgb(245, 236, 247)',
    hoverBackground: 'rgb(245, 236, 247)',
    colorClass: 'personageColor',
    component: '',
  },
  [Modules.document]: {
    title: '帮助中心',
    path: '',
    icon: 'user',
    isHide: true,
    background: 'rgb(245, 236, 247)',
    hoverBackground: 'rgb(245, 236, 247)',
    colorClass: 'helpColor',
    component: '',
  },

  //公共相关模块
  [Modules.commonInterface]: {
    title: '公用界面服务',
    path: '/#/common/interface',
    component: '',
  },
  [Modules.commonNotFind]: {
    title: '页面不存在',
    path: '/#/notFind',
    component: '',
  },
  [Modules.commonPanel]: {
    title: '控制面板',
    path: '/#/console/platform',
    component: '/console/src/pages/index',
  },
  [Modules.commonCompass]: {
    title: '数据罗盘',
    path: '/#/statictics/compass',
    component: '/statictics/src/pages/compass',
  },
  [Modules.commonMonito]: {
    title: '数据监控',
    path: '/#/statictics/monito',
    component: '/statictics/src/pages/monito',
  },

  //业务中心相关模块
  [Modules.businessService]: {
    title: '服务产品设置',
    path: '/#/business/service/list',
    component: '',
  },
  [Modules.businessServiceList]: {
    isHide: true,
    title: '服务产品设置（列表）',
    path: '/#/business/service/list',
    component: '',
  },
  [Modules.businessServiceUpdate]: {
    isHide: true,
    title: '服务产品设置（编辑）',
    path: '/#/business/service/update',
    component: '',
  },
  [Modules.businessServiceDetail]: {
    isHide: true,
    title: '服务产品设置（详情）',
    path: '/#/business/service/detail',
    component: '',
  },
  [Modules.businessServiceCreate]: {
    isHide: true,
    title: '服务产品设置（创建）',
    path: '/#/business/service/create',
    component: '',
  },

  [Modules.businessArea]: {
    title: '配送区域管理',
    path: '/#/business/area/list',
    component: '/business/src/pages/area/list',
  },
  [Modules.businessAreaMap]: {
    isHide: true,
    title: '区域地图',
    path: '/#/business/area/map',
    component: '',
  },
  [Modules.businessStock]: {
    title: '仓库管理',
    path: '/#/business/stock/driect',
    component: '',
  },
  [Modules.businessStockDriect]: {
    title: '直营仓库',
    path: '/#/business/stock/driect',
    component: '',
  },
  [Modules.businessStockAffiliate]: {
    title: '加盟仓库',
    path: '/#/business/stock/affiliate',
    component: '',
  },
  [Modules.businessStockUpdate]: {
    isHide: true,
    title: '仓库管理（编辑）',
    path: '/#/business/stock/update',
    component: '',
  },
  [Modules.businessStockDetail]: {
    isHide: true,
    title: '仓库管理（详情）',
    path: '/#/business/stock/detail',
    component: '',
  },
  [Modules.businessStockCreate]: {
    isHide: true,
    title: '仓库管理（添加）',
    path: '/#/business/stock/create',
    component: '',
  },
  [Modules.businessRules]: {
    title: '规则管理',
    path: '/#/business/rules/stock',
    component: '',
  },
  [Modules.businessRulesStock]: {
    title: '仓库规则管理',
    path: '/#/business/rules/stock',
    component: '',
  },
  [Modules.businessRulesArea]: {
    title: '区域规则管理',
    path: '/#/business/rules/area',
    component: '',
  },

  //业务中心-商家管理 相关模块
  [Modules.businessSeller]: {
    title: '商家管理',
    path: '/#/business/seller/list',
    component: '/business/src/pages/seller/list',
  },
  [Modules.businessSellerEdit]: {
    title: '商家管理 (编辑)',
    path: '/#/business/seller/list/edit',
    component: '/business/src/pages/seller/list/edit',
  },
  [Modules.businessSellerDetail]: {
    title: '商家管理 (详情)',
    path: '/#/business/seller/list/detail',
    component: '/business/src/pages/seller/list/detail',
  },
  [Modules.businessSellerVerify]: {
    title: '商家管理 (审核)',
    path: '/#/business/seller/list/check',
    component: '/business/src/pages/seller/list/check',
  },
  [Modules.businessSellerSign]: {
    isHide: true,
    title: '签约记录',
    path: '/#/business/sign/list',
    component: '/business/src/pages/sign/list',
  },
  [Modules.businessSellerSignEdit]: {
    title: '签约记录 (编辑)',
    path: '/#/business/sign/list/edit',
    component: '/business/src/pages/sign/list/edit',
  },
  [Modules.businessSellerSignDetail]: {
    title: '签约记录 (详情)',
    path: '/#/business/sign/list/detail',
    component: '/business/src/pages/sign/list/detail',
  },

  //业务中心-项目管理 相关模块
  [Modules.businessProject]: {
    title: '项目管理',
    path: '/#/business/project/direct',
    component: '/business/src/pages/manage/direct',
  },
  [Modules.businessProjectDirect]: {
    title: '直营项目',
    path: '/#/business/project/direct',
    component: '/business/src/pages/manage/direct',
  },
  [Modules.businessProjectDirectAdd]: {
    isHide: true,
    title: '添加新项目',
    path: '/#/business/project/add',
    component: '',
  },
  [Modules.businessProjectDirectHistory]: {
    isHide: true,
    title: '历史合作项目',
    path: '/#/business/project/direct/history',
    component: '',
  },
  [Modules.businessProjectDirectOperate]: {
    title: '操作',
    path: '/#/business/project/direct/operate',
    component: '',
  },
  [Modules.businessProjectDirectSellerInfo]: {
    title: '商家信息',
    path: '/#/business/manage/retail/shop',
    component: '/business/src/pages/manage/components/retail/shop',
  },
  [Modules.businessProjectDirectSignInfo]: {
    title: '签约信息',
    path: '/#/business/manage/retail/signed',
    component: '/business/src/pages/manage/components/retail/signed',
  },
  [Modules.businessProjectDirectSignEdit]: {
    title: '签约编辑',
    path: '/#/business/project/direct/operate/sign/edit',
    component: '',
  },
  [Modules.businessProjectDirectOrderRules]: {
    title: '订单分单规则',
    path: '/#/business/manage/retail/orderDispatchRules',
    component: '/business/src/pages/manage/components/orderDispatchRules',
  },
  [Modules.businessProjectDirectCourierRules]: {
    title: '骑士分单规则',
    path: '/#/business/manage/retail/knightDispatchRules',
    component: '/business/src/pages/manage/components/knightDispatchRules',
  },
  [Modules.businessProjectAffiliate]: {
    title: '加盟项目',
    path: '/#/business/project/affiliate',
    component: '/business/src/pages/manage/affiliates',
  },
  [Modules.businessProjectAffiliateHistory]: {
    title: '历史合作项目',
    path: '/#/business/project/affiliate/history',
    component: '',
  },
  [Modules.businessProjectAffiliateOperate]: {
    title: '操作',
    path: '/#/business/project/affiliate/operate',
    component: '',
  },
  [Modules.businessProjectAffiliateSellerInfo]: {
    title: '商家信息',
    path: '/#/business/manage/affiliates/info',
    component: '/business/src/pages/manage/components/join/info',
  },
  [Modules.businessProjectAffiliateOrderRules]: {
    title: '骑士分单规则',
    path: '/#/business/manage/affiliates/knigh',
    component: '/business/src/pages/manage/components/join/knigh',
  },

  //业务中心-承运商管理 相关模块
  [Modules.businessSupplier]: {
    title: '承运商管理',
    path: '/#/business/supplier/list',
    component: '/business/src/pages/supplier/list',
  },
  [Modules.businessSupplierList]: {
    title: '承运商列表',
    path: '/#/business/supplier/list',
    component: '/business/src/pages/supplier/list',
  },
  [Modules.businessSupplierInfo]: {
    isHide: true,
    title: '承运商信息',
    path: '/#/business/supplier/list/suppliers',
    component: '/business/src/pages/supplier/list/detail',
  },
  [Modules.businessSupplierArea]: {
    isHide: true,
    title: '合作区域',
    path: '/#/business/supplier/list/regionalList',
    component: '/business/src/pages/supplier/list/regionalList',
  },
  [Modules.businessSupplierStock]: {
    title: '合作仓库',
    path: '/#/business/supplier/stock',
    component: '',
  },
  [Modules.businessSupplierSeller]: {
    title: '服务商家',
    path: '/#/business/supplier/store',
    component: '',
  },
  [Modules.businessSupplierAreaServices]: {
    title: '区域承运表',
    path: '/#/business/supplier/areaService',
    component: '',
  },
  [Modules.businessSupplierStockServices]: {
    title: '仓库承运表',
    path: '/#/business/supplier/stockService',
    component: '',
  },
  [Modules.businessSupplierOperate]: {
    isHide: true,
    title: '承运商管理 (模块)',
    path: '/#/business/supplier/operate',
    component: '',
  },

  //用户管理相关模块
  [Modules.managentEmployee]: {
    title: '员工管理',
    path: '/#/team/employee/list',
    component: '/team/src/pages/employee/list/index',
  },
  [Modules.managentEmployeeList]: {
    isHide: true,
    title: '',
    path: '/#/team/employee/list',
    component: '/team/src/pages/employee/list/index',
  },
  [Modules.managentEmployeeEdit]: {
    isHide: true,
    title: '员工管理 (编辑)',
    path: '/#/team/employee/list/edit',
    component: '/team/src/pages/employee/list/edit',
  },
  [Modules.managentEmployeeCreate]: {
    isHide: true,
    title: '员工管理 (创建)',
    path: '/#/team/employee/list/add',
    component: '/team/src/pages/employee/list/add',
  },
  [Modules.managentEmployeeDetail]: {
    isHide: true,
    title: '员工管理 (详情)',
    path: '/#/team/employee/list/detail',
    component: '/team/src/pages/employee/list/detail',
  },
  [Modules.managentCourier]: {
    title: '骑士管理',
    path: '/#/team/courier/list',
    component: '/team/src/pages/courier/list',
  },
  [Modules.managentCourierList]: {
    isHide: true,
    title: '',
    path: '/#/team/courier/list',
    component: '/team/src/pages/courier/list',
  },
  [Modules.managentCourierEdit]: {
    isHide: true,
    title: '骑士管理 (编辑)',
    path: '/#/team/courier/list/edit',
    component: '/team/src/pages/courier/list/edit',
  },
  [Modules.managentCourierCreate]: {
    isHide: true,
    title: '骑士管理 (创建)',
    path: '/#/team/courier/list/add',
    component: '/team/src/pages/courier/list/add',
  },
  [Modules.managentCourierDetail]: {
    isHide: true,
    title: '骑士管理 (详情)',
    path: '/#/team/courier/list/detail',
    component: '/team/src/pages/courier/list/detail',
  },
  [Modules.managentCourierVerify]: {
    isHide: true,
    title: '骑士管理 (审核)',
    path: '/#/team/courier/list/check',
    component: '/team/src/pages/courier/list/check',
  },

  //订单管理相关模块
  [Modules.orderBoard]: {
    title: '订单看板',
    path: '/#/order/board/direct',
    component: '../../components/order/orderBoard/direct',
  },
  [Modules.orderBoardDriect]: {
    title: '直营项目',
    path: '/#/order/board/direct',
    component: '../../components/order/orderBoard/direct',
  },
  [Modules.orderBoardAffiliate]: {
    title: '加盟项目',
    path: '/#/order/board/affiliate',
    component: '../../components/order/orderBoard/affiliate',
  },
  [Modules.orderBoardSeller]: {
    isHide: true,
    title: '项目详情',
    path: '/#/operation/order/seller',
    component: '/operation/src/pages/seller',
  },
  [Modules.orderException]: {
    title: '异常单列表',
    path: '/#/order/exception/direct',
    component: '../../components/order/exceptionOrder/direct',
  },
  [Modules.orderExceptionDriect]: {
    title: '直营订单',
    path: '/#/order/exception/direct',
    component: '../../components/order/exceptionOrder/direct',
  },
  [Modules.orderExceptionAffiliate]: {
    title: '加盟订单',
    path: '/#/order/exception/affiliate',
    component: '../../components/order/exceptionOrder/direct',
  },
  [Modules.orderExceptionDetail]: {
    isHide: true,
    title: '异常订单 (详情)',
    path: '/#/operation/order/close/detail',
    component: '/operation/src/pages/seller',
  },
  [Modules.orderSearch]: {
    title: '订单查询',
    path: '/#/order/search',
    component: '/statictics/src/pages/shipments_detail/list',
  },
  [Modules.orderSearchList]: {
    isHide: true,
    title: '订单查询 (列表)',
    path: '/#/order/search',
    component: '/statictics/src/pages/shipments_detail/list',
  },
  // 已删除
  // [Modules.orderSearchDetail]: {
  //   isHide: true,
  //   title: '订单查询 (详情)',
  //   path: '/#/order/search/detail',
  //   component: '',
  // },
  [Modules.orderReport]: {
    title: '订单明细',
    path: '/#/order/download/daily',
    component: '/statictics/src/pages/shipments_detail_down/list',
  },
  [Modules.orderReportDetail]: {
    isHide: true,
    title: '订单明细 (详情)',
    path: '/#/statictics/shipments_detail_down/list/detail',
    component: '/statictics/src/pages/shipments_detail_down/list/detail',
  },
  [Modules.orderReportDaily]: {
    title: '日订单明细下载old',
    path: '/#/order/download/daily',
    component: '../../components/order/exceptionOrder/direct',
  },
  [Modules.orderReportDay]: {
    title: '日订单明细下载',
    path: '/#/order/download/day',
    component: '../../components/order/exceptionOrder/direct',
  },
  [Modules.orderReportMonthly]: {
    isHide: true,
    title: '月订单明细下载',
    path: '/#/order/download/monthly',
    component: '../../components/order/exceptionOrder/direct',
  },
  [Modules.orderDetails]: {
    isHide: true,
    title: '订单详情',
    path: '/#/order/details',
    component: '',
  },

  //分拨中心相关模块
  [Modules.dispatcherSiteOperate]: {
    title: '站点操作',
    path: '/#/dispatcher/arrive',
    component: '',
  },
  [Modules.dispatcherArrive]: {
    title: '到站收货',
    path: '/#/dispatcher/arrive',
    component: '',
  },
  [Modules.dispatcherPullin]: {
    title: '揽收入站',
    path: '/#/dispatcher/pullin',
    component: '',
  },
  [Modules.dispatcherKnightDelivery]: {
    title: '骑士领货',
    path: '/#/dispatcher/knight/delivery',
    component: '',
  },
  [Modules.dispatcherTransfer]: {
    title: '中转出站',
    path: '/#/dispatcher/transfer',
    component: '',
  },
  [Modules.dispatcherSalesInbound]: {
    title: '退货入站',
    path: '/#/dispatcher/sales/inbound',
    component: '',
  },
  [Modules.dispatcherSalesOutbound]: {
    title: '退货出站',
    path: '/#/dispatcher/sales/outbound',
    component: '',
  },
  [Modules.dispatcherKnightAffirm]: {
    title: '待骑士确认订单',
    path: '/#/dispatcher/knight/affirm',
    component: '',
  },
  [Modules.dispatcherExceptionOrder]: {
    title: '异常单处理',
    path: '/#/dispatcher/exception/order',
    component: '',
  },
  [Modules.dispatcherDistributionOrder]: {
    title: '站点配送单查询',
    path: '/#/dispatcher/distribution/order',
    component: '',
  },
  [Modules.dispatcherTransferOrder]: {
    title: '站点中转单查询',
    path: '/#/dispatcher/transfer/order',
    component: '',
  },
  [Modules.dispatcherOrderDetails]: {
    title: '详情',
    isHide: true,
    path: '/#/dispatcher/order/details',
    component: '',
  },
  [Modules.dispatcherOperateRecord]: {
    title: '操作记录',
    path: '/#/dispatcher/inbound/record',
    component: '',
  },
  [Modules.dispatcherInboundRecord]: {
    title: '入站记录表',
    path: '/#/dispatcher/inbound/record',
    component: '',
  },
  [Modules.dispatcherOutboundRecord]: {
    title: '出站记录表',
    path: '/#/dispatcher/outbound/record',
    component: '',
  },

  //运营管理相关模块
  [Modules.operationsPanel]: {
    title: '运力调度',
    path: '/#/tms/control_panel',
    component: '/tms/src/pages/control_panel',
  },
  [Modules.operationsOrderDetails]: {
    isHide: true,
    title: '运单详情 (详情)',
    path: '/#/operations/details',
    component: '',
  },
  [Modules.operationsSearch]: {
    title: '运力订单查询',
    path: '/#/operations/search',
    component: '',
  },
  [Modules.operationsDownloadDay]: {
    title: '运力订单明细下载',
    path: '/#/operations/download/day',
    component: '',
  },

  //数据统计相关模块
  [Modules.staticticsCourier]: {
    title: '骑士订单统计',
    path: '/#/statictics/shipments_courier/list',
    component: '/statictics/src/pages/shipments_courier/list',
  },
  [Modules.staticticsCourierDetail]: {
    isHide: true,
    title: '骑士订单统计详情',
    path: '/#/statictics/shipments_courier/list/detail',
    component: '/statictics/src/pages/shipments_courier/list/detail',
  },
  [Modules.staticticsDriect]: {
    title: '直营数据统计',
    path: '/#/statictics/shipments_seller/list',
    component: '/statictics/src/pages/shipments_seller/list',
  },
  [Modules.staticticsDriectSeller]: {
    title: '商家数据统计',
    path: '/#/statictics/shipments_seller/list',
    component: '/statictics/src/pages/shipments_seller/list',
  },
  [Modules.staticticsDriectSellerDetail]: {
    isHide: true,
    title: '商家数据统计详情',
    path: '/#/statictics/shipments_seller/list/detail',
    component: '/statictics/src/pages/shipments_seller/list/detail',
  },
  [Modules.staticticsDriectArea]: {
    title: '区域数据统计',
    path: '/#/statictics/shipments_area/list',
    component: '/statictics/src/pages/shipments_area/list',
  },
  [Modules.staticticsDriectAreaDetail]: {
    isHide: true,
    title: '区域数据统计详情',
    path: '/#/statictics/shipments_area/list/detail',
    component: '/statictics/src/pages/shipments_area/list/detail',
  },
  [Modules.staticticsAffiliate]: {
    isHide: true,
    title: '加盟数据统计',
    path: '/#/statictics/affiliate',
    component: '',
  },
  [Modules.staticticsFinanceList]: {
    isHide: true,
    title: '账单统计',
    path: '/#/statictics/shipments_detail/list',
    component: '',
  },
  [Modules.staticticsFinanceDetail]: {
    isHide: true,
    title: '统计详情',
    path: '/#/statictics/shipments_detail/list/detail',
    component: '',
  },

  //财务中心相关模块
  [Modules.financeBills]: {
    title: '商家账单',
    path: '/#/finance/sellerBills/list',
    component: '',
  },

  //个人中心相关模块
  [Modules.accountVendorProfile]: {
    title: '商户资料',
    icon: 'contacts',
    path: '/#/account/vendor/profile',
    component: '',
  },
  [Modules.accountVendorEdit]: {
    title: '商户资料',
    path: '/#/account/vendor/edit',
    component: '',
  },
  [Modules.accountProfile]: {
    title: '我的账号',
    icon: 'user',
    path: '/#/account/profile',
    component: '',
  },

  //帮助中心相关模块
  [Modules.documentManual]: {
    title: '新手指南',
    path: '/#/guide/greenhands',
    component: '',
  },
  [Modules.documentBusiness]: {
    title: '业务指南',
    path: '/#/guide/newbusiness',
    component: '',
  },
};

//路由表（顶级模块 -> 扩展模块 -> 扩展模块 -> ...）
const Router = [
  //公共相关模块
  {
    id: Modules.common,
    roles: [Roles.superman],
    routes: [
      //公共界面
      {
        id: Modules.commonInterface,
        roles: [Roles.superman, Roles.tester],
      },
      //404页面
      {
        id: Modules.commonNotFind,
        roles: Roles.allValues(),
      },
      //控制面板
      {
        id: Modules.commonPanel,
        roles: [Roles.superman],
      },
      //数据罗盘
      {
        id: Modules.commonCompass,
        roles: [Roles.superman],
      },
      //数据监控
      {
        id: Modules.commonMonito,
        roles: [Roles.superman],
      },
    ],
  },

  //业务中心相关模块
  {
    id: Modules.business,
    roles: [Roles.superman],
    routes: [
      //服务产品设置
      {
        id: Modules.businessService,
        roles: [Roles.superman],
        routes: [
          //服务产品设置（列表）
          {
            id: Modules.businessServiceList,
            roles: [Roles.superman],
          },
          //服务产品设置（编辑）
          {
            id: Modules.businessServiceUpdate,
            roles: [Roles.superman],
          },
          //服务产品设置（详情）
          {
            id: Modules.businessServiceDetail,
            roles: [Roles.superman],
          },
          //服务产品设置（创建）
          {
            id: Modules.businessServiceCreate,
            roles: [Roles.superman],
          },
        ],
      },

      //区域管理
      {
        id: Modules.businessArea,
        roles: [Roles.superman],
      },
      {
        id: Modules.businessAreaMap,
        roles: [Roles.superman],
      },

      //承运商管理
      {
        id: Modules.businessSupplier,
        roles: [Roles.superman],
        routes: [
          //承运商列表
          {
            id: Modules.businessSupplierList,
            roles: [Roles.superman],
          },
          //承运商信息
          {
            id: Modules.businessSupplierInfo,
            roles: [Roles.superman],
          },
          //合作区域
          {
            id: Modules.businessSupplierArea,
            roles: [Roles.superman],
          },
          //区域承运表
          {
            id: Modules.businessSupplierAreaServices,
            roles: [Roles.superman],
          },
          //仓库承运表
          {
            id: Modules.businessSupplierStockServices,
            roles: [Roles.superman],
          },
          //承运商管理操作入口
          {
            id: Modules.businessSupplierOperate,
            roles: [Roles.superman],
          },
        ],
      },

      //仓库管理
      {
        id: Modules.businessStock,
        roles: [Roles.superman],
        routes: [
          //直营仓库
          {
            id: Modules.businessStockDriect,
            roles: [Roles.superman],
          },
          //加盟仓库
          {
            id: Modules.businessStockAffiliate,
            roles: [Roles.superman, Roles.tester],
          },
          //仓库管理（编辑）
          {
            id: Modules.businessStockUpdate,
            roles: [Roles.superman, Roles.tester],
          },
          //仓库管理（详情）
          {
            id: Modules.businessStockDetail,
            roles: [Roles.superman, Roles.tester],
          },
          //仓库管理（添加）
          {
            id: Modules.businessStockCreate,
            roles: [Roles.superman, Roles.tester],
          },
        ],
      },

      //规则管理
      {
        id: Modules.businessRules,
        roles: [Roles.superman],
        routes: [
          //仓库规则管理
          {
            id: Modules.businessRulesStock,
            roles: [Roles.superman],
          },
          //区域规则管理
          {
            id: Modules.businessRulesArea,
            roles: [Roles.superman],
          },
        ],
      },

      //项目管理
      {
        id: Modules.businessProject,
        roles: [Roles.superman],
        routes: [
          //直营项目
          {
            id: Modules.businessProjectDirect,
            roles: [Roles.superman],
            routes: [
              //操作模块入口
              {
                id: Modules.businessProjectDirectOperate,
                roles: [Roles.superman],
              },
              //商家信息
              {
                id: Modules.businessProjectDirectSellerInfo,
                roles: [Roles.superman],
              },
              //签约信息
              {
                id: Modules.businessProjectDirectSignInfo,
                roles: [Roles.superman],
                routes: [
                  // 编辑签约信息
                  {
                    id: Modules.businessProjectDirectSignEdit,
                    roles: [Roles.superman],
                  },
                ],
              },
              //订单分单规则
              {
                id: Modules.businessProjectDirectOrderRules,
                roles: [Roles.superman],
              },
              //骑士分单规则
              {
                id: Modules.businessProjectDirectCourierRules,
                roles: [Roles.superman],
              },
            ],
          },

          //添加新项目（迁移出来是为了显示面包屑）
          {
            id: Modules.businessProjectDirectAdd,
            roles: [Roles.superman],
          },
          //历史合作项目（迁移出来是为了显示面包屑）
          {
            id: Modules.businessProjectDirectHistory,
            roles: [Roles.superman],
          },

          //加盟项目
          {
            id: Modules.businessProjectAffiliate,
            roles: [Roles.superman],
            routes: [
              //历史合作项目
              {
                id: Modules.businessProjectAffiliateHistory,
                roles: [Roles.superman],
              },
              //操作模块入口
              {
                id: Modules.businessProjectAffiliateOperate,
                roles: [Roles.superman],
              },
              //商家信息
              {
                id: Modules.businessProjectAffiliateSellerInfo,
                roles: [Roles.superman],
              },
              //骑士分单规则
              {
                id: Modules.businessProjectAffiliateOrderRules,
                roles: [Roles.superman],
              },
            ],
          },

          //商家管理
          {
            id: Modules.businessSeller,
            roles: [Roles.superman],
            routes: [
              //商家管理 (编辑)
              {
                id: Modules.businessSellerEdit,
                roles: [Roles.superman],
              },
              //商家管理 (详情)
              {
                id: Modules.businessSellerDetail,
                roles: [Roles.superman],
              },
              //商家管理 (审核)
              {
                id: Modules.businessSellerVerify,
                roles: [Roles.superman],
              },
            ],
          },
          //签约列表
          {
            id: Modules.businessSellerSign,
            roles: [Roles.superman],
            routes: [
              //签约列表 (编辑)
              {
                id: Modules.businessSellerSignEdit,
                roles: [Roles.superman, Roles.tester],
              },
              //签约列表 (详情)
              {
                id: Modules.businessSellerSignDetail,
                roles: [Roles.superman],
              },
            ],
          },
        ],
      },
    ],
  },

  //用户管理相关模块
  {
    id: Modules.managentAccount,
    roles: [Roles.superman],
    routes: [
      //员工管理
      {
        id: Modules.managentEmployee,
        roles: [Roles.superman],
        routes: [
          //员工管理 (列表)
          {
            id: Modules.managentEmployeeList,
            roles: [Roles.superman],
          },
          //员工管理 (编辑)
          {
            id: Modules.managentEmployeeEdit,
            roles: [Roles.superman],
          },
          //员工管理 (创建)
          {
            id: Modules.managentEmployeeCreate,
            roles: [Roles.superman],
          },
          //员工管理 (详情)
          {
            id: Modules.managentEmployeeDetail,
            roles: [Roles.superman],
          },
        ],
      },

      //骑士管理
      {
        id: Modules.managentCourier,
        roles: [Roles.superman],
        routes: [
          //骑士管理 (列表)
          {
            id: Modules.managentCourierList,
            roles: [Roles.superman],
          },
          //骑士管理 (编辑)
          {
            id: Modules.managentCourierEdit,
            roles: [Roles.superman],
          },
          //骑士管理 (创建)
          {
            id: Modules.managentCourierCreate,
            roles: [Roles.superman],
          },
          //骑士管理 (详情)
          {
            id: Modules.managentCourierDetail,
            roles: [Roles.superman],
          },
          //骑士管理 (审核)
          {
            id: Modules.managentCourierVerify,
            roles: [Roles.superman],
          },
        ],
      },
    ],
  },

  //订单管理相关模块
  {
    id: Modules.order,
    roles: [Roles.superman],
    routes: [
      {
        id: Modules.orderBoard,
        roles: [Roles.superman],
        routes: [
          //直营项目
          {
            id: Modules.orderBoardDriect,
            roles: [Roles.superman],
          },
            //加盟项目
          {
            id: Modules.orderBoardAffiliate,
            roles: [Roles.superman],
          },
            //商家管理
          {
            id: Modules.orderBoardSeller,
            roles: [Roles.superman],
          },
        ],
      },

      //异常单列表
      {
        id: Modules.orderException,
        roles: [Roles.superman],
        routes: [
          //直营项目
          {
            id: Modules.orderExceptionDriect,
            roles: [Roles.superman],
          },
          //加盟项目
          {
            id: Modules.orderExceptionAffiliate,
            roles: [Roles.superman],
          },
          //异常订单详情
          {
            id: Modules.orderExceptionDetail,
            roles: [Roles.superman],
          },
        ],
      },
      //订单查询
      {
        id: Modules.orderSearch,
        roles: [Roles.superman],
        routes: [
          //订单查询列表
          {
            id: Modules.orderSearchList,
            roles: [Roles.superman],
          },
          //订单查询详情
          // {
          //   id: Modules.orderSearchDetail,
          //   roles: [Roles.superman],
          // },
        ],
      },
      //订单明细下载
      {
        id: Modules.orderReport,
        roles: [Roles.superman],
        routes: [
          //日订单明细下载
          {
            id: Modules.orderReportDaily,
            roles: [Roles.superman],
          },
          // TODO
          //日订单明细下载new
          // {
          //   id: Modules.orderReportDay,
          //   roles: [Roles.superman],
          // },
          //月订单明细下载
          {
            id: Modules.orderReportMonthly,
            roles: [Roles.superman],
          },
          //订单明细查询详情
          {
            id: Modules.orderReportDetail,
            roles: [Roles.superman],
          },
        ],
      },
      {
        id: Modules.orderDetails,
        roles: [Roles.superman],
      },
    ],
  },

  //分拨中心相关模块
  {
    id: Modules.dispatcher,
    roles: [Roles.superman],
    routes: [
      //站点操作
      {
        id: Modules.dispatcherSiteOperate,
        roles: [Roles.superman],
        routes: [
          // 到站收货
          {
            id: Modules.dispatcherArrive,
            roles: [Roles.superman],
          },
          // 揽收入站
          {
            id: Modules.dispatcherPullin,
            roles: [Roles.superman],
          },
          // 骑士领货
          {
            id: Modules.dispatcherKnightDelivery,
            roles: [Roles.superman],
          },
          // 中转出站
          {
            id: Modules.dispatcherTransfer,
            roles: [Roles.superman],
          },
          // 退货入站
          {
            id: Modules.dispatcherSalesInbound,
            roles: [Roles.superman],
          },
          // 退货出站
          // {
          //     id: Modules.dispatcherSalesOutbound,
          //     roles: [Roles.superman]
          // },
          // 待骑士确认订单
          {
            id: Modules.dispatcherKnightAffirm,
            roles: [Roles.superman],
          },
          // 异常单处理
          {
            id: Modules.dispatcherExceptionOrder,
            roles: [Roles.superman],
          },
          // 配送单查询
          {
            id: Modules.dispatcherDistributionOrder,
            roles: [Roles.superman],
          },
          // 中转单查询
          {
            id: Modules.dispatcherTransferOrder,
            roles: [Roles.superman],
          },
          // 仓订单详情
          {
            id: Modules.dispatcherOrderDetails,
            roles: [Roles.superman],
          },
        ],
      },
      {
        id: Modules.dispatcherOperateRecord,
        roles: [Roles.superman],
        routes: [
          // 入站记录表
          {
            id: Modules.dispatcherInboundRecord,
            roles: [Roles.superman],
          },
          // 出站记录表
          {
            id: Modules.dispatcherOutboundRecord,
            roles: [Roles.superman],
          },
        ],
      },

    ],
  },

  //运营管理相关模块
  {
    id: Modules.operations,
    roles: [Roles.superman],
    routes: [
      //运力调度
      {
        id: Modules.operationsPanel,
        roles: [Roles.superman],
      },
      //运力订单查询
      {
        id: Modules.operationsSearch,
        roles: [Roles.superman],
      },
      // TODO 
      //运力订单明细下载  
      // {
      //   id: Modules.operationsDownloadDay,
      //   roles: [Roles.superman],
      // },
      //运单详情
      {
        id: Modules.operationsOrderDetails,
        roles: [Roles.superman],
      },
    ],
  },

  //数据统计相关模块
  {
    id: Modules.statictics,
    roles: [Roles.superman],
    routes: [
      //骑士订单统计
      {
        id: Modules.staticticsCourier,
        roles: [Roles.superman],
      },
      //骑士订单统计详情
      {
        id: Modules.staticticsCourierDetail,
        roles: [Roles.superman],
      },

      //直营数据统计
      {
        id: Modules.staticticsDriect,
        roles: [Roles.superman],
        routes: [
          //商家数据统计
          {
            id: Modules.staticticsDriectSeller,
            roles: [Roles.superman],
          },
          //商家数据统计详情
          {
            id: Modules.staticticsDriectSellerDetail,
            roles: [Roles.superman],
          },
          //区域数据统计
          {
            id: Modules.staticticsDriectArea,
            roles: [Roles.superman],
          },
          //区域数据统计详情
          {
            id: Modules.staticticsDriectAreaDetail,
            roles: [Roles.superman],
          },
        ],
      },
      //加盟数据统计
      {
        id: Modules.staticticsAffiliate,
        roles: [Roles.superman],
      },
    ],
  },

  //财务中心相关模块
  {
    id: Modules.finance,
    roles: [Roles.superman],
    routes: [{
      id: Modules.financeBills,
      roles: [Roles.superman],
    }, {
      id: Modules.staticticsFinanceList,
      roles: [Roles.superman],
    }, {
      id: Modules.staticticsFinanceDetail,
      roles: [Roles.superman],
    }],
  },

  //个人中心相关模块
  {
    id: Modules.account,
    roles: [Roles.superman],
    routes: [
      {
        id: Modules.accountVendorProfile,
        roles: [Roles.superman],
        routes: [
          {
            id: Modules.accountVendorEdit,
            roles: [Roles.superman],
          },
        ],
      }, {
        id: Modules.accountProfile,
        roles: [Roles.superman],
      },
    ],
  },

  //帮助中心相关模块
  {
    id: Modules.document,
    roles: [Roles.superman],
    routes: [{
      id: Modules.documentManual,
      roles: [Roles.superman],
    },
    {
      id: Modules.documentBusiness,
      roles: [Roles.superman],
    },
    ],
  },
];

//判断是否有module
Modules.hasModule = (rawValue) => {
  return _(Modules).keys().includes(String(rawValue)) || _(Modules).keys().includes(Number(rawValue));
};

//判断是否有详情
Details.hasDetail = (rawValue) => {
  return _(Details).keys().includes(String(rawValue)) || _(Details).keys().includes(Number(rawValue));
};

//判断是否有角色
Roles.hasRole = (rawValue) => {
  return _(Roles).keys().includes(String(rawValue)) || _(Roles).keys().includes(Number(rawValue));
};

//获取详情信息
Modules.getDetail = (rawValue) => {
  if (rawValue === undefined) {
    return {}
  }

  if (Details.hasDetail(rawValue) === true) {
    const detail = Details[rawValue];
    detail.id = rawValue;
    return detail;
  }
  return {}
}

//获取模块路径
Modules.getPath = (rawValue) => {
  return Modules.getDetail(rawValue).path
}

//获取路径的URI
Modules.getPathURI = (rawValue) => {
  const modulePath = Modules.getPath(rawValue);
  return modulePath.replace('/#', '');
}

//判断路径与模块路径是否一致
Modules.equalPath = (rawValue, path) => {
  const modulePath = Modules.getPath(rawValue);
  const uri = modulePath.replace('/#', '');
  if (path === uri) {
    return true;
  }
  return false;
}

Modules.getComponent = (detail) => {
  const {
    path,
    component,
  } = detail;
  const uri = path.replace('/#/', '');

  if (component) {
    return {
      path: uri,
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, component);
        })
      },
    }
  }
  return {
    path: uri,
  };
}

module.exports = {
  Roles,
  Modules,
  Router,
}
