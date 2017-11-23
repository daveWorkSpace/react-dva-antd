import is from 'is_js';
import dot from 'dot-prop';
import objectMapper from 'object-mapper';
import moment from 'moment';

import { ServiceState, BusinessMode, DeliveryType, DeliveryMode, PriceMode, PriceType, VerifyState, RegionRule, Unit, Roles, Gender, WorkType, OrganizationType, GoodsType } from '../define'
import { geography } from '../index'

//转换时间的transform
const transformTime = (value) => {
  const date = Date(value);
  const momentObject = moment(value);
  return {
    name: (value === '' || value === undefined) ? '' : momentObject.format('YYYY-MM-DD HH:mm:ss'),
    moment: (value === '' || value === undefined) ? moment() : momentObject,
    date,
  }
};

class CoreObject {

  //默认的数据映射表
  static datamap = () => {
    return {}
  }

  //遍历数据映射表，返回对象
  static mapper(value, ObjectClass = null) {
    //创建对象实例
    let instance;
    let datamap = {};
    if (ObjectClass !== null && typeof ObjectClass === 'function') {
      instance = new ObjectClass();
      datamap = ObjectClass.datamap()
    } else {
      instance = new this();
      datamap = this.datamap()
    }

    //如果数据为空，则map字典为空，防止objectMapper死循环的bug
    if (value === null) {
      datamap = {};
    }

    //object mapper
    const object = objectMapper(value, datamap);

    //返回实例对象
    return Object.assign(instance, object);
  }

  //遍历列表对象
  static mapperEach = (values, ObjectClass = null) => {
    //判断实例对象的类型
    if (is.not.existy(ObjectClass) || is.not.function(ObjectClass)) {
      return [];
    }

    //判断如果
    if (is.not.existy(values) || is.empty(values)) {
      return [];
    }

    const result = [];
    values.forEach((item, index) => {
      //获取遍历对象的实例
      const instance = new ObjectClass();
      //object mapper
      const object = objectMapper(item, ObjectClass.datamap());
      //添加实例对象到列表中
      result.push(Object.assign(instance, object));
    });
    return result;
  }

}

//通用的
class List extends CoreObject {
  constructor() {
    super();
    this.hasMore = false; //是否有更多
    this.data = [];       //数据列表
    this.total = 0;       //总条数
    this.page = 1;        //当前页码（默认从后台获取不到，需要赋值）
    this.size = 0;        //分页条数（默认从后台获取不到，需要赋值）
  }

  static datamap(objectClass) {
    return {
      '_meta.has_more': 'hasMore',
      '_meta.result_count': 'total',
      data: {
        key: 'data',
        transform: (value) => {
          return CoreObject.mapperEach(value, objectClass);
        },
      },
    };
  }

  static mapper(value, ObjectClass) {
    //根据ObjectClass类型，动态初始化列表数据
    const object = objectMapper(value, this.datamap(ObjectClass));
    //初始化实例对象
    const instance = new List();
    //赋值列表数据
    return Object.assign(instance, object);
  }
}

//申请审核的信息
class ApplyInfo extends CoreObject {
  constructor() {
    super()
    this.note = null;           //审核备注
    this.images = null;         //认证信息
    this.auditId = null;        //审核ID
    this.idCardSn = null;       //身份证号
    this.serviceState = null;   //状态（100 启用 -100 禁用）
  }
  static datamap = () => {
    return {
      note: 'note',
      images: 'images',
      audit_log_id: 'auditId',
      id_card_sn: 'idCardSn',
      state: {
        key: 'serviceState',
        transform: value => ({ name: ServiceState.description(value), value }),
      },
    }
  }
}

//服务商
class Vendor extends CoreObject {
  constructor() {
    super();
    this.id = null;               //服务商ID
    this.sn = null;               //服务商商户号
    this.walletId = null;         //钱包ID
    this.name = null;             //服务商名称
    this.city = {
      name: null,                 //城市名称
      code: null,                 //城市code
    }
    this.mobile = null;           //手机号
    this.serviceState = null;     //服务商状态
    this.verifyState = null;      //服务商审核状态（0 待提交 1 待审核 -100 驳回 100 通过）
    this.isSub = null;            //是否为子服务商
    this.applyInfo = null;        //申请审核的信息
    this.profile = {
      legalName: null,            //法人姓名
      idCardSn: null,             //法人身份证号
    }
    this.createTime = null;       //创建时间
  }
  static datamap() {
    return {
      id: 'id',
      vendor_no: 'sn',
      wallet_id: 'walletId',
      name: 'name',
      mobile: 'mobile',
      state: {
        key: 'serviceState',
        transform: value => ({ name: ServiceState.description(value), value }),
      },
      verify_state: {
        key: 'verifyState',
        transform: value => ({ name: VerifyState.description(value), value }),
      },
      city_code: {
        key: 'city',
        transform: value => ({ name: geography.cityName(value), code: value }),
      },
      is_sub: 'isSub',
      apply_info: {
        key: 'applyInfo',
        transform: (value) => {
          return CoreObject.mapper(value, ApplyInfo)
        },
      },
      biz_profile: {
        key: 'profile',
        transform: value => ({
          legalName: dot.get(value, 'legal_name'),
          idCardSn: dot.get(value, 'id_card_sn'),
        }),
      },
      created_at: {
        key: 'createTime',
        transform: transformTime,
      },
    }
  }
}

