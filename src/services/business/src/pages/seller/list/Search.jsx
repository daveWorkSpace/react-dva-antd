import React, { Component, PropTypes } from 'react';
import { Form, Row, Col, Input, Button, Checkbox, Icon, Select } from 'antd';
import { Link } from 'dva/router';
import aoaoAppSystemFlag from './../../../../../../utils/systemConfig';

const [FormItem, Option] = [Form.Item, Select.Option];

const Search = Form.create()(({ form, searchs, onSearch, onShowItem, serviceCityList }) => {
  // 从form里面获取信息
  const { getFieldDecorator, getFieldsValue } = form;
// 查询函数
  function handleSubmit(e) {
    e.preventDefault();
    const params = getFieldsValue();
    if (params.seller_name === undefined) {
      params.seller_name = ''
    }
    if (params.state === undefined) {
      params.state = ''
    }
    onSearch(getFieldsValue())
  }
  // 布局配置参数
  const itemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 12 } };

  return (
    <Form layout="horizontal" className="ant-advanced-search-form" onSubmit={handleSubmit}>
      <Row gutter={24}>
        {
          aoaoAppSystemFlag.HAS_MORE_CITY === true ?
            <Col sm={8}>
              <FormItem label="城市:" {...itemLayout}>
                {
                  getFieldDecorator('city_code')(
                    <Select showSearch optionFilterProp="children" {...{ placeholder: '请选择城市' }}>
                      <Option value="">全部</Option>
                      {
                        serviceCityList.map((item, index) => {
                          return (
                            <Option key={index} value={item.city_code}>{ item.city_name }</Option>
                          )
                        })
                      }
                    </Select>,
                  )
                }
              </FormItem>
            </Col>
          : ''
        }
        <Col sm={8}>
          <FormItem label="商户号:" {...itemLayout}>
            {
              getFieldDecorator('code')(
                <Input {...{ placeholder: '请输入商户号' }} />,
              )
            }
          </FormItem>
        </Col>
        <Col sm={8}>
          <FormItem label="商户状态:" {...itemLayout}>
            {
              getFieldDecorator('state', { initialValue: '100' })(
                <Select showSearch optionFilterProp="children" {...{ placeholder: '商户状态' }}>
                  <Option value="">全部</Option>
                  <Option value="100">正常</Option>
                  <Option value="-100">冻结</Option>
                </Select>,
              )
            }
          </FormItem>
        </Col>
        <Col sm={8}>
          {/*<FormItem label="签约状态"  {...itemLayout}>
            <Select showSearch  optionFilterProp="children" {...getFieldProps("sign_state")} {...{"placeholder":"请选择签约状态"}}>
              <Option value="100">签约</Option>
              <Option value="-100">未签约</Option>
            </Select>
          </FormItem>*/}
          <FormItem label="审核状态:" {...itemLayout}>
            {
              getFieldDecorator('verify_state')(
                <Select showSearch optionFilterProp="children" {...{ placeholder: '审核状态' }}>
                  <Option value="">全部</Option>
                  <Option value="0">待提交</Option>
                  <Option value="1">待审核</Option>
                  <Option value="100">通过</Option>
                  <Option value="-100">驳回</Option>
                </Select>,
              )
            }
          </FormItem>
        </Col>
        <Col sm={8}>
          <FormItem label="商户名称:" {...itemLayout}>
            {
              getFieldDecorator('name')(
                <Input {...{ placeholder: '请输入商户名称' }} />,
              )
            }
          </FormItem>
        </Col>
        <Col sm={8}>
          <FormItem label="" {...itemLayout} >
            <Button htmlType="submit" style={{ marginRight: 20, marginLeft: 20, backgroundColor: '#00CFA1', borderColor: '#00CFA1', color: '#fff' }}>查询</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
  );
});

module.exports = Search;
