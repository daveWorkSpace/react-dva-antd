import React, { Component, PropTypes } from 'react';
import { Form, Input, Button, Checkbox, DatePicker, Icon, Select, Popover, message } from 'antd';
import { Link } from 'dva/router';
import moment from 'moment';

const RangePicker = DatePicker.RangePicker;
const { stateTransform, utcToDate, numberDateToStr } = window.tempAppTool;
const { dateFormat } = window.tempAppTool;
const [FormItem, Option] = [Form.Item, Select.Option];

const Search = Form.create()(({ form, searchProps }) => {
// 从form里面获取信息
  const { getFieldDecorator, getFieldsValue } = form;
  const { sellers = [], dayOnSearch } = searchProps;
  const _time = null;
  //提交函数
  function handleSubmit(e) {
    e.preventDefault();
    const _data = getFieldsValue();
    // 获取日期
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
    // 参数获取
    const params = {};
    params.start_date = date_date;
    params.end_date = date_date;
    if (_data.seller_ids === undefined) {
      _data.seller_ids = [];
    }
    params.seller_ids = _data.seller_ids;
    dayOnSearch(params)
  }
// 设置不可用的日期
  function disabledDate(current) {
    return current.valueOf().time >= Date.now() - 24 * 60 * 60 * 1000;
  }
// 提示信息
  const content1 = (
    <div>
      <p> 1.当月账单数据统计截止到昨日 </p>
      <p> 2.成交订单量：为所有产生交易费用的订单之和</p>
      <p> 3.结算总额=为账户余额结算金额+现金结算金额</p>
      <p> 4.结算总额＝配送费＋手续费＋小费</p>
    </div>
  );
  // 获取昨日日期
  const _date = dateFormat(Date.now() - 24 * 60 * 60 * 1000);
// ant-design组件 展示商家列表
  const children = [];
  sellers.map((item, index) => {
    children.push(<Option key={item.seller_id} value={item.seller_id} >{item.seller ? item.seller.name : '' }</Option>);
  })


  return (
    <Form layout="inline" onSubmit={handleSubmit}>

      <FormItem label="日期" >
        {
        getFieldDecorator('time', { initialValue: moment(_date.join('-'), 'YYYY-MM-DD') })(
          <DatePicker disabledDate={disabledDate} />,
        )
      }
      </FormItem>
      <FormItem label="商家名称">
        {
          getFieldDecorator('seller_ids')(
            <Select
              mode="multiple"
              showSearch
              optionFilterProp="children"
              placeholder="请选择商户"
              tokenSeparators={[',']}
              {...{ style: { width: 300 } }}
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
