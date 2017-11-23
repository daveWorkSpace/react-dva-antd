import dot from 'dot-prop'
import React, { Component, PropTypes } from 'react';
import { Form, Input, Button, Row, Col, Radio, Select, DatePicker } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { COURIER } from '../../../ActionsName';
import { utcToDate } from '../../../../../../utils/newUtils';
import aoaoAppSystemFlag from './../../../../../../utils/systemConfig';
import { authorize, geography } from '../../../../../../application'

const city = geography.city;
const [FormItem,
  RadioGroup,
  Option] = [Form.Item, Radio.Group, Select.Option];

class MainForm extends React.Component {

  constructor(props) {
    super();
    this.accountInfo = authorize.auth;
    this.userInfo = authorize.account;
    this.private = {
      vendor_id: authorize.vendor.id,
      created_by: authorize.account.id
    }
  }

  // 城市更改 获取不同城市下的团队列表
  onCityChange = (value) => {
    const { dispatch } = this.props;
    const city_code = value;
    const { vendor_id } = this.private;
    dispatch({
      type: 'businessCourier/getTeam',
      payload: { vendor_id, city_code },
    })
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { didSubmit, form } = this.props;
    const { city_code, name } = this.userInfo;
    const { vendor_id, created_by } = this.private;
    form.validateFields((err, value) => {
      if (err) {
        return;
      }
      const values = form.getFieldsValue();
      values.hired_date = values.hired_date ? `${utcToDate(values.hired_date).date.join('')}` : '';
      didSubmit({
        ...values,
        vendor_id,
        created_by,
      });
    });
  };

  render() {
    const { getFieldDecorator, validateFields, getFieldsValue } = this.props.form;
    const { areas, teamList, serviceCityList } = this.props;
    const { handleSubmit } = this;
    return (
      <Form layout="horizontal" onSubmit={handleSubmit} className="main-form">
        <h3 className="form-divider-header" style={{ width: '99%', margin: '0 0 16px 0 ' }}>基本信息</h3>
        <Row>
          <Col sm={12}>
            {
              aoaoAppSystemFlag.HAS_MORE_CITY === false ?
                <FormItem label="当前城市" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
                  {
                    getFieldDecorator('city_code', {
                      initialValue: dot.get(authorize.vendor, 'city.code'),
                    })(
                      <span>{dot.get(authorize.vendor, 'city.name')}</span>,
                    )
                  }
                </FormItem> :
                <FormItem label="城市" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
                  {
                    getFieldDecorator('city_code', {
                      validate: [
                        { rules: [{ required: true, message: '请选择骑士隶属团队', type: 'array' }] },
                      ],
                    })(
                      <Select showSearch placeholder="请选择城市" optionFilterProp="children" onSelect={this.onCityChange}>
                        {
                          serviceCityList.map((item, index) => {
                            return (
                              <Option key={item.city_code} value={item.city_code}>{item.city_name}</Option>
                            )
                          })
                        }
                      </Select>,
                    )
                  }
                </FormItem>
            }

            <FormItem label="姓名" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
              {
                getFieldDecorator('name', {
                  validate: [
                    { rules: [{ required: true, message: '请输入骑士姓名' }], trigger: 'onBlur' },
                  ],
                })(
                  <Input placeholder="请输入骑士姓名" />,
                )
              }
            </FormItem>

            <FormItem label="手机号" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
              {
                getFieldDecorator('mobile', {
                  rules: [
                    {
                      required: true,
                      trigger: 'onBlur',
                      validator: (rule, value, callback) => {
                        if (!value) { callback('请输入骑士手机号'); return; }
                        if (!(/^1[34578]\d{9}$/.test(value))) { callback('手机格式不对'); return; }
                        callback();
                      },
                    },
                  ],
                })(
                  <Input placeholder="请输入骑士手机号" />,
                )
              }
            </FormItem>

            <FormItem label="入职时间" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
              {
                getFieldDecorator('hired_date', {
                  validate: [
                    { rules: [{ required: true, message: '请选择入职时间' }], trigger: 'onBlur' },
                  ],
                })(
                  <DatePicker />,
                )
              }
            </FormItem>
          </Col>
          <Col sm={12}>
            {/*更改  将区域数据改为团队数据*/}
            <FormItem label="所属团队" {...{ labelCol: { span: 4 }, wrapperCol: { span: 12 } }}>
              {
                  getFieldDecorator('team_list', {
                    validate: [
                      { rules: [{ required: true, message: '请选择骑士隶属团队', type: 'array' }] },
                    ],
                  })(
                    <Select
                      showSearch
                      optionFilterProp="children"
                      placeholder="请选择骑士隶属团队"
                      mode="multiple"
                    >
                      {teamList.data.map((item, index) => {
                        return (<Option key={`area_${item.id}`} value={item.id}>{item.name} </Option>)
                      })}
                    </Select>,
                  )
                }
            </FormItem>

            <FormItem label="性别" {...{ labelCol: { span: 4 }, wrapperCol: { span: 12 } }}>
              {
                getFieldDecorator('sex', {
                  initialValue: 1,
                })(
                  <RadioGroup >
                    <Radio value={1}>男</Radio>
                    <Radio value={2}>女</Radio>
                  </RadioGroup>,
                )
              }
            </FormItem>

            <FormItem label="员工状态" {...{ labelCol: { span: 4 }, wrapperCol: { span: 12 } }}>
              {
                getFieldDecorator('state', {
                  initialValue: 100,
                })(
                  <RadioGroup>
                    <Radio value={100}>在职</Radio>
                    <Radio value={-100}>离职</Radio>
                  </RadioGroup>,
                )
              }
            </FormItem>

            <FormItem label="员工类型" {...{ labelCol: { span: 4 }, wrapperCol: { span: 12 } }}>
              {
                getFieldDecorator('work_type', {
                  initialValue: 10,
                })(
                  <RadioGroup>
                    <Radio value={10}>全职</Radio>
                    <Radio value={20}>兼职</Radio>
                  </RadioGroup>,
                )
              }
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="center" align="top">
          <Col sm={5}>
            <Button ><Link to="/team/courier/list">返回</Link></Button>
          </Col>
          <Col sm={5}>
            <Button
              style={{
                width: '100px',
                backgroundColor: '#00CFA1',
                borderColor: '#00CFA1',
                color: '#fff',
              }} htmlType="submit"
            >确定</Button>
          </Col>
        </Row>
      </Form>
    )
  }
}

MainForm = Form.create()(MainForm);


const View = ({ businessCourier, dispatch }) => {
  const formProps = {
    didSubmit(values) {
      dispatch({
        type: COURIER.creates,
        payload: values,
      });
    },
    teamList: businessCourier.teamList,
    serviceCityList: businessCourier.serviceCityList,
    dispatch,
  }
  return (
    <div className="con-body">
      <div className="bd-header">
        <MainForm {...formProps} />
      </div>
    </div>
  );
};

function mapStateToProps({ businessCourier }) {
  return { businessCourier };
}

module.exports = connect(mapStateToProps)(View);
