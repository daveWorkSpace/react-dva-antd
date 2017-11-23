import React, { Component, PropTypes } from 'react';
import { Form, Input, Button, Row, Table, Pagination, Col, Radio, Modal } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { SELLER } from '../../../ActionsName';
import { geography } from './../../../../../../application';

const seller_types = { 1: '美食餐饮', 2: '生鲜蔬菜', 3: '超市商品', 4: '鲜花蛋糕', 5: '其他' };
const [FormItem,
  RadioGroup,
] = [Form.Item, Radio.Group];
const { stateTransform, utcToDate } = window.tempAppTool;
// 布局配置参数
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};


class MainForm extends Component {

  constructor(props) {
    super();
// 从props里面获取信息
    const { dispatch } = props;

    Object.assign(this, {
      dispatch,
      page: 1, //当前页数
    });
  }
// 分页函数
  onPageChange = (page) => {
    const { dispatch } = this;
    const obj = {};
    this.page = page;
    obj.seller_id = this.seller_id
    dispatch({ type: SELLER.getSellerShops, payload: { ...obj, page } });
  }

  render() {
    const { details, shops_info } = this.props;
    const { d_seller, d_account } = details;
    this.seller_id = d_seller.id; //商户ID
    const { page, onPageChange } = this;
    const { data, _meta } = shops_info;
    let _created_at = '--';//注册日期
    let _city_name = '--';//所属城市
    let _seller_type = '';//商家类型
    let _seller_name = '';//商家名称
    const _shop_address_detail = '';//TODO: 废弃
    const _shop_address = '';//TODO: 废弃
    const _shop_mobile = '';//TODO: 废弃
    let _state = '';//商户状态
    let _name = '';//联系人
    let _verify_state = '';//_verify_state
    const _Source_of_registration = 'ios';//TODO: 废弃
    let _mobile = '';

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


    const pagination = {
      total: _meta.result_count || 0,
      current: page,
      pageSize: 10,
      onChange: onPageChange,
    };

    if (d_seller.created_at) {
      const date = window.tempAppTool.utcToDate(d_seller.created_at).date;
      const time = window.tempAppTool.utcToDate(d_seller.created_at).time;
      time.length = 2;
      _created_at = `${window.tempAppTool.sqlit(date, '-')} ${window.tempAppTool.sqlit(time, ':')}`
    }

    // 获取城市代码并且转码
    const citys = geography.city;
    const n = citys.index.indexOf(d_seller.city_code);
    if (n != -1) {
      _city_name = citys.data[n].name;
    } else {
      _city_name = '无该城市';
    }

    _seller_type = window.tempAppTool.stateTransform('seller_type', d_seller.seller_type)
    _mobile = d_account.name;
    _verify_state = window.tempAppTool.stateTransform('verify_state', d_seller.verify_state)
    _state = window.tempAppTool.stateTransform('seller_state', d_seller.state)

    if (d_seller.biz_profile) {
      _name = d_seller.biz_profile.legal_name
    }
    _seller_name = d_seller.name;


    const total1 = data.length;

    return (
      <Form layout="horizontal" className="main-form">
        <h3 className="form-divider-header" style={{ margin: '0px' }}>基本信息</h3>

        <Row>
          <Col sm={12}>
            <FormItem label="商户号" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
              {d_seller.seller_no}
            </FormItem>
            <FormItem label="注册日期" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
              {_created_at}
            </FormItem>
            <FormItem label="所属城市" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
              {_city_name}
            </FormItem>
            <FormItem label="商家类型" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
              {_seller_type}
            </FormItem>

            <FormItem label="注册手机" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
              {d_account.mobile}
            </FormItem>
          </Col>
          <Col sm={12}>
            {/*<FormItem label="注册来源" {...{"labelCol":{"span":4},"wrapperCol":{"span":8}}}>*/}
            {/*{_Source_of_registration}*/}
            {/*</FormItem>*/}
            <FormItem label="审核状态" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
              {_verify_state}
            </FormItem>
            <FormItem label="商家名称" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
              {_seller_name}
            </FormItem>
            <FormItem label="联系人" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
              {_name}
            </FormItem>

            <FormItem label="商户状态" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
              {_state}
            </FormItem>

          </Col>
        </Row>

        <h3 className="form-divider-header" style={{ margin: '0px' }}>店铺信息</h3>

        <Table rowKey={(record, index) => { return index }} columns={columns} dataSource={data} loading={false} pagination={pagination} />

        {/*<Pagination*/}
        {/*className="ant-table-pagination"*/}
        {/*{...pagination}*/}
        {/*showTotal={total1 => `共 ${total1} 条`}*/}
        {/*/>*/}
        {/*<br/>*/}
        <h3 className="form-divider-header" style={{ margin: '0px' }}>资质认证</h3>
        <Row>
          <Col sm={24}>
            <FormItem
              label="" offset={5} style={{
                textAlign: 'center',
                marginTop: 20,
              }}
            >
              <h1>为保证其信息的安全，隐藏其资质认证的信息</h1>
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="center" align="top" style={{ marginTop: '16px' }}>
          <Col sm={5}>
            <Button ><Link to="/business/seller/list">返回</Link></Button>
          </Col>
        </Row>
      </Form>
    );
  }
}


const View = ({ businessSeller, dispatch }) => {
  return (
    <div className="con-body">
      <div className="bd-header" style={{ marginBottom: '60px' }}>
        <MainForm
          details={businessSeller.list_details}
          dispatch={dispatch}
          shops_info={businessSeller.shops_info}
        />
      </div>
    </div>
  );
};

function mapStateToProps({ businessSeller, businessPublic }) {
  return { businessSeller, businessPublic };
}

module.exports = connect(mapStateToProps)(View);
