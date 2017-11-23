import React, { Component, PropTypes } from 'react';
import { Form, Input, InputNumber, DatePicker, Button, Row, Col, Radio, Select, Upload, Icon, Modal } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { COURIER } from '../../../ActionsName';
import moment from 'moment';
import { utcToDate } from '../../../../../../utils/newUtils';
import { geography, authorize } from '../../../../../../application';
import aoaoAppSystemFlag from './../../../../../../utils/systemConfig';

const [FormItem,
  RadioGroup,
  Option, Confirm] = [Form.Item, Radio.Group, Select.Option, Modal.confirm];

const citesDict = geography.city;

class MainForm extends React.Component {

  constructor(props) {
    super()
    this.state = {
      initTeamList: [],
      teams_info: [],
      teamList: {
        _meta: {},
        data: [],
      },
      serviceCityList: [],
    };
    this.form = props.form;
  }

  componentWillReceiveProps = (nextProps) => {
    const { details, getCourierDetail, teamList, serviceCityList } = nextProps;
    const { courier_detail } = details;
    const { teams_info } = getCourierDetail;
    const initTeamList = [];
    if (teams_info) {
      for (let i = 0; i < teams_info.length; i++) {
        initTeamList.push(teams_info[i].id);
      }
      this.setState({
        initTeamList,
        teams_info,
      })
    }
    this.setState({
      teamList,
      serviceCityList,
    })
  };

  //提交表单数据，做骑士的二次确认
  submitCheck = (e) => {
    e.preventDefault();

    const { handleSubmit, form } = this;
    const { details } = this.props;
    const { courier_detail } = details;

    // 如果没有未完成的运单，则直接提交保存
    if (courier_detail.have_undone_orders === false) {
      return handleSubmit()
    }

    //获取表单数据，如果提交的员工信息不是离职，则直接提交保存
    const values = form.getFieldsValue();
    if (values.state !== -100) {
      return handleSubmit()
    }

    //提示用户二次确认
    Confirm({
      title: '当前骑士有未完成订单，确定将该骑士设置离职？',
      content: '点击确定按钮，骑士将设置为离职状态',
      onOk() {
        handleSubmit();
      },
    });
  }

  //提交表单数据
  handleSubmit = (e) => {
    const { form } = this;
    const { didSubmit, details } = this.props;
    const { account_detail, courier_detail } = details;

    form.validateFields((err, value) => {
      if (err) {
        return;
      }
      const values = form.getFieldsValue();
        /*const { city_code } = account_detail;*/
      const { id, area_id } = courier_detail;
      values.hired_date = `${utcToDate(values.hired_date).date.join('')}`
        // values.hired_date = values.hired_date.replace(/-/g, '');
      didSubmit({ ...values, courier_id: id });
    });
  }

  getUploadStyle = (path) => {
    const _path = path || '/assets/none.png';
    return {
      style: {
        width: '230px',
        height: '100px',
        backgroundImage: `url(${_path})`,
      },
    };
  };

  editCityChange = (value) => {
    const { dispatch } = this.props;
    const { form } = this;
    /*form.resetFields([{'team_list':''}]);*/
    form.setFieldsValue({ team_list: [] });
    /*this.setState({
     initTeamList: '',
     });*/
    const vendor_id = authorize.auth.vendorId;
    dispatch({
      type: 'businessCourier/getTeam',
      payload: {
        vendor_id,
        city_code: value,
      },
    })
  };

