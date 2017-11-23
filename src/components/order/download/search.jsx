import React, { Component, PropTypes } from 'react';
import { Form, Input, Button, Checkbox, Icon, Select, DatePicker, Popover } from 'antd';
import { Link } from 'dva/router';

import moment from 'moment';
// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { MonthPicker, RangePicker } = DatePicker;
const [FormItem, Option] = [Form.Item, Select.Option];

//引入枚举值
import { DOWNLOAD_DAILY_DETAIL, DOWNLOAD_MONTHLY_DETAIL } from '../core/enumerate.js';

const { dateFormat } = window.tempAppTool;
const { stateTransform, utcToDate, numberDateToStr } = window.tempAppTool;

import style from './style.less';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startValue: null,
      endValue: null,
      endOpen: false,
    };
    this.private = {
      content2: (
        <div>
          <p> 1.订单按预计送达时间导出 </p>
          <p> 2.每日上午可以下载昨日的订单明细 </p>
        </div>
      ),
      dateFormats: 'YYYY-MM-DD',
    };
    // 搜索函数
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.onSearch(values.date)
      }
    });

    // const { getFieldsValue } = this.props.form;
    // const { onSearch, areas, sellers, couriers, type } = this.props;
    // e.preventDefault();
    // const _data = getFieldsValue();
    // let date = '';
    // const data_time = '';
    // let date_date = '';
    // if (!_data.time) {
    //     message.info('请选择日期');
    //     return;
    // }
    // if (_data.time) {
    //     date = utcToDate(_data.time);
    //     date_date = date.date.join('');
    // }
    // const params = {};
    // params.start_date = date_date;
    // params.end_date = date_date;
    // onSearch(params)
  }

  disabledDate(current) {
    return current && current.valueOf() >= Date.now() - 24 * 60 * 60;
  }

  disabledMonth(current) {
    return current && current.valueOf() >= Date.now();
  }

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  };

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open });
  };

  renderDatePicker() {
    const { getFieldDecorator } = this.props.form;
    const { type } = this.props;
    const { startValue, endValue, endOpen } = this.state;
    const { dateFormats } = this.private;
    const _date = dateFormat(Date.now() - 24 * 60 * 60 * 1000).join('-');
    if (type === DOWNLOAD_DAILY_DETAIL) {
      return getFieldDecorator('date', {
        initialValue: [moment(_date, dateFormats), moment(_date, dateFormats)],
        validate: [
          {
            rules: [{ type: 'array', required: true, message: '' }],
            trigger: 'onBlur',
          },
        ],
      })(<RangePicker disabledDate={this.disabledDate} />);
    }
    console.log(type);
    if (type === DOWNLOAD_MONTHLY_DETAIL) {
      return (
        <div className={style.downloadMonth}>
          <MonthPicker
            placeholder="Start"
            onChange={this.onStartChange}
            disabledDate={this.disabledMonth}
            onOpenChange={this.handleStartOpenChange}
          />
          <MonthPicker
            placeholder="End"
            onChange={this.onEndChange}
            disabledDate={this.disabledMonth}
            open={endOpen}
            onOpenChange={this.handleEndOpenChange}
          />
        </div>
      );
    }
  }

  render() {
    const { onSearch, areas, sellers, couriers, type } = this.props;
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <FormItem label="日期" style={{ marginBottom: '0px' }}>
          {this.renderDatePicker()}
          <Button type="primary" htmlType="submit" style={{ marginRight: 20, marginLeft: 20 }}>
            查询
          </Button>
        </FormItem>
        <FormItem style={{ marginBottom: '0px', float: 'right' }}>
          <Popover content={this.private.content2} placement="left" title="说明">
            <Icon type="question-circle-o" />
          </Popover>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(Search);
