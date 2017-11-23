import React, { Component } from 'react';
import { Modal, Form, Input, Select, Button, Icon } from 'antd';
import { Modules } from '../../../../application/define';

const [FormItem, Option, InputGroup] = [Form.Item, Select.Option, Input.Group];

class UserEditModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      parentName: props.parentName,
      parentId: props.parentId,
      cityCode: props.cityCode,
      cityName: props.cityName,
      children: props.children,
      type: props.type,
    };
  }

  //监听state变化
  componentWillReceiveProps = (nextProps) => {
    this.setState({
      parentName: nextProps.parentName,
      parentId: nextProps.parentId,
      cityCode: nextProps.cityCode,
      cityName: nextProps.cityName,
      children: nextProps.children,
      type: nextProps.type,
    });
  }

  //显示弹窗
  showModelHandler = (e) => {
    if (e) e.stopPropagation();
    this.setState({
      visible: true,
    });
  };

  //隐藏弹窗
  hideModelHandler = () => {
    this.setState({
      visible: false,
    });
  };

  //数据提交
  okHandler = () => {
    const { onOk } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        onOk(values);
        this.hideModelHandler();
      }
    });
  };

  onRedrictToAreaMap = () => {
    window.location.href = Modules.getPath(Modules.businessAreaMap);
  }

  //渲染页面模块
  render() {
    const { getFieldDecorator } = this.props.form;
    const { parentName, parentId, cityCode, cityName, children, type } = this.state;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <span>
        {/* 全部区域的入口 */}
        {
          type !== 'subArea' ?
            <span onClick={this.onRedrictToAreaMap}>
              <Button size="small" type="dashed" style={{ color: '#00CFA1' }} ><Icon type="global" /></Button>
            </span> : ''
        }

        <span onClick={this.showModelHandler}>
          { children }
        </span>
        {/* 渲染添加区域弹窗 */}
        <Modal title="添加区域" visible={this.state.visible} onOk={this.okHandler} onCancel={this.hideModelHandler}>
          <Form layout="horizontal" className="main-form" onSubmit={this.okHandler}>

            <FormItem {...formItemLayout} label="城市">
              {cityName}
              {
                getFieldDecorator('cityCode', { initialValue: cityCode })(
                  <Input type="hidden" />,
                )
              }
            </FormItem>

            <FormItem {...formItemLayout} label="父区域名称" >
              {
                //判断是否是子区域，如果是子区域则只显示父区域名称
                type === 'subArea' ? parentName
                : getFieldDecorator('areaName', { initialValue: '' })(
                  <Input placeholder="请输入区域名称" />,
                )
              }
            </FormItem>

            {
              //判断是否是子区域，如果是子区域则显示
              type === 'subArea' ? <div>
                <FormItem {...formItemLayout} label="子区域名称" >
                  {
                      getFieldDecorator('areaName', { initialValue: '' })(
                        <Input placeholder="请输入子区域名称" />,
                      )
                    }
                </FormItem>
                <div style={{ position: 'absolute' }}>
                  <FormItem>
                    {
                        getFieldDecorator('parentId', { initialValue: parentId })(
                          <Input type="hidden" />,
                        )
                      }
                  </FormItem>
                </div>
              </div>
                : ''
            }
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(UserEditModal);
