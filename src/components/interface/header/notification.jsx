// 菜单栏的系统通知控件
import React, { Component } from 'react';
import { connect } from 'dva';
import dot from 'dot-prop';
import Storage from '../../../application/library/storage.js'
import { Popover, Icon, Badge, Button, Row, Col } from 'antd';
import { authorize } from '../../../application';
import style from '../style.less'

class HeaderNotification extends Component {
  constructor(props) {
    super(props);
    // 获取当前用户的 isHideNotification,若没有isHideNotification，则标识重新登录的用户，显示版本控制。否则是已登录用户，不需显示版本控制
    // 点击关闭按钮，修改isHideNotification 状态为true；
    const storage = new Storage(`notificationState${authorize.account.id}`);   // 初始化storage
    const { systemNotification } = props.coreModule;

    //上一个阅读过的通知的时间
    const oldUpdateTime = storage.get(`notificationState${authorize.account.id}.updateTime`);
    //新通知的时间
    const newUpdateTime = dot.get(systemNotification, 'data.0.updated_at');
    // 是否显示通知信息
    let isShowNotification = false;
    // 判断是否有新的通知
    if (oldUpdateTime === undefined || newUpdateTime > oldUpdateTime) {
      isShowNotification = true;
    }

    this.state = {
      systemNotification, //系统通知数据
      isShowNotification, //判断通知浮层是否显示的变量，用于按钮背景样式的高亮
    }
    this.private = {
      storage,
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const { storage } = this.private;
    const { systemNotification } = nextProps.coreModule;

    //上一个阅读过的通知的时间
    const oldUpdateTime = storage.get(`notificationState${authorize.account.id}.updateTime`);
    //新通知的时间
    const newUpdateTime = dot.get(systemNotification, 'data.0.updated_at');
    // 是否显示通知信息
    let isShowNotification = false;
    // 判断是否有新的通知
    if (oldUpdateTime === undefined || newUpdateTime > oldUpdateTime) {
      isShowNotification = true;
    }

    this.setState({
      isShowNotification,
      systemNotification,
    });
  }

  // 关闭通知弹窗
  hideNotificationModal = () => {
    const { storage } = this.private;
    const { systemNotification } = this.state;
    this.setState({
      isShowNotification: false,
    })

    // 触发通知后保存当前版本更新时间
    const updateTime = dot.get(systemNotification, 'data.0.updated_at');
    storage.set(`notificationState${authorize.account.id}`, { updateTime })
  }

  //显示通知提示
  showNotificationModal = () => {
    this.setState({
      isShowNotification: true,
    })
  }

  //判断是否有通知内容
  hasNotificationContent = () => {
    const { systemNotification } = this.state;
    if (dot.get(systemNotification, 'data') !== undefined && systemNotification.data.length >= 1) {
      return true;
    }
    return false;
  }

  //渲染系统通知
  renderSystemNotification = () => {
    const { hasNotificationContent } = this;
    const { systemNotification, isShowNotification } = this.state;
    //默认通知内容
    let notificationTitle = '系统通知';
    let notificationContent = '暂无新内容';

    //如果有通知内容，则显示通知内容
    if (hasNotificationContent() === true) {
      const notification = systemNotification.data[0].content;
      const notificationDate = new Date(systemNotification.data[0].created_at * 1000).toLocaleString().replace(/\//g, '-')
      notificationTitle = systemNotification.data[0].title;
      notificationContent = `[${notificationDate}] ${notification}`;
    }

    //通知内容html
    const content = (
      <div className={style.notificationBox}>
        <Row type="flex" justify="space-between" className={style.notificationTitle}>
          <Col sm={22}>
            {notificationTitle}
          </Col>
          <Col sm={2} style={{ textAlign: 'right' }}>
            <Button size="small" shape="circle" icon="close" onClick={() => { this.hideNotificationModal() }} />
          </Col>
        </Row>
        <Row>
          <p className={style.notificationContent}>{notificationContent}</p>
        </Row>
      </div>
    )

    //通知栏icon按钮
    let icon = <Icon type="message" />
    if (hasNotificationContent() === true) {
      icon = <Badge dot><Icon type="message" /></Badge>
    }
    //弹窗
    return (
      <Popover
        content={content}
        placement="bottom"
        visible={isShowNotification}
        overlayStyle={{ width: '400px!important' }}
        onVisibleChange={e => this.showNotificationModal(e)}
        onClick={e => this.showNotificationModal(e)}
        onFocus={e => this.showNotificationModal(e)}
      >
        {icon}
      </Popover>
    )
  }

  render() {
    const { isShowNotification } = this.state;
    const { renderSystemNotification } = this;
    return (
      // 按钮背景高亮判断
      <li className={isShowNotification ? style.showBg : ''}>
        {/* 渲染系统通知 */}
        {renderSystemNotification()}
      </li>
    )
  }
}

function mapStateToProps({ coreModule }) {
  return { coreModule };
}

module.exports = connect(mapStateToProps)(HeaderNotification);
