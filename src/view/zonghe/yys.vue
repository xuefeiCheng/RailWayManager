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
    this.drawPie('pie1')
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
    drawPie (id) {
      let charts = this.$echarts.init(document.getElementById(id))
      let options = {
        title: {
          text: id === 'pie1' ? '主叫运营商归属统计' : '被叫运营商归属统计',
          top: 20
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          data: ['中国移动', '中国联通', '中国电信', '其他']
        },
        series: [
          {
            name: '运营商',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: id === 'pie1' ? [
              {value: 335, name: '中国移动'},
              {value: 310, name: '中国联通'},
              {value: 234, name: '中国电信'},
              {value: 135, name: '其他'}
            ] : [
              {value: 252, name: '中国移动'},
              {value: 111, name: '中国联通'},
              {value: 44, name: '中国电信'},
              {value: 56, name: '其他'}
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
