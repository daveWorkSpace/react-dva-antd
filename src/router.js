import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'dva/router';

const routes = require('./routes');
/**
 * anonymous function - 路由功能
 * @param   {Object} history 历史对象
 * @returns {Object} 路由对象
 */
export default function ({ history }) {
  return (
    <Router routes={routes} history={history} />
  );
}
