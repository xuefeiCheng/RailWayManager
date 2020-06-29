<template lang="html">
  <Tabs type="card" :animated="false">
    <TabPane label="按照拨打地分析统计">
      <Form :model="tab3.search" :label-width="100">
          <Row>
            <Col span="8">
              <FormItem label="查询时间">
                <DatePicker v-model="tab6.search.time" type="daterange" placement="bottom-end" :options="tab6.endTimeOptions"
                  @on-change="tab6HandleTime" placeholder="请选择查询时间段" style="width: 100%;"></DatePicker>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem>
                <Button type="success" size="large" icon="ios-search" class="searchBtn" @click="tab6HandlePage(1)">搜索</Button>
                <Button type="info" size="large" icon="ios-refresh" class="searchBtn" @click="tab6HandleReset">重置</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>

        <Divider/>
      <div id="gxMap" ref="gxMap" :style="{width: mapWidth, height: mapHeightFull}"></div>
    </TabPane>
    <TabPane label="按通话次数分析统计" style='min-height:400px'>
      <div class="div-border">
        <!-- 搜索区域 -->
        <Form :model="tab2.search" :label-width="100">
          <Row>
            <Col span="8">
              <FormItem label="查询时间">
                <DatePicker v-model="tab2.search.time" type="daterange" placement="bottom-end" :options="tab2.endTimeOptions"
                  @on-change="tab2HandleTime" placeholder="请选择查询时间段" style="width: 100%;"></DatePicker>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem>
                <Button type="success" size="large" icon="ios-search" class="searchBtn" @click="tab2HandlePage(1)">搜索</Button>
                <Button type="info" size="large" icon="ios-refresh" class="searchBtn" @click="tab2HandleReset">重置</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>

        <Divider/>

        <div style="width:90vw;height:50vh;" id="chart1"></div>
      </div>
    </TabPane>
    <TabPane label="是否真实主叫">
      <div class="div-border">
        <!-- 搜索区域 -->
        <Form :model="tab3.search" :label-width="100">
          <Row>
            <Col span="8">
              <FormItem label="查询时间">
                <DatePicker type="date" v-model="tab3.search.time" placement="bottom-end" :options="tab3.endTimeOptions"
                  @on-change="tab3HandleTime" placeholder="请选择查询时间段" style="width: 100%;"></DatePicker>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem>
                <Button type="success" size="large" icon="ios-search" class="searchBtn" @click="tab3HandlePage(1)">搜索</Button>
                <Button type="info" size="large" icon="ios-refresh" class="searchBtn" @click="tab3HandleReset">重置</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>

        <Divider/>

        <!-- 数据表格区域 -->
        <div style="width:100%;">
          <div style="width:100%;height:50vh;" id="pie2"></div>
        </div>
      </div>
    </TabPane>
  </Tabs>
</template>

