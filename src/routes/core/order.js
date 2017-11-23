//站点操作路由
const subRoutes = [
  // 订单管理 - 订单看板 - 直营项目
  {
    path: 'board/direct',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('../../components/order/orderBoard/direct'));
      });
    },
  },
  // 订单管理 - 订单看板 - 直营项目 - 看板明细
  {
    path: 'board/direct/detail',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('../../components/order/orderBoard/directDetail'));
      });
    },
  },
  // 订单管理 - 订单看板 - 加盟项目
  {
    path: 'board/affiliate',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('../../components/order/orderBoard/affiliate'));
      });
    },
  },
  // 订单管理 - 订单看板 - 加盟项目 - 看板明细
  {
    path: 'board/affiliate/detail',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('../../components/order/orderBoard/affiliateDetail'));
      });
    },
  },
  // 订单管理 - 异常单列表 - 直营订单
  {
    path: 'exception/direct',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('../../components/order/exceptionOrder/direct'));
      });
    },
  },
  // 订单管理 - 异常单列表 - 加盟订单
  {
    path: 'exception/affiliate',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('../../components/order/exceptionOrder/affiliate'));
      });
    },
  },
  // 订单管理 - 异常单列表 - 直营订单 - 订单详情
  {
    path: 'exception/direct/detail',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('../../components/order/exceptionOrder/directDetail'));
      });
    },
  },
  // 订单管理 - 异常单列表 - 加盟订单 - 订单详情
  {
    path: 'exception/affiliate/detail',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('../../components/order/exceptionOrder/affiliateDetail'));
      });
    },
  },
  // 订单管理 - 订单查询
  {
    path: 'search',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('../../components/order/orderInquiry'));
      });
    },
  },
  // 订单管理 - 订单明细下载 - 日订单
  {
    path: 'download/daily',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('../../components/order/download/daily'));
      });
    },
  },
  // 订单管理 - 订单明细下载 - 日订单new
  {
    path: 'download/day',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('../../components/order/download/day'));
      });
    },
  },
  // 订单管理 - 订单明细下载 - 月订单
  {
    path: 'download/monthly',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('../../components/order/download/monthly'));
      });
    },
  },
  // 订单管理 - 服务商订单详情 - 统一入口
  {
    path: 'details',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('../../components/order/core/orderDetails'));
      });
    },
  },
];
module.exports = {
  path: 'order',
  childRoutes: subRoutes,
}
