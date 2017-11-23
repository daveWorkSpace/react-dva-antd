import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { hashHistory } from 'dva/router';
import style from '../style.less'
import is from 'is_js';

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

//新路由解析
class SilderMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,               //antd自带展开收缩key
      mode: 'inline',                 //antd自带黑色或白色背景key
      headerNavShow: false,           //顶部菜单显示或隐藏状态
      current: '1',                   //默认菜单点击key
      openKeys: [],                   //一级菜单key
      selectedKeys: [],               //二级菜单key
      thirdSelectedKeys: [],          //三级菜单key
      thirdShow: false,               //显示三级菜单
      thirdParent: '',                //当前三级菜单的二级菜单（父级菜单）
      thirdChildren: [],              //三级菜单
      thirdIcon: false,               //三级icon
      colorClass: '',              //三级菜单对应颜色显示
    }

    this.private = {
      //用作历史记录
      openKeys: [],
    }
    //菜单栏点击事件
    this.handleClick = this.handleClick.bind(this);

    //antd方法
    this.onOpenChange = this.onOpenChange.bind(this);
    this.getAncestorKeys = this.getAncestorKeys.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.thirdOnSelect = this.thirdOnSelect.bind(this);

    //自定义触发菜单栏伸缩
    this.toggleCollapsible = this.toggleCollapsible.bind(this);
    //二级菜单点击弹出三级菜单
    this.handleThirdMenuClick = this.handleThirdMenuClick.bind(this);
    //三级菜单展开与依附侧边栏
    this.thirdChildrenShouOrHide = this.thirdChildrenShouOrHide.bind(this);
    //点击三级菜单时，收起一二级菜单
    this.collapsedThird = this.collapsedThird.bind(this);
  }

  //菜单栏点击事件
  handleClick(e) {
    this.setState({
      current: e.key,
    });
  }

  //自定义触发菜单栏伸缩
  toggleCollapsible() {
    !this.state.collapsed ? this.setState({
      collapsed: !this.state.collapsed,
      openKeys: [],
    }) : this.setState({
      collapsed: !this.state.collapsed,
      openKeys: this.private.openKeys,
    })

    //动画效果更流畅
    // !this.state.collapsed ? this.setState({
    //     openKeys: []
    // }, () => {
    //     this.setState({
    //         collapsed: !this.state.collapsed
    //     })
    // }) : this.setState({
    //     collapsed: !this.state.collapsed
    // }, () => {
    //     this.setState({
    //         openKeys: this.private.openKeys
    //     })
    // })
  }

  //点击三级菜单时，收起一二级菜单，无法与自定义触发菜单栏伸缩公用，需单独一个方法
  collapsedThird() {
    // !this.state.collapsed && this.setState({
    //   collapsed: true,
    //   openKeys: []
    // })
  }

  //SubMenu 展开/关闭的回调
  onOpenChange(openKeys) {
    //如果菜单栏为缩小状态，使其张开
    this.state.collapsed && this.setState({
      collapsed: !this.state.collapsed,
    })
    const state = this.state;
    const latestOpenKey = openKeys.find(key => !(state.openKeys.indexOf(key) > -1));
    const latestCloseKey = state.openKeys.find(key => !(openKeys.indexOf(key) > -1));

    let nextOpenKeys = [];
    if (latestOpenKey) {
      nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
    }
    if (latestCloseKey) {
      nextOpenKeys = this.getAncestorKeys(latestCloseKey);
    }
    this.setState({ openKeys: nextOpenKeys });
    this.private.openKeys = nextOpenKeys
  }

  getAncestorKeys(key) {
    const map = {
      sub3: ['sub2'],
    };
    return map[key] || [];
  }

  //被选中时回调函数
  onSelect(params) {
    this.setState({
      selectedKeys: params.selectedKeys,
    });
  }

  thirdOnSelect(params) {
    this.setState({
      thirdSelectedKeys: params.selectedKeys,
    });
  }

  //二级菜单点击弹出三级菜单
  handleThirdMenuClick(thirdParent, thirdChildren, colorClass) {
    // let flag = false;
    let [_thirdParent, _thirdChildren, _colorClass] = [thirdParent, thirdChildren, colorClass || '']

    //是否显示第三级菜单
    let isShowThirdMenu = false;
    if (_thirdChildren !== undefined && is.array(_thirdChildren)) {
      //遍历三级菜单内部元素，查看是否显示
      _thirdChildren.forEach((item, index) => {
        if (item.detail.isHide !== true) {
          isShowThirdMenu = true
        }
      })
    }

    //判断是否显示第三级菜单
    if (isShowThirdMenu === false) {
      [_thirdParent, _thirdChildren, _colorClass] = ['', [], '']
    } else {
      //拿到当前路由
      let flag = false;
      const { children } = this.props;
      const { location } = children ? children.props : {};
      const { pathname } = location || '';
      const _pathname = `/#${pathname}`;
      _thirdChildren.forEach((item, index) => {
        if (item.detail.path === _pathname) {
          flag = true
        }
      })

      if (flag === false) {
        this.setState({ thirdSelectedKeys: ['0'] })
      }
      //当有三级菜单时，收起一二级菜单
      // this.toggleCollapsible()
    }

    this.setState({
      thirdIcon: isShowThirdMenu,
      thirdShow: isShowThirdMenu,
      thirdParent: _thirdParent,
      thirdChildren: _thirdChildren,
      colorClass: _colorClass,
    })
  }

  //三级菜单展开与依附侧边栏
  thirdChildrenShouOrHide() {
    this.setState({ thirdShow: !this.state.thirdShow })
  }

  componentWillMount() {
    const { asideKeys, thirdContent } = this.props;
    if (asideKeys && asideKeys.length > 0) {
      let [_thirdParent, _thirdChildren, _colorClass] = ['', [], '']
      if (asideKeys.length > 2 && thirdContent.length > 0) {
        [_thirdParent, _thirdChildren, _colorClass] = [thirdContent[0], thirdContent[1], thirdContent[2] || '']
      }

      //是否显示第三级菜单
      let isShowThirdMenu = false;
      if (_thirdChildren !== undefined && is.array(_thirdChildren)) {
        //遍历三级菜单内部元素，查看是否显示
        _thirdChildren.forEach((item, index) => {
          if (item.detail.isHide !== true) {
            isShowThirdMenu = true
          }
        })
      }

      this.setState({
        thirdShow: isShowThirdMenu,
        thirdParent: _thirdParent,
        thirdChildren: _thirdChildren,
        thirdIcon: isShowThirdMenu,
        collapsed: false,
        openKeys: [asideKeys[0]],
        selectedKeys: [asideKeys[1]],
        thirdSelectedKeys: [asideKeys[2]],
        colorClass: _colorClass,
      }, () => {
        this.private.openKeys = [asideKeys[0]]
      })
    }
  }

  //次部分可与上部分融合放在 render 里面， 但为了生命周期更清楚，所以拆分
  componentWillReceiveProps(nextProps) {
    const { asideKeys, headerNavShow, thirdContent, headerMenuState, consolePlatFormState, closeHeaderMenuState } = nextProps;
    //点击控制台按钮触发
    if (consolePlatFormState) {
      this.setState({
        thirdShow: false,
        thirdParent: '',
        thirdChildren: [],
        thirdIcon: false,
        collapsed: false,
        openKeys: [],
        selectedKeys: [],
        colorClass: '',
      }, () => {
        this.private.openKeys = []
        // hashHistory.push('/#/console/platform')
      })
    } else {
      let [_thirdParent, _thirdChildren, _thirdShow, _thirdIcon, _colorClass] = ['', [], false, false, '']
      if (headerMenuState && !headerNavShow && asideKeys && asideKeys.length > 0) {
        if (asideKeys.length > 2 && thirdContent.length > 0) {
          [_thirdParent, _thirdChildren, _colorClass] = [thirdContent[0], thirdContent[1], thirdContent[2] || '']
        }

        //是否显示第三级菜单
        let isShowThirdMenu = false;
        if (_thirdChildren !== undefined && is.array(_thirdChildren)) {
          //遍历三级菜单内部元素，查看是否显示
          _thirdChildren.forEach((item, index) => {
            if (item.detail.isHide !== true) {
              isShowThirdMenu = true
            }
          })
        }
        _thirdShow = isShowThirdMenu;
        _thirdIcon = isShowThirdMenu;

        this.setState({
          thirdShow: _thirdShow,
          thirdParent: _thirdParent,
          thirdChildren: _thirdChildren,
          thirdIcon: _thirdIcon,
          collapsed: false,
          openKeys: [asideKeys[0]],
          selectedKeys: [asideKeys[1]],
          thirdSelectedKeys: [asideKeys[2]],
          colorClass: _colorClass,
        }, () => {
          this.private.openKeys = [asideKeys[0]]
          //关闭 headerMenu 状态
          // closeHeaderMenuState(false)
        })
      }
      if (asideKeys && asideKeys.length === 0) {
        this.setState({
          thirdShow: _thirdShow,
          thirdParent: _thirdParent,
          thirdChildren: _thirdChildren,
          thirdIcon: _thirdIcon,
          openKeys: [],
          selectedKeys: [],
          thirdSelectedKeys: [],
          colorClass: _colorClass,
        }, () => {
          this.private.openKeys = []
          //关闭 headerMenu 状态
          // closeHeaderMenuState(false)
        })
      }
    }
  }
  //组件更新完毕生命周期
  componentDidUpdate(prevProps, prevState) {
    const { headerMenuState, closeHeaderMenuState, consolePlatFormState, closeConsolePlatformState } = prevProps;
    //关闭 headerMenu 状态
    headerMenuState && closeHeaderMenuState(false)
    //控制台状态关闭
    consolePlatFormState && closeConsolePlatformState(false)
  }
  render() {
    // console.log(this.state.openKeys)
    const { AsideData } = this.props;
    const { thirdParent, thirdChildren } = this.state;
    //拿到当前路由
    const { children } = this.props;
    const { location } = children ? children.props : {};
    const { pathname } = location || '';
    const _pathname = `/#${pathname}`;

    //一级菜单的设置项目
    const topMenuProps = {
      mode: this.state.mode,
      theme: 'dark',
      onClick: this.handleClick,
      onSelect: this.onSelect,
      openKeys: this.state.openKeys,
      selectedKeys: this.state.selectedKeys,
      onOpenChange: this.onOpenChange,
    };

    return (
      <Layout className={style.menuBar}>

        {/* 侧边栏 */}
        <Sider trigger={null} collapsible defaultCollapsed collapsed={this.state.collapsed} className={style.menuSider} width={150}>

          {/* 切换一级菜单收起，展开的按钮 */}
          <div className={style.collapseButtom} onClick={this.toggleCollapsible}>
            <Icon className="trigger" type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
          </div>

          {/* 一级菜单 */}
          <Menu {...topMenuProps}>
            {
              AsideData.length > 0 && AsideData.map((_item, _index) => {
                //二级菜单
                const subItems = _item.routes.map((_subItem, _subIndex) => {
                  //获取当前页面路由
                  let flag = false;
                  _subItem.routes && _subItem.routes.map((item, index) => {
                    if (item.detail.path === _pathname) {
                      flag = true
                    }
                  })
                  if (!_subItem.detail.isHide) {
                    return (
                      <Menu.Item key={`${_index}_${_subIndex}`}>
                        {
                          //当不处于当前二级菜单栏下时，默认进入二级菜单第一级子菜单
                          !_subItem.routes
                            ? <a href={_subItem.detail.path} onClick={() => this.handleThirdMenuClick(_subItem.detail.title, _subItem.routes, _item.detail.colorClass)}>{_subItem.detail.title}</a>
                            : !flag
                              ? <a href={_subItem.routes[0].detail.path} onClick={() => this.handleThirdMenuClick(_subItem.detail.title, _subItem.routes, _item.detail.colorClass)}>{_subItem.detail.title}</a>
                              : <a onClick={() => this.handleThirdMenuClick(_subItem.detail.title, _subItem.routes, _item.detail.colorClass)}>{_subItem.detail.title}</a>
                        }
                      </Menu.Item>
                    );
                  }
                });

                //判断菜单是否被隐藏，如果没有被隐藏，则显示
                if (_item.detail.isHide !== true) {
                  //标题
                  const title = (
                    <span>
                      <Icon className={`${_item.detail.colorClass}Icon`} type={_item.detail.icon} />
                      <span className="title-text nav-text" > {_item.detail.title} </span>
                    </span>
                  )
                  return (
                    <SubMenu key={_index} className={`${_item.detail.colorClass}Bg`} title={title}>
                      {subItems}
                    </SubMenu>
                  );
                }
              })
            }
          </Menu>
        </Sider>

        {/* 多级功能菜单 */}
        {
          this.state.thirdShow ?
            <Content className={`${style.thirdChildren} ${this.state.colorClass}Third`}>
              <Menu mode="vertical" selectedKeys={this.state.thirdSelectedKeys} onSelect={this.thirdOnSelect}>
                <Menu.Item disabled className={style.subChildren}>{thirdParent}</Menu.Item>
                {
                thirdChildren.length > 0 && thirdChildren.map((item, index) => {
                  if (!item.detail.isHide) {
                    return (
                      <Menu.Item key={index}>
                        <a href={item.detail.path} onClick={this.collapsedThird}><Icon type="star-o" />{item.detail.title}</a>
                      </Menu.Item>
                    )
                  }
                })
              }
              </Menu>
            </Content> : ''
        }
        {
          (this.state.thirdShow || this.state.thirdIcon) && <div className={this.state.thirdShow ? `${style.thirdMenuDoor} ${style.close}` : `${style.thirdMenuDoor} ${style.open}`} onClick={this.thirdChildrenShouOrHide} />
        }
      </Layout>
    )
  }
}

export default SilderMenu;
