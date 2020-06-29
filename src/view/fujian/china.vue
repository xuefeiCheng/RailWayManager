<template>
<!-- 导航第四版 导航是一个整体 -->
  <div class="data relative noback back mapTab_global mapTab inter_mapTab allHeight" id="transform">
    <div class="global_box border-box" style="height:96%">
      <div class="box-top flex border-box" style="height:100%">
        <div class="top-left" style="flex:1;margin-right:10px">
          <box-border :options="options">
            <!-- <Map></Map> -->
            <div id="map" style="height:100%;width:100%"></div>
          </box-border>
        </div>
        <div class="top-right border-all" style="display:block;flex: 0 1 35%;">
          <div class="top-right-title border-box border-bottom">疑似受骗实时监测</div>
          <div class="box_conent" style="height:92%;width:100%">
            <div class="inter_table" style="height:100%;width:100%">
              <div class="inter_table_header border-bottom" style="font-size:16px;;width:100%">
                <ul style="display:flex;text-align:center;list-style:none;padding:5px">
                  <li style="width:25%">受害人号码</li>
                  <li style="width:25%">疑似诈骗号码</li>
                  <li style="width:25%">受骗时间</li>
                  <li style="width:25%">疑似受骗原因</li>
                </ul>
              </div>
              <div class="inter_table_body" style="width:100%;font-size:14px;padding:5px 0">
                <ul v-for="(item, index) in tableData" :key="index" style="display:flex;text-align:center;list-style:none;padding:5px">
                  <li style="width:25%">{{item.phone}}</li>
                  <li class="YELLOW" style="width:25%">{{item.ysphone}}</li>
                  <li style="width:25%">{{item.time}}</li>
                  <li class="YELLOW" style="width:25%">{{item.reason}}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'bigscreenGlobal',
  data () {
    return {
      options: {
        border: true,
        shape: 'triangle'
      },
      // ---------------- 数字动起来
      setting_arrow: 'never',
      tableData: []
    }
  },
  mounted () {
    this.drawMap('map')
    this.getScrollList()
  },
  methods: {
    getScrollList () {
      this.axios.post('/getScrollList').then((res) => {
        if (res.code === 200) {
          this.tableData = res.data
        }
      })
    },
    drawMap (id, data) {
      // 福建气泡 经纬度
      let dataList = [
        {'name': '云南省', wz: [101.811467, 24.956574, 121]},
        {'name': '湖南省', wz: [111.598829, 28.328652, 211]},
        {'name': '青海省', wz: [96.8038, 36.2207, 342]},
        {'name': '贵州省', wz: [106.6992, 26.7682, 552]},
        {'name': '重庆市', wz: [107.293861, 29.719279, 551]},
        {'name': '吉林省', wz: [125.8154, 43.6584, 623]},
        {'name': '湖北省', wz: [112.077158, 30.995665, 232]},
        {'name': '河南省', wz: [113.475353, 34.233691, 122]},
        {'name': '江苏省', wz: [119.546461, 32.223755, 454]},
        {'name': '山东省', wz: [117.485964, 36.106822, 662]},
        {'name': '福建省', wz: [118.001088, 26.224563, 555]},
        {'name': '浙江省', wz: [119.693639, 29.397571, 211]},
        {'name': '河北省', wz: [114.983931, 38.168723, 322]},
        {'name': '广东省', wz: [113.144202, 22.825228, 444]},
        {'name': '辽宁省', wz: [122.82118, 41.43163, 211]},
        {'name': '海南省', wz: [109.611921, 19.093147, 511]}
      ]
      let cityList = [
        // 山东
        {'name': '济南移动营业厅', wz: [117.000923, 36.675807], position: '济南历下区朝阳街道'},
        {'name': '青岛市移动营业厅', wz: [120.355173, 36.082982], position: '青岛海河小区'},
        {'name': '淄博市移动营业厅', wz: [118.047648, 36.814939], position: '淄博工业园'},
        {'name': '枣庄市移动营业厅', wz: [117.557964, 34.856424], position: '中央大道'},
        {'name': '东营市移动营业厅', wz: [118.66471, 37.434564], position: '东营开发区'},
        {'name': '烟台市移动营业厅', wz: [121.391382, 37.539297], position: '烟台芝罘区'},
        {'name': '潍坊市移动营业厅', wz: [119.107078, 36.70925], position: '灵境大道'},
        {'name': '济宁市移动营业厅', wz: [116.587245, 35.415393], position: '济宁开发工业园'},
        {'name': '泰安市移动营业厅', wz: [117.129063, 36.194968], position: '泰达大街'},
        {'name': '威海市移动营业厅', wz: [122.116394, 37.509691], position: '威海解放军总部医院'},
        // 西藏
        {'name': '拉萨移动营业厅', wz: [91.132212, 29.660361], position: '拉萨市'},
        {'name': '日喀则移动营业厅', wz: [88.885148, 29.267519], position: '日喀则市区'},
        {'name': '昌都移动营业厅', wz: [97.178452, 31.136875], position: '昌都中央大道'},
        {'name': '山南移动营业厅', wz: [91.766529, 29.236023], position: '山南地区'},
        {'name': '那曲移动营业厅', wz: [92.060214, 31.476004], position: '那曲'},
        {'name': '阿里移动营业厅', wz: [80.105498, 32.503187], position: '阿里地区'},
        {'name': '林芝移动营业厅', wz: [94.362348, 29.654693], position: '林芝市'}
      ]
      let charts = this.$echarts.init(document.getElementById(id))
      let options = {
        title: {
          show: true,
          text: '诈骗源区域分布',
          textStyle: {
            color: '#F1F1F3',
            fontSize: 30
          },
          top: 20,
          left: '40%'
        },
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            if (params.seriesType === 'effectScatter') { // 水波纹气泡数据展示
              return params.data.name + '</br>' + '诈骗号码量: ' + params.value[2]
            }
            if (params.value) {
              return params.name + '<br/>' + '渠道地址:' + params.value[2]
            } else {
              return params.name
            }
          }
        },
        geo: {
          map: 'china',
          label: {
            normal: {
              show: false, // 是否显示对应地名
              textStyle: {
                color: '#fff'
              }
            },
            emphasis: {
              show: false

            }
          },
          roam: true, // 是否开启鼠标缩放和平移漫游
          zoom: 1.2,
          aspectScale: 1,
          itemStyle: {
            normal: {
              borderColor: 'rgba(93, 255, 249, 1)',
              borderWidth: 1,
              areaColor: {
                type: 'radial',
                x: 0.5,
                y: 0.5,
                r: 0.8,
                colorStops: [{
                  offset: 0,
                  color: 'rgba(11, 37, 108, .5)' // 0% 处的颜色
                }, {
                  offset: 1,
                  color: 'rgba(11, 37, 108, 1)' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
              },
              shadowColor: 'rgba(255, 255, 255, .5)',
              shadowOffsetX: -2,
              shadowOffsetY: -2,
              shadowBlur: 15
            },
            emphasis: {
              areaColor: '#389BB7',
              borderWidth: 0
            }
          }
        },
        series: [
          {
            name: '闪点图',
            zlevel: 2,
            type: 'effectScatter', // 配置显示方式为用户自定义
            rippleEffect: { // 涟漪特效相关配置。
              period: 4, // 动画的时间。
              scale: 4, // 动画中波纹的最大缩放比例。
              brushType: 'stroke' // 波纹的绘制方式，可选 'stroke' 和 'fill'。
            },
            symbolSize: function (val) {
              return val[2] / 25
            },
            // symbolSize: 16,
            coordinateSystem: 'geo',
            itemStyle: {
              normal: {
                color: 'yellow'
              }
            },
            data: dataList.map(function (dataItem) {
              return {
                name: dataItem.name,
                // 经纬度 被叫次数 拦截次数 拦截用户数
                value: dataItem.wz.concat(dataItem.value)
              }
            }) || []
          },
          {
            name: '散点图',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: cityList.map(function (dataItem) {
              return {
                name: dataItem.name,
                // 经纬度 被叫次数 拦截次数 拦截用户数
                value: dataItem.wz.concat(dataItem.position)
              }
            }) || [],
            symbolSize: 10,
            label: {
              normal: {
                formatter: '{b}',
                position: 'right',
                show: false
              },
              emphasis: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                color: '#B62AFF'
              }
            }
          }
        ]
      }
      charts.clear()
      charts.setOption(options)
      window.addEventListener('resize', function () {
        charts.resize()
      })
    }
  }
}
</script>

<style scoped>
li.YELLOW{ color:yellow !important;}
</style>
