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
    <div style="width:100%;height:50vh;" id="chart1"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      search: {
        name: '',
        time: [null, null]
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
            data: ['0905', '0906', '0907', '0908', '0910', '0911', '0912', '0913', '0914', '0915', '0916', '0917'],
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
            type: 'line',
            data: [62.0, 74.9, 87.0, 103.2, 125.6, 96.7, 86.6, 92.2, 102.6, 120.0, 146.4, 122.3],
            smooth: true
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
        time: [null, null]
      }
    }
  }
}
</script>

<style lang="css">
@import "../../../static/css/base.css";
</style>
