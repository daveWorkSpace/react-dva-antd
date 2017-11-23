import React, { Component, PropTypes } from 'react';
import { Form, Input, InputNumber, Button, Row, Col, Radio, DatePicker, Alert } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { stateTransform } from '../../../../../../utils/newUtils'
import { Roles } from '../../../../../../application/define';

import style from '../style/team.less';

const [FormItem] = [Form.Item];
const { utcToDate, dateFormat, numberDateToStr } = window.tempAppTool;

const View = ({ businessEmployee, dispatch }) => {
  const { employeeDetail } = businessEmployee;

  //员工账号创建时间
  let createAt = '';
  if (employeeDetail.created_at) {
    const date = utcToDate(employeeDetail.created_at);
    date.time.length = 2;
    createAt = `${date.date.join('-')}  ${date.time.join(':')}`;
  }

  //入职时间
  let hiredDate = employeeDetail.hired_date ? (`${employeeDetail.hired_date}`) : '1900-09-09';
  if (employeeDetail.hired_date) {
    hiredDate = `${hiredDate.slice(0, 4)}-${hiredDate.slice(4, 6)}-${hiredDate.slice(6, 8)}`;
  }

  //TODO:角色信息

  return (
    <div className="con-body">
      <div className="bd-content">
        <div className="content-title">基本信息</div>
        <div className="content">
          <Row>
            <Col sm={12}>
              <FormItem label="姓名" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
                {employeeDetail.name}
              </FormItem>

              <FormItem label="手机号" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
                {employeeDetail.mobile}
              </FormItem>

              <FormItem label="入职时间" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
                {hiredDate}
              </FormItem>
              <FormItem label="创建时间" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
                {createAt}
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label="性别" {...{ labelCol: { span: 4 }, wrapperCol: { span: 12 } }}>
                {stateTransform('sex', employeeDetail.sex)}
              </FormItem>

              <FormItem label="身份证号" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
                {employeeDetail.id_card_sn}
              </FormItem>

              <FormItem label="员工状态" {...{ labelCol: { span: 4 }, wrapperCol: { span: 12 } }}>
                {stateTransform('work_state', employeeDetail.state)}
              </FormItem>
              <FormItem label="员工类型" {...{ labelCol: { span: 4 }, wrapperCol: { span: 12 } }}>
                {stateTransform('work_type', employeeDetail.work_type)}
              </FormItem>
            </Col>
          </Row>
        </div>
        {/* TODO:暂时隐藏岗位信息
        <div className="content-title">岗位信息</div>
        <div className="content">
          <Row>
            <Col sm={12}>
              <div className={style.jobInformations}>
                <FormItem label="岗位" {...{ labelCol: { span: 7 }, wrapperCol: { span: 12 } }}>
                  超级管理员
                </FormItem>
              </div>
            </Col>
            <Col sm={12}>
              <div style={{ borderLeft: '1px solid #e3e3e3', paddingLeft: '16px' }}>
                <h4>岗位说明:</h4>
                <p>超级管理员：管理总负责人及其所有事务</p>
                <p>总负责人：负责所有事务管理 </p>
                <p>运营负责人：负责运营相关所有事务管理</p>
                <p>仓库操作员：负责分配仓库相关事务</p>
                <p>区域调度员：负责分配区域所有事务管理</p>
              </div>
            </Col>
          </Row>
        </div> */}
        <Row type="flex" justify="center" align="top">
          <Col sm={5}>
            <Button ><Link to="/team/employee/list">返回</Link></Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

function mapStateToProps({ businessEmployee }) {
  return { businessEmployee };
}

module.exports = connect(mapStateToProps)(View);
