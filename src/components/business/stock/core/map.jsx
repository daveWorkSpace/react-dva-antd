
import React, { Component } from 'react';
import { Form, Radio, Button, Row, Col, Input } from 'antd';

class MapComponent extends React.Component {
  constructor(props) {
    super(props);
    //
    this.state = {
      longitude: props.longitude ? props.longitude : '116.404',  //经度
      latitude: props.latitude ? props.latitude : '39.915',     //纬度
      address: props.address ? props.address : '',                //地址名称
      tempLng: '',
      tempLat: '',
      isEditMode: props.isEditMode,
    };
    //
    this.private = {
      onSearchCallback: props.onSearchCallback,
    };
  }
  //update
  componentWillReceiveProps = (nextProps) => {
    const { longitude, latitude, address, isEditMode } = nextProps;
    const { getPoint } = this;
    const { tempLng, tempLat } = this.state;

    if (tempLng === longitude && tempLat === latitude) {
      return;
    }
    if (longitude && latitude) {
      this.setState({
        longitude,
        latitude,
        address: address || this.state.address,
        tempLng: longitude,
        tempLat: latitude,
        isEditMode,

      }, () => {
        //属性有值时，经纬度重新渲染地图
        getPoint(new BMap.Point(longitude, latitude));
      });
    }
  };

