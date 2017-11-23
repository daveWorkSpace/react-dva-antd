import React, {Component, PropTypes} from 'react';
import {Row, Col} from 'antd';

const Stats = (props) => {
  const {profit, Earnings, gain,Payoff} = props.stats_data
  return (
    <Col sm={6}>
      <aside id="rightContent" style={{height:'800px',width:'100%',backgroundColor:'#ccc'}}>
        <div style={{height:'25%',width:'100%',textAlign:'center',borderBottom:'1px solid #fff'}}>
          <h1>{profit}</h1>
          <p>本月累计盈利</p>
        </div>
        <div style={{height:'25%',width:'100%',lineHeight:'40px',marginBottom:'3%',textAlign:'center',borderBottom:'1px solid #fff'}}>
         <h1>{Earnings}</h1>
         <p>本月累计盈利</p>
        </div>
        <div style={{height:'25%',width:'100%',marginBottom:'3%',textAlign:'center',borderBottom:'1px solid #fff'}}>
         <h1>{gain}</h1>
         <p>本月累计盈利</p>
        </div>
        <div style={{height:'25%',width:'100%',marginBottom:'3%',textAlign:'center',borderBottom:'1px solid #fff'}}>
         <h1>{ Payoff }</h1>
         <p>本月累计盈利</p>
        </div>
      </aside>
    </Col>
  )
};

module.exports =  Stats;
