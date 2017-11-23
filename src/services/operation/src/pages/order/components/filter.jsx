import React, { Component, PropTypes } from 'react';
import { hashHistory, Link } from 'dva/router';
import { Form, Button, Select } from 'antd';
import style from './style.less';
import { OrderParams } from './../../exports';
import aoaoAppSystemFlag from './../../../../../../utils/systemConfig';

const moment = require('moment');

const { rgReg, requestPagerSize, requestPageNumber } = OrderParams;

//初始化变量   {/*onChange={onChangeCity}defaultValue={cityCode}*/} {/*{...state}*/}
const [FormItem, Option] = [Form.Item, Select.Option];

class FilterComponent extends Component {

  constructor(props) {
    super();

    this.state = {
      cityCode: props.cityCode,        //当前城市code
      cityList: props.cityList,        //当前城市列表
      cityName: props.cityName,        //当前城市name
      date: props.date,
    };
    this.private = {
      onChangeCity: props.onChangeCity,      //选择城市的事件回调
      onChangeDate: props.onChangeDate,      //选择日期的时间回调
      onHandleSearch: props.onHandleSearch,  //处理搜索回调
    };
    //点击异常单按钮触发事件
    this.handleClickToGo = this.handleClickToGo.bind(this);
  }

  componentWillReceiveProps = (nextProps) => {
    //初始化新数据
    this.setState({
      cityCode: nextProps.cityCode,        //当前城市code
      cityList: nextProps.cityList,        //当前城市列表
      cityName: nextProps.cityName,        //当前城市name
      date: nextProps.date,                //当前日期
    });
  };

  //选择城市
  onChangeCity = (cityCode) => {
    const { cityList } = this.state;
    let cityName = '北京市';
    cityList.forEach((value, key) => {
      if (value.city_code === cityCode) {
        cityName = value.city_name;
      }
    });
    this.private.onChangeCity(cityCode, cityName);
  };

  //选择日期
  onChangeDate = (date) => {
    this.private.onChangeDate(date);
  };

  //搜索
  onHandleSearch = () => {
    this.private.onHandleSearch();
  };

  //城市
  renderCityComponent = () => {
    const { onChangeCity } = this;
    const { cityName } = this.props;
    let { cityCode, cityList } = this.state;

    //判断城市列表，设置默认
    if (cityList.length === 0) {
      cityList = [{
        city_code: '',
        //city_name: '北京市',
      }];
      cityCode = '';
    }

    //修正默认城市加载后，默认值刷新不掉的问题
    let state = {};
    if (cityCode !== '') {
      state = { value: cityName };
    }

    return (
      <Select
        showSearch
        style={{ width: 150 }}
        placeholder="请选择城市"
        optionFilterProp="children"
        onChange={onChangeCity}

        {...state}
      >
        {
          //渲染选项
          cityList.map((item, index) => {
            return (<Option key={index} value={item.city_code} title={item.city_name}>{item.city_name}</Option>);
          })
        }
      </Select>
    )
  };

  //日期
  renderDateComponent = () => {
    //昨天
    const yesterday = moment().subtract(1, 'days').format().replace(rgReg, '').substring(0, 8);
    //今天
    const today = moment().format().replace(rgReg, '').substring(0, 8);
    //明天
    const tomorrow = moment().add(1, 'days').format().replace(rgReg, '').substring(0, 8);
    const dateSource = [
      { title: '昨天', date: yesterday },
      { title: '今天', date: today },
      { title: '明天', date: tomorrow },
    ];
    const { onChangeDate } = this;
    return (
      <Select
        showSearch
        style={{ width: 150 }}
        placeholder="请选择日期"
        optionFilterProp="children"
        onChange={onChangeDate}
        defaultValue={'今天'}
      >
        {
          //渲染选项
          dateSource.map((item, index) => {
            return (<Option key={index} value={item.date} title={item.title}>{item.title}</Option>);
          })
        }
      </Select>
    )
  };

  //点击异常单按钮触发事件
  handleClickToGo() {
    window.sessionStorage && sessionStorage.setItem('simulateHeaderMenuState', true)
  }

  //选择器
  render() {
    const { renderCityComponent, renderDateComponent, onHandleSearch } = this;
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        {
          aoaoAppSystemFlag.HAS_MORE_CITY === false ?
            <FormItem label="当前城市" style={{ marginBottom: '0px' }}>
              <div style={{ marginRight: 10 }}>{this.state.cityName}</div>
            </FormItem> :
            <FormItem label="城市" style={{ marginBottom: '0px' }}>
              {/*城市列表   defaultValue={cityCode}  */}
              {renderCityComponent()}
            </FormItem>
        }
        <FormItem label="日期" style={{ marginBottom: '0px' }}>
          {/*日期选择器 */}
          {renderDateComponent()}
        </FormItem>
        <FormItem style={{ marginBottom: '0px' }}>
          <Button type="ghost" onClick={onHandleSearch}>查询</Button>
        </FormItem>
        <FormItem style={{ marginBottom: '0px' }}>
          <Link to="/operation/order/close" onClick={this.handleClickToGo()} className={style.exception}>异常单查看</Link>
        </FormItem>
      </Form>
    );
  }
}

module.exports = Form.create()(FilterComponent);
