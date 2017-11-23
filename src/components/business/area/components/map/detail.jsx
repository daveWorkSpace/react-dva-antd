import React from 'react';
import { Row, Col, Form, Button, Table, Radio, Breadcrumb, Popover, Icon } from 'antd';
import { AreaState } from '../../exports'
import style from '../style.less'
import { geography } from '../../../../../application'

const [FormItem, BreadcrumbItem] = [Form.Item, Breadcrumb.Item];
const citesDict = geography.city;

class MapDetailComponent extends React.Component {

  constructor(props) {
    super();

    this.state = {
      cityCode: props.cityCode,
      cityName: props.cityName,
      areaDetail: props.areaDetail,
      isShowEdit: props.isShowEdit,
    }

    this.private = {
      onClickAreaEdit: props.onClickAreaEdit,
    }
  }

  componentDidMount() {
    const { cityName } = this.state;

    //初始化地图
    this.private.mapObject = new BMap.Map('map', { enableMapClick: false });

    // 添加缩放控件
    this.private.mapObject.addControl(new BMap.NavigationControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT }))
    this.loadMapComponent();
  }

  componentWillReceiveProps(nextProps) {
    this.state = {
      cityCode: nextProps.cityCode,
      cityName: nextProps.cityName,
      areaDetail: nextProps.areaDetail,
      isShowEdit: nextProps.isShowEdit,
    }
    this.loadMapComponent();
  }

  //加载地图模块
  loadMapComponent = () => {
    const { loadMapComponentPolygon, loadMapCoordinates } = this;
    const { mapObject } = this.private
    const { cityName, cityCode, areaDetail } = this.state;
    const { region_info } = areaDetail;
    let isCenterAndZoom = false;

    //清理绘制区域
    mapObject.clearOverlays();

    //如果没有数据则直接返回
    if (!region_info && !areaDetail.parent_area) {
      //修复区域数据为空时，地图定位问题（百度地图bug）
      if (areaDetail !== undefined && areaDetail.id) {
        mapObject.centerAndZoom(cityName, 14);
      }
      return;
    }

    //定位地图中心
    if (region_info) {
      if (region_info.bd_polygon.coordinates.length) {
        if (region_info.bd_polygon.coordinates[0].length) {
          const firstPoint = region_info.bd_polygon.coordinates[0][0][0];
          const centerPoint = new BMap.Point(firstPoint[0], firstPoint[1]);
          mapObject.centerAndZoom(centerPoint, 14);
          isCenterAndZoom = true;
        }
      }
    }

    //判断是否有父级区域(如果有则绘制)
    const hasParentArea = !!(areaDetail.parent_area);
    //绘制父级区域
    if (hasParentArea === true) {
      //判断数据是否存在 TODO: js语言，连个级联属性判断空都没有。稍后需要封装工具函数。
      if (areaDetail.parent_area.region_info && areaDetail.parent_area.region_info.bd_polygon) {
        //获取父区域坐标
        const coordinates = areaDetail.parent_area.region_info.bd_polygon.coordinates;
        //TODO:奇葩的后台数据结构
        if (coordinates.length) {
          if (coordinates[0].length) {
            //设置地图中心, 如果子区域没有设置区域中心，则设置父区域为中心
            if (isCenterAndZoom === false) {
              const firstPoint = coordinates[0][0][0];
              const centerPoint = new BMap.Point(firstPoint[0], firstPoint[1]);
              mapObject.centerAndZoom(centerPoint, 14);
            }

            //获取父级区域坐标
            const parentCoordinates = areaDetail.parent_area.region_info.bd_polygon.coordinates;
            //绘制父级区域，只读，不可删除编辑
            parentCoordinates.map((item) => {
              return loadMapCoordinates(item, '#3E32A2');
            });
          }
        }
      }
    }

    if (!region_info) {
      return
    }

    //绘制区域
    if (region_info.bd_polygon.coordinates !== 0) {
      //判断是否是子类，子类橙色，父类蓝色
      const overlayColor = (areaDetail.is_sub_area) ? '#FF9000' : '#3E32A2';
      const overlayOpacity = (areaDetail.is_sub_area) ? '0.6' : '0.3';
      const coordinates = region_info.bd_polygon.coordinates;
      coordinates.map((item) => {
        return loadMapCoordinates(item, overlayColor, overlayOpacity);
      })
    }

    //判断地图焦点是否已经加载
    if (isCenterAndZoom === false) {
      mapObject.centerAndZoom(cityName, 14);
    }
  }

  //绘制地图坐标区域
  loadMapCoordinates = (coordinates, overlayColor, fillOpacity) => {
    const { loadMapComponentPolygon, bindMenu } = this;
    const { mapObject } = this.private

    if (!coordinates) {
      return;
    }
    //数据判断
    if (coordinates.length < 0) {
      return;
    }

    //遍历坐标数据
    coordinates.forEach((coordinate) => {
      //绘制浮层
      const overlay = loadMapComponentPolygon(coordinate, overlayColor, fillOpacity);
      mapObject.addOverlay(overlay);
    });
  }

  //地图画多边形
  loadMapComponentPolygon = (arr, color = '#3E32A2', fillOpacity = '0.3') => {
    return new BMap.Polygon(
      arr.map(item => new BMap.Point(item[0], item[1])), {
        strokeColor: color,
        strokeWeight: 1,
        strokeOpacity: 0.5,
        fillColor: color,
        fillOpacity,
      });
  }

  //渲染区域标题面包屑
  renderBreadcrumbComponent = () => {
    const { areaDetail, isShowEdit } = this.state

    //功能说明浮层
    const popoverContent = (
      <div>
        <p>1.点击编辑,进入编辑模式</p>
        <p>2.点击画区域,在地图上拖动鼠标,自定义画区</p>
        <p>3.完成画区: 双击鼠标左键即可</p>
        <p>4.删除区域: 聚焦区域鼠标右击</p>
        <p>5.所画区域需手动保存</p>
        <p>6.保存后点击发布,当前修改区域立即生效.<br /><b style={{ color: 'red' }}>不发布,再次编辑显示上次修改保存的区域</b></p>
        <p>7.快捷键: 放大(shift +), 缩小(shift —), 上移(up), 下移(down), 左移(left), 右移(right)</p>
      </div>
    );

    let popoverComponent = '';
    if (isShowEdit) {
      popoverComponent = (<Popover placement="top" content={popoverContent} title="区域编辑说明" trigger="hover">
        <Icon type="question-circle-o" />
      </Popover>)
    }

    //判断是否是子区域
    if (areaDetail.is_sub_area === true) {
      return (
        <Breadcrumb>
          <BreadcrumbItem>{areaDetail.parent_area.name}</BreadcrumbItem>
          <BreadcrumbItem>{areaDetail.name}&nbsp;
            {popoverComponent}
          </BreadcrumbItem>
        </Breadcrumb>
      )
    }
    return (
      <Breadcrumb>
        <BreadcrumbItem>{areaDetail.name}&nbsp;
          {popoverComponent}
        </BreadcrumbItem>
      </Breadcrumb>
    )
  }

  //渲染标题区域
  renderMapTitleComponent = () => {
    const { renderBreadcrumbComponent } = this;
    return (
      <Row>
        <div className="form-divider-header" style={{ margin: '-10px 10px 8px 0px', width: '97%', paddingLeft: '24px' }}>
          {renderBreadcrumbComponent()}
        </div>
      </Row>
    )
  }

  //渲染区域详细信息
  renderMapDetailComponent = () => {
    const { isShowEdit } = this.state;
    const { areaDetail, cityCode, cityName } = this.state
    const { onClickAreaEdit } = this.private;
    return (
      <Row>
        <Form layout="inline">
          <FormItem label="区域ID">{areaDetail.id}</FormItem>
          <FormItem label="状态">{AreaState.description(areaDetail.state)}</FormItem>
          <FormItem style={{ float: 'right', marginRight: '0px' }}>
            {
              (isShowEdit === true) ? <Button type="primary" style={{ marginRight: '0px' }} onClick={(e) => { onClickAreaEdit(areaDetail.id) }}>编辑</Button> : ''
            }
          </FormItem>
        </Form>
      </Row>
    )
  }

  //渲染地图模块
  renderMapComponent = () => {
    return (
      <Row className={style.height100}>
        <div id="map" style={{ width: '100%', height: '85%', boxSizing: 'border-box' }} />
      </Row>
    );
  }

  //渲染页面
  render() {
    const { renderMapTitleComponent, renderMapDetailComponent, renderMapComponent } = this;
    return (
      <Col sm={24} className={`${style.height100}`} style={{ padding: '10px' }}>
        <Form layout="horizontal" className={`${style.height100} main-form`}>
          {renderMapTitleComponent()}
          {renderMapDetailComponent()}
          {renderMapComponent()}
        </Form>
      </Col>
    );
  }

}

module.exports = MapDetailComponent;
