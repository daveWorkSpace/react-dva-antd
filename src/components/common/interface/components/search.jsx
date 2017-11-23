import React, { Component, PropTypes } from 'react';
import { Form, Row, Col, Input, Button, Icon } from 'antd';

const FormItem = Form.Item;

class SearchComponent extends React.Component {

  constructor(props) {
    super();
    this.state = {
      expand: false,
      onSearch: props.onSearch,
      fields: props.fields,
    }
  }

  //搜索
  handleSearch = (e) => {
    const { onSearch } = this.state;

    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('Received values of form: ', values);
      if (!err) {
        onSearch(values);
      }
    });
  }

  //重置表单
  handleReset = () => {
    this.props.form.resetFields();
  }

  //展开，收起
  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  }

  //获取表单
  // To generate mock Form.Item
  getFields() {
    const count = this.state.expand ? 10 : 6;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    };
    const children = [];
    for (let i = 0; i < 10; i += 1) {
      children.push(
        <Col span={8} key={i} style={{ display: i < count ? 'block' : 'none' }}>
          <FormItem {...formItemLayout} label={`Field ${i}`}>
            {getFieldDecorator(`field-${i}`)(
              <Input placeholder="placeholder" />,
            )}
          </FormItem>
        </Col>,
      );
    }
    return children;
  }

  render() {
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={40}>{this.getFields()}</Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">搜索</Button>
            <Button onClick={this.handleReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
              更多选项 <Icon type={this.state.expand ? 'up' : 'down'} />
            </a>
          </Col>
        </Row>
      </Form>
    );
  }
}

const WrappedSearchComponent = Form.create()(SearchComponent);
module.exports.Search = WrappedSearchComponent;
