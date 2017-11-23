module.exports = {
  // 产品服务模块
  SERVICE: {
    find: 'businessProductSetup/fetchService', //查询服务
    creates: 'businessProductSetup/createService', //创建服务
    updates: 'businessProductSetup/updateService', //更新服务的信息
    enable: 'businessProductSetup/activeService', //启用服务成为可用的版本
    switchCase: 'businessProductSetup/setStatus', //切换页面的状态
    changeVisible: 'businessProductSetup/changeVisible', //改变模态框的状态
  },
  // 员工模块
  EMPLOYEE: {
    find: 'businessEmployee/fetchEmployeeList', //查询员工列表
    creates: 'businessEmployee/createEmployee', //添加新员工
    getDetail: 'businessEmployee/fetchEmployeeDetail', //获取员工的信息
    updates: 'businessEmployee/updateEmployeeDetail', //更新员工信息
    updateDetail: 'businessEmployee/reduceUpdateEmployee', //更新员工的资料
    list: 'businessEmployee/reduceEmployeeList', //查询员工列表信息成功
  },
  // 签约模块
  SIGN: {
    find: 'businessSign/fetchSignList', //查询签约列表
    getDetail: 'businessSign/fetchSignDetail', //获取签约的详情
    updates: 'businessSign/updateSignList', //更新签约的信息
    search: 'businessSign/searchSignList', //签约列表条件的查询
  },

  // 骑士模块
  COURIER: {
    find: 'businessCourier/fetchCourierList', //骑士列表的查询
    getDetail: 'businessCourier/getDetail', //获取骑士的详情
    upload: 'businessCourier/upload',
    creates: 'businessCourier/createCourier', //创建新的骑士
    updates: 'businessCourier/updateCourier', //更新新的骑士
    approve_verify: 'businessCourier/approveVerify', //骑士的审核
    list: 'businessCourier/reduceCourierList', //骑士查询成功
    updateDetail: 'businessCourier/reduceCourierDetail', //更新骑士的信息
    uploadOK: 'businessCourier/reduceUpload',
  },

  // 商家模块
  SELLER: {
    find: 'businessSeller/fetchSellerList', //商家搜索
    getDetail: 'businessSeller/fetchSellerDetail', //商家详情
    approve_verify: 'businessSeller/approveVerifySellerList', //商家的身份审核
    updates: 'businessSeller/updateSeller', //更新商家的信息
    getSellerShops: 'businessSeller/fetchSellerShopInfo', //获取商家的店铺信息
  },

  RETAIL: {
    basicinfo: 'manageRetail/basicinfo',

  },
}
