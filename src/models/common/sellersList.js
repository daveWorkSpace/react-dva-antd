import { hashHistory, routerRedux } from 'dva/router';
import dot from 'dot-prop';
import { message } from 'antd';
import { fetchSellersList } from 'aoao-core-api-service/lib/public.js';
import { authorize } from '../../application'
module.exports = {
    namespace: 'commonSellers',
    state: {
        sellersList: {         //商户列表
            data: [],
            _meta: {}
        },
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((location) => {
                
            })
        },
    },

    effects: {
        // 获取商户列表-轮询知道has_more为false
        *fetchSellersList({ payload }, { call, put }) {
            const vendor_id = authorize.vendor.id;
            const contract_type = dot.get(payload,'type',10);
            console.log('contract_type',contract_type);
            const limit = 100;                     //一次请求50条数据 轮询请求商户数据
            let page = dot.get(payload, 'page', 1);
            const result = yield call(fetchSellersList, { vendor_id, contract_type, limit, page });
            
            let sellersListData = [];
            // 平铺返回数据
            for (let i = 0; i < dot.get(result, 'data').length; i++) {
                sellersListData.push(dot.get(result, `data.${i}`));
            }
            // 判断是否需要继续轮询
            if (dot.get(result, '_meta.has_more')) {
                page += 1;
                yield put({ type: 'fetchSellersList', payload: { page } });
            }
            console.log('sellersListData',sellersListData);
            // 每次请求渲染商户列表
            yield put({ type: 'reducerSellersList', payload: result });

        }
    },

    reducers: {
        reducerSellersList(state, { payload }) {
            const sellersList = payload;
            console.log('sellersList',sellersList);
            return { ...state, sellersList }
        },
        clearSellersList(state, { payload }){
            const sellersList = null
            return { ...state, sellersList}
        }
    }


}