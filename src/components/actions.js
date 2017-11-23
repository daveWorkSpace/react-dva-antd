module.exports = {
  //账户授权相关
  AccountAuthorizeActions: {
    login: 'AccountAuthorize/login',                          //登录提交
    register: 'AccountAuthorize/register',                    //注册提交
    sendLoginSms: 'AccountAuthorize/sendLoginSms',            //获取登录验证码
    sendRegisterSms: 'AccountAuthorize/sendRegisterSms',      //获取注册验证码
    auth: 'AccountAuthorize/auth',                            //授权服务商账号
    fetchVendors: 'AccountAuthorize/fetchVendors',            //获取注册账户相关的服务商列表
  },

  AccountProfile: {
    requestVerify: 'AccountProfile/requestVerify',          //请求认证
    uploadVerifyImage: 'AccountProfile/uploadVerifyImage',  //上传认证图片
    updateVendorVerifyInfo: 'AccountProfile/updateVendorVerifyInfo',  //更新服务商审核信息
    resetUploadVerifyState: 'AccountProfile/resetUploadVerifyState',   //重置上传成功的状态
    resetUpdateVendorVerifyState: 'AccountProfile/resetUpdateVendorVerifyState',  //重置更新服务商审核信息状态
  },

  //项目管理
  ProjectManage: {
    getProjectList: 'ProjectManage/getProjectList',                     //获取项目列表
    getNewProjectList: 'ProjectManage/getNewProjectList',               //查询新项目列表
    addNewProject: 'ProjectManage/addNewProject',                       //添加新项目
    updateAddNewProjectState: 'ProjectManage/updateAddNewProjectState', //添加新项目状态更新函数
    getSignSellerLists: 'ProjectManage/getSignSellerLists',             //获取签约合作项目
    getSellerInfo: 'ProjectManage/getSellerInfo',                       //获取商户详情
    getSellerShopList: 'ProjectManage/getSellerShopList',               //获取商户店铺列表
    getSignedInfos: 'ProjectManage/getSignedInfos',                     //获取签约详细信息
    fetchContractServiceDetail: 'ProjectManage/fetchContractServiceDetail',       //获取签约详细信息映射版
    updateContractService: 'ProjectManage/updateContractService',                 //更新签约信息
    resetContractServiceCallback: 'ProjectManage/resetContractServiceCallback',   //重置请求成功回调
  },

  //服务产品设置
  BusinessServiceActions: {
    fetchServiceList: 'BusinessService/fetchServiceList',       //获取服务产品设置列表
    fetchServiceDetail: 'BusinessService/fetchServiceDetail',   //获取服务产品设置详情
    createService: 'BusinessService/createService',             //创建服务产品设置
    updateService: 'BusinessService/updateService',             //更新服务产品设置
    resetCreateService: 'BusinessService/resetCreateService',   //重置创建产品服务的回调状态
    resetUpdateService: 'BusinessService/resetUpdateService',   //重置更新产品服务的回调状态
  },

  //分拨管理相关
  DispatcherActions: {
    getBaiduText2Audio: 'SiteOperate/getBaiduText2Audio', //百度语音合成
    fetchStockOrdersCancleMarkError: 'SiteOperate/fetchStockOrdersCancleMarkError', //仓订单批量取消标记异常接口
    fetchStockOrdersOut: 'SiteOperate/fetchStockOrdersOut', //仓订单批量出站接口
    getStockOrdersList: 'SiteOperate/getStockOrdersList', //查询仓订单
    fetchStockOrdersClose: 'SiteOperate/fetchStockOrdersClose', //仓订单批量关闭接口
    fetchStockOrdersMarkError: 'SiteOperate/fetchStockOrdersMarkError', //仓订单标记异常
    getStockOrdersDetail: 'SiteOperate/getStockOrdersDetail', //仓订单详情
    fetchStockOrdersIn: 'SiteOperate/fetchStockOrdersIn', //仓订单入站
    fetchStockOrdersRedispatch: 'SiteOperate/fetchStockOrdersRedispatch', //仓订单重新分配接口
    updateStateFunc: 'SiteOperate/updateStateFunc', //纯更新状态函数
    clearStockOrder: 'SiteOperate/clearStockOrder', //清除仓订单数据
    updateStateByStockOrderFunc: 'SiteOperate/updateStateByStockOrderFunc', //请求仓订单列表更新函数
    fetchStockOrdersAssigned: 'SiteOperate/fetchStockOrdersAssigned', //仓订单批量分配
    getCouriersDetails: 'SiteOperate/getCouriersDetails', //根据骑士id 获取骑士详情
    getStockOrdersStatistic: 'SiteOperate/getStockOrdersStatistic',   //仓库日订单实时统计接口
    getStockOrdersDetails: 'SiteOperate/getStockOrdersDetails',   //仓订单详情
    getVoiceAccessToken: 'SiteOperate/getVoiceAccessToken',   //百度语音合成token
    getStockListByNext: 'SiteOperate/getStockListByNext',   //获取下一站列表
    clearStockListByNext: 'SiteOperate/clearStockListByNext',   //清空下一站列表


    /** 操作记录 */
    getStockOrdersLog: 'OperateRecord/getStockOrdersLog',         //获取仓订单日志
  },

  //项目管理 - 分单规则
  SendOrderRules: {
    //订单分单规则
    getAreaList: 'SendOrderRules/getAreaList', //获取该服务商下所有的区域
    getOrderRuleDetails: 'SendOrderRules/getOrderRuleDetails', //获取订单分单规则详情
    getServiceProviders: 'SendOrderRules/getServiceProviders', //获取服务商列表
    addOrderRule: 'SendOrderRules/addOrderRule', //添加订单分担规则
    updataStateFunc: 'SendOrderRules/updataStateFunc', //更新数据状态信号
    deleteOrderRules: 'SendOrderRules/deleteOrderRules', //删除订单分单规则
    editOrderRule: 'SendOrderRules/editOrderRule', //编辑订单分单规则
    getStockList: 'SendOrderRules/getStockList', //获取仓库列表

    //骑士分单规则
    getKnightRuleDetails: 'SendOrderRules/getKnightRuleDetails', //获取骑士分单规则详情
    getCanSelectTeams: 'SendOrderRules/getCanSelectTeams',    //获取可选择团队列表
    addKnightRule: 'SendOrderRules/addKnightRule',            //添加骑士分担规则
    deleteKnightRules: 'SendOrderRules/deleteKnightRules',    //删除骑士分单规则
    editKnightRule: 'SendOrderRules/editKnightRule',          //编辑骑士分单规则

    // sop 规则设置
    getSopRulesList: 'SendOrderRules/getSopRulesList',         //获取标准规则列表接口
    updateSopRulesList: 'SendOrderRules/updateSopRulesList',   //更新标准规则接口
    createSopRulesList: 'SendOrderRules/createSopRulesList',   //创建标准规则接口
  },

  //   项目管理 - 承运商管理
  BusinessSupplierService: {
    getSupplierLists: 'BusinessSupplierService/getSupplierLists', //获取承运商列表
    getSupplierDetails: 'BusinessSupplierService/getSupplierDetails', //获取供应商信息详情
    getAddAreaList: 'BusinessSupplierService/getAddAreaList', //可供选择添加的区域列表
    getAreaList: 'BusinessSupplierService/getAreaList', //获取区域列表
    editAreas: 'BusinessSupplierService/editAreas', //编辑合作区域信息
    updataStateFunc: 'BusinessSupplierService/updataStateFunc', //更新数据状态信号
    submitAdds: 'BusinessSupplierService/submitAdds', //提交添加的区域信息
    submitAreaStateFunc: 'BusinessSupplierService/submitAreaStateFunc', //更新添加合作区域状态信号
    closeBusinessE: 'BusinessSupplierService/closeBusinessE', //服务商关闭业务
    openBusinessE: 'BusinessSupplierService/openBusinessE', //服务商开启业务
    modifyBusinessState: 'BusinessSupplierService/modifyBusinessState', //业务状态修改时改变model state
    getVendorSupplierList: 'BusinessSupplierService/getVendorSupplierList', //查询某服务商所有承运商列表
    addSuppliers: 'BusinessSupplierService/addSuppliers', //提交添加供应商信息
    fetchAreaListBySupplier: 'BusinessSupplierService/fetchAreaListBySupplier', //区域承运表
    fetchAllSuppliers: 'BusinessSupplierService/fetchAllSuppliers',                     //获取所有的供应商
  },

  // 仓库管理
  BusinessStock: {
    getStockListByUnity: 'BusinessStock/getStockListByUnity',   //获取合作仓库列表
    unsignVendors: 'BusinessStock/unsignVendors',               //解约产品接口
    updataStateFunc: 'BusinessStock/updataStateFunc',           //更新数据状态信号
    updataStockStateFunc: 'BusinessStock/updataStockStateFunc', //更新仓库数据状态信号
    getStockListByDirect: 'BusinessStock/getStockListByDirect', // 获取直营仓库列表
    getStockDispatchRuleByDirect: 'BusinessStock/getStockDispatchRuleByDirect',       // 直营项目中转仓当前仓库分配规则查询
    createStockDispatchRuleByDirect: 'BusinessStock/createStockDispatchRuleByDirect',       // 直营项目中转仓添加仓库分配规则
    updateStockDispatchRuleByDirect: 'BusinessStock/updateStockDispatchRuleByDirect', // 直营项目中转仓编辑仓库分配规则
    getStockListByDelivery: 'BusinessStock/getStockListByDelivery',                   // 获取所有配送站列表
    fetchStockListByArea: 'BusinessStock/fetchStockListByArea', //根据区域获取仓库列表
    fetchDriectList: 'BusinessStock/fetchDriectList',       //获取直营仓库列表
    fetchAffiliateList: 'BusinessStock/fetchAffiliateList', //获取加盟仓库列表
    fetchDetail: 'BusinessStock/fetchDetail',               //获取仓库详情
    createStock: 'BusinessStock/createStock',               //创建仓库
    updateStock: 'BusinessStock/updateStock',               //更新仓库
    createStockArea: 'BusinessStock/createStockArea',       //创建仓库区域
    deleteStockArea: 'BusinessStock/deleteStockArea',       //删除仓库区域
    resetCreateStock: 'BusinessStock/resetCreateStock',     //重置创建仓库回调
    resetUpdateStock: 'BusinessStock/resetUpdateStock',     //重置更新仓库回调
    resetCreateStockArea: 'BusinessStock/resetCreateStockArea', //重置创建仓库区域回调
    resetDeleteStockArea: 'BusinessStock/resetDeleteStockArea', //重置删除仓库区域回调
  },

  //区域
  BusinessAreaActions: {
    fetchAreas: 'BusinessArea/fetchAreas',          //获取全部区域
    fetchAreaRules: 'BusinessArea/fetchAreaRules',  //获取区域规则
    fetchSupplyVendorList: 'BusinessArea/fetchSupplyVendorList',   //获取供应商列表
    fetchCityList: 'BusinessArea/fetchCityList',                   //获取城市列表
    fetchDirectAreaList: 'BusinessArea/fetchDirectAreaList',       //获取直营区域列表
    fetchFranchiseAreaList: 'BusinessArea/fetchFranchiseAreaList', //获取加盟区域列表
    fetchAreaDetail: 'BusinessArea/fetchAreaDetail',               //获取区域详情
    fetchAreaDraftDetail: 'BusinessArea/fetchAreaDraftDetail',     //获取区域草稿
    publishArea: 'BusinessArea/publishArea',                       //发布区域
    createArea: 'BusinessArea/createArea',                         //创建父级区域
    createSubArea: 'BusinessArea/createSubArea',                   //创建子级区域
    updateArea: 'BusinessArea/updateArea',                         //更新区域信息
    resetAreaDetail: 'BusinessArea/resetAreaDetail',               //重置区域详情
    resetAreaDraftDetail: 'BusinessArea/resetAreaDraftDetail',     //重置草稿数据
    resetFranchiseAreaList: 'BusinessArea/resetFranchiseAreaList', //重置加盟列表数据
    resetUpdateAreaCallback: 'BusinessArea/resetUpdateAreaCallback',   //重置保存成功后的回调
    resetCreateAreaCallback: 'BusinessArea/resetCreateAreaCallback',   //重置创建区域后的回调
    resetPublishAreaCallback: 'BusinessArea/resetPublishAreaCallback', //重置发布成功后的回调
  },

  // 运营管理
  OperationsManage: {
    getShipmentsList: 'OperationsManage/getShipmentsList',       //获取运单列表数据
    getShipmentsDetails: 'OperationsManage/getShipmentsDetails',       //获取运单详情
    getShipmentsTrackLogs: 'OperationsManage/getShipmentsTrackLogs',       //获取运单详情
    getPushOrderRecord: 'OperationsManage/getPushOrderRecord',       //通过运单ID获取该运单的推单记录


  },


  OrderManage: {
    getVendorOrderList: 'OrderManage/getVendorOrderList',                   //获取服务商订单列表数据
    closeSingleVendorOrder: 'OrderManage/closeSingleVendorOrder',     //关闭一个订单
    closeMultiVendorOrders: 'OrderManage/closeMultiVendorOrders',     //批量关闭订单
    updateStateFunc: 'OrderManage/updateStateFunc',                   //纯更新状态函数
    getOrderDetails: 'OrderManage/getOrderDetails',                   //获取服务商订单详情
    getOrderTrackLogs: 'OrderManage/getOrderTrackLogs',                   //通过订单ID获取该订单的物流信息
    getShipmentsDailyByVendor: 'OrderManage/getShipmentsDailyByVendor',                   //日订单统计接口
    getDownloadFileUrl: 'OrderManage/getDownloadFileUrl',                   //下载统计文件接口
  },

  // 公共模块
  CommonManage: {
    fetchSellersList: 'commonSellers/fetchSellersList',   //获取商户列表
    clearSellersList: 'commonSellers/clearSellersList',   //清除商戶列表
    fetchAreasList: 'commonAreas/fetchAreasList',         //获取区域列表
    getExportList: 'commonDownload/getExportList',        //获取导出列表
    createExportList: 'commonDownload/createExportList',  //创建导出任务
  }

}
