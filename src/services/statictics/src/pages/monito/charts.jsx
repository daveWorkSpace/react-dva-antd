import React, {Component, PropTypes} from 'react';
import {Row, Col} from 'antd';
import echarts from 'echarts';

class Charts extends React.Component {

  constructor(props) {
    super();

    this.optionsParams = {
      couriers: ['on_guard','off_guard'],
      imports: ['yesterday_data','last_week_data','today_data'],
    };

    this.charts = {};
    this.options = {};

    this.charts.couriers = null;
    this.options.couriers = {
      title : {
          text: '骑士工作状态',
      },
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      legend: {
          orient: 'vertical',
          x: 'left',
          top: '30px',
          data:['在岗','离岗']
      },
      series: [
          {
              name:'骑士工作状态',
              type:'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              label: {
                  normal: {
                      show: false,
                      position: 'center'
                  },
                  emphasis: {
                      show: true,
                      textStyle: {
                          fontSize: '30',
                          fontWeight: 'bold'
                      }
                  }
              },
              labelLine: {
                  normal: {
                      show: false
                  }
              },
              data:[
                  {value: 0, name:'在岗'},
                  {value: 0, name:'离岗'},
              ]
          }
      ]
    };

    this.charts.shipments = null;
    this.options.shipments = {

      title: {
          text: '当日订单总计',
      },
      tooltip: {
          trigger: 'axis',
          axisPointer: {
              type: 'shadow'
          }
      },
      legend: {
          data: ['今日']
      },
      grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
      },
      xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
      },
      yAxis: {
          type: 'category',
          data: ["异常", "已取消", "已完成", "已取货", "已到店", "已接单", "总订单"]
      },
      series: [
          {
              name: '今日',
              type: 'bar',
              data: [0, 0, 0, 0, 0, 0, 0]
          },
      ]
  };

    this.charts.imports = null;
    this.options.imports = {
      tooltip: {
          trigger: 'axis'
      },
      title : {
          text: '进单量统计',
      },
      legend: {
          data:['昨日', '上周', '今日']
      },
      xAxis: [
          {
              type: 'category',
              data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
          }
      ],
      yAxis: [
          {
              type: 'value',
              name: '进单量',
              min: 0,
              max: 300,
              interval: 30,
              axisLabel: {
                  formatter: '{value}'
              }
          }
      ],
      series: [
          {
              name:'昨日',
              type:'line',
              yAxisIndex: 0,
              data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          {
              name:'上周',
              type:'line',
              yAxisIndex: 0,
              data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          {
              name:'今日',
              type:'line',
              data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          }

      ]
    };

  }

  componentWillReceiveProps(props) {
    let {charts, options, optionsParams} = this;
    const {couriers_data, shipments_data, imports_data} = props;
    //couriers
    optionsParams.couriers.forEach((item,index) => {
      options.couriers.series[0].data[index].value = couriers_data[item];
    })
    charts.couriers.setOption(options.couriers);

    //shipments
    const sum = shipments_data.reduce(function(prev, cur, index, array){
      return prev + cur;
    });
    shipments_data.push(sum);
    options.shipments.series[0].data = shipments_data;
    charts.shipments.setOption(options.shipments);

    //imports
    optionsParams.imports.forEach((item,index) => {
      options.imports.series[index].data = imports_data[item];
    })
    charts.imports.setOption(options.imports);

  }


  componentDidMount() {
    for(let _name in this.charts){
      this.charts[_name] = echarts.init(document.getElementById('chart_' + _name));
      this.charts[_name].setOption(this.options[_name]);
    }
  }

  render() {
    function handleSubmit(e) {
      e.preventDefault();
    };


    return (
      <Row style={{marginTop:'40px'}}>
         <Col span={10}>
            <div id="chart_couriers" style={{height:'300px'}}></div>
         </Col>
         <Col span={10}>
            <div id="chart_shipments" style={{height:'300px'}}></div>
         </Col>
         <Col span={22} style={{marginTop:'40px'}}>
            <div id="chart_imports" style={{height:'400px'}}></div>
         </Col>
      </Row>
    )
  }
};

module.exports =  Charts;
