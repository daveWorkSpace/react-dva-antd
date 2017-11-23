/**
 * Created by dave
 * 团队管理、团队列表引导模块
 */
import React, {Component, PropTypes} from 'react';
import {Form, Row, Col, Tree, Button, Checkbox, Icon, Select} from 'antd';
import style from '../style/courier.less';
const TreeNode = Tree.TreeNode;
/*团队模块*/
export default class TeamModel extends React.Component{
  constructor(props){
    super()
  }
  onSelect(info) {

  }
  render(){

    return(
      <div>
        <div>
          <div className={style.navLeftBorder}>
            <Row>
              <Col sm={12}>
                <b>团队</b>
              </Col>
              <Col sm={12} style={{textAlign:'right'}}>
                <b style={{color:'#00CFA1'}}><Icon type="plus-circle-o" style={{fontSize:20,fontWeight:700}}/></b>
              </Col>
            </Row>
          </div>
          <div className={style.navBottomBorder}></div>
          <Tree>
            <TreeNode title={`所有团队  (${number})`} key="0-0">
              {
                TreeList.map(function(item,index){
                  return(
                    <TreeNode title={`${item.name} (${item.num})`} key={index}></TreeNode>
                  )
                })
              }
            </TreeNode>
          </Tree>
        </div>
      </div>
    )

  }
}
