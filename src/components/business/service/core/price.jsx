import is from 'is_js';
import dot from 'dot-prop';
import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Table, Form, Row, Col, Input, Button, InputNumber, Icon, TimePicker, message } from 'antd';
import moment from 'moment';
import Helper from '../../../../application/service/helper'
import { PricePlan } from '../../../../application/object/'

class PriceFormComponent extends React.Component {
  constructor(props) {
    super();

    const value = props.value || {};

    const businessTimeStart = props.businessTimeStart;       //开始营业时间
    const businessTimeFinish = props.businessTimeFinish;     //结束营业时间
    const deliveryDistanceMin = props.deliveryDistanceMin;   //最小配送距离
    const deliveryDistanceMax = props.deliveryDistanceMax;   //最大配送距离

    //默认的距离，时间，价格, 数据,
    let distance = [{ distanceMin: deliveryDistanceMin, distanceMax: deliveryDistanceMax, distanceExt: 1 }];
    let time = [{ start: businessTimeStart, finish: businessTimeFinish }];
    let prices = [[new PricePlan()]];
    let data = this.getData(time, distance, prices);

    //是否使用数据进行初始化
    let isInitWithValue = false;

    //如果阶梯定价数据存在，处理数据格式
    if (is.existy(value) && is.not.empty(value)) {
      distance = Object.values(this.getDistance(value));
      time = Object.values(this.getTimes(value));
      prices = this.getPrice(value);
      data = this.getData(time, distance, prices);

      //使用数据进行的初始化
      isInitWithValue = true;
    }

    this.state = {
      businessTimeStart,
      businessTimeFinish,
      deliveryDistanceMin,
      deliveryDistanceMax,
      isInitWithValue,
      isOpenTimePicker: false,    //是否打开时间选择器
      distance,
      time,
      prices,
      data,
    }
    this.private = {
      onChange: props.onChange,
    }
  }

  componentWillMount =() => {
    const { time, distance, prices } = this.state;
    this.triggerFormChange(time, distance, prices);
  }

  componentWillReceiveProps = (nextProps) => {
    const { value } = nextProps;
    const { isInitWithValue, businessTimeStart, businessTimeFinish, deliveryDistanceMin, deliveryDistanceMax } = this.state;

    //判断是否需要重置数据
    if (businessTimeStart !== nextProps.businessTimeStart
    || businessTimeFinish !== nextProps.businessTimeFinish
    || deliveryDistanceMin !== nextProps.deliveryDistanceMin
    || deliveryDistanceMax !== nextProps.deliveryDistanceMax) {
      this.setState(this.resetState(nextProps));
      return;
    }

    //判断是否加载了初始化数据
    if (is.existy(value) && is.not.empty(value) && isInitWithValue === false) {
      const time = Object.values(this.getTimes(value));
      const distance = Object.values(this.getDistance(value));
      const prices = this.getPrice(value);
      const data = this.getData(time, distance, prices);

      this.setState({ time, distance, prices, data, isInitWithValue: true });
      this.triggerFormChange(time, distance, prices);
    }
  }

  resetState = (props) => {
    const businessTimeStart = props.businessTimeStart;       //开始营业时间
    const businessTimeFinish = props.businessTimeFinish;     //结束营业时间
    const deliveryDistanceMin = props.deliveryDistanceMin;   //最小配送距离
    const deliveryDistanceMax = props.deliveryDistanceMax;   //最大配送距离

    //默认的距离，时间，价格, 数据,
    const distance = [{ distanceMin: deliveryDistanceMin, distanceMax: deliveryDistanceMax, distanceExt: 0 }];
    const time = [{ start: businessTimeStart, finish: businessTimeFinish }];
    const prices = [[new PricePlan()]];
    const data = this.getData(time, distance, prices);

    //重制上级form表单中的数据
    this.triggerFormChange(time, distance, prices);

    return {
      businessTimeStart,
      businessTimeFinish,
      deliveryDistanceMin,
      deliveryDistanceMax,
      isOpenTimePicker: false,    //是否打开时间选择器
      distance,
      time,
      prices,
      data,
    }
  }

