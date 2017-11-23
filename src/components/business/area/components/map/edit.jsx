/**
  地理位置的控件实用的是百度的SDK
  相关文档见
  http://developer.baidu.com/map/reference/index.php?title=Class:控件类/Control
  http://lbsyun.baidu.com/cms/jsapi/reference/jsapi_reference.html#a2b0
  http://developer.baidu.com/map/jsdemo.htm#b0_6
**/

import React from 'react';
import { Row, Col, Input, Button, Form, Table, Radio, Breadcrumb, Alert, Icon, Popover, message } from 'antd';
import { AreaState } from '../../exports'
import style from '../style.less'
import { geography } from '../../../../../application'

const [FormItem, RadioGroup, BreadcrumbItem] = [Form.Item, Radio.Group, Breadcrumb.Item];
const citesDict = geography.city;

class MapEditComponent extends React.Component {

  constructor(props) {
    super();

    this.state = {
      vendorId: props.vendorId,
      cityCode: props.cityCode,
      cityName: props.cityName,
      areaDraftDetail: props.areaDraftDetail,

      submitFailureMessage: '', //表单提交时的错误信息
      submitSuccessMessage: '', //表单提交时的成功信息
      submitNoticeMessage: '',  //表单自动提交的提示信息
    }

    this.private = {
      componentLoading: true,   //显示loading界面
      onClickAreaPublish: props.onClickAreaPublish,   //发布
      onAutoSaveAreaDraft: props.onAutoSaveAreaDraft, //自动保存
    }
  }

  componentDidMount() {
    const { cityName } = this.state;
    const { bindDeleteMenuToOverLayer, onClickRemoveRegion, onClickGetPosition } = this;

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
  }

  componentWillReceiveProps(nextProps) {
    const currentDraftDetail = this.state.areaDraftDetail;
    const newDraftDetail = nextProps.areaDraftDetail;
    console.log('id compare', currentDraftDetail.id, newDraftDetail.id);

    this.setState({
      vendorId: nextProps.vendorId,
      cityCode: nextProps.cityCode,
      cityName: nextProps.cityName,
      areaDraftDetail: nextProps.areaDraftDetail,
    })

    //判断数据是否与当前数据一致，如果一致，则不刷新地图模块
    if (currentDraftDetail.id !== newDraftDetail.id) {
      this.loadMapComponent(nextProps.areaDraftDetail);
    }
  }

  //绘制地图坐标区域
  loadMapCoordinates = (coordinates, isEnableEdit, isEnableDelete, isParentArea, overlayColor, fillOpacity, strokeWeight) => {
    const { loadMapComponentPolygon, bindDeleteMenuToOverLayer } = this;
    const { mapObject } = this.private

    //数据判断
    if (coordinates.length < 0) {
      return;
    }

    //遍历坐标数据
    coordinates.forEach((coordinate) => {
      //绘制浮层
      const overlay = loadMapComponentPolygon(coordinate, overlayColor, fillOpacity, strokeWeight);
      mapObject.addOverlay(overlay);

      //判断是否是父级区域
      if (isParentArea) {
        overlay.isParentArea = true;
      }

      //是否允许编辑
      if (isEnableEdit === true) {
        overlay.enableEditing();
      }

      //是否允许删除
      if (isEnableDelete) {
        bindDeleteMenuToOverLayer(overlay);
      }
    });
  }

