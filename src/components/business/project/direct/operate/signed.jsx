import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router'
import { Row, Col, Form, Table } from 'antd';
import { sqlit } from '../../../../../utils/newUtils';
const FormItem = Form.Item;

// 判断展示可能为多级的定价方案
function showLevelPricePlan(list_details) {
    // 获取定价方案的对象
  const price_plan = list_details;
    // 获取到一系列需要用到的数据
  let [distanceData, pirceData, rowNum, colNum, curr_time] = [[], [{}], 0, 0, price_plan[0].time_span[0]];

    //distanceData距离数据
    //pirceData 定价数据
  price_plan.forEach((item, index) => {
        //判断是否换行 是否换列
    if (curr_time !== item.time_span[0]) {
      curr_time = item.time_span[0];
      pirceData.push({});
      colNum = 0;
      rowNum++;
    } else if (index !== 0) {
      colNum++;
    }
    if (rowNum === 0) {
            //收集第一行的距离个数
      distanceData.push(1);
    }
        // 写入价格数据里面
    pirceData[rowNum][`plan${colNum}`] = item;
  });
    // 关于距离定价
  const columns = distanceData.map((item, index) => {
    const _result = {
      title: '距离分段',
      dataIndex: `plan${index}`,
      key: `name_${index}`,
    };
        // 如果只有一列
    if (index === 0) {
      _result.colSpan = distanceData.length;
      _result.render = (text, record, index2) => {
        const { max_distance, base_price } = text;
        if (index2 === 0) {
          return `小于${max_distance / 1000}km`;
        }
        return `${base_price / 100}元／${max_distance / 1000}km`;
      };
    } else {
      _result.colSpan = 0;
      _result.render = (text, record, index2) => {
        const { max_distance, min_distance, base_price, ext_price } = text;
        if (index2 === 0) {
          return `小于${max_distance / 1000}km`;
        }
        return `${base_price / 100}元／${min_distance / 1000}km + ${ext_price / 100}元／1km`;
      };
    }
    return _result;
  });

    // table的配置 距离参照ant-design
  const tableProps = {
    pagination: false, //分页
    dataSource: [pirceData[0], ...pirceData], //数据源
    columns: [//列
      {
        title: '时间分段',
        dataIndex: 'name',
        key: 'name',
        render: (text, record, index) => {
          if (index === 0) {
            return '--';
          }
          const { time_span } = record.plan0;
          return `${time_span[0]}--${time_span[1]}`;
        },
      },
      ...columns,
    ],
  };
  return (<Table rowKey={(record, index) => { return index }} {...tableProps} />);
}

class Signed extends Component {
  constructor(props) {
    super();
    this.state = {
      content: '',
      basicInfoTitle: '产品基本信息',
      columns: [{
        title: '时间分段',
        dataIndex: 'timePart',
        render: (text, record) => {
          return (
            <span>{
                            sqlit(record.time_span, '-')
                        }</span>
          )
        },
      }, {
        title: '距离分段',
        dataIndex: 'spacePart',
                // 定价方案是不确定的  根据数据进行渲染
        render: (text, record, index) => {
          return (
            <Row>
              <Col sm={12}>
                <span>{`${record.base_price / 100}元 / ${record.min_distance / 1000}km`}</span>
              </Col>
              <Col sm={12}>
                <span>{`${record.base_price / 100}元 / ${record.min_distance / 1000}km + `}{`${record.ext_price / 100}元 / ${record.ext_distance / 1000}km`}</span>
              </Col>
            </Row>
          )
        },
      }],
    };
  }

  componentWillMount() {
    const { signedInfos } = this.props;
    const list_details = signedInfos.price_plan;
    if (signedInfos.price_mode == 2) {
      const Ladder = showLevelPricePlan(list_details);
      this.setState({
        content: Ladder,
      })
    }
  }

  componentWillReceiveProps = (nextProps) => {

  };

  render() {
    const { priceTitle, signedInfos } = this.props;
    const list_details = signedInfos.price_plan;
    const price_mode = signedInfos.price_mode ? signedInfos.price_mode : ''; // 定价模式（一口价、阶梯定价)
    const price = signedInfos.price_plan.length != 0 ? signedInfos.price_plan[0].base_price : ''; // 一口价金额大小
    return (
      <div className="bd-content">
        <div className="content-title">{priceTitle}</div>
        <Form>
          {
                        price_mode == 1 ?
                          <div>
                            <Row>
                              <Col sm={12}>
                                <FormItem
                                  label="定价模式" {...{
                                    labelCol: { span: 6 },
                                    wrapperCol: { span: 8 },
                                  }}
                                >
                                  <span>一口价</span>
                                </FormItem>
                              </Col>
                            </Row>
                            <Row >
                              <Col sm={12}>
                                <FormItem
                                  label="定价方案" {...{
                                    labelCol: { span: 6 },
                                    wrapperCol: { span: 8 },
                                  }}
                                >
                                  <span>{price / 100}元/单</span>
                                </FormItem>
                              </Col>
                            </Row>
                            <Row >
                              <Col sm={24}>
                                <FormItem
                                  label="说明:" {...{
                                    labelCol: { span: 6 },
                                    wrapperCol: { span: '' },
                                  }}
                                >
                                  <span>一口价，一律按订单计价，所有订单配送费不分距离、时间如：设置费用{price / 100}元/单，
                            1单配送费为{price / 100}元</span>
                                </FormItem>
                              </Col>
                            </Row>
                          </div> :
                          <div>
                            <Row>
                              <Col sm={12}>
                                <FormItem
                                  label="定价模式" {...{
                                    labelCol: { span: 6 },
                                    wrapperCol: { span: 8 },
                                  }}
                                >
                                  <span>阶梯计价</span>
                                </FormItem>
                              </Col>
                            </Row>
                            <Row>
                              <Col sm={12}>
                                <FormItem
                                  label="定价方案" {...{
                                    labelCol: { span: 6 },
                                    wrapperCol: { span: 8 },
                                  }}
                                >
                                  <span>距离加时间阶梯价</span>
                                </FormItem>
                              </Col>
                            </Row>
                            {
                                    this.state.content
                                }
                          </div>
                    }
        </Form>
      </div>
    );
  }
}

function mapStateToProps({ retailSellerInfo }) {
  return { retailSellerInfo }
}
module.exports = connect(mapStateToProps)(Signed);
