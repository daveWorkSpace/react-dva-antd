//列表类型（直营，加盟）
const RelateType = {
  directType: '10',    //直营
  franchiseType: '20', //加盟
};

const AreaState = {
  all: '',    //全部状态
  draft: 0,   //草稿
  on: 100,    //启用
  off: -100,  //禁用
  //使用初始化
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
        return '未知';
    }
  },
}

module.exports.RelateType = RelateType;
module.exports.AreaState = AreaState;
