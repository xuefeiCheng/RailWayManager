<template>
<!-- 列表无缝滚动 组件 -->
  <div :class="{anim: animate}">
    <!-- <ul>
      <li class="liStyle">
        <span class="c-yellow">序号</span> <span>事件类型</span> <span class="c-blue timeFont">模型名称 </span>
        <span class="c-yellow">案发时间</span>
        <span>受害人号码</span>
        <span class="c-blue timeFont">受害人归属地</span>
        <span class="c-yellow">涉炸金额</span>
        </li>
    </ul> -->
    <ul v-for="(item, index) in itemsList" :key="index">
      <li class="liStyle">
        <span class="c-yellow">{{item.indx}}</span> <span>{{item.type}}</span> <span class="c-blue timeFont">{{item.name}} </span>
        <span class="c-yellow">{{item.time}}</span>
        <span>{{item.phone}}</span>
        <span class="c-blue timeFont">{{item.city}}</span>
        <span class="c-yellow">{{item.num}}</span>
        </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'timescroll',
  props: {
    items: {
      // 数据
      type: Array,
      default: function () {
        /**
         * 事件序号
事件类型：仿冒公检法、虚假中奖信息、重金求子诈骗、仿冒银行、交通违法木马短信、机票改签诈骗、冒充电商客服、反动宣传
模型名称：模型1，模型2，模型3~~
案发时间
受害人号码
受害人归属地
涉诈金额
        */
        return [
          {
            indx: '1',
            time: '16:03',
            city: '北京',
            type: '反动宣传',
            name: '模型1',
            phone: 15201652301,
            num: 203
          }
        ]
      }
    },
    speed: {
      // 滚动速度
      type: Number,
      default: function () {
        return 1000
      }
    }
  },
  watch: {
    items () {
      this.itemsList = this.items
    }
  },
  data () {
    return {
      animate: false,
      scrollvalid: null,
      itemsList: []
    }
  },
  mounted () {
    this.itemsList = this.items
    this.scrollvalid = setInterval(this.scroll, this.speed)
  },
  methods: {
    scroll () {
      this.animate = true // 因为在消息向上滚动的时候需要添加css3过渡动画，所以这里需要设置true
      setTimeout(() => { //  这里直接使用了es6的箭头函数，省去了处理this指向偏移问题，代码也比之前简化了很多
        this.itemsList.push(this.itemsList[0]) // 将数组的第一个元素添加到数组的
        this.itemsList.shift() // 删除数组的第一个元素
        this.animate = false // margin-top 为0 的时候取消过渡动画，实现无缝滚动
      }, 500)
    }
  },
  beforeDestroy () {
    clearInterval(this.scrollvalid)
    this.scrollvalid = null
  }
}
</script>

<style scoped>
.anim{
  transition: all 0.5s;
  /* 监听 所有变化 过渡时间为0.5s */
  /* margin-top: -5px; */
}
.liStyle {
  display:block;height:40px;line-height:40px;color:#fff;font-size:14px;text-align:right;padding:0 10px;
}
.itemNum {
  font-size: 20px;
}
</style>
