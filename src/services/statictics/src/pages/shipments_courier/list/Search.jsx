import React, {Component, PropTypes} from 'react';
import { Form, Input, Button, Checkbox,DatePicker,Icon, Select,Popover,message } from 'antd';
import { Link } from 'dva/router';
import moment from 'moment';

const RangePicker = DatePicker.RangePicker;
const {stateTransform, utcToDate, numberDateToStr} =  window.tempAppTool;
const {dateFormat} = window.tempAppTool;
const [FormItem,Option] = [Form.Item,Select.Option];

const Search = Form.create()(({form, searchProps}) => {

  const { getFieldDecorator, getFieldsValue } = form;

  const {couriers=[], onSearch} = searchProps;
  let _time = null;
  function handleSubmit(e) {
    e.preventDefault();
    let _data = getFieldsValue();
    let date = '';
    let data_time = '';
    let date_date = '';
    if(!_data.time) {
      message.info('请选择日期');
      return ;
    };
    if(_data.time){
      date = utcToDate(_data.time);
      date_date = date.date.join('');
    }
    let params = {};
    params.start_date = date_date;
    params.end_date = date_date;
    if(_data.courier_ids === undefined){
      _data.courier_ids = [];
    }
    params.courier_ids = _data.courier_ids;
    onSearch(params)
  };

  function disabledDate(current) {
    return  current && current.valueOf().time >= Date.now() - 24*60*60*1000;
  };

  const content1 = (
    <div>
      <p> 1.超时取消订单：</p>
      <p>  1.1超时没有骑士接单系统关闭的订单</p>
      <p>  1.2骑士接单后当天没有处理完的订单</p>
      <p> 2.异常取消订单：</p>
      <p> 2.1骑士标记异常后被取消的订单</p>
    </div>
  );
  let _date = dateFormat(Date.now() - 24*60*60*1000);

  const children = [];

  couriers.map((item, index) => {
    return <Option key={'couriers' + item.id} value={item.id}>{item.name}</Option>
  })

  couriers.map((item,index) =>{
    children.push(<Option key={'couriers' + item.id} value={item.id}>{item.name}</Option>);
  })


  return (
    <Form layout="inline" onSubmit={handleSubmit}>
      <FormItem label="日期" style={{ marginBottom: '0' }}>
        {
          getFieldDecorator("time", {
            initialValue: moment(_date.join('-'), 'YYYY-MM-DD')
          })(
            <DatePicker  disabledDate={disabledDate}/>
          )
        }
      </FormItem>
      <FormItem label="骑士名称" style={{ marginBottom: '0' }}>
        {
          getFieldDecorator('courier_ids')(
            <Select showSearch
                    mode="multiple"
                    optionFilterProp="children"
                    {...{"style":{"width":300}}}
                    placeholder="请选择骑士"
            >
              {children}
            </Select>
          )
        }
      </FormItem>
      <FormItem style={{ marginBottom: '0' }}>
        <Button type="primary" htmlType="submit">查询</Button>
      </FormItem>
      <p style={{textAlign: 'right', position: 'relative', height: '0'}}>
        <span style={{ display:'inline-block',position: 'absolute', top: '-20px', right: '20px'}} >
          <Popover content={content1} placement="leftBottom" title="说明">
            <Icon type="question-circle-o" />
          </Popover>
        </span>
      </p>

    </Form>
  );
});

module.exports =  Search;
