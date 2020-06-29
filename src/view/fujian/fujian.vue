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
        <div class="top-left" style="flex:1;margin-right:0">
          <box-border :options="options">
            <!-- <Map></Map> -->
            <div id="map" style="height:100%;width:100%"></div>
            <div class="bs-timer hidden">(数据截止至<span style="color: yellow">{{timeString}}</span>)</div>
            <!-- 左侧展示框 -->
            <div class="bs-show-box">
              <div class="bs-sons">
                <div class="bs-title">当日关停量 <span class="c-red" style="font-size:12px;float:right;">日环比：1% ↑</span></div>
                <div class="bs-subtext-num">{{txcount}}</div>
              </div>
              <div class="bs-sons">
                <div class="bs-title">疑似号码量 <span class="c-red" style="font-size:12px; float:right;">日环比：2% ↑</span></div>
                <div class="bs-subtext-num">{{yscount}}</div>
              </div>
              <div class="bs-sons">
                <div class="bs-title">当日黑名单 <span class="c-green" style="font-size:12px; float:right;">日环比：1% ↓</span></div>
                <div class="bs-subtext-num">{{blackcount}}</div>
              </div>
            </div>
            <!-- 右侧列表滚动 -->
            <div class="list" style="display:none">
              <scroll :items='items' :speed='speedVal'></scroll>
            </div>
          </box-border>
        </div>
        <div class="top-right border-all" style="display:none">
          <div class="top-right-title border-box border-bottom">案例通报</div>
          <div class="top-right-wrapper" ref="getSize">
            <div class="top-right-sons border-bottom initSize">
              <Carousel autoplay :autoplay-speed="8000" v-model="value" :arrow="setting_arrow" style="width:100%;height:100%;padding:15px;" class="border-box">
                <CarouselItem>
                  <div class="demo-carousel">
                    <div class="carouse-title border-bottom no-shadow">"客服电话"：航班取消，需要改签</div>
                    <div class="carouse-box border-box initSizeSon c-yellow overflow-hidden">
                      王某接到航空公司"客服人员"的电话，称其订购的前往湛江的航班因飞机导航出现故障需要"改签"，让其提供银行卡号收取保险赔付费。
                      王某信以为真，按对方提示操作并告知对方银行卡验证码，结果被骗4000元。
                    </div>
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div class="demo-carousel">
                    <div class="carouse-title border-bottom no-shadow">"社保基金"：诱导领取基金，骗取钱财</div>
                    <div class="carouse-box border-box initSizeSon c-yellow overflow-hidden">
                      张某接到一个陌生女子打来的电话，对方称其上半年社保基金在国税局里，让其去领取，并要其拨打联系电话xxxx。，张某拨打电话联系对方后被骗至农业银行，按照对方要求以无卡存款的方式汇给对方3200元人民币，后发现被骗。
                    </div>
                  </div>
                </CarouselItem>
              </Carousel>
            </div>
            <div class="top-right-sons initSize">
              <Carousel autoplay :autoplay-speed="8000" v-model="value" :arrow="setting_arrow" style="width:100%;height:100%;padding:15px;" class="border-box">
                <CarouselItem>
                  <div class="demo-carousel">
                    <div class="carouse-title border-bottom no-shadow ">"社保基金"：诱导领取基金，骗取钱财</div>
                    <div class="carouse-box border-box initSizeSon c-yellow overflow-hidden">
                      张某接到一个陌生女子打来的电话，对方称其上半年社保基金在国税局里，让其去领取，并要其拨打联系电话xxxx。，张某拨打电话联系对方后被骗至农业银行，按照对方要求以无卡存款的方式汇给对方3200元人民币，后发现被骗。
                    </div>
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div class="demo-carousel">
                    <div class="carouse-title border-bottom no-shadow">"客服电话"：航班取消，需要改签</div>
                    <div class="carouse-box border-box initSizeSon c-yellow overflow-hidden">
                      王某接到航空公司"客服人员"的电话，称其订购的前往湛江的航班因飞机导航出现故障需要"改签"，让其提供银行卡号收取保险赔付费
                    </div>
                  </div>
                </CarouselItem>
              </Carousel>
            </div>
          </div>
        </div>
      </div>
      <div class="box-bottom border-box">
        <div class="bottom-wapper border-all border-box">
          <div class="bs-sons" id="chart1"></div>
          <div class="bs-sons" id="chart2"></div>
          <!-- <div class="bs-sons" id="chart3"></div> -->
          <div class="bs-sons" id="chart4"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CountUp from '@/utils/CountUp'
