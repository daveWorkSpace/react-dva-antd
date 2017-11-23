import React from 'react';
import { Form, Row, Col, Tooltip, Icon } from 'antd';

class CoreContent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      title: props.title ? props.title : '',              //标题
      titleTip: props.titleTip ? props.titleTip : '',     //标题提示
      titleExt: props.titleExt ? props.titleExt : '',     //标题扩展栏
      children: props.children ? props.children : '',     //模块内容
      footer: props.footer ? props.footer : '',           //模块页脚
    }
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      title: nextProps.title ? nextProps.title : '',            //标题
      titleTip: nextProps.titleTip ? nextProps.titleTip : '',   //标题提示
      titleExt: nextProps.titleExt ? nextProps.titleExt : '',   //标题扩展栏
      children: nextProps.children ? nextProps.children : '',   //模块内容
      footer: nextProps.footer ? nextProps.footer : '',         //模块页脚
    });
  }

  renderHeader = () => {
    const { title, titleTip, titleExt } = this.state;

    //判断是否显示标题
    if (title.length <= 0) {
      return <div />
    }

    //渲染的标题提示
    let tipContent = '';
    if (titleTip !== '') {
      tipContent = (
        <Tooltip title={titleTip} arrowPointAtCenter>
          <Icon type="question-circle-o" className="tooltip" />
        </Tooltip>
      )
    }

    return (
      <div className="content-title">
        <Row type="flex" justify="space-around" align="middle">
          <Col span={12} className="left">{title}{tipContent} </Col>
          <Col span={12} className="right">{titleExt}</Col>
        </Row>
      </div>
    )
  }

  renderContent = () => {
    const { children } = this.state;
    return (
      <div className="content">
        {children}
      </div>
    )
  }

  renderFooter = () => {
    const { footer } = this.state;
    if (footer === '') {
      return <div />
    }
    return (
      <div className="content-footer">{footer}</div>
    )
  }

  render() {
    const { renderHeader, renderContent, renderFooter } = this;
    return (
      <div className="bd-content">
        {/* 渲染标题 */}
        { renderHeader() }
        {/* 渲染内容 */}
        { renderContent() }
        {/* 渲染页脚 */}
        { renderFooter() }
      </div>
    )
  }
}

module.exports = CoreContent;
