import React from 'react';
import { Alert, Layout, Icon, Menu } from 'antd';
import { connect } from 'dva';
import { dateFormat, prctoMinute } from '../../../utils/newUtils'

import LayoutHeader from '../header';
import HeaderMenu from '../header/menu'
import RenderMenu from '../silder/'
import Breadcrumb from '../components/breadcrumb';
import Guide from '../components/guide';

import style from '../style.less'

import { authorize } from '../../../application'

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const routes = authorize.routes;

const pageName = {
  edit: '编辑',
  add: '添加',
  detail: '详情',
  check: '审核',
  module: '详情模块',
  suppliers: '供应商信息',
  regionalList: '区域列表',
}

class AppLayout extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      mode: 'inline',
      headerMenuShow: false,
      //顶部菜单栏点击状态
      headerMenuState: false,
      //控制台点击状态
      consolePlatFormState: false,
      //账户中心状态
      accountState: false,

    }

    this.private = {
      fromHeaderClick: 1,             //来自顶部点击
      fromOtherClick: 2,              //来自其他点击
      notFormButton: -100,            //不是来自button点击
      fromButton: -200,               //来自button点击
      personalCenter: '个人中心',
      helpCenter: '帮助中心',
    }

    //决定顶部菜单展示与隐藏
    this.handleHeaderMenuShow = this.handleHeaderMenuShow.bind(this);
    //记录顶部菜单栏状态与侧边栏菜单联动
    this.formHeaderMenuTagA = this.formHeaderMenuTagA.bind(this);
    //传给菜单栏修改 headerMenu 状态的钩子
    this.closeHeaderMenuState = this.closeHeaderMenuState.bind(this);
    //点击控制台 修改菜单栏状态及页面跳转
    this.consolePlatform = this.consolePlatform.bind(this);
    //传递给 控制台点击 修改完 菜单栏状态后 及时重置 state 钩子
    this.closeConsolePlatformState = this.closeConsolePlatformState.bind(this);
    //传递给header钩子
    this.accountContentDisplay = this.accountContentDisplay.bind(this);
  }

  componentWillReceiveProps = (nextProps) => {
    const exceptionButtomState = window.sessionStorage && sessionStorage.getItem('simulateHeaderMenuState')
    if (exceptionButtomState) {
      this.setState({
        headerMenuState: true,
      }, () => {
        window.sessionStorage && sessionStorage.removeItem('simulateHeaderMenuState')
      })
    }
  }

  //决定顶部菜单展示与隐藏
  handleHeaderMenuShow(state, clickFlag, event) {
      //阻止冒泡，防止点击产品与服务图标穿透
    if (clickFlag === this.private.fromButton) {
      event && event.stopPropagation();
        // event && event.preventDefault();
    }
    if (state === this.private.fromHeaderClick) {
      this.setState({
        headerMenuShow: !this.state.headerMenuShow,
      })
    }
    if (state === this.private.fromOtherClick) {
      this.setState({
        headerMenuShow: false,
      })
    }
  }

  //关联顶部菜单栏状态
  formHeaderMenuTagA(state, path) {
      //隐藏顶部菜单栏
    this.handleHeaderMenuShow(this.private.fromHeaderClick)
    //记录来自headerMenu 的状态
    this.setState({
      headerMenuState: state,
    })
  }

  //传给菜单栏修改 headerMenu 状态的钩子
  closeHeaderMenuState(state) {
    this.setState({
      headerMenuState: state,
    })
  }

  //点击控制台回调函数
  consolePlatform(state) {
      //修改控制台状态钩子
    this.setState({
      consolePlatFormState: state,
    })
  }

  //传递给 控制台点击 修改完 菜单栏状态后 及时重置 state 钩子
  closeConsolePlatformState(state) {
    this.setState({
      consolePlatFormState: state,
    })
  }

  //传给header 显示隐藏 accountContent
  accountContentDisplay(state) {
    this.setState({
      accountState: state,
    })
  }

  render() {
    const { children } = this.props;
    const { history, location } = children ? children.props : {};
    const { pathname } = location || '';

    let breadcrumbColor = '';
    let [breadData, asideKeys, thirdContent, helpAsideKeys, personalAsideKeys] = [[], [], [], [], []];
    const [headerMenuShow, headerMenuState, closeHeaderMenuState, consolePlatFormState, closeConsolePlatformState] = [this.state.headerMenuShow, this.state.headerMenuState, this.closeHeaderMenuState, this.state.consolePlatFormState, this.closeConsolePlatformState];

    //拼凑路径 对比路径 (应该有更好的，暂时先凑活吧)
    const _pathArr = pathname ? pathname.split('/') : [];
    _pathArr[0] = '/#';
    let _last_page = null;
    // if (_pathArr.length === 5) {
    //   _last_page = page_name[_pathArr.pop()];
    // }

    //判断module路径的路由
    if (_pathArr[_pathArr.length - 1] === 'module' && _pathArr.length === 4) {
      _last_page = page_name[_pathArr.pop()];
    } if (_pathArr[_pathArr.length - 1] === 'module' && _pathArr.length === 4) {
      _last_page = page_name[_pathArr.pop()];
    }
    const _pathname = _pathArr.join('/');

    let _stop = false;
    //对比 并取出面包屑导航内容
    // 根据当前路由与路由配置文件表中的路由做比较，分别于一级二级三级路由比较
    for (const lv0 of routes) {
      if (_stop) {
        break;
      }

      for (const lv1 of lv0.routes) {
        if (lv1.routes) {
          for (const lv2 of lv1.routes) {
            if (lv2.detail.path === _pathname) {
              //面包屑颜色
              breadcrumbColor = lv0.detail.colorClass;
              lv0.active = true;
              lv1.active = true;
              lv2.active = true;

              _stop = true;
              // 获取菜单的索引值，做拼装用，三级菜单不是antd组件自带的，所以需要自己单租判断
              // 此处是为了记录路由打开的是哪一级菜单，定位焦点用
              const [lv0Index, lv1Index, lv2Index] = [routes.indexOf(lv0), lv0.routes.indexOf(lv1), lv1.routes.indexOf(lv2)];
              asideKeys.push(`${lv0Index}`, `${lv0Index}_${lv1Index}`, `${lv2Index}`);
              // 记录面包屑内容
              breadData.push(
                {
                  name: lv0.detail.title,
                  path: lv0.detail.path,
                },
                {
                  name: lv1.detail.title,
                  path: lv1.detail.path,
                },
                {
                  name: lv2.detail.title,
                  path: lv2.detail.path,
                },
              );
              // 记录三级菜单内容
              thirdContent.push(lv1.detail.title, lv1.routes, lv0.detail.colorClass)
              break;
            }
          }
        } else if (lv1.detail.path === _pathname) {
          //面包屑颜色
          breadcrumbColor = lv0.detail.colorClass;
          lv0.active = true;
          lv1.active = true;
          _stop = true;
          const [lv0Index, lv1Index] = [routes.indexOf(lv0), lv0.routes.indexOf(lv1)];
          asideKeys.push(`${lv0Index}`, `${lv0Index}_${lv1Index}`);
          //当前页面为帮助中心页面
          if (lv0.detail.title === this.private.helpCenter) {
            helpAsideKeys.push(`${lv1Index}`);
          }
          //当前页面为个人中心页面
          if (lv0.detail.title === this.private.personalCenter) {
            personalAsideKeys.push(`${lv1Index}`);
          }
          breadData.push(
            {
              name: lv0.detail.title,
              path: lv0.detail.path,
            },
            {
              name: lv1.detail.title,
              path: lv1.detail.path,
            },
          );
          break;
        }
      }

      //帮助中心和个人中心触发时侧边栏重置
      if (lv0.detail.isHide) {
        asideKeys = []
      }
    }
    if (_last_page) {
      breadData.push(_last_page);
    }

    const [collapse, mode] = [this.state.collapse, this.state.mode];

    if (authorize.account && !authorize.account.isOwnerAccount) {
      const _len = routes.length;
      if (routes[_len - 1].routes[0].title === '商户资料') {
        routes[_len - 1].routes.shift();
      }
    }

    //侧边栏高亮使用
    const AsideProps = { AsideData: routes, asideKeys, thirdContent, headerMenuShow, headerMenuState, closeHeaderMenuState, consolePlatFormState, closeConsolePlatformState, children };
    const rightTopAsideProps = { helpAsideKeys, personalAsideKeys }

    return (
      <Layout className="layout-wrapper">

        {/* 新手指南 */}
        <Guide />

        {/* 渲染系统通知栏 */}
        <LayoutHeader
          headerMenuShow={this.handleHeaderMenuShow}
          upOrDown={this.state.headerMenuShow}
          consolePlatform={this.consolePlatform}
          accountDisplay={this.accountContentDisplay}
          {...rightTopAsideProps}
        />

        {/* header菜单栏 */}
        <HeaderMenu
          displays={this.state.headerMenuShow}
          closeHeaderMenu={this.handleHeaderMenuShow}
          formHeaderMenuTagA={this.formHeaderMenuTagA}
        />

        {/* 主要内容 */}
        <Layout className="layout-container" >
          <RenderMenu {...AsideProps} />
          <Layout>
            <Breadcrumb data={breadData} color={breadcrumbColor} />
            <Content style={{ position: 'relative', backgroundColor: '#f7f7f7', height: '100%' }}>
              { this.props.children }
            </Content>
          </Layout>
        </Layout>
        <div className="layout-footer" />
      </Layout>
    );
  }
}

module.exports = AppLayout;
