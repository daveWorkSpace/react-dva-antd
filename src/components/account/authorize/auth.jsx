import is from 'is_js';
import React, { Component, PropTypes } from 'react';
import { Form, Input, Button, Icon, Row, Col, Select, message, Layout } from 'antd';
import { Link } from 'dva/router';
import { connect } from 'dva';
import { AccountAuthorizeActions } from '../../actions';
import { authorize } from '../../../application'

class View extends Component {
  constructor(props) {
    super();

    this.state = {
      vendors: authorize.vendors,
      choiceVendor: {},
    }

    this.private = {
      dispatch: props.dispatch,
    }
  }

  //选择要登陆的服务商
  onChoiceVendor = (vendor) => {
    this.setState({
      choiceVendor: vendor,
    })
  }

  //重置授权，返回登陆界面
  onAuthClear = () => {
    authorize.clear()

    //跳转到登陆页
    setTimeout(() => { window.location.href = '/#/authorize/login'; }, 500);
  }

  //选择服务商，使用账号进行登陆
  onAuthSubmit = (e) => {
    e.preventDefault();
    const { dispatch } = this.private;
    const { vendors, choiceVendor } = this.state

    //判断账户是否选择
    const vendorId = choiceVendor.vendor_id;
    if (is.not.truthy(vendorId) || is.not.string(choiceVendor.vendor_id)) {
      message.info('请选择要登陆的账户');
      return;
    }

    //获取账户授权
    dispatch({
      type: AccountAuthorizeActions.auth,
      payload: { vendorId: choiceVendor.vendor_id },
    });
  }

  //渲染账户列表
  renderAccountListComponent = () => {
    const { onChoiceVendor } = this
    const { vendors, choiceVendor } = this.state

    const renderComponent = []
    vendors.forEach((item, index, record) => {
      if (choiceVendor.vendor_id === item.vendor_id) {
        renderComponent.push(
          <Button key={item.vendor_id} onClick={e => onChoiceVendor(item)} className="account" icon="check-circle-o" type="primary">{item.vendor_name}</Button>,
        )
      } else {
        renderComponent.push(
          <Button key={item.vendor_id} onClick={e => onChoiceVendor(item)} className="account">{item.vendor_name}</Button>,
        )
      }
    });

    return (
      <div style={{ maxHeight: '200px', overflow: 'scroll', overflowY: 'scroll', margin: '10px 0px' }}>
        {renderComponent}
      </div>
    )
  }

  render() {
    const { renderAccountListComponent, onAuthClear, onAuthSubmit } = this
    return (
      <div className="login-container">
        <Form onSubmit={onAuthSubmit}>
          <h2> 选择账户 </h2>
          <div style={{ lineHeight: '1.4', color: 'rgba(102, 102, 102, 0.6)' }}>当前账户对应多个服务商，请选择登陆账号</div>

          {/* 渲染账户列表 */}
          {renderAccountListComponent()}

          <Button type="primary" htmlType="submit">进入账户</Button>
          <Button className="other" onClick={e => onAuthClear()}>重新登陆</Button>
        </Form>
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

module.exports = connect(mapStateToProps)(Form.create()(View));
