module.exports = {
  CONTROL_PANEL: {
    areaList: 'tmsControlPanel/fetchAreaList', //根据城市获取区域
    shipments: {
      query: 'tmsControlPanel/fetchShipmentList', //调度中运单的查询
      stats: 'tmsControlPanel/fetchShipmentStatistics',  //运单的数据
      close: 'tmsControlPanel/closeShipmentOrder',  //关闭运单
      clear: 'tmsControlPanel/clearShimpents',      //清空运单数据
    },
    couriers: {
      query: 'tmsControlPanel/fetchCourier', //查询调度中骑士的信息
      reassign: 'tmsControlPanel/reassignCourier', //关于骑士的改派
    },
    modalVisible: 'tmsControlPanel/reassignModalVisible', //模态框的状态
  },
};
