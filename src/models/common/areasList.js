import { hashHistory, routerRedux } from 'dva/router';
import dot from 'dot-prop';
import { message } from 'antd';
import { fetchAreasList } from 'aoao-core-api-service/lib/public.js';
import { fetchAllAreas } from 'aoao-core-api-service/lib/area';
import { authorize } from '../../application'

module.exports = {
    namespace: 'commonAreas',
    state: {
        areasList: {         //商户列表
            data: [],
            _meta: {}
        },
        allDirectAreasList: {
            data: [],
            _meta: {}
        }
    },   

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((location) => {
                if (location.pathname == '/operations/search' || location.pathname == '/order/search') {
                    dispatch({ type: 'fetchAreasList' });
                    console.log('请求区域列表',location.pathname);
                }
                if (location.pathname == '/business/area/list' ){
                    dispatch({ type: 'fetchAreas' });
                }
            })
        },
    },

    effects: {
        // 获取区域列表-轮询直到has_more为false
        *fetchAreasList({ payload }, { call, put }){
            const vendor_id = authorize.vendor.id;
            const result = yield call(fetchAreasList, { vendor_id});
            console.log('请求区域列表数据', result);

            yield put({ type: 'reducerAreasList', payload: dot.get(result,'data') });
        },
        // 获取区域列表 直营or加盟
        *fetchAreas({ payload }, { call, put }){
            const vendorId = authorize.vendor.id;
            const cityCode = authorize.vendor.city.code;
            const relateType = 10;
            const result = yield call(fetchAllAreas, { vendorId, cityCode, relateType});
            console.log('请求直营区域列表', result);
            yield put({ type: 'reducerDirectAreasList', payload: dot.get(result,'data') });
        }
    },

    reducers: {
        reducerAreasList( state, { payload } ){
            const areasList = payload
            return { ...state, areasList }
        },
        reducerDirectAreasList( state, { payload } ){
            const allDirectAreasList = payload
            return { ...state, allDirectAreasList }
        },
    }


}