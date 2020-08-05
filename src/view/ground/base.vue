<template lang="html">
  <div class="classify" ref="divWidth">
    <!-- 地图区域 -->
    <div class="box box-map">
      <div id="baiduMap" style="height:100%;width:100%"></div>
      <div class="box-images">
        <div class="box-images-title flex space-between">
          <div>图片记录</div>
          <div class="box-images-title-icon"  @click="handleImageBox()">{{icon}}</div>
        </div>
        <div class="box-images-content">
          <div style="height:20px">tu</div>
        </div>
      </div>
    </div>
    <Divider/>
    <!-- 搜索展示区域 -->
    <div class="box box-content">
      <div class="box-log border-normal">
        <div class="box-content-title">系统日志</div>
        <div class="box-content-content">
          <div class="box-content-content-log">系统日志</div>
        </div>
      </div>
      <div class="box-search border-normal">
        <div class="box-content-title">搜索</div>
        <div class="box-content-content">
          <Form :label-width="80">
            <Row>
              <Col span="24">
                <FormItem label="项目名称：">
                  <Select>
                    <Option value="1">启用</Option>
                    <Option value="2">暂停</Option>
                    <Option value="3">禁用</Option>
                  </Select>
              </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="24">
                <FormItem label="隧道名称：">
                  <Select>
                    <Option value="1">启用</Option>
                    <Option value="2">暂停</Option>
                    <Option value="3">禁用</Option>
                  </Select>
              </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="24">
                <FormItem label="设备类型：">
                  <Select>
                    <Option value="1">启用</Option>
                    <Option value="2">暂停</Option>
                    <Option value="3">禁用</Option>
                  </Select>
              </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="24">
                <FormItem label="点位名称：">
                  <Select>
                    <Option value="1">启用</Option>
                    <Option value="2">暂停</Option>
                    <Option value="3">禁用</Option>
                  </Select>
              </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import {} from '@/utils/methods'
export default {
  data () {
    return {
      maxWidth: 0,
      data: [],
      icon: '-'
    }
  },
  mounted () {
    this.maxWidth = this.$refs.divWidth.offsetWidth - 10
    this.init()
  },
  methods: {
    init () { // 初始化列表
      var map = new window.BMap.Map('baiduMap')
      // 创建地图实例
      var point = new window.BMap.Point(116.404, 39.915)
      // 创建点坐标
      map.centerAndZoom(point, 15)
      map.enableScrollWheelZoom(true) // 开启滚轮缩放
      var marker = new window.BMap.Marker(point) // 创建标注
      map.addOverlay(marker) // 将标注添加到地图中
      var opts = {
        width: 200, // 信息窗口宽度
        height: 100, // 信息窗口高度
        title: '故宫博物院', // 信息窗口标题
        message: '这里是故宫'
      }
      var infoWindow = new window.BMap.InfoWindow('地址：北京市东城区王府井大街88号乐天银泰百货八层', opts) // 创建信息窗口对象
      map.openInfoWindow(infoWindow, point) // 开启信息窗口
      map.addControl(new window.BMap.NavigationControl()) // 控件 放大缩小 方位选择
      // marker.addEventListener('click', function () {
      //   map.openInfoWindow(infoWindow, point) // 开启信息窗口
      // })
    },
    handleImageBox () { // 图片展示框展示与否
      if (this.icon === '-') {
        $('div.box-images-content').slideUp()
        this.icon = '+'
      } else {
        $('div.box-images-content').slideDown()
        this.icon = '-'
      }
    }
  }
}
</script>

<style lang="css" scoped>
.flex {
  display: flex;
}
.space-around{
  justify-content: space-around;
}
.space-between{
  justify-content: space-between;
}
.border-normal{
  border: 1px solid #dcdee2;
}
.border-light{
  border: 1px solid #dcdee2;
}
/*面板分割*/
.classify {
  border: 1px solid #dcdee2;
  padding: 10px;
  height: 100%;
}
.box{
  height: 45%;
  width: 100%;
}
.box-map{
  position: relative;
}
.box-images{
  position: absolute;
  top: 0;
  right: 10px;
  width: 20%;
  height: 99%;
}
.box-images-title {
  height: 20px;
  line-height: 20px;
  background: #278bd2;
  color: #fff;
  padding: 0 0 0 10px;
}
.box-images-title-icon {
  width: 20%;
  padding-right: 10px;
  text-align: right;
  cursor: pointer;
}
.box-images-content{
  height: calc(100% - 20px);
  overflow-y: auto;
  background: #dcdee2;
}
/* 内容展示部分 */
.box-content{
  display: flex;
  padding: 10px;
  box-sizing: border-box;
  justify-content: space-around;
}
.box-content-title {
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #dcdee2;
  padding: 0 15px;
  font-weight: bold;
  font-size: 15px;
}
.box-content-content {
  height: calc(100% - 40px);
  padding: 15px;
}
.box-content-content-log {
  height: 100%;
  overflow-y: auto;
}
.box-log{
  flex: 0 1 65%;
  margin-right: 10px;
}
.box-search{
  flex: 0 1 34%;
}
/*左右向滚动条隐藏*/
.ivu-table-tip {
  overflow-x: hidden;
}

/*搜索按钮*/
.searchBtn {
  margin: 0 25px;
}

/*分割线*/
.ivu-divider-horizontal {
  height: 2px;
}

/*分页控件*/
.tab_footer {
  margin-top: 10px;
  text-align: center;
  overflow: hidden;
}
.ivu-page-total {
  float: left;
  margin-left: 15px;
}
.ivu-page-options {
  float: right;
  margin-right: 15px;
}
</style>