  triggerFormChange = (time, distance, prices) => {
    // Should provide an event to pass value to Form.
    const { getFormData } = this;
    const { onChange } = this.private;
    if (onChange) {
      onChange(this.getFormData(time, distance, prices));
    }
  }

  indexOfObject = (key, object) => {
    const keys = Object.keys(object);
    return keys.indexOf(key);
  }

  // 获取时间分段
  getTimes = (pricePlan) => {
    //判断数据是否为空
    if (is.not.existy(pricePlan) || is.empty(pricePlan)) {
      return [];
    }

    const data = [];
    pricePlan.forEach((item, index) => {
      //用开始时间和结束时间当作uniqueKey
      const key = `${item.time.start}-${item.time.finish}`;
      //判断，如果时间分段不存在，则创建
      if (!data[key]) {
        data[key] = item.time;
      }
    });
    return data;
  }

  // 获取距离
  getDistance = (pricePlan) => {
    //判断数据是否为空
    if (is.not.existy(pricePlan) || is.empty(pricePlan)) {
      return [];
    }

    const data = [];
    pricePlan.forEach((item, index) => {
      //用开始时间和结束时间当作uniqueKey
      const key = `${item.distanceMin}-${item.distanceMax}`;
      //判断，如果时间分段不存在，则创建
      if (!data[key]) {
        data[key] = item;
      }
    });
    return data;
  }

  //获取价格清单
  getPrice = (pricePlan) => {
    //判断数据是否为空
    if (is.not.existy(pricePlan) || is.empty(pricePlan)) {
      return [];
    }

    // 获取时间分段
    const t = this.getTimes(pricePlan);
    // 获取距离分段
    const d = this.getDistance(pricePlan);
    const data = [];
    pricePlan.forEach((item, index) => {
      //用开始时间和结束时间当作uniqueKey
      const rowKey = `${item.time.start}-${item.time.finish}`;
      const colKey = `${item.distanceMin}-${item.distanceMax}`;
      // 表格的行列
      const row = this.indexOfObject(rowKey, t);
      const col = this.indexOfObject(colKey, d);

      //判断，如果时间分段不存在，则创建
      if (!data[row]) {
        data[row] = [];
      }
      if (!data[row][col]) {
        data[row][col] = item;
      }
    });
    return data;
  }

  //获取最后展示的数据
  getData = (time, distance, prices) => {
    // console.log('after', distance, time, prices);

    const data = []
    for (let i = 0; i < time.length; i += 1) {
      const item = {};
      item.time = time[i];
      item.distance = distance;
      item.price = prices;
      item.key = `rowKey${i}`;
      data.push(item);
    }

    return data;
  }

  //获取最后提交的数据
  getFormData = (time, distance, prices) => {
    const data = []
    time.forEach((timeObj, timeIndex, timeArray) => {
      distance.forEach((distanceObj, distanceIndex, distanceArray) => {
        const item = new PricePlan();
        item.time = timeObj;
        item.distanceMin = distanceObj.distanceMin;
        item.distanceMax = distanceObj.distanceMax;
        item.distanceExt = dot.get(distanceObj, 'distanceExt', 1); //默认没有值的时候，取0;
        item.priceBase = prices[timeIndex][distanceIndex].priceBase;

        //判断距离分段，如果是第一个距离分段，则默认没有额外配送费用
        if (distanceIndex !== 0) {
          item.priceExt = dot.get(prices[timeIndex][distanceIndex], 'priceExt', 0); //默认没有值的时候，取0
        }
        data.push(item);
      })
    })
    return data;
  }

  //获取表格列
  getColumns = () => {
    const { getTimeColumn, getDistanceColumn } = this;
    const { distance, data } = this.state;

    //数据的行数
    const rowNum = data.length - 1;
    const columns = [
      //获取第一列，时间分段
      getTimeColumn(rowNum),
      //获取第二列，距离分段
      getDistanceColumn(distance),
    ];

    return columns;
  }

