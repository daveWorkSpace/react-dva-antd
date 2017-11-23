import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col } from 'antd';
import { ProjectManage } from '../../../../actions';
import Storage from '../../../../../application/library/storage';
import Basic from '../../core/basic';
import Shop from '../../core/shop';
import style from '../../style.less';
//引入枚举值
import { AFFILIATE, PROJECT_COLUMNS } from '../../core/enumerate.js'

const {
  getSellerInfo,          //获取商户信息
  getSellerShopList,        //获取商户列表
} = ProjectManage;

class SellerInfo extends Component {
  constructor(props) {
    super(props);
    const { dispatch, ProjectManage } = props;
    this.state = {
      basicInfoData: ProjectManage.basicInfoData,         //基本信息
      shopList: ProjectManage.shopList,                    //店铺列表
    }
    this.private = {
      dispatch,
      storage: new Storage('direct', { useSession: true }),              //缓存实例
      basicTitle: '基本信息',
      shopTitle: '店铺信息',
      qualityTitle: '资质认证',
    }
  }

  componentWillMount() {
    const { storage } = this.private;
    const { dispatch } = this.private;
    const seller_id = storage.get('seller_id')
    const city_code = storage.get('city_code')
    dispatch({ type: getSellerInfo, payload: { seller_id } })
    dispatch({ type: getSellerShopList, payload: { seller_id, city_code } })
  }

  componentWillReceiveProps(nextProps) {
    const { ProjectManage } = nextProps;
    const {
      basicInfoData,
      shopList,
        } = ProjectManage;
    this.setState({ basicInfoData, shopList })
  }

  render() {
    const { basicInfoData, shopList } = this.state;
    const { basicTitle, shopTitle, qualityTitle } = this.private;
    const basicProps = {
      basicTitle,
      basicInfoData,
    }
    const shopProps = {
      shopTitle,
      shopList,
    }
    return (
      <div className={`${style.component} rules-body con-body main-list`}>
        {/* 基本信息 */}
        <Basic {...basicProps} />
        {/* 店铺信息 */}
        <Shop {...shopProps} />
        {/* 资质认证 */}
        <div className="bd-content">
          <div className="content-title">{qualityTitle}</div>
          <Row type="flex" justify="space-around">
            <Col>
              <h2>为保证其信息安全,隐藏其资质认证的信息!</h2>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ ProjectManage }) {
  return { ProjectManage };
}
export default connect(mapStateToProps)(SellerInfo);
