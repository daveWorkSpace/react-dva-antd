import dot from 'dot-prop'
import { hashHistory, routerRedux } from 'dva/router';
import { message } from 'antd';
import {
  tms_shipments_find,
  tms_shipments_find_one,
  tms_shipments_find_one_logs,
  tms_couriers_find,
  tms_shipments_close,
  tms_reassign,
  tms_shipments_statistics,
  tms_courier_shipments_statistics,
} from 'aoao-core-api-service/lib/tms';
import { tms_push_order_find } from 'aoao-core-api-service/lib/tms';
import { area_find_500, area_find_one, courier_find_500, seller_find_one } from 'aoao-core-api-service/lib/business';
import { fetchCityList } from 'aoao-core-api-service/lib/public';
import { areas_total_list } from '../services/tms';
import aoaoAppSystemFlag from './../../../../utils/systemConfig';
import { authorize } from './../../../../application';

const { dateFormat } = window.tempAppTool;

// 运力调度各tab及相关取值状态如下：
// 待分配：待分配 10
// 已接单：已接单 20
// 已取货：已取货 24
// 未完成：已创建 5 、待分配 10、已分配 15、待接单 16、已接单 20、已到店 22、已取货 24、异常 -50
// 异常：异常 -50
// 已送达：已送达 100
// 已取消：已取消 -100
// 全部：已创建 5、待分配 10、已分配 15、待接单 16、已接单 20、已到店 22、已取货 24、异常 -50、已取消、已送达

// 运单状态&运单配送状态对照表
const shipment_states_dict = {
  1: '20',      //已接单
  2: '24',      //已取货
  3: '5|10|15|16|20|22|24|-50', //未完成 = 已创建|已确认|配送中
  4: '-50',     //异常
  5: '100',     //已送达
  6: '-100',    //已取消
  7: 'no',      //全部
  8: '10',      //待分配
};

// help函数返回到调度中心的运单列表页面
function toList() {
// 定时器
  setTimeout(() => {
    window.location.href = '/#/tms/control_panel';
  }, 1500);
}

