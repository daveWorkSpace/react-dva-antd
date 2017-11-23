import React, { Component, PropTypes } from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import { Form, Row, Col, Input, Button, Checkbox, Icon, Select, DatePicker, Popover, Modal } from 'antd';
import { Link } from 'dva/router';
import { CoreContent, CoreSearch } from '../core'
import { BusinessType, ExportState } from '../../application/define';
import { CommonManage } from '../actions.js';
import style from './style.less';
//日期时间选择器格式
import moment from 'moment';
// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { fetchSellersList, clearSellersList } = CommonManage;
const [FormItem, Option, RangePicker, CheckboxGroup] = [Form.Item, Select.Option, DatePicker.RangePicker, Checkbox.Group];
const { dateFormat, utcToDate } = window.tempAppTool;

class Search extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sellersList: props.commonSellers.sellersList || [],         //商家名称列表
            areasList: props.commonAreas.areasList || [],               //区域列表
            isArea: props.isArea ? props.isArea : false,                //判断是否显示配送区域检索
            isMobile: props.isMobile ? props.isMobile : false,          //判断是否显示手机号检索 ,
            isOrgOrderId: props.isOrgOrderId ? props.isOrgOrderId : false,
            isShippmentTime: props.isShippmentTime ? props.isShippmentTime : false,
            isContractType: props.isContractType ? props.isContractType : false,
            isSellersId: props.isSellersId ? props.isSellersId : false,
            isOrdersState: props.isOrdersState ? props.isOrdersState : false,  // 是否显示订单状态
            isShowBtn: props.isShowBtn ? props.isShowBtn : false,       // 是否显示批量取消按钮
            itemsType: props.itemsType ? props.itemsType : '',          // 用于区分items

        }

        this.private = {
            dispatch: props.dispatch,
            fetchSellersList,
            clearSellersList,
            form: undefined,
            onExport: props.onExport,      //导出
            items: props.items ? props.items : undefined,   // 是否用已有items
            search: {
                orgOrderId: '',      //订单编号
                state: '',           //订单状态
                sellerId: '',        //商户ID
                contractType: '',    //签约类型
                areaId: '',          //区域ID
                courierMobile: '',   //骑士手机号
                exportTime:'',       //导出时间 
                exportType: '',      //导出时间类型
                exportState: '',     //导出文件状态
            }
        }

    }
    
    // update
    componentWillReceiveProps = (nextProps) => {

        this.setState({
            sellersList: nextProps.commonSellers.sellersList,
            areasList: nextProps.commonAreas.areasList,
            isArea: nextProps.isArea ? nextProps.isArea : false,          //判断是否显示区域检索
            isMobile: nextProps.isMobile ? nextProps.isMobile : false,   //判断是否显示手机号检索
            isOrgOrderId: nextProps.isOrgOrderId ? nextProps.isOrgOrderId : false,
            isShippmentTime: nextProps.isShippmentTime ? nextProps.isShippmentTime : false,
            isContractType: nextProps.isContractType ? nextProps.isContractType : false,
            isSellersId: nextProps.isSellersId ? nextProps.isSellersId : false,
            isShowBtn: nextProps.isShowBtn ? nextProps.isShowBtn : false,
            itemsType: nextProps.itemsType ? nextProps.itemsType : '',
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
        if(!type){
            return ;
        }
        dispatch({
            type: fetchSellersList,
            payload: { type: type }
        });
    }

    onSearch = (value) => {
        const searchParams = {
            orgOrderId: value.orgOrderId,         //订单编号
            state: value.state,                   //订单状态       *
            sellerId: value.sellerId,            //商户名称ID
            contractType: value.contractType,     //商户类型：直营or加盟
            areaId: value.areaId,
            courierMobile: value.courierMobile,
            exportTime: value.exportTime,
            exportType: value.exportType,          //导出时间类型
            exportState: value.exportState,        //导出文件状态   *
        };

        if (value.expect_delivery_time && value.expect_delivery_time.length === 2) {
            searchParams.startDate = moment(value.expect_delivery_time[0]).format('YYYYMMDD');
            searchParams.endDate = moment(value.expect_delivery_time[1]).format('YYYYMMDD');
        } 

        this.props.searchHandle(searchParams)
    };
    //
    onReset = () => {
        this.private.search = {
            orgOrderId: '',     //订单编号
            state: '',          //订单状态
            sellerId: '',
            areaId: '',
            exportType:'',
            exportTime:'',
            exportState:'',
            contractType:'',
            courierMobile:'',
        };
        // 刷新列表
        this.props.searchHandle();
    };

    onHookForm = (form) => {
        this.private.form = form;
    }

    //控制日期时间，超过今天不可选
    disabledDate(current) {
        return current && current.valueOf() > Date.now();
    }

    //组件卸载时清空商户列表
    componentWillUnmount=()=>{
        const { dispatch } = this.private;
        dispatch({
            type: clearSellersList
        });   
    }
    // 搜索功能
    render = () => {
        const { onSaveForm } = this;
        const { isCourierMobile, onExport } = this.private;
        const {
            sellersList,
            areasList,
            isMobile,
            isArea,
            isContractType,
            isOrgOrderId,
            isSellersId,
            isOrdersState,
            isShippmentTime,
            itemsType
        } = this.state;

        const itemsCommon = [

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
                    return form.getFieldDecorator('areaId')(
                        <Select showSearch placeholder="请选择区域名称" optionFilterProp="children">
                            {selectAreasChildren}
                        </Select>,
                    )
                },
            },
            {
                label: '商家类型',
                hide: isContractType,
                form: form => (form.getFieldDecorator('contractType', { initialValue: '全部' })(
                    <Select onSelect={this.onSelectContractType} >
                        <Select.Option value=''>全部</Select.Option>
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
                    if (dot.has(sellersList, 'data') && sellersList.data.length > 0) {
                        
                        sellersList.data.map((item, index) => {
                            selectSellersChildren.push(<Option key={`${item.id}-${index}`} value={item.id}> {item.name} </Option>);
                        })
                    }

                    return form.getFieldDecorator('sellerId')(
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
        ];
        const itmemsOrder = [
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
            },{
                label: '订单状态',
                hide: isOrdersState,
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
                label: '商家类型',
                hide: isContractType,
                form: form => (form.getFieldDecorator('contractType', { initialValue: '全部' })(
                    <Select onSelect={this.onSelectContractType} >
                        <Select.Option value=''>全部</Select.Option>
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
                    if (dot.has(sellersList, 'data') && sellersList.data.length > 0) {
                        
                        sellersList.data.map((item, index) => {
                            selectSellersChildren.push(<Option key={`${item.id}-${index}`} value={item.id}> {item.name} </Option>);
                        })
                    }

                    return form.getFieldDecorator('sellerId')(
                        <Select showSearch optionFilterProp="children" placeholder="请选择商家名称">
                            {selectSellersChildren}
                        </Select>,
                    )
                }
            }, 
        ]

        // initialValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
        const itemsDownload = [
            {
                label: '日期',
                form: form => (form.getFieldDecorator('exportTime')(
                    <RangePicker style={{ width:'200px'}} showTime format="YYYY-MM-DD" />,
                ))
            },
            {
                label: '类型',
                form: form => (form.getFieldDecorator('exportType')(
                    <Select placeholder='输入选择类型'> 
                        <Option value='1'>按创建时间</Option>
                        <Option value='2'>按期望送达时间</Option>
                    </Select>
                ))
            },
            {
                label: '状态',  // 待处理 处理中 已完成
                form: form => (form.getFieldDecorator('exportState',{
                    initialValue: ''
                })(
                    <Select>
                        <Option key="" value="">全部</Option>
                        <Option key={`${ExportState.pendding}`} value={`${ExportState.pendding}`}> 待处理</Option>
                        <Option key={`${ExportState.being}`}    value={`${ExportState.being}`}> 处理中</Option>
                        <Option key={`${ExportState.succes}`}   value={`${ExportState.succes}`}> 处理成功</Option>
                        <Option key={`${ExportState.fail}`}     value={`${ExportState.fail}`}> 处理失败</Option>
                    </Select>
                ))
            },
        ];

        // 组建不同的items
        let items = itemsCommon;
        // 明细下载search 
        if (itemsType == 'itemsDownload') {
            items = itemsDownload;
        }
        // 订单查询search 异常列表 search
        if( itemsType == 'itmemsOrder' || itemsType == 'itemsException'){
            items = itmemsOrder;
        }
        const props = {
            items,
            onReset: this.onReset,
            onSearch: this.onSearch,
            onHookForm: this.onHookForm,
            operations: (
                <div>
                    {
                        this.state.isShowBtn && <Button className={style.cancelButton} onClick={this.props.onHandleCloseOrder}>批量取消</Button>
                    }
                    {
                        (itemsType == 'itemsDownload') && <Button className={style.cancelButton} onClick={onExport}>导出</Button>
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
