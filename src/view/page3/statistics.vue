<template>
  <div ref="divWidth" class="div-border" style="height:100%;">
    <div style="width:100%;height:50%;border-bottom:1px solid #ccc;box-sizing: border-box;display:flex">
      <div style="flex:1;border-right:1px solid #ccc" id="chart1"></div>
      <div style="flex:1" id="pie1"></div>
    </div>
    <div style="width:100%;height:50%;display:flex">
      <div style="flex:1;border-right:1px solid #ccc" id="chart2"></div>
      <div style="flex:1" id="pie2"></div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  mounted () {
    this.drawChart('chart1')
    this.drawChart('chart2')
    this.drawPie('pie1')
    this.drawPie('pie2')
  },
  methods: {
    drawChart (id) {
      let charts = this.$echarts.init(document.getElementById(id))
      let options = {
        title: {
          text: id === 'chart1' ? '辖区一周内提醒次数变化折线图' : '辖区一周内可疑号码数量变化折线图',
          top: 20
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        xAxis: {
          type: 'category',
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: id === 'chart1' ? [18820, 18932, 20901, 20934, 15129, 11330, 15320] : [3820, 1932, 1901, 2934, 2129, 2330, 2320],
          type: 'line',
          smooth: true
        }]
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
          text: id === 'pie1' ? '不同运营商可疑号码提醒次数占比' : '辖区内不同运营商可疑号码数量占比',
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
              {value: 12335, name: '中国移动'},
              {value: 15310, name: '中国联通'},
              {value: 13234, name: '中国电信'},
              {value: 21135, name: '其他'}
            ] : [
              {value: 2335, name: '中国移动'},
              {value: 1310, name: '中国联通'},
              {value: 3234, name: '中国电信'},
              {value: 1135, name: '其他'}
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
