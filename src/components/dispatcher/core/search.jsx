import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Icon, Table, Select, Pagination, Popconfirm, DatePicker } from 'antd';
import { BusinessType } from '../../../application/define';
import { connect } from 'dva';
import dot from 'dot-prop';
import { CommonManage } from '../../actions.js';

//日期时间选择器格式
import moment from 'moment';

//引用通用枚举值
import {
  KNIGHT_AFFIRM_ORDER,
  EXCEPTION_ORDER,
  DISTRIBUTION_ORDER,
  TRANSFER_ORDER,
} from './enumerate'

import style from './style.less';

const FormItem = Form.Item;
const Option = Select.Option;
const { MonthPicker, RangePicker } = DatePicker;
const { fetchSellersList, clearSellersList } = CommonManage;

class Search extends Component {
  constructor(props) {
    super()
    const { sellersList } = props.commonSellers;
    this.state = {
      //配送站列表
      stockListByDelivery: {
        _meta: {},
        data: [],
      },
      sellersList,
    };

    this.private = {
      form: props.form,
      dispatch: props.dispatch,
      fetchSellersList,
      clearSellersList,
      //判断显示选择项
      /**
       * 区域
       * 状态
       * 日期
       */
      shown: {
        areaname: false,
        state: false,
        date: false,
      },
      cancelFlag: 2,        //操作按钮 取消订单
      itemLayout: {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
      },
    }
  }

  componentWillMount() {
    const { type } = this.props
    const { shown } = this.private
    switch (type) {
      case KNIGHT_AFFIRM_ORDER:
        break;
      case EXCEPTION_ORDER:
        break;
      case DISTRIBUTION_ORDER:
        shown.date = true
        shown.state = true
        break;
      case TRANSFER_ORDER:
        break;
      default:
        break;
    }
  }

  componentWillReceiveProps(nextProps) {
    const { stockListByDelivery, commonSellers } = nextProps;
    const { sellersList } = commonSellers;
    this.setState({ stockListByDelivery, sellersList })
  }

  handleSubmit = (e) => {
    const { onSearch } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        onSearch(values)
      }
    });
  }

  //商家类型
  onSelectContractType = (type) => {
    const { resetFields } = this.private.form;
    const { dispatch, fetchSellersList, clearSellersList } = this.private;
    //重置商家
    resetFields(['sellerId'])
    dispatch({
      type: clearSellersList
    });
    if (!type){
      return ;
    }
    dispatch({
      type: fetchSellersList,
      payload: { type: type }
    });
  }
  //
  componentWillUnmount = ()=>{
    const { dispatch, fetchSellersList, clearSellersList } = this.private;
    dispatch({
      type: clearSellersList
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { shown, cancelFlag, itemLayout } = this.private;
    const { stockListByDelivery, sellersList } = this.state;
    const { showOrHideOperatePanel, stockOrderIds, type, activeStockId } = this.props;
    let selectSellersChildren = [];
    if (dot.has(this.state.sellersList, 'data') && this.state.sellersList.data.length > 0) {
      sellersList.data.map((item, index) => {
        selectSellersChildren.push(<Option key={`${item.id}${index}`} value={item.id}> {item.name} </Option>);
      })
    }
    return (
      <div className="bd-header">
        <Form layout="horizontal" onSubmit={this.handleSubmit}>
          <Row gutter={24}>
            <Col sm={6}>
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
                    style={{ width: 150 }}
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
            <Col sm={6}>
              <FormItem
                label="订单编号"
                {...itemLayout}
              >
                {getFieldDecorator('org_order_id')(
                  <Input placeholder="请输入订单编号" style={{ width: 200 }} />,
                )}
              </FormItem>
            </Col>
            {/*{
              shown.areaname && <Col sm={8}>
                <FormItem
                  label="区域名称"
                  {...this.itemLayout}
                >
                  {
                    getFieldDecorator('areaname', {
                      rules: [{ message: '请选择区域名称' }],
                    })(
                      <Select
                        showSearch
                        placeholder="请选择区域名称"
                        optionFilterProp="children"
                      >
                        <Option value="jack">Jack</Option>
                        <Option value="lucy">Lucy</Option>
                        <Option value="Yiminghe">yiminghe</Option>
                      </Select>
                      )
                  }
                </FormItem>
              </Col>
            }*/}
            <Col sm={12}>
              <FormItem
                label="期望送达日期"
                {...itemLayout}
              >
                {getFieldDecorator('date', {
                  rules: [{ type: 'array', message: '请选择期望送达日期' }],
                })(
                  <RangePicker
                    showTime={{
                      defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                    }}
                    format="YYYY-MM-DD HH:mm:ss"
                  />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>

            <Col sm={6}>
              <FormItem
                label="商家类型"
                {...itemLayout}
              >
                {
                  getFieldDecorator('business-type', {
                    initialValue: '全部'
                  })(
                    <Select
                      showSearch
                      placeholder="请选择商家类型"
                      style={{ width: 150 }}
                      onSelect={this.onSelectContractType}
                    >
                      <Option key='' value=''>全部</Option>
                      <Option key={`${BusinessType.driect}`} value={`${BusinessType.driect}`}>{BusinessType.description(BusinessType.driect)}</Option>
                      <Option value={`${BusinessType.affiliate}`}>{BusinessType.description(BusinessType.affiliate)}</Option>
                    </Select>
                    )
                }
              </FormItem>
            </Col>
            <Col sm={6}>
              <FormItem
                label="商家名称"
                {...itemLayout}
              >
                {
                  getFieldDecorator('sellerId', {
                    rules: [{ message: '请选择商家名称' }],
                  })(
                    <Select
                      showSearch
                      optionFilterProp="children"
                      placeholder="请选择商家名称"
                      style={{ width: 200 }}
                    >
                      {
                        selectSellersChildren
                      }

                    </Select>
                    )
                }
              </FormItem>
            </Col>
            {
              shown.state && <Col sm={6}>
                <FormItem
                  label="状态"
                  {...itemLayout}
                >
                  {
                    getFieldDecorator('state', {
                      initialValue: '',
                      rules: [{ message: '请选择状态' }],
                    })(
                      <Select
                        showSearch
                        placeholder="请选择状态"
                        optionFilterProp="children"
                      >
                        <Option key="0" value="">全部</Option>
                        <Option key="1" value="1">已创建</Option>
                        <Option key="2" value="25">已确认</Option>
                        <Option key="3" value="30">已入站</Option>
                        <Option key="4" value="45">已分配</Option>
                        <Option key="5" value="50">配送中</Option>
                        <Option key="6" value="100">已完成</Option>
                        <Option key="7" value="-100">已关闭</Option>
                        <Option key="8" value="-50">异常</Option>
                        <Option key="9" value="1,25,30,45,50,-50">未完成</Option>
                      </Select>,
                    )
                  }
                </FormItem>
              </Col>
            }
            <Col sm={6} className={style.searchButton}>
              <Button type="primary" htmlType="submit" >查询</Button>
              {
                type !== KNIGHT_AFFIRM_ORDER ? <Button onClick={() => showOrHideOperatePanel(cancelFlag, true, stockOrderIds)}>批量取消</Button> : ''
              }

            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}

function mapStateToProps({ SiteOperate, commonSellers }) {
  return { SiteOperate, commonSellers };
}

module.exports = connect(mapStateToProps)(Form.create()(Search));
// export default Form.create()(Search);

// initialValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
