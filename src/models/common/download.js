import { hashHistory, routerRedux } from 'dva/router';
import dot from 'dot-prop';
import { message } from 'antd';
import { fetchExportList, createExportList } from 'aoao-core-api-service/lib/public.js';
import { authorize } from '../../application'
module.exports = {
    namespace: 'commonDownload',
    state: {
        exportList: {         //导出列表
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
        // 获取导出列表
        *getExportList({ payload }, { call, put }) {
            const result = yield call(fetchExportList, payload);
            yield put({ type: 'reducerExportList', payload: result });
        },
        //创建导出任务
        *createExportList({ payload }, { call, put }){
            const result = yield call(createExportList, payload);
            //创建成功后 再次请求导出列表
            if (result && result.id){
                yield put({ type: 'getExportList', payload: { task_object: payload.task_object ,org_id: payload.org_id } });
            }
            
        }
    },

    reducers: {
        reducerExportList(state, { payload }) {
            const exportList = payload;
            return { ...state, exportList }
        },
        clearExportList(state, { payload }){
            const exportList = null
            return { ...state, exportList}
        }
    }


}