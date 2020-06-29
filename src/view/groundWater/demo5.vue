<template>
  <div ref="divWidth" class="div-border" style="height:100%;">
    <Form ref="search" :model="search" :label-width="80">
      <Row>
        <Col span="8">
          <FormItem label="查询时间">
            <DatePicker type="date" placement="bottom-end" style="width: 100%;" v-model="search.time" placeholder="请选择想要查询的时间"></DatePicker>
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
    <div style="width:100%;height:60%;border-bottom:1px solid #ccc;box-sizing: border-box;display:flex">
      <div style="flex:1;border-right:1px solid #ccc" id="pie2"></div>
      <div style="flex:1" id="pie1"></div>
    </div>
  </div>
</template>

<script>
import {GetDateStrByF} from '@/utils/methods'
export default {
  data () {
    return {
      search: {
        time: new Date(GetDateStrByF(0, ','))
      }
    }
  },
  mounted () {
    this.drawBar('pie1')
    this.drawPie('pie2')
  },
  methods: {
    handleSearch () {
      // 搜索查询
      this.init()
    },
    handleReset () {
      // 重置搜索条件
      this.search = {
        time: new Date(GetDateStrByF(0, ','))
      }
      // 请求数据
      this.init()
    },
    drawBar (id) {
      let charts = this.$echarts.init(document.getElementById(id))
      var colors = ['#5793f3', '#d14a61', '#675bba']
      let options = {
        color: colors,
        title: {
          text: '诈骗电话态势分析',
          top: 20
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        grid: {
          top: '20%'
          // right: '20%'
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          data: ['受骗量', '诈骗量']
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            data: [GetDateStrByF(-7, ''), GetDateStrByF(-6, ''), GetDateStrByF(-5, ''), GetDateStrByF(-4, ''), GetDateStrByF(-3, ''), GetDateStrByF(-2, ''), GetDateStrByF(-1, '')]
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '数量'
          }
        ],
        series: [
          {
            name: '受骗量',
            type: 'bar',
            data: [20, 49, 70, 232, 256, 767, 1356]
          },
          {
            name: '诈骗量',
            type: 'bar',
            data: [26, 59, 90, 264, 287, 707, 1756]
          }
        ]
      }
      charts.setOption(options)
      window.addEventListener('resize', function () {
        charts.resize()
      })
    },
    drawPie (id) {
      let charts = this.$echarts.init(document.getElementById(id))
      let options = {
        title: {
          text: id === 'pie1' ? '仿冒诈骗类型占比情况' : '仿冒诈骗类型占比情况',
          top: 20
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          data: ['仿冒熟人', '仿冒公检法', '电商诈骗', '其他']
        },
        series: [
          {
            name: '仿冒诈骗类型',
            type: 'pie',
            // radius: '55%',
            radius: ['50%', '70%'],
            center: ['50%', '60%'],
            data: id === 'pie1' ? [
              {value: 335, name: '仿冒熟人'},
              {value: 310, name: '仿冒公检法'},
              {value: 234, name: '电商诈骗'},
              {value: 135, name: '其他'}
            ] : [
              {value: 252, name: '仿冒熟人'},
              {value: 111, name: '仿冒公检法'},
              {value: 44, name: '电商诈骗'},
              {value: 56, name: '其他'}
            ],
            itemStyle: {
              normal: {
                label: {
                  show: false,
                  position: 'center'
                }
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                label: {
                  show: true,
                  fontSize: '30',
                  fontWeight: 'bold'
                }
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
