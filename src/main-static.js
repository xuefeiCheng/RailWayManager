// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

// 基本组件应用
import Vue from 'vue'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import Viewer from 'v-viewer'
import iview from 'iview'
import 'iview/dist/styles/iview.css'
import '../static/css/iconfont.css'
import echarts from 'echarts'
import Fui from '@/components/ui/index'
import Fanimates from '@/components/animate/index'

// 引入配置组件
import App from './App'
import router from './router/index'
import store from './store/index'
import './mockjs/index'
import axios from './utils/http.js'

import 'echarts/map/js/china.js'

// 使用iview组件
Vue.use(iview)
Vue.use(Fui)
Vue.use(Fanimates)
Vue.use(VueAwesomeSwiper)
Vue.use(Viewer, {
  defaultOptions: {
    navbar: false
  }
})
Vue.config.productionTip = false
Vue.prototype.$echarts = echarts

Vue.prototype.axios = axios

let menus = [
  // {
  //   'menuId': 'home',
  //   'name': '首页',
  //   'componentURL': 'container/MainOne',
  //   'children': [
  //     {'icon': 'ios-person-outline', 'name': '首页', 'componentURL': 'home/index', 'menuId': 'homePage'}, // 北京
  //     {'icon': 'ios-person-outline', 'name': '首页', 'componentURL': 'home/jiangxi', 'menuId': 'homePage'}, // 江西
  //     {'icon': 'ios-person-outline', 'name': '首页', 'componentURL': 'home/shanxi', 'menuId': 'homePage'} // 陕西
  //   ]
  // },
  // {
  //   'menuId': 'ywgzManage',
  //   'name': '业务规则管理',
  //   'componentURL': 'container/MainOne',
  //   'children': [
  //     {'icon': 'ios-person-outline', 'name': '策略配置', 'componentURL': 'strategy/manage', 'menuId': 'clmanage'}
  //   ]
  // },
  // {
  //   'menuId': 'datamanager',
  //   'name': '数据管理',
  //   'componentURL': 'container/MainOne',
  //   'children': [
  //     { 'icon': 'ios-paper', 'name': '黑名单管理', 'componentURL': 'datamanager/BlackPhone', 'menuId': 'black' },
  //     { 'icon': 'ios-paper', 'name': '白名单管理', 'componentURL': 'datamanager/WhitePhone', 'menuId': 'white' },
  //     { 'icon': 'ios-paper', 'name': '正样本库管理', 'componentURL': 'datamanager/Sample', 'menuId': 'sample' }
  //   ]
  // },
  // {
  //   'menuId': 'ManageOne',
  //   'name': '策略管理',
  //   'componentURL': 'container/MainOne',
  //   'children': [
  //     {'icon': 'ios-book-outline', 'name': '管控策略', 'componentURL': 'page2/adv', 'menuId': 'adv'},
  //     {'icon': 'ios-people-outline', 'name': '事中提醒', 'componentURL': 'page2/showPhone', 'menuId': 'showPhone'},
  //     {'icon': 'ios-book-outline', 'name': '事中阻断', 'componentURL': 'page2/handlePhone', 'menuId': 'handlePhone'},
  //     {'icon': 'ios-people-outline', 'name': '案件收集', 'componentURL': 'page2/casePhone', 'menuId': 'casePhone'}
  //   ]
  // },
  // {
  //   'menuId': 'ManageTwo',
  //   'name': '统计管理',
  //   'componentURL': 'container/MainOne',
  //   'children': [
  //     {'icon': 'ios-person-outline', 'name': '输入流量统计', 'componentURL': 'page3/phone', 'menuId': 'phone'},
  //     {'icon': 'ios-book-outline', 'name': '业务平台流量统计', 'componentURL': 'page3/phone.1', 'menuId': 'people'},
  //     {'icon': 'ios-people-outline', 'name': '特征指纹库统计', 'componentURL': 'page3/remaind', 'menuId': 'remaind'},
  //     {'icon': 'ios-book-outline', 'name': '统计报表', 'componentURL': 'page3/statistics', 'menuId': 'statistics'}
  //   ]
  // },
  // {
  //   'menuId': 'gtManage',
  //   'name': '关停投诉报表分析',
  //   'componentURL': 'container/MainOne',
  //   'children': [
  //     {'icon': 'ios-barcode-outline', 'name': '关停投诉报表分析', 'componentURL': 'gtPages/gt', 'menuId': 'gtTable'}
  //   ]
  // },
  // {
  //   'menuId': 'zpqsManage',
  //   'name': '诈骗趋势分析',
  //   'componentURL': 'container/MainOne',
  //   'children': [
  //     {'icon': 'ios-analytics-outline', 'name': '诈骗趋势分析', 'componentURL': 'zpqs/index', 'menuId': 'zpqs'}
  //   ]
  // },
  // {
  //   'menuId': 'zpzhManage',
  //   'name': '诈骗综合分析',
  //   'componentURL': 'container/MainOne',
  //   'children': [
  //     {'icon': 'ios-call-outline', 'name': '号码分析', 'componentURL': 'zonghe/phonenumber', 'menuId': 'phonenumber'},
  //     {'icon': 'ios-book-outline', 'name': '地域分析', 'componentURL': 'zonghe/area', 'menuId': 'area'},
  //     {'icon': 'ios-book-outline', 'name': '地域分析', 'componentURL': 'zonghe/area1', 'menuId': 'area'},
  //     {'icon': 'ios-paper', 'name': '运营商分析', 'componentURL': 'zonghe/yys', 'menuId': 'yys'},
  //     {'icon': 'ios-people-outline', 'name': '时间分析', 'componentURL': 'zonghe/time', 'menuId': 'time'}
  //   ]
  // },
  // {
  //   'menuId': 'fujianDemo',
  //   'name': '福建demo',
  //   'componentURL': 'container/MainOne',
  //   'children': [
  //     { componentURL: 'fujian/demo1', name: '基础信息管理', icon: 'ios-cube', menuId: 'psokManager' },
  //     { componentURL: 'fujian/demo2', name: '入网渠道/工具', icon: 'ios-albums', menuId: 'pslistManager' },
  //     { componentURL: 'fujian/demo3', name: '工单趋势分析报表', icon: 'ios-paper', menuId: 'LACManager' },
  //     { componentURL: 'fujian/demo5', name: '环形饼图', icon: 'ios-cog', menuId: 'demo5' },
  //     { componentURL: 'fujian/demo4', name: '伪基站呈现追踪', icon: 'ios-cog', menuId: 'UsersStationManager' },
  //     { componentURL: 'fujian/demo7', name: '关停投诉报表分析', icon: 'ios-cog', menuId: 'demo7' },
  //     { componentURL: 'fujian/demo6', name: '诈骗电话监测', icon: 'ios-cube', menuId: 'zpphone' },
  //     { componentURL: 'fujian/demo8', name: '受害人分析', icon: 'ios-cog', menuId: 'demo8' },
  //     { componentURL: 'fujian/demo9', name: '号源地分析', icon: 'ios-cog', menuId: 'demo9' },
  //     { componentURL: 'fujian/fujian', name: '首页', icon: 'ios-cog', menuId: 'fujianhome' },
  //     { componentURL: 'fujian/china', name: '中国地图', icon: 'ios-cog', menuId: 'china' }
  //   ]
  // }, {
  //   'menuId': 'fujianDemo2',
  //   'name': '福建demo2',
  //   'componentURL': 'container/MainOne',
  //   'children': [
  //     { componentURL: 'fujian/demo11', name: '自动踢网、关停用户', icon: 'ios-cube', menuId: 'stopuser' },
  //     { componentURL: 'fujian/demo12', name: '准确率', icon: 'ios-cube', menuId: 'zql' },
  //     { componentURL: 'fujian/demo13', name: '召回率/查全率', icon: 'ios-cube', menuId: 'zhl' },
  //     { componentURL: 'fujian/demo14', name: '特征分析', icon: 'ios-cube', menuId: 'tzfx' },
  //     { componentURL: 'fujian/demo15', name: '行为地分析', icon: 'ios-cube', menuId: 'xwdfx' },
  //     { componentURL: 'fujian/demo16', name: '趋势分析', icon: 'ios-cube', menuId: 'qsfx' },
  //     // { componentURL: 'fujian/demo17', name: '号源地分析', icon: 'ios-cube', menuId: 'hydfx' },
  //     // { componentURL: 'fujian/demo18', name: '受害人分析', icon: 'ios-cube', menuId: 'shrfx' },
  //     { componentURL: 'fujian/demo19', name: '疑似号码信息监测', icon: 'ios-cube', menuId: 'yshmxx' },
  //     { componentURL: 'fujian/demo20', name: '疑似受害用户监测', icon: 'ios-cube', menuId: 'ysshyh' },
  //     { componentURL: 'fujian/demo21', name: '漫游号码异常监测', icon: 'ios-cube', menuId: 'myhmyc' },
  //     { componentURL: 'fujian/demo22', name: '异常漫入号码监测', icon: 'ios-cube', menuId: 'ycmrhm' }
  //   ]
  // },
  // {
  //   'menuId': 'systemManage',
  //   'name': '系统管理',
  //   'componentURL': 'container/MainOne',
  //   'children': [
  //     {'icon': 'ios-person-outline', 'name': '操作员管理', 'componentURL': 'systemManage/userManage', 'menuId': 'userManage'},
  //     {'icon': 'ios-people-outline', 'name': '角色管理', 'componentURL': 'systemManage/roleManage', 'menuId': 'roleManage'},
  //     {'icon': 'ios-book-outline', 'name': '日志管理', 'componentURL': 'systemManage/logManage', 'menuId': 'logManage'}
  //   ]
  // },
  // {
  //   'menuId': 'groundWater',
  //   'name': '地下水监控',
  //   'componentURL': 'container/MainOne',
  //   'children': [
  //     { componentURL: 'groundWater/facility', name: '监控设备', icon: 'ios-cube-outline', menuId: 'facility' },
  //     { componentURL: 'groundWater/map', name: '地图平台', icon: 'ios-pin-outline', menuId: 'map' },
  //     { componentURL: 'groundWater/dataAnalysis', name: '数据分析', icon: 'ios-podium-outline', menuId: 'dataAnalysis' },
  //     { componentURL: 'groundWater/userManager', name: '用户管理', icon: 'ios-person-outline', menuId: 'userManager' },
  //     { componentURL: 'groundWater/demo11', name: '自动踢网、关停用户', icon: 'ios-cube', menuId: 'stopuser' },
  //     { componentURL: 'groundWater/demo12', name: '准确率', icon: 'ios-cube', menuId: 'zql' },
  //     { componentURL: 'groundWater/demo13', name: '召回率/查全率', icon: 'ios-cube', menuId: 'zhl' },
  //     { componentURL: 'groundWater/demo14', name: '特征分析', icon: 'ios-cube', menuId: 'tzfx' },
  //     { componentURL: 'groundWater/demo15', name: '行为地分析', icon: 'ios-cube', menuId: 'xwdfx' },
  //     { componentURL: 'groundWater/demo16', name: '趋势分析', icon: 'ios-cube', menuId: 'qsfx' },
  //     // { componentURL: 'groundWater/demo17', name: '号源地分析', icon: 'ios-cube', menuId: 'hydfx' },
  //     // { componentURL: 'groundWater/demo18', name: '受害人分析', icon: 'ios-cube', menuId: 'shrfx' },
  //     { componentURL: 'groundWater/demo19', name: '疑似号码信息监测', icon: 'ios-cube', menuId: 'yshmxx' },
  //     { componentURL: 'groundWater/demo20', name: '疑似受害用户监测', icon: 'ios-cube', menuId: 'ysshyh' },
  //     { componentURL: 'groundWater/demo21', name: '漫游号码异常监测', icon: 'ios-cube', menuId: 'myhmyc' },
  //     { componentURL: 'groundWater/demo22', name: '异常漫入号码监测', icon: 'ios-cube', menuId: 'ycmrhm' }
  //   ]
  // },
  {
    'menuId': 'ground',
    'name': '地下水',
    'componentURL': 'container/MainOne',
    'children': [
      { 'componentURL': 'ground/waterLevel', 'name': '水位监测', 'icon': 'ios-cube-outline', 'menuId': 'waterLevel' },
      { 'componentURL': 'ground/flow', 'name': '流量监测', 'icon': 'ios-pulse-outline', 'menuId': 'flow' },
      { 'componentURL': 'ground/soil', 'name': '墒情监测', 'icon': 'ios-podium-outline', 'menuId': 'soil' },
      { 'componentURL': 'ground/rainfall', 'name': '降雨监测', 'icon': 'ios-rainy-outline', 'menuId': 'rainfall' },
      { 'componentURL': 'ground/base', 'name': '基础信息', 'icon': 'ios-browsers-outline', 'menuId': 'base' },
      { 'componentURL': 'ground/datareport', 'name': '数据报告', 'icon': 'ios-calendar-outline', 'menuId': 'datareport' }
    ]
  }
]
let res = {
  'axios': {
    'timeout': 10000,
    'url': 'http://localhost:9001',
    'json': 'http://localhost:9001',
    'websocket': 'ws://localhost:8888'
  },
  'thirdSys': {
    'logout': 'http://10.1.62.13:8231',
    'user': 'http://10.1.62.13:8231/user',
    'bdp': 'http://10.1.62.13:8231/bdp'
  },
  'md5': {
    'salt': '1qaz@WSX'
  }
}
Vue.prototype.getConfigJson = function () {
  let menuConfigData = menus.map((item) => {
    let completedItem = {
      path: `/${item.menuId}`,
      menuId: item.menuId,
      name: item.name,
      component: () => import(/* webpackChunkName: 'group-foo' */`@/components/${item.componentURL}`)
    }

    let completedChildItem = item.children.map((itemOne) => {
      let childrenItem = {
        path: itemOne.menuId,
        icon: itemOne.icon,
        menuId: itemOne.menuId,
        name: itemOne.name,
        component: () => import(/* webpackChunkName: 'group-foo' */`@/view/${itemOne.componentURL}`)
      }

      return childrenItem
    })
    completedItem.children = completedChildItem
    return completedItem
  })

  Vue.prototype.menuConfigData = menuConfigData
  axios.defaults.timeout = res.axios.timeout
  axios.defaults.baseURL = ''
  axios.defaults.withCredentials = true
  Vue.prototype.thirdSys = res.thirdSys
  Vue.prototype.baseURL = res.axios.url
  Vue.prototype.jsonURL = res.axios.json
  Vue.prototype.websocketURL = res.axios.websocket
  Vue.prototype.md5 = res.md5

  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    store,
    router,
    axios,
    components: { App },
    template: '<App/>'
  })
}
Vue.prototype.getConfigJson() // 调用声明的全局方法
