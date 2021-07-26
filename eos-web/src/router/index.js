import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/login'),
    hidden: true
  },
  {
    path: '/opt_index',
    name: 'opt_index',
    component: () => import('@/views/login/opt_index'),
    hidden: true
  },
  {
    path: '/wd_index',
    name:'wd_index',
    component: () => import('@/views/login/wd_index'),
    hidden: true
  },

  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: '首页',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/SystemManage',
    component: Layout,
    redirect: '/system',
    name:"系统管理",
    children: [{
      path: 'RoleManage',
      name: '角色管理',
      component: () => import('@/views/system/role'),
      meta: { title: '角色管理', icon: 'tree' }
    },
      {
        path: 'EmployeeManage',
        name: '员工管理',
        component: () => import('@/views/system/staff'),
        meta: { title: '员工管理', icon: 'tree' }
      },
      {
        path: 'MenuManage',
        name: '菜单管理',
        component: () => import('@/views/system/menus'),
        meta: { title: '菜单管理', icon: 'tree' }
      },
      {
        path: 'NetPermissionManage',
        name: '运营商网点管理权限',
        component: () => import('@/views/system/operator_outlets'),
        meta: { title: '运营商网点管理权限', icon: 'tree' }
      }
      ]
  },
  {
    path: '/operators',
    component: Layout,
    redirect: '/operators',
    name:"运营管理",
    children: [{
      path: 'operators_list',
      name: 'operators_list',
      component: () => import('@/views/operators/operators_list'),
      meta: { title: '运营管理列表', icon: 'tree' },
    },
      {
        path: 'operators_dot_list',
        name: 'operators_dot_list',
        component: () => import('@/views/operators/operators_dot_list'),
        meta: { title: '入驻网点运营列表', icon: 'tree' }
      },
      {
        path: 'operators_details',
        name: 'operators_details',
        component: () => import('@/views/operators/operators_details'),
        meta: { title: '运营商详情', icon: 'tree' }
      },
      {
        path: '/oxygen_uptake',
        name: 'oxygen_uptake',
        component: () => import('@/views/operators/oxygen_uptake'),
        meta: { title: '取氧口管理', icon: 'tree' }
      },
      {
        path: '/operators_dot_detils',
        name: 'operators_dot_detils',
        component: () => import('@/views/operators/operators_dot_detils'),
        meta: { title: '入驻网点详情', icon: 'tree' }
      },
      {
        path: 'computer_room',
        name: 'computer_room',
        component: () => import('@/views/operators/computer_room'),
        meta: { title: '机房管理', icon: 'tree' }
      },
      {
        path: '/computer_room_details',
        name: 'computer_room_details',
        component: () => import('@/views/operators/computer_room_details'),
        meta: { title: '机房详情', icon: 'tree' }
      },
      {
        path: '/computer_room_device',
        name: 'computer_room_device',
        component: () => import('@/views/operators/computer_room_device'),
        meta: { title: '机房设备管理', icon: 'tree' }
      },
      {
        path: '/record',
        name: 'record',
        component: () => import('@/views/operators/record'),
        meta: { title: '更换记录', icon: 'tree' }
      },
      {
        path: '/central_oxygen',
        name: 'central_oxygen',
        component: () => import('@/views/operators/central_oxygen'),
        meta: { title: '机房设备管理列表', icon: 'tree' }
      },
      {
        path: '/humidifier',
        name: 'humidifier',
        component: () => import('@/views/operators/humidifier'),
        meta: { title: '附件管理', icon: 'tree'}
      },
      {
        path: '/department',
        name: 'department',
        component: () => import('@/views/operators/department'),
        meta: { title: '科室终端', icon: 'tree'}
      },
      {
        path: '/computer_distributed',
        name: 'computer_distributed',
        component: () => import('@/views/operators/computer_distributed'),
        meta: { title: '附件管理', icon: 'tree'}
      }
      ]
  },
  {
    path: '/oxygenerator',
    component: Layout,
    redirect: '/oxygenerator',
    name:"设备管理",
    children: [{
      path: 'oxygenerator_go',
      name: 'oxygenerator_go',
      component: () => import('@/views/oxygenerator/oxygenerator_go'),
      meta: { title: '制氧机出入库管理', icon: 'tree' },
    },
      {
        path: 'controller_go',
        name: 'controller_go',
        component: () => import('@/views/oxygenerator/controller_go'),
        meta: { title: '控制器出入库管理', icon: 'tree' }
      },
      {
        path: 'equipment_type',
        name: 'equipment_type',
        component: () => import('@/views/oxygenerator/equipment_type'),
        meta: { title: '设备型号管理', icon: 'tree' }
      },
      {
        path: 'equipment_parts',
        name: 'equipment_parts',
        component: () => import('@/views/oxygenerator/equipment_parts'),
        meta: { title: '设备部件管理', icon: 'tree' }
      },
      {
        path: 'associated_device',
        name: 'associated_device',
        component: () => import('@/views/oxygenerator/associated_device'),
        meta: { title: '设备部件规格维护', icon: 'tree' }
      },
      {
        path: 'on_up_oxygen',
        name: 'on_up_oxygen',
        component: () => import('@/views/oxygenerator/on_up_oxygen'),
        meta: { title: '供氧取氧终端出入库', icon: 'tree' }
      },
      {
        path: 'annex_go',
        name: 'annex_go',
        component: () => import('@/views/oxygenerator/annex_go'),
        meta: { title: '附件设备出入库管理', icon: 'tree' }
      },
      {
        path: 'oxygen_bag_go',
        name: 'oxygen_bag_go',
        component: () => import('@/views/oxygenerator/oxygen_bag_go'),
        meta: { title: '氧气袋出入库管理', icon: 'tree' }
      },
      {
        path: 'oxygen_bag_gos',
        name: 'oxygen_bag_gos',
        component: () => import('@/views/oxygenerator/oxygen_bag_go'),
        meta: { title: '氧气袋物资管理', icon: 'tree' }
      },
      {
        path: 'oxygen_edit_bag',
        name: 'oxygen_edit_bag',
        component: () => import('@/views/oxygenerator/oxygen_edit_bag'),
        meta: { title: '批量导入编辑氧气袋', icon: 'tree' }
      }
    ]
  },
  {
    path: '/oxygen_modulation',
    component: Layout,
    redirect: 'oxygen_modulation',
    name:'产品线管理',
    children: [
      {
        path: 'operator',
        name: 'operator',
        component: () => import('@/views/oxygen_modulation/operator'),
        meta: { title: '运营商列表', icon: 'form' },
      },
      {
        path: 'operator_on_dot',
        component: () => import('@/views/oxygen_modulation/operator_on_dot'),
        name: 'operator_on_dot',
        meta: { title: '入驻网点运营列表', icon: 'form' },
      },
      {
        path: 'install_order',
        name: 'install_order',
        component: () => import('@/views/oxygen_modulation/install_order'),
        meta: { title: '安装入户订单列表', icon: 'form' },
      },
      {
        path: 'traffic_payment',
        name: 'traffic_payment',
        component: () => import('@/views/oxygen_modulation/traffic_payment'),
        meta: { title: '流量付费订单列表', icon: 'form' },
      },
      {
        path: 'CCB_payment',
        name: 'CCB_payment',
        component: () => import('@/views/oxygen_modulation/CCB_payment'),
        meta: { title: '建行支付订单列表', icon: 'form' },
      },
      {
        path: 'financial_account',
        name: 'financial_account',
        component: () => import('@/views/oxygen_modulation/financial_account'),
        meta: { title: '财务账户列表', icon: 'form' },
      },
      {
        path: 'account_details',
        name: 'account_details',
        component: () => import('@/views/oxygen_modulation/account_details'),
        meta: { title: '账户分账明细', icon: 'form' },
      }
    ]
  },
  {
    path: '/eos_modulation',
    component: Layout,
    redirect: 'eos_modulation',
    name:'产品线管理',
    children: [
      {
        path: 'eos_operator',
        component: () => import('@/views/eos_modulation/eos_operator'),
        name: 'eos_operator',
        meta: { title: '运营商列表', icon: 'form' },
      },
      {
        path: 'eos_operator_add',
        component: () => import('@/views/eos_modulation/eos_operator_add'),
        name: 'eos_operator_add',
        meta: { title: '网点详情', icon: 'form' },
      },
      {
        path: 'eos_operator_on_dot',
        component: () => import('@/views/eos_modulation/eos_operator_on_dot'),
        name: 'eos_operator_on_dot',
        meta: { title: '入驻网点列表', icon: 'form' },
      },
      {
        path: 'contract_flow',
        name: 'contract_flow',
        component: () => import('@/views/eos_modulation/contract_flow'),
        meta: { title: '合同流量计划', icon: 'form' },
      },
      {
        path: 'contract_flow_fee',
        name: 'contract_flow_fee',
        component: () => import('@/views/eos_modulation/contract_flow_fee'),
        meta: { title: '待收账款列表', icon: 'form' },
      }
    ]
  },
  {
    path: '/bob',
    component: Layout,
    redirect: 'bob',
    name:'产品线管理',
    children: [
      {
        path: 'bob_dot_list',
        component: () => import('@/views/bob/bob_dot_list'),
        name: 'bob_dot_list',
        meta: { title: '入驻网点列表' },
      },
      {
        path: 'dot_detail',
        component: () => import('@/views/bob/dot_detail'),
        name: 'dot_detail',
        meta: { title: '账户明细' },
      },
      {
        path: 'oxy_operate_list',
        component: () => import('@/views/bob/oxy_operate_list'),
        name: 'oxy_operate_list',
        meta: { title: '财务账户列表' },
      },
      {
        path: 'order_list',
        name: 'order_list',
        component: () => import('@/views/bob/order_list'),
        meta: { title: '氧疗订单管理' },
      },
      {
        path: 'bag_order_list',
        name: 'bag_order_list',
        component: () => import('@/views/bob/bag_order_list'),
        meta: { title: '氧疗袋订单管理'},
      },
      {
        path: 'part_price_list',
        name: 'part_price_list',
        component: () => import('@/views/bob/part_price_list'),
        meta: { title: '商品销售价格管理'},
      },
      {
        path: 'service_user_list',
        name: 'service_user_list',
        component: () => import('@/views/bob/service_user_list'),
        meta: { title: '网点销售价格列表'},
      },
      {
        path: 'event',
        name: 'event',
        component: () => import('@/views/bob/event'),
        meta: { title: '事件管理'},
      },
      {
        path: 'number_message',
        name: 'number_message',
        component: () => import('@/views/bob/number_message'),
        meta: { title: '系统赠送次数消息'},
      },
      {
        path: 'user_list',
        name: 'user_list',
        component: () => import('@/views/bob/user_list'),
        meta: { title: '用户列表'},
      }
    ]
  },
  {
    path: '/equipment',
    component: Layout,
    redirect: 'equipment',
    name: '设备售后管理',
    children: [
      {
        path: 'controller_monitor',
        name: 'controller_monitor',
        component: () => import('@/views/equipment/controller_monitor'),
        meta: { title: '控制器运行监控' },
      },
      {
        path: 'controller_history',
        name: 'controller_history',
        component: () => import('@/views/equipment/controller_history'),
        meta: { title: '控制器历史记录' },
      },
      {
        path: 'part_address',
        name: 'part_address',
        component: () => import('@/views/equipment/part_address'),
        meta: { title: '历史记录' }
      },
      {
        path: 'part_sun_details',
        name: 'part_sun_details',
        component: () => import('@/views/equipment/part_sun_details'),
        meta: { title: '部件运行详情' },
      },
      {
        path: 'controller_abnormal',
        name: 'controller_abnormal',
        component: () => import('@/views/equipment/controller_abnormal'),
        meta: { title: '控制器异常报警管理' }
      },
      {
        path: 'oxygenerator_monitor',
        name: 'oxygenerator_monitor',
        component: () => import('@/views/equipment/oxygenerator_monitor'),
        meta: { title: '制氧机运行监控' },
      },
      {
        path: 'oxygenerator_abnormal',
        name: 'oxygenerator_abnormal',
        component: () => import('@/views/equipment/oxygenerator_abnormal'),
        meta: { title: '制氧机异常报警管理' }
      },
      {
        path: 'oxygenerator_history',
        name: 'oxygenerator_history',
        component: () => import('@/views/equipment/oxygenerator_history'),
        meta: { title: '制氧机历史记录' }
      },
      {
        path: 'annex_monitor',
        name: 'annex_monitor',
        component: () => import('@/views/equipment/annex_monitor'),
        meta: { title: '附件设备运行监控' },
      },
      {
        path: 'annex_history',
        name: 'annex_history',
        component: () => import('@/views/equipment/annex_history'),
        meta: { title: '附件设备历史记录' },
      },
      {
        path: 'equipment_maintain',
        name: 'equipment_maintain',
        component: () => import('@/views/equipment/equipment_maintain'),
        meta: { title: '设备保养计划' }
      },
      {
        path: 'equipment_replace',
        name: 'equipment_replace',
        component: () => import('@/views/equipment/equipment_replace'),
        meta: { title: '设备部件更换记录' }
      },{
        path: 'out_up_oxygenerator',
        name: 'out_up_oxygenerator',
        component: () => import('@/views/equipment/out_up_oxygenerator'),
        meta: { title: '入户终端设备运行监控'}
      },{
        path: 'out_up_history',
        name: 'out_up_history',
        component: () => import('@/views/equipment/out_up_history'),
        meta: { title: '入户终端历史记录'}
      },{
        path: 'home_monitor',
        name: 'home_monitor',
        component: () => import('@/views/equipment/home_monitor'),
        meta: { title: '房间分控终端设备运行监控'}
      },{
        path: 'home_history',
        name: 'home_history',
        component: () => import('@/views/equipment/home_history'),
        meta: { title: '房间分控终端设备历史记录'}
      },{
        path: 'department_monitor',
        name: 'department_monitor',
        component: () => import('@/views/equipment/department_monitor'),
        meta: { title: '科室终端氧疗设备运行监控'}
      },{
        path: 'department_history',
        name: 'department_history',
        component: () => import('@/views/equipment/department_history'),
        meta: { title: '科室终端氧疗设备历史记录'}
      },
      {
        path: 'bob_oxygenerator_monitor',
        component: () => import('@/views/equipment/bob_oxygenerator_monitor'),
        name: 'bob_oxygenerator_monitor',
        meta: { title: '氧疗机运行监控' },
      }
    ]
  },
  {
    path: '/network',
    component: Layout,
    redirect: 'network',
    name: '网点管理',
    children: [
      {
        path: 'network_index',
        name: 'network_index',
        component: () => import('@/views/network/network_index'),
        meta: { title: '入户终端供氧模板列表' },
      },
      {
        path: 'network_on',
        name: 'network_on',
        component: () => import('@/views/network/network_on'),
        meta: { title: '入户终端设备运行监控' },
      },
      {
        path: 'network_home',
        name: 'network_home',
        component: () => import('@/views/network/network_home'),
        meta: { title: '房间分控终端运行监控' }
      },
      {
        path: 'network_details',
        name: 'network_details',
        component: () => import('@/views/network/network_details'),
        meta: { title: '模板详情' },
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '/404',name:'404', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