  //create map
  componentDidMount = () => {
    const { getPoint, searchLayout, searchAuto } = this;
    const { longitude, latitude, isEditMode } = this.state;

    //初始化地图实例
    const map = new BMap.Map('showMap', { enableMapClick: false });
    map.enableKeyboard(); //启动键盘上下左右键

    //添加控件-
    map.addControl(new BMap.NavigationControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT }));  //平移缩放控件
    map.addControl(new BMap.MapTypeControl());    //添加地图类型控件

    //
    this.private.map = map;
    //
    getPoint(new BMap.Point(longitude, latitude));

    //详情页不加载搜索框和搜索建议
    if (isEditMode) {
      //创建原生input
      searchLayout();
      //搜索建议
      searchAuto();
    }
  };

  //添加标注和事件
  getPoint = (point) => {
    const { handleSearch, getPoint } = this;
    const { map, onSearchCallback } = this.private;
    const { address, longitude, latitude, isEditMode } = this.state;
    const self = this;
    //清楚地图上所有标注物
    map.clearOverlays();
    //初始化地图，设置中心点坐标和地图级别-未进行初始化的地图将不能进行任何操作。
    map.centerAndZoom(point, 15);
    /*----------创建标注----------*/
    const marker = new BMap.Marker(point);

    this.private.marker = marker;

    map.addOverlay(marker);
    //详情页不可拖动
    if (isEditMode) {
      marker.enableDragging();  //可拖动
    }

    // marker.setAnimation(BMAP_ANIMATION_BOUNCE);   //跳动的动画
    this.setState({
      longitude: point.lng,
      latitude: point.lat,
    });
    /*--------监听拖拽事件---------*/
    marker.addEventListener('dragend', () => {
      const p = marker.getPosition();
      this.setState({
        longitude: p.lng,
        latitude: p.lat,
      }, () => {
        if (onSearchCallback) {
          //传递拖拽后更新店铺坐标-但地址保持不变
          onSearchCallback(address, p);
        }
        getPoint(p);
      });
    });
  };

  /*---------------------------动态添加搜索框--------------------------------------*/
  searchLayout = () => {
    const { map } = this.private;
    const { handleSubmit } = this;

    function ZoomControl() {
      // 默认停靠位置和偏移量
      this.detaultAnchor = BMAP_ANCHOR_TOP_LEFT;
      this.defaultOffset = new BMap.Size(10, 10);
    }
    //添加搜索组件-通过js的prototype属性继承于BMap.Control
    ZoomControl.prototype = new BMap.Control();

    // 自定义控件必须实现自己的initialize方法，并且将控件的DOM元素返回
    // 在本方法中创建个div元素作为控件的容器，并将其添加到地图中
    ZoomControl.prototype.initialize = function (map) {
      //外层容器
      const div = document.createElement('div');
      div.style.border = '0px solid gray';
      div.style.backgroundColor = 'white';
      div.style.padding = '5px 10px';
      div.style.borderRadius = '4px';
      div.style.margin = '10px 5px';

      //定位
      const span = document.createElement('span');
      span.appendChild(document.createTextNode('定位'));
      span.style.margin = '0px 5px 0px';
      span.style.color = '#666';
      div.appendChild(span);

      //输入框
      const input = document.createElement('input');
      input.setAttribute('type', 'text');
      input.style.width = '250px';
      input.style.margin = '0px 5px 0px';
      input.style.height = '22px';
      input.style.border = '1px solid #d9d9d9';
      input.style.padding = '2px 7px';
      input.style.borderRadius = '4px';
      input.id = 'suggestId';
      div.appendChild(input);

      //查询按钮
      const button = document.createElement('span');
      button.appendChild(document.createTextNode('搜索'));
      button.onclick = function (e) {
        handleSubmit(input.value);
      };
      button.style.cursor = 'pointer';
      button.style.border = '1px solid #58e2c2';
      button.style.padding = '4px 15px';
      button.style.margin = '0px 5px 0px';
      button.style.color = '#fff';
      button.style.backgroundColor = '#58e2c2';
      button.style.textAlign = 'center';
      button.style.whiteSpace = 'nowrap';
      button.style.lineHeight = '1.5';
      button.style.fontSize = '12px';
      button.style.borderRadius = '4px';
      button.className = 'btn';
      //button.onmousemove='setHoverStyle(btn)';

      div.appendChild(button);
      // 添加DOM元素到地图中
      map.getContainer().appendChild(div);
      // 将DOM元素返回
      return div;
    };

    //创建控件
    const myZoomCtrl = new ZoomControl();

    //添加到地图中
    map.addControl(myZoomCtrl);
  };

  //建议搜索
  searchAuto = () => {
    const { map } = this.private;
    const { setPlace } = this;

    //建立一个自动完成的对象
    const lists = new BMap.Autocomplete(
      {
        input: 'suggestId',
        location: map,
      },
    );

    //鼠标放在下拉列表上的事件
    lists.addEventListener('onhighlight', (e) => {
      let str = '';
      let _value = e.fromitem.value;
      let value = '';
      if (e.fromitem.index > -1) {
        //value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
        value = _value.district + _value.street + _value.business;
      }
      str = `FromItem<br />index = ${e.fromitem.index}<br />value = ${value}`;

      value = '';
      if (e.toitem.index > -1) {
        _value = e.toitem.value;
       // value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
        value = _value.district + _value.street + _value.business;
      }
    });

    let myValue = '';
    //鼠标点击下拉列表后的事件
    lists.addEventListener('onconfirm', (e) => {    //鼠标点击下拉列表后的事件
      const _value = e.item.value;
      //myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
      myValue = _value.district + _value.street + _value.business;
      setPlace(myValue);
    });
  };

  //根据地址获取经纬度-创建地址解析实例
  setPlace= (name) => {
    const { handleSearch, getPoint } = this;
    const { map } = this.private;
    const myGeo = new BMap.Geocoder(map);

    myGeo.getPoint(name, (point) => {
      if (point) {
        handleSearch(name, point);
        getPoint(point);
      }
    }, '北京')
  };

  //搜索按钮
  handleSubmit = (e) => {
    const { setPlace } = this;
    setPlace(e);
  };

   //搜索事件
  handleSearch = (e, poi) => {
    const { getPoint } = this;
    const { onSearchCallback } = this.private;
    this.setState({
      address: e,
    });

    //传递地址&经纬度
    if (onSearchCallback) {
      onSearchCallback(e, poi);
    }

    //渲染经纬度
    getPoint(poi);
  };

  renderMapTitleComponent = () => {
    const { longitude, latitude } = this.state;
    return (
      <Row type="flex" justify="center">
        <Col sm={7}>
          经度: { longitude }
        </Col>
        <Col sm={7}>
          纬度: { latitude}
        </Col>
      </Row>
    )
  };

  render() {
    const { renderMapTitleComponent } = this;
    return <div id="showMap" style={{ width: '100%', height: 600, border: '1px solid #c0c0c0' }} />;
  }
}

module.exports.MapComponent = MapComponent;
