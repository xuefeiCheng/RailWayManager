<template>
  <div ref="divWidth" class="div-border">
    <Form ref="search" :model="search" :label-width="80">
      <Row>
        <Col span="8">
          <FormItem label="时间">
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

    <div style="width:100%;height:50vh;" id="chart1"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      search: {
        name: '',
        level: ''
      }
    }
  },
  mounted () {
    this.drawChart('chart1')
  },
  methods: {
    drawChart (id) {
      let charts = this.$echarts.init(document.getElementById(id))
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        xAxis: [
          {
            type: 'category',
            data: ['BETAMAX', 'DELLMONT', '菊凤', 'TELEGRAM'],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '流量',
            min: 0,
            max: 250,
            interval: 50,
            axisLabel: {
              formatter: '{value} G'
            }
          }
        ],
        series: [
          {
            name: '流量',
            type: 'bar',
            barWidth: '35%',
            data: [
              // {
              //   name: 'VOS',
              //   value: '70',
              //   itemStyle: {
              //     color: '#1F78B4'
              //   }
              // },
              {
                name: 'BETAMAX',
                value: '165',
                itemStyle: {
                  color: '#A6CEE3'
                }
              },
              {
                name: 'DELLMONT',
                value: '201',
                itemStyle: {
                  color: '#B2DF8A'
                }
              },
              {
                name: '菊凤',
                value: '69',
                itemStyle: {
                  color: '#33A02C'
                }
              },
              {
                name: 'TELEGRAM',
                value: '170',
                itemStyle: {
                  color: '#E31A1C'
                }
              }
            ]
          }
        ]
      }
      charts.setOption(option)
      window.addEventListener('resize', function () {
        charts.resize()
      })
    },
    init () {
      // 默认请求数据
    },
    searchArguments () {
      // 搜索条件
    },
    handleSearch () {
      // 搜索查询
    },
    handleReset () {
      // 重置搜索条件
      this.search = {
        name: '',
        level: ''
      }
    }
  }
}
</script>

<style lang="css">
@import "../../../static/css/base.css";
</style>
