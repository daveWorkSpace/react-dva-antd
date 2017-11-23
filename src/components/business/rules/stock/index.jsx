import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Form, Table, Row, Col, Button, Tooltip, Icon, Tag, Modal, Select, Input } from 'antd';
import { CoreForm, CoreContent, CoreSearch } from '../../../core'
import { BusinessStock } from '../../../actions';
import { ServiceState } from '../../../../application/define';

class IndexComponent extends React.Component {
  constructor(props) {
    super();
    const { list } = props.BusinessStock;
    const { areas } = props.BusinessArea;

    this.state = {
      list,     //仓库列表
      areas,    //当前用户的区域列表
      page: 1,
      size: 10,

      selectedCreateAreas: [],      //选择的创建区域
      selectedStockId: undefined,   //选择的仓库id
      filterAreaIds: [],            //需要过滤的区域id
      isCreateModalVisible: false,  //是否显示创建的弹窗
    }

    this.private = {
      dispatch: props.dispatch,
      search: {
        stockId: '',        //仓库id
        name: '',           //仓库名称
        state: ServiceState.on,          //仓库状态
        isInventory: '',    //是否有库存能力
        isDelivery: '',     //是否有配送能力
      },
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const { list, isCreatStockAreaCallback, isDeleteStockAreaCallback } = nextProps.BusinessStock;
    const { areas } = nextProps.BusinessArea;
    const { page, size } = this.state;

    this.setState({
      list,
      areas,
    });

    //判断如果操作成功，就刷新数据
    if (isCreatStockAreaCallback === true) {
      this.private.dispatch({ type: BusinessStock.resetCreateStockArea });
      this.private.dispatch({ type: BusinessStock.fetchDriectList, payload: { page, size } });
    }
    if (isDeleteStockAreaCallback === true) {
      this.private.dispatch({ type: BusinessStock.resetDeleteStockArea });
      this.private.dispatch({ type: BusinessStock.fetchDriectList, payload: { page, size } });
    }
  }

  //列表数据分页调用
  onChangeDriectList =(page, size) => {
    const { stockId, name, state, isInventory, isDelivery } = this.private.search;
    this.setState({ page, size });
    this.private.dispatch({ type: BusinessStock.fetchDriectList, payload: { stockId, name, state, isInventory, isDelivery, page, size } });
  }

  //显示创建仓库区域的弹窗
  onDisplayCreateModal = (stockId, areas) => {
    const areaIds = [];
    if (areas) {
      areas.forEach((area) => {
        areaIds.push(area.id);
      })
    }
    this.setState({
      isCreateModalVisible: true,
      selectedStockId: stockId,
      filterAreaIds: areaIds,
    })
  }

  //隐藏创建仓库区域的弹窗
  onHideCreateModal = () => {
    this.setState({
      isCreateModalVisible: false,
      selectedStockId: undefined,
      selectedCreateAreas: [],
      filterAreaIds: [],
    });
  }

  //删除仓库区域
  onDeleteStockArea = (e, stockId, areaId) => {
    const { dispatch } = this.private;
    e.preventDefault();

    Modal.confirm({
      title: '是否确认删除该区域?',
      content: '删除覆盖区域',
      onOk() {
        dispatch({ type: BusinessStock.deleteStockArea, payload: { stockId, areaIds: [areaId] } });
      },
      onCancel() {
        console.log('取消删除');
      },
    });
  }

  //创建仓库区域
  onCreateStockArea = () => {
    const { selectedStockId, selectedCreateAreas } = this.state;
    const payload = {
      stockId: selectedStockId,
      areaIds: selectedCreateAreas,
    }
    this.private.dispatch({ type: BusinessStock.createStockArea, payload });
    this.onHideCreateModal()
  }

  //选取创建区域
  onSelectCreateAreas = (areas) => {
    this.setState({ selectedCreateAreas: areas })
  }

  //查询
  onSearch = (params) => {
    const { stockId, name, state, isInventory, isDelivery } = params;

    //保存搜索项目，提供给分页检索使用
    this.private.search.stockId = stockId;
    this.private.search.name = name;
    this.private.search.state = state;

    this.private.search.isInventory = isInventory;
    this.private.search.isDelivery = isDelivery;

    this.onChangeDriectList();
  }

  //重置搜索查询
  onReset = () => {
    this.private.search = {
      stockId: '',        //仓库id
      name: '',           //仓库名称
      state: ServiceState.on,          //仓库状态
      isInventory: '',    //是否有库存能力
      isDelivery: '',     //是否有配送能力
    }

    this.onChangeDriectList();
  }

  //搜索功能
  renderSearch = () => {
    const { name, state, isInventory, isDelivery } = this.private.search;

    const items = [
      {
        label: '仓库ID',
        form: form => (form.getFieldDecorator('stockId')(<Input placeholder="仓库ID" />)),
      },
      {
        label: '仓库名称',
        form: form => (form.getFieldDecorator('name')(<Input placeholder="仓库名称" />)),
      },
      {
        label: '库房存储能力',
        form: form => (form.getFieldDecorator('isInventory', { initialValue: `${isInventory}` })(
          <Select>
            <Select.Option value="">全部</Select.Option>
            <Select.Option value="1">有</Select.Option>
            <Select.Option value="0">无</Select.Option>
          </Select>,
        )),
      },
      {
        label: '配送站能力',
        form: form => (form.getFieldDecorator('isDelivery', { initialValue: `${isDelivery}` })(
          <Select>
            <Select.Option value="">全部</Select.Option>
            <Select.Option value="1">有</Select.Option>
            <Select.Option value="0">无</Select.Option>
          </Select>,
        )),
      },
      {
        label: '仓库状态',
        form: form => (form.getFieldDecorator('state', { initialValue: `${state}` })(
          <Select>
            <Select.Option value="">全部</Select.Option>
            <Select.Option value={`${ServiceState.on}`}>{ServiceState.description(ServiceState.on)}</Select.Option>
            <Select.Option value={`${ServiceState.off}`}>{ServiceState.description(ServiceState.off)}</Select.Option>
          </Select>,
        )),
      },
    ];
    const props = {
      items,
      onReset: this.onReset,
      onSearch: this.onSearch,
    }

    return (
      <CoreContent>
        <CoreSearch {...props} />
      </CoreContent>
    )
  }

  //渲染选择的区域下拉列表
  renderSelectAreas = () => {
    const { filterAreaIds, selectedCreateAreas } = this.state;
    const { onSelectCreateAreas } = this;
    const { areas } = this.state;

    const children = [];
    const { data } = areas;
    if (data) {
      data.forEach((area, index, array) => {
        //判断，如果已经添加过了，则不显示在列表中
        if (filterAreaIds.indexOf(area.id) === -1 && area.serviceState.value === ServiceState.on) {
          const key = area.id + area.name + index;
          children.push(<Select.Option key={key} value={area.id}>{area.name}</Select.Option>);
        }
      })
    }
    return (
      <Select optionFilterProp="children" value={selectedCreateAreas} mode="multiple" style={{ width: '100%' }} placeholder="请选择区域" onChange={onSelectCreateAreas}>
        {children}
      </Select>
    )
  }

  //渲染创建区域的弹出窗
  renderCreateModal = () => {
    const { renderSelectAreas, onCreateStockArea, onHideCreateModal } = this;
    const formItem = [
      {
        label: '选择区域',
        layout: { labelCol: { span: 4 }, wrapperCol: { span: 18 } },
        form: renderSelectAreas(),
      },
    ]
    return (
      <Modal title="添加覆盖区域" visible={this.state.isCreateModalVisible} onOk={onCreateStockArea} onCancel={onHideCreateModal}>
        <CoreContent>
          <CoreForm items={formItem} />
        </CoreContent>
      </Modal>
    )
  }

  //渲染仓库规则列表
  renderList = () => {
    const { onDisplayCreateModal, onDeleteStockArea, onChangeDriectList } = this;
    const { list } = this.state;

    //渲染区域tag
    const renderAreasTags = (areas, stockInfo) => {
      const children = [];
      areas.forEach((area, index, array) => {
        const key = `tagKey${area.id}${area.name}${stockInfo.id}${Math.random()}`
        children.push(
          <Tag key={key} closable onClose={(e) => { onDeleteStockArea(e, stockInfo.id, area.id) }} id={area.id}>{area.name}</Tag>,
        )
      })
      return (
        <span>
          {children}
          <Button size="small" type="dashed" onClick={() => { onDisplayCreateModal(stockInfo.id, stockInfo.areas) }}>+</Button>
        </span>
      )
    }
    const tip = (
      <span>说明：<br />
      1.单个仓库可覆盖一个或多个配送区域 <br />
      2.区域从仓库规则中删除：<br />
      2.1】对应区域规则可关联仓库更新；<br />
      2.2】项目管理模块订单分单规则页对应区域关联仓库（配送站/库房）规则删除<br />
      </span>
    )

    const columns = [{
      title: '仓库ID',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '仓库名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '库房存储能力',
      dataIndex: 'isInventory.name',
      key: 'isInventory.name',
    }, {
      title: '配送站能力',
      dataIndex: 'isDelivery.name',
      key: 'isDelivery.name',
    }, {
      title: '仓库状态',
      dataIndex: 'serviceState.name',
      key: 'serviceState.name',
    }, {
      title: (
        <div>覆盖区域
        <Tooltip title={tip} arrowPointAtCenter>
          <Icon type="question-circle-o" className="tooltip" />
        </Tooltip>
        </div>
      ),
      dataIndex: 'areas',
      key: 'areas',
      render: renderAreasTags,
    }];

    //列表的分页配置
    const pagination = {
      current: list.page,
      pageSize: list.size,
      total: list.total,
      size: 'small',
      showTotal: () => {
        return `共 ${list.total} 条`
      },
      onChange: onChangeDriectList,
    };

    return (
      <div className="bd-content">
        <div className="content">
          <Table rowKey="id" columns={columns} dataSource={list.data} pagination={pagination} />
        </div>
      </div>
    )
  }

  render() {
    const { renderSearch, renderList, renderCreateModal } = this;
    return (
      <div className="con-body">
        {/* 渲染搜索 */}
        { renderSearch() }

        {/* 渲染列表 */}
        { renderList() }

        {/* 创建弹窗 */}
        { renderCreateModal() }
      </div>
    )
  }
}

function mapStateToProps({ BusinessStock, BusinessArea }) {
  return { BusinessStock, BusinessArea };
}

module.exports = connect(mapStateToProps)(IndexComponent);
