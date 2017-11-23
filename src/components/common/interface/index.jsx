import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Form, Input, Row, Col, Button, Tooltip, Icon } from 'antd';
import { Search } from './components/search';

class IndexComponent extends React.Component {
  constructor(props) {
    super();
  }

  render() {
    return (
      <div className="con-body">

        {/* 无标题模块 */}
        <div className="bd-content">
          <div className="content">模块内容 content</div>
        </div>
        <br />

        {/* 带标题模块 */}
        <div className="bd-content">
          <div className="content-title">模块标题 content-title</div>
          <div className="content">模块内容 content</div>
          <div className="content">实现代码
            <pre>
              {`
                import React, { Component, PropTypes } from 'react';
                import { connect } from 'dva';

                class IndexComponent extends React.Component {
                  constructor(props) {
                    super();
                  }

                  render() {
                    return (
                      <div className="con-body">
                        <div className="bd-content">
                          <div className="content-title">模块标题 content-title</div>
                          <div className="content">模块内容 content</div>
                        </div>
                      </div>
                    )
                  }
                }
                function mapStateToProps() {
                  return {};
                }

                module.exports = connect(mapStateToProps)(IndexComponent);
              `}
            </pre>
          </div>

        </div>
        <br />

        {/* 带操作模块 */}
        <div className="bd-content">
          <div className="content-title">模块标题 content-title</div>
          <div className="content-operation">
            <Row gutter={40} type="flex" justify="space-around" align="middle">
              <Col span={12} className="left">左侧操作 布局span 12 </Col>
              <Col span={12} className="right">右侧操作 布局span 12</Col>
            </Row>
          </div>

          <div className="content-footer">
            <Row type="flex" justify="space-around" align="middle">
              <Col span={24} className="center">
                <Button>取消</Button>
                <Button type="primary" htmlType="submit">提交</Button>
              </Col>
            </Row>
          </div>

          <div className="content-footer">
            <Row type="flex" justify="space-around" align="middle">
              <Col span={24} className="right">
                <Button type="primary" htmlType="submit">搜索</Button>
                <Button onClick={this.onReset}>重置</Button>
                <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.onToggle}>
                更多选项 <Icon type="down" />
                </a>
              </Col>
            </Row>
          </div>

        </div>
        <br />

        {/* 带操作模块 */}
        <div className="bd-content">
          <div className="content-title">模块标题 content-title
            <Tooltip title="提示信息，用这个icon" arrowPointAtCenter>
              <Icon type="question-circle-o" className="tooltip" />
            </Tooltip>
          </div>
          <div className="content-operation">
            <Row gutter={16} type="flex" justify="space-around" align="middle">
              <Col span={12} className="left">左侧操作 布局span 12 </Col>
              <Col span={12} className="right">
                <Button type="primary">添加</Button>
                <Button>跳转</Button>
                <Tooltip placement="topRight" title="提示信息，用这个icon">
                  <Icon type="question-circle-o" className="tooltip" />
                </Tooltip>
              </Col>
            </Row>
          </div>
        </div>
        <br />

        {/* 带检索模块 */}
        <div className="bd-content">
          <div className="content-title">模块待重构完善</div>
          <div className="content"><Search /></div>
        </div>
        <div className="bd-content">
          <div className="content">模块内容 content</div>
        </div>
      </div>
    )
  }
}
function mapStateToProps() {
  return {};
}

module.exports = connect(mapStateToProps)(IndexComponent);
