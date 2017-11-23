import { notification } from 'antd';
import RequestNotification from '../library/notification';

//全局的接口请求信息显示
export default function Request() {
  const request = new RequestNotification()
  request.hook('notification.hook', (isRequestFinish, loadingCount, successCount, failureCount) => {
    //调试信息
    // console.log('isRequestFinish, loadingCount, successCount, failureCount', isRequestFinish, loadingCount, successCount, failureCount);

    //显示信息
    notification.close('aoaoAppsVenderLoading');
    notification.open({
      key: 'aoaoAppsVenderLoading',
      message: '数据加载中...',
      description: `加载中 ${loadingCount} / 已完成 ${successCount} / 错误 ${failureCount}`,
      duration: null,
    });

    //判断请求是否完成
    if (isRequestFinish && failureCount === 0) {
      notification.close('aoaoAppsVenderLoading');

      //判断请求是否完成，是否有错误信息
    } else if (isRequestFinish && failureCount !== 0) {
      notification.error({ message: '数据加载失败，请重新加载尝试', duration: null });
    }
  });
  return request;
}
