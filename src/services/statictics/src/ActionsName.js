module.exports = {
  SELLER: {
    find: 'staticticsShipmentsSeller/fetchShipmentSeller',    //查询商家
  },
  AREA: {
    find: 'staticticsShipmentsArea/fetchShipmentAreaList', //区域查询
  },
  CORUIER: {
    find: 'staticticsShipmentsCourier/fetchShipmentCourierList',  //骑士查询
  },

  DETAIL: {
    queryList: 'staticticsShipmentsDetailDown/fetchShipmentDetailDownloadList', //运单详情下载的查询
    downUrl: 'staticticsShipmentsDetailDown/fetchShipmentDetailDownloadURL',  //下载的url
    find: 'staticticsShipmentsDetail/fetchShipmentDetail', //运单详情查询
    sellerList: 'staticticsShipmentsDetail/fetchSellerByType', //商家列表
    clearSeller: 'staticticsShipmentsDetail/clearSellers', //清空商家列表
  },
  //数据罗盘
  COMPASS: {
    find: 'statictics_compass/fetchCompass',
  },
  MONITO: {  //实时监控
    find: 'staticticsMonitor/fetchMonitorData',
  },

}
