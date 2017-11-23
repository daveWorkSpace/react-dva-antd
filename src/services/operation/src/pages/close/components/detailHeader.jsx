import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Input, Button, Form, Table, Radio, Breadcrumb, Alert, Icon, Popover } from 'antd';

import style from './style.less';

class DetailHeader extends React.Component {

  constructor(props) {
    super();
  }

  //异常订单详情头部组件
  render() {
    const { title } = this.props;
    return (
      <div>
        <h4> <i className={style.left} />{title}</h4>
        <p className={style.line} />
      </div>
    )
  }
}

module.exports = DetailHeader;
