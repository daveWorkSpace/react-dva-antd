import React,{Component,PropTypes} from 'react';
import { Form, Input, Modal, Radio } from 'antd';
const [FormItem,RadioGroup] = [Form.Item,Radio.Group];


class ReassignModal extends Component {

  constructor() {
    super();
// 内部state的设置
    this.state = {
      reason: '原骑士不顺路',//选择的原因 默认的是原骑士不顺路
      reason_ex: '',//手动输入的原因
    };
  }
// 切换选择的原因
  handleChange = (e) => {
    this.setState({
      reason: e.target.value,
    });
  }
// 获取手动输入的原因
  handleTextChange = (e) => {
    this.setState({
      reason_ex: e.target.value,
    });
  }

  // 弹出框的确认操作
  handleOk = (e) => {
    const {onOk} = this.props;
    const {reason, reason_ex} = this.state;
    const _reason = reason === 4 ? reason_ex : reason;
    this.setState({
      reason: '原骑士不顺路',
      reason_ex: '',
    });
    onOk(_reason);
  }

  render() {
// 从props里面获取信息
    const { onCancel, form, visible, onOk, selectedLen, curr_courier} = this.props;
    // 从this里面获取信息
    const {handleOk, handleChange, handleTextChange} = this;
    // 弹出框的配置 参数参考ant-design
    const modalOpts = {
      title: '改派',
      visible,
      onOk: handleOk,
      onCancel,
    };
// 布局配置参数
    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 14
      }
    };
// 按钮样式
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };

    const reasons = [
      '原骑士不顺路',
      '原骑士单多，忙不过来',
      '原骑士车没电了/车坏了',
      '原骑士手机没电了',
    ];

    return (
      <Modal {...modalOpts}>

        <Form layout="horizontal">
          <FormItem >
            <p>改派{selectedLen}单给骑士{curr_courier.name}吗</p>
            <p>注：改派后将通知商家，请勿频繁改派，避免顾客投诉</p>
          </FormItem>
          <FormItem
            label="姓名："
            hasFeedback
            {...formItemLayout}
          >
            <RadioGroup  onChange={handleChange} defaultValue={this.state.reason}>
              {
                reasons.map( (item,index) => {
                  return (<Radio style={radioStyle} key={item + index} value={item}>{item}</Radio>)
                })
              }

              <Radio style={radioStyle} key="d" value={4}>
                其他...
                {this.state.reason === 4 ? <Input style={{ width: 240, marginLeft: 10 }}  onChange={handleTextChange} /> : null}
              </Radio>
            </RadioGroup>
          </FormItem>

        </Form>
      </Modal>
    );
  }

};

ReassignModal.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

module.exports = Form.create()(ReassignModal);
