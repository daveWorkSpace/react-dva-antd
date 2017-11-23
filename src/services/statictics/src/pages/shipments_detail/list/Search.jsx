import React, { Component, PropTypes } from 'react';
import { Form, Row, Col, Input, Button, Checkbox, Icon, Select, DatePicker, Popover } from 'antd';
import { Link } from 'dva/router';

const [FormItem, Option, RangePicker] = [Form.Item, Select.Option, DatePicker.RangePicker];
// const radioArr = [
//   {
//     "txt": "全部",
//     "val": "7"
//   },
//   {
//     "txt": "已创建",
//     "val": "0"
//   }, {
//     "txt": "已取货",
//     "val": "2"
//   }, {
//     "txt": "未完成",
//     "val": "3"
//   }, {
//     "txt": "异常",
//     "val": "4"
//   }, {
//     "txt": "已送达",
//     "val": "5"
//   }, {
//     "txt": "已关闭",
//     "val": "6"
//   }
// ];
const Search = Form.create()((props) => {
  const { getFieldDecorator, getFieldsValue, setFieldsValue, resetFields } = props.form;
  const { onSearch, sellerTypeCB, areas = { data: [] }, sellers = [], couriers = [] } = props;
  function handleSubmit(e) {
    e.preventDefault();
    onSearch(getFieldsValue())
  }
  function handleSelect() {
    //重置商家
    resetFields(['seller_id'])
  }
  //获取日期选择器组件值
  function getRangePickerValue(date, dateString) {
    return dateString
  }
  //控制日期时间，超过今天不可选
  function disabledDate(current) {
    return current && current.valueOf() > Date.now();
  }
  const content1 = (
    <div>
      <p> 1.结算方式：为配送费结算方式； </p>
      <p> 2.配送时效：为送达时间与期望送达时间的差值，带括号的为早达时长 </p>
    </div>
  );
  const itemLayout = { labelCol: { span: 5 }, wrapperCol: { span: 14 } };
  return (
    <Form layout="horizontal" className="ant-advanced-search-form" onSubmit={handleSubmit}>
      <Row gutter={24}>
        <Col sm={8}>
          <FormItem label="区域名称" {...itemLayout}>
            {
                    getFieldDecorator('area_id')(
                      <Select showSearch placeholder="请选择区域名称" optionFilterProp="children" >
                        <Option value="">全部</Option>
                        {
                            areas.data.map((item, index) => {
                              return <Option key={`${item.id}${index}`} value={item.id}>{`${item.name}${item.vendor ? `(${item.vendor.name})` : ''}`}</Option>
                            })
                        }
                      </Select>,
                    )
                    }
          </FormItem>
        </Col>
        <Col sm={8}>
          <FormItem label="订单编号" {...itemLayout} >
            {
                        getFieldDecorator('org_order_id')(
                          <Input {...{ placeholder: '请输入订单编号' }} />,
                        )
                    }
          </FormItem>
        </Col>
        <Col sm={8}>
          <FormItem label="订单类型" {...itemLayout} >
            {
                    getFieldDecorator('delivery_state', { initialValue: '' })(
                      <Select showSearch optionFilterProp="children" placeholder="请选择订单类型" >
                        <Option key="delivery_state_0" value="">全部</Option>
                        <Option key="delivery_state_1" value="5">已创建</Option>
                        <Option key="delivery_state_2" value="10">待分配</Option>
                        <Option key="delivery_state_3" value="15">已分配</Option>
                        <Option key="delivery_state_4" value="20">已接单</Option>
                        <Option key="delivery_state_5" value="22">已到店</Option>
                        <Option key="delivery_state_6" value="24">已取货</Option>
                        <Option key="delivery_state_8" value="-50">异常</Option>
                        <Option key="delivery_state_9" value="100">已送达</Option>
                        <Option key="delivery_state_10" value="-100">已取消</Option>
                      </Select>,
                    )
                    }
          </FormItem>
        </Col>
        <Col sm={8}>
          <FormItem label="业务模式" {...itemLayout} >
            {
                    getFieldDecorator('delivery_state', { initialValue: '' })(
                      <Select showSearch optionFilterProp="children" placeholder="请选择业务模式" >
                        <Option key="delivery_state_0" value="">全部</Option>
                        <Option key="delivery_state_1" value="5">已创建</Option>
                        <Option key="delivery_state_2" value="10">待分配</Option>
                        <Option key="delivery_state_3" value="15">已分配</Option>
                        <Option key="delivery_state_4" value="20">已接单</Option>
                        <Option key="delivery_state_5" value="22">已到店</Option>
                        <Option key="delivery_state_6" value="24">已取货</Option>
                        <Option key="delivery_state_8" value="-50">异常</Option>
                        <Option key="delivery_state_9" value="100">已送达</Option>
                        <Option key="delivery_state_10" value="-100">已取消</Option>
                      </Select>,
                    )
                    }
          </FormItem>
        </Col>
        <Col sm={8}>
          <FormItem label="订单状态" {...itemLayout} >
            {
                    getFieldDecorator('delivery_state', { initialValue: '' })(
                      <Select showSearch optionFilterProp="children" placeholder="请选择订单状态" >
                        <Option key="delivery_state_0" value="">全部</Option>
                        <Option key="delivery_state_1" value="5">已创建</Option>
                        <Option key="delivery_state_2" value="10">待分配</Option>
                        <Option key="delivery_state_3" value="15">已分配</Option>
                        <Option key="delivery_state_4" value="20">已接单</Option>
                        <Option key="delivery_state_5" value="22">已到店</Option>
                        <Option key="delivery_state_6" value="24">已取货</Option>
                        <Option key="delivery_state_8" value="-50">异常</Option>
                        <Option key="delivery_state_9" value="100">已送达</Option>
                        <Option key="delivery_state_10" value="-100">已取消</Option>
                      </Select>,
                    )
                    }
          </FormItem>
        </Col>
        <Col sm={8}>
          <FormItem label="商家类型" {...itemLayout} >
            <Select className="seller_type" showSearch optionFilterProp="children" placeholder="请选择商家类型" onChange={sellerTypeCB} onSelect={handleSelect}>
              <Option value="">全部</Option>
              <Option key="delivery_state_1" value="10">直营商家</Option>
              <Option key="delivery_state_2" value="20">加盟商家</Option>
            </Select>
          </FormItem>
        </Col>
        <Col sm={8}>
          <FormItem label="商家名称" {...itemLayout} >
            {
                    getFieldDecorator('org_order_id')(
                      <Input {...{ placeholder: '请输入商家名称' }} />,
                    )
                    }
          </FormItem>
        </Col>
        <Col sm={8}>
          <FormItem label="下单时间" style={{ marginTop: '10px' }} {...itemLayout}>
            {
                    getFieldDecorator('date_range', {/*
                        2017-03-29 modified by alihanniba
                        此处添加getValueFromEvent 在antd2.8.3会报错
                        getValueFromEvent: (date, dateString) => dateString
                    */})(
                      <RangePicker disabledDate={disabledDate} />,
                    )
                    }
          </FormItem>
        </Col>
        <Col sm={8}>
          <FormItem label="期望送达时间" {...itemLayout}>
            {
                    getFieldDecorator('courier_id')(
                      <Select showSearch optionFilterProp="children" placeholder="请选择期望送达时间" >
                        <Option value="">全部</Option>
                        {
                            couriers.map((item, index) => {
                              return <Option key={`courier${item.id}`} value={item.id}>{item.name}</Option>
                            })
                        }
                      </Select>,
                    )
                    }
          </FormItem>
        </Col>
        <Col sm={24}>
          <FormItem label="" {...itemLayout} >
            <Button type="primary" htmlType="submit" style={{ marginRight: 20, marginLeft: 20 }}>查询</Button>
            <Button style={{ marginRight: 20, marginLeft: 20 }}>自定义条件</Button>
          </FormItem>
        </Col>
      </Row>
      <p style={{ textAlign: 'right', position: 'relative', height: '0' }}>
        <span style={{ display: 'inline-block', position: 'absolute', top: '-20px', right: '20px' }} >
          <Popover content={content1} placement="leftBottom" title="订单详情字段提示">
            <Icon type="question-circle-o" />
          </Popover>
        </span>
      </p>
    </Form>
  );
});

module.exports = Search;