  //获取时间分段的列配置
  getTimeColumn = (rowNum) => {
    const { createRow, deleteRow } = this;
    const { businessTimeStart, businessTimeFinish } = this.state;

    //初始化内部时间变量，存储提交请求的时间
    let _timeString;

    //判断下一组时间营业是否结束
    const isNextTimeBusinessFinish = (timeString) => {
      const minute = [0, 30];
      const timeMoment = moment(timeString, 'HH:mm')
      if (timeMoment.minute() === 0) {
        timeMoment.add('30', 'minutes');
      } else {
        timeMoment.add('29', 'minutes');
      }
      const nextMoment = moment(businessTimeFinish, 'HH:mm');
      return timeMoment.isSameOrAfter(nextMoment);
    }

    //删除时间操作
    const deleteTime = (startTime, finishTime, rowIndex) => {
      deleteRow(startTime, finishTime, rowIndex)
    }

    //添加时间分段操作
    const createTime = () => {
      createRow(_timeString);
    }

    //修改时间分段操作
    const onChangeTime = (time, timeString) => {
      _timeString = timeString;
    }

    //是否显示时间选择器
    const onChangeOpenTimePicker = (open) => {
      this.setState({
        isOpenTimePicker: open,
      });
    }

    //渲染正常展示的form
    const renderTimeDetailForm = (startTime, finishTime) => {
      return (
        <span>
          {startTime} ～ {finishTime}
        </span>
      )
    }

    //渲染带删除操作的form
    const renderDeleteTimeForm = (startTime, finishTime, rowIndex) => {
      return (
        <span>
          <Icon type="close-circle-o" onClick={() => { deleteTime(startTime, finishTime, rowIndex) }} />&nbsp;
          {startTime} ～ {finishTime}
        </span>
      )
    }

    //渲染带编辑操作的form
    const renderEditForm = (startTime, finishTime, rowIndex, isShowDelete) => {
      //业务开始时间
      const businessStartMoment = moment(businessTimeStart, 'HH:mm');
      //业务结束时间
      const businessFinishMoment = moment(businessTimeFinish, 'HH:mm');

      //默认的时间范围
      const startMoment = moment(startTime, 'HH:mm');
      const finishMoment = moment(finishTime, 'HH:mm');

      //屏蔽显示的时间，从0开始到，最小的时间
      const startHour = startMoment.hour();
      const startMinutes = startMoment.minute();

      //timePicker 过滤不显示的小时
      function disabledHours() {
        //营业时间的开始和结束小时
        const businessStartHour = businessStartMoment.hour();
        const businessFinishHour = businessFinishMoment.hour();

        //
        const range = Helper.range(0, 24);

        //判断时间分段的开始时间，如果分钟时间大于59，则选择的小时增加一小时
        let nextHour = startHour;
        if (startMinutes >= 59 && nextHour < businessFinishHour) {
          nextHour += 1;
        }

        //判断当前的小时是否在营业范围内
        if (nextHour > businessStartHour) {
          range.splice(nextHour, businessFinishHour - nextHour + 1)
        } else {
          range.splice(businessStartHour, businessFinishHour - businessStartHour + 1)
        }

        return range;
      }

      //timePicker 过滤不显示的分钟
      function disabledMinutes(hour) {
        //默认时间分钟从 0～60 计算
        return Helper.range(0, 60).filter((value) => {
          //默认显示的分钟参数
          let acceptMinutes = [0, 30, 59];

          //判断 ‘当前的小时’ 与 ‘开始时间分段的小时’ 是否相同。相同则不显示 0
          if (hour === startHour) {
            //判断时间分段的分钟，是否小于30，如果小于30，则显示30
            if (startMinutes < 30) {
              acceptMinutes = [30, 59];
            } else {
              acceptMinutes = [59];
            }
          }

          //结束营业时间（小时，分钟）
          const businessFinishHour = businessFinishMoment.hour();
          const businessFinishMinute = businessFinishMoment.minute();

          //如果小时等于结束营业时间
          if (hour === businessFinishHour) {
            //判断结束营业时间的分钟，是否小于30，如果小于30，则显示0
            if (businessFinishMinute < 30) {
              acceptMinutes = [0];

            //判断结束营业时间的分钟，是否等于30，如果等于30，则显示0，30
            } else if (businessFinishMinute === 30) {
              //如果上一个时间分段的小时等于营业结束时间，判断上一个时间分段的分钟参数
              if (hour === startHour && startMinutes === 0) {
                acceptMinutes = [30];
              } else {
                acceptMinutes = [0, 30];
              }

            //判断结束营业时间的分钟，是否大于59，如果大于59，则显示0，30，59
            } else if (businessFinishMinute >= 59 && hour !== startHour) {
              acceptMinutes = [0, 30, 59];
            }
          }

          //过滤其他数据
          if (acceptMinutes.includes(value)) {
            return false;
          }
          return true;
        })
      }

      //初始化时间选择器
      const timePickerProps = {
        value: finishMoment,
        disabledMinutes,
        disabledHours,
        format: 'HH:mm',
        size: 'small',
        hideDisabledOptions: true,
        onChangeOpenTimePicker,
        onChange: onChangeTime,
        addon: () => (
          <Button size="small" type="primary" onClick={createTime}>
            添加时间分段
          </Button>
        ),
      };

      //显示删除按钮
      if (isShowDelete) {
        //编辑模式的最后一行，删除按钮，时间选择器
        return (
          <span>
            <Icon type="close-circle-o" onClick={() => { deleteTime(startTime, finishTime, rowIndex) }} />&nbsp;
            {startTime} ～ <TimePicker {...timePickerProps} />
          </span>
        )
      }

      //编辑模式的最后一行，时间选择器
      return (
        <span>
          {startTime} ～ <TimePicker {...timePickerProps} style={{ width: '160px' }} />
        </span>
      )
    }

    return {
      title: '时间分段',
      dataIndex: 'time',
      key: 'time',
      fixed: 'left',
      width: 190,
      render: (text, record, index) => {
        //默认的时间范围
        const startTime = text.start;
        const finishTime = text.finish;

        //如果不是最后一行
        if (index !== rowNum) {
          return renderDeleteTimeForm(startTime, finishTime, index);
        }

        //判断如果下一组时间是最后营业时间。则不显示操作
        if (isNextTimeBusinessFinish(startTime)) {
          return renderDeleteTimeForm(startTime, finishTime, index);
        }

        //是否显示删除
        const isShowDelete = (rowNum > 1);
        //返回编辑时间的form
        return renderEditForm(startTime, finishTime, index, isShowDelete);
      },
    }
  }

