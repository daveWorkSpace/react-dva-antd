import React, { Component, PropTypes } from 'react';
import { Form, Input, Modal, Radio, message } from 'antd';
const [FormItem, RadioGroup] = [Form.Item, Radio.Group];

const reasons = [
  '身份证号与证件照号码不一致',
  '身份证正面照不清晰',
  '身份证反面照不清晰',
  '手持身份证照不清晰 ',
];

class ReassignModal extends Component {

  constructor() {
    super();
    this.state = {
      reason: '',
      reason2: '',
    };
  }

  handleChange = (e) => {
    this.setState({
      reason: e.target.value,
    });
  }

  handleTextChange = (e) => {
    this.setState({
      reason2: e.target.value,
    });
  }

  handleOk = (e) => {
    const { onOk, form } = this.props;
    const _reason = this.state.reason2;
    form.validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = { ...form.getFieldsValue() };
      if (data.reason === 4) {
        data.reason = _reason;
        if (data.reason.length === 0) {
          message.info('请填写驳回原因！')
          return;
        }
        data.reject_type = 5;
      } else {
        data.reject_type = reasons.indexOf(data.reason) + 1;
      }

      this.setState({
        reason: '',
        reason2: '',
      });
      onOk(data);
    });
  }

  render() {
    const { visible, onCancel, form } = this.props;
    const { getFieldDecorator } = form;

    const modalOpts = {
      title: '驳回原因',
      visible,
      onOk: this.handleOk,
      onCancel,
    };
    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 14,
      },
    };
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };


    return (
      <Modal {...modalOpts}>
        <Form layout="horizontal">
          <FormItem
            label="必选项："
            {...formItemLayout}
          >
            {
              getFieldDecorator('reason', {
                initialValue: this.state.reason || reasons[0],
                onChange: this.handleChange,
              })(
                <RadioGroup>
                  {
                      reasons.map((item, index) => {
                        return (<Radio style={radioStyle} key={item + index} value={item}>{item}</Radio>)
                      })
                    }

                  <Radio style={radioStyle} key="d" value={4}>
                      其他...
                      {this.state.reason === 4 ? <Input style={{ width: 240, marginLeft: 10 }} onChange={this.handleTextChange} /> : null}
                  </Radio>
                </RadioGroup>,
              )
            }
          </FormItem>

        </Form>
      </Modal>
    );
  }

}

ReassignModal.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

module.exports = Form.create()(ReassignModal);
