import dva, { connect } from 'dva';
import { message } from 'antd';
import createLoading from 'dva-loading';
import { hashHistory } from 'dva/router';
import moment from 'moment';
import 'moment/locale/zh-cn';

import 'antd/dist/antd.min.css';
import './index.css';
import './index.html';
import plugin from './plugin'
import application from './application';

moment.locale('zh-cn');

//初始化应用
window.application = application;

//模块
const allModels = [
  require('./services/business/src/models'),
  require('./services/finance/src/models'),
  require('./services/statictics/src/models'),
  require('./services/team/src/models'),
  require('./services/tms/src/models'),
  require('./services/operation/src/models'),
  require('./models'),
];

// 1. Initialize
const app = dva({
  history: hashHistory,
  onError(error) {
    console.info('app onError -- ', error);
    message.error(error.message, 3);
  },
});

// 2. Plugins
app.use(createLoading());
app.use(plugin());

// 3. Model
allModels.forEach((models) => {
  models.forEach((theModel) => {
    app.model(theModel);
  });
});

// 4. Routers
app.router(require('./router'));

// 5. Start
app.start('#root');
