import dot from 'dot-prop';
import React, { Component, PropTypes } from 'react';
import { Form, Row, Col } from 'antd';
import { connect } from 'dva';
import { CoreForm, CoreContent } from '../../core';

class IndexComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      account: props.AccountProfile.account,
      vendor: props.AccountProfile.vendor,
    }
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      account: nextProps.AccountProfile.account,
      vendor: nextProps.AccountProfile.vendor,
    })
  }

  //基本信息
  renderBaseInfo = () => {
    const { account, vendor } = this.state;
    const title = '基本信息';
    const formItems = [
      {
        label: '工号',
        form: <span>{dot.get(account, 'sn')}</span>,
      },
      {
        label: '姓名',
        form: <span>{dot.get(account, 'name')}</span>,
      },
      {
        label: '性别',
        form: <span>{dot.get(account, 'gender.name')}</span>,
      },
      {
        label: '身份证号',
        form: <span>{dot.get(account, 'idCardSn')}</span>,
      },
      {
        label: '员工状态',
        form: <span>{dot.get(account, 'serviceState.name')}</span>,
      },
      {
        label: '服务商号',
        form: <span>{dot.get(account, 'orgId')}</span>,
      },
      {
        label: '所属服务商',
        form: <span>{dot.get(vendor, 'name')}</span>,
      },
      {
        label: '手机号',
        form: <span>{dot.get(account, 'mobile')}</span>,
      },
      {
        label: '入职时间',
        form: <span>{dot.get(account, 'hiredTime.name')}</span>,
      },
    ];
    const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };

    return (
      <CoreContent title={title} >
        <CoreForm items={formItems} cols={2} layout={layout} />;
      </CoreContent>
    )
  }

  //岗位信息
  renderAuthInfo = () => {
    const { account } = this.state;
    return (
      <div className="bd-content">
        <div className="content-title">岗位信息</div>
        <div className="content">
          <Row>
            <Col sm={12}>
              <Form.Item label="岗位" {...{ labelCol: { span: 6 }, wrapperCol: { span: 18 } }}>
                {dot.get(account, 'role.name')}
              </Form.Item>
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
        </div>
      </div>
    )
  }

  render() {
    const { renderBaseInfo, renderAuthInfo } = this;
    return (
      <div className="con-body">

        {/* 基本信息 */}
        {renderBaseInfo()}

        {/* 岗位信息 */}
        {/* {renderAuthInfo()} */}
      </div>
    )
  }
}
function mapStateToProps({ AccountProfile }) {
  return { AccountProfile };
}

module.exports = connect(mapStateToProps)(IndexComponent);
