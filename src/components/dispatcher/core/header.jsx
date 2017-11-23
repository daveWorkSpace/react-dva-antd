//分拨管理站点操作配送站与统计信息模块
import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Popover, Badge, Tooltip, Icon, Table, Select, Pagination, Popconfirm } from 'antd';
import style from './style.less';
const FormItem = Form.Item;
const Option = Select.Option;
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    //  选择配送站函数
    this.handleSelect = this.handleSelect.bind(this);
  }

  // 选择配送站函数
  handleSelect(value) {
    this.props.onChangeByDeliveryStock(value);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { showStatistics, columns, stockOrdersStatistic, stockListByDelivery, activeStockId, content, fetchStockOrdersStatistic } = this.props;
    const { handleSelect } = this;
    return (
      <div className="bd-header">
        <Form layout="inline">
          <FormItem label="配送站">
            {getFieldDecorator('stock', {
              initialValue: activeStockId,
            })(
              <Select
                showSearch
                placeholder="请选择配送站"
                optionFilterProp="children"
                style={{ width: 200 }}
                onSelect={handleSelect}
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
        </Form>
        <div className={style.statisticsBox}>
          {showStatistics && <Table className={style.tableContent} rowKey={(record, index) => { return index }} bordered pagination={false} dataSource={stockOrdersStatistic} columns={columns} />}
          {
            showStatistics && <div className={style.reflush}>
              <div className={style.popoverBox}>
                <Popover
                  content={content}
                  placement="leftBottom"
                  getPopupContainer={e => document.querySelector('.iconBoxByOperate')}
                >
                  <Icon type="info-circle-o" className="iconBoxByOperate" />
                </Popover>
              </div>
              <div className={`${style.popoverBox} ${style.retweetIcon}`}>
                <Icon type="retweet" onClick={() => fetchStockOrdersStatistic()} />
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default Form.create()(Header);
