module.exports = {
  EMPLOYEE: {
    find: 'businessEmployee/fetchEmployeeList',
    create: 'businessEmployee/createEmployee',             //添加新员工
    update: 'businessEmployee/updateEmployeeDetail',       //更新员工数据
    getDetail: 'businessEmployee/fetchEmployeeDetail',
    updateDetail: 'businessEmployee/reduceUpdateEmployee',
    list: 'businessEmployee/reduceEmployeeList',
  },
  COURIER: {
    find: 'businessCourier/fetchCourierList',
    getDetail: 'businessCourier/getDetail',
    upload: 'businessCourier/upload',
    creates: 'businessCourier/createCourier',
    updates: 'businessCourier/updateCourier',
    approve_verify: 'businessCourier/approveVerify',
    list: 'businessCourier/reduceCourierList',
    updateDetail: 'businessCourier/reduceCourierDetail',
    uploadOK: 'businessCourier/reduceUpload',
  },
  TEAM: {
    getTeamList: 'businessCourier/getTeam',
  },
};
