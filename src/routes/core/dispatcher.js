//站点操作路由
const subRoutes = [
  // 到站收货
  {
    path: 'arrive',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('../../components/dispatcher/arrive'));
      });
    },
  },
  // 揽收入站
  {
    path: 'pullin',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('../../components/dispatcher/pullin'));
      });
    },
  },
  // 骑士领货
  {
    path: 'knight/delivery',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('../../components/dispatcher/knightDelivery'));
      });
    },
  },
  // 中转出站
  {
    path: 'transfer',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('../../components/dispatcher/transfer'));
      });
    },
  },
  // 退货入站
  {
    path: 'sales/inbound',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('../../components/dispatcher/salesInbound'));
      });
    },
  },
  // 退货出站
  {
    path: 'sales/outbound',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('../../components/dispatcher/salesOutbound'));
      });
    },
  },
  // 待骑士确认订单
  {
    path: 'knight/affirm',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('../../components/dispatcher/knightAffirmOrder'));
      });
    },
  },
  // 异常单处理
  {
    path: 'exception/order',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('../../components/dispatcher/exceptionOrder'));
      });
    },
  },
  // 配送单查询
  {
    path: 'distribution/order',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('../../components/dispatcher/distributionOrder'));
      });
    },
  },
  // 中转单查询
  {
    path: 'transfer/order',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('../../components/dispatcher/transferOrder'));
      });
    },
  },
  // 仓订单详情
  {
    path: 'order/details',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('../../components/dispatcher/core/orderDetails'));
      });
    },
  },
  // 入站记录表
  {
    path: 'inbound/record',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('../../components/dispatcher/operateRecord/inboundRecord'));
      });
    },
  },
  // 出站记录表
  {
    path: 'outbound/record',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('../../components/dispatcher/operateRecord/outboundRecord'));
      });
    },
  },
];
module.exports = {
  path: 'dispatcher',
  childRoutes: subRoutes,
}
