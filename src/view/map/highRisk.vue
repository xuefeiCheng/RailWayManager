<template>
  <div ref="divWidth" class="div-border">
    <div id="baiduMap" style="height:600px; width:100%">地图区域</div>
    <Modal
        v-model="callModel"
        title="回拨进度"
        draggable
        @on-ok="finish"
        @on-cancel="finish"
        >
      <Steps :current="callIdx">
        <Step title="呼叫中" content="正在呼叫用户..."></Step>
        <Step title="通话中" content="与用户通话中..."></Step>
        <Step title="已完成" content="通话已结束"></Step>
      </Steps>
    </Modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      map: null,
      callModel: false,
      callIdx: 0,
      calling: null,
      called: null
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
        {'lng': 115.994599, 'lat': 39.716425, 'count': 82},
        {'lng': 116.041460, 'lat': 39.782122, 'count': 101},
        {'lng': 115.874891, 'lat': 39.567607, 'count': 128},
        {'lng': 116.026000, 'lat': 39.598393, 'count': 27},
        {'lng': 115.963803, 'lat': 39.605621, 'count': 51},
        {'lng': 115.736762, 'lat': 39.714446, 'count': 89},
        {'lng': 115.842933, 'lat': 39.791077, 'count': 99},
        {'lng': 116.187589, 'lat': 39.771616, 'count': 131},
        {'lng': 116.155905, 'lat': 39.757918, 'count': 102},
        {'lng': 116.074740, 'lat': 39.677486, 'count': 81},
        {'lng': 116.078894, 'lat': 39.651881, 'count': 22},
        {'lng': 115.612896, 'lat': 39.70718, 'count': 60}
      ]

      let heatmapOverlay = new window.BMapLib.HeatmapOverlay({'radius': 20})
      this.map.addOverlay(heatmapOverlay)
      heatmapOverlay.setDataSet({data: points, max: 100})

      let dataInfo = [
        [115.994599, 39.716425, '<span style="font-size: 15px">受害人号码: 152******21</span>'],
        [116.041460, 39.782122, '<span style="font-size: 15px">受害人号码: 136******02</span>'],
        [115.874891, 39.567607, '<span style="font-size: 15px">受害人号码: 151******52</span>'],
        [116.026000, 39.598393, '<span style="font-size: 15px">受害人号码: 157******36</span>'],
        [115.963803, 39.605621, '<span style="font-size: 15px">受害人号码: 138******69</span>'],
        [115.736762, 39.714446, '<span style="font-size: 15px">受害人号码: 139******34</span>'],
        [115.842933, 39.791077, '<span style="font-size: 15px">受害人号码: 139******54</span>'],
        [116.187589, 39.771616, '<span style="font-size: 15px">受害人号码: 135******65</span>'],
        [116.155905, 39.757918, '<span style="font-size: 15px">受害人号码: 158******31</span>'],
        [116.074740, 39.677486, '<span style="font-size: 15px">受害人号码: 137******32</span>'],
        [116.078894, 39.651881, '<span style="font-size: 15px">受害人号码: 151******71</span>'],
        [116.144501, 39.731076, '<span style="font-size: 15px">受害人号码: 138******44</span>'],
        [116.229278, 39.781002, '<span style="font-size: 15px">受害人号码: 136******54</span>']
      ]
      // 信息窗口设置
      /* var opts = {
        width: 200, // 信息窗口宽度
        height: 100, // 信息窗口高度
        title: '诈骗电话详情', // 信息窗口标题
        enableMessage: true // 设置允许信息窗发送短息
      } */
      // 自定义标注
      // var myIcon = new BMap.Icon('../../static/img/icon.png', new BMap.Size(20, 20))
      // 新增标注并添加点击事件
      // let icon = new window.BMap.Icon('../../../static/img/location.png', new window.BMap.Size(20, 20))
      for (var i = 0; i < dataInfo.length; i++) {
        var marker = new window.BMap.Marker(new window.BMap.Point(dataInfo[i][0], dataInfo[i][1]), {
          // 指定Marker的icon属性为Symbol
          icon: new window.BMap.Symbol(window.BMap_Symbol_SHAPE_POINT, {
            scale: 1, // 图标缩放大小
            fillColor: 'orange', // 填充颜色
            fillOpacity: 0.8 // 填充透明度
          })
        }) // 创建标注
        var content = '<h2>受害人详情</h2><div style="height: 20px; line-height: 20px;">' + dataInfo[i][2] +
          '<span style="float: right;">' + '<span id="callImg" class="iconfont icon-phone-copy" style="font-size:20px; color: #2196F3;"></span></span><div>' // 标注信息
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
        var infoWindow = new window.BMap.InfoWindow(content) // 创建信息窗口对象
        _this.map.openInfoWindow(infoWindow, point) // 开启信息窗口
        document.getElementById('callImg').onload = function () {
          infoWindow.redraw()
        }
        document.getElementById('callImg').addEventListener('click', function (e) {
          _this.callModel = true
          _this.callIdx = 0

          _this.calling = setTimeout(function () {
            _this.callIdx = 1
            setTimeout(function () {
              _this.called = _this.callIdx = 2
            }, 5000)
          }, 3000)
        })
      }
    },
    finish () {
      if (this.calling != null) {
        clearTimeout(this.calling)
      }
      if (this.called != null) {
        clearTimeout(this.called)
      }
      this.callModel = false
      this.callIdx = 0
    }
  }
}
</script>

<style lang="css" scoped></style>
