import dot from 'dot-prop'
import React, { Component, PropTypes } from 'react';
import { Modal, Form, Select, Input, DatePicker, Row, Col } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import Search from '../search';
import Table from '../table';
import { authorize } from '../../../application';

import { CommonManage, OrderManage } from '../../actions.js';

// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
//const { stateTransform, dateFormat, utcToDate, numberDateToStr } = window.tempAppTool;
const [FormItem, Option, RangePicker] = [Form.Item, Select.Option, DatePicker.RangePicker];

const { getExportList, createExportList } = CommonManage;
const { getDownloadFileUrl } = OrderManage;
const { dateFormat, utcToDate } = window.tempAppTool;

class DayCommon extends Component {

    constructor(props) {
        super(props);
        this.state = {
            type: props.type ? props.type : '',   //区别父级页面
            modalVisible: false,                  //控制模态框显示
            dataSource: [],                        //table数据
            exportList: {
                data: [],
                _meta: {}
            }
        };
       
        this.private = {
            // startTime: `${dateFormat(Date.now()).join('-')} 00:00:00`,
            // endTime: `${dateFormat(Date.now()).join('-')} 23:59:00`,
            startTime: '',
            endTime: '',
            dispatch: props.dispatch,
            task_object: props.type ? props.type == 'vendorOrder' ? 'vendor_order' : 'shipment' : '',   // task_object任务对象
            org_id: authorize.vendor.id,        //服务商ID
            operator_id: authorize.account.id,    //操作ID
            search: {
                start_time: '',       // 导出时间 起始
                end_time: '',         // 导出时间 结束
                state: '',            // 导出状态
                time_type: '',        // 导出类型
            }
        }
    }
    //组件加载 
    componentWillMount() {
        // 根据 type 判断是订单明细下载  还是运力订单明细
        const { dispatch, task_object, org_id, startTime, endTime } = this.private;
        // 请求导出列表
        dispatch({
            type: getExportList,
            payload: {
                task_object,
                org_id,
            }
        });
    }

    componentWillReceiveProps = (nextProps) => {
        const { exportList } = nextProps.commonDownload;
        this.setState({
            type: nextProps.type ? nextProps.type : '',
            exportList,
        });
        // update 任务对象
        this.private = {
            task_object: nextProps.type ? nextProps.type == 'vendorOrder' ? 'vendor_order' : 'shipment' : '',   // task_object任务对象
        }
    }
    //检索
    searchHandle = (values) => {
        
        const { dispatch } = this.props;
        const { task_object, startTime, endTime} = this.private;
        const searchParams = {
            task_object,
            org_id: authorize.vendor.id,
            // operator_id: authorize.account.id,
        };
        if (values && values.exportState ){
            searchParams.state =  values.exportState;
        }
        if (values && values.exportType ){
            searchParams.time_type =  Number(values.exportType);
        }
        if (values && values.exportTime && values.exportTime.length === 2) {
            searchParams.start_time = moment(values.exportTime[0]).format('YYYY-MM-DD HH:mm:ss');
            searchParams.end_time = moment(values.exportTime[1]).format('YYYY-MM-DD HH:mm:ss');
        } else {
            this.private = {
                // startTime: `${dateFormat(Date.now()).join('-')} 00:00:00`,
                // endTime: `${dateFormat(Date.now()).join('-')} 23:59:00`,
                
            };
            searchParams.start_time = this.private.startTime;
            searchParams.end_time = this.private.endTime;
        }
        
        // 请求导出列表
        dispatch({
            type: getExportList,
            payload: searchParams,
        });
    }
    //导出
    onExport = (e) => {
        this.setState({
            modalVisible: true
        });
    }
    //创建导出任务
    onCreateExport = (values) => {
        const { dispatch } = this.props;   // 此时this指向dayCommon类
        const { task_object, org_id, operator_id } = this.private;
        const searchParams = {
            task_object,
            org_id: authorize.vendor.id,
            operator_id: authorize.account.id,
            time_type: Number(values.exportType),
        };

        if (values.exportTime && values.exportTime.length === 2) {
            searchParams.start_time = moment(values.exportTime[0]).format('YYYY-MM-DD HH:mm:ss');
            searchParams.end_time = moment(values.exportTime[1]).format('YYYY-MM-DD HH:mm:ss');
        };
        // 创建导出任务
        dispatch({
            type: createExportList,
            payload: searchParams
        });
    }

    // 确认事件
    handleOk = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }

            // 调用创建任务方法
            this.onCreateExport(values);
            this.setState({
                modalVisible: false
            });

        });
        this.props.form.resetFields();
    }
    // 取消事件
    handleCancel = () => {
        this.setState({
            modalVisible: false
        });
        this.props.form.resetFields();
    }

    //
    downloadFile = (path) => {
        const { dispatch } = this.props;
        const params = {
            filename: path,
        }
        dispatch({ type: getDownloadFileUrl, payload: params });
    }

    // 导出模态框
    renderExportComponent = () => {
        //样式
        const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } };
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal
                title="服务商订单导出"
                visible={this.state.modalVisible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                okText="确认"
                cancelText="取消"
                maskClosable = {false}
            >
                <Form layout="horizontal" className="main-form" >
                    <FormItem {...formItemLayout} label="类型:">
                        {getFieldDecorator('exportType', {
                            rules: [{ required: true, message: '请选择类型' }]
                        })(
                            <Select placeholder="请选择类型" style={{ width: 300, textAlign: 'center' }}>
                                <Option value="1">按创建时间</Option>
                                <Option value="2">按要求送达时间</Option>
                            </Select>
                            )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="时间段:">
                        {getFieldDecorator('exportTime', {
                            rules: [{ required: true, message: '请选择日期' }]
                        })(
                            <RangePicker showTime format="YYYY-MM-DD HH:mm"/>
                            )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }

    render() {
        const { searchHandle, onExport, renderExportComponent, downloadFile } = this;
        const { exportList } = this.state;

        const searchParams = {
            itemsType: 'itemsDownload',
            searchHandle,
            onExport
        }
        const tableParams = {
            dataSource: exportList && exportList.data,   //数据list
            downloadFile,                                //下载文件回调
        }

        return (
            <div className="con-body main-list">
                {/* 渲染标题 */}
                <Search {...searchParams} />
                {/* 渲染列表 */}
                <Table {...tableParams} />
                {/* 渲染导出模板 */}
                {renderExportComponent()}
            </div>
        )
    }
}
function mapStateToProps({ commonDownload }) {
    return { commonDownload };
}

module.exports = connect(mapStateToProps)(Form.create()(DayCommon));