//商户
class Seller extends CoreObject {
  constructor() {
    super()
    this.id = null;            //商户ID
    this.sn = null;            //商户号
    this.walletId = null;      //钱包ID
    this.shopId = null;        //商户ID
    this.name = null;          //商户名称
    this.mobile = null;        //手机号
    this.type = null;          //商户类型
    this.state = null;         //状态
    this.verifyState = null;   //审核状态
    this.orderCount = null;    //订单总数
    this.city = {
      name: null,              //城市名称
      code: null,              //城市编码
    };
    this.profile = null;       //商户基础信息
    this.applyInfo = null;     //申请审核信息
    this.createdTime = null;   //创建时间
  }
  static datamap() {
    return {
      id: 'id',
      seller_no: 'sn',
      wallet_id: 'walletId',
      default_shop_id: 'shopId',
      name: 'name',
      mobile: 'mobile',
      seller_type: {
        key: 'type',
        transform: value => ({ name: GoodsType.description(value), value }),
      },
      state: {
        key: 'serviceState',
        transform: value => ({ name: ServiceState.description(value), value }),
      },
      verify_state: {
        key: 'verifyState',
        transform: value => ({ name: VerifyState.description(value), value }),
      },
      order_count: 'orderCount',
      city_code: {
        key: 'city',
        transform: value => ({ name: geography.cityName(value), code: value }),
      },
      biz_profile: {
        key: 'profile',
        transform: value => ({
          legalName: dot.get(value, 'legal_name'),
          idCardSn: dot.get(value, 'id_card_sn'),
        }),
      },
      apply_info: {
        key: 'applyInfo',
        transform: (value) => {
          return CoreObject.mapper(value, ApplyInfo)
        },
      },
      created_at: {
        key: 'createTime',
        transform: transformTime,
      },
    }
  }
}

//定价方案
class PricePlan extends CoreObject {

  constructor() {
    super();
    this.time = {     //时间分段
      start: '',      //开始时间
      finish: '',     //结束时间
    };
    this.distanceExt = 1;   //超出基准距离X公里，默认1公里为单位距离
    this.distanceMax = 0;   //最大距离
    this.distanceMin = 0;   //最小距离
    this.priceBase = 0;     //基本价格
    this.priceExt = 0;      //超出范围的价格和距离
  }

  //返回数据反向映射的所有数据（阶梯定价使用）
  revert = () => {
    return objectMapper(this, PricePlan.revertMap());
  }

  //返回数据反向映射的基本价格（一口价使用）
  revertPriceBase = () => {
    const revertMap = {
      priceBase: {
        key: 'base_price',
        transform: value => Unit.exchangePriceToCent(value),
      },
    }
    return objectMapper(this, revertMap);
  }

  //反向数据映射
  static revertMap() {
    return {
      time: {
        key: 'time_span',
        transform: value => ([dot.get(value, 'start'), dot.get(value, 'finish')]),
      },
      priceBase: {
        key: 'base_price',
        transform: value => Unit.exchangePriceToCent(value),
      },
      priceExt: {
        key: 'ext_price',
        transform: value => Unit.exchangePriceToCent(value),
      },
      distanceExt: {
        key: 'ext_distance',
        transform: value => Unit.exchangeDistanceToMetre(value),
      },
      distanceMax: {
        key: 'max_distance',
        transform: value => Unit.exchangeDistanceToMetre(value),
      },
      distanceMin: {
        key: 'min_distance',
        transform: value => Unit.exchangeDistanceToMetre(value),
      },
    }
  }

