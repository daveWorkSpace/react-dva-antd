import Storage from './application/library/storage'
import { componentCache } from './application'

export default function ApplicationCore() {
  const namespace = 'ComponentCache';

  //初始state
  const initialState = {};

  const extraReducers = {
    [namespace](state = initialState, { type, payload }) {
      // console.log('extraReducers', state, type, payload);

      let ret = {};
      //判断当前的请求类型，如果是路由调用，则将数据对象注入到view的props中
      if (type === '@@router/LOCATION_CHANGE') {
        const { pathname } = payload || {};
        ret = {
          ...state,
          cache: new Storage(componentCache.namespace, { useSession: true, prefix: pathname }),
        };
      } else {
        ret = state;
      }
      return ret;
    },
  };

  return {
    extraReducers,
  };
}
