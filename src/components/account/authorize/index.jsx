import React from 'react';
import style from './style.less'
import LoginComponent from './login'
import AuthComponent from './auth'
import RegisterComponent from './register'
import { authorize } from '../../../application'

//模块内部路由
const AuthorizeRouter = {
  login: 'login',       //登陆
  auth: 'auth',         //验证
  register: 'register', //注册
}

class AuthorizeComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      childrenComponent: '',
    }

    this.private = {
      dispatch: props.dispatch,
    }
  }

  componentWillMount() {
    const { route } = this.props.params;

    this.setState({
      childrenComponent: this.renderComponentByRoute(route),
    })
  }

  componentWillReceiveProps = (nextProps) => {
    const { route } = nextProps.params;

    //如果当前在登陆页面，并且已经获取到登陆数据，则跳转到授权页面
    if (route === AuthorizeRouter.login && authorize.isAuth() === true) {
      nextProps.history.go('authorize/auth');
      return;
    }

    //如果当前在授权页面，并且没有获取到授权数据，则跳转到授权页面
    if (route === AuthorizeRouter.auth && authorize.isAuth() === false) {
      nextProps.history.go('authorize/login');
      return;
    }

    this.setState({
      childrenComponent: this.renderComponentByRoute(route),
    })
  }

  //根据路由获取模块
  renderComponentByRoute = (route) => {
    switch (route) {
      case AuthorizeRouter.register:
        return <RegisterComponent />

      case AuthorizeRouter.auth:
        return (<AuthComponent />)

      case AuthorizeRouter.login:
      default:
        return <LoginComponent />
    }
  }

  render() {
    const { childrenComponent } = this.state
    return (
      <div className="layout-wrapper">
        <div className={style.loginHeader}>
          <div className={style.inner} >
            <div className={style.left} > <span>工作平台</span> </div>
            <a className={style.right} href="https://aoaosong.com/">嗷嗷首页</a>
          </div>
        </div>

        {/* 子模块 */}
        { childrenComponent }

        <div className={style.loginFooter}>
          <div className={style.inner}>
            <ul className={style.left}>
              <li>
                <h4>产品</h4>
                <a href="//aoaosong.com/index.html#aoao-01">嗷嗷管家</a>
                <a href="//aoaosong.com/index.html#aoao-02">嗷嗷商家</a>
                <a href="//aoaosong.com/index.html#aoao-03">嗷嗷骑士</a>
              </li>
              <li>
                <h4>帮助</h4>
                <a href="//aoaosong.com/help.html">帮助文档</a>
                <a href="//aoaosong.com/help.html">常见问题</a>
                <a href="//aoaosong.com/help.html">视频教程</a>
              </li>
            </ul>
            <div className={style.right}>
              <p>北京欧客云科技有限公司旗下产品</p>
              <p>由o3cloud提供计算</p>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

module.exports = AuthorizeComponent;
