import React, { Component, PropTypes } from 'react';
import { Breadcrumb, Icon } from 'antd';

class BreadcrumbComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }

    this.private = {

    }

    //点击面包屑时模拟为顶部菜单栏点击，可触发三级菜单栏变化
    this.handleClickToGo = this.handleClickToGo.bind(this);
  }

  handleClickToGo() {
    window.sessionStorage && sessionStorage.setItem('simulateHeaderMenuState', true)
  }

  render() {
    const _data = this.props.data.map((item, index) => {
      //如果名称为空，则不显示
      if (item.name === '') {
        return ''
      }

      if (item.path) {
        return <Breadcrumb.Item key={index}><a href={item.path} onClick={() => this.handleClickToGo()} className={`${this.props.color}Current` || ''}>{item.name}</a></Breadcrumb.Item>
      }
      return <Breadcrumb.Item key={index} className={`${this.props.color}Parent` || ''}>{item.name}</Breadcrumb.Item>

      //TODO:暂时屏蔽面包屑可点击
      // return <Breadcrumb.Item key={index}><a href={item.link}>{item.name}</a></Breadcrumb.Item>
    });

    return (
      <div className="con-breadcrumb">
        <Breadcrumb separator=">">
          <Breadcrumb.Item key="/"><Icon type="home" className={`${this.props.color}Parent` || ''} /></Breadcrumb.Item>
          {_data}
        </Breadcrumb>
      </div>
    );
  }
}

export default BreadcrumbComponent;
