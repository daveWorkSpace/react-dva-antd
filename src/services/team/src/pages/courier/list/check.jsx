import React, { Component, PropTypes } from 'react';
import { Form, Input, InputNumber, Button, Row, Col, Radio, DatePicker, Select } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { COURIER } from '../../../ActionsName';
import ReasonModal from './reasonModal';
import { example_id_card1 } from '../../../../../../../images/example_id_card1.jpg';
const [FormItem,
  RadioGroup,
  RangePicker,
  Option] = [Form.Item, Radio.Group, DatePicker.RangePicker, Select.Option];

class View extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      initTeamList: [],
      teams_info: [],
      id_card_sn: '',
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const { businessCourier } = nextProps;
    const { list_details } = businessCourier;
    const { courier_detail = {}, courier_audit_logs = {} } = list_details;
    const initTeamList = [];
    const teams_info = courier_detail.teams_info || [];
    const { id_card_sn } = courier_audit_logs;
    for (let i = 0; i < teams_info.length; i++) {
      initTeamList.push(teams_info[i]);
    }
    this.setState({
      initTeamList,
      teams_info,
      id_card_sn,
    })
  };

  changeModalvisible = (val) => {
    this.setState({
      visible: val,
    });
  }

  render() {
    const initTeamList = this.state.initTeamList;
    const id_card_sn = this.state.id_card_sn;
    const teams_info = this.state.teams_info;
    const { businessCourier, dispatch } = this.props;
    const { list_details } = businessCourier;
    const { account_detail = {}, courier_detail = {}, courier_audit_logs = {} } = list_details;
    const { visible } = this.state;
    const { changeModalvisible } = this;
    let hired_date = account_detail.hired_date ? (`${account_detail.hired_date}`) : '1900-09-09';
    const images = { 1: {}, 2: {}, 3: {} };
    const apply_info = {};
    if (account_detail.hired_date) {
      hired_date = `${hired_date.slice(0, 4)}-${hired_date.slice(4, 6)}-${hired_date.slice(6, 8)}`;
    }

    if (courier_detail.apply_info) {
      Object.assign(images, courier_detail.apply_info.images);
      Object.assign(apply_info, courier_detail.apply_info);
    }

    const work_state = account_detail.state ? window.tempAppTool.stateTransform('work_state', account_detail.state) : '';
    const { id } = courier_detail;
    const ex_vals = { courier_id: id, apply_id: courier_audit_logs.id };
    const area_name = courier_detail.area_info ? courier_detail.area_info.name : '';
    const reassignProps = {
      visible,
      onOk(values) {
        dispatch({
          type: COURIER.approve_verify,
          payload: { ...values, ...ex_vals, approved: false },
        });
        changeModalvisible(false);
      },
      onCancel(val) {
        changeModalvisible(false);
      },
    };

    function didSubmit() {
      dispatch({
        type: COURIER.approve_verify,
        payload: { ...ex_vals, approved: true },
      });
    }
    return (
      <div className="con-body">

        <Form layout="horizontal" className="main-form">
          <div className="bd-header">
            <h3 className="form-divider-header" style={{ margin: '0 0 16px 0', width: '99%' }}>基本信息</h3>

            <Row>
              <Col sm={12}>
                <FormItem label="姓名" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
                  {courier_detail.name}
                </FormItem>

                <FormItem label="手机号" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
                  {courier_detail.mobile}
                </FormItem>

                <FormItem label="入职时间" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
                  {hired_date}
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="所属团队" {...{ labelCol: { span: 4 }, wrapperCol: { span: 12 } }}>
                  {
                    teams_info.map((item, index) => {
                      return (<span key={`area_${item.id}`}>{item.name}{teams_info.length > 1 ? '、' : ''} </span>)
                    })
                  }
                </FormItem>

                <FormItem label="在职状态" {...{ labelCol: { span: 4 }, wrapperCol: { span: 12 } }}>
                  {work_state}
                </FormItem>

              </Col>
            </Row>
          </div>
          <div className="bd-content" style={{ marginBottom: '60px' }}>
            <h3 className="form-divider-header" style={{ margin: '0 0 16px 0', width: '99%' }}>身份信息</h3>
            <Row>
              <Col sm={12}>
                <FormItem label="法人身份证号" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
                  {id_card_sn || ''}
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col sm={12}>
                <FormItem label="身份证正面照" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
                  <img src={images[1].thumb_medium} {...{ style: { width: '400px', height: '300px' }, alt: '无上传图片' }} />
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="示例图片" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
                  <img src="./images/example_id_card2.jpg" {...{ style: { width: '400px', height: '300px' }, alt: '无上传图片' }} />
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="身份证反面照" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
                  <img src={images[2].thumb_medium} {...{ style: { width: '400px', height: '300px' }, alt: '无上传图片' }} />
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="示例图片" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
                  <img src="./images/reverse_id_card.jpg" {...{ style: { width: '400px', height: '300px' }, alt: '无上传图片' }} />
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="手持身份证照" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
                  <img src={images[3].thumb_medium} {...{ style: { width: '400px', height: '300px' }, alt: '无上传图片' }} />
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="示例图片" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
                  <img src="./images/example_id_card1.jpg" {...{ style: { width: '400px', height: '300px' }, alt: '无上传图片' }} />
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col sm={4} style={{ textAlign: 'center' }}>
                <Button ><Link to="/team/courier/list">返回</Link></Button>
              </Col>
              <Col sm={4} style={{ textAlign: 'center' }}>
                <Button
                  onClick={(e) => {
                    changeModalvisible(true)
                  }}
                >驳回</Button>
              </Col>
              <Col sm={4} style={{ textAlign: 'center' }}>
                <Button
                  style={{
                    textAlign: 'center',
                    width: '100px',
                    backgroundColor: '#00CFA1',
                    borderColor: '#00CFA1',
                    color: '#fff',
                  }} onClick={didSubmit}
                >通过</Button>
              </Col>
            </Row>
          </div>
        </Form>
        <ReasonModal {...reassignProps} />
      </div>
    );
  }

}

function mapStateToProps({ businessCourier }) {
  return { businessCourier };
}

module.exports = connect(mapStateToProps)(View);
