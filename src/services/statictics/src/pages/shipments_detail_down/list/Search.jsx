import React, { Component, PropTypes } from 'react';
import { Form, Input, Button, Checkbox, Icon, Select, DatePicker, Popover } from 'antd';
import { Link } from 'dva/router';
import moment from 'moment';

const { dateFormat } = window.tempAppTool;
const { stateTransform, utcToDate, numberDateToStr } = window.tempAppTool;

const [FormItem, Option, RangePicker] = [Form.Item, Select.Option, DatePicker.RangePicker];

const Search = Form.create()((props) => {
  const { getFieldDecorator, getFieldsValue } = props.form;
  const { onSearch, areas, sellers, couriers } = props;

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
    onSearch(params)
  }

  const content2 = (
    <div>
      <p> 1.订单按预计送达时间导出 </p>
      <p> 2.每日上午可以下载昨日的订单明细 </p>
    </div>
  );

  function disabledDate(current) {
    return current && current.valueOf().time >= Date.now() - 24 * 60 * 60 * 1000;
  }
  const _date = dateFormat(Date.now() - 24 * 60 * 60 * 1000);
  return (
    <Form layout="inline" onSubmit={handleSubmit}>
      <FormItem label="日期" style={{ marginBottom: '0px' }}>
        {
          getFieldDecorator('time', { initialValue: moment(_date.join('-'), 'YYYY-MM-DD') })(
            <DatePicker disabledDate={disabledDate} />,
          )
        }
        <Button type="primary" htmlType="submit" style={{ marginRight: 20, marginLeft: 20 }}>查询</Button>
      </FormItem>
      <FormItem style={{ marginBottom: '0px', float: 'right' }}>
        <Popover content={content2} placement="left" title="说明">
          <Icon type="question-circle-o" />
        </Popover>
      </FormItem>
    </Form>
  );
});

module.exports = Search;