import JsonList from '@/utils/fujian.json'
import Data from 'static/json/data.json'
import {gettime, GetDateStrByF} from '@/utils/methods'
export default {
  name: 'bigscreenGlobal',
  data () {
    return {
      title: '福建反诈骗骚扰电话平台',
      subtext: 'Public Security Anti-communication Fraud Platform',
      options: {
        border: true,
        shape: 'triangle'
      },
      // ---------------- 数字动起来
      intervalid: null,
      txcount: 321,
      yscount: 1125,
      blackcount: 502,
      txcount_old: 0,
      yscount_old: 0,
      blackcount_old: 0,
      timeString: '2019/07/02 14:53',
      speedVal: 1500,
      items: Data.list,
      setting_arrow: 'never',
      value: 0,
      times: [
        GetDateStrByF(-14, '/').substring(5),
        GetDateStrByF(-13, '/').substring(5),
        GetDateStrByF(-12, '/').substring(5),
        GetDateStrByF(-11, '/').substring(5),
        GetDateStrByF(-10, '/').substring(5),
        GetDateStrByF(-9, '/').substring(5),
        GetDateStrByF(-8, '/').substring(5)
      ]
    }
  },
  mounted () {
    this.init()
    this.intervalid = setInterval(() => {
      this.getRandomNum()
      this.changeNum()
    }, 10 * 1000)
    this.timeString = gettime()
    this.drawMap('map', Data.fujianmap)
    this.drawCharts('chart1', {
      title: '高危受害人识别趋势图',
      color: '#99da69'
    }, Data.chart1)
    this.drawCharts('chart2', {
      title: '诈骗号码识别趋势图',
      color: '#7049f0'
    }, Data.chart2)
    // this.drawPie('chart3', Data.chart3)
    this.drawBar('chart4', Data.chart4)
    // 初始化
    this.$nextTick(() => {
      const WIDTH = document.body.offsetWidth
      const HEIGHT = this.$refs.getSize.offsetHeight
      const initSize = document.getElementsByClassName('initSize')
      const initSizeSon = document.getElementsByClassName('initSizeSon')
      const initWidth = WIDTH * 0.96 * 0.25 - 15
      for (var i = 0, l = initSize.length; i < l; i++) {
        initSize[i].style.width = initWidth + 'px'
      }
      for (var y = 0, le = initSizeSon.length; y < le; y++) {
        initSizeSon[y].style.width = initWidth * 0.91 + 'px'
        initSizeSon[y].style.height = HEIGHT / 2 - 60 + 'px'
      }
    })
  },
  methods: {
    init () {
      var txcount = new CountUp('zljl', this.txcount_old, this.txcount, 0, 3)
      var yscount = new CountUp('ztxl', this.yscount_old, this.yscount, 0, 3)
      var blackcount = new CountUp('ztxl', this.blackcount_old, this.blackcount, 0, 3)
      txcount.start()
      yscount.start()
      blackcount.start()
    },
    // 重置提醒或拦截总数
    changeNum () {
      var txcount = new CountUp('zljl', this.txcount_old, this.txcount, 0, 3)
      var yscount = new CountUp('ztxl', this.yscount_old, this.yscount, 0, 3)
      var blackcount = new CountUp('ztxl', this.blackcount_old, this.blackcount, 0, 3)
      txcount.start()
      yscount.start()
      blackcount.start()
    },
    // 生成随机提醒或拦截总数
    getRandomNum () {
      var ln = parseInt(10 * Math.random())// 生成0-50的随机数
      this.txcount_old = this.txcount
      this.txcount = this.txcount + ln
      this.yscount_old = this.yscount
      this.yscount = this.yscount + ln
      var tn = parseInt(3 * Math.random())// 生成0-8的随机数
      this.blackcount_old = this.blackcount
      this.blackcount = this.blackcount + tn
    },
    drawMap (id, data) {
      // 福建气泡 经纬度
      let dataList = [
        {'name': '福州市', wz: [119.306239, 26.075302]},
        {'name': '厦门市', wz: [118.11022, 24.490474]},
        {'name': '莆田市', wz: [119.007558, 25.431011]},
        {'name': '三明市', wz: [117.635001, 26.265444]},
        {'name': '泉州市', wz: [118.589421, 24.908853]},
        {'name': '漳州市', wz: [117.661801, 24.510897]},
        {'name': '南平市', wz: [118.178459, 26.635627]},
        {'name': '龙岩市', wz: [117.02978, 25.091603]},
        {'name': '宁德市', wz: [119.527082, 26.65924]}
      ]
      let charts = this.$echarts.init(document.getElementById(id))
      this.$echarts.registerMap('fujian', JsonList)
      let options = {
        title: {
          show: true,
          text: '受害用户区域分布',
          textStyle: {
            color: '#F1F1F3'
          },
          top: 20,
          left: '30%'
        },
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            if (params.seriesType === 'effectScatter') { // 水波纹气泡数据展示
              return params.data.name
            }
            if (params.value) {
              return params.name + ': <br/>' + '深度受害事件量：' + params.value + '次<br/>' + '浅度受害事件量：' + parseInt(params.value * 0.3) + '次<br/>' + '总受害用户事件量：' + parseInt(params.value * 1.3) + '次<br/>'
            } else {
              return params.name
            }
          }
        },
        visualMap: {
          left: '15%',
          show: true,
          min: 0,
          seriesIndex: 0,
          pieces: [
            {gt: 500, label: '5级'}, // (1500, Infinity]
            {gt: 300, lte: 500, label: '4级'}, // (1500, Infinity]
            {gt: 100, lte: 300, label: '3级'}, // (1500, Infinity]
            {gt: 100, lte: 300, label: '2级'}, // (200, 300]
            {gt: 0, lt: 100, label: '1级'} // (-Infinity, 5)
          ],
          calculable: false, // true 柱状展示 false 分级别展示
          inRange: {
            // color: ['#4b5cc4', '#f47983', '#8d4bbb', '#6635EF', '#FFAFDA']
            // color: ['rgba(249, 199, 0, .9)', 'rgba(249, 111, 0, .9)', 'rgba(249, 41, 0, .9)']
            color: [
              '#b96604',
              '#2ccb16',
              '#b714b5',
              'orange',
              '#f31338'
            ]
          },
          textStyle: {
            color: '#fff'
          }
        },
        geo: {
          map: 'fujian',
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
            name: '区域',
            type: 'map',
            geoIndex: 0,
            data: data
          },
          {
            name: '标题',
            zlevel: 2,
            type: 'effectScatter', // 配置显示方式为用户自定义
            rippleEffect: { // 涟漪特效相关配置。
              period: 4, // 动画的时间。
              scale: 4, // 动画中波纹的最大缩放比例。
              brushType: 'stroke' // 波纹的绘制方式，可选 'stroke' 和 'fill'。
            },
            symbolSize: 16,
            coordinateSystem: 'geo',
            itemStyle: {
              normal: {
                color: '#fff'
              }
            },
            data: dataList.map(function (dataItem) {
              return {
                name: dataItem.name,
                // 经纬度 被叫次数 拦截次数 拦截用户数
                value: dataItem.wz.concat(dataItem.value)
              }
            }) || []
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
          subtext: `数据截止至：{a| ${GetDateStrByF(-8, '/')}}`,
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
          text: '关停量一周趋势图',
          textStyle: {
            color: '#fff'
          },
          subtext: `数据截止至：{a| ${GetDateStrByF(-8, '/')}}`,
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
          text: '高危受害人街道分布',
          textStyle: {
            color: '#fff'
          },
          subtext: `数据截止至：{a| ${GetDateStrByF(-8, '/')}}`,
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
  beforeDestroy () {
    clearInterval(this.intervalid)
    this.intervalid = null
  }
}
</script>
