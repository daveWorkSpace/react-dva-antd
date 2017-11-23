import dot from 'dot-prop'
import { hashHistory, routerRedux } from 'dva/router';
import { message } from 'antd';
import {
  account_find_one,
  courier_find,
  courier_find_one,
  courier_state_query,
  courier_create,
  courier_update,
  courier_approve_verify,
  courier_find_one_audit_logs,
} from 'aoao-core-api-service/lib/business';
import { qiniu_tokens, assets, qiniu_upload, fetchCityList } from 'aoao-core-api-service/lib/public';
import {
  getTeams,
  getTeamDetail,
  readyCourierState,
  deleteTeamMember,
  addTeam,
  teamAddMemberCourier,
  teamAddMemberCourierId,
  addTeamMemeber,
} from 'aoao-core-api-service/lib/team';
import aoaoAppSystemFlag from './../../../../utils/systemConfig';
import { authorize } from './../../../../application';

function toDetail(id) {
  window.location.href = `/#/team/courier/list/detail?id=${id}`;
}

function toList() {
  setTimeout(() => {
    window.location.href = '/#/team/courier/list';
  }, 10);
}
const { err_codeTransform } = window.tempAppTool;
const getAllCourierMessage = {
  allCourierList: [],
  existCourierList: [],
  canSelectCourier: [],
  courierStop: true,
  teamStop: true,
  existCourierListId: [],
}

