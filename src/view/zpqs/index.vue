<template>
  <div ref="divWidth" class="div-border">
    <Form ref="search" :model="search" :label-width="80">
      <Row>
        <Col span="8">
          <FormItem label="维度">
            <Select v-model="search.type">
                <Option value="1">一证多号拓查</Option>
                <Option value="2">高危imei拓查</Option>
                <Option value="3">同一imei拓查</Option>
                <Option value="4">批量渠道拓查</Option>
                <Option value="5">交际圈分析模型</Option>
            </Select>
          </FormItem>
        </Col>
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
import {GetDateStrByF} from '@/utils/methods'
export default {
  data () {
    return {
      search: {
        name: '',
        time: [new Date(GetDateStrByF(-30, ',')), new Date(GetDateStrByF(-1, ','))],
        type: '1'
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init: function () {
      this.axios.post('/getlinedata', `${this.search.type}`).then((res) => {
        if (res.code === 200) {
          this.drawChart('chart1', res.data)
        }
      })
    },
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
            data: data.time || ['0905', '0906', '0907', '0908', '0910', '0911', '0912', '0913', '0914', '0915', '0916', '0917'],
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
            name: '诈骗号码量',
            min: 0,
            max: 250,
            interval: 50,
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [
          {
            name: '诈骗号码量',
            type: 'line',
            data: data.value || [62.0, 74.9, 87.0, 103.2, 125.6, 96.7, 86.6, 92.2, 102.6, 120.0, 146.4, 122.3],
            smooth: true,
            markPoint: {
              data: [
                {type: 'max', name: '最大值'},
                {type: 'min', name: '最小值'}
              ]
            },
            markLine: {
              data: [
                {type: 'average', name: '平均值'}
              ]
            }
          }
        ]
      }
      charts.setOption(option)
      window.addEventListener('resize', function () {
        charts.resize()
      })
    },
    searchArguments () {
      // 搜索条件
    },
    handleSearch () {
      this.init()
      // 搜索查询
    },
    handleReset () {
      // 重置搜索条件
      this.search = {
        name: '',
        time: [new Date(GetDateStrByF(-30, ',')), new Date(GetDateStrByF(-1, ','))],
        type: '1'
      }
      this.init()
    }
  }
}
</script>

<style lang="css">
@import "../../../static/css/base.css";
</style>
