import dot from 'dot-prop';
import React, { Component, PropTypes } from 'react';
import { Form, Row, Col, Button, message } from 'antd';
import { connect } from 'dva';
import { CoreForm, CoreContent } from '../../core';
import { Modules, VerifyState, ServiceState } from '../../../application/define'
import { AccountProfile } from '../../actions'

class IndexComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      account: props.AccountProfile.account,
      vendor: props.AccountProfile.vendor,
    }

    this.private = {
      dispatch: props.dispatch,
    }
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      account: nextProps.AccountProfile.account,
      vendor: nextProps.AccountProfile.vendor,
    });
  }

  //编辑
  onEdit = () => {
    window.location.href = Modules.getPath(Modules.accountVendorEdit);
  }

  //提交审核
  onSubmit = () => {
    const { vendor, account } = this.state;
    const idCardSn = dot.get(vendor, 'profile.idCardSn');
    const vendorId = dot.get(vendor, 'id');
    if (!idCardSn || !vendorId || idCardSn.length === 0) {
      message.info('请编辑提交相关资质信息!');
      return;
    }

    const params = {
      vendorId,
      accountId: account.id,
      idCardSn,
    }
    this.private.dispatch({ type: AccountProfile.requestVerify, payload: params });
  }

  //渲染基本信息
  renderBaseInfo = () => {
    const { vendor, account } = this.state;

    //判断是否驳回
    let isReject = false;
    if (dot.get(vendor, 'verifyState.value') === VerifyState.pendingSubmit &&
        dot.get(vendor, 'applyInfo.serviceState.value') === ServiceState.off) {
      isReject = true;
    }

    const title = '基本信息';
    const formItems = [
      {
        label: '商户ID',
        form: <span>{dot.get(vendor, 'id')}</span>,
      },
      {
        label: '商户号',
        form: <span>{dot.get(vendor, 'sn')}</span>,
      },
      {
        label: '服务城市',
        form: <span>{dot.get(vendor, 'city.name')}</span>,
      },
      {
        label: '商户类型',
        form: <span>{dot.get(account, 'orgType.name')}</span>,
      },
      {
        label: '商户名称',
        form: <span>{dot.get(vendor, 'name')}</span>,
      },
      {
        label: '法人姓名',
        form: <span>{dot.get(vendor, 'profile.legalName')}</span>,
      },
      {
        label: '法人手机号',
        form: <span>{dot.get(vendor, 'mobile')}</span>,
      },
      {
        label: '审核状态',
        form: <span>{isReject ? '驳回' : dot.get(vendor, 'verifyState.name')}</span>,
      },
    ];

    if (isReject) {
      formItems.push(
        {
          label: '审核备注',
          form: <span>{dot.get(vendor, 'applyInfo.note') }</span>,
        },
      )
    }

    const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };

    return (
      <CoreContent title={title}>
        <CoreForm items={formItems} cols={2} layout={layout} />
      </CoreContent>
    )
  }

  //渲染操作按钮
  renderOperations = () => {
    const { vendor } = this.state;
    const verifyState = dot.get(vendor, 'verifyState.value');
    //判断如果是待提交和驳回状态，显示编辑和提交审核按钮
    const isShowOperations = (verifyState === VerifyState.pendingSubmit || verifyState === VerifyState.reject);
    if (isShowOperations === false) {
      return <div />
    }

    return (
      <div className="bd-content">
        <div className="content" style={{ backgroundColor: 'rgba(255, 255, 255, 0)!important' }}>
          <Row>
            <Col span={24} style={{ textAlign: 'center' }}>
              { isShowOperations ? <Button size="large" onClick={this.onEdit}>编辑</Button> : ''}
              { isShowOperations ? <Button size="large" type="primary" onClick={this.onSubmit}>提交审核</Button> : ''}
            </Col>
          </Row>
        </div>
      </div>
    )
  }

  render() {
    const { renderBaseInfo, renderOperations } = this;
    return (
      <div className="con-body">

        {/* 基本信息 */}
        {renderBaseInfo()}

        {/* 操作 */}
        {renderOperations()}
      </div>
    )
  }
}

function mapStateToProps({ AccountProfile }) {
  return { AccountProfile };
}

module.exports = connect(mapStateToProps)(IndexComponent);