  render() {
    const { getFieldDecorator, validateFields, getFieldsValue } = this.form;
    const { details, areas, handleUpload } = this.props;
    const uploadProps = {
      name: 'file',
      showUploadList: false,
      action: '/upload.do',
    };
    const { account_detail, courier_detail } = details;
    const { submitCheck, getUploadStyle } = this;
    const initTeamList = this.state.initTeamList;
    const teams_info = this.state.teams_info;
    const teamList = this.state.teamList;
    let hired_date = account_detail.hired_date ? (`${account_detail.hired_date}`) : '1900-09-09';
    if (account_detail.hired_date) {
      hired_date = `${hired_date.slice(0, 4)}-${hired_date.slice(4, 6)}-${hired_date.slice(6, 8)}`;
    }

    return (
      <Form layout="horizontal" onSubmit={submitCheck} className="main-form">
        <h3 className="form-divider-header" style={{ width: '99%', margin: 0 }}>基本信息</h3>
        <div style={{ height: 16 }} />
        <Row>
          <Col sm={12}>
            {
              aoaoAppSystemFlag.HAS_MORE_CITY === false ?
                <FormItem label="当前城市" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
                  {
                    getFieldDecorator('city_code', {
                      initialValue: courier_detail.city_code,
                    })(
                      <span>{geography.cityName(courier_detail.city_code)}</span>,
                    )
                  }
                </FormItem> :
                <FormItem label="城市" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
                  {
                    getFieldDecorator('city_code', {
                      initialValue: courier_detail.city_code,
                      validate: [
                        { rules: [{ required: true, message: '请选择城市' }], trigger: 'onBlur' },
                      ],
                    })(
                      <Select
                        showSearch
                        optionFilterProp="children"
                        onSelect={this.editCityChange}
                      >
                        {this.state.serviceCityList.map((item, index) => {
                          return (<Option key={`${item.city_code}`} value={item.city_code}>{item.city_name} </Option>)
                        })}
                      </Select>,
                    )
                  }
                </FormItem>
            }

            <FormItem label="手机号" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
              {
                getFieldDecorator('mobile', {
                  initialValue: courier_detail.mobile,
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
                  <Input />,
                )
              }
            </FormItem>
            <FormItem label="入职时间" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
              {
                getFieldDecorator('hired_date', {
                  initialValue: moment(hired_date, 'YYYY-MM-DD'),
                  validate: [
                    { rules: [{ required: true, message: '请选择入职时间' }], trigger: 'onBlur' },
                  ],
                })(
                  <DatePicker />,
                )
              }
            </FormItem>
            <FormItem label="员工类型" {...{ labelCol: { span: 4 }, wrapperCol: { span: 12 } }}>
              {
                getFieldDecorator('work_type', { initialValue: courier_detail.work_type })(
                  <RadioGroup>
                    <Radio value={10}>全职</Radio>
                    <Radio value={20}>兼职</Radio>
                  </RadioGroup>,
                )
              }
            </FormItem>
          </Col>
          <Col sm={12}>
            <FormItem label="姓名" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
              {
                getFieldDecorator('name', {
                  initialValue: courier_detail.name,
                  validate: [
                    { rules: [{ required: true, message: '请输入姓名' }], trigger: 'onBlur' },
                  ],
                })(
                  <Input />,
                )
              }
            </FormItem>
            <FormItem label="所属团队" {...{ labelCol: { span: 4 }, wrapperCol: { span: 12 } }}>
              {
                getFieldDecorator('team_list', {
                  initialValue: initTeamList,
                  validate: [
                    { rules: [{ type: 'array', required: true, message: '请选择所属团队' }], trigger: 'onChange' },
                  ],
                })(
                  <Select
                    mode="multiple"
                    showSearch
                    optionFilterProp="children"
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
                getFieldDecorator('sex', { initialValue: account_detail.sex })(
                  <RadioGroup>
                    <Radio value={1}>男</Radio>
                    <Radio value={2}>女</Radio>
                  </RadioGroup>,
                )
              }

            </FormItem>
            <FormItem label="在职状态" {...{ labelCol: { span: 4 }, wrapperCol: { span: 12 } }}>
              {
                getFieldDecorator('state', { initialValue: account_detail.state })(
                  <RadioGroup>
                    <Radio value={100}>在职</Radio>
                    <Radio value={-100}>离职</Radio>
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
  const { getCourierDetail, teamList, serviceCityList } = businessCourier;
  const FormProps = {
    details: businessCourier.list_details,
    getCourierDetail,
    teamList,
    serviceCityList,
    dispatch,
    handleUpload(params) {
      dispatch({
        type: COURIER.upload,
        payload: { ...params },
      });
    },
    didSubmit(values) {
      dispatch({
        type: COURIER.updates,
        payload: values,
      });
    },
  }
  return (
    <div className="con-body">
      <div className="bd-content m-margin">
        <MainForm {...FormProps} />
      </div>
    </div>
  );
};

function mapStateToProps({ businessCourier }) {
  return { businessCourier };
}

module.exports = connect(mapStateToProps)(View);
