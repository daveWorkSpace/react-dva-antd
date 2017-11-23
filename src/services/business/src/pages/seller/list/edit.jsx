import React, { Component, PropTypes } from 'react';
import { Form, Input, InputNumber, Button, Row, Col, message, Radio, Select } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { SELLER } from '../../../ActionsName';
import { geography } from '../../../../../../application'


const { stateTransform } = window.tempAppTool;

const [FormItem, RadioGroup, Option] = [Form.Item, Radio.Group, Select.Option];


class MainForm extends React.Component {

  constructor(props) {
    super()
    // 获取form
    this.form = props.form;
  }
// 编辑提交的函数
  handleSubmit = (e) => {
    e.preventDefault();
    // 从props里面获取信息
    const { details, form, didSubmit } = this.props;
    const values = form.getFieldsValue();
    // 获取城市代码
    const city_code = details.d_seller.city_code || details.d_account.city_code;
    const { id } = details.d_seller;

    //修改联系方式规则: 如果输入的是手机号 参数传入shop_mobile 如果输入的是座机号 参数shop_tel
    // 无论传入谁，最后把mobile_tel 参数删掉_mobile_tel
    // 判断手机号的正则
    const mobileRx = /^(0|86|17951)?(13[0-9]|15[012356789]|17[0-8]|18[0-9]|14[57])[0-9]{8}$/;
    // 判断座机号的正则
    const _mobile_tel = this.props.form.getFieldValue('mobile_tel');


    if (!_mobile_tel) {
      message.error('联系方式为非空字段')
    } else {
      // 判断是否存在-不存在未手机 存在为座机
      if (_mobile_tel.indexOf('-') !== -1) {
        const arr = _mobile_tel.split('-')
        // 座机判断
        if (arr[0].length == 3 && arr[1].length == 8) {
          values.shop_tel = _mobile_tel;
          delete values.mobile_tel;
        } else if (arr[0].length == 4 && arr[1].length == 7) {
          values.shop_tel = _mobile_tel;
          delete values.mobile_tel;
        } else if (arr[0].length == 4 && arr[1].length == 8) {
          values.shop_tel = _mobile_tel;
          delete values.mobile_tel;
        } else {
          message.error('输入的座机号格式不对')
          return;
        }
      } else {
        // 手机号判断
        if (!(mobileRx.test(_mobile_tel))) {
          message.error('输入的手机号格式不对')
          return;
        }
        values.shop_mobile = _mobile_tel;
        delete values.mobile_tel;
      }
    }

// 集合参数提交
    didSubmit({ ...values, seller_id: id, city_code });
  }

