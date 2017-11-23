import dot from 'dot-prop'
import React, { Component, PropTypes } from 'react';
import { Form, Input, InputNumber, Button, Row, Col, Radio, Select, Checkbox, DatePicker, Alert, Icon, Tooltip } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';

import style from '../style/team.less';
import { EMPLOYEE } from '../../../ActionsName';
import { utcToDate } from '../../../../../../utils/newUtils';
import { authorize } from '../../../../../../application';
import { Roles } from '../../../../../../application/define';

const [FormItem, RadioGroup, Option] = [Form.Item, Radio.Group, Select.Option];

class MainForm extends React.Component {

  constructor({ businessEmployee }) {
    super();

    const { areaList, employeeDetail } = businessEmployee;

    //如果存在员工数据，则默认开启编辑员工数据模式，如果数据不存在，则开启创建新员工模式
    let isUpdateEmployee = true;
    if (employeeDetail.id) {
      isUpdateEmployee = false;
    }

    this.state = {
      areaList,                   //服务商服务区域列表
      employeeDetail,             //服务商详情数据
      isUpdateEmployee,           //如果存在员工数据，则默认开启编辑员工数据模式，如果数据不存在，则开启创建新员工模式
      isRenderAuthStorage: false, //是否渲染仓库分配模块
      isRenderAuthArea: false,    //是否渲染区域分配模块
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const { businessEmployee } = nextProps;
    const { areaList, employeeDetail } = businessEmployee;

    //如果存在员工数据，则默认开启编辑员工数据模式，如果数据不存在，则开启创建新员工模式
    let isUpdateEmployee = true;
    if (employeeDetail.id) {
      isUpdateEmployee = false;
    }
    this.setState({
      areaList,                   //服务商服务区域列表
      employeeDetail,             //服务商详情数据
      isUpdateEmployee,           //如果存在员工数据，则默认开启编辑员工数据模式，如果数据不存在，则开启创建新员工模式
    });
  }

  //提交表单
  handleSubmit = (e) => {
    const { form } = this.props;
    const { isUpdateEmployee } = this.state;
    const { onCreateEmployee, onUpdateEmployee } = this;
    e.preventDefault();
    form.validateFields((err, value) => {
      if (err) {
        return;
      }
      const values = form.getFieldsValue();

      //判断是编辑员工数据，还是创建新员工
      if (isUpdateEmployee) {
        onCreateEmployee(values);
      } else {
        onUpdateEmployee(values);
      }
    });
  }

  //创建员工
  onCreateEmployee = (values) => {
    const { dispatch } = this.props;
    const employeeInfo = {
      org_id: authorize.auth.vendorId,    //组织ID，父级服务商id
      type: 1,                             //账户类型，服务商
      name: values.name,                   //姓名
      state: values.state,                 //在职状态
      mobile: values.mobile,               //手机号
      work_type: values.work_type,         //工作类型
      id_card_sn: values.id_card_sn,       //身份证号
      hired_date: values.hired_date ? `${utcToDate(values.hired_date).date.join('')}` : '', //入职时间
    };

    dispatch({ type: EMPLOYEE.create, payload: employeeInfo });
  }

  //更新员工
  onUpdateEmployee = (values) => {
    const { dispatch } = this.props;
    const { employeeDetail } = this.state;
    const employeeInfo = {
      user_id: employeeDetail.id,          //员工id
      org_id: authorize.auth.vendorId,    //组织ID，父级服务商id
      type: 1,                             //账户类型，服务商
      name: values.name,                   //姓名
      state: values.state,                 //在职状态
      mobile: values.mobile,               //手机号
      work_type: values.work_type,         //工作类型
      id_card_sn: values.id_card_sn,       //身份证号
      hired_date: values.hired_date ? `${utcToDate(values.hired_date).date.join('')}` : '', //入职时间
    };

    dispatch({ type: EMPLOYEE.update, payload: employeeInfo });
  }

  //选择角色
  onChangeRoles = (checkedValues) => {
    //判断是否选择了仓库管理员角色，显示额外的规则
    if (checkedValues.includes(Roles.stockManager)) {
      this.setState({ isRenderAuthStorage: true });
    } else {
      this.setState({ isRenderAuthStorage: false });
    }

    //判断是否选择了区域管理员角色，显示额外的规则
    if (checkedValues.includes(Roles.areaManager)) {
      this.setState({ isRenderAuthArea: true });
    } else {
      this.setState({ isRenderAuthArea: false });
    }

    console.log('checked = ', checkedValues);
  }

  //选择区域
  onChangeArea = (value) => {
    console.log(`selected ${value}`);
  }

  //选择仓库
  onChangeStorage = (value) => {
    console.log(`selected ${value}`);
  }

  //员工基本信息
  renderBaseInfo = () => {
    const { getFieldDecorator } = this.props.form;
    const { employeeDetail, isUpdateEmployee } = this.state;

    //入职日期
    const date = new Date();
    let hiredDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    //如果编辑员工数据，则处理日期时间数据格式
    if (isUpdateEmployee && employeeDetail.hired_date) {
      hiredDate = String(employeeDetail.hired_date);
      employeeDetail.hired_date = `${hiredDate.slice(0, 4)}-${hiredDate.slice(4, 6)}-${hiredDate.slice(6, 8)}`;
    }

    return (
      <div>
        <div className="content-title">基本信息</div>
        <div className="content">
          <Row>
            <Col sm={12}>
              <FormItem label="姓名" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
                {
                  getFieldDecorator('name', {
                    initialValue: employeeDetail.name,
                    validate: [
                      { rules: [{ required: true, message: '请输入员工姓名' }], trigger: 'onBlur' },
                    ],
                  })(
                    <Input placeholder="请输入员工姓名" />,
                  )
                }
              </FormItem>
              <FormItem label="手机号" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
                {
                  getFieldDecorator('mobile', {
                    initialValue: employeeDetail.mobile,
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
                    <Input placeholder="请输入员工手机号" />,
                  )
                }
              </FormItem>
              <FormItem label="入职时间" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
                {
                  getFieldDecorator('hired_date',
                    {
                      initialValue: moment(hiredDate, 'YYYY-MM-DD'),
                      validate: [{ rules: [{ required: true, message: '请输入入职时间' }], trigger: 'onChange' }],
                    })(
                      <DatePicker />,
                    )
                }
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label="当前城市" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
                <span>{dot.get(authorize.vendor, 'city.name')}</span>
              </FormItem>
              <FormItem label="身份证号" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
                {
                  getFieldDecorator('id_card_sn', {
                    initialValue: employeeDetail.id_card_sn,
                    rules: [
                      {
                        required: true,
                        trigger: 'onBlur',
                        validator: (rule, value, callback) => {
                          if (!value) {
                            callback('请填写员工身份证号');
                            return;
                          }

                          if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(value))) {
                            callback('请输入正确的身份证号');
                            return;
                          }
                          callback();
                        },
                      },
                    ],
                  })(
                    <Input placeholder="请输入员工身份证号" />,
                  )
                }
              </FormItem>
              <FormItem label="性别" {...{ labelCol: { span: 4 }, wrapperCol: { span: 12 } }}>
                {
                  getFieldDecorator('sex', {
                    initialValue: employeeDetail.sex,
                    validate: [
                      { rules: [{ required: true, message: '请选择性别' }] },
                    ],
                  })(
                    <RadioGroup >
                      <Radio key="sex0" value={1}>男</Radio>
                      <Radio key="sex1" value={2}>女</Radio>
                    </RadioGroup>,
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <FormItem label="员工状态" {...{ labelCol: { span: 4 }, wrapperCol: { span: 12 } }}>
                {
                  getFieldDecorator('state', {
                    initialValue: employeeDetail.state,
                    validate: [
                      { rules: [{ required: true, message: '请选择员工状态' }] },
                    ],
                  })(
                    <RadioGroup >
                      <Radio key="state_0" value={100}>在职</Radio>
                      <Radio key="state_1" value={-100}>离职</Radio>
                    </RadioGroup>,
                  )
                }
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label="员工类型" {...{ labelCol: { span: 4 }, wrapperCol: { span: 12 } }}>
                {
                  getFieldDecorator('work_type', {
                    initialValue: employeeDetail.work_type,
                    validate: [
                      { rules: [{ required: true, message: '请选择员工类型' }] },
                    ],
                  })(
                    <RadioGroup >
                      <Radio key="state_02" value={10}>全职</Radio>
                      <Radio key="state_12" value={20}>兼职</Radio>
                    </RadioGroup>,
                  )
                }
              </FormItem>
            </Col>
          </Row>
        </div>
      </div>
    )
  }

  //员工岗位信息
  renderAuthInfo = () => {
    const { getFieldDecorator } = this.props.form;
    const { onChangeRoles, renderAuthArea, renderAuthStorage } = this;

    //岗位信息说明
    const title = (
      <span>
        <h4>岗位说明:</h4>
        <p>超级管理员：管理总负责人及其所有事务</p>
        <p>总负责人：负责所有事务管理 </p>
        <p>运营负责人：负责运营相关所有事务管理</p>
        <p>仓库操作员：负责分配仓库相关事务</p>
        <p>区域调度员：负责分配区域所有事务管理</p>
      </span>
    );

    //获取员工角色信息
    const options = Roles.allValues().map((currentValue, index, array) => {
      const label = Roles.description(currentValue);
      const value = currentValue;
      return (
        <Row key={`uniquRowKey${currentValue}`} >
          <Col span={24}>
            <Checkbox key={`authRole${currentValue}`} value={value}>{label}</Checkbox>
          </Col>
        </Row>
      );
    })

    return (
      <div>
        <div className="content-title">岗位信息 &nbsp;
          <Tooltip placement="right" title={title} arrowPointAtCenter>
            <Icon type="question-circle-o" />
          </Tooltip>
        </div>

        <div className="content">
          <div className={style.teamStyle}>
            <Alert message="提示:&nbsp;每个员工需分配一个岗位" type="warning" showIcon />
          </div>
          <Row>
            <Col sm={12}>
              <FormItem label="岗位" {...{ labelCol: { span: 4 }, wrapperCol: { span: 12 } }}>
                {
                  getFieldDecorator('authInfo')(
                    <Checkbox.Group onChange={onChangeRoles}>
                      {options}
                    </Checkbox.Group>,
                  )
                }
              </FormItem>
            </Col>
            <Col sm={12}>
              {renderAuthStorage()}
              {renderAuthArea()}
            </Col>
          </Row>
        </div>
      </div>
    )
  }

  //渲染仓库管理员规则模块
  renderAuthStorage = () => {
    const { getFieldDecorator } = this.props.form;
    const { onChangeStorage } = this;
    const { isRenderAuthStorage } = this.state;

    //判断是否渲染当前模块
    if (isRenderAuthStorage === false) {
      return (<div />)
    }

    return (
      <FormItem label="分配负责仓库" {...{ labelCol: { span: 8 }, wrapperCol: { span: 16 } }}>
        {
          getFieldDecorator('authStorage')(
            <Select style={{ width: '100%' }} onChange={onChangeStorage}>
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="disabled" disabled>Disabled</Option>
              <Option value="Yiminghe">yiminghe</Option>
            </Select>,
          )
        }
      </FormItem>
    )
  }

  //渲染区域管理员规则模块
  renderAuthArea = () => {
    const { getFieldDecorator } = this.props.form;
    const { onChangeArea } = this;
    const { isRenderAuthArea, areaList } = this.state;

    //判断是否渲染当前模块
    if (isRenderAuthArea === false) {
      return (<div />)
    }

    //获取区域列表
    const areas = areaList ? areaList.data : [];
    const children = [];
    areas.forEach((item, index) => {
      children.push(
        <Option key={`areaId${item.id}`} value={item.id}>{item.name}</Option>,
      );
    })
    return (
      <FormItem label="分配负责区域" {...{ labelCol: { span: 8 }, wrapperCol: { span: 16 } }}>
        {
          getFieldDecorator('authArea')(
            <Select mode="tags" style={{ width: '100%' }} searchPlaceholder="请选择仓库" onChange={onChangeArea}>
              {children}
            </Select>,
          )
        }
      </FormItem>
    )
  }

  //渲染页面模块
  render() {
    const { handleSubmit, renderBaseInfo, renderAuthInfo } = this;

    return (
      <div className="con-body">
        <div className="bd-content">
          <Form layout="horizontal" onSubmit={handleSubmit}>
            {/* 员工基本信息 */}
            { renderBaseInfo() }

            {/* 员工岗位信息 */}
            {/* { renderAuthInfo() } */}

            <div style={{ height: '16px' }} />
            <Row type="flex" justify="center" align="top">
              <Col sm={5}>
                <Button ><Link to="/team/employee/list">返回</Link></Button>
              </Col>
              <Col sm={5}>
                <Button style={{ width: '100px', backgroundColor: 'rgb(88,226,194)', borderColor: 'rgb(88,226,194)', color: '#fff' }} htmlType="submit">确定</Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ businessEmployee }) {
  return { businessEmployee };
}

module.exports = connect(mapStateToProps)(Form.create()(MainForm));
