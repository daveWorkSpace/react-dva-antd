module.exports = [
  require('./dispatcher/siteOperate.js'),
  require('./dispatcher/operateRecord.js'),
  require('./core/index.js'),
  require('./account/profile.js'),                  //用户账户信息，服务商审核相关
  require('./account/authorize.js'),                //用户登陆注册，授权相关
  require('./business/service.js'),                 //产品配置
  require('./business/stock.js'),                   //仓库相关
  require('./business/area.js'),                    //区域相关
  require('./business/project/project.js'),         //项目管理
  require('./business/project/rules.js'),           //项目管理 -> 分单规则
  require('./business/supplier/service.js'),        //区域承运表，仓库承运表 TODO：（这个名字，英文都不知道怎么起）
  require('./operations/search.js'),                //运力订单查询
  require('./order/order.js'),                      //订单管理
  require('./common/sellersList.js'),               //商户列表
  require('./common/areasList.js'),                 //区域列表
  require('./common/download.js'),                  //导出列表
]
