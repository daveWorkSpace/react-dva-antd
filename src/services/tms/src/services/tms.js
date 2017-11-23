import request from 'aoao-core-api-service/lib/utils/request';
import qs from 'qs';


export async function areas_total_list(param) {
  const params = {
    vendor_id: param.vendor_id,
    city_code: param.city_code
  };
  return request(`areas/total_list?${qs.stringify(params)}`)
          .then((data) => {
            const result = [];
            data.data.data.forEach((item)=>{
              if (item.hasOwnProperty('vendor') === true) {
                item.name = `${item.name}(${item.vendor.name})`;
                item.vendor_id = item.vendor.id;
                result.push(item);
              }
            })
            return result;
          });
}