  //获取距离分段的列配置
  getDistanceColumn = (distances) => {
    const { getDistancePriceColumnForm } = this;

    return {
      title: '距离分段',
      dataIndex: 'distance',
      key: 'distanceKey',
      children: getDistancePriceColumnForm(distances),
    }
  }

  //获取距离价格的列配置
  getDistancePriceColumnForm = (distances) => {
    const { createColumn, deleteColumn, updateColumn, updatePriceBase, updatePriceExt } = this;
    const { deliveryDistanceMin, deliveryDistanceMax } = this.state;

    //保存要创建的距离分段数据
    const onChangeCreateDistance = (distance) => {
      updateColumn(distance);
    }

    //创建距离分段
    const createPriceColumn = () => {
      createColumn();
    }

    //删除距离分段
    const deletePirceColumn = (distanceMin, distanceMax, distanceIndex) => {
      deleteColumn(distanceMin, distanceMax, distanceIndex);
    }

    //渲染删除操作的距离分段标题
    const renderDistanceTitleDeleteForm = (distanceMin, distanceMax, distanceIndex) => (
      <div>
        <Icon type="close-circle-o" onClick={() => { deletePirceColumn(distanceMin, distanceMax, distanceIndex) }} />&nbsp; {distanceMin} ~ {distanceMax} km
      </div>
    )

    //渲染创建操作的距离分段标题
    const renderDistanceTitleCreateForm = (min, max, isShowDefaultDistance) => {
      //显示的最小距离
      const displayMin = isShowDefaultDistance ? deliveryDistanceMin : min;
      //输入框的最小距离数据
      const inputMin = min + 1;

      //判断，如果距离为0，则不限制距离选择
      if (deliveryDistanceMax === 0) {
        return (
          <div>
            <Icon type="plus-circle-o" onClick={() => { createPriceColumn() }} />&nbsp;
            {displayMin} ~ <InputNumber step={1} min={inputMin} value={max} onChange={onChangeCreateDistance} /> km
          </div>
        )
      }

      //如果分段距离到达最大限制，则不显示添加分段按钮
      if (max === deliveryDistanceMax) {
        return (
          <div>
            {displayMin} ~ <InputNumber step={1} min={inputMin} max={deliveryDistanceMax} value={max} onChange={onChangeCreateDistance} /> km
          </div>
        )
      }
      return (
        <div>
          <Icon type="plus-circle-o" onClick={() => { createPriceColumn() }} />&nbsp;
          {displayMin} ~ <InputNumber step={1} min={inputMin} max={deliveryDistanceMax} value={max} onChange={onChangeCreateDistance} /> km
        </div>
      )
    }

    //渲染默认的价格表单
    const renderDefaultPriceForm = (price, distance, row, col) => (
      <span>
        <InputNumber size="small" value={price} min={0} style={{ width: '50px' }} onChange={(e) => { updatePriceBase(e, row, col) }} />元/{distance}km
      </span>
    )

    //渲染额外计价的价格表单
    const renderExtraPriceForm = (price, pirceExt, distance, distanceExt, row, col) => (
      <span>
        <InputNumber size="small" value={price} min={0} style={{ width: '50px' }} onChange={(e) => { updatePriceBase(e, row, col) }} />元/{distance}km&nbsp;+&nbsp;
        <InputNumber size="small" value={pirceExt} min={0} style={{ width: '50px' }} onChange={(e) => { updatePriceExt(e, row, col) }} />元/{distanceExt}km
      </span>
    )

    //遍历距离分段数据，每段距离分段，创建一个价格表单
    const children = []
    distances.forEach((distanceValue, distanceIndex, distanceArray) => {
      //最小配送距离，不能小于默认配送距离
      const distanceMin = (distanceValue.distanceMin < deliveryDistanceMin) ? deliveryDistanceMin : distanceValue.distanceMin;

      //最大配送距离
      const distanceMax = distanceValue.distanceMax;

      //额外配送距离
      const distanceExt = distanceValue.distanceExt;

      //title标题
      let title;
      if (distanceIndex === distanceArray.length - 1) {
        //数据是否只有一列
        const isShowDefaultDistance = (distanceArray.length === 1);

        //如果是最后一列数据，则显示create表单
        title = renderDistanceTitleCreateForm(distanceMin, distanceMax, isShowDefaultDistance);
      } else {
        //如果不是最后一列数据，则显示delete表单
        title = renderDistanceTitleDeleteForm(distanceMin, distanceMax, distanceIndex);
      }

      //添加中间数据
      children.push({
        title,
        dataIndex: 'price',
        key: `distanceKey${distanceIndex}`,
        render: (text, record, rowIndex) => {
          // console.log('row ', rowIndex, ' col ', distanceIndex);
          //获取价格数据
          const price = text[rowIndex][distanceIndex];
          const { priceBase, priceExt } = price;

          // console.log('priceBase ', priceBase, ' priceExt ', priceExt);
          //如果是第一列数据，默认不带额外价格（暂时隐藏，所有数据都显示额外价格）
          if (distanceIndex === 0) {
            return renderDefaultPriceForm(priceBase, distanceMax, rowIndex, distanceIndex);
          }
          return renderExtraPriceForm(priceBase, priceExt, distanceMin, distanceExt, rowIndex, distanceIndex);
        },
      });
    });
    return children;
  }

