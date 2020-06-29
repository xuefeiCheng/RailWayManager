<template>
  <div ref="divWidth" class="div-border">
    <div id="baiduMap" style="height:600px; width:100%">地图区域</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      map: null
    }
  },
  mounted () {
    this.init()
    this.createMap()
  },
  methods: {
    init () {
      let height = document.body.clientHeight
      let baiduMap = document.getElementById('baiduMap')
      baiduMap.style.height = height - 130 + 'px'
      // 默认请求数据
    },
    createMap () {
      let _this = this
      this.map = new window.BMap.Map('baiduMap', {})
      this.map.centerAndZoom(new window.BMap.Point(116.150022, 39.755326), 5) // 创建中心点
      this.map.enableScrollWheelZoom() // 开启鼠标滚轮缩放
      this.map.setMinZoom(8) // 最小缩放级别
      this.map.setMaxZoom(15) // 最大缩放级别
      this.map.addEventListener('click', this.showInfo)
      // 添加边界图层
      var bdary = new window.BMap.Boundary()
      var name = '房山区'
      bdary.get(name, function (rs) { // 获取行政区域
        // map.clearOverlays() / 清除地图覆盖物
        var count = rs.boundaries.length // 行政区域的点有多少个
        let pointArray = []
        for (var i = 0; i < count; i++) {
          var ply = new window.BMap.Polygon(rs.boundaries[i], {
            strokeWeight: 2, // 设置多边形边线线粗
            strokeOpacity: 1, // 设置多边形边线透明度0-1
            StrokeStyle: 'solid', // 设置多边形边线样式为实线或虚线，取值 solid 或 dashed
            strokeColor: '#ff0000', // 设置多边形边线颜色
            fillColor: '#00ffff', // 设置多边形填充颜色
            fillOpacity: 0.0001 // 设置多边形填充颜色透明度0-1  注：标红的地放你们可以去掉看一下效果，自己体验一下
          }) // 建立多边形覆盖物
          _this.map.addOverlay(ply) // 添加覆盖物
          pointArray = pointArray.concat(ply.getPath())
        }
        _this.map.setViewport(pointArray) // 调整视野
      })
      let points = [
        {'lng': 115.967974, 'lat': 39.605363, 'count': 82},
        {'lng': 116.229457, 'lat': 39.764598, 'count': 101},
        {'lng': 116.021607, 'lat': 39.711079, 'count': 128},
        {'lng': 115.963424, 'lat': 39.776543, 'count': 27},
        {'lng': 115.732449, 'lat': 39.751836, 'count': 51},
        {'lng': 115.736762, 'lat': 39.714446, 'count': 89},
        {'lng': 115.842933, 'lat': 39.791077, 'count': 99}
      ]

      let heatmapOverlay = new window.BMapLib.HeatmapOverlay({'radius': 20})
      this.map.addOverlay(heatmapOverlay)
      heatmapOverlay.setDataSet({data: points, max: 100})

      let dataInfo = [
        [115.967974, 39.605363, '地址:北京市房山区韩树河镇顾郑路与岳琉路交叉口<br/>疑似诈骗号码个数:82'],
        [116.229457, 39.764598, '地址:北京市房山区长阳路<br/>疑似诈骗号码个数:101'],
        [116.021607, 39.711079, '地址:北京市房山区京周路和顾八路交叉口附近<br/>疑似诈骗号码个数:128'],
        [115.963424, 39.776543, '地址:北京市房山区上店路<br/>疑似诈骗号码个数:27'],
        [115.732449, 39.751836, '地址:北京市房山区梅子湖<br/>疑似诈骗号码个数:51'],
        [115.736762, 39.714446, '地址:北京市房山区安子沟<br/>疑似诈骗号码个数:89'],
        [115.842933, 39.791077, '地址:北京市房山区零三零县道黄石岩<br/>疑似诈骗号码个数:99']
      ]
      // 信息窗口设置
      var opts = {
        width: 200, // 信息窗口宽度
        height: 100, // 信息窗口高度
        title: '诈骗电话详情', // 信息窗口标题
        enableMessage: true // 设置允许信息窗发送短息
      }
      // 自定义标注
      // var myIcon = new BMap.Icon('../../static/img/icon.png', new BMap.Size(20, 20))
      // 新增标注并添加点击事件
      for (var i = 0; i < dataInfo.length; i++) {
        var marker = new window.BMap.Marker(new window.BMap.Point(dataInfo[i][0], dataInfo[i][1])) // 创建标注
        var content = dataInfo[i][2] // 标注信息
        _this.map.addOverlay(marker) // 将标注添加到地图中
        addClickHandler(content, marker) // 标注点击处理时间
      }

      // 标注点击事件：打开信息窗口
      function addClickHandler (content, marker) {
        marker.addEventListener('click', function (e) {
          openInfo(content, e)
        })
      }

      // 信息窗口内容
      function openInfo (content, e) {
        var p = e.target
        var point = new window.BMap.Point(p.getPosition().lng, p.getPosition().lat)
        var infoWindow = new window.BMap.InfoWindow(content, opts) // 创建信息窗口对象
        _this.map.openInfoWindow(infoWindow, point) // 开启信息窗口
      }
    },
    showInfo (e) {
      this.singleAddForm.area = e.point.lng + ', ' + e.point.lat
    }
  }
}
</script>

<style lang="css" scoped></style>
