import React, { Component, PropTypes } from 'react';
import { Form, Row, Col, Input, Button, Icon, Table, Select, Pagination, Popconfirm } from 'antd';
import { connect } from 'dva';

//初始化变量
const [FormItem, Option] = [Form.Item, Select.Option];

class CityComponent extends Component {

  constructor(props) {
    super(props);
    const { cityCode, cityList, onChangeCity } = props
    this.state = {
      cityCode,        //当前城市code
      cityList,        //当前城市列表
    };
    this.private = {
      onChangeCity, //选择城市的事件回调
    };

    console.log('初始化城市模块，服务商注册城市', this.state.cityCode);
  }

  // componentWillMount() {
  //   this.setState({
  //     cityCode: this.props.cityCode,        //当前城市code
  //     cityList: this.props.cityList,        //当前城市列表
  //   })
  // }

  componentWillReceiveProps = (nextProps) => {
    //初始化新数据
    this.setState({
      cityCode: nextProps.cityCode,        //当前城市code
      cityList: nextProps.cityList,        //当前城市列表
    });
  };

  onChangeCity = (cityCode) => {
    const { cityList } = this.state;
    let cityName = '';
    cityList.forEach((value, key) => {
      if (value.city_code === cityCode) {
        cityName = value.city_name;
      }
    });

    this.private.onChangeCity(cityCode, cityName);
  };

  render() {
    const { onChangeCity } = this;
    const { cityCode, cityList } = this.state;

    //判断城市列表，设置默认
    if (cityList.length === 0) {
      //设置state永远只能用setState这一种方法去改变
      this.setState({
        cityList: [{
          city_code: '',
          city_name: '城市数据加载中',
        }],
        cityCode: '',
      })
      // cityList = [{
      //   city_code: '',
      //   city_name: '城市数据加载中',
      // }];
      // cityCode = '';
    }

    //修正默认城市加载后，默认值刷新不掉的问题
    let state = {};
    if (cityCode !== '') {
      state = { value: cityCode };
    }

    return (
      <FormItem label="城市" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} style={{ margin: 0 }}>
        <Select
          showSearch
          style={{ width: 150 }}
          placeholder="请选择城市"
          optionFilterProp="children"
          onChange={onChangeCity}
          defaultValue={cityCode}
          {...state}
        >
          {
            //渲染选项
            cityList.map((item, index) => {
              return (<Option key={index} value={item.city_code} title={item.city_name}>{item.city_name}</Option>);
            })
          }
        </Select>
      </FormItem>
    );
  }
}

module.exports = Form.create()(CityComponent);
