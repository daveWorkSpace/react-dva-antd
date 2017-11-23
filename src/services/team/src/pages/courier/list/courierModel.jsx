import React, {Component, PropTypes} from 'react';
import {Form, Row, Col, Tree, Button, Checkbox, Icon, Select} from 'antd';
import style from '../style/courier.less';
const TreeNode = Tree.TreeNode;
/*骑士模块*/
export default class CourierModel extends React.Component {
  constructor(props) {
    super()
  }

  onSelect(info) {

  }

  render() {
    let number = 66;
    return (
      <div>
        <div>
          <h4 className={style.navLeftBorder}><b>骑士</b></h4>
          <div className={style.navBottomBorder}></div>
          <Row>
            <Col sm={24}>
              <Tree>
                <TreeNode title={`所有骑士  (${number})`} key={`所有骑士`}></TreeNode>
                <TreeNode title={`待审核骑士  (${number})`} key={`待审核骑士`}></TreeNode>
              </Tree>
            </Col>
          </Row>
        </div>
      </div>
    )

  }
}