  render() {
    // 从props里面获取信息
    const { details, form } = this.props;
    // 从model获取details信息
    const { d_seller, d_account } = details;
    // 从form里面获取信息
    const { getFieldDecorator } = form;
    // 从this里面获取信息
    const { handleSubmit } = this;
    // 从全局变量里面获取信息
    const { city } = geography;
    const { city_code, created_at } = d_seller;
    let city_name = '';//城市名字
    let _mobile_tel = '';//联系方式（可能为手机号也可能为座机号）
    if (city_code) {
      try {
        const _i = city.index.indexOf(city_code);
        city_name = city.data[_i].name;
      } catch (e) {
      }
    }

    const _date = created_at ? created_at.slice(0, 10) : '1900-09-09';
    let verify_name = '';
    if (typeof d_seller.apply_info.state !== 'undefined' && d_seller.verify_state === 0) {
      verify_name = '驳回';
    } else {
      verify_name = stateTransform('verify_state', d_seller.verify_state)
    }

    if (d_seller.shop) {
      if (d_seller.shop.mobile && d_seller.shop.tel) {
        _mobile_tel = d_seller.shop.mobile;
      } else if (d_seller.shop.mobile || d_seller.shop.tel) {
        _mobile_tel = d_seller.shop.mobile || d_seller.shop.tel;
      } else {
        _mobile_tel = d_seller.shop.mobile;
      }
    }
    return (
      <Form layout="horizontal" onSubmit={handleSubmit} className="main-form">

        <h3 className="form-divider-header">基本信息</h3>
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
            <FormItem label="商家名称" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
              {
                getFieldDecorator('name', { initialValue: d_seller.name,
                  validate: [
                    { rules: [{ required: true, message: '请输入商家名称' }], trigger: 'onBlur' },
                  ],
                })(
                  <Input />,
                )
              }
            </FormItem>
            <FormItem label="商家类型" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
              {
                getFieldDecorator('seller_type', { initialValue: `${d_seller.seller_type}`,
                  validate: [
                    { rules: [{ required: true, message: '请选择商家类型' }], trigger: 'onBlur' },
                  ],
                })(
                  <Select>
                    <Option key="1" value="1">美食餐饮</Option>
                    <Option key="2" value="2">生鲜蔬菜</Option>
                    <Option key="3" value="3">超市商品</Option>
                    <Option key="4" value="4">鲜花蛋糕</Option>
                    <Option key="5" value="5">其他</Option>
                  </Select>,
                )
              }
            </FormItem>
          </Col>
          <Col sm={12}>
            <FormItem label="注册来源" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
              ios
            </FormItem>
            <FormItem label="审核状态" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
              {verify_name}
            </FormItem>
            <FormItem label="注册手机" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
              {d_account.mobile}
            </FormItem>

            <FormItem label="联系人" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
              {
                getFieldDecorator('owner_name', { initialValue: d_account.name,
                  validate: [
                    { rules: [{ required: true, message: '请输入联系人' }], trigger: 'onBlur' },
                  ],
                })(
                  <Input />,
                )
              }
            </FormItem>
            <FormItem label="商户状态" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
              {
                getFieldDecorator('state', { initialValue: `${d_seller.state}` })(
                  <RadioGroup>
                    <Radio value="100">启用</Radio>
                    <Radio value="-100">禁用</Radio>
                  </RadioGroup>,
                )
              }
            </FormItem>
          </Col>
        </Row>
        <h3 className="form-divider-header">店铺信息</h3>
        <Row>
          <Col sm={12}>
            <FormItem label="联系方式" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
              {/*<Input {...getFieldProps("shop_mobile", { initialValue: d_seller.shop.mobile,*/}
              {/*validate: [*/}
              {/*{ rules: [ { required: true, message: '请输入联系电话'}, ], trigger: 'onBlur', }*/}
              {/*]*/}
              {/*})} />*/}
              {
                getFieldDecorator('mobile_tel', { initialValue: _mobile_tel })(
                  <Input
                    {...{ style: { width: 310 } }}
                  />,
                )
              }
            </FormItem>
            <FormItem label="店铺地址" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
              {d_seller.shop.address}
            </FormItem>
            <FormItem label="门牌号" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
              {d_seller.shop.address_detail}
            </FormItem>
          </Col>
        </Row>


        <h3 className="form-divider-header">资质认证</h3>
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
        <Row type="flex" justify="center" align="top">
          <Col sm={5}>
            <Button ><Link to="/business/seller/list">取消</Link></Button>
          </Col>
          <Col sm={5}>
            <Button
              style={{ width: '100px',
                backgroundColor: 'rgb(88,226,194)',
                borderColor: 'rgb(88,226,194)',
                color: '#fff' }} htmlType="submit"
            >确定</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

/*

 //更改地址会导致定位发生变化，但是现在没做定位，所以暂时地址不允许更改
 <FormItem label="店铺地址" {...{"labelCol":{"span":4},"wrapperCol":{"span":8}}}>
 <Input {...getFieldProps("address", { initialValue: d_seller.shop.address,
 validate: [
 { rules: [ { required: true, message: '请输入店铺地址'}, ], trigger: 'onBlur', }
 ]
 })} />
 </FormItem>
 <FormItem label="门牌号" {...{"labelCol":{"span":4},"wrapperCol":{"span":8}}}>
 <Input {...getFieldProps("address_detail", { initialValue: d_seller.shop.address_detail })} />
 </FormItem>
 */

MainForm = Form.create()(MainForm);

const View = ({ businessSeller, dispatch }) => {
  const formProps = {
    didSubmit(values) {
      dispatch({
        type: SELLER.updates,
        payload: values,
      });
    },
    details: businessSeller.list_details,
  }
  return (
    <div className="con-body">
      <div className="bd-header">
        <MainForm {...formProps} />
      </div>
    </div>
  );
};

function mapStateToProps({ businessSeller, businessPublic }) {
  return { businessSeller, businessPublic };
}

module.exports = connect(mapStateToProps)(View);
