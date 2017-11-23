import React, {Component, PropTypes} from 'react';
import {Row, Col,Popover, Button,Icon, Card} from 'antd';

const Stats = (props) => {

  const {p1,p2,p3,p4} = props.stats_data
  const text = <span>说明</span>;
  const content1 = (
    <div>
      <p>＊包含正在在岗及掉线的骑士</p>
      <p>＊变化率定义：1 -（当前工作中骑士/总骑士数）/（昨日同期工作中骑士/总骑士数）</p>
      <p>＊黄色：相比昨日的变化率大于10% </p>
      <p>＊红色：相比昨日的变化率大于30% </p>
    </div>
  );
  const content2 = (
    <div>
      <p>＊只计算未完成的订单</p>
      <p>＊当前时间－预计送达时间 &gt; 10min</p>
      <p>＊蓝色：超时单占比小于5%</p>
      <p>＊黄色：超时单占比 &gt;= 5%</p>
      <p>＊红色：超时单占比 &gt;= 10%</p>
    </div>
  );

  const content3 = (
    <div>
      <p>＊反映人均未完成任务量 </p>
      <p>＊计算公式：（未取货×1+已取货×0.5）/工作中骑士数 </p>
      <p>＊蓝色：负载 &lt; 3 </p>
      <p>＊黄色：负载 &gt;= 3 </p>
      <p>＊红色：负载 &gt;= 6 </p>
    </div>
  );
  const content4 = (
    <div>
      <p>＊只计算未完成的订单</p>
      <p>＊当前时间－预计送达时间 > 10min</p>
      <p>＊蓝色：超时单占比小于5%</p>
      <p>＊黄色：超时单占比 &gt;= 5%</p>
      <p>＊红色：超时单占比 &gt;= 10%</p>
    </div>
  );

  return (
    <Row>

      <Col sm={6}>
        <Card title="工作中骑士数"
          extra={
          <Popover placement="bottomLeft" title={text} content={content1} trigger="hover">
            <Icon type="question-circle-o" />
          </Popover>
           }
          style={{ textAlign:'center' }}>
         {p1}
       </Card>
      </Col>
      <Col sm={6}>
        <Card title="超时单占比"
          extra={
          <Popover placement="bottomLeft" title={text} content={content2} trigger="hover">
            <Icon type="question-circle-o" />
          </Popover>
           }
          style={{textAlign:'center' }}>
         {p2}
       </Card>
      </Col>
      <Col sm={6}>
        <Card title="人均负载"
          extra={
          <Popover placement="bottomLeft" title={text} content={content3} trigger="hover">
            <Icon type="question-circle-o" />
          </Popover>
           }
          style={{ textAlign:'center' }}>
         {p3}
       </Card>
      </Col>
      <Col sm={6}>
        <Card title="今日总单量"
          extra={
          <Popover placement="bottomLeft" title={text} content={content4} trigger="hover">
            <Icon type="question-circle-o" />
          </Popover>
           }
          style={{ textAlign:'center' }}>
           {p4}
       </Card>
      </Col>
    </Row>
  )
};

module.exports =  Stats;
