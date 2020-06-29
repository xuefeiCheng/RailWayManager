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
    this.init()
  },
  methods: {
    drawChart (id, data) {
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
            data: data.time || ['1', '2', '3', '4'],
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              rotate: 36
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '呼叫量',
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [
          {
            name: '呼叫量',
            type: 'bar',
            barWidth: '35%',
            data: data.ser,
            label: {
              normal: {
                show: true,
                position: 'top',
                color: '#a181fc'
              }
            }
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
      this.axios.post('/gettime').then((res) => {
        if (res.code === 200) {
          this.drawChart('chart1', res.data)
        }
      })
    },
    handleSearch () {
      // 搜索查询
      this.init()
    },
    handleReset () {
      // 重置搜索条件
      this.search = {
        time: new Date(GetDateStrByF(0, ','))
      }
      this.init()
    }
  }
}
</script>

<style lang="css">
@import "../../../static/css/base.css";
</style>