  //更新基本价格
  updatePriceBase = (priceBase, row, col) => {
    const { time, distance, prices } = this.state;
    if (!prices[row] || !prices[row][col]) {
      message.info('价格数据格式，请刷新页面');
      return;
    }
    prices[row][col].priceBase = priceBase || 0;
    this.setState({
      prices,
      data: this.getData(time, distance, prices),
    })
    this.triggerFormChange(time, distance, prices);

    // console.log('updatePriceBase', priceBase, row, col);
  }

  //更新额外价格
  updatePriceExt = (priceExt, row, col) => {
    const { time, distance, prices } = this.state;
    if (!prices[row] || !prices[row][col]) {
      message.info('价格数据格式，请刷新页面');
      return;
    }
    prices[row][col].priceExt = priceExt || 0;
    this.setState({
      prices,
      data: this.getData(time, distance, prices),
    })
    this.triggerFormChange(time, distance, prices);

    // console.log('updatePriceExt', priceExt, row, col);
  }

  //更新列，更新距离分段数据
  updateColumn = (distanceMax) => {
    const { time, distance, prices } = this.state;

    //新的距离分段数据列表
    const newDistnce = distance.splice(0, distance.length - 1);
    //最后的距离分段
    const lastDistance = distance[distance.length - 1];
    //更新最后距离分段的数据
    const insertDistance = { distanceMin: lastDistance.distanceMin, distanceMax };
    newDistnce.push(insertDistance);

    this.setState({
      distance: newDistnce,
      data: this.getData(time, newDistnce, prices),
    })
    this.triggerFormChange(time, newDistnce, prices);
  }

