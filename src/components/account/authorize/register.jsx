import React, { Component, PropTypes } from 'react';
import { Form, Input, Button, Icon, Row, Col, Select, message } from 'antd';
import { Link } from 'dva/router';
import { connect } from 'dva';
import { AccountAuthorizeActions } from '../../actions';
import { geography } from '../../../application';

const [FormItem, Option, InputGroup] = [Form.Item, Select.Option, Input.Group];
const ItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

class View extends Component {
  constructor(props) {
    super();
    const { dispatch, AccountAuthorize } = props;
    const { getFieldsValue, getFieldDecorator, validateFields, setFieldsValue, validateFieldsAndScroll } = props.form;

    this.state = {
      registerSmsCode: AccountAuthorize.registerSmsCode,  //注册的手机验证码
    }

    this.private = {
      dispatch,
      getFieldsValue,
      getFieldDecorator,
      validateFields,
      setFieldsValue,
      validateFieldsAndScroll,
    };
  }

  componentWillReceiveProps = (nextProps) => {
    const { AccountAuthorize } = nextProps;
    this.setState({
      registerSmsCode: AccountAuthorize.registerSmsCode,  //注册的手机验证码
    })
  }

  //发送注册的验证码
  sendRegisterSms = (e) => {
    const { startCountDown } = this;
    const { dispatch, getFieldsValue, validateFields } = this.private;
    validateFields(['mobile'], { force: true }, (err, value) => {
      if (err) {
        return;
      }
      startCountDown();
      const values = getFieldsValue();
      dispatch({ type: AccountAuthorizeActions.sendRegisterSms, payload: values });
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
    const { validateFieldsAndScroll, getFieldsValue, dispatch } = this.private;
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return;
      }
      const { mobile, verifyCode, name, cityCode, legalName } = values
      const params = {
        mobile,
        verifyCode,
        name,
        cityCode,
        cityName: geography.cityName(cityCode),
        legalName,
      }
      dispatch({ type: AccountAuthorizeActions.register, payload: params });
    });
  }

  render() {
    const { getFieldDecorator } = this.private;
    const { registerSmsCode } = this.state;

    return (
      <div className="login-container">
        <Form layout="horizontal" onSubmit={this.handleSubmit} >
          <h2 > 用户注册 </h2>
          <FormItem label="服务城市" {...ItemLayout} >
            {
            getFieldDecorator('cityCode', {
              rules: [
                { required: true, message: '请选择城市' },
              ],
            })(
              <Select showSearch placeholder="请选择城市" optionFilterProp="children" notFoundContent="无法找到" >
                {geography.city.data.map((item, index) => {
                  return (<Option key={index} value={item._id}>{item.name}</Option>);
                })}
              </Select>,
            )
          }
          </FormItem>
          <FormItem>
            <Col sm={6} />
            <Col sm={16} style={{ lineHeight: 1.4, color: 'rgba(102,102,102,0.6)' }}>
              注册成功后服务城市不可更改，请根据业务情况选择对应的服务城市
            </Col>
          </FormItem>
          <FormItem label="商户名称" {...ItemLayout} >
            {
            getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  max: 30,
                  message: '请填写商户名称, 且长度不能超过30个字符',
                },
              ],
            })(
              <Input placeholder="请填写商户名称" />,
            )
          }
          </FormItem>
          <FormItem label="法人姓名" {...ItemLayout} >
            {
            getFieldDecorator('legalName', {
              rules: [
                {
                  required: true,
                  max: 10,
                  message: '请填法人姓名, 且长度不能超过10个字符',
                },
              ],
            })(
              <Input placeholder="请填写法人姓名" />,
            )
          }
          </FormItem>
          <FormItem label="手机号" {...ItemLayout} >
            {
            getFieldDecorator('mobile', {
              rules: [
                {
                  required: true,
                  trigger: 'onBlur',
                  validator: (rule, value, callback) => {
                    if (!value) {
                      callback('请填写手机号');
                      return;
                    }
                    if (!(/^1[34578]\d{9}$/.test(value))) {
                      callback('手机格式不对');
                      return;
                    }
                    callback();
                  },
                },
              ],
            })(
              <Input placeholder="请填写手机号" />,
            )
          }
          </FormItem>
          <FormItem label="验证码" {...ItemLayout} >
            <InputGroup>
              <Col span="14">
                {
                  getFieldDecorator('verifyCode', {
                    rules: [
                      { required: true, message: '请填写验证码' },
                    ],
                    initialValue: registerSmsCode,
                  })(
                    <Input placeholder="请填写验证码" />,
                  )
                }
              </Col>
              <Col span="10">
                <Button id="verify_button" onClick={this.sendRegisterSms}>验证码</Button>
              </Col>
            </InputGroup>
          </FormItem>
          <Button type="primary" htmlType="submit">申请注册</Button>
          <Button className="other" ><Link to="/authorize/login">已有账号？点此登录</Link></Button>
        </Form>
      </div>
    );
  }
}

function mapStateToProps({ AccountAuthorize }) {
  return { AccountAuthorize };
}

module.exports = connect(mapStateToProps)(Form.create()(View));
