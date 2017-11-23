import dot from 'dot-prop';
import React, { Component, PropTypes } from 'react';
import { Form, Row, Col, Button, Input, Upload, Icon, message } from 'antd';
import { connect } from 'dva';
import { CoreForm, CoreContent } from '../../core';
import { Modules } from '../../../application/define'
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
    const { isUploadSuccess, isUpdateVendorVerifyInfo, vendor, account } = nextProps.AccountProfile;

    //判断上传图片是否成功
    if (isUploadSuccess === true) {
      this.setState({ vendor });
      this.private.dispatch({ type: AccountProfile.resetUploadVerifyState });
    }

    //判断，如果提交成功则跳转到详情页面，
    if (isUpdateVendorVerifyInfo === true) {
      this.private.dispatch({ type: AccountProfile.resetUpdateVendorVerifyState });
      setTimeout(() => {
        window.location.href = Modules.getPath(Modules.accountVendorProfile);
      }, 1000);
    }
  }

  // 上传图片
  onUpload = (assetType, file) => {
    const { vendor, account } = this.state;
    const params = {
      accountId: account.id,
      vendorId: vendor.id,
      assetType,
      file,
    }
    this.private.dispatch({ type: AccountProfile.uploadVerifyImage, payload: params });
  }

  //取消操作，返回上一页面
  onCancle = () => {
    window.location.href = Modules.getPath(Modules.accountVendorProfile);
  }

  //保存，保存当前的信息
  onSubmit = (e) => {
    e.preventDefault();
    const { vendor, account } = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const idCardImage = dot.has(vendor, 'applyInfo.images.1.thumb_medium', '');
        if (idCardImage === '' || idCardImage === false) {
          message.info('请上传身份证正面照！');
          return;
        }

        //提交身份证信息
        const params = {
          vendorId: vendor.id,
          accountId: account.id,
          idCardSn: values.idCardSn,
          name: values.name,
          ownerName: values.legalName,
        }
        this.private.dispatch({ type: AccountProfile.updateVendorVerifyInfo, payload: params });
      }
    });
  }

  //渲染基本信息
  renderBaseInfo = () => {
    const { vendor, account } = this.state;
    const { getFieldDecorator } = this.props.form;

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
        form: getFieldDecorator('name', {
          initialValue: dot.get(vendor, 'name'),
          rules: [{ required: true, message: '请填写内容', whitespace: true }],
        })(
          <Input placeholder="商户名称" />,
        ),
      },
      {
        label: '法人姓名',
        form: getFieldDecorator('legalName', {
          initialValue: dot.get(vendor, 'profile.legalName'),
          rules: [{ required: true, message: '请填写内容', whitespace: true }],
        })(
          <Input placeholder="法人姓名" />,
        ),
      },
    ];
    const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };

    return (
      <CoreContent title={title}>
        <CoreForm items={formItems} cols={2} layout={layout} />;
      </CoreContent>
    )
  }

  renderUploadInfo = (imageURL, imagePath = '', assetType) => {
    const style = {
      style: {
        background: `url(${imageURL}) center center / contain no-repeat`,
        width: '100%',
        height: '100%',
      },
    }

    const uploadProps = {
      name: 'file',
      showUploadList: false,
      action: '/upload.do',
    };
    return (
      <Row type="flex" justify="center" gutter={48}>
        <Col sm={10} >
          <div {...style}>
            <Upload.Dragger {...uploadProps} beforeUpload={(file) => { this.onUpload(assetType, file); return false; }}>
              <Icon type="plus" />
            </Upload.Dragger>
          </div>
        </Col>
        <Col sm={10} style={{ textAlign: 'center', border: '1px solid #e9e9e9', borderRadius: '4px', padding: '0px' }}>
          <img src={imagePath} style={{ width: '100%', height: '100%' }} />
        </Col>
      </Row>
    )
  }

  renderLegalInfo = () => {
    const { getFieldDecorator } = this.props.form;
    const { vendor } = this.state;
    const title = '认证资料';
    const formItems = [
      {
        label: '法人身份证号',
        form: getFieldDecorator('idCardSn', {
          initialValue: dot.get(vendor, 'profile.idCardSn'),
          rules: [
            {
              required: true,
              trigger: 'onBlur',
              validator: (rule, value, callback) => {
                if (!value) { callback('请填写法人身份证'); return; }
                if (!(/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(value))) { callback('请输入正确的身份证号'); return; }
                callback();
              },
            },
          ],
        })(
          <Input placeholder="法人身份证号" />,
        ),
      },
      {
        label: '身份证正面',
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 24 } },
        form: this.renderUploadInfo(dot.get(vendor, 'applyInfo.images.1.thumb_medium', ''), '/images/example_id_card2.jpg', 1),
      },
      {
        label: '手持身份证照',
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 24 } },
        form: this.renderUploadInfo(dot.get(vendor, 'applyInfo.images.3.thumb_medium', ''), '/images/example_id_card1.jpg', 3),
      },
      {
        label: '营业执照',
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 24 } },
        form: this.renderUploadInfo(dot.get(vendor, 'applyInfo.images.5.thumb_medium', ''), '/images/example_license.jpg', 5),
      },
    ];

    return (
      <CoreContent title={title}>
        <CoreForm items={formItems} />
      </CoreContent>
    )
  }

  //渲染操作按钮
  renderOperations = () => {
    return (
      <div className="bd-content">
        <div className="content" style={{ backgroundColor: 'rgba(255, 255, 255, 0)!important' }}>
          <Row>
            <Col span={24} style={{ textAlign: 'center' }}>
              <Button size="large" onClick={this.onCancle}>取消</Button>
              <Button size="large" type="primary" htmlType="submit">保存</Button>
            </Col>
          </Row>
        </div>
      </div>
    )
  }

  render() {
    const { renderBaseInfo, renderLegalInfo, renderOperations } = this;
    return (
      <div className="con-body">
        <Form layout="horizontal" onSubmit={this.onSubmit} className="main-form">

          {/* 基本信息 */}
          {renderBaseInfo()}

          {/* 认证资料 */}
          {renderLegalInfo()}

          {/* 操作 */}
          {renderOperations()}
        </Form>
      </div>
    )
  }
}
function mapStateToProps({ AccountProfile }) {
  return { AccountProfile };
}

module.exports = connect(mapStateToProps)(Form.create()(IndexComponent));
