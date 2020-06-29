import Vue from 'vue'
import BoxBorder from './views/BoxBorder'

// const boxborder = {
//   install: function (Vue) {
//     Vue.component('BoxBorder', BoxBorder)
//   }
// } // 单个注册组件

// BoxBorder.install = Vue => Vue.component(BoxBorder.name, BoxBorder) // 单个注册组件

const Components = {
  BoxBorder
}

// 多个组件注册 循环
Object.keys(Components).forEach(name => {
  Vue.component(name, Components[name])
})

export default Components