  static datamap = () => {
    return {
      time_span: {
        key: 'time',
        transform: value => ({
          start: dot.get(value, '0'),
          finish: dot.get(value, '1'),
        }),
      },
      base_price: {
        key: 'priceBase',
        transform: value => Unit.exchangePriceToYuan(value),
      },
      ext_price: {
        key: 'priceExt',
        transform: value => Unit.exchangePriceToYuan(value),
      },
      ext_distance: {
        key: 'distanceExt',
        transform: value => Unit.exchangeDistanceToKilometre(value),
      },
      max_distance: {
        key: 'distanceMax',
        transform: value => Unit.exchangeDistanceToKilometre(value),
      },
      min_distance: {
        key: 'distanceMin',
        transform: value => Unit.exchangeDistanceToKilometre(value),
      },
    };
  }
}

//产品服务
class Service extends CoreObject {

  constructor() {
    super();
    this.id = null;                   //id
    this.vendorId = null;             //承运商id
    this.name = null;                 //产品名称
    this.serviceState = null;         //产品状态
    this.businessMode = null;         //业务模式(10:本地生活圈 20:落地配（无存储） 25：落地配（有存储）30：快递)
    this.businessTime = [];           //营业时间
    this.deliveryTime = 0;            //配送时间 (分钟)
    this.deliveryType = null;         //配送类型（10：商家发货 20：站点发货）
    this.deliveryMode = null;         //配送模式（10：及时送 20：预约送）
    this.deliveryDistanceMin = 0;     //配送发单最小距离
    this.deliveryDistanceMax = 10;    //配送发单最大距离(默认10km)
    this.regionRule = null;           //判区规则
    this.pricePlan = [];              //定价方案
    this.priceMode = null;            //定价模式（1:一口价，2:阶梯定价）
    this.priceType = null;            //定价类型（21:距离加时间阶梯价 22:距离阶梯价 23:时间阶梯价）
    this.createTime = null;           //创建时间
    this.updateTime = null;           //更新时间

    this._revertPricePlan = [];       //反向映射的定价方案 (私有)
  }

  //反向映射获取定价数据
  get revertPricePlan() {
    //判断如果定价数据不存在，则直接返回空
    if (is.not.existy(this.pricePlan) || is.empty(this.pricePlan)) {
      return '[]';
    }

    //遍历价格数据，反向生成json
    const result = [];
    this.pricePlan.forEach((item, index) => {
      //判断是否是一口价，如果是一口价，则使用一口价的格式
      if (this.priceMode.value === PriceMode.standPriceMode) {
        result.push(item.revertPriceBase());
      }
      //判断是否是阶梯定价，如果是阶梯定价，则使用阶梯定价的格式
      if (this.priceMode.value === PriceMode.levelPriceMode) {
        result.push(item.revert());
      }
    });
    return result;
  }
  set revertPricePlan(value) {
    this._revertPricePlan = value;
  }

  static datamap = () => {
    return {
      id: 'id',
      vendor_id: 'vendorId',
      name: 'name',
      state: {
        key: 'serviceState',
        transform: value => ({ name: ServiceState.description(value), value }),
      },
      biz_mode: {
        key: 'businessMode',
        transform: value => ({ name: BusinessMode.description(value), value }),
      },
      biz_time: {
        key: 'businessTime',
        transform: value => ({
          start: dot.get(value, '0'),
          finish: dot.get(value, '1'),
        }),
      },
      delivery_time: 'deliveryTime',
      delivery_type: {
        key: 'deliveryType',
        transform: value => ({ name: DeliveryType.description(value), value }),
      },
      dispatch_mode: {
        key: 'deliveryMode',
        transform: value => ({ name: DeliveryMode.description(value), value }),
      },
      max_distance: {
        key: 'deliveryDistanceMax',
        transform: value => Unit.exchangeDistanceToKilometre(value),
      },
      region_hit_rule_type: {
        key: 'regionRule',
        transform: value => ({ name: RegionRule.description(value), value }),
      },
      plan_type: {
        key: 'priceType',
        transform: value => ({ name: PriceType.description(value), value }),
      },
      price_mode: {
        key: 'priceMode',
        transform: value => ({ name: PriceMode.description(value), value }),
      },
      price_plan: {
        key: 'pricePlan',
        transform: (value) => {
          return CoreObject.mapperEach(value, PricePlan)
        },
      },
      created_at: {
        key: 'createTime',
        transform: transformTime,
      },
      updated_at: {
        key: 'updateTime',
        transform: transformTime,
      },
    };
  }
}

//签约信息
class Contract extends CoreObject {
  constructor() {
    super();
    this.id = null;                   //id
    this.cancleTime = null;           //解约时间
    this.createTime = null;           //创建时间,签约时间
    this.updateTime = null;           //更新时间
  }
  static datamap = () => {
    return {
      id: 'id',
      unsigned_at: {
        key: 'cancleTime',
        transform: transformTime,
      },
      created_at: {
        key: 'createTime',
        transform: transformTime,
      },
      updated_at: {
        key: 'updateTime',
        transform: transformTime,
      },
    }
  }
}