module.exports = {
  namespace: 'businessCourier',
  state: {
    //所有骑士列表
    list_tables: {
      _meta: {},
      data: [],
    },
    //骑士总数
    courierNumber: '',
    //待审核骑士总数
    delayCheckNum: '',
    //待审核骑士列表
    readyListTables: {
      _meta: {},
      data: [],
    },
    //骑士编辑详情
    getCourierDetail: {},
    list_details: {
      account_detail: {},
      courier_detail: {},
    },
    audit_logs: [],
    courier_info: {},
    //区分骑士与团队
    tabs: sessionStorage.getItem('tabs') != undefined ? sessionStorage.getItem('tabs') : '所有骑士',
    //弹框层的状态
    visible: false,
    visibleCourier: false,
    //默认添加团队及骑士的城市
    city: '',
    //团队列表
    teamList: {
      _meta: {},
      data: [],
    },
    //团队详情
    teamListDetail: {},
    //数据列表类型(骑士、团队)
    listType: {
      listType: '所有骑士',
    },
    //团队ID 需要存起来
    team_id: '',
    //添加团队成员时   不属于该团队的骑士列表
    outsideCourier: [],
    serviceCityList: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      const detailPaths = ['/team/courier/list/detail', '/team/courier/list/edit', '/team/courier/list/check']
      history.listen((location) => {
        const vendor_id = authorize.auth.vendorId;
        const city_code = dot.get(authorize.vendor, 'city.code');
        const { pathname } = location;
        if (pathname === '/team/courier/list') {
          const tabs = sessionStorage.getItem('tabs');
          const listType = sessionStorage.getItem('listType');

          // 获取服务商可以服务的城市
          dispatch({
            type: 'getServiceCityListCourierE',
            payload: { vendor_id },
          });

          const info = tabs;
          if (info) {
            if (tabs == '所有骑士') {
              // 获取所有骑士
              dispatch({
                type: 'fetchCourierList',
                payload: {
                  vendor_id,
                  city_code,
                },
              });
              dispatch({
                type: 'updateListType',
                payload: { listType },
              })
            } else if (tabs == '待审核骑士') {
              dispatch({
                type: 'fetchCourierList',
                payload: {
                  vendor_id,
                  verify_state: 1,
                  city_code,
                },
              });
              dispatch({
                type: 'updateListType',
                payload: { listType },
              })
            } else {
              // 当前选中的为团队  列表数据应为  相应的team_id下的数据
              dispatch({
                type: 'fetchCourierList',
                payload: {
                  vendor_id,
                  team_id: tabs,
                  city_code,
                },
              });
              dispatch({
                type: 'updateListType',
                payload: { listType },
              });
              //团队名称
              dispatch({
                type: 'teamChange',
                payload: { info },
              });
            }
          } else {
            dispatch({
              type: 'fetchCourierList',
              payload: {
                vendor_id,
                city_code,
                // work_state:100
              },
            });
          }
          //服务商注册的默认城市
          dispatch({
            type: 'changeCity',
            payload: {
              city_code,
              // work_state:100
            },
          });
          //获取所有骑士数量
          dispatch({
            type: 'getAllCourierNUmber',
            payload: {
              vendor_id,
              city_code,
            },
          });
          //获取所有团队列表
          dispatch({
            type: 'getTeam',
            payload: {
              vendor_id,
              city_code,
            },
          });
          //获取待审核骑士数据
          dispatch({
            type: 'readyCourier',
            payload: {
              vendor_id,
              verify_state: 1,
              city_code,
            },
          });
        }
        //骑士添加时的监听
        if (pathname === '/team/courier/list/add') {
          dispatch({
            type: 'getTeam',
            payload: {
              vendor_id,
              city_code,
            },
          });
        }
        if (detailPaths.indexOf(pathname) !== -1) {
          dispatch({
            type: 'getDetail',
            payload: location.query,
          });
          dispatch({
            type: 'getAuditLogs',
            payload: location.query,
          });

          // 获取服务商可以服务的城市
          dispatch({
            type: 'getServiceCityListCourierE',
            payload: { vendor_id },
          });
        }
      });
    },
  },

  effects: {
    // 骑士查询
    * fetchCourierList({ payload }, { call, put }) {
      const params = { ...payload,
        sort: '{"created_at":-1}',
      }
      //请求服务器
      const response = yield call(courier_find, params);
      //请求错误，直接返回
      if (response.err) {
        const responseJson = response.err.response.json();
        responseJson.then((errObj) => {
          message.error(`骑士查询失败,${err_codeTransform(errObj.err_code)}`);
        });
        return
      }

      //验证参数
      if (params.verify_state) {
        //结果计数
        let resultCount = 0
        if (response.data && response.data._meta.result_count) {
          resultCount = response.data._meta.result_count
        }

        yield put({ type: 'delayCheckNum', payload: resultCount })
      }

      //处理骑士数据
      yield put({ type: 'reduceCourierList', payload: response.data })
    },

    //获取服务商可以服务的城市
    * getServiceCityListCourierE(params, { call, put }) {
      if (aoaoAppSystemFlag.IS_API_CITY_DATA === true) {
        const serviceCityList = yield call(fetchCityList, params.payload.vendor_id);
        yield put({
          type: 'getServiceCityListCourierR',
          payload: serviceCityList,
        })
      }
    },

    //编辑时的骑士详情
    * getCourierDetailE(params, { call, put }) {
      const value = yield call(courier_find_one, params.payload.id);
      const getCourierDetail = value.data;
      yield put({
        type: 'getCourierDetailR',
        payload: getCourierDetail,
      })
    },

    //获取所有骑士数量
    * getAllCourierNUmber(params, { call, put }) {
      const result_courier = yield call(courier_find, params.payload);
      if (result_courier.err) {
        const _response = result_courier.err.response.json();
        _response.then((err_obj) => {
          message.error(`骑士查询失败,${err_codeTransform(err_obj.err_code)}`);
        });
      } else {
        yield put({
          type: 'getAllNumber',
          payload: result_courier.data,
        })
      }
    },

    //获取待审核骑士数量
    * getReadyCourierNumber(params, { call, put }) {
      const { vendor_id, verify_state, city_code } = params.payload;
      const resultReadyCourier = yield call(readyCourierState, vendor_id, verify_state, city_code);
      if (resultReadyCourier.err) {
        const _response = resultReadyCourier.err.response.json();
        _response.then((err_obj) => {
          message.error(`骑士查询失败,${err_codeTransform(err_obj.err_code)}`);
        });
      } else {
        yield put({
          type: 'getReadyNumber',
          payload: resultReadyCourier,
        })
      }
    },

    //待审核骑士查询
    * readyCourier(params, { call, put }) {
      const { vendor_id, verify_state, city_code } = params.payload;
      const resultReadyCourier = yield call(readyCourierState, vendor_id, verify_state, city_code);
      if (resultReadyCourier.err) {
        const _response = resultReadyCourier.err.response.json();
        _response.then((err_obj) => {
          message.error(`骑士查询失败,${err_codeTransform(err_obj.err_code)}`);
        });
      } else {
        yield put({
          type: 'readyCourierStateR',
          payload: resultReadyCourier,
        })
      }
    },

    // 创建骑士
    * createCourier(params, { call, put }) {
      const result_courier = yield call(courier_create, params.payload);
      if (result_courier.err) {
        const _response = result_courier.err.response.json();
        _response.then((err_obj) => {
          message.error(`骑士创建失败,${err_codeTransform(err_obj.err_code)}`);
        });
      } else {
        message.success('骑士创建成功！');
        toList();
      }
      //跳转到详情页
      // toDetail(result_courier.user_id);
    },

    // 骑士信息更新
    * updateCourier(params, { call, put }) {
      const result_courier = yield call(courier_update, params.payload);
      if (result_courier.err) {
        const _response = result_courier.err.response.json();
        _response.then((err_obj) => {
          message.error(`骑士更新失败,${err_codeTransform(err_obj.err_code)}`);
        });
      } else {
        message.success('骑士更新成功！');
        toList();
      }
      //跳转到详情页
      // toDetail(courier_id);
    },

    // 骑士审核
    * approveVerify(params, { call, put }) {
      const { payload } = params;
      payload.note = payload.reason;
      delete payload.reason;
      const result_courier = yield call(courier_approve_verify, payload);
      if (result_courier.err) {
        const _response = result_courier.err.response.json();
        _response.then((err_obj) => {
          message.error(`骑士审核失败,${err_codeTransform(err_obj.err_code)}`);
        });
        toList();
      } else {
        message.success('骑士审核成功！');
        yield put({
          type: 'reduceCourierDetail',
          payload: {
            data: result_courier.data,
          },
        });
        toList();
      }
    },

    // 获取骑士日志信息
    * getAuditLogs(params, { call, put }) {
      const { id } = params.payload;
      const result_log_courier = yield call(courier_find_one_audit_logs, { org_id: id, type: 4, state: 0 });
      if (result_log_courier.err) {
        const _response = result_log_courier.err.response.json();
        _response.then((err_obj) => {
          message.error(`骑士日志查询失败,${err_codeTransform(err_obj.err_code)}`);
        });
      } else {
        yield put({
          type: 'reduceCourierDetail',
          payload: {
            courier_audit_logs: result_log_courier.data.data[0],
          },
        });
      }
    },

    // 查询骑士详情
    * getDetail(params, { call, put }) {
      const { id } = params.payload;
      const result_courier = yield call(courier_find_one, id);

      const _result = {};
      if (result_courier.err) {
        const _response = result_courier.err.response.json();
        _response.then((err_obj) => {
          message.error(`骑士查询失败,${err_codeTransform(err_obj.err_code)}`);
        });
      } else {
        _result.courier_detail = result_courier.data;
      }

      const result_account = yield call(account_find_one, id);
      if (result_account.err) {
        const _response = result_account.err.response.json();
        _response.then((err_obj) => {
          message.error(`账号查询失败,${err_codeTransform(err_obj.err_code)}`);
        });
      } else {
        _result.account_detail = result_account.data;
      }

      yield put({
        type: 'reduceCourierDetail',
        payload: { ..._result },
      });
    },

    //团队模块-获取团队列表
    * getTeam(params, { call, put }) {
      const limit = 500;
      const sort = '{"created_at":-1}';
      const { vendor_id, city_code } = params.payload;
      const teamList = yield call(getTeams, vendor_id, city_code, limit, sort);
      yield put({
        type: 'getTeams',
        payload: teamList,
      })
    },

    //团队模块-团队的切换从而获取团队详情
    * teamChange(params, { call, put }) {
      const { info } = params.payload;
      const teamListDetail = yield call(getTeamDetail, info);
      yield put({
        type: 'getTeamListDetail',
        payload: teamListDetail,
      });
      yield put({
        type: 'reduceChangeTeam',
        payload: { info },
      })
    },

    //tabs 列表当前选中的切换
    * tabChange(params, { call, put }) {
      const { info } = params.payload;
      yield put({
        type: 'reduceChangeTeam',
        payload: { info },
      })
    },

    //团队模块-添加团队新成员
    * checkBox(params, { call, put }) {
      const { visibles, visibleCouriers } = params.payload;
      yield put({
        type: 'reduceCheckBox',
        payload: { visibles, visibleCouriers },
      })
    },

    //团队模块-城市更改
    * changeCity(params, { call, put }) {
      const { city_code } = params.payload;
      yield put({
        type: 'reduceChangeCity',
        payload: { city_code },
      })
    },

    //移除团队成员
    * removeTeamMember(params, { call, put }) {
      const { courier_ids, tabs, city_code } = params.payload;
      const team_id = tabs;//将 团队ID 从tabs 拿出来
      const removeResult = yield call(deleteTeamMember, team_id, courier_ids);
      if (removeResult.ok) {
        //重新获取当前团队 删除后的  骑士列表
        yield put({
          type: 'businessCourier/fetchCourierList',
          payload: { team_id },
        });
        //删除团队中的成员后 更新团队详情数据  用于引导团队的标题显示
        const info = team_id;
        yield put({
          type: 'teamChange',
          payload: { info },
        });
        const vendor_id = authorize.auth.vendorId;
        // 重新获取团队列表  从而更新团队中骑士的数量
        yield put({
          type: 'getTeam',
          payload: {
            vendor_id,
            city_code,
          },
        })
        location.href = '/#/team/courier/list';
        message.success('删除成功');
      } else {
        message.error('操作失败');
      }
    },

    //控制列表的类型 从而渲染不同的操作
    * changeListType(params, { call, put }) {
      const { listType } = params.payload;
      yield put({
        type: 'reduceUpdateListType',
        payload: { listType },
      })
    },

    //增加团队
    * addTeam(params, { call, put }) {
      const { name, vendor_id, city_code } = params.payload;
      const result = yield call(addTeam, vendor_id, name, city_code);
      if (result.created_at) {
        message.success('团队添加成功');
        const limit = 500;
        const sort = '{"created_at":-1}';
        const teamList = yield call(getTeams, vendor_id, city_code, limit, sort);
        yield put({
          type: 'getTeams',
          payload: teamList,
        })
      }
    },

    //团队中增加成员
    * teamAddMember(params, { call, put }) {
      const initPage = 1;
      const { team_id, vendor_id, city_code } = params.payload;
      const sort = '{"created_at":-1}';
      getAllCourierMessage.existCourierList = [];
      getAllCourierMessage.allCourierList = [];
      getAllCourierMessage.canSelectCourier = [];
      // 骑士参数
      const params1 = {
        vendor_id,
        city_code,
        limit: 100,
        page: initPage,
        sort: '{"created_at":-1}',
      };

      // 团队参数
      const teamParams = {
        team_id,
        limit: 100,
        page: initPage,
        sort: '{"created_at":-1}',
      };

      // 循环获取所有骑士
      const allCourierList = yield call(teamAddMemberCourierId, params1);
      const existCourierList = yield call(teamAddMemberCourierId, teamParams);
      // 将首页取到的骑士数据存起来
      for (let i = 0; i < allCourierList.data.length; i++) {
        getAllCourierMessage.allCourierList.push(allCourierList.data[i]);
      }


      // 将首页取到的团队中的骑士数据存起来
      for (let k = 0; k < existCourierList.data.length; k++) {
        getAllCourierMessage.existCourierList.push(existCourierList.data[k]);
      }


      // 判断是否需要更多的骑士数据/团队中是否有更多的骑士数据
      const requestNumer = Math.ceil(allCourierList._meta.result_count / 100);
      const teamRequestNumber = Math.ceil(existCourierList._meta.result_count / 100);
      // 判断是否循序取骑士数据
      if (allCourierList._meta.has_more) {
        for (let b = 1; b < requestNumer; b++) {
          const params2 = {
            vendor_id,
            city_code,
            limit: 100,
            page: b,
            sort: '{"created_at":-1}',
          };
          const value = yield call(teamAddMemberCourierId, params2);
          for (let j = 0; j < value.data.length; j++) {
            getAllCourierMessage.allCourierList.push(value.data[j]);
          }
          getAllCourierMessage.courierStop = value._meta.has_more;
        }
      }

      // 判断是否循序取团队中骑士数据
      if (existCourierList._meta.has_more) {
        for (let h = 1; h < teamRequestNumber; h++) {
          const teamParams2 = {
            team_id,
            limit: 100,
            page: h,
            sort: '{"created_at":-1}',
          };
          const teamValue = yield call(teamAddMemberCourierId, teamParams2);
          for (let a = 0; a < teamValue.data.length; a++) {
            getAllCourierMessage.existCourierList.push(teamValue.data[a]);
          }
          getAllCourierMessage.teamStop = value._meta.has_more;
        }
      }

      // 去重筛选 获取可以往某一团队添加骑士列表
      getAllCourierMessage.canSelectCourier = [];
      for (let l = 0; l < getAllCourierMessage.existCourierList.length; l++) {
        getAllCourierMessage.existCourierListId.push(getAllCourierMessage.existCourierList[l].id)
      }

      for (let m = 0; m < getAllCourierMessage.allCourierList.length; m++) {
        if (getAllCourierMessage.existCourierListId.indexOf(getAllCourierMessage.allCourierList[m].id) < 0) {
          getAllCourierMessage.canSelectCourier.push(getAllCourierMessage.allCourierList[m]);
        }
      }

      if (getAllCourierMessage.canSelectCourier.length == 0) {
        getAllCourierMessage.canSelectCourier = getAllCourierMessage.allCourierList;
      }
      yield put({
        type: 'reduceAddTeamMember',
        payload: {
          outsideCourier: getAllCourierMessage.canSelectCourier,
        },
      })
    },

    //团队添加新成员
    * addTeamMemeber(params, { call, put }) {
      const { team_id, courier_ids } = params.payload;
      const result = yield call(addTeamMemeber, team_id, courier_ids);
      if (result.ok) {
        message.success('添加成功');
        location.href = '/#/team/courier/list';
      } else {
        message.error('添加失败');
      }
    },
  },

  reducers: {

    getServiceCityListCourierR(state, action) {
      const { serviceCityList } = state;
      Object.assign(serviceCityList, action.payload);
      return {
        ...state,
        serviceCityList,
      }
    },

    //骑士查询
    reduceCourierList(state, action) {
      const { list_tables } = state;
      Object.assign(list_tables, action.payload);
      return {
        ...state,
        list_tables,
      };
    },

    //获取骑士总数
    getAllNumber(state, action) {
      let courierNumber = state.courierNumber;
      const result_count = action.payload._meta.result_count;
      courierNumber = result_count;
      return {
        ...state,
        courierNumber,
      }
    },

    //获取待审核骑士总数
    getReadyNumber(state, action) {
      let delayCheckNum = state.delayCheckNum;
      const result_count = action.payload._meta.result_count;
      delayCheckNum = result_count;
      return {
        ...state,
        delayCheckNum,
      }
    },

    //待审核骑士总数
    delayCheckNum(state, action) {
      return {
        ...state,
        delayCheckNum: action.payload,
      }
    },

    //骑士详情
    getCourierDetailR(state, action) {
      const { getCourierDetail } = state;
      Object.assign(getCourierDetail, action.payload);
      return {
        ...state,
        getCourierDetail,
      }
    },
    //待审核骑士查询
    readyCourierStateR(state, action) {
      const readyListTables = state;
      const list_tables = state;
      list_tables.data = readyListTables.data;
      Object.assign(readyListTables, action.payload);
      return {
        ...state,
        readyListTables,
      }
    },

    reduceCourierDetail(state, action) {
      const { list_details } = state;
      Object.assign(list_details, action.payload);
      return {
        ...state,
        list_details,
      };
    },

    reduceUpload(state, action) {
      const { list_details } = state;
      const { asset_type } = action.payload;
      list_details[`pic${asset_type}`] = '/assets/ok.png';
      return {
        ...state,
        list_details,
      };
    },

    //团队列表切换对应相应的数据
    reduceChangeTeam(state, action) {
      let { tabs } = state;
      const { info } = action.payload;
      //从view获取到具体的团队名称
      if (info.length == 1) {
        tabs = info[0];//树行组件的选中的 key  类型为数组 所以此处需要过滤筛选
      } else {
        tabs = info;// 此处为团队中删除成员时  要传的 team_id(string 类型)
      }
      return {
        ...state,
        tabs,
      }
    },

    //添加团队新成员
    reduceCheckBox(state, action) {
      let { visible, visibleCourier } = state;
      const { visibles, visibleCouriers } = action.payload;
      visible = visibles;
      visibleCourier = visibleCouriers;
      return {
        ...state,
        visible,
        visibleCourier,
      }
    },

    //更改城市
    reduceChangeCity(state, action) {
      let { city } = state;
      const { city_code } = action.payload;
      city = city_code;
      return {
        ...state,
        city,
      }
    },

    //获取团队列表
    getTeams(state, action) {
      const { teamList } = state;
      Object.assign(teamList, action.payload);
      return {
        ...state,
        teamList,
      };
    },

    //团队详情状态更改(主要用于切换团队时  标题显示)
    getTeamListDetail(state, action) {
      const { teamListDetail } = state;
      Object.assign(teamListDetail, action.payload);
      return {
        ...state,
        teamListDetail,
      }
    },

    // 更新listType
    reduceUpdateListType(state, action) {
      let { listType } = state;
      listType = action.payload;
      Object.assign(listType, action.payload);
      return {
        ...state,
        listType,
      }
    },

    //更新 可以添加的某一团队的骑士列表
    reduceAddTeamMember(state, action) {
      const { outsideCourier } = state;
      Object.assign(outsideCourier, action.payload);
      return {
        ...state,
        outsideCourier,
      }
    },
  },
}
