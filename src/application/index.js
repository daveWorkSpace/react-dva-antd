import Storage from './library/storage';
import Geography from './service/geography'
import Authorize from './service/authorize'
import Request from './service/request'

//初始化应用
function createApp() {
  //地理相关
  const geography = new Geography();

  //通知
  const notification = {
    //请求通知
    request: Request(),
    //系统通知
    system: {},
  }

  //授权信息
  const authorize = new Authorize();

  //存储storage
  const storage = new Storage('aoao.app.storage');

  //缓存session
  const session = new Storage('aoao.app.session', { useSession: true });

  //组件缓存cache
  const componentCache = new Storage('aoao.app.componentCache', { useSession: true });

  return {
    geography,
    authorize,
    storage,
    session,
    componentCache,
    notification,
  };
}

module.exports = createApp()
