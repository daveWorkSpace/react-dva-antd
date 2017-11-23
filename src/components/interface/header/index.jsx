import dot from 'dot-prop'
import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Layout, Row, Col, Menu, Dropdown, Button, Popover, Icon, Badge } from 'antd';
import AraleQRCode from 'arale-qrcode';
import HeaderNotification from './notification'

import { AccountAuthorizeActions } from '../../../components/actions'
import { authorize, geography } from '../../../application'
import style from '../style.less'

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;
const MenuKeyForLogout = 'logout'

class LayoutHeader extends Component {
  constructor(props) {
    super(props);
    this.qrcodeState = false;

    this.state = {
      vendors: [],
      accountMenuState: false,      //
      showQrcode: false,            //显示二维码
      showHelpCenter: false,        //显示帮助中心
      showPersonal: false,          //显示个人中心
    }
    this.private = {
      dispatch: props.dispatch,
      fromHeaderClick: 1,             //劳资顶部点击
      fromButton: -200,              //来自button点击
      personalCenter: '个人中心',     //个人中心枚举值
      helpCenter: '帮助中心',         //帮助中心枚举值
      popHelp: 2,           //帮助中心
      popPersonal: 3,        //个人中心
    }
    this.logout = this.logout.bind(this);
    this.onVisibleChange = this.onVisibleChange.bind(this);
    this.handleHoverModifyBg = this.handleHoverModifyBg.bind(this);
    this.showQrcode = this.showQrcode.bind(this);
  }

  componentWillMount() {
    const { mobile } = authorize.auth;

    //获取授权列表
    this.private.dispatch({ type: AccountAuthorizeActions.fetchVendors, payload: { mobile } })
  }

  componentWillReceiveProps = (nextProps) => {
    const { vendors } = nextProps.AccountAuthorize;

    this.setState({
      vendors,
    })
  }

  onClickMenu = (e) => {
    const { key } = e
    //切换账户
    this.private.dispatch({
      type: AccountAuthorizeActions.auth,
      payload: { vendorId: key },
    })
  }

  onVisibleChange(visible) {
    this.setState({
      accountMenuState: visible,
    })
  }

  //退出系统
  logout = () => {
    authorize.clear();
    window.location.href = '/#/authorize/login';
  }

  //hover 效果， 数字可改为枚举
  handleHoverModifyBg(visible, state) {
    let stateName;
    if (state === this.private.popHelp) {
      this.setState({
        showHelpCenter: visible,
      })
    } else if (state === this.private.popPersonal) {
      this.setState({
        showPersonal: visible,
      })
    }
  }

  showQrcode(state) {
    const { businessPublic } = this.props;
    let qrcodeState = this.qrcodeState;
    let qrcode = null;
    if (businessPublic.apk_url) {
      qrcode = new AraleQRCode({
        text: businessPublic.apk_url,
        size: 140,
      });
    }

    if (document.querySelector('#aoao-app-qrcode') && qrcode) {
      const con_qrcode = document.querySelector('#aoao-app-qrcode');
      con_qrcode.innerHTML = null;
    }

    if (state && !qrcodeState) {
      const coe_qrcode = document.querySelector('#aoao-app-qrcode');
      qrcode.innerHTML = '';
      const andriod = document.createElement('p')
      andriod.setAttribute('class', 'qrcodeDesc')
      andriod.innerHTML = '骑士端（Android版）<br/> 请使用浏览器扫码下载'
      coe_qrcode.appendChild(qrcode);
      coe_qrcode.appendChild(andriod);
      qrcodeState = true;
    }
    this.setState({
      showQrcode: state,
    })
  }