  //加载地图模块
  loadMapComponent = (areaDraftDetail) => {
    //初始化变量
    const { loadMapComponentPolygon, loadMapCoordinates } = this;
    const { cityName } = this.state;
    const { mapObject } = this.private
    let isCenterAndZoom = false;

    //清理绘制区域
    mapObject.clearOverlays();

    //判断是否有父级区域(如果有则绘制)
    const hasParentArea = !!(areaDraftDetail.parent_area);
    //绘制父级区域
    if (hasParentArea === true) {
      //判断数据是否存在 TODO: js语言，连个级联属性判断空都没有。稍后需要封装工具函数。
      if (areaDraftDetail.parent_area.region_info && areaDraftDetail.parent_area.region_info.bd_polygon) {
        //获取父区域坐标
        const coordinates = areaDraftDetail.parent_area.region_info.bd_polygon.coordinates || [];
        //TODO:奇葩的后台数据结构
        if (coordinates.length) {
          if (coordinates[0].length) {
            //设置地图中心, 如果子区域没有设置区域中心，则设置父区域为中心
            if (isCenterAndZoom === false) {
              const firstPoint = coordinates[0][0][0];
              const centerPoint = new BMap.Point(firstPoint[0], firstPoint[1]);
              mapObject.centerAndZoom(centerPoint, 14);
              isCenterAndZoom = true;
            }

            //获取父级区域坐标
            const parentCoordinates = areaDraftDetail.parent_area.region_info.bd_polygon.coordinates;
            //绘制父级区域，只读，不可删除编辑
            parentCoordinates.map((item) => {
              return loadMapCoordinates(item, false, false, true, '#3E32A2', 0.3, 1);
            });
          }
        }
      }
    }

    //判断是否有坐标数据
    const hasCoordinates = !!(areaDraftDetail.region_info);
    //绘制区域
    if (hasCoordinates) {
      //获取当前区域坐标
      const coordinates = areaDraftDetail.region_info.bd_polygon.coordinates || [];

      //TODO:奇葩的后台数据结构
      if (coordinates.length) {
        if (coordinates[0].length) {
          //设置地图中心
          const firstPoint = coordinates[0][0][0];
          const centerPoint = new BMap.Point(firstPoint[0], firstPoint[1]);
          mapObject.centerAndZoom(centerPoint, 14);
          isCenterAndZoom = true;

          //判读是否有上一级
          const overlayColor = (areaDraftDetail.parent_area_id !== '') ? '#FF9000' : '#3E32A2';
          const overlayOpacity = (areaDraftDetail.parent_area_id !== '') ? '0.6' : '0.3';

          //绘制级区域，可删除或编辑
          coordinates.map((item) => {
            return loadMapCoordinates(item, true, true, false, overlayColor, overlayOpacity);
          });
        }
      }
    }

    //判断地图焦点是否已经加载
    if (isCenterAndZoom === false) {
      mapObject.centerAndZoom(cityName, 14);
    }
  }

  //画多边形
  loadMapComponentPolygon = (arr, color = '#3E32A2', fillOpacity = 0.3, strokeWeight = 2) => {
    return new BMap.Polygon(
      arr.map(item => new BMap.Point(item[0], item[1])), {
        strokeColor: color,
        strokeWeight,
        strokeOpacity: 0.5,
        fillColor: color,
        fillOpacity,
      });
  }

