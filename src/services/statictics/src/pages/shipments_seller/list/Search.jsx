import React, { Component, PropTypes } from 'react';
import { Form, Input, Button, Checkbox, DatePicker, Icon, Select, Popover, message } from 'antd';
import { Link } from 'dva/router';
import moment from 'moment';

const RangePicker = DatePicker.RangePicker;
const { stateTransform, utcToDate, numberDateToStr } = window.tempAppTool;
const { dateFormat } = window.tempAppTool;
const [FormItem, Option] = [Form.Item, Select.Option];

const Search = Form.create()(({ form, searchProps }) => {
  const { getFieldDecorator, getFieldsValue } = form;

  const { sellers = [], onSearch } = searchProps;
  const _time = null;
  function handleSubmit(e) {
    e.preventDefault();
    const _data = getFieldsValue();
    let date = '';
    const data_time = '';
    let date_date = '';
    if (!_data.time) {
      message.info('请选择日期');
      return;
    }
    if (_data.time) {
      date = utcToDate(_data.time);
      date_date = date.date.join('');
    }
    const params = {};
    params.start_date = date_date;
    params.end_date = date_date;
    if (_data.seller_ids === undefined) {
      _data.seller_ids = [];
    }
    params.seller_ids = _data.seller_ids;
    console.log('search_page', params)
    onSearch(params)
  }

  function disabledDate(current) {
    return current && current.valueOf().time >= Date.now() - 24 * 60 * 60 * 1000;
  }

  const content1 = (
    <div>
      <p> 1.超时取消订单：</p>
      <p>  1.1超时没有骑士接单系统关闭的订单</p>
      <p>  1.2骑士接单后当天没有处理完的订单</p>
      <p> 2.异常取消订单：</p>
      <p> 2.1骑士标记异常后被取消的订单</p>
    </div>
  );
  const _date = dateFormat(Date.now() - 24 * 60 * 60 * 1000);

  const children = [];
  sellers.map((item, index) => {
    children.push(<Option key={item.seller_id} value={item.seller_id} >{item.seller ? item.seller.name : '' }</Option>);
  })


  return (
    <Form layout="inline" onSubmit={handleSubmit}>
      <FormItem label="日期" >
        {
          getFieldDecorator('time', {
            initialValue: moment(_date.join('-'), 'YYYY-MM-DD'),
          })(
            <DatePicker disabledDate={disabledDate} />,
          )
        }
      </FormItem>

      <FormItem label="商家名称" >
        {
          getFieldDecorator('seller_ids')(
            <Select
              mode="multiple"
              showSearch optionFilterProp="children"
              {...{ style: { width: 300 } }}
              placeholder="请选择商户"
            >
              {children}
            </Select>,
          )
        }
      </FormItem>
      <FormItem >
        <Button type="primary" htmlType="submit">查询</Button>
      </FormItem>
      <p style={{ textAlign: 'right', position: 'relative', height: '0' }}>
        <span style={{ display: 'inline-block', position: 'absolute', top: '-20px', right: '20px' }} >
          <Popover content={content1} placement="leftBottom" title="说明">
            <Icon type="question-circle-o" />
          </Popover>
        </span>
      </p>

    </Form>
  );
});

module.exports = Search;
