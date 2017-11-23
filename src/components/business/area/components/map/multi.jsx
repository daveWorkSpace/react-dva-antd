import dot from 'dot-prop';
import React from 'react';
import { Row, Col, Form, Button, Table, Radio, Breadcrumb, Popover, Icon, message } from 'antd';
import { AreaState } from '../../exports'
import style from '../style.less'
import { geography } from '../../../../../application'

const [FormItem, BreadcrumbItem] = [Form.Item, Breadcrumb.Item];
const citesDict = geography.city;

class MapMultiComponent extends React.Component {

  constructor(props) {
    super();

    this.state = {
      cityCode: props.cityCode,
      cityName: props.cityName,
      areas: props.areas ? props.areas : [],
    }
    this.private = {

    }
  }

  componentDidMount() {
    const { cityName } = this.state;
    const { onClickGetPosition } = this;

    //初始化地图
    const mapObject = new BMap.Map('map', { enableMapClick: false });
    mapObject.enableKeyboard(); //启用键盘操作，默认禁用。键盘的上、下、左、右键可连续移动地图。同时按下其中两个键可使地图进行对角移动。PgUp、PgDn、Home和End键会使地图平移其1/2的大小。+、-键会使地图放大或缩小一级
    mapObject.disablePinchToZoom(); //禁用双指操作缩放。

    // 添加缩放控件
    mapObject.addControl(new BMap.NavigationControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT }))
    this.private.mapObject = mapObject;

    //初始化定位
    const geocoder = new BMap.Geocoder();
    this.private.geocoder = geocoder;

    function ZoomControl() {
      // 默认停靠位置和偏移量
      this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
      this.defaultOffset = new BMap.Size(10, 10);
    }

    //添加搜索组件
    // 通过JavaScript的prototype属性继承于BMap.Control
    ZoomControl.prototype = new BMap.Control();

    // 自定义控件必须实现自己的initialize方法,并且将控件的DOM元素返回
    // 在本方法中创建个div元素作为控件的容器,并将其添加到地图容器中
    ZoomControl.prototype.initialize = function (map) {
      // 外层容器
      const div = document.createElement('div');
      div.style.border = '0px solid gray';
      div.style.backgroundColor = 'white';
      div.style.padding = '5px 10px';
      div.style.borderRadius = '4px';

      //定位
      const span = document.createElement('span');
      span.appendChild(document.createTextNode('定位'));
      span.style.margin = '0px 5px 0px';
      span.style.color = '#666';
      div.appendChild(span);

      //输入框
      const input = document.createElement('input');
      input.setAttribute('type', 'text');
      input.style.width = '140px';
      input.style.margin = '0px 5px 0px';
      input.style.height = '22px';
      input.style.border = '1px solid #d9d9d9';
      input.style.padding = '2px 7px';
      input.style.borderRadius = '4px';
      div.appendChild(input);

      //查询按钮
      const button = document.createElement('span');
      button.appendChild(document.createTextNode('搜索'));
      button.onclick = function (e) {
        onClickGetPosition(input.value);
      };
      button.style.cursor = 'pointer';
      button.style.border = '1px solid #00CFA1';
      button.style.padding = '4px 15px';
      button.style.margin = '0px 5px 0px';
      button.style.color = '#fff';
      button.style.backgroundColor = '#00CFA1';
      button.style.textAlign = 'center';
      button.style.whiteSpace = 'nowrap';
      button.style.lineHeight = '1.5';
      button.style.fontSize = '12px';
      button.style.borderRadius = '4px';

      div.appendChild(button);

      // 添加DOM元素到地图中
      map.getContainer().appendChild(div);
      // 将DOM元素返回
      return div;
    }
    // 创建控件
    const myZoomCtrl = new ZoomControl();
    // 添加到地图当中
    mapObject.addControl(myZoomCtrl);

    this.loadMapComponent();
  }

  componentWillReceiveProps(nextProps) {
    this.state = {
      cityCode: nextProps.cityCode,
      cityName: nextProps.cityName,
      areas: nextProps.areas ? nextProps.areas : [],
    }
    this.loadMapComponent();
  }

  //地图定位函数
  onClickGetPosition = (address) => {
    if (address.length <= 0) {
      message.info('请填写要搜索的地址');
      return;
    }

    const { cityName } = this.state;
    const { mapObject } = this.private;
    const { geocoder } = this.private;
    const topThis = this;
    if (typeof topThis.position_point !== 'undefined') {
      mapObject.removeOverlay(topThis.position_point);
    }
    geocoder.getPoint(cityName + address, (point) => {
      if (point) {
        topThis.position_point = new BMap.Marker(point);
        mapObject.centerAndZoom(point, 16);
        mapObject.addOverlay(topThis.position_point);
      } else {
        message.info('您选择地址没有解析到结果,请重新输入!');
      }
    }, cityName);
  }

  //加载地图模块
  loadMapComponent = () => {
    const { loadMapComponentPolygon, loadMapCoordinates } = this;
    const { mapObject } = this.private
    const { cityName, cityCode, areas } = this.state;

    //清理绘制区域
    mapObject.clearOverlays();
    //定位地图中心
    mapObject.centerAndZoom(cityName, 14);

    //判断是否有区域数据
    if (dot.has(areas, 'data') === false) {
      return
    }

    areas.data.forEach((area, index) => {
      //绘制区域
      if (dot.has(area, 'region_info.bd_polygon.coordinates')) {
        //判断是否是子类，子类橙色，父类蓝色
        const overlayColor = (area.is_sub_area) ? '#FF9000' : '#3E32A2';
        const overlayOpacity = (area.is_sub_area) ? '0.6' : '0.3';
        const areaName = dot.get(area, 'name', '');
        const coordinates = dot.get(area, 'region_info.bd_polygon.coordinates', []);
        coordinates.forEach((item) => {
          loadMapCoordinates(item, overlayColor, overlayOpacity, areaName);
        })
      }
    });
  }

  //绘制地图坐标区域
  loadMapCoordinates = (coordinates, overlayColor, fillOpacity, areaName) => {
    const { loadMapComponentPolygon } = this;
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

      //绘制区域名称右键
      const markerMenu = new BMap.ContextMenu();
      markerMenu.addItem(new BMap.MenuItem(areaName, (e) => {}));
      overlay.addContextMenu(markerMenu);
      overlay.addEventListener('click', () => {});
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

  //渲染页面
  render() {
    return (
      <Col sm={24} style={{ height: '100%' }}>
        <Row style={{ height: '100%' }}>
          <div id="map" style={{ width: '100%', height: '100%', minHeight:'450px', boxSizing: 'border-box' }} />
        </Row>
      </Col>
    );
  }

}

module.exports = MapMultiComponent;
