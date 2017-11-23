/**
 * Created by dave
 * 团队管理城市选择模块
 */
import dot from 'dot-prop'
import React, { Component, PropTypes } from 'react';
import { Form, Row, Col, Input, Button, Checkbox, Icon, Select } from 'antd';
import aoaoAppSystemFlag from './../../../../../../utils/systemConfig';
import { authorize } from './../../../../../../application';

const Option = Select.Option;

/*城市列表组件*/
export default class TeamCity extends React.Component {
  render() {
    const city_name = dot.get(authorize.vendor, 'city.name');
    const { serviceCityList } = this.props;
    return (
      <div>
        {
          aoaoAppSystemFlag.HAS_MORE_CITY === false ?
            <div style={{ textAlign: 'center' }}>当前城市: {city_name}</div> :
            <div>
              <span>城市&nbsp;&nbsp;</span>
              <Select
                showSearch
                style={{ width: '80%' }}
                placeholder="请选择"
                defaultValue={cityName}
                optionFilterProp="children"
                onSelect={this.props.cityChange}
              >
                {
                  serviceCityList.map((item, index) => {
                    return (
                      <Option key={item.city_code} value={item.city_code}>{item.city_name}</Option>
                    )
                  })
                }
              </Select>
            </div>

        }
      </div>
    )
  }
}
