import React, { Component, PropTypes } from 'react';
import { Form, Input, Button, Checkbox, Icon, Select, Row, Col } from 'antd';
import { Link } from 'dva/router';

const [FormItem, Option] = [Form.Item, Select.Option];
const Search = Form.create()(({ form, searchs, onSearch, onShowItem }) => {
  const { getFieldDecorator, getFieldsValue } = form;

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(getFieldsValue());
  }
  // 布局配置参数
  const itemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };

  return (
    <div className="reset-bg-white">
      <Form layout="horizontal" onSubmit={handleSubmit}>
        <Row gutter={24} type="flex" align="middle">
          <Col sm={8}>
            <FormItem label="姓名" {...itemLayout}>
              {
                getFieldDecorator('name')(
                  <Input {...{ placeholder: '请输入员工姓名' }} />,
                )
              }
            </FormItem>
          </Col>
          <Col sm={8}>
            <FormItem label="手机号" {...itemLayout}>
              {
                getFieldDecorator('mobile')(
                  <Input {...{ placeholder: '请输入员工手机' }} />,
                )
              }
            </FormItem>
          </Col>
          <Col sm={8}>
            <FormItem label="工号" {...itemLayout}>
              {
                getFieldDecorator('code')(
                  <Input {...{ placeholder: '请输入员工工号' }} />,
                )
              }
            </FormItem>
          </Col>
          <Col sm={8}>
            <FormItem label="员工状态" {...itemLayout}>
              {
                getFieldDecorator('state', { initialValue: '100' })(
                  <Select
                    showSearch optionFilterProp="children" {...{
                      placeholder: '请输入员工状态',
                    }}
                  >
                    <Option value="">全部</Option>
                    <Option value="100">在职</Option>
                    <Option value="-100">离职</Option>
                  </Select>,
                )
              }
            </FormItem>
          </Col>
          <Col sm={8}>
            <FormItem label="员工类型" {...itemLayout}>
              {
                getFieldDecorator('work_type', { initialValue: '' })(
                  <Select size="large" placeholder="全部" >
                    <Option value="">全部</Option>
                    <Option value="10">全职</Option>
                    <Option value="20">兼职</Option>
                  </Select>,
                )
              }
            </FormItem>
          </Col>
          <Col sm={8} style={{ textAlign: 'left', height: '36px' }}>
            <FormItem >
              <Button
                htmlType="submit" style={{
                  marginRight: 20,
                  marginLeft: 20,
                  backgroundColor: '#00CFA1',
                  borderColor: '#00CFA1',
                  color: '#fff' }}
              >                查询
              </Button>
              <Button ><Link to="/team/employee/list/add">添加</Link></Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
  );
});
module.exports = Search;
