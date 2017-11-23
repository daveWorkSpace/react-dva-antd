/**
 * Created by dave 17/1/2
 * 业务模块供应商管理service层
*/
import request from 'aoao-core-api-service/lib/utils/request';
import qs from 'qs';
import {createlistparam} from 'aoao-core-api-service/lib/utils/utils';

/*获取供应商信息*/
export async function getSupplierMessage(){
    return request()
}

// 获取直营以及加盟的区域总列表
export async function fetchAreasTotalList(params){
  return request(`areas/total_list/?${qs.stringify(params)}`)
    .then((data) => data.data );
}

// 获取区域总列表
export async function fetchAreasRetailOrJoin(params){
  return request(`areas/?${qs.stringify(params)}`)
    .then((data) => data.data );
}

export async function getCityVendorList(params){
  return request(`vendor_biz_info/vendor_total_list?${qs.stringify(params)}`)
    .then((data) => data.data);
}
