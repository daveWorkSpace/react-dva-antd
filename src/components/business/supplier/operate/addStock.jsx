import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Button, Tag, Input, Modal, Select, message } from 'antd';
const [FormItem, Option] = [Form.Item, Select.Option];

class AddStock extends Component {
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
        const area_id = values.area_id;
                // this.props.submitAddArea(area_id)
        this.setState({
          visible: false,
        });
      }
    });
    const { form } = this.props;
    form.resetFields();
  }

    // 显示添加合作区域面板
  showModal = () => {
    this.setState({
      visible: true,
    });
        // 获取合作区域列表
        // this.props.getAreaList();
  };

    // 取消添加合作区域
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
    const { form } = this.props;
    form.resetFields();
  };

  render() {
    const { itemLayout } = this.private;
    const { getFieldDecorator } = this.props.form;
    const { handleOk, showModal, handleCancel } = this;
        // const { addAreaList } = this.props;
    return (
      <Col sm={4}>
        <Button type="primary" onClick={showModal}>添加合作仓库</Button>
        <Modal title={'添加合作仓库'} visible={this.state.visible} onOk={handleOk} onCancel={handleCancel} style={{ top: '35%' }}>
          <Form>
            <Row>
              <Col sm={24}>
                <FormItem label="选择区域:" {...{ labelCol: { span: 8 }, wrapperCol: { span: 9 } }}>
                  {
                    getFieldDecorator('area_id', {
                      rules: [{ required: true, message: '请选择合作仓库' }],
                    })(<Select
                      showSearch
                      style={{ width: '80%' }}
                      placeholder={'请选择合作仓库'}
                      optionFilterProp="children"
                    >
                      <Option key="1" value="酒仙桥">酒仙桥</Option>

                      {/*{
                            addAreaList.data.map((item, index) => {
                                return (
                                    <Option key={item.id} value={item.id}>{item.name}</Option>
                                )
                            })
                        }*/}
                    </Select>)
                  }
                </FormItem>
              </Col>
            </Row>

          </Form>

        </Modal>
      </Col>
    );
  }
}

function mapStateToProps({ BusinessSupplierService }) {
  return { BusinessSupplierService };
}

export default connect(mapStateToProps)(Form.create()(AddStock));
