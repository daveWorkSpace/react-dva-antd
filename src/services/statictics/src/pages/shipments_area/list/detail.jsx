import React, {Component, PropTypes} from 'react';
import {Form, Input, InputNumber, Button, Row, Col, Radio, DatePicker} from 'antd';
import {connect} from 'dva';
import {SHIPMENTS_AREA_LIST} from '../../../ActionsName';

const [FormItem,
  RadioGroup,
  RangePicker] = [Form.Item, Radio.Group, DatePicker.RangePicker];

//configs
//main
const MainForm = Form.create()((props) => {
  const fields = {
    name: {
      label: '区域名称',
      cols: '8_12',
      field: 'name',
    },

  };
  function _cols(str) {
    const _arr = str.split('_');
    return {
      labelCol: {span:_arr[0]},
      wrapperCol: {span:_arr[1]}
    };
  };
  const {getFieldDecorator, validateFields, getFieldsValue} = props.form;
  const {name, biz_mode, price_mode, plan_type} = fields;

  return (
    <Form layout='horizontal' onSubmit={handleSubmit} className="main-form">
      <p>基本信息</p>
      <Row>
        <Col sm={12}>
          <FormItem label="区域名称" {..._cols('8_12')}>
            <p>区域名称</p>
          </FormItem>
          <FormItem label="负责人" {..._cols('8_12')}>
            <p>负责人</p>
          </FormItem>
          <FormItem label="联系电话" {..._cols('8_12')}>
            <p>联系电话</p>
          </FormItem>
        </Col>

      </Row>
      <p>配送区域</p>
      <Row>
        <Col sm={24}>
        </Col>

      </Row>

    </Form>
  )
});

let View = ({staticticsShipmentsArea,dispatch}) => {

  return (
    <div className="con-body">
      <div className="bd-header"></div>
      <div className="bd-content">
        <MainForm />
      </div>
    </div>
  );
};

function mapStateToProps({staticticsShipmentsArea}) {
  return {staticticsShipmentsArea};
};

module.exports =  connect(mapStateToProps)(View);
