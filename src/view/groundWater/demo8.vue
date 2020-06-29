<template>
  <div ref="divWidth" class="div-border">
    <Form ref="search" :model="search" :label-width="80">
      <Row>
        <Col span="8">
          <FormItem label="时间">
            <DatePicker type="daterange" placement="bottom-end" style="width: 100%;" v-model="search.time" placeholder="请选择想要查询的时间"></DatePicker>
          </FormItem>
        </Col>
        <Col span="8" style="text-align: center;">
          <FormItem>
            <Button type="success" icon="ios-search" class="searchBtn" @click="handleSearch">查询</Button>
            <Button type="info"  icon="ios-refresh" class="searchBtn" @click="handleReset">重置</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>

    <Divider />
    <div style="width:100%;height:65vh">
      <div id="map" ref="map" style="width:100%;height:100%"></div>
    </div>
  </div>
</template>

<script>
import JsonList from '@/utils/fujian.json'
import Data from 'static/json/data.json'
import {GetDateStrByF} from '@/utils/methods'
export default {
  data () {
    return {
      search: {
        name: '',
        time: [new Date(GetDateStrByF(0, ',')), new Date(GetDateStrByF(0, ','))]
      }
    }
  },
  mounted () {
    this.init(Data.fujianmap)
  },
  methods: {
    init (data) {
      let charts = this.$echarts.init(document.getElementById('map'))
      this.$echarts.registerMap('fujian', JsonList)
      let options = {
        title: {
          show: true,
          text: '受害用户区域分布',
          textStyle: {
            // color: '#F1F1F3'
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
              return params.name + ': <br/>' + '受害人数：' + params.value
            } else {
              return params.name
            }
          }
        },
        visualMap: {
          right: '15%',
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
            // color: '#fff'
          }
        },
        geo: {
          map: 'fujian',
          label: {
            normal: {
              show: true, // 是否显示对应地名
              textStyle: {
                // color: '#fff'
              }
            },
            emphasis: {
              show: true

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
          }
        ]
      }
      charts.clear()
      charts.setOption(options)
      window.addEventListener('resize', function () {
        charts.resize()
      })
    },
    handleSearch () {
      this.init(Data.fujianmap)
      // 搜索查询
    },
    handleReset () {
      // 重置搜索条件
      this.search = {
        name: '',
        time: [new Date(GetDateStrByF(0, ',')), new Date(GetDateStrByF(0, ','))]
      }
      // 请求数据
      this.init(Data.fujianmap)
    },
    drawPie (id) {
      let charts = this.$echarts.init(document.getElementById(id))
      let options = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          data: ['关停', '投诉复机']
        },
        series: [
          {
            name: '占比',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              {value: 657, name: '关停'},
              {value: 96, name: '投诉复机'}
            ],
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
      charts.setOption(options)
      window.addEventListener('resize', function () {
        charts.resize()
      })
    }
  }
}
</script>

<style lang="css">
@import "../../../static/css/base.css";
</style>
