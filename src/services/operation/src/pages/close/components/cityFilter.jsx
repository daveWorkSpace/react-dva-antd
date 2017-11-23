import React, { Component, PropTypes } from 'react';
import { Form, Input, Button, Icon, Table, Select, Pagination, Popconfirm } from 'antd';
import aoaoAppSystemFlag from './../../../../../../utils/systemConfig';

//初始化变量
const [FormItem, Option] = [Form.Item, Select.Option];

class CityComponent extends Component {

  constructor(props) {
    super();
    this.state = {
      cityCode: props.cityCode,        //当前城市code
      cityList: props.cityList,        //当前城市列表
    };
    this.private = {
      onChangeCity: props.onChangeCity, //选择城市的事件回调
    };
  }

  /*componentWillReceiveProps = (nextProps) => {
   //初始化新数据
   this.setState({
   cityCode: nextProps.cityCode,        //当前城市code
   cityList: nextProps.cityList,        //当前城市列表
   });
   };*/

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

  //城市
  renderCityComponent = () => {
    const { onChangeCity } = this;
    const { cityName } = this.props;
    let { cityCode, cityList } = this.state;

    //判断城市列表，设置默认
    if (cityList && cityList.length === 0) {
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

  render() {
    const { renderCityComponent } = this;
    return (
      <div>
        {
          aoaoAppSystemFlag.HAS_MORE_CITY === false ?
            <span style={{ marginRight: 10 }}>{this.props.cityName}</span> :
            renderCityComponent()
        }
      </div>
    );
  }
}

module.exports = Form.create()(CityComponent);
