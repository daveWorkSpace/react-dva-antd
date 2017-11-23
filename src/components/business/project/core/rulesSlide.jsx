// 分单规则左侧区域部分
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { hashHistory, Link } from 'dva/router';
import { Col, Icon, Select, Table } from 'antd';
import style from './style.less';

const Option = Select.Option;

class RulesSlide extends Component {
  constructor(props) {
    super(props);

    this.private = {
    }
  }

  render() {
    const { areaSearch, onSelect, areaList, freezeAreaList, cityName, sellerName, columns, onRowClick } = this.props;
    return (
      <Col sm={5}>
        <div className="bd-content">
          <Col sm={4}>
            <Icon type="solution" style={{ fontSize: 25 }} />
          </Col>
          <Col sm={19}>
            <span style={{ fontSize: 16 }}>{ sellerName }</span>
          </Col>
        </div>
        <div className="bd-content">
          <Select
            showSearch
            allowClear
            style={{ width: '90%', marginBottom: 16 }}
            placeholder="请输入搜索内容"
            optionFilterProp="children"
            notFoundContent="暂无数据"
            defaultValue={'0'}
            onChange={areaSearch}
            onSelect={onSelect}
          >
            <Option value={'0'}>全部</Option>
            {
              freezeAreaList.map((item, index) => {
                return (
                  <Option value={item.id} key={`search${item.id}${index}`}>{ item.name }</Option>
                )
              })
            }
          </Select>
          <Table
            rowKey={(record, index) => { return index }}
            columns={columns}
            dataSource={areaList}
            onRowClick={onRowClick}
            pagination={false}
            scroll={{ x: 0, y: 600 }}
          />
        </div>
      </Col>
    );
  }
}

export default RulesSlide;
