import React from 'react';
import { Row, Col, Input, Button, Form, Table, Radio, Breadcrumb, Alert, Icon, Popover } from 'antd';
import style from './style.less';

import OrderStatisticsState from '../exports';

class OrderStatistics extends React.Component {
  constructor(props) {
    super();
    this.state = {
      orderStatistics: props.orderStatistics, //订单状态
    };
  }

  componentWillReceiveProps = (nextProps) => {
    //初始化新数据
    this.setState({
      orderStatistics: nextProps.orderStatistics,        //当前订单状态
    });
  };

  //状态数据面板
  renderOrderStatistics = () => {
    //数据源
    const { orderStatistics } = this.state;
    //保存图片资源  －－－－  关联状态和相应状态下的总数
    const orderIcon = [
      //总订单
      { state: OrderStatisticsState.OrderStatisticsState.total,
        number: 0,
        title: OrderStatisticsState.OrderStatisticsState.description(OrderStatisticsState.OrderStatisticsState.total),
        src: './images/totalOrder@2x.png',
      },
      //已确认
      { state: OrderStatisticsState.OrderStatisticsState.confirmed,
        number: 0,
        title: OrderStatisticsState.OrderStatisticsState.description(OrderStatisticsState.OrderStatisticsState.confirmed),
        src: './images/undistribution@2x.png',
      },
      // 配送中
      { state: OrderStatisticsState.OrderStatisticsState.distribution,
        number: 0,
        title: OrderStatisticsState.OrderStatisticsState.description(OrderStatisticsState.OrderStatisticsState.distribution),
        src: './images/distribution@2x.png',
      },
      // 异常
      { state: OrderStatisticsState.OrderStatisticsState.exception,
        number: 0,
        title: OrderStatisticsState.OrderStatisticsState.description(OrderStatisticsState.OrderStatisticsState.exception),
        src: './images/exception@2x.png',
      },
      // 未完成
      { state: OrderStatisticsState.OrderStatisticsState.undone,
        number: 0,
        title: OrderStatisticsState.OrderStatisticsState.description(OrderStatisticsState.OrderStatisticsState.undone),
        src: './images/undone@2x.png',
        style: { color: 'red' },
      },
      // 已送达
      { state: OrderStatisticsState.OrderStatisticsState.done,
        number: 0,
        title: OrderStatisticsState.OrderStatisticsState.description(OrderStatisticsState.OrderStatisticsState.done),
        src: './images/done@2x.png',
      },
      // 已取消
      { state: OrderStatisticsState.OrderStatisticsState.canceled,
        number: 0,
        title: OrderStatisticsState.OrderStatisticsState.description(OrderStatisticsState.OrderStatisticsState.canceled),
        src: './images/canceled@2x.png',
      },
      // 完成率
      {
        state: OrderStatisticsState.OrderStatisticsState.completeRate,
        number: 0,
        title: OrderStatisticsState.OrderStatisticsState.description(OrderStatisticsState.OrderStatisticsState.completeRate),
        src: './images/completeRate@2x.png',
      },
    ];

    //过滤订单数据－根据返回数据的state 和 headerIcon中的state相同，则修改该number
    if (orderStatistics && orderStatistics.length > 0) {
      let totalNumber = 0;
      for (let i = 0; i < orderStatistics.length; i++) {
        //统计总订单数
        totalNumber += orderStatistics[i].count;

        //统计未完成订单
        if (orderStatistics[i].state === OrderStatisticsState.OrderStatisticsState.confirmed ||
          orderStatistics[i].state === OrderStatisticsState.OrderStatisticsState.distribution ||
          orderStatistics[i].state === OrderStatisticsState.OrderStatisticsState.exception ||
          orderStatistics[i].state === OrderStatisticsState.OrderStatisticsState.created
        ) {
          orderIcon[4].number += orderStatistics[i].count;
        }

        //匹配state，并修改相应的number
        for (let j = 1; j < orderIcon.length - 1; j++) {
          if (orderStatistics[i].state === orderIcon[j].state) {
            orderIcon[j].number = orderStatistics[i].count;
          }
        }
      }
      //总订单数
      orderIcon[0].number = totalNumber;
      //成功率
      if (totalNumber !== 0) {
        const ratio = ((orderIcon[5].number / totalNumber) * 100).toFixed(2);
        orderIcon[7].number = `${ratio}%`;
      } else {
        orderIcon[7].number = `${0}%`;
      }
    }

    return orderIcon.map((item) => {
      return (
        <Col sm={3} key={item.state}>
          <Row>
            <Col sm={12} style={{ textAlign: 'center' }}>
              <img src={item.src} alt={item.title} className={style.headerIcon} />
            </Col>
            <Col sm={12}>
              <div className={style.font16} style={item.style}>{item.number}</div>
              <div>{item.title}</div>
            </Col>
          </Row>
        </Col>
      );
    })
  };

  render() {
    const {
      renderOrderStatistics,
    } = this;
    return (
      <Row className={`${style.component}`}>
        {/* 渲染状态数据面板 */}
        {renderOrderStatistics()}
      </Row>
    );
  }
}

module.exports = OrderStatistics;
