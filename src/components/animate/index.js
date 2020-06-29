import Vue from 'vue'
import scroll from './views/scroll'
import timescroll from './views/timescroll'

// const boxborder = {
//   install: function (Vue) {
//     Vue.component('BoxBorder', BoxBorder)
//   }
// } // 单个注册组件

// BoxBorder.install = Vue => Vue.component(BoxBorder.name, BoxBorder) // 单个注册组件

const Components = {
  scroll, timescroll
}

// 多个组件注册 循环
Object.keys(Components).forEach(name => {
  Vue.component(name, Components[name])
})

export default Components
