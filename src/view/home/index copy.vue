<template>
<!-- 导航第四版 导航是一个整体 -->
  <div class="data relative noback back mapTab_global mapTab inter_mapTab allHeight" id="transform">
    <div class="data-title border-box">
      <div class="title-new fl" style="position:relative">
        <div>
          <div class="inter_title">{{title}}</div>
          <div class="inter_desctitle">{{subtext}}</div>
        </div>
      </div>
    </div>
    <div class="global_box border-box">
      <div class="box-top flex border-box">
        <div class="top-left">
          <box-border :options="options">
            <!-- <Map></Map> -->
            <div id="map" style="height:100%;width:100%"></div>
            <div class="bs-timer">(数据截止至<span style="color: yellow">{{timeString}}</span>)</div>
            <!-- 左侧展示框 -->
            <div class="bs-show-box">
              <div class="bs-sons">
                <div class="bs-title">当日提醒量 <span class="c-red" style="font-size:12px;float:right;">日环比：1% ↑</span></div>
                <div class="bs-subtext-num">509.992</div>
              </div>
              <div class="bs-sons">
                <div class="bs-title">疑似号码量 <span class="c-red" style="font-size:12px; float:right;">日环比：2% ↑</span></div>
                <div class="bs-subtext-num">108.224</div>
              </div>
              <div class="bs-sons">
                <div class="bs-title">当日黑名单 <span class="c-green" style="font-size:12px; float:right;">日环比：1% ↓</span></div>
                <div class="bs-subtext-num">1421</div>
              </div>
            </div>
            <!-- 右侧列表滚动 -->
            <div class="list">
              <scroll :items='items' :speed='speedVal'></scroll>
            </div>
          </box-border>
        </div>
        <div class="top-right border-all">
          <div class="top-right-title border-box border-bottom" style="height:45px;font-size:18px;padding:10px;">案例通报</div>
          <div class="top-right-wrapper" style="width:100%;height:calc(100% - 45px);">
            <div class="top-right-sons" style="width:100%;height:50%;background:green;overflow:hidden" ref="getSize">
              <Carousel  :autoplay-speed="8000" :arrow="setting_arrow" class="border-box" style="height:100%;position:relative;padding:15px;" id="setSize1">
                <CarouselItem>
                  <div class="demo-carousel setHeight">
                    <div class="carouse-title" style="height:30px;">halou </div>
                    <div class="carouse-content border-all"></div>
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div class="demo-carousel">2</div>
                </CarouselItem>
                <CarouselItem>
                  <div class="demo-carousel">3</div>
                </CarouselItem>
                <CarouselItem>
                  <div class="demo-carousel">4</div>
                </CarouselItem>
              </Carousel>
            </div>
            <div class="top-right-sons" style="width:100%;height:50%;background:red;"></div>
          </div>
        </div>
      </div>
      <div class="box-bottom border-box">
        <div class="bottom-wapper border-all border-box">
          <div class="bs-sons" id="chart1"></div>
          <div class="bs-sons" id="chart2"></div>
          <div class="bs-sons" id="chart3"></div>
          <div class="bs-sons" id="chart4"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import JsonList from '@/utils/beijing.json'