//区域围栏
class Region extends CoreObject {
  constructor() {
    super();
    this.id = null;               //围栏ID
    this.serviceState = null;     //围栏状态
    this.polygon = {
      type: null,                 //坐标类型
      coordinates: [],            //坐标围栏
    }
  }
  static datamap = () => {
    return {
      id: 'id',
      state: {
        key: 'serviceState',
        transform: value => ({ name: ServiceState.description(value), value }),
      },
      bd_polygon: {
        key: 'polygon',
        transform: value => ({
          type: dot.get(value, 'type'),
          coordinates: dot.get(value, 'coordinates'),
        }),
      },
    }
  }
}

//区域
class Area extends CoreObject {
  constructor() {
    super()
    this.id = null;                        //商圈ID
    this.vendorId = null;                  //所属服务商ID
    this.name = null;                      //商圈名称
    this.serviceState = null;              //商圈状态
    this.city = {
      name: null,                          //城市名称
      code: null,                          //城市code
    }
    this.province = null;                  //省份编号
    this.division = null;                  //区／县编号
    this.isSubArea = null;                 //是否为子区域
    this.isSetOrderDeliveryRule = null;    //是否设置运力分单规则
    this.isSetCourierDeliveryRule = null;  //是否设置骑士分单规则
    this.subAreas = [];                    //子区域信息
    this.stocks = [];                      //区域相关的仓库
    this.stations = [];                    //区域相关的站点
    this.supplier = [];                    //合作承运商
    this.regionInfo = null;                //围栏信息
    this.parentId = null;                  //父区域id
    this.parent = null;                    //父区域信息
    this.createTime = null;                //创建时间
    this.updateTime = null;                //更新时间
  }

  static datamap = () => {
    return {
      id: 'id',
      vendor_id: 'vendorId',
      name: 'name',
      state: {
        key: 'serviceState',
        transform: value => ({ name: ServiceState.description(value), value }),
      },
      city_code: {
        key: 'city',
        transform: value => ({ name: geography.cityName(value), code: value }),
      },
      province_code: 'province',
      division_code: 'division',
      is_sub_area: 'isSubArea',
      is_set_order_delivery_rule: 'isSetOrderDeliveryRule',
      is_set_courier_delivery_rule: 'isSetCourierDeliveryRule',
      sub_areas: {
        key: 'subAreas',
        transform: (value) => {
          return CoreObject.mapperEach(value, Area)
        },
      },
      inventory_stocks: 'stocks',
      dispatch_stocks: 'stations',
      supply_list: {
        key: 'supplier',
        transform: (value) => {
          return CoreObject.mapperEach(value, Vendor)
        },
      },
      parent_area_id: 'parentId',
      parent_area: {
        key: 'parent',
        transform: (value) => {
          return CoreObject.mapper(value, Area)
        },
      },
      region_info: {
        key: 'regionInfo',
        transform: (value) => {
          return CoreObject.mapper(value, Region)
        },
      },
      created_at: {
        key: 'createTime',
        transform: transformTime,
      },
      updated_at: {
        key: 'updateTime',
        transform: transformTime,
      },
    }
  }
}

//仓库
class Stock extends CoreObject {

  constructor() {
    super();
    this.id = null;                 //仓库id
    this.name = null;               //仓库名
    this.state = null;              //仓库状态（100：启用 -100：禁用）
    this.isInventory = null;        //是否有库房能力
    this.isDelivery = null;         //是否有配送能力
    this.admin = null;              //仓库负责人
    this.mobile = null;             //手机
    this.poi = {
      longitude: null,              //经度
      latitude: null,               //纬度
    }
    this.city = {
      name: null,                   //城市名称
      code: null,                   //城市编码
    };
    this.address = null;            //地址
    this.addressDetail = null;      //详细地址
    this.vendorId = null;           //服务商ID
    this.vendorName = null;         //服务商名称
    this.supplyVendorId = null;     //承运商ID
    this.supplyVendorName = null;   //承运商名称
    this.operatorId = null;         //操作人ID
    this.operatorName = null;       //操作人名称
    this.areas = [];                //覆盖区域列表
    this.services = [];             //服务列表
    this.updateTime = null;         //更新时间
    this.createTime = null;         //创建时间
  }

