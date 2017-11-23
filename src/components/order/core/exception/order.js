/**
 * Created by user on 17/2/16.
 */
import request from 'aoao-core-api-service/lib/utils/request';
import qs from 'qs';

//封装判断请求数据是否为空
const getDataType = (data) => {
  if (data && data.hasOwnProperty('data') && data.data.hasOwnProperty('data')) {
    return data.data.data;
  }
  return [];
};

//获取商家列表订单统计  --- 优化代码－反向思维
export async function fetchTotalOrderStatistics(vendorId, cityCode, shippingDate, isDirect) {
  const params = {
    vendor_id: vendorId,
    city_code: cityCode,
    shipping_date: shippingDate,
    is_direct: isDirect,
  };
  return request(`vendor_order/total_statistics/?${qs.stringify(params)}`)
    .then((data) => {
      if (data && data.hasOwnProperty('data') && data.data.hasOwnProperty('data')) {
        return data.data.data;
      }
    })
}

//获取区域列表订单统计
export async function fetchSellerOrderStatistics(vendorId, sellerId, cityCode, shippingDate) {
  const params = {
    vendor_id: vendorId,
    seller_id: sellerId,
    city_code: cityCode,
    shipping_date: shippingDate,
  };
  return request(`vendor_order/total_statistics/?${qs.stringify(params)}`)
    .then((data) => {
      if (data.hasOwnProperty('data') === false && data.data.hasOwnProperty('data') === false) {
        return;
      }
      return data.data.data;
    });
}

//获取城市列表
export async function fetchOrderCityList(vendorId) {
  const params = {
    vendor_id: vendorId,
  };
  return request(`utils/vendor_cities?${qs.stringify(params)}`)
    .then((data) => {
      if (data.hasOwnProperty('data') === false && data.data.hasOwnProperty('data') === false) {
        return;
      }
      return data.data.data;
    });
}

//获取商家订单列表
export async function fetchSellerOrderList(vendorId, cityCode, shippingDate, page, limit, sort) {
  const params = {
    vendor_id: vendorId,
    city_code: cityCode,
    shipping_date: shippingDate,
    page,
    limit,
    sort,
  };
  return request(`vendor_order/statistics_by_seller?${qs.stringify(params)}`)
    .then((data) => {
      if (data.hasOwnProperty('data') === false && data.data.hasOwnProperty('data') === false) {
        return;
      }
      return data.data;
    });
}

//获取区域订单列表
export async function fetchAreaOrderList(sellerId, vendorId, cityCode, shippingDate, isDirect, page, limit, sort) {
  const params = {
    seller_id: sellerId,
    vendor_id: vendorId,
    city_code: cityCode,
    shipping_date: shippingDate,
    is_direct: isDirect,
    page,
    limit,
    sort,
  };
  return request(`vendor_order/statistics_by_area?${qs.stringify(params)}`)
    .then((data) => {
      if (data.hasOwnProperty('data')) {
        return data.data;
      }
    });
}

//获取异常订单列表
export async function fetchCloseOrderList(vendorId, cityCode, startDate, endDate, state, page, limit, sort) {
  const params = {
    vendor_id: vendorId,
    city_code: cityCode,
    start_date: startDate,
    end_date: endDate,
    state,
    page,
    limit,
    sort,
  };
  return request(`vendor_order/?${qs.stringify(params)}`)
    .then((data) => {
      if (data.hasOwnProperty('data')) {
        return data.data;
      }
    });
}

//异常订单详情
export async function fetchCloseOrderDetail(orderId) {
  const params = {
    order_id: orderId,
  };
  return request(`vendor_order/${params.order_id}`)
    .then((data) => {
      if (data.hasOwnProperty('data')) {
        return data.data
      }
      return [];
    });
}

//异常订单日志
export async function fetchCloseOrderLog(shipmentId, page, limit, sort) {
  const params = {
    shipment_id: shipmentId,
    page,
    limit,
    sort,
  };
  return request(`shipments/${params.shipment_id}/track_logs/?page=${page}&limit=${limit}`)
    .then((data) => {
      if (data.hasOwnProperty('data')) {
        return data.data;
      }
    });
}

//异常订单详情页操作－－－重新分单
export async function fetchCloseOrderRedivides(vendorId, orderId, operatorId, note) {
  const params = {
    vendor_id: vendorId,
    order_ids: orderId,
    operator_id: operatorId,
    note,
  };
  return request(`vendor_order/reassign/?${qs.stringify(params)}`)
    .then((data) => {
      if (data.hasOwnProperty('data')) {
        return data.data;
      }
    });
}

//异常订单详情页操作－－－关闭订单
export async function fetchCloseOrder(orderId, closedType, closedNote, operatorId) {
  const params = {
    order_ids: orderId,
    closed_typ: closedType,
    closed_note: closedNote,
    operator_id: operatorId,
  };
  return request(`vendor_order/close/?${qs.stringify(params)}`)
    .then((data) => {
      if (data.hasOwnProperty('data')) {
        return data.data;
      }
    });
}
