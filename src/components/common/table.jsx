import dot from 'dot-prop'
import React, { Component, PropTypes } from 'react';
import { Table } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { EXPOER_TABLE } from './enumerate.js';
// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

const { stateTransform, dateFormat, utcToDate, numberDateToStr } = window.tempAppTool;

class DayDownload extends Component {
    constructor(props) {
        super();
        this.state = {
            dataSource: props.dataSource,
        }
        this.private = {
            downloadFile: props.downloadFile,
        }
    }

    //update
    componentWillReceiveProps = (nextProps) => {
        this.setState({
            dataSource: nextProps.dataSource,
        });
    }

    // 下载统计文件
    downloadFile = (path) => {
        this.props.downloadFile(path);
    }

    //
    render() {
        const { downloadFile } = this;
        const { dataSource } = this.state;

        const pagination = {
            total: dot.get(dataSource, '_meta.result_count', 0),
            pageSize: 10,
            showTotal: (total) => {
                return `总共 ${total} 条`;
            },
            onShowSizeChange: (current, pageSize) => {
                // this.props.onShowSizeChange(current, pageSize);
            },
            // current: page,
            // onChangePage: (current) => {
            //   this.setState({
            //     page: current,
            //   }, () => {
            //     // 初始化请求，获取全部直营项目管理列表
            //     // fetchShipmentsList()
            //   })
            // },
        }

        return (
            <div className="bd-content">
                <div className="content">
                    <div style={{ color: 'orange' }}>备注：导出任务创建成功后，系统自动进行处理，处理完成即可从列表下载</div>
                    <Table
                        rowKey={(record, index) => { return index }}
                        columns={EXPOER_TABLE(downloadFile)}
                        dataSource={dataSource}
                        pagination={pagination}
                    />
                </div>
            </div>

        )
    }
}

module.exports = DayDownload;