  static datamap = () => {
    return {
      id: 'id',
      name: 'name',
      state: {
        key: 'serviceState',
        transform: value => ({ name: ServiceState.description(value), value }),
      },
      is_dispatch: {
        key: 'isDelivery',
        transform: value => ({ name: value ? '有' : '无', value }),
      },
      is_inventory: {
        key: 'isInventory',
        transform: value => ({ name: value ? '有' : '无', value }),
      },
      master: 'admin',
      mobile: 'mobile',
      city_code: {
        key: 'city',
        transform: value => ({ name: geography.cityName(value), code: value }),
      },
      address: 'address',
      address_detail: 'addressDetail',
      bd_poi: {
        key: 'poi',
        transform: value => ({ longitude: dot.get(value, '0'), latitude: dot.get(value, '1') }),
      },
      vendor_id: 'vendorId',
      vendor_info: {
        key: 'vendorName',
        transform: value => (dot.get(value, 'name')),
      },
      supply_vendor_id: 'supplyVendorId',
      supply_vendor_info: {
        key: 'supplyVendorName',
        transform: value => (dot.get(value, 'name')),
      },
      operator_id: 'operatorId',
      operator: {
        key: 'operatorName',
        transform: value => (dot.get(value, 'name')),
      },
      areas: {
        key: 'areas',
        transform: (value) => {
          return CoreObject.mapperEach(value, Area)
        },
      },
      services: {
        key: 'services',
        transform: (value) => {
          return CoreObject.mapperEach(value, Service)
        },
      },
      created_at: {
        key: 'createTime',
        transform: transformTime,
      },
      updated_at: {
        key: 'updateTime',
        transform: transformTime,
      },
    };
  }
}

//授权对象
class Auth extends CoreObject {
  constructor() {
    super();
    this.role = null;         //角色信息
    this.mobile = null;       //手机号
    this.walletId = null;     //当前登录者ID
    this.vendorId = null;     //钱包ID
    this.accountId = null;    //服务商ID
    this.accessToken = null;  //Access token
    this.refreshToken = null; //Refresh token
    this.expiredTime = null;  //过期时间
  }

  static datamap() {
    return {
      role: {
        key: 'role',
        transform: value => ({ name: Roles.description(value), value }),
      },
      mobile: 'mobile',
      wallet_id: 'walletId',
      vendor_id: 'vendorId',
      account_id: 'accountId',
      access_token: 'accessToken',
      refresh_token: 'refreshToken',
      expired_at: {
        key: 'expiredTime',
        transform: transformTime,
      },
    }
  }
}

//账户信息
class Account extends CoreObject {
  constructor() {
    super();
    this.id = null;               //账户ID
    this.sn = null;               //工号
    this.name = null;             //名称
    this.gender = null;           //性别
    this.mobile = null;           //手机号
    this.account = null;          //账号
    this.serviceState = null;     //状态
    this.city = {
      name: null,                 //城市名称
      code: null,                 //城市code
    }
    this.orgId = null;            //组织ID
    this.orgType = null;          //组织类型 (1、服务商,2、商户,3、平台,4、骑士)
    this.workType = null;         //工作类型（全职：10 兼职：20）
    this.idCardSn = null;         //身份证号
    this.isOwnerAccount = null;   //是否是主服务商
    this.hiredTime = null;        //入职时间
    this.createTime = null;       //创建时间
  }
  static datamap() {
    return {
      id: 'id',
      code: 'sn',
      name: 'name',
      sex: {
        key: 'gender',
        transform: value => ({ name: Gender.description(value), value }),
      },
      mobile: 'mobile',
      account: 'account',
      state: {
        key: 'serviceState',
        transform: value => ({ name: ServiceState.description(value), value }),
      },
      city_code: {
        key: 'city',
        transform: value => ({ name: geography.cityName(value), code: value }),
      },
      org_id: 'orgId',
      org_type: {
        key: 'orgType',
        transform: value => ({ name: OrganizationType.description(value), value }),
      },
      work_type: {
        key: 'workType',
        transform: value => ({ name: WorkType.description(value), value }),
      },
      id_card_sn: 'idCardSn',
      is_owner: 'isOwnerAccount',
      hired_date: {
        key: 'hiredTime',
        transform: (value) => {
          const momentObject = moment(`${value}`, 'YYYYMMDD');
          const date = momentObject.toDate();
          return {
            name: (value === '' || value === undefined) ? '' : momentObject.format('YYYY-MM-DD'),
            moment: (value === '' || value === undefined) ? moment() : momentObject,
            date,
          }
        },
      },
      created_at: {
        key: 'createTime',
        transform: transformTime,
      },
    }
  }
}

module.exports = {
  List,
  Service,
  PricePlan,
  Stock,
  Area,
  Vendor,
  Contract,
  Auth,
  Account,
}
