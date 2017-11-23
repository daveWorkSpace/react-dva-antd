import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Button, Tag, Input, Modal, Select, message } from 'antd';
import { authorize } from '../../../application/'

const [FormItem, Option] = [Form.Item, Select.Option];

class AddSupplier extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    }
    this.private = {
      itemLayout: { labelCol: { span: 7 }, wrapperCol: { span: 14 } },
    }
        // 查询合作区域列表
    this.handleOk = this.handleOk.bind(this);
        // 显示添加合作区域面板
    this.showModal = this.showModal.bind(this);
        // 取消添加合作区域
    this.handleCancel = this.handleCancel.bind(this);
  }

    // 添加合作区域提交
  handleOk(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
                // 调用钩子函数
        this.props.addSubmit(values)
        this.setState({
          visible: false,
        });
      }
    });
    const { form } = this.props;
    form.resetFields();
  }

    // 显示添加合作区域面板
  showModal() {
    this.setState({
      visible: true,
    });
        // 获取可供选择承运商列表
    this.props.getVendorSupplierListFunc();
  }

    // 取消添加合作区域
  handleCancel(e) {
    this.setState({
      visible: false,
    });
    const { form } = this.props;
    form.resetFields();
  }

  render() {
    const { itemLayout } = this.private;
    const { getFieldDecorator } = this.props.form;
    const { handleOk, showModal, handleCancel } = this;
    const { vendorSupplierList, city_name } = this.props;
    const filterSupplierList = [];
    if (vendorSupplierList) {
      vendorSupplierList.forEach((vendor) => {
        if (vendor.id !== authorize.vendor.id) {
          filterSupplierList.push(vendor);
        }
      })
    }

    return (
      <Button type="primary" onClick={showModal}>添加新承运商
        <Modal title={'添加承运商'} visible={this.state.visible} onOk={handleOk} onCancel={handleCancel} style={{ top: '35%' }}>
          <Form>
            <Row>
              <Col sm={24}>
                <FormItem label="城市:" {...{ labelCol: { span: 8 }, wrapperCol: { span: 9 } }}>
                  <p>{ city_name }</p>
                </FormItem>
              </Col>
              <Col sm={24}>
                <FormItem label="承运商:" {...{ labelCol: { span: 8 }, wrapperCol: { span: 9 } }}>
                  {
                  getFieldDecorator('supply_vendor_id', {
                    rules: [{ required: true, message: '请选择承运商' }],
                  })(<Select showSearch style={{ width: '80%' }} placeholder={'请选择承运商'} optionFilterProp="children">
                    {
                      filterSupplierList.map((item, index) => {
                        return (
                          <Option key={item.id} value={item.id}>{item.name}</Option>
                        )
                      })
                    }
                  </Select>)
                }
                </FormItem>
              </Col>
            </Row>

          </Form>
        </Modal>
      </Button>
    );
  }
}

function mapStateToProps({ BusinessSupplierService }) {
  return { BusinessSupplierService };
}

export default connect(mapStateToProps)(Form.create()(AddSupplier));
