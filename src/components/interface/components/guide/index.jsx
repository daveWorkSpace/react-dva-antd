import React from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import style from '../../style.less'
import { authorize } from '../../../../application'

class Guide extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      //隐藏遮罩
      hideShade: false,
      //记录菜单提示状态
      notition: 'notition1',
      //记录用户注册日期是否超过指定日期，默认没超过
      isOverCurrentDate: false,
      count: 1,   //记录提示信息进行到哪一步
    }
    this.private = {
      notitionTotalCount: 5,      //总提示数
      defaultDate: '2017-06-01',       //默认日期之前注册的用户显示引导指南，之后的用户不显示
    }
  }

  componentWillMount = () => {
    const userInfo = authorize.account;
    let [created_time, _default_time] = [0, 0];
    try {
      const created_at = userInfo.created_at && prctoMinute(userInfo.created_at, 0)
      created_time = created_at && (new Date(Date.parse(created_at.replace(/-/g, '/'))).valueOf()) / 1000;
      _default_time = (new Date(Date.parse(this.private.defaultDate.replace(/-/g, '/'))).valueOf()) / 1000;
    } catch (error) {
      created_time = 0;
      _default_time = 0;
    }
    //创建时间大于指定时间， 则不显示
    created_time > _default_time && this.setState({
      isOverCurrentDate: true,
    })
  }

  //菜单提示函数，判断图片显示先后顺序
  stepNext = () => {
    // 显示第几张图片
    const newCount = this.state.count + 1;
    // 是否隐藏遮罩
    const hideShade = newCount > this.private.notitionTotalCount;

    //设置永久缓存
    hideShade && window.localStorage && window.localStorage.setItem('iKown', true)
    this.setState({
      count: newCount,
      hideShade,
      notition: `notition${newCount}`,
    })
  }

  render() {
    const iKown = window.localStorage && window.localStorage.getItem('iKown');
    //图片样式在全局index.css里
    return (
      !this.state.isOverCurrentDate && !iKown && !this.state.hideShade && <div className={`${style.shadeNotition} shadeNotition`} >
        <div className={`${style.notition} ${this.state.notition}`} />
        <div className={style.iKown} onClick={this.stepNext} />
      </div>
    )
  }
}

module.exports = Guide;
