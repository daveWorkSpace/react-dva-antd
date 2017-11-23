import React, {Component, PropTypes} from 'react';
import {Row, Col} from 'antd';
import echarts from 'echarts';

class Charts extends React.Component {

  constructor(props) {
    super();
    this.charts = {
      yesterday: null,
      oneDay: null,
    };

    this.optionsParams = {
      yesterday: ['yes_line_income','yes_offline_income'],
      oneDay: ['yesterday_income','average_income','yesterday_order','average_order']
    };

    this.options =  {
      yesterday: {
          title : { text: '昨日收入（元）', },
          tooltip : { trigger: 'item', formatter: "{a} <br/>{b} : {c} ({d}%)" },
          legend: { orient: 'horizontal', right: '10%', data: ['线上收入','线下收入'] },
          series : [
              {
                  name: '收入占比',
                  type: 'pie',
                  radius : '60%',
                  center: ['50%', '60%'],
                  data:[
                      {value: 0, name:'线上收入'},
                      {value: 0, name:'线下收入'},
                  ],
                  itemStyle: { emphasis: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
              }
          ]
      },
      oneDay: {
        tooltip: { trigger: 'axis' },
        title : { text: '24小时收入概况', },
        legend: { data:['昨日收入', '本月平均收入', '昨日收入订单笔数', '本月平均收入订单笔数'] },
        xAxis: [ { type: 'category', data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24] } ],
        yAxis: [ { type: 'value', name: '收入（元）', min: 0, max: 300, interval: 30, axisLabel: { formatter: '{value}' } } ],
        series: [
            {
                name:'昨日收入',
                type:'line',
                yAxisIndex: 0,
                data:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            {
                name:'本月平均收入',
                type:'line',
                yAxisIndex: 0,
                data:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            {
                name:'昨日收入订单笔数',
                type:'bar',
                data:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            {
                name:'本月平均收入订单笔数',
                type:'bar',
                data:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }
        ]
      }
    };
  }

  componentWillReceiveProps(props) {
    let {charts, options, optionsParams} = this;
    const {income} = props;
    optionsParams.yesterday.forEach((item,index) => {
      options.yesterday.series[0].data[index].value = income[item];
    })
    charts.yesterday.setOption(options.yesterday);
    optionsParams.oneDay.forEach((item,index) => {
      options.oneDay.series[index].data = income[item];
    })
    charts.oneDay.setOption(options.oneDay);
  }

  componentDidMount() {
    for(let _name in this.charts){
      this.charts[_name] = echarts.init(document.getElementById(_name));
      this.charts[_name].setOption(this.options[_name]);
    }
  }

  render() {
    const {
      yes_line_income,
      yes_offline_income,
    } = this.props.income;
    return (

      <Row>
        <Row>
         <Col span={18}>
            <div id="yesterday" style={{height:'200px'}}></div>
         </Col>
         <Col span={6}>
           <table>
             <tbody>
               <tr>
                 <th>昨日收入</th>
                 <td>{yes_line_income + yes_offline_income}</td>
               </tr>
               <tr>
                 <th>昨日线上收入</th>
                 <td>{yes_line_income}</td>
               </tr>
               <tr>
                 <th>昨日线下收入</th>
                 <td>{yes_offline_income}</td>
               </tr>
             </tbody>
           </table>
         </Col>
       </Row>
       <Row>
            <Col span={24}>
             <div id="oneDay" style={{marginTop: '70px',height:'400px'}}></div>
            </Col>
       </Row>
      </Row>
    )
  }
};

module.exports =  Charts;