import Data from 'static/json/data.json'
import {gettime, GetDateStrByF} from '@/utils/methods'
export default {
  name: 'bigscreenGlobal',
  data () {
    return {
      title: '监测平台',
      subtext: 'Public Security Anti-communication Fraud Platform',
      options: {
        border: true,
        shape: 'triangle'
      },
      timeString: '2019/07/02 14:53',
      speedVal: 1500,
      items: Data.list,
      setting_arrow: 'never',
      times: [
        GetDateStrByF(-7, '/').substring(5),
        GetDateStrByF(-6, '/').substring(5),
        GetDateStrByF(-5, '/').substring(5),
        GetDateStrByF(-4, '/').substring(5),
        GetDateStrByF(-3, '/').substring(5),
        GetDateStrByF(-2, '/').substring(5),
        GetDateStrByF(-1, '/').substring(5)
      ]
    }
  },
  mounted () {
    this.timeString = gettime()
    this.drawMap('map', Data.map)
    this.drawCharts('chart1', {
      title: '高危受害人识别趋势图',
      color: '#99da69'
    }, Data.chart1)
    this.drawCharts('chart2', {
      title: '诈骗号码识别趋势图',
      color: '#7049f0'
    }, Data.chart2)
    this.drawPie('chart3', Data.chart3)
    this.drawBar('chart4', Data.chart4)
    // 获得尺寸 设置
    this.$nextTick(() => {
      const WIDTH = this.$refs.getSize.offsetWidth / 4
      const HEIGHT = this.$refs.getSize.offsetHeight
      const setSize1 = document.getElementById('setSize1')
      const setHeight = document.getElementsByClassName('setHeight')[0]
      setSize1.style.width = WIDTH + 'px'
      setSize1.style.height = HEIGHT + 'px'
      setHeight.style.width = WIDTH + 'px'
      setHeight.style.height = HEIGHT - 60 + 'px'
    })
  },
  methods: {
    drawMap (id, data) {
      let charts = this.$echarts.init(document.getElementById(id))
      this.$echarts.registerMap('beijing', JsonList)
      let options = {
        title: {
          show: true,
          text: '各地区实时提醒情况',
          textStyle: {
            color: '#F1F1F3'
          },
          top: 20,
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            if (params.value) {
              return params.name + ': ' + params.value + '次'
            } else {
              return params.name
            }
          }
        },
        visualMap: {
          show: true,
          min: 0,
          seriesIndex: 0,
          pieces: [
            {gt: 2000, label: '5级'}, // (1500, Infinity]
            {gt: 1500, lte: 2000, label: '4级'}, // (200, 300]
            {gt: 1000, lte: 1500, label: '3级'}, // (200, 300]
            {gt: 500, lte: 1000, label: '2级'}, // (200, 300]
            {lt: 500, label: '1级'} // (-Infinity, 5)
          ],
          calculable: false, // true 柱状展示 false 分级别展示
          inRange: {
            color: ['#99da69', '#fa704d', 'rgba(249, 199, 0, 1)', 'rgba(249, 111, 0, 1)', 'rgba(249, 41, 0, 1)']
          },
          textStyle: {
            color: '#fff'
          }
        },
        geo: {
          map: 'beijing',
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
          itemStyle: {
            normal: {
              borderColor: 'rgba(37, 142, 183, 1)',
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
              shadowColor: 'rgba(50, 137, 215, .34)',
              shadowOffsetX: -2,
              shadowOffsetY: 2,
              shadowBlur: 18
            },
            emphasis: {
              areaColor: '#389BB7',
              borderWidth: 0
            }
          }
        },
        series: [
          {
            name: '区域',
            type: 'map',
            geoIndex: 0,
            data: data
          }
        ]
      }
      charts.clear()
      charts.setOption(options)
      window.addEventListener('resize', function () {
        charts.resize()
      })
    },
    drawCharts (id, opt, data) {
      let _this = this
      let charts = this.$echarts.init(document.getElementById(id))
      let options = {
        title: {
          text: opt.title || '高危受害人识别趋势图',
          subtext: `数据截止至：{a| ${GetDateStrByF(-1, '/')}}`,
          subtextStyle: {
            rich: {
              a: {
                color: 'yellow'
              }
            }
          },
          textStyle: {
            color: '#fff'
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          containLabel: true,
          bottom: 0,
          top: 60,
          left: 10,
          right: 10
        },
        xAxis: {
          type: 'category',
          axisLine: { // 坐标轴线
            lineStyle: {
              color: '#fff'
            }
          },
          data: _this.times
        },
        yAxis: {
          type: 'value',
          axisLine: { // 坐标轴线
            lineStyle: {
              color: '#fff'
            }
          },
          splitLine: { // grid种的分割线
            lineStyle: {
              color: '#333',
              type: 'dashed'
            }
          }
        },
        series: [{
          data: data.data,
          type: 'line',
          itemStyle: {
            normal: {
              color: opt.color
            }
          }
        }]
      }
      charts.clear()
      charts.setOption(options)
      window.addEventListener('resize', function () {
        charts.resize()
      })
    },
    drawBar (id, data) {
      let _this = this
      let charts = this.$echarts.init(document.getElementById(id))
      let options = {
        title: {
          text: '提醒量一周趋势图',
          textStyle: {
            color: '#fff'
          },
          subtext: `数据截止至：{a| ${GetDateStrByF(-1, '/')}}`,
          subtextStyle: {
            rich: {
              a: {
                color: 'yellow'
              }
            }
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          containLabel: true,
          bottom: 0,
          top: 60,
          left: 10,
          right: 10
        },
        xAxis: [
          {
            type: 'category',
            data: _this.times,
            axisLine: { // 坐标轴线
              lineStyle: {
                color: '#fff'
              }
            },
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: { // 坐标轴线
              lineStyle: {
                color: '#fff'
              }
            },
            splitLine: { // grid种的分割线
              lineStyle: {
                color: '#333',
                type: 'dashed'
              }
            }
          }
        ],
        series: [
          {
            name: '数值',
            type: 'bar',
            barWidth: '20%',
            itemStyle: {
              normal: {
                barBorderRadius: [30, 30, 0, 0],
                color: new this.$echarts.graphic.LinearGradient(
                  0, 0, 0, 1, [{
                    offset: 0,
                    color: '#00feff'
                  },
                  {
                    offset: 0.5,
                    color: '#027eff'
                  },
                  {
                    offset: 1,
                    color: '#0286ff'
                  }
                  ]
                )
              }
            },
            data: data.data
          }
        ]
      }
      charts.clear()
      charts.setOption(options)
      window.addEventListener('resize', function () {
        charts.resize()
      })
    },
    drawPie (id, data) {
      let charts = this.$echarts.init(document.getElementById(id))
      let options = {
        title: {
          text: '高危受害人地区分布',
          textStyle: {
            color: '#fff'
          },
          subtext: `数据截止至：{a| ${GetDateStrByF(-1, '/')}}`,
          subtextStyle: {
            rich: {
              a: {
                color: 'yellow'
              }
            }
          }
        },
        grid: {
          containLabel: true,
          bottom: 0,
          top: 60,
          left: 10,
          right: 10
        },
        color: ['#2edfa3', '#bce672', '#ff4777', '#70f3ff', '#4b5cc4', '#f47983', '#8d4bbb', '#6635EF', '#FFAFDA'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          show: false,
          orient: 'vertical',
          left: 'left',
          top: 'center',
          textStyle: {
            color: '#fff'
          },
          data: data.legend
        },
        series: [
          {
            name: '分布地区',
            type: 'pie',
            radius: '50%',
            center: ['50%', '65%'],
            label: {
              formatter: '{b}:{d}%'
            },
            data: data.data,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
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
  },
  beforeDestroy () {}
}
</script>