  //创建列，添加距离分段数据
  createColumn = () => {
    const { time, distance, prices, deliveryDistanceMin, deliveryDistanceMax } = this.state;

    //新的距离分段数据
    const newDistnce = [].concat(distance);

    //最后一段距离分段数据
    const lastDistance = distance[distance.length - 1];
    const distanceMax = lastDistance.distanceMax;

    //如果已经是最大距离分段，则不再添加距离分段数据
    if (distanceMax !== deliveryDistanceMax) {
      newDistnce.push({ distanceMin: distanceMax, distanceMax: distanceMax + 1 });
    }

    //添加新列中的价格对象
    const newPrices = []
    prices.forEach((price, index, array) => {
      price.push(new PricePlan());
      newPrices[index] = price;
    })

    this.setState({
      distance: newDistnce,
      prices: newPrices,
      data: this.getData(time, newDistnce, newPrices),
    })
    this.triggerFormChange(time, newDistnce, newPrices);

    // console.log('createColumn', distance, newDistnce, newPrices);
  }

  //创建列，添加
  deleteColumn = (distanceMin, distanceMax, deleteIndex) => {
    const { time, distance, prices } = this.state;
    // console.log('deleteColumn', distanceMin, distanceMax, deleteIndex);

    //赋值数据
    const newDistnce = [].concat(distance);

    //判断是否是最后一行数据
    if (deleteIndex === newDistnce.length - 1) {
      //直接删除最后一行数据
      newDistnce.splice(deleteIndex, 1);
    } else {
      const deleteItem = newDistnce[deleteIndex];       //删除项目
      const nextItem = newDistnce[deleteIndex + 1];     //删除项目后一项

      //删除后插入的项目
      const insertItem = {
        distanceMin: deleteItem.distanceMin,
        distanceMax: nextItem.distanceMax,
      };

      //删除当前时间段，和前后时间段，将计算合并后的时间插入。
      newDistnce.splice(deleteIndex, 2, insertItem);
    }

    //添加新列中的价格对象
    const newPrices = []
    prices.forEach((price, index, array) => {
      price.splice(deleteIndex, 1);
      newPrices[index] = price;
    })

    this.setState({
      distance: newDistnce,
      prices: newPrices,
      data: this.getData(time, newDistnce, newPrices),
    }, () => {
      this.triggerFormChange(time, newDistnce, newPrices);
    });

    // console.log('deleteRow', distance, newDistnce);
  }

