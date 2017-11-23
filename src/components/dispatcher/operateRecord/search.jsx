import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Icon, Table, Select, Pagination, Popconfirm, DatePicker } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const { MonthPicker, RangePicker } = DatePicker;

//日期时间选择器格式
import moment from 'moment';
// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

//引用通用枚举值
import { INBOUND_RECORD } from '../core/enumerate.js';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStockId: '',      //当前仓库id
    };

    this.private = {
      itemLayout: {
        labelCol: { span: 7 },
        wrapperCol: { span: 17 },
      },
      stockTypeTitle: '',        //标识入站或出站
    };
  }

  componentWillMount() {
    const { type } = this.props;
    if (type === INBOUND_RECORD) {
      this.private.stockTypeTitle = '入';
    } else {
      this.private.stockTypeTitle = '出';
    }
  }

  componentWillReceiveProps(nextProps) {
    const { activeStockId } = nextProps;
    this.setState({ activeStockId });
  }

  handleSubmit = (e) => {
    const { searchHandle } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        searchHandle(values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { activeStockId } = this.state;
    const { stockListByDelivery } = this.props;
    const { itemLayout, stockTypeTitle } = this.private;

    return (
      <div className="bd-header">
        <Form layout="horizontal" onSubmit={this.handleSubmit}>
          <Row gutter={24}>
            <Col sm={8}>
              <FormItem
                label="配送站"
                {...itemLayout}
              >
                {getFieldDecorator('stock', {
                  initialValue: activeStockId,
                })(
                  <Select
                    showSearch
                    placeholder="请选择配送站"
                    optionFilterProp="children"
                    style={{ width: 200 }}
                  >
                    {stockListByDelivery.data.map((item, index) => {
                      return (
                        <Option key={index} value={item.id}>
                          {item.name}
                        </Option>
                      );
                    })}
                  </Select>,
                )}
              </FormItem>
            </Col>
            {/*<Col sm={8}>
              <FormItem label="订单编号" {...this.itemLayout}>
                <Input placeholder="请输入订单编号" />
              </FormItem>
            </Col>
            <Col sm={8}>
              <FormItem label="入站类型" {...this.itemLayout}>
                {getFieldDecorator('order-num', {
                  rules: [{ message: '请选择入站类型' }],
                })(
                  <Select showSearch placeholder="请选择入站类型" optionFilterProp="children">
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                    <Option value="Yiminghe">yiminghe</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col sm={8}>
              <FormItem label="商家类型" {...this.itemLayout}>
                {getFieldDecorator('business-type', {
                  rules: [{ message: '请选择商家类型' }],
                })(
                  <Select showSearch placeholder="请选择商家类型" optionFilterProp="children">
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                    <Option value="Yiminghe">yiminghe</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col sm={8}>
              <FormItem label="商家名称" {...this.itemLayout}>
                {getFieldDecorator('business-name', {
                  rules: [{ message: '请选择商家名称' }],
                })(
                  <Select showSearch placeholder="请选择商家名称" optionFilterProp="children">
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                    <Option value="Yiminghe">yiminghe</Option>
                  </Select>
                )}
              </FormItem>
            </Col>*/}
            <Col sm={16}>
              <FormItem
                label={`${stockTypeTitle}站日期`}
                {...itemLayout}
              >
                {getFieldDecorator('date', {
                  initialValue: [moment('00:00', 'HH:mm'), moment('23:59', 'HH:mm')],
                  rules: [{ type: 'array', message: `请选择${stockTypeTitle}站日期` }],
                })(
                  <RangePicker
                    showTime
                    format="YYYY-MM-DD HH:mm"
                  />,
                )}
              </FormItem>
            </Col>
            <Col sm={24}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export default Form.create()(Search);
