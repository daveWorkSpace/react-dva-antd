import React, { Component, PropTypes } from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import { Form, Row, Col, Input, Button, Checkbox, Icon, Select, DatePicker, Popover, Modal } from 'antd';
import { Link } from 'dva/router';
import moment from 'moment';
import { CoreContent, CoreSearch } from '../../core'
import { BusinessType } from '../../../application/define';
import { CommonManage } from '../../actions.js';
import style from './style.less';

const { fetchSellersList, clearSellersList } = CommonManage;
const [FormItem, Option, RangePicker, CheckboxGroup] = [Form.Item, Select.Option, DatePicker.RangePicker, Checkbox.Group];

class Search extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sellersList: props.commonSellers.sellersList,
            areasList: props.commonAreas.areasList,
            isArea: props.isArea ? props.isArea : false,          //判断是否显示配送区域检索
            isMobile: props.isMobile ? props.isMobile : false,    //判断是否显示手机号检索 ,
            isOrgOrderId: props.isOrgOrderId ? props.isOrgOrderId : false, 
            isShippmentTime: props.isShippmentTime ? props.isShippmentTime : false,
            isContractType: props.isContractType ? props.isContractType : false,
            isSellersId: props.isSellersId ? props.isSellersId: false,
            isShowBtn: props.isShowBtn ? props.isShowBtn : false,
        }

        this.private = {
            dispatch: props.dispatch,
            fetchSellersList,
            clearSellersList,
            form: undefined,
            searchHandle: props.onSearch,
            items: props.items ? props.items : undefined,   // 是否用已有items
            search: {
                orgOrderId: '',      //订单编号
                state: '',           //订单状态
                sellerId: '',        //商户ID
                contractType: '',    //签约类型
                areaId: '',          //区域ID
                courierMobile: '',
            }
        }

    }

    // 
    componentWillReceiveProps = (nextProps) => {

        this.setState({
            sellersList: nextProps.commonSellers.sellersList,
            areasList: nextProps.commonAreas.areasList,
            isArea: nextProps.isArea ? nextProps.isArea : false,          //判断是否显示区域检索
            isMobile: nextProps.isMobile ? nextProps.isMobile : false,   //判断是否显示手机号检索
            isOrgOrderId: nextProps.isOrgOrderId ? nextProps.isOrgOrderId : false, 
            isShippmentTime: nextProps.isShippmentTime ? nextProps.isShippmentTime : false,
            isContractType: nextProps.isContractType ? nextProps.isContractType : false,
            isSellersId: nextProps.isSellersId ? nextProps.isSellersId: false,
            isShowBtn: nextProps.isShowBtn ? nextProps.isShowBtn : false,
        });
    }

    //商家類型
    onSelectContractType = (type) => {
        const { form } = this.private;
        const { dispatch, fetchSellersList, clearSellersList } = this.private;

        //重置商家
        form.resetFields(['seller_id'])

        dispatch({
            type: clearSellersList
        });
        dispatch({
            type: fetchSellersList,
            payload: { type: type }
        });
    }

    onSearch = (value) => {
        // const { sellerNo, sellerName } = this.private.search;
        const searchParams = {
            orgOrderId: value.orgOrderId,    //订单编号
            state: value.state,              //订单状态
            sellerId: value.seller_id,        //商户名称ID
            contractType: value.contractType,    //商户类型：直营or加盟
            areaId: value.area_id,
            courierMobile: value.courier_mobile,
        };
        if (value.expect_delivery_time && value.expect_delivery_time.length === 2) {
            searchParams.startDate = moment(value.expect_delivery_time[0]).format('YYYYMMDD');
            searchParams.endDate = moment(value.expect_delivery_time[1]).format('YYYYMMDD');
        }
        this.private.searchHandle(searchParams)
    };
    //
    onReset = () => {
        this.private.search = {
            orgOrderId: '',     //订单编号
            state: '',          //订单状态
            sellerId: '',
            areaId: '',
        };
        // 刷新列表
        this.private.searchHandle();
    };

    onHookForm = (form) => {
        this.private.form = form;
    }

    //控制日期时间，超过今天不可选
    disabledDate(current) {
        return current && current.valueOf() > Date.now();
    }
    // 搜索功能
    render = () => {
        const { onSaveForm } = this;
        const { renderCloseOrder, isCourierMobile } = this.private;
        const {
            sellersList,
            areasList,
            isMobile,
            isArea,
            isContractType,
            isOrgOrderId,
            isSellersId,
            isShippmentTime,
        
        } = this.state;

        const items = [

            {
                label: '订单编号',
                hide: isOrgOrderId,
                form: form => (form.getFieldDecorator('orgOrderId')(<Input placeholder='请输入订单编号' />)),
            },

            {
                label: '期望送达时间',
                hide: isShippmentTime,
                form: form => (form.getFieldDecorator('expect_delivery_time', {
                    format: 'YYYY-MM-DD HH:mm',
                })(
                    <RangePicker />,
                ))
            },
            {
                label: '配送区域',
                hide: isArea,
                form: form => {
                    // 
                    let selectAreasChildren = [];
                    if (areasList && areasList.length > 0) {
                        areasList.map((item, index) => {
                            selectAreasChildren.push(<Option key={`${item.id}${index}`} value={item.id}> {item.name} </Option>);
                        })
                    }
                    return form.getFieldDecorator('area_id')(
                        <Select showSearch placeholder="请选择区域名称" optionFilterProp="children">
                            {selectAreasChildren}
                        </Select>,
                    )
                },
            },
            {
                label: '商家类型',
                hide: isContractType,
                form: form => (form.getFieldDecorator('contractType', { initialValue: `${BusinessType.driect}` })(
                    <Select onSelect={this.onSelectContractType} >
                        <Select.Option value={`${BusinessType.driect}`}>{BusinessType.description(BusinessType.driect)}</Select.Option>
                        <Select.Option value={`${BusinessType.affiliate}`}>{BusinessType.description(BusinessType.affiliate)}</Select.Option>
                    </Select>,
                )),
            }, {
                label: '商家名称',
                hide: isSellersId,
                form: form => {
                    // 
                    let selectSellersChildren = [];
                    if (dot.has(this.state.sellersList, 'data') && this.state.sellersList.data.length > 0) {
                        sellersList.data.map((item, index) => {
                            selectSellersChildren.push(<Option key={`${item.id}${index}`} value={item.id}> {item.name} </Option>);
                        })
                    }

                    return form.getFieldDecorator('seller_id')(
                        <Select showSearch optionFilterProp="children" placeholder="请选择商家名称">
                            {selectSellersChildren}
                        </Select>,
                    )
                }
            }, {
                label: '订单状态',
                form: form => (form.getFieldDecorator('state', { initialValue: '' })(
                    <Select showSearch optionFilterProp="children" placeholder="请选择订单状态" >
                        <Option key="delivery_state_0" value="">全部</Option>
                        <Option key="delivery_state_1" value="1">已创建</Option>
                        <Option key="delivery_state_2" value="25">已确认</Option>
                        <Option key="delivery_state_3" value="50">配送中</Option>
                        <Option key="delivery_state_4" value="100">已完成</Option>
                        <Option key="delivery_state_5" value="-100">已关闭</Option>
                        <Option key="delivery_state_6" value="-50">异常</Option>
                        <Option key="delivery_state_8" value="1|25|50|-50">未完成</Option>
                    </Select>,
                )),
            },
            {
                label: '骑士手机号',
                hide: isMobile,
                form: form => (form.getFieldDecorator('courier_mobile')(<Input placeholder='输入骑士手机' />, ))
            },


        ]

        const props = {
            items,
            onReset: this.onReset,
            onSearch: this.onSearch,
            onHookForm: this.onHookForm,
            operations: (
                <div>
                   {
                    this.state.isShowBtn && <Button className={style.cancelButton} onClick={renderCloseOrder}>批量取消</Button>
                   }
                </div>
            ),
        }
        return (
            <CoreContent>
                <CoreSearch {...props} />
            </CoreContent>
        )
    }
}

function mapStateToProps({ commonSellers, commonAreas }) {
    return { commonSellers, commonAreas };
}

module.exports = connect(mapStateToProps)(Search);
