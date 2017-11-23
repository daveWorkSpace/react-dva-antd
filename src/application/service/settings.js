import is from 'is_js';
import Storage from '../library/storage';

class Settings {
  constructor() {
    //设置信息
    this._settings = new Storage('aoao.app.settings');

    //新手指南信息
    this._guide = new Storage('aoao.app.settings', { container: 'guide' });
  }

  get settings() {
    return this._setting.data;
  }

  set settings(info) {
    this._setting.set(info);
  }

  get guide() {
    return this._guide.data;
  }

  set guide(info) {
    this._guide.set(info);
  }

  //判断是否显示用户指引
  isShowGuide() {
    const isShowGuide = this._guide.get('isShowGuide');
    if (is.truety(isShowGuide)) {
      return true;
    }
    return false;
  }

  //清空数据
  clear() {
    this._setting.clear();
  }

  debug() {
    console.log('this.settings', this._settings);
    console.log('this.guide', this.guide);
    console.log('isShowGuide', this.isAuth());
  }
}

module.exports = Settings