  //创建行，添加时间分段数据
  createRow = (timeString) => {
    const { time, distance, prices } = this.state;

    //新的时间分段
    const newTime = time.slice(0, time.length - 1);
    //获取最后一个时间
    const lastTime = time[time.length - 1];

    //获取最后一个时间的开始和结束
    const startTime = lastTime.start;
    const finishTime = lastTime.finish;

    if (startTime === timeString || timeString === finishTime || timeString === undefined) {
      message.info('时间分段重复，请重新选择');
      return;
    }

    //添加新的时间分段
    newTime.push({ start: startTime, finish: timeString });
    newTime.push({ start: timeString, finish: finishTime });

    //判断，如果时间分段不存在，则创建
    const row = prices.length;
    const newPrices = prices;
    newPrices[row] = [];
    for (let i = 0; i < distance.length; i += 1) {
      newPrices[row][i] = new PricePlan()
    }

    this.setState({
      time: newTime,
      data: this.getData(newTime, distance, newPrices),
      isOpenTimePicker: false,
    })
    this.triggerFormChange(newTime, distance, newPrices);

    // console.log(' timeString', timeString, newPrices);
  }

  //删除行，删除时间分段数据
  deleteRow = (startTime, finishTime, rowIndex) => {
    const { time, distance, prices, businessTimeStart, businessTimeFinish } = this.state;

    //赋值数据
    const newTime = [].concat(time);
    const newPirces = [].concat(prices);
    //删除相对应的价格列表列数据
    newPirces.splice(rowIndex, 1);

    //因为time数据填充0:00~0:00作为占位符号，所以第一行数据，索引从1开始算
    if (rowIndex === 0) {
      //判断是否删除第一行数据
      const nextTimeResult = time[rowIndex + 1];
      //需要插入的时间数据
      const insertTime = { start: businessTimeStart, finish: nextTimeResult.finish };
      //删除第一行和第二行数据，将计算合并后的时间插入。
      newTime.splice(rowIndex, 2, insertTime);
    } else if (rowIndex === time.length - 1) {
      //判断是否删除最后一行数据
      const prevTimeResult = time[rowIndex - 1];
      //需要插入的时间数据
      const insertTime = { start: prevTimeResult.start, finish: businessTimeFinish };
      //删除最后一行和倒二行数据，将计算合并后的时间插入。
      newTime.splice(rowIndex - 1, 2, insertTime);
    } else {
      //当前时间段数据
      const deleteTimeResult = time[rowIndex];
      //下一个时间段数据
      const nextTimeResult = time[rowIndex + 1];

      //合并当前时间段和下一个时间段数据
      const insertTime = { start: deleteTimeResult.start, finish: nextTimeResult.finish };

      //删除当前时间段，和前后时间段，将计算合并后的时间插入。
      newTime.splice(rowIndex, 2, insertTime);
    }

    this.setState({
      time: newTime,
      prices: newPirces,
      data: this.getData(newTime, distance, newPirces),
    })
    this.triggerFormChange(newTime, distance, newPirces);

    // console.log('deleteRow', time, newTime);
  }

  render() {
    const { getColumns } = this;
    const { data } = this.state;
    const columns = getColumns();

    return (
      <Row>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Table rowKey="key" columns={columns} dataSource={data} scroll={{ x: true }} bordered pagination={false} />
        </Col>
      </Row>
    )
  }
}

module.exports.PriceFormComponent = PriceFormComponent;
