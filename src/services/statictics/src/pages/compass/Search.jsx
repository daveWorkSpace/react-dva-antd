import React, {Component, PropTypes} from 'react';
import { Form, Input, Button, Checkbox, Icon, Row,Col,  Select, DatePicker } from 'antd';
import { Link } from 'dva/router';

const [FormItem,Option, RangePicker] = [Form.Item,Select.Option , DatePicker.RangePicker];
const {dateFormat} = window.tempAppTool;
const Search = Form.create()((props) => {
  const { getFieldDecorator, validateFields, getFieldsValue } = props.form;
  const {onSearch,areas} = props;
  function handleSubmit(e) {
    e.preventDefault();
    onSearch(getFieldsValue())
  }

  function handleAreaChange(value){
    onSearch();
  }

  const _date = dateFormat();
  return (
    <Form inline onSubmit={handleSubmit}>
      <FormItem>
        <span>{_date.join('-')}</span>
      </FormItem>
      <FormItem>
        { getFieldDecorator('area_id', {})(
          <Select style={{ width: 150 }}>
            <Option value="">全部</Option>
            {
              areas.map((item, index) => {
                return <Option key={item.id} value={item.id}>{item.name}</Option>
              })
            }
          </Select>
        )}
      </FormItem>
      <Button type="primary">查询</Button>
    </Form>
  );
});

module.exports =  Search;