  //画操作菜单
  bindDeleteMenuToOverLayer = (currOverlay) => {
    const { onClickRemoveRegion } = this;
    const markerMenu = new BMap.ContextMenu();
    markerMenu.addItem(new BMap.MenuItem('删除', (e) => {
      onClickRemoveRegion(currOverlay);
    }));
    currOverlay.addContextMenu(markerMenu);
    currOverlay.addEventListener('click', () => {
    });
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

  //编辑地图区域区域
  onClickEditRegion = (e) => {
    this.setState({ submitFailureMessage: '' });
    const { areaDraftDetail } = this.state;
    const { mapObject } = this.private;
    const { bindDeleteMenuToOverLayer } = this;
    const overlayColor = (areaDraftDetail.parent_area_id !== '') ? '#FF9000' : '#3E32A2';

    // 配置鼠标绘制
    const drawingManager = new BMapLib.DrawingManager(mapObject, {
      isOpen: true, //是否开启绘制模式
      drawingType: BMAP_DRAWING_POLYGON,
      polygonOptions: {
        strokeColor: overlayColor,
        strokeWeight: 2,
        strokeOpacity: 0.5,
        fillColor: overlayColor,
        fillOpacity: 0.3,
      },
    });

    //绑定画完添加事件
    drawingManager.addEventListener('overlaycomplete', (e) => {
      //取消绘制状态
      drawingManager.close();
      //绘制完成后保持可编辑的状态
      e.overlay.enableEditing();
      //绑定删除菜单
      bindDeleteMenuToOverLayer(e.overlay);
    });

    drawingManager.setDrawingMode(BMAP_DRAWING_POLYGON);
    // drawingManager.open();
  }

  //删除地图区域
  onClickRemoveRegion = (currOverlay) => {
    const { mapObject } = this.private;
    mapObject.removeOverlay(currOverlay);
  }

  //发布区域
  onClickSubmit = (e) => {
    const { onClickAreaPublish } = this.private;
    const { getMapRegionList } = this;
    e.preventDefault();
    const { getFieldsValue, validateFields } = this.props.form;
    validateFields((err, value) => {
      if (err) {
        this.setState({ submitFailureMessage: `错误 ${err}` });
        return;
      }
       //发布区域
      const values = getFieldsValue();
      const coordinates = getMapRegionList();
      if (coordinates === undefined || coordinates.length <= 0) {
        this.setState({ submitFailureMessage: '错误 区域发布的绘制区域不能为空' });
        return;
      }

      onClickAreaPublish(values.areaId, values.areaName, values.areaState, values.cityCode, coordinates);

      console.log('onClickSubmit', values)
    });
  }

  //保存区域数据
  onClickSave = (e) => {
    const { onAutoSaveAreaDraft } = this.private;
    const { getMapRegionList } = this;
    e.preventDefault();
    const { getFieldsValue, validateFields } = this.props.form;
    validateFields((err, value) => {
      if (err) {
        this.setState({ submitFailureMessage: `错误 ${err}` });
      } else {
        //保存区域数据
        const values = getFieldsValue();
        let coordinates = getMapRegionList();

        //修正空区域列表不保存的问题
        if (coordinates === undefined) {
          coordinates = [];
        }
        onAutoSaveAreaDraft(values.areaId, values.areaName, values.areaState, values.cityCode, coordinates);

        console.log('onClickSave', values)
      }
    });
  }

  //获取绘制区域的坐标列表
  getMapRegionList = () => {
    const { mapObject } = this.private;

    //获取绘制区域的坐标列表
    const regions = [];
    mapObject.getOverlays().forEach((overlay) => {
      //判断坐标数据是否存在，并且区域不是父区域
      if (typeof overlay.getPath === 'function' && overlay.isParentArea !== true) {
        //转换坐标区域的坐标格式
        const points = [];
        overlay.getPath().forEach((point) => {
          points.push([point.lng, point.lat]);
        });
        //添加第一个坐标点，实现坐标闭合
        points.push(points[0]);
        regions.push(points);
      }
    });
    if (regions.length) {
      return regions;
    }
    return [];
  }

  //检查区域名称
  checkAreaName = (rule, value, callback) => {
    this.setState({ submitFailureMessage: '' });
    if (value === '') {
      this.setState({ submitFailureMessage: '区域名称不能为空' });
    } else {
      callback();
    }
  }

  //检查区域状态
  checkAreaState = (rule, value, callback) => {
    this.setState({ submitFailureMessage: '' });
    if (value !== AreaState.on && value !== AreaState.off) {
      this.setState({ submitFailureMessage: '请选择区域状态' });
    } else {
      callback();
    }
  }

  //渲染标题区域
  renderMapTitleComponent = () => {
    const { renderBreadcrumbComponent } = this;
    const { areaDraftDetail, submitFailureMessage, submitSuccessMessage, submitNoticeMessage } = this.state;
    let title = '区域编辑 ';
    if (areaDraftDetail.parent_area) {
      title = `区域编辑 - ${areaDraftDetail.parent_area.name} `;
    }

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

    return (
      <Row>
        <div className="form-divider-header" style={{ margin: '-10px 10px 8px 0px', width: '97%', paddingLeft: '24px' }}>
          <Col sm={12} style={{ textAlign: 'left' }}>
            <Breadcrumb>
              <BreadcrumbItem>{title}
                <Popover placement="top" content={popoverContent} title="区域编辑说明" trigger="hover">
                  <Icon type="question-circle-o" />
                </Popover>
              </BreadcrumbItem>
            </Breadcrumb>
          </Col>
          <Col sm={12} style={{ textAlign: 'right' }}>
            { submitFailureMessage ? <span style={{ color: 'red' }}><Icon type="cross-circle-o" /> {submitFailureMessage}</span> : ''}
            {/* { submitSuccessMessage ? <span style={{ color: '#00CFA1' }}><Icon type="exclamation-circle-o" /> {submitSuccessMessage}</span> : ''} */}
            { submitNoticeMessage ? <span style={{ color: 'grey' }}><Icon type="check-circle-o" /> {submitNoticeMessage}</span> : ''}
          </Col>
        </div>
      </Row>
    )
  }

  //渲染详情界面
  renderMapDetailComponent = () => {
    const { onClickEditRegion, onClickSubmit, onClickSave, checkAreaName, checkAreaState } = this;
    const { areaDraftDetail, cityCode, vendorId } = this.state;
    const { getFieldDecorator } = this.props.form;

    //样式
    const formItemLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

    //父级分类id
    const parentAreaId = (areaDraftDetail.parent_area) ? areaDraftDetail.parent_area.id : '';

    //设置默认的区域状态，如果是草稿状态，默认赋值为禁用
    const defaultAreaState = (areaDraftDetail.state === AreaState.draft) ? AreaState.off : areaDraftDetail.state;

    //重新赋值，进行编辑
    return (
      <Row>
        <Col sm={7} offset={-1} style={{ textAlign: 'left' }}>
          <div style={{ position: 'absolute' }}>
            <FormItem>
              {
                getFieldDecorator('areaId', { initialValue: areaDraftDetail.id })(
                  <Input type="hidden" />,
                )
              }
            </FormItem>
            <FormItem>
              {
                getFieldDecorator('vendorId', { initialValue: vendorId })(
                  <Input type="hidden" />,
                )
              }
            </FormItem>
            <FormItem>
              {
                getFieldDecorator('cityCode', { initialValue: cityCode })(
                  <Input type="hidden" />,
                )
              }
            </FormItem>
            <FormItem>
              {
                getFieldDecorator('parentAreaId', { initialValue: parentAreaId })(
                  <Input type="hidden" />,
                )
              }
            </FormItem>
          </div>
          <FormItem label="区域名称 " {...formItemLayout}>
            {
              getFieldDecorator('areaName', { initialValue: areaDraftDetail.name, rules: [{ required: true, message: '请填写区域' }, { validator: checkAreaName }] })(
                <Input placeholder="请输入区域名称" size="small" />,
              )
            }
          </FormItem>
        </Col>
        <Col sm={7} style={{ textAlign: 'left' }}>
          <FormItem label="状态" {...formItemLayout}>
            {
              getFieldDecorator('areaState', { initialValue: defaultAreaState })(
                <RadioGroup>
                  {/*rules: [{ required: true, message: '请选择状态' }, { validator: checkAreaState }]*/}
                  <Radio value={AreaState.on}>启用</Radio>
                  <Radio value={AreaState.off}>禁用</Radio>
                </RadioGroup>,
              )
            }
          </FormItem>
        </Col>
        <Col sm={10} style={{ textAlign: 'right' }}>
          <Button onClick={onClickEditRegion} style={{ margin: '0 20px' }}>画区域</Button>
          <Button onClick={onClickSave}>保存</Button>
          <Button onClick={onClickSubmit} type="primary">发布</Button>
        </Col>
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

module.exports = Form.create()(MapEditComponent);