module.exports = {

  namespace: 'tmsControlPanel',
  state: {
    areas: { //调度模块的区域区域模块
      data: [], //调度模块的区域区域
    },
    areas_total_list: {
      data: [],
    },
    serviceCityList: [],    //请求城市列表
    default_area_id: '',    //默认的区域区域
    default_area_name: '',  //默认的区域名称
    default_city_code: '',    //默认的城市区域
    default_city_name: '',  //默认的城市名称
    vendor_id: '',          //服务商的ID
    couriers: {             //骑士的信息
      data: [],             //骑士列表的数据
      loading: false,       //是否loading的开关 默认是关闭状态
      _meta: {},            // 服务器端返回的附带信息（包括总共多少条，后面还有没有数据的一个对象）
    },
    shipments: {       //调度模块的运单信息
      data: [],        //调度模块的运单列表数据
      loading: false,  //是否loading的开关 默认是关闭状态
      _meta: {},       // 服务器端返回的附带信息（包括总共多少条，后面还有没有数据的一个对象）
    },
    pushOrderDetails: {},     //推单记录
    shipments_stats: {}, //调度模块的运单状态信息
    shipment_detail: {}, //调度模块的运单详情信息
    shipment_log: [],    //调度模块的运单日志信息
    shipment_area: {},   //调度模块的区域运单信息
    visible: false,      //调度模块模态框的状态显示 默认是隐藏
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        // 获取服务商的ID
        const vendor_id = authorize.auth.vendorId;

        // 获取城市信息
        const city_code = dot.get(authorize.vendor, 'city.code');
        const city_name = dot.get(authorize.vendor, 'city.name');
        const { pathname } = location;
        //拿缓存信息，如果有，则从缓存中取
        // const unmountKey = window.sessionStorage && JSON.parse(sessionStorage.getItem('COMPONENT_UNMOUNT'));
        // if (unmountKey) {
        //   // const cityInfo = window.sessionStorage && JSON.parse(sessionStorage.getItem('CITYINFO'))
        //   if (cityInfo && cityInfo.city_code && cityInfo.city_name) {
        //     city_code = cityInfo.city_code;
        //     city_name = cityInfo.city_name;
        //   }
        // }

        // 进入页面的初始化操作
        if (pathname === '/tms/control_panel') {
          dispatch({
            type: 'controlPanelInit',
            payload: { city_code, default_city_code: city_code, city_name, vendor_id },
          });
        }

        // 如果跳转到详情页面
        if (location.pathname === '/tms/control_panel/detail') {
          const { query } = location;
          //获取运单详情
          dispatch({
            type: 'fetchShipmentDetail',
            payload: query,
          });
          const pushParam = {
            shipment_id: query.id,
            sort: '{"created_at": -1}',
          }
          dispatch({
            type: 'pushShipmentOrder',
            payload: pushParam,
          });
        }
      });
    },
  },

  effects: {

    // 调度页面初始化
    * controlPanelInit(params, { call, put }) {
      // 获取参数
      const { vendor_id, city_code, city_name } = params.payload;
      // 请求区域
      const result_areas = yield call(area_find_500, { state: 100, vendor_id, city_code, is_filter_sub_area: true });
      //获取加盟区域
      const result_total_areas = yield call(areas_total_list, { vendor_id, city_code });

      // 返回区域的数据处理
      if (result_areas.err) {
        message.error('直营区域查询失败！');
      } else {
        const areas = result_areas.data;
        //合并加盟区域数据
        areas.data = areas.data.concat(result_total_areas);
        if (areas.data.length === 0) {
          //暂无可用区域，请先创建区域！
          message.error('暂无可用区域，请先创建区域！！');
        } else {
          //取出第一个区域,如果有缓存从缓存里面取
          let { id, name } = areas.data[0];

          //TODO：修正默认的区域数据错误问题
        //   const areaInfo = {
        //     area_id: id,
        //     area_name: name,
        //   }
        //   window.sessionStorage && sessionStorage.setItem('AREAINFO', JSON.stringify(areaInfo));

          //当区域名字和Id 有缓存时，取缓存信息做下次请求参数 2017-3-14 modified by liuli
          const unmountKey = window.sessionStorage && JSON.parse(sessionStorage.getItem('COMPONENT_UNMOUNT'));
          let tabState;
          //unmountKey 为卸载组件key即跳转到其他页面的标记key，刷新页面不会卸载组件
          if (unmountKey) {
            // //拿缓存
            const areaInfo = window.sessionStorage && JSON.parse(sessionStorage.getItem('AREAINFO'))
            // const cityInfo = window.sessionStorage && JSON.parse(sessionStorage.getItem('CITYINFO'))
            const tabValue = window.sessionStorage && JSON.parse(sessionStorage.getItem('TAB_VALUE'))
            //
            if (areaInfo && areaInfo.area_id && areaInfo.area_name) {
              id = areaInfo.area_id;
              name = areaInfo.area_name;
            }
            tabState = tabValue || '1'
            window.sessionStorage && sessionStorage.removeItem('COMPONENT_UNMOUNT');
          } else {
            tabState = '1';
            //重置
            window.sessionStorage && sessionStorage.removeItem('SELECT_TAB_INDEX')
            window.sessionStorage && sessionStorage.removeItem('AREAINFO')
            window.sessionStorage && sessionStorage.removeItem('CITYINFO')
            window.sessionStorage && sessionStorage.removeItem('TAB_VALUE')
          }

          // 请求城市列表

          //获取服务商服务城市
          if (aoaoAppSystemFlag.HAS_MORE_CITY === true) {
            const serviceCityList = yield call(fetchCityList, vendor_id);
            if (serviceCityList && serviceCityList.length > 0) {
              yield put({
                type: 'getServiceCityList',
                payload: serviceCityList,
              })
            }
          }

          // 设置默认区域的名字和城市为第一个区域的信息
          yield put({
            type: 'reduceInit',
            payload: { city_code, default_city_code: city_code, default_city_name: city_name, default_area_id: id, default_area_name: name, areas, vendor_id },
          });
          // 初始化运单
          yield put({
            type: 'fetchShipmentList',
            payload: { city_code, area_id: id, vendor_id, state: tabState },
          });
          //初始化骑士
          yield put({
            type: 'fetchCourier',
            /*payload: { area_id: id, vendor_id, state: '100'},*/
            payload: { vendor_id, state: '100' }, /*Created by dave 17/1/19*/
          });
          //初始化统计
          yield put({
            type: 'fetchShipmentStatistics',
            payload: { area_id: id, vendor_id, city_code, shipping_date: dateFormat().join('') },
          });
        }
      }
    },

    //根据城市获取区域列表
    * fetchAreaList(params, { call, put }) {
      yield put({
        type: 'reduceClearAll',
        payload: {},
      })
      // 获取参数
      const { vendor_id, city_code } = params.payload;
      // 请求区域
      const result_areas = yield call(area_find_500, { state: 100, vendor_id, city_code, is_filter_sub_area: true });
      //获取加盟区域
      const result_total_areas = yield call(areas_total_list, { vendor_id, city_code });

      // 返回区域的数据处理
      if (result_areas.err) {
        message.error('直营区域查询失败！');
      } else {
        const areas = result_areas.data;
        //合并加盟区域数据
        areas.data = areas.data.concat(result_total_areas);
        if (areas.data.length === 0) {
          //暂无可用区域，请先创建区域！
          message.error('暂无可用区域，请先创建区域！！');
        }
        yield put({
          type: 'reduceAreaList',
          payload: { areas },
        })
      }
    },

    // 调度运单列表查询
    * fetchShipmentList(params, { call, put }) {
      // 获取查询的参数
      const { state } = params.payload;
      const shipments = { ...params.payload };

      //如果是全部就什么也不传
      delete shipments.state;

      // //需要 delivery_state 在utils查询
      // if (['1', '2', '8'].indexOf(state) !== -1) {
      //   shipments.delivery_state = shipment_states_dict[state];
      // }
      //
      // //需要 运单的状态
      // if (['3', '4', '5', '6'].indexOf(state) !== -1) {
      //   shipments.state = shipment_states_dict[state];
      // }

      //新的业务逻辑只需要传递state即可
      if (['1', '2', '3', '4', '5', '6', '8'].indexOf(state) !== -1) {
        shipments.state = shipment_states_dict[state];
      }

      // 查询接口获取一定条件写的运单列表
      const result_shipments = yield call(tms_shipments_find, { ...shipments, shipping_date: dateFormat().join('') });
      // 返回运单数据的数据处理
      if (result_shipments.err) {
        message.error('运单查询失败！');
      } else {
        yield put({
          type: 'reduceShimpentList', //查询接口获取一定条件写的运单列表成功
          payload: result_shipments.data,
        });
      }
    },

    //清空运单数据，解决其他页面跳回调度中心页时的闪屏问题
    * clearShimpents(params, { call, put }) {
      yield put({
        type: 'reduceClearShimpents',
        payload: {},
      });
    },

    // 运单详情查询
    * fetchShipmentDetail(params, { call, put }) {
      // 根据运单"ID"查询运单的详情信息
      const detail_shipments = yield call(tms_shipments_find_one, params.payload.id);
      // 获取该运单的详细日志信息
      const log_shipments = yield call(tms_shipments_find_one_logs, params.payload.id);
      // 返回的数据处理
      if (detail_shipments.err) {
        message.error('运单详情查询失败！');
      } else {
        // 数据返回成功的处理
        const { seller_id, courier } = detail_shipments.data;
        const _result = {
          shipment_detail: detail_shipments.data,
          shipment_log: log_shipments.data,
        };
        // 根据运单中的商家ID查询该商家的详细信息
        const result_seller = yield call(seller_find_one, seller_id);
        //返回结果的数据处理
        if (result_seller.data) {
          _result.shipment_detail.seller_type = result_seller.data.seller_type;
        }

        // 如果该运单有骑士接单 根据骑士的ID查询信息
        if (detail_shipments.data) {
          const result_area = yield call(area_find_one, detail_shipments.data.area_id);
          //返回结果的数据处理
          _result.shipment_area = result_area.data;
        }

        yield put({
          type: 'reduceShipmentDetailOne', //运单的各种返回信息put代reducer中用来更新state表
          payload: { ..._result },
        });
      }
    },

    //推单记录
    * pushShipmentOrder(param, { call, put }) {
      const pushOrderDetails = yield call(tms_push_order_find, param.payload);
      if (pushOrderDetails.err) {
        message.error('推单记录查询失败！');
        return;
      }
      const data = pushOrderDetails && pushOrderDetails.data;
      yield put({
        type: 'reducePushOrder', //运单的各种返回信息put代reducer中用来更新state表
        payload: data,
      });
    },

    // 关闭运单
    * closeShipmentOrder(params, { call, put }) {
      const { id, close } = params.payload;
      //请求接口
      const result_close = yield call(tms_shipments_close, close);
      // 返回数据的处理
      if (result_close.err) {
        message.error('运单关闭失败！');
      } else {
        message.success('运单关闭 成功！');
        // 返回调度模块的运单列表
        toList();
        // 数据处理
        yield put({
          type: 'fetchShipmentDetail', //运单关闭 成功
          payload: { id },
        });
      }
    },

    // 骑士查询
    * fetchCourier(params, { call, put }) {
      //获取骑士查询参数
      const payload = { ...params.payload };
      const { state } = payload;
      payload.work_state = state;
      delete payload.state;
      // 接口调用
      const result_couriers = yield call(courier_find_500, payload);
      //返回的数据处理
      if (result_couriers.err) {
        message.error('骑士查询失败！');
        return;
      }

      // 根据页码信息循环获取所有的骑士信息
      const last_page = Math.ceil(result_couriers.data._meta.result_count / 500);
      let [result_arr, page] = [result_couriers.data.data, 2];
      while (page <= last_page) {
        payload.page = page;
        const result_courier_other = yield call(courier_find_500, payload);
        result_arr.push(...result_courier_other.data.data);
        page++;
      }

      //循环获取骑士的ID信息
      const courier_ids = result_arr.map(item => item.id);
      const _payload = { courier_ids, shipping_date: dateFormat().join('') };
      // 根据骑士的ID查询调度模块骑士的运单详情
      const result_stats = yield call(tms_courier_shipments_statistics, _payload);
      // 返回的数据处理
      if (result_stats.err) {
        message.error('骑士运单统计查询失败！');
      } else {
        // 如果成功获取到骑士运单统计的信息
        result_stats.data.data.forEach((item) => {
          const _i = courier_ids.indexOf(item.courier_id);
          result_arr[_i].statistics = item;
        });
      }

      // 更新骑士运单统计信息
      yield put({
        type: 'reduceCourier', // 更新骑士运单统计信息
        payload: { _meta: result_couriers.data._meta, data: result_arr },
      });
    },

    // 运单统计查询
    * fetchShipmentStatistics(params, { call, put }) {
      // 运单统计查询接口
      const result_stats = yield call(tms_shipments_statistics, {
        ...params.payload,
        shipping_date: dateFormat().join(''),
      });
      // 返回数据的处理
      if (result_stats.err) {
        message.error('运单统计查询失败！');
      } else {
        // 数据返回成功
        yield put({
          type: 'reduceShipmentStatistics', // 运单统计查询成功
          payload: result_stats.data,
        });
      }
    },

    // 改派订单
    * reassignCourier(params, { call, put }) {
      // ant-design message组件的配置 具体可参见ant-design
      message.config({
        top: 200,
        duration: 2,
      });
      //获取查询参数
      const { reassigns, couriers, shipments, account_id } = params.payload;
      //改派接口
      const result_reassign = yield call(tms_reassign, {
        courier_id: reassigns.curr_courier.id,
        shipment_ids: reassigns.selectedRowKeys,
        note: reassigns.reason,
        operator_id: account_id,
      });
      // 返回数据的处理
      if (result_reassign.err) {
        message.error('改派失败！');
      } else {
        // 数据返回成功
        message.success('改派成功！');
        const stats = {
          oks: 0,
          fails: 0,
        };
        // 返回给view层的state值 改派成功
        result_reassign.data.data.forEach((item) => {
          if (item.ok) {
            stats.oks++;
          } else {
            stats.fails++;
          }
        });
        // 改派成功的信息
        message.info(`改派成功${stats.oks}单,改派失败${stats.fails}单.`);
      }

      //弹窗消失
      yield put({
        type: 'reduceReassignToggle', //弹窗状态切换
        payload: {
          visible: false,
        },
      });
      //更新运单
      yield put({
        type: 'fetchShipmentList',  //更新运单成功
        payload: shipments,
      });
      //更新骑士
      yield put({
        type: 'fetchCourier', //更新骑士成功
        payload: couriers,
      });
    },

    // 模态框组件（后期可用区域模块中封装的组件替换，具体的UI内容可以用配置文件替换）
    * reassignModalVisible(params, { call, put }) {
      const {
        payload,
      } = params;
      yield put({
        type: 'reduceReassignToggle', //模态框组件成功
        payload,
      });
    },
  },

  reducers: {
    // 调度模块初始化页面成功
    reduceInit(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },

    //调度模块根据城市请求区域
    reduceAreaList(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },

    // 切换改派模态框的状态
    reduceReassignToggle(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },

    // 调度页面的运单查询
    reduceShimpentList(state, action) {
      return {
        ...state,
        shipments: action.payload,
      };
    },

    // 清空调度中心数据
    reduceClearShimpents(state, action) {
      return {
        ...state,
        shipments: {
          data: [],        //调度模块的运单列表数据
          loading: false,  //是否loading的开关 默认是关闭状态
          _meta: {},       // 服务器端返回的附带信息（包括总共多少条，后面还有没有数据的一个对象）
        },
      }
    },

    // 运单统计的数据
    reduceShipmentStatistics(state, action) {
      return {
        ...state,
        shipments_stats: action.payload,
      };
    },

    // 骑士查询成功
    reduceCourier(state, action) {
      return {
        ...state,
        couriers: action.payload,
      };
    },

    // 运单详情查询
    reduceShipmentDetailOne(state, action) {
      const _result = {
        ...state,
        ...action.payload,
      };
      const { shipment_detail } = _result;
      // 数据结构的整理
      const { distance = 0, o3_order_amount = 0, shipping_fee = 0, shipping_fee_courier_rate = 0, tip_fee = 0, tip_fee_courier_rate = 0 } = shipment_detail;
      // 骑士的小费
      let local_calc_fee_courier = (shipping_fee * shipping_fee_courier_rate + tip_fee * tip_fee_courier_rate) / 10000;
      // 取两位小数
      local_calc_fee_courier = local_calc_fee_courier.toFixed(2);
      // 服务商的消费
      let local_calc_fee_vendor = (shipping_fee + tip_fee) / 100 - local_calc_fee_courier * 1;
      // 取两位小数
      local_calc_fee_vendor = local_calc_fee_vendor.toFixed(2);
      // 数据结构整理
      Object.assign(shipment_detail, {
        local_calc_distance: distance / 1000, //配送距离
        local_calc_o3_order_amount: o3_order_amount / 100, //订单的数量
        local_calc_shipping_fee: shipping_fee / 100, //运单的费用
        local_calc_tip_fee: tip_fee / 100, //运单的小费
        local_calc_fee_courier, //骑士的服务费
        local_calc_fee_vendor, //服务商的服务费
      });
      return { ..._result, shipment_detail };
    },

    //推单记录查询
    reducePushOrder(state, action) {
      return {
        ...state,
        pushOrderDetails: action.payload,
      }
    },

    // 服务商可服务城市
    getServiceCityList(state, action) {
      const { serviceCityList } = state;
      Object.assign(serviceCityList, action.payload);
      return {
        ...state,
        serviceCityList,
      }
    },

    //当没有区域时清空所有数据
    reduceClearAll(state, action) {
      return {
        ...state,
        areas: { //调度模块的区域区域模块
          data: [], //调度模块的区域区域
        },
        areas_total_list: {
          data: [],
        },
        default_area_id: '',    //默认的区域区域
        default_area_name: '',  //默认的区域名称
        couriers: {             //骑士的信息
          data: [],             //骑士列表的数据
          loading: false,       //是否loading的开关 默认是关闭状态
          _meta: {},            // 服务器端返回的附带信息（包括总共多少条，后面还有没有数据的一个对象）
        },
        shipments: {       //调度模块的运单信息
          data: [],        //调度模块的运单列表数据
          loading: false,  //是否loading的开关 默认是关闭状态
          _meta: {},       // 服务器端返回的附带信息（包括总共多少条，后面还有没有数据的一个对象）
        },
        shipments_stats: {}, //调度模块的运单状态信息
        visible: false,      //调度模块模态框的状态显示 默认是隐藏
      }
    },
  },
}
