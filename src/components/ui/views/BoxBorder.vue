<template>
  <div class="box" :class='[options.border ? "box-border" : "", options.shape]'>
    <div class="shape_bottom_left"></div>
    <div class="shape_bottom_right"></div>
    <div class="shape_top_left"></div>
    <div class="shape_top_right"></div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      default: function () {
        return {
          border: false, // true false
          shape: '' // triangle rectangle
        }
      }
    }
  }
}
</script>

<style scoped>
.box {
  position: relative;
  box-sizing: border-box;
  height: 100%;
  flex: 1;
  overflow: hidden;
}
.box-border {
  /*
    border-width:1px;
    border-style:solid;
    border-color:#333 transparent;
   */
  border: 1px solid #269fed73;
  box-shadow: 0 0 3px #269fed;
}
/* 三角形  triangle*/
.triangle .shape_bottom_left{
    width:0;
    height:0;
    border-width:0 10px 10px 0;
    border-style:solid;
    border-color:transparent transparent #00DAFC;/*透明 透明  灰*/
    position: absolute;
    bottom: 0;
    left: 0;
}
.triangle .shape_bottom_right{
    width:0;
    height:0;
    border-width:0 0 10px 10px;
    border-style:solid;
    border-color:transparent transparent #00DAFC;/*透明 透明  灰*/
    position: absolute;
    bottom: 0;
    right: 0;
}
.triangle .shape_top_left{
    width:0;
    height:0;
    border-width:10px 10px 0 0;
    border-style:solid;
    border-color:#00DAFC transparent transparent;/*灰 透明 透明 */
    position: absolute;
    top: 0;
    left: 0;
}
.triangle .shape_top_right{
    width:0;
    height:0;
    border-width:10px 0 0 10px;
    border-style:solid;
    border-color:#00DAFC transparent transparent;/*灰 透明 透明 */
    position: absolute;
    top: 0;
    right: 0;
}
/*  矩形 rectangle */
.rectangle .shape_bottom_left{
    width:25px;
    height:25px;
    background: url(/static/img/bj-4.png);
    position: absolute;
    bottom: -1px;
    left: -1px;
}
.rectangle .shape_bottom_right{
    width:25px;
    height:25px;
    background: url(/static/img/bj-3.png);
    position: absolute;
    bottom: -1px;
    right: -1px;
}
.rectangle .shape_top_left{
    width:25px;
    height:25px;
    background: url(/static/img/bj-1.png);
    position: absolute;
    top: -1px;
    left: -1px;
}
.rectangle .shape_top_right{
    width:25px;
    height:25px;
    background: url(/static/img/bj-2.png);
    position: absolute;
    top: -1px;
    right: -1px;
}
</style>
