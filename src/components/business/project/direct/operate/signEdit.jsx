import React, { Component } from 'react';
import { connect } from 'dva';
import { Link, hashHistory } from 'dva/router';
import { Row, Col, Button } from 'antd';
import Storage from '../../../../../application/library/storage';
import { ProjectManage } from '../../../../actions';
import { ServiceFormComponent } from '../../../service/core/form';
import style from '../../style.less';

//引入枚举值
import { AFFILIATE, PROJECT_COLUMNS } from '../../core/enumerate'

const { fetchContractServiceDetail, updateContractService, resetContractServiceCallback } = ProjectManage;

class SignEdit extends Component {
  constructor(props) {
    super(props);
    const { dispatch, ProjectManage } = props;
    this.state = {
      detail: ProjectManage.detail,                 //详情
      cityCode: ProjectManage.detail.cityCode,
    }
    this.private = {
      location: props.location,
      dispatch,
      storage: new Storage('direct', { useSession: true }),              //缓存实例
    }
    // 保存信息
    this.onSubmit = this.onSubmit.bind(this);
    // 返回签约信息页面
    this.onCancle = this.onCancle.bind(this);
  }

  componentWillMount() {
    const { dispatch, storage } = this.private;
    const contractId = storage.get('contract_id')
    dispatch({ type: fetchContractServiceDetail, payload: { contractId } })
  }

  componentWillReceiveProps = (nextProps) => {
    const { dispatch, storage } = this.private;
    const { ProjectManage } = nextProps
    this.setState({
      detail: ProjectManage.detail,
      cityCode: ProjectManage.detail.cityCode,
    });

    //更新数据成功
    if (ProjectManage.isUpdateContractServiceCallback === true) {
      console.log('更新成功');
      dispatch({ type: resetContractServiceCallback });
      hashHistory.goBack();
    }
  }

  // 保存信息
  onSubmit = (values) => {
    const { dispatch, storage } = this.private;
    const { cityCode } = this.state;
    const params = {
      contractId: storage.get('contract_id'),
      service: values,
      cityCode,
    }
    console.log('onSubmit Callback', params);
    dispatch({ type: updateContractService, payload: params })
  }

  // 返回签约信息页面
  onCancle = () => {
    console.log('onCancle Callback');
    const { dispatch, storage, location } = this.private;
    const data = {
      tab: '2',
    }
    storage.set(data)
    const from = location.query.from;
    let url = '/business/project/direct/operate';
    if (from === 'history') {
      url = `${url}?from=${from}`
    }
    hashHistory.push(url)
  }


  render() {
    const { onSubmit, onCancle } = this;
    const { detail } = this.state;
    return (
      <div className={`${style.component} rules-body con-body main-list`}>
        <ServiceFormComponent detail={detail} onSubmit={onSubmit} onCancle={onCancle} componentMode={'rule'} />
      </div>
    )
  }
}

function mapStateToProps({ ProjectManage }) {
  return { ProjectManage };
}
export default connect(mapStateToProps)(SignEdit);
