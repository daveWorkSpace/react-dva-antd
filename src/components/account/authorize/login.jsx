import React, { Component, PropTypes } from 'react';
import { Form, Input, Button, Icon, Row, Col, message } from 'antd';
import { Link } from 'dva/router';
import { connect } from 'dva';
import { AccountAuthorizeActions } from '../../actions';

require('./style.less')

const [FormItem, InputGroup] = [Form.Item, Input.Group];
const ItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

class View extends Component {
  constructor(props) {
    super();
    const { dispatch, AccountAuthorize } = props;
    const { getFieldsValue, getFieldDecorator, validateFields, validateFieldsAndScroll } = props.form;

    this.state = {
      loginSmsCode: AccountAuthorize.loginSmsCode,  //登陆的手机验证码
    };

    this.private = {
      dispatch,
      getFieldsValue,
      getFieldDecorator,
      validateFields,
      validateFieldsAndScroll,
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const { AccountAuthorize } = nextProps;
    this.setState({
      loginSmsCode: AccountAuthorize.loginSmsCode,  //登陆的手机验证码
    })
  }

  sendLoginSms = (e) => {
    const { startCountDown } = this;
    const { dispatch, getFieldsValue, validateFields } = this.private;

    validateFields(['mobile'], { force: true }, (err, value) => {
      if (err) {
        return;
      }
      startCountDown();
      const { mobile } = getFieldsValue();
      dispatch({ type: AccountAuthorizeActions.sendLoginSms, payload: { mobile } });
    });
  }

  //开始倒计时
  startCountDown = () => {
    const verifyButton = document.querySelector('#verify_button');
    verifyButton.disabled = true;
    let seconds = 60;

      //倒计时
    const countDown = setInterval(() => {
      if (seconds > 0) {
        seconds -= 1;
        verifyButton.innerText = seconds;
        verifyButton.disabled = true;
      } else {
        clearInterval(countDown);
        verifyButton.innerText = '验证码';
        verifyButton.disabled = false;
      }
    }, 1000);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch, validateFieldsAndScroll, getFieldsValue } = this.private;
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return;
      }
      dispatch({ type: AccountAuthorizeActions.login, payload: values })
    });
  }

  render() {
    const { getFieldDecorator } = this.private;
    const { loginSmsCode } = this.state;

    return (
      <div className="login-container" >
        <Form onSubmit={this.handleSubmit}>
          <h3 style={{ textAlign: 'right' }}><a href="https://console.aoaosong.com/seller/#">我是商家?</a></h3>
          <h2> 服务商登录 </h2>
          <FormItem label="手机号" {...ItemLayout} >
            {getFieldDecorator('mobile', {
              rules: [
                {
                  required: true,
                  trigger: 'onBlur',
                  validator: (rule, value, callback) => {
                    if (!value) { callback('请填写手机号'); return; }
                    if (!(/^1[34578]\d{9}$/.test(value))) { callback('手机格式不对'); return; }
                    callback();
                  },
                },
              ],
            })(<Input placeholder="请填写手机号" />)}
          </FormItem>
          <FormItem label="验证码" {...ItemLayout} required>
            <InputGroup>
              <Col span="14">
                {getFieldDecorator('verifyCode', {
                  rules: [
                    { required: true, message: '请填写验证码' },
                  ],
                  initialValue: loginSmsCode,
                })(<Input placeholder="请填写验证码" />)}
              </Col>
              <Col span="10">
                <Button id="verify_button" onClick={this.sendLoginSms}>验证码</Button>
              </Col>
            </InputGroup>
          </FormItem>
          <Button type="primary" htmlType="submit">登录</Button>
          <Button className="other"><Link to="/authorize/register">申请注册</Link></Button>
        </Form>
      </div>
    );
  }
}

function mapStateToProps({ AccountAuthorize }) {
  return { AccountAuthorize };
}

module.exports = connect(mapStateToProps)(Form.create()(View));
