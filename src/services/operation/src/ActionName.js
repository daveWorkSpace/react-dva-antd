/**
 * Created by user on 17/2/15.
 */

module.exports = {

  OperationOrder: {
    fetchTotalOrderStatistics: 'operationOrder/fetchTotalOrderStatistics', //获取分单中心－订单状态
    fetchSellerOrderList: 'operationOrder/fetchSellerOrderList',           //获取分单中旬－商家列表
    fetchOrderCityList: 'operationOrder/fetchOrderCityList',               //获取分单中心－城市列表

    fetchCloseOrderList: 'operationOrder/fetchCloseOrderList',             //获取异常列表－异常订单列表
    fetchCloseOrderDetail: 'operationOrder/fetchCloseOrderDetail',         //获取异常列表－异常订单详情
    fetchCloseOrderLog: 'operationOrder/fetchCloseOrderLog',               //获取异常列表－异常订单日志
    fetchCloseOrderRedivides: 'operationOrder/fetchCloseOrderRedivides',   //获取异常列表－异常订单详情页操作：重新分单
    fetchCloseOrder: 'operationOrder/fetchCloseOrder',                     //获取异常列表－异常订单详情页操作：关闭订单

    fetchSellerOrderStatistics: 'operationOrder/fetchSellerOrderStatistics', //获取商家订单状态
    fetchAreaOrderList: 'operationOrder/fetchAreaOrderList',                 //获取区域订单
  },
};
