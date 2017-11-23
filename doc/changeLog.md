date: 2017-07-31
branch: release/v2.4.0
change:
  - 嗷嗷管家，业务全面重构等
  - 添加核心库功能，修改授权，路由，模块加载方式等
  - 添加仓库，分拨等新的业务模块

date: 2017-04-28
branch: feature_account_authorize
change:
  - 添加多账号切换
  - 修改登陆授权流程，登陆后先选择服务商，后进行授权切换
  - 修改路由加载方式，授权判断流程
  - 调整项目的模块结构，准备后续迁移模块。删除原有登陆模块，添加授权模块。
  - 调整布局，修改样式等等

date: 2017-04-24
branch: feature_undefined_debug
author: Alihanniba
change:
  - 修改区域列表状态切换状态bug

date: 2017-04-22
branch: hotfix/v2.2.1
change:
  - 分单中心修改城市数据获取来源
  - 骑士分单规则修改城市数据获取来源
  - 订单分单规则修改城市数据获取来源

date: 2017-04-20
branch: feature/feature_single_city_and_optimize
change:
  - 修复单城市的多个兼容问题
  - 重构团队管理模块化问题
  - 修正团队管理模块中的菜单点击问题
  - 修正全局通知栏目更新问题，添加全局通知栏目关闭功能
  - 添加打包脚本的build raw模式
  - 修正删除分单规则时重复调用的问题

date: 2017-04-19
branch: feature/feature_single_city_and_optimize
change:
  - 修改服务商为单城市
  - 产品服务设置营业时间支持设置到23：59
  - 添加系统通知栏
  - 骑士离岗状态检测，骑士离职二次确认
  - 修改部分页面样式
  - 升级ant.design部分兼容问题

date: 2017-04-17
branch: release/v2.2.0
author: Alihanniba
change:
  - 解决分单规则城市获取失败的问题
  - 解决添加骑士时，骑士入职时间选择完没有显示在列表问题
  - ［区域管理］新注册服务商，添加区域没有显示，切换其他城市在返回会显示数据

date: 2017-04-13
branch: release/v2.2.0
change:
  - 修正webpack配置错误导致的打包失败问题
  - 删除与配置文件冲突的import

date: 2017-04-12
branch: hotfix/v2.1.1
change:
  - 修正加盟规则中获取数据的问题，修正加盟列表刷新后城市数据显示错误的问题

date: 2017-04-10
branch: feature/feature_upgrade_dva
change:
  - 添加签约列表中的营业时间修正，修正错误格式导致的显示问题
  - 修正签约列表中的阶梯定价时间显示

date: 2017-04-07
branch: feature/feature_upgrade_dva
change:
  - 测试dva重构后的业务流程
  - 修正加盟项目中，骑士分单规则查询功能
  - 修复调度中心model层调用错误问题

date: 2017-04-05
branch: release/v2.0.21
author: dave
change:
  - 版本升级为2.0.21,打包部署正式

date: 2017-03-30
branch: feature/feature_upgrade_dva
change:
  - 升级dva
  - 升级除ant.design外的所有模块
  - 重构model层所有模块
  - 重构action方法
  - 修复各种问题等等

date: 2017-03-30
branch: release/v2.0.21
author: dave
change:
  - 版本升级为2.0.21,打包部署测试

date: 2017-03-29
branch: feature/feature_personaCenter_addSellerId
author: dave
change:
  - 我的服务商信息中添加商户ID,详情信息具体字段显示
  - 调度中心 物流追踪记录倒序显示

date: 2017-03-27
branch: release/v2.0.20
author: dave
change:
  - 版本升级为2.0.20 打包正式

date: 2017-03-24
branch: release/v2.0.20
author: dave
change:
  - 骑士的编辑与审核规则调整

date: 2017-03-24
branch: feature/seller_add_contractId
author: dave
change:
  - 签约列表-签约详情添加显示签约ID字段、解约时间字段

date: 2017-03-23
branch: feature/feature_add_select_keyword
author: dave
change:
  - 骑士编辑增加修改所属城市 增加关键字搜索
  - 骑士编辑修改所属城市 默认团队数据清空  该城市下没有之前城市下的团队

date: 2017-03-22
branch: feature/feature_add_select_keyword
author: dave
change:
  - 删除团队模块下的public.js
  - 项目管理下的城市下拉框增加关键字搜索
  - 员工管理添加员工 可选城市下拉框增加关键字搜索
  - 团队管理:添加页和编辑页所属团队支持关键字搜索
  - 添加新团队后显示当前所添加的所属城市的数据

