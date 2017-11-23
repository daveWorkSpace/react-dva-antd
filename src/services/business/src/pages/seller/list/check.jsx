import React, { Component, PropTypes } from 'react';
import { Form, Input, Button, Table, Pagination, Row, Col, Radio, Modal } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { SELLER } from '../../../ActionsName';
import { geography } from '../../../../../../application';

const seller_types = { 1: '美食餐饮', 2: '生鲜蔬菜', 3: '超市商品', 4: '鲜花蛋糕', 5: '其他' };
const [FormItem,
  RadioGroup,
  ] = [Form.Item, Radio.Group];
const { utcToDate } = window.tempAppTool;


const reasons = [
  ['身份证号与证件照号码不一致', 1],
  ['身份证正面照不清晰', 2],
  ['营业执照不清晰', 3],
  ['手持身份证照不清晰', 4],
  // ['其他',5],
];
const reasonsIndex = reasons.map(item => item[1]);
// 布局配置参数
const formItemLayout = {

  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
// 全局变量中从stateTransform
const { stateTransform } = window.tempAppTool;
// 按钮样式
const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};
class MainForm extends Component {
  constructor(props) {
    super();
    // 设置内部state
    this.state = {
      visible: false,
      reason: 1, //用户选择的单选信息
      reason_ex: '', //用户的输入信息
    };

    const { dispatch } = props;
    // 设置this
    Object.assign(this, {
      dispatch,
      page: 1, //当前页面
    });
  }
// 弹出框状态切换
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
// 弹出框的确认操作
  handleOk = (values) => {
    const { reason, reason_ex } = this.state;
    const { didSubmit } = this.props;
    didSubmit({
      ...values,
      approved: false,
      note: reason === 5 ? reason_ex : reasons[reasonsIndex.indexOf(reason)][0],
      reject_type: reason,
    });
    this.setState({
      visible: false,
    });
  }
  // 弹出框的取消函数
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }
// 获取用户的选择信息
  handleChange = (e) => {
    this.setState({
      reason: e.target.value,
    });
  }
// 获取用户的输入信息
  handleTextChange = (e) => {
    this.setState({
      reason_ex: e.target.value,
    });
  }
// 提交函数
  handleSubmit = (values) => {
    const { didSubmit, details } = this.props;
    values.approved = true;
    didSubmit(values);
  }
// 改变弹出框的状态
  changeModalvisible = (val) => {
    this.setState({
      visible: val,
    });
  }
