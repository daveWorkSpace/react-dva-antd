import React, { Component, PropTypes } from 'react';
import { Layout, Row, Col, Menu, Dropdown, Button, Popover, Icon } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { authorize } from '../../../application'
import { Modules } from '../../../application/define'

import style from '../style.less'

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

class HeaderMenu extends Component {
  constructor() {
    super();
    this.private = {
      count: 5, //菜单栏5个一组
      fromOtherClick: 2,
      notfromButton: -100,
      //忽略菜单的隐藏设置
      whiteList: [
        Modules.document,           //帮助中心
        Modules.documentManual,     //新手指南
        Modules.documentBusiness,   //业务指南
        Modules.account,            //个人中心
        Modules.accountVendor,      //我的服务商
        Modules.accountMine,        //我的账号
      ],
    }
  }

  componentDidMount() {
    //获取顶部菜单栏dom元素
    const headerMenuDom = this.refs.headerMenu;
    //获取顶部 产品与服务 div dom元素
    const productAndService = document.querySelector('.productAndService')
    const productAndServiceIcon = document.querySelector('.productAndServiceIcon')

    //获取顶部菜单栏li标签dom元素
    const tagLiDom = headerMenuDom.childNodes[0].childNodes;
  // console.log(headerMenuDom.childNodes[0].childNodes[0].children[0])
    //添加点击事件，判断非顶部菜单栏模块则隐藏顶部菜单栏
    document.addEventListener('click', (e) => {
      let closeFlag = false;
      if (this.props.displays && e.target !== productAndService && e.target !== productAndServiceIcon) {
        if (e.target === headerMenuDom) {
          closeFlag = true
        } else {
          for (const i in tagLiDom) {
            if (e.target === tagLiDom[i] || (tagLiDom[i].childNodes && e.target === tagLiDom[i].childNodes[0])) {
              closeFlag = true
              return
            }
          }
        }
        !closeFlag && this.props.closeHeaderMenu(this.private.fromOtherClick, this.private.notfromButton, '')
      }
    }, false)
  }

  // 判断是否在白名单列表内
  inWhiteList = (moduleId) => {
    const { whiteList } = this.private;
    return whiteList.indexOf(moduleId) !== -1;
  }

  render() {
    const { formHeaderMenuTagA } = this.props;
    const { inWhiteList } = this;
    return (
      <div ref="headerMenu" className={this.props.displays ? `${style.hNavBox} ${style.menuShow}` : style.hNavBox}>
        <ul className={style.hHavUl}>
          {
            authorize.routes.map((item, index) => {
              if (item.detail.isHide === true && inWhiteList(item.id) === false) {
                return <li key={`none${item.id}`} style={{ display: 'none' }} />
              }
              let totalMenu = [];
              //汇总二级菜单与三级菜单，过滤暂时禁止显示的模块
              if (item.routes && item.routes.length > 0) {
                for (let i = 0, j = item.routes.length; i < j; i += 1) {
                  const subItem = item.routes[i];

                  //判断二级菜单，有子菜单的逻辑。
                  if (subItem && subItem.routes && (subItem.detail.isHide !== true || inWhiteList(subItem.id))) {
                    //三级菜单
                    const children = [];
                    for (let x = 0, y = subItem.routes.length; x < y; x += 1) {
                      const thirdItem = item.routes[i].routes[x];
                      //判断三级菜单是否显示的逻辑
                      if (thirdItem.detail.isHide !== true || inWhiteList(thirdItem.id)) {
                        children.push(thirdItem)
                      }
                    }

                    //判断，如果没有三级菜单，则显示二级菜单
                    if (children.length > 0) {
                      totalMenu = totalMenu.concat(children);
                    } else {
                      totalMenu.push(item.routes[i]);
                    }

                  //判断二级菜单，无子菜单的逻辑
                  } else if (subItem.detail.isHide !== true) {
                    totalMenu.push(item.routes[i])
                  }
                }
              }
              //5个一组，分组显示模块
              const boxCount = Math.ceil(totalMenu.length / this.private.count) || 0
              {/* 一维数组遍历 */}
              if (boxCount < 2) {
                return (
                  <li key={index}>
                    <div className={style.categories}>{ item.detail.title }</div>
                    <div className={`${style.subcategories} ${item.detail.colorClass}`}>
                      {
                        totalMenu.length > 0 ? totalMenu.map((it, index) => {
                          return (
                            <a href={it.detail.path} key={index} onClick={() => formHeaderMenuTagA(true, it.detail.path)} >{ it.detail.title }</a>
                          )
                        }) : ''
                      }
                    </div>
                  </li>
                )
              }
              const result = [];
              for (let i = 0, len = totalMenu.length; i < len; i += this.private.count) {
                result.push(totalMenu.slice(i, i + this.private.count));
              }
              {/* 二维数组遍历 */}
              return (
                <li key={index}>
                  <div className={style.categories}>{ item.detail.title }</div>
                  {
                      result.length > 0 ? result.map((sub, index) => {
                        return (
                          <div key={index} className={index === 0 ? (`${style.subcategories} ${item.detail.colorClass}`) : (`${style.subcategories} ${item.detail.colorClass} ${style.subright}`)}>
                            {
                              (sub && sub.length > 0) ? sub.map((third, index) => {
                                return (
                                  <a href={third.detail.path} key={index} onClick={() => formHeaderMenuTagA(true, third.detail.path)} >{ third.detail.title }</a>
                                )
                              }) : ''
                            }
                          </div>
                        )
                      }) : ''
                    }
                </li>
              )
            })
          }
        </ul>
      </div>
    );
  }
}

export default HeaderMenu;
