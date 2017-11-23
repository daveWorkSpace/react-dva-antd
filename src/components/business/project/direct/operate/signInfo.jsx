import React, { Component } from 'react';
import { connect } from 'dva';
import { Link, hashHistory } from 'dva/router';
import { Row, Col, Button } from 'antd';
import Storage from '../../../../../application/library/storage';
import { ProjectManage } from '../../../../actions';
import { ServiceDetailComponent } from '../../../service/detail/detail';

import style from '../../style.less';
//引入枚举值
import { AFFILIATE, PROJECT_COLUMNS } from '../../core/enumerate'

const { fetchContractServiceDetail } = ProjectManage;

class SignInfo extends Component {
  constructor(props) {
    super();

    //判断请求来源，如果来自历史查看，则不显示编辑按钮
    const from = props.location && props.location.query.from;
    let isShowEditButton = true;
    if (from === 'history') {
      isShowEditButton = false;
    }

    const { dispatch, ProjectManage } = props;
    this.state = {
      isShowEditButton,
      detail: ProjectManage.detail,                   //详情
      cityCode: ProjectManage.detail.cityCode,
    }
    this.private = {
      dispatch,
      location: props.location,
      storage: new Storage('direct', { useSession: true }),              //缓存实例
    }
    // 点击编辑按钮触发
    this.signEditHandle = this.signEditHandle.bind(this);
  }

  componentWillMount() {
    const { dispatch, storage } = this.private;
    const params = {
      contractId: storage.get('contract_id'),
    }
    dispatch({ type: fetchContractServiceDetail, payload: params })
  }

  componentWillReceiveProps(nextProps) {
    const { ProjectManage } = nextProps;
    const { detail, cityCode } = ProjectManage;
    this.setState({ detail, cityCode })
  }

  // 点击编辑按钮触发
  signEditHandle() {
    const { location } = this.private;
    const from = location && location.query.from;
    let url = '/business/project/direct/operate/sign/edit';
    if (from === 'history') {
      url = `${url}?from=${from}`
    }
    hashHistory.push(url)
  }

  renderEditButton = () => {
    const { signEditHandle } = this;
    const { isShowEditButton } = this.state;

    //判断是否显示编辑按钮
    if (isShowEditButton === false) {
      return (<span />)
    }

    return (
      <div className="bd-content">
        <div className="content">
          <Row>
            <Col span={24} style={{ textAlign: 'center' }}>
              <Button onClick={signEditHandle}>编辑</Button>
            </Col>
          </Row>
        </div>
      </div>
    )
  }

  render() {
    const { detail, cityCode } = this.state;
    const { renderEditButton } = this;
    return (
      <div className={`${style.component} rules-body con-body main-list`}>

        {/* 产品服务设置详情模块 */}
        <ServiceDetailComponent detail={detail} isShowRegionRule isShowContract />

        {/* 返回按钮 */}
        {renderEditButton()}
      </div>
    )
  }
}

function mapStateToProps({ ProjectManage }) {
  return { ProjectManage };
}
export default connect(mapStateToProps)(SignInfo);
