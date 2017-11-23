import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { hashHistory, Link } from 'dva/router';
import { Form, Button, Select, DatePicker } from 'antd';
import CityFilter from './cityFilter';
import { OrderParams } from './../../exports';
import aoaoAppSystemFlag from './../../../../../../utils/systemConfig';

const RangePicker = DatePicker.RangePicker;

const { rgReg, requestPagerSize, requestPageNumber } = OrderParams;

//初始化变量
const [FormItem, Option] = [Form.Item, Select.Option];

class FilterComponent extends Component {

  constructor(props) {
    super();

    this.state = {
      cityCode: props.cityCode,        //当前城市code
      cityList: props.cityList,        //当前城市列表
      cityName: props.cityName,        //当前城市name
      startDate: props.startDate,      //日期范围
      endDate: props.endDate,      //日期范围
    };

    this.private = {
      onChangeDate: props.onChangeDate,       //处理日期回调
      onHandleSearch: props.onHandleSearch,   //处理搜索回调
    };
  }

  componentWillReceiveProps = (nextProps) => {
    //初始化新数据
    this.setState({
      cityCode: nextProps.cityCode,             //当前城市code
      cityList: nextProps.cityList,             //当前城市列表
      cityName: nextProps.cityName,             //当前城市name
      closeOrderList: nextProps.closeOrderList, //异常订单列表
      startDate: nextProps.startDate,           //日期范围
      endDate: nextProps.endDate,           //日期范围
    });
  };

  //选择城市
  onChangeCity = (cityCode, cityName) => {
    this.setState({ cityCode, cityName });
    //回调函数，将值传递给父级
    this.props.onChangeCity(cityCode, cityName);
  };

  //选择日期
  onChangeDate = (value, dateString) => {
    let startDate;
    let endDate;
    if (dateString) {
      startDate = dateString[0].replace(rgReg, '');
      endDate = dateString[1].replace(rgReg, '');
    }
    this.private.onChangeDate(startDate, endDate);
  };

  //搜索
  onHandleSearch = () => {
    this.private.onHandleSearch();
  };

  //城市
  renderCityComponent = () => {
    const { cityCode, cityList, cityName } = this.state;
    const { onChangeCity } = this;
    const props = {
      cityCode,       //当前城市code
      cityName,       //当前城市name
      cityList,       //当前城市列表
      onChangeCity,   //选择城市的事件回调
    };
    return (
      <div>
        <CityFilter {...props} />
      </div>
    )
  };

  //日期
  renderDateComponent = () => {
    const { onChangeDate } = this;
    const today = moment().format().replace(rgReg, '').substring(0, 8);
    return (
      // <RangePicker defaultValue={[new Date(), new Date()]} style={{ width: 184 }} onChange={onChangeDate} />
      <RangePicker defaultValue={[moment(), moment()]} style={{ width: 184 }} onChange={onChangeDate} />
    )
  };

  //选择器
  render() {
    const { renderCityComponent, renderDateComponent, onHandleSearch } = this;
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        {
          aoaoAppSystemFlag.HAS_MORE_CITY === false ?
            <FormItem label="当前城市">
              <div style={{ marginRight: 10 }}>{this.state.cityName}</div>
            </FormItem> :
            <FormItem label="城市">
              {/*城市列表   defaultValue={cityCode}  */}
              {renderCityComponent()}
            </FormItem>
        }
        <FormItem label="日期">
          {/*日期选择器 onClick={onHandleSearch} */}
          {renderDateComponent()}
        </FormItem>
        <FormItem>
          <Button type="ghost" onClick={onHandleSearch}>查询</Button>
        </FormItem>
      </Form>
    );
  }
}

module.exports = Form.create()(FilterComponent);
