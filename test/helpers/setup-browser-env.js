//模拟命令行下的window和浏览器环境
import browserEnv from 'browser-env';
import { LocalStorage } from 'node-localstorage'

browserEnv(['window', 'document', 'navigator']);

//模拟localStorage
global.localStorage = new LocalStorage('./test/helpers/localStorage');
global.localStorage.clear()
if (!global.window.localStorage) {
  global.window.localStorage = global.localStorage;
}

//模拟sessionStorage
global.sessionStorage = new LocalStorage('./test/helpers/sessionStorage');
global.sessionStorage.clear()
if (!global.window.sessionStorage) {
  global.window.sessionStorage = global.sessionStorage;
}