  render() {
    const { vendors } = this.state
    const [menuVendors, helpCenterContentArr, personalContentArr] = [[], [], []];
    const { helpAsideKeys, personalAsideKeys } = this.props;

    //构建顶部其他导航主体
    authorize.routes.forEach((item, index) => {
      //帮助中心
      if (item.detail.title === this.private.helpCenter) {
        item.routes && item.routes.length > 0 && item.routes.map((it, index) => {
          if (!it.detail.isHide) {
            helpCenterContentArr.push(<Menu.Item key={index}><a href={it.detail.path} >{ it.detail.title }</a></Menu.Item>)
          }
        })
        return;
      }

      //个人中心
      if (item.detail.title === this.private.personalCenter) {
        item.routes && item.routes.length > 0 && item.routes.map((it, index) => {
          if (!it.detail.isHide) {
            personalContentArr.push(<Menu.Item key={index}><a href={it.detail.path} ><Icon type={it.detail.icon} />{ it.detail.title }</a></Menu.Item>)
          }
        })
      }
    })

    vendors.forEach((item, index, record) => {
      if (authorize.auth.vendorId === item.vendor_id) {
        menuVendors.push(<Menu.Item key={item.vendor_id} className={style.currentVendor} ><Icon type="check-circle-o" /> {item.vendor_name}</Menu.Item>)
      } else {
        menuVendors.push(<Menu.Item key={item.vendor_id}><Icon type="user" />{item.vendor_name}</Menu.Item>)
      }
    })

    //账户菜单
    const menu = (
      <div className="accountMenu">
        <Menu selectedKeys={personalAsideKeys} mode="horizontal">
          { personalContentArr }
        </Menu>

        <p className={style.switchoverVendor}>切换服务商</p>
        <Menu onClick={this.onClickMenu} className={style.accountMenu}>
          {menuVendors}
          <Menu.Divider />
        </Menu>
        <p onClick={this.logout} className={style.logout}>退出系统</p>
      </div>
    );

    //帮助中心
    const helpCenter = (
      <div>
        <Menu selectedKeys={helpAsideKeys} mode="vertical">
          { helpCenterContentArr }
        </Menu>
      </div>
    );

    const content = (<div style={{ width: '140px', heigth: '140px' }} id="aoao-app-qrcode" />);

    //获取用户信息
    const { name } = authorize.account;
    const vendorName = authorize.vendor.name;
    const cityName = dot.get(authorize.vendor, 'city.name');

    return (
      <Header className="layout-header" >
        <Row type="flex" align="middle" justify="end" style={{ height: '100%' }}>

          {/* 服务商信息 */}
          <div className={style.showVendor}>
            { vendorName } <span className={style.showCity}>（{ cityName }）</span>
          </div>

          {/* 菜单按钮 */}
          <Col span={10} className={style.headerCol}>
            <div className="layout-logo" />
            <ul className={style.headerContro}>
              {/*<li onClick={ () => this.props.consolePlatform(true) }>控制台</li>*/}
              <li className="productAndService" onClick={e => this.props.headerMenuShow(this.private.fromHeaderClick, this.private.fromButton, e)}>产品与服务&nbsp;<Icon className="productAndServiceIcon" type={this.props.upOrDown ? 'up' : 'down'} /></li>
            </ul>
          </Col>

          <Col span={14} className={`${style.headerCol} user-box`}>
            <ul className={style.headerContro}>

              {/* 系统通知 */}
              <HeaderNotification />

              {/* 二维码显示 */}
              <li className={this.state.showQrcode ? style.showBg : ''}>
                <Popover content={content} onVisibleChange={this.showQrcode} placement="bottom">
                  <div>软件下载</div>
                </Popover>
              </li>

              {/* 帮助中心 */}
              <li className={this.state.showHelpCenter ? style.showBg : ''}>
                <Popover content={helpCenter} placement="bottom" onVisibleChange={e => this.handleHoverModifyBg(e, this.private.popHelp)}>
                  <div>帮助中心</div>
                </Popover>
              </li>

              {/* 个人中心 */}
              <li className={this.state.showPersonal ? style.showBg : ''}>
                <Popover className="accountsPopover" content={menu} placement="bottomRight" onVisibleChange={e => this.handleHoverModifyBg(e, this.private.popPersonal)}>
                  <span className={style.personIcon} />
                  <span className={style.personName}>{ name }&nbsp;<Icon type={this.state.accountMenuState ? 'up' : 'down'} /></span>
                </Popover>
              </li>
            </ul>
          </Col>
        </Row>
      </Header>
    );
  }
}
function mapStateToProps({ businessPublic, AccountAuthorize }) {
  return { businessPublic, AccountAuthorize };
}

module.exports = connect(mapStateToProps)(LayoutHeader);