<script>
import {GetDateStrByF} from '@/utils/methods'
export default {
  data () {
    return {
      mapWidth: document.body.clientWidth - 240 + 'px',
      mapHeightFull: document.body.clientHeight - 280 + 'px',
      map: null,
      heatmapOverlay: '',
      tab2: {
        endTimeOptions: {
          // disabledDate (date) {
          //   return date && date.valueOf() > Date.now()
          // }
        },
        search: {
          time: [new Date(GetDateStrByF(-30, ',')), new Date(GetDateStrByF(-1, ','))]
        }
      },
      tab3: {
        endTimeOptions: {
          // disabledDate (date) {
          //   return date && date.valueOf() > Date.now()
          // }
        },
        search: {
          time: new Date(GetDateStrByF(0, ',')),
          type: ''
        }
      },
      tab6: {
        endTimeOptions: {
          // disabledDate (date) {
          //   return date && date.valueOf() > Date.now()
          // }
        },
        search: {
          time: [new Date(GetDateStrByF(-30, ',')), new Date(GetDateStrByF(-1, ','))],
          type: ''
        }
      }
    }
  },
  mounted () {
    this.tab2List()
    this.tab3List()
    this.tab6List()
  },
  methods: {
    tab2List: function () {
      this.axios.post('/getlinedata').then((res) => {
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
            name: '通话次数',
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
            name: '通话次数',
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
    tab2HandleTime (time) {
      this.tab2.search.time = time
    },
    tab2HandlePage (page) {
      this.tab2List()
    },
    tab2HandleReset () {
      this.tab2.search.time = [new Date(GetDateStrByF(-30, ',')), new Date(GetDateStrByF(-1, ','))]

      this.tab2List()
    },
    tab3List () {
      let charts = this.$echarts.init(document.getElementById('pie2'))
      let options = {
        title: {
          text: '是否真实主叫占比情况',
          top: 20
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          data: ['真实主叫', '虚假主叫']
        },
        series: [
          {
            name: '占比情况',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              {value: parseInt(Math.random() * (300 - 10 + 1) + 10, 10), name: '真实主叫'},
              {value: parseInt(Math.random() * (300 - 10 + 1) + 10, 10), name: '虚假主叫'}
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
                  show: false,
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
    },
    tab3HandleTime (time) {
      this.tab3.search.time = time
    },
    tab3HandlePage (page) {
      this.tab3List()
    },
    tab3HandleReset () {
      this.tab3.search.time = new Date(GetDateStrByF(0, ','))
      this.tab3List()
    },
    tab6HandleTime (time) {
      this.tab6.search.time = time
    },
    tab6HandlePage (page) {
      this.tab6List()
    },
    tab6HandleReset () {
      this.tab6.search.time = [new Date(GetDateStrByF(-30, ',')), new Date(GetDateStrByF(-1, ','))]

      this.tab6List()
    },
    tab6List () {
      let gxMapEch = this.$echarts.init(this.$refs.gxMap)
      let option = {
        title: {
          text: '工单趋势分析',
          left: 'center',
          top: '30'
        },
        tooltip: {
          trigger: 'item'
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            dataView: {readOnly: false},
            restore: {},
            saveAsImage: {}
          }
        },
        visualMap: {
          min: 0,
          max: 100,
          text: ['High', 'Low'],
          realtime: false,
          calculable: true,
          inRange: {
            color: ['lightskyblue', 'yellow', 'orangered']
          }
        },
        series: [{
          type: 'map',
          map: 'china',
          name: '拨打量',
          roam: false,
          label: {
            normal: {
              show: true,
              // position: ['50%', '50%'],
              formatter: function (params) {
                let name = params.name
                return name
                // if (params.value) {
                //   return name + '\n\n影响程度:' + params.value
                // } else {
                //   return name
                // }
              }
            },
            emphasis: {
              show: true
            }
          },
          data: [
            {name: '新疆', value: parseInt(Math.random() * (100 - 10 + 1) + 10, 10)},
            {name: '西藏', value: parseInt(Math.random() * (100 - 10 + 1) + 10, 10)},
            {name: '青海', value: parseInt(Math.random() * (100 - 10 + 1) + 10, 10)},
            {name: '甘肃', value: parseInt(Math.random() * (100 - 10 + 1) + 10, 10)},
            {name: '四川', value: parseInt(Math.random() * (100 - 10 + 1) + 10, 10)},
            {name: '宁夏', value: parseInt(Math.random() * (100 - 10 + 1) + 10, 10)},
            {name: '云南', value: parseInt(Math.random() * (100 - 10 + 1) + 10, 10)},
            {name: '重庆', value: parseInt(Math.random() * (100 - 10 + 1) + 10, 10)},
            {name: '贵州', value: parseInt(Math.random() * (100 - 10 + 1) + 10, 10)},
            {name: '广西', value: parseInt(Math.random() * (100 - 10 + 1) + 10, 10)},
            {name: '广东', value: parseInt(Math.random() * (100 - 10 + 1) + 10, 10)},
            {name: '湖南', value: parseInt(Math.random() * (100 - 10 + 1) + 10, 10)},
            {name: '湖北', value: parseInt(Math.random() * (100 - 10 + 1) + 10, 10)},
            {name: '山西', value: parseInt(Math.random() * (100 - 10 + 1) + 10, 10)},
            {name: '陕西', value: parseInt(Math.random() * (100 - 10 + 1) + 10, 10)},
            {name: '山东', value: parseInt(Math.random() * (100 - 10 + 1) + 10, 10)},
            {name: '河南', value: parseInt(Math.random() * (100 - 10 + 1) + 10, 10)},
            {name: '河北', value: parseInt(Math.random() * (100 - 10 + 1) + 10, 10)},
            {name: '天津', value: parseInt(Math.random() * (100 - 10 + 1) + 10, 10)},
            {name: '北京', value: parseInt(Math.random() * (100 - 10 + 1) + 10, 10)},
            {name: '江西', value: parseInt(Math.random() * (100 - 10 + 1) + 10, 10)},
            {name: '福建', value: parseInt(Math.random() * (100 - 10 + 1) + 10, 10)},
            {name: '江苏', value: parseInt(Math.random() * (100 - 10 + 1) + 10, 10)},
            {name: '安徽', value: parseInt(Math.random() * (100 - 10 + 1) + 10, 10)},
            {name: '辽宁', value: parseInt(Math.random() * (100 - 10 + 1) + 10, 10)},
            {name: '吉林', value: parseInt(Math.random() * (100 - 10 + 1) + 10, 10)},
            {name: '黑龙江', value: parseInt(Math.random() * (100 - 10 + 1) + 10, 10)},
            {name: '内蒙古', value: parseInt(Math.random() * (100 - 10 + 1) + 10, 10)},
            {name: '上海', value: parseInt(Math.random() * (100 - 10 + 1) + 10, 10)},
            {name: '海南', value: parseInt(Math.random() * (100 - 10 + 1) + 10, 10)},
            {name: '浙江', value: parseInt(Math.random() * (100 - 10 + 1) + 10, 10)},
            {name: '澳门', value: parseInt(Math.random() * (100 - 10 + 1) + 10, 10)},
            {name: '香港', value: parseInt(Math.random() * (100 - 10 + 1) + 10, 10)},
            {name: '台湾', value: parseInt(Math.random() * (100 - 10 + 1) + 10, 10)}
          ]
        }]
      }
      gxMapEch.setOption(option)
      window.addEventListener('resize', function () {
        gxMapEch.resize()
      })
    },
    getSearchCondition (time) {
      let start = time[0]
      let formatStart = ''
      if (start.length === 10) {
        formatStart = start.substring(0, 4) + start.substring(5, 7) + start.substring(8, 10) + '000000'
      }
      let end = time[1]
      let formatEnd = ''
      if (end.length === 10) {
        formatEnd = end.substring(0, 4) + end.substring(5, 7) + end.substring(8, 10) + '235959'
      }

      return {
        'startTime': formatStart,
        'endTime': formatEnd
      }
    }
  }
}
</script>
