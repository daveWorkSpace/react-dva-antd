//项目管理路由
const subRoutes = [
  //业务中心 - 产品服务设置
  {
    path: 'service',
    childRoutes: [{
      path: 'list',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('../../components/business/service'));
        })
      },
    },
    {
      path: 'update',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('../../components/business/service/update'));
        })
      },
    },
    {
      path: 'create',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('../../components/business/service/create'));
        })
      },
    },
    {
      path: 'detail',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('../../components/business/service/detail/index'));
        })
      },
    },
    ],
  },
  //区域管理
  {
    path: 'area',
    childRoutes: [{
      path: 'list',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('../../components/business/area/list'));
        })
      },
    }, {
      path: 'map',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('../../components/business/area/map'));
        })
      },
    },
    ],
  },

  //业务中心 - 仓库管理
  {
    path: 'stock',
    childRoutes: [{
      path: 'driect',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('../../components/business/stock'));
        })
      },
    },
    {
      path: 'affiliate',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('../../components/business/stock'));
        })
      },
    },
    {
      path: 'update',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('../../components/business/stock/update'));
        })
      },
    },
    {
      path: 'create',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('../../components/business/stock/create'));
        })
      },
    },
    {
      path: 'detail',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('../../components/business/stock/detail'));
        })
      },
    },
    ],
  },

  //业务中心 - 规则管理
  {
    path: 'rules',
    childRoutes: [{
      path: 'stock',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('../../components/business/rules/stock'));
        })
      },
    },
    {
      path: 'area',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('../../components/business/rules/area'));
        })
      },
    },
    ],
  },

  //业务中心 - 项目管理
  {
    path: 'project',
    childRoutes: [
      //业务中心 - 项目管理 - 直营项目 - 添加新项目
      {
        path: 'add',
        getComponent: (location, callback) => {
          require.ensure([], (require) => {
            callback(null, require('../../components/business/project/direct/addProject'));
          });
        },
      },
      //业务中心 - 项目管理 - 直营项目
      {
        path: 'direct',
        getComponent: (location, callback) => {
          require.ensure([], (require) => {
            callback(null, require('../../components/business/project/direct'));
          });
        },
      },
      //业务中心 - 项目管理 - 直营项目 - 操作项模块入口
      {
        path: 'direct/operate',
        getComponent: (location, callback) => {
          require.ensure([], (require) => {
            callback(null, require('../../components/business/project/direct/operate'));
          });
        },
      },
      //业务中心 - 项目管理 - 直营项目 - 操作项模块入口 - 签约信息  - 编辑
      {
        path: 'direct/operate/sign/edit',
        getComponent: (location, callback) => {
          require.ensure([], (require) => {
            callback(null, require('../../components/business/project/direct/operate/signEdit'));
          });
        },
      },
      //业务中心 - 项目管理 - 直营项目 - 历史合作项目
      {
        path: 'direct/history',
        getComponent: (location, callback) => {
          require.ensure([], (require) => {
            callback(null, require('../../components/business/project/direct/historyProject'));
          });
        },
      },
      //业务中心 - 项目管理 - 加盟项目
      {
        path: 'affiliate',
        getComponent: (location, callback) => {
          require.ensure([], (require) => {
            callback(null, require('../../components/business/project/affiliate'));
          });
        },
      },
      //业务中心 - 项目管理 - 加盟项目 - 操作项模块入口
      {
        path: 'affiliate/operate',
        getComponent: (location, callback) => {
          require.ensure([], (require) => {
            callback(null, require('../../components/business/project/affiliate/operate'));
          });
        },
      },
      //业务中心 - 项目管理 - 加盟项目 - 历史合作项目
      {
        path: 'affiliate/history',
        getComponent: (location, callback) => {
          require.ensure([], (require) => {
            callback(null, require('../../components/business/project/affiliate/historyProject'));
          });
        },
      },
    ],
  },

  //业务中心 - 承运商管理
  {
    path: 'supplier',
    childRoutes: [
      //承运商管理列表页
      {
        path: 'list',
        getComponent: (location, callback) => {
          require.ensure([], (require) => {
            callback(null, require('../../components/business/supplier'));
          })
        },
      },
      // 承运商列表页操作入口
      {
        path: 'operate',
        getComponent: (location, callback) => {
          require.ensure([], (require) => {
            callback(null, require('../../components/business/supplier/operate'))
          })
        },
      },
      {
        path: 'areaService',
        getComponent: (location, callback) => {
          require.ensure([], (require) => {
            callback(null, require('../../components/business/supplier/areaService'));
          })
        },
      },
      {
        path: 'stockService',
        getComponent: (location, callback) => {
          require.ensure([], (require) => {
            callback(null, require('../../components/business/supplier/stockService'));
          })
        },
      },
    ],
  },

];
module.exports = {
  path: 'business',
  childRoutes: subRoutes,
}
