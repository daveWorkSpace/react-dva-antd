import is from 'is_js';
import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Table, Row, Col } from 'antd';

class PriceDetailComponent extends React.Component {
  constructor(props) {
    super();
    const { params } = props;
    this.state = this.getState(params);
  }

  componentWillReceiveProps = (nextProps) => {
    const { params } = nextProps;
    this.setState(this.getState(params));
  }

  //获取状态
  getState = (params) => {
    //距离
    const distance = Object.values(this.getDistance(params.pricePlan));
    //时间
    const time = Object.values(this.getTimes(params.pricePlan));
    //价格列表
    const prices = this.getPrice(params.pricePlan);

    return {
      distance,
      time,
      prices,
      data: this.getData(time, distance, prices),
    };
  }

  //获取时间
  getTimes = (pricePlan) => {
    //判断数据是否为空
    if (is.not.existy(pricePlan) || is.empty(pricePlan)) {
      return [];
    }

    const data = [];
    pricePlan.forEach((item, index) => {
      //用开始时间和结束时间当作uniqueKey
      const key = `${item.time.start}-${item.time.finish}`;
      //判断，如果时间分段不存在，则创建
      if (!data[key]) {
        data[key] = item.time;
      }
    });
    return data;
  }

  //获取距离
  getDistance = (pricePlan) => {
    //判断数据是否为空
    if (is.not.existy(pricePlan) || is.empty(pricePlan)) {
      return [];
    }

    const data = [];
    pricePlan.forEach((item, index) => {
      //用开始时间和结束时间当作uniqueKey
      const key = `${item.distanceMin}-${item.distanceMax}`;
      //判断，如果时间分段不存在，则创建
      if (!data[key]) {
        data[key] = item;
      }
    });
    return data;
  }

  //获取价格
  getPrice = (pricePlan) => {
    //判断数据是否为空
    if (is.not.existy(pricePlan) || is.empty(pricePlan)) {
      return [];
    }

    const t = this.getTimes(pricePlan);
    const d = this.getDistance(pricePlan);
    const data = [];
    pricePlan.forEach((item, index) => {
      //用开始时间和结束时间当作uniqueKey
      const rowKey = `${item.time.start}-${item.time.finish}`;
      const colKey = `${item.distanceMin}-${item.distanceMax}`;
      const row = this.indexOfObject(rowKey, t);
      const col = this.indexOfObject(colKey, d);

      //判断，如果时间分段不存在，则创建
      if (!data[row]) {
        data[row] = [];
      }
      if (!data[row][col]) {
        data[row][col] = item;
      }
    });
    return data;
  }

  //获取最后展示的数据
  getData = (time, distance, prices) => {
    const data = []
    for (let i = 0; i < time.length; i += 1) {
      const item = {};
      item.time = time[i];
      item.distance = distance;
      item.price = prices;
      item.key = `tableKey${i}`;
      data.push(item);
    }
    return data;
  }

  //获取表格列
  getColumns = (distance) => {
    const { getDistancePriceColumnForm } = this;
    const columns = [
      //获取第一列，时间分段
      {
        title: '时间分段',
        dataIndex: 'time',
        key: 'time',
        fixed: 'left',
        width: 190,
        render: (text, record, index) => {
          return (
            <span> {text.start} ～ {text.finish} </span>
          )
        },
      },
      //获取第二列，距离分段
      {
        title: '距离分段',
        dataIndex: 'distance',
        key: 'distanceKey',
        children: getDistancePriceColumnForm(distance),
      },
    ];

    return columns;
  }

  //获取距离价格的列配置
  getDistancePriceColumnForm = (distances) => {
    //渲染距离分段标题
    const renderDistanceTitleDetail = (distanceMin, distanceMax) => (
      <div> {distanceMin} ~ {distanceMax} km </div>
    )

    //渲染默认的价格
    const renderDefaultPriceDetail = (price, distance) => (
      <span>{price}元/{distance}km</span>
    )

    //渲染额外计价的价格
    const renderExtraPriceDetail = (price, extraPirce, distance, extraDistance) => (
      <span>{price}元/{distance}km + {extraPirce}元/{extraDistance}km</span>
    )

    //遍历距离分段数据，每段距离分段，创建一个价格表单
    const children = []
    distances.forEach((distanceValue, distanceIndex, distanceArray) => {
      const distanceMin = distanceValue.distanceMin;    //最小配送距离，不能小于默认配送距离
      const distanceMax = distanceValue.distanceMax;    //最大配送距离
      const extDistance = distanceValue.distanceExt; //额外配送价格

      //添加中间数据
      children.push({
        title: renderDistanceTitleDetail(distanceMin, distanceMax),
        dataIndex: 'price',
        key: `distanceKey${distanceIndex}`,
        render: (text, record, rowIndex) => {
          //获取价格数据
          const price = text[rowIndex][distanceIndex];
          const { priceBase, priceExt } = price;

          //如果是第一列数据，默认不带额外价格
          if (distanceIndex === 0) {
            return renderDefaultPriceDetail(priceBase, distanceMax);
          }
          //如果是其他数据，默认带额外价格
          return renderExtraPriceDetail(priceBase, priceExt, distanceMin, extDistance);
        },
      });
    });
    return children;
  }

  indexOfObject = (key, object) => {
    const keys = Object.keys(object);
    return keys.indexOf(key);
  }

  render() {
    const { getColumns } = this;
    const { data, distance } = this.state;
    const columns = getColumns(distance);

    return (
      <Row>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Table rowKey="key" columns={columns} dataSource={data} scroll={{ x: true }} bordered />
        </Col>
      </Row>
    )
  }
}

module.exports.PriceDetailComponent = PriceDetailComponent;