// 改变弹出框的状态为false
  onCancel = () => {
    this.setState({
      visible: false,
    });
  }

  render() {
    // 从this里面获取信息
    const { changeModalvisible } = this;
    // 从props里面获取信息
    const { details, shops_info } = this.props;
    // 从model获取details信息
    const { d_seller = {}, d_account = {}, d_shop = {} } = details;
    // 从this里面获取信息
    const { page, onPageChange } = this;
    const { data, _meta } = shops_info;
    const { handleSubmit, showModal, handleOk, onCancel, handleChange, handleTextChange } = this;
    const { visible, reason, reason_ex } = this.state;
    const shop = d_seller.shop || {};
    // 从全局变量中获取相关的信息
    const { city } = geography;
    const { city_code, verify_state, seller_type, state, id } = d_seller;
    const city_name = city_code ? city.data[city.index.indexOf(city_code)].name : '';
    let _date = '';
    // 获取注册日期并重置数据结构
    if (d_seller.created_at) {
      const date = window.tempAppTool.utcToDate(d_seller.created_at).date;
      const time = window.tempAppTool.utcToDate(d_seller.created_at).time;
      time.length = 2;
      _date = `${window.tempAppTool.sqlit(date, '-')} ${window.tempAppTool.sqlit(time, ':')}`
    }

// 审核的状态
    const verify_name = verify_state ? stateTransform('verify_state', verify_state) : '';
    // 商家的类型名字
    const seller_type_name = seller_type ? seller_types[seller_type] : '';
    const verify_state_name = d_seller.verify_state ? stateTransform('verify_state', d_seller.verify_state) : '';
    const modalOpts = { title: '驳回原因', visible, onOk: () => { handleOk(ex_vals) }, onCancel };
    const images = { 1: {}, 3: {}, 5: {} };
    const apply_info = {};
    if (d_seller.apply_info) {
      Object.assign(images, d_seller.apply_info.images);
      Object.assign(apply_info, d_seller.apply_info);
    }
    const _noField = 'ios';
    const ex_vals = { seller_id: id, apply_id: apply_info.audit_log_id };

// 表格的列
    const columns = [
      {
        title: '店铺ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '店铺名称',
        dataIndex: 'name',
        key: 'name',

      }, {
        title: '联系人',
        dataIndex: 'linkman',
        key: 'linkman',
      }, {
        title: '联系电话',
        dataIndex: 'mobile',
        key: 'mobile',
        render: (text, record) => {
          return `${text}  ${record.tel}`;
        },
      },
      {
        title: '店铺地址',
        dataIndex: 'address',
        key: 'address',
        render: (text, record) => {
          return `${text}  ${record.address_detail}`;
        },
      }, {
        title: '创建时间',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (text) => {
          const _date = utcToDate(text);
          _date.time.length = 2;
          return `${_date.date.join('-')}  ${_date.time.join(':')}`;
        },
      },
    ];
    // 分页信息
    const pagination = {
      total: _meta.result_count || 0,
      current: page,
      pageSize: 5,
      onChange: onPageChange,
    };
    return (
      <Form layout="horizontal" className="main-form">
        <h3 className="form-divider-header" style={{ margin: '0px' }}>基本信息</h3>
        <Row>
          <Col sm={12}>
            <FormItem label="商户号" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
              {d_seller.seller_no}
            </FormItem>
            <FormItem label="注册日期" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
              {_date}
            </FormItem>
            <FormItem label="所属城市" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
              {city_name}
            </FormItem>
            <FormItem label="商家类型" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
              {seller_type_name}
            </FormItem>

            <FormItem label="注册手机" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
              {d_account.mobile}
            </FormItem>
          </Col>
          <Col sm={12}>
            <FormItem label="注册来源" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
              {_noField}
            </FormItem>
            <FormItem label="审核状态" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
              {verify_name}
            </FormItem>
            <FormItem label="商家名称" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
              {d_seller.name}
            </FormItem>
            <FormItem label="联系人" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
              {d_account.name}
            </FormItem>

            <FormItem label="商户状态" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
              {verify_state_name}
            </FormItem>

          </Col>
        </Row>

        <h3 className="form-divider-header" style={{ margin: '0px' }}>店铺信息</h3>

        <Table rowKey={(record, index) => { return index }} columns={columns} dataSource={data} loading={false} pagination={pagination} />

        <h3 className="form-divider-header">资质认证</h3>
        <Row type="flex" justify="center">
          <Col sm={18}>
            <FormItem label="身份证号" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
              {apply_info.id_card_sn}
            </FormItem>
          </Col>
          <Col sm={18}>
            <FormItem label="身份证正面照" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
              <img src={images[1].thumb_medium} {...{ style: { width: 230, height: 100 }, alt: '无上传图片' }} />
            </FormItem>
          </Col>
          <Col sm={18}>
            <FormItem label="手持身份证照" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
              <img src={images[3].thumb_medium} {...{ style: { width: 230, height: 100 }, alt: '无上传图片' }} />
            </FormItem>
          </Col>
          <Col sm={18}>
            <FormItem label="营业执照" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
              <img src={images[5].thumb_medium} {...{ style: { width: 230, height: 100 }, alt: '无上传图片' }} />
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="center" align="top">
          <Col sm={5}>
            <Button ><Link to="/business/seller/list">返回</Link></Button>
          </Col>
          <Col sm={5}>
            <Button onClick={(e) => { changeModalvisible(true) }}>驳回</Button>
          </Col>
          <Col sm={5}>
            <Button type="primary" style={{ width: 100 }} onClick={() => { handleSubmit(ex_vals) }}>通过</Button>
          </Col>

        </Row>
        <Modal {...modalOpts}>

          <Form layout="horizontal">
            <FormItem
              label="必选项："
              hasFeedback
              {...formItemLayout}
            >
              <RadioGroup onChange={handleChange} defaultValue={this.state.reason}>
                {
                reasons.map((item, index) => {
                  return (<Radio style={radioStyle} key={index} value={item[1]}>{item[0]}</Radio>)
                })
              }
                <Radio style={radioStyle} key="d" value={5}>
                其他...
                {this.state.reason === 5 ? <Input style={{ width: 240, marginLeft: 10 }} onChange={handleTextChange} /> : null}
                </Radio>
              </RadioGroup>
            </FormItem>

          </Form>
        </Modal>
      </Form>
    );
  }
}

const View = ({ businessSeller, dispatch }) => {
  const formProps = {

    shops_info: businessSeller.shops_info,
    details: businessSeller.list_details,
    didSubmit(values) {
      dispatch({
        type: SELLER.approve_verify,
        payload: values,
      })
    },

  };
  return (
    <div className="con-body">
      <div className="bd-header" />
      <div className="bd-content">
        <MainForm {...formProps} />
      </div>
    </div>
  );
};

function mapStateToProps({ businessSeller, businessPublic }) {
  return { businessSeller, businessPublic };
}

module.exports = connect(mapStateToProps)(View);