date: 2017-03-22
branch: feature/feature_operation_optimize_v2.1
author: hejiaoyan
change:
  - 修复分单中心，切换城市后，点击项目无对应的数据

date: 2017-03-22
branch: feature/feature_dispatch_center_city_switch_debug
author: alihanniba
change:
  - 城市选择器位置调整及高亮显示

date: 2017-03-22
branch: feature/feature_dispatch_center_state_debug
author: alihanniba
change:
  - 清空数据debug

date: 2017-03-22
branch: feature/feature_dispatch_center_add_city_selector
author: alihanniba
change:
  - 调度中心添加城市切换
    1.城市切换
    2.城市与区域联动
    3.返回状态记录

date: 2017-03-20
branch: feature/feature_manage_add_city_and_areapage
author: dave
change:
  - 直营项目订单分单规则、骑士分单规则的区域列表 增加城市搜索条件
  - 加盟项目骑士分单规则的区域列表 增加城市搜索条件
  - 直营项目下区域数据的总数统计、关键字搜索
  - 加盟项目下区域数据的总数统计、关键字搜索

date: 2017-03-17
branch: feature/debug_service_store_city
author: alihanniba
change:
  - 线上环境debug


date: 2017-03-17
branch: feature/debug_service_store_city
author: alihanniba
change:
  - 添加 seller model fetchCityList 方法引用

date: 2017-03-17
branch: feature/feature_area_map
author: jian.han
change:
  - 修复区域无法保存，无法发布的问题
  - 修复未保存区域，不显示定位中心的问题

date: 2017-03-17
branch: feature/team_add_changecity_default
author: dave
change:
  - 团队切换城市后左侧导航默认切换到所有骑士 右侧模块数据同步
  - 项目模块规则列表所有设置字段改为已设置
  - 供应商添加成功后自动切换到添加的城市下的列表信息
  - 合作区域添加成功后自动切换到添加的城市下的列表信息

date: 2017-03-16
branch: feature/feature_optimize_filter
author: dave
change:
  - 修改团队搜索条件与分页切换数据不同步
  - 待审核骑士城市切换数据不同步问题
  - 项目模块筛选条件设置改为已设置

date: 2017-03-16
branch: feature/feature_reset_dispatch_page
change:
  - 1.bug修复：商家列表按城市、签约状态查询
  - 2.bug修复：商家列表显示签约字段、注册手机
  - 12.调度中心：添加查询条件，按商户订单号查询，显示在骑士名称查询条件前面；输入框中提示文字显示：请输入订单编号
  - 7.分单中心：分单规则设置链接跳转
  - 9.调度中心：订单详情页物流追踪操作记录倒序显示
  - 10.订单详情查询：订单详情页物流追踪操作记录倒序显示

date: 2017-03-15
branch: feature/feature_optimize_filter
author: dave
change:
  - 修改添加区域默认城市问题
  - 取消供应商管理两级页面城市数据同步问题
  - 修改供应商查询同级页面城市保持一致、区域添加及区域查询保持城市一致

date: 2017-03-15
branch: feature/feature_add_field_by_order_v2.0
change:
  - 修改调度中心记录历史记录bug
  - 修改刷新bug
  - 切换tab默认回到第一页

date: 2017-03-15
branch: feature/feature_oparation_optimize_v2.0
change:
  - 开发重新分单
  - 开发关闭订单
  - 后台接口未完成，前端功能已隐藏
  - 修改商家列表页表头

date: 2017-03-015
author: dave
branch: feature/control_center_add_assign
change:
  - 项目管理直营项目 订单分单规则增加区域关键词搜索功能
  - 项目管理直营项目 骑士分单规则增加区域关键词搜索功能
  - 项目管理直营项目 骑士分单规则增加状态筛选功能
  - 项目管理加盟项目 骑士分单规则增加区域关键词搜索功能
  - 项目管理加盟项目 骑士分单规则增加状态筛选功能

date: 2017-03-14
branch: feature/feature_add_field_by_order
change:
 - 调度中心存储历史记录
 - 刷新默认重置为第一页

date: 2017-03-14
branch: feature/feature_oparation_optimize
change:
  - 服务商列表分页请求
  - 异常订单列表城市和日期切换bug
  - 页面添加标题

date: 2017-03-014
author: dave
branch: feature/control_center_add_assign
change:
  - 项目管理直营项目 订单分单规则编辑(增加区域时)提示优先级存在问题
  - 项目管理直营项目 添加订单分单规则状态筛选功能
