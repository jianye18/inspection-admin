import Main from '@/view/main'
// import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: resolve => import('@/view/login/login.vue')
    //component:resolve => require(['@/view/login/login.vue'],resolve)
  },
  {
    path: '/view_file',
    name: 'view_file',
    meta: {
      title: '预览页',
      hideInMenu: true
    },
    component: resolve => import('@/view/inspection/view_file.vue')
  },
  {
    path: '/',
    name: 'inspection',
    meta: {
      title: '展示页',
      hideInMenu: true,
      notCache: true
    },
    component: () => import('@/view/inspection/home.vue'),
    //component:resolve => require(['@/view/inspection/home.vue'],resolve),
    children: [
      {
        path: '/main',
        name: 'main',
        meta: {
          title: '首页内容',
          hideInMenu: true
        },
        component: () => import('@/view/inspection/home-content.vue')
        //component:resolve => require(['@/view/inspection/home-content.vue'],resolve)
      },
      {
        path: '/',
        name: 'view',
        meta: {
          title: '数据展示页',
          hideInMenu: true
        },
        component: () => import('@/view/inspection/inspection.vue'),
        //component:resolve => require(['@/view/inspection/inspection.vue'],resolve),
        children: [
          {
            path: 'spotCheck',
            name: 'spotCheck',
            meta: {
              notCache: true
            },
            component: () => import('@/view/inspection/spot-check-list-data.vue')
            //component:resolve => require(['@/view/inspection/spot-check-list-data.vue'],resolve)
          },
          {
            path: 'spotCheckDetail',
            name: 'spotCheckDetail',
            meta: {
              notCache: true
            },
            component: () => import('@/view/inspection/spot-check-detail-data.vue')
            //component:resolve => require(['@/view/inspection/spot-check-detail-data.vue'],resolve)
          },
          {
            path: 'criterion',
            name: 'criterion',
            meta: {
              notCache: true
            },
            component: () => import('@/view/inspection/criterion-list-data.vue')
            //component:resolve => require(['@/view/inspection/criterion-list-data.vue'],resolve)
          },
          {
            path: 'criterionDetail',
            name: 'criterionDetail',
            meta: {
              notCache: true
            },
            component: () => import('@/view/inspection/criterion-detail-data.vue')
            //component:resolve => require(['@/view/inspection/criterion-detail-data.vue'],resolve)
          },
          {
            path: 'law',
            name: 'law',
            meta: {
              notCache: true
            },
            component: () => import('@/view/inspection/law-list-data.vue')
            //component:resolve => require(['@/view/inspection/law-list-data.vue'],resolve)
          },
          {
            path: 'lawDetail',
            name: 'lawDetail',
            meta: {
              notCache: true
            },
            component: () => import('@/view/inspection/law-detail-data.vue')
            //component:resolve => require(['@/view/inspection/law-detail-data.vue'],resolve)
          },
          {
            path: 'lawView',
            name: 'lawView',
            meta: {
              notCache: true
            },
            component: () => import('@/view/inspection/law-view-data.vue')
            //component:resolve => require(['@/view/inspection/law-view-data.vue'],resolve)
          },
          {
            path: 'flightCheck',
            name: 'flightCheck',
            meta: {
              notCache: true
            },
            component: () => import('@/view/inspection/flight-check-list-data.vue')
            //component:resolve => require(['@/view/inspection/flight-check-list-data.vue'],resolve)
          },
          {
            path: 'flightCheckDetail',
            name: 'flightCheckDetail',
            meta: {
              notCache: true
            },
            component: () => import('@/view/inspection/flight-check-detail-data.vue')
            //component:resolve => require(['@/view/inspection/flight-check-detail-data.vue'],resolve)
          },
          {
            path: 'article',
            name: 'article',
            meta: {
              notCache: true
            },
            component: () => import('@/view/inspection/article-list-data.vue')
            //component:resolve => require(['@/view/inspection/article-list-data.vue'],resolve)
          },
          {
            path: 'articleDetail',
            name: 'articleDetail',
            meta: {
              notCache: true
            },
            component: () => import('@/view/inspection/article-detail-data.vue')
            //component:resolve => require(['@/view/inspection/article-detail-data.vue'],resolve)
          }
        ]
      }
    ]
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true
        },
        component: () => import('@/view/single-page/home')
        //component:resolve => require(['@/view/single-page/home'],resolve)
      }
    ]
  },
  {
    path: '/',
    name: 'data',
    meta: {
      icon: 'md-menu',
      title: '数据管理'
    },
    component: Main,
    children: [
      {
        path: 'spot-check',
        name: 'spot-check',
        meta: {
          icon: 'ios-contact',
          title: '抽检数据',
          notCache: true
        },
        component: () => import('@/view/inspection-data/spot-check/spot-check.vue')
        //component:resolve => require(['@/view/inspection-data/spot-check/spot-check.vue'],resolve)
      },
      {
        path: 'flight-check',
        name: 'flight-check',
        meta: {
          icon: 'ios-browsers',
          title: '飞检数据',
          notCache: true
        },
        component: () => import('@/view/inspection-data/flight-check/flight-check.vue')
        //component:resolve => require(['@/view/inspection-data/flight-check/flight-check.vue'],resolve)
      },
      {
        path: 'mould-data',
        name: 'mould-data',
        meta: {
          icon: 'ios-browsers',
          title: '标准数据',
          notCache: true
        },
        component: () => import('@/view/inspection-data/mould-data/mould-data.vue')
        //component:resolve => require(['@/view/inspection-data/mould-data/mould-data.vue'],resolve)
      },
      {
        path: 'law-data',
        name: 'law-data',
        meta: {
          icon: 'ios-browsers',
          title: '法规数据',
          notCache: true
        },
        component: () => import('@/view/inspection-data/law-data/law-data.vue')
        //component:resolve => require(['@/view/inspection-data/law-data/law-data.vue'],resolve)
      },
      {
        path: 'article-data',
        name: 'article-data',
        meta: {
          icon: 'ios-browsers',
          title: '文章管理',
          notCache: true
        },
        component: () => import('@/view/inspection-data/article-data/article-data.vue')
        //component:resolve => require(['@/view/inspection-data/article-data/article-data.vue'],resolve)
      }
    ]
  },
  {
    path: '/',
    name: 'system',
    meta: {
      icon: 'md-flower',
      title: '系统管理'
    },
    component: Main,
    children: [
      {
        path: 'user',
        name: 'user',
        meta: {
          icon: 'ios-contact',
          title: '用户管理',
          notCache: true
        },
        component: () => import('@/view/system-manager/user/user.vue')
        //component:resolve => require(['@/view/system-manager/user/user.vue'],resolve)
      },
      {
        path: 'role',
        name: 'role',
        meta: {
          icon: 'md-contacts',
          title: '角色管理',
          notCache: true
        },
        component: () => import('@/view/system-manager/role/role.vue')
        //component:resolve => require(['@/view/system-manager/role/role.vue'],resolve)
      },
      {
        path: 'permission',
        name: 'permission',
        meta: {
          icon: 'md-flower',
          title: '权限管理',
          notCache: true
        },
        component: () => import('@/view/system-manager/permission/permission.vue')
        //component:resolve => require(['@/view/system-manager/permission/permission.vue'],resolve)
      },
      {
        path: 'banner',
        name: 'banner',
        meta: {
          icon: 'md-flower',
          title: '轮播图',
          notCache: true
        },
        component: () => import('@/view/system-manager/banner/banner.vue')
        //component:resolve => require(['@/view/system-manager/banner/banner.vue'],resolve)
      },
      {
        path: 'link',
        name: 'link',
        meta: {
          icon: 'md-flower',
          title: '友情链接',
          notCache: true
        },
        component: () => import('@/view/system-manager/links/link.vue')
        //component:resolve => require(['@/view/system-manager/links/link.vue'],resolve)
      },
      {
        path: 'statement',
        name: 'statement',
        meta: {
          icon: 'md-flower',
          title: '负责声明',
          notCache: true
        },
        component: () => import('@/view/system-manager/statement/statement.vue')
        //component:resolve => require(['@/view/system-manager/statement/statement.vue'],resolve)
      },
      {
        path: 'data-type',
        name: 'data-type',
        meta: {
          icon: 'md-flower',
          title: '常量管理',
          notCache: true
        },
        component: () => import('@/view/system-manager/constant/data-type.vue')
        //component:resolve => require(['@/view/system-manager/constant/data-type.vue'],resolve)
      },
      {
        path: 'user-log',
        name: 'user-log',
        meta: {
          icon: 'md-flower',
          title: '日志管理',
          notCache: true
        },
        component: () => import('@/view/system-manager/userLog/userLog.vue')
        //component:resolve => require(['@/view/system-manager/userLog/userLog.vue'],resolve)
      },
      {
        path: 'database',
        name: 'database',
        meta: {
          icon: 'md-flower',
          title: '数据备份',
          notCache: true
        },
        component: () => import('@/view/system-manager/database/database.vue')
      }/*,
      {
        path: 'menu',
        name: 'menu',
        meta: {
          icon: 'md-flower',
          title: '菜单管理',
          notCache: true
        },
        component: () => import('@/view/system-manager/menu/')
      }*/
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
