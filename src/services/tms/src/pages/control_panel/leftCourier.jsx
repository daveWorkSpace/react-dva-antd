import React, { Component, PropTypes } from 'react';
import { Form, Row, Col, Input, Button, Icon, Table, Select, Pagination, Popconfirm } from 'antd';

const [FormItem, Option] = [Form.Item, Select.Option];

class leftCourier extends Component {
  constructor(props) {
    super();
    // 设置内部state
    this.state = {
      filteredValue: [], //ant-design组件 筛选的值
    }
  }
  // 设置filteredValue
  setNamefilter = (val) => {
    this.setState({
      filteredValue: [val],
    });
  }


  render() {
    // 从props里面获取信息
    const { couriers, stateChange, selectedLen, showModal } = this.props;
    const { filteredValue } = this.state;

    const courierNum = couriers.data.length
    // 表格的列
    const columns = [
      {
        title: `骑士(${courierNum})`,
        dataIndex: 'name',
        key: 'name',
        width: '50px',
        filteredValue,
        onFilter: (value, record) => record.name.indexOf(value) === 0,
      }, {
        title: '送/总',
        dataIndex: 'statistics',
        key: 'verify_state2',
        render: (stats) => {
          if (stats) {
            return `${stats.accepted + stats.already_arrived + stats.pickup}/${stats.total}`;
          }
          return '未知';
        },
      }, {
        title: '推荐',
        dataIndex: 'name',
        key: 'id',
        render: (text, record, index) => {
          return (
            <Button
              disabled={selectedLen !== 0 && record.work_state === 100 ? '' : 'disabled'}
              size="small"
              onClick={() => { showModal(record) }}
            >
                改派
              </Button>
          );
        },
      },
    ];

    // 从this里面获取信息
    const { setNamefilter } = this;
    return (
      <Col span={4} className="left-courier">
        <Row
          style={{
            height: '40px',
          }}
        >
          <Col span={10}>
            <Select style={{ width: '100%' }} defaultValue={'100'} onChange={(val) => { stateChange('couriers', val) }}>
              <Option key="0" value="">全部</Option>
              <Option key="1" value="100">在岗</Option>
              <Option key="2" value="-100">离岗</Option>
            </Select>
          </Col>
          <Col span={12} offset={1}>
            <Input
              placeholder="请输入骑士姓名"
              onChange={(e) => { setNamefilter(e.target.value) }}
            />
          </Col>
        </Row>
        <Row
          style={{
            maxHeight: '500px',
            overflowY: 'auto',
          }}
        >
          <Table
            columns={columns}
            dataSource={couriers.data}
            size="middle"
            rowKey="id"
            pagination={false}
            bordered
          />
        </Row>
      </Col>
    );
  }

}

leftCourier = Form.create()(leftCourier);

module.exports = leftCourier;
