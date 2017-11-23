import React from 'react';
import { Form, Row, Col, Tooltip, Icon } from 'antd';

//默认的布局
const layout = { labelCol: { span: 3 }, wrapperCol: { span: 9 } };

class CoreForm extends React.Component {
  constructor(props) {
    super();
    this.state = {
      cols: props.cols ? props.cols : '1',              //列数
      layout: props.layout ? props.layout : layout,     //布局
      items: props.items ? props.items : [],            //详细item
    }
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      cols: nextProps.cols ? nextProps.cols : '1',              //列数
      layout: nextProps.layout ? nextProps.layout : layout,     //布局
      items: nextProps.items ? nextProps.items : [],            //详细item
    });
  }

  //渲染表单
  renderFormItems = (items, cols, defaultLayout) => {
    //判断，如果表单项目为空，则直接返回
    if (items.length <= 0) {
      return (<Row gutter={16}><Col span={24} /></Row>)
    }

    //表单项目
    const children = [];
    items.forEach((item, index, array) => {
      //label名称, 位置偏移
      const { label, hide } = item;

      //具体表单内容, 表单布局, 栅格左侧的间隔格数
      let { form, layout, span, offset } = item;

      //key值(如果label为空的时候，取随机值渲染)
      const key = (label !== undefined) ? index + label : index + Math.random();

      //判断form表单数据
      if (typeof form !== 'object') {
        form = <div />
      }

      //判断表单布局信息
      if (!layout) {
        layout = defaultLayout;
      }
      //当前列布局
      if (!span) {
        span = 24 / cols;
      }

      //栅格左侧的间隔格数
      if (!offset) {
        offset = 0
      }

      // 隐藏某项检索条件是否需要隐藏
      if (!hide) {
        children.push(
          <Col span={span} offset={offset} key={key}>
            <Form.Item {...layout} label={label}>
              {form}
            </Form.Item>
          </Col>,
        );
      }
      
    })
    return (
      <Row gutter={16}>
        {children}
      </Row>
    );
  }

  render() {
    const { items, title, titleTip, cols, layout } = this.state;

    //渲染的表单内容
    return this.renderFormItems(items, cols, layout);
  }

}

module.exports = CoreForm;
