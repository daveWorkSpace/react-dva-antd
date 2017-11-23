###嗷嗷项目antd2.8.3升级问题总结
* 设置state时不能使用对象赋值的形式
* 经过 getFieldDecorator 包装的控件后，不能用控件的 value defaultValue 等属性来设置表单域的值，默认值可以用 getFieldDecorator 里的 initialValue
* table需添加 unique key

###未解决报错信息，以下报错影响功能正常使用
* 业务中心->商家管理->签约列表->编辑：关于TimePicker defaultValue 必须是moment对象，目前已添加moment对象，仍然报错

 	**报错已消失，非人工解决**
 	
	```
	Error: The value/defaultValue of TimePicker must be a moment object after `antd@2.0`
	```
* 业务中心->供应商管理->供应商信息：关于props类型的问题，目前暂时没有找到代码中有问题的 boolean类型变量（已解决）

	**已解决, 注意:**
	* option的value值只能是字符串，不能是布尔值
	* select的initialValue 需要有默认值，可设为空
	
	
	```
	Failed prop type: Invalid prop `value` of type `boolean` supplied to `Option`, expected `string`
	```
	



###未解决报错信息，以下报错都不影响功能正常使用
* 业务中心区域管理state报错（返回的函数应该是个纯函数）
* 业务中心团队列表报错（已解决）
	```
	Unknown props `root`, `eventKey`, `pos`, `selectable`, `loadData`, `onRightClick`, `prefixCls`, `showLine`, `showIcon`, `dragOver`, `dragOverGapTop`, `dragOverGapBottom`, `_dropTrigger`, `expanded`, `openTransitionName`, `openAnimation`, `filterTreeNode` on <div> tag. Remove these props from the element.
	```
* 未知报错，以业务中心为主，初次判断应该是setState设置方法不当引起的（已解决）
	```
	setState(...): Can only update a mounted or mounting component. This usually means you called setState() on an unmounted component. This is a no-op. Please check the code for the Router component
	```
* 业务中心->商家管理->签约列表->详情：
	```
	Each child in an array or iterator should have a unique "key" prop. Check the render method of `View_detail`. See https://fb.me/react-warning-keys for more information.
	```
* 业务中心->商家管理->签约列表->编辑：关于table key值的报错，代码中无法找到唯一的key值（已解决）
	```
	Each record in table should have a unique `key` prop,or set `rowKey` to an unique primary key
	```
	
	
