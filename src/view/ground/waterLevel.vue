<template>
  <div class="classify flex space-between border-none" ref="divWidth">
    <div class="box-left flex flex-direction-coloum space-between">
      <div class="box-left-top border-normal Relative" v-show="gather">
        <div class="box-content flex">
          <div id="pie" style="width:50%;height:100%"></div>
          <div id="bar" style="width:50%;height:100%"></div>
        </div>
      </div>
      <div class="box-left-top border-normal flex space-between" v-show="!gather">
        <div class="tubiao Relative">
          <div class="arrow arrow-left" @click="handleSearch('forward')"><span class="iconfont icon-icon-test"></span></div>
          <div class="box-content" id="char"></div>
          <div class="arrow arrow-right" :class="step === 0 ? 'arrow-disable' : ''" @click="handleSearch('backward')"><span class="iconfont icon-icon-test1"></span></div>
          <div class="radio-box flex align-items-center justify-content-center">
            <RadioGroup v-model="charRadio">
              <Radio label="小时"></Radio>
              <Radio label="日均"></Radio>
              <Radio label="月均"></Radio>
            </RadioGroup>
          </div>
        </div>
        <div class="image" style="overflow:hidden">
          <img src="../../../static/img/railway/u1339.png" alt="" style="width:100%;">
          <div>
            降雨强度是指在某一历时内的平均降落量。它可以以用单位时间内的降雨深度表示，也可以用单位时间内的面积上的降雨体积表示，降雨强度=降雨量/降雨历时。降雨强度是描述暴雨特征的重要指标，强度越大，雨愈猛烈。计算时特别有意义的是相应于某一历时的最大平均降雨强度，显然，所取的历时越短则求得的降雨强度愈大。
          </div>
        </div>
        </div>
      <div class="box-left-bottom border-normal">
        <div class="box-content">
          <Form :model="search" :label-width="80">
            <Row>
              <Col span="4">
                <FormItem label="标段">
                  <Select v-model="search.biaoduan">
                    <Option value="1">全部</Option>
                    <Option value="2">标段1</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="4">
                <FormItem label="站点名称">
                  <Input v-model="search.psoname" placeholder="请输入要查询的站点名称..."></Input>
                </FormItem>
              </Col>
              <Col span="4">
                <FormItem label="统计类型">
                  <Select v-model="search.type">
                    <Option value="1">月均值</Option>
                    <Option value="2">日均值</Option>
                    <Option value="3">小时值</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="4">
                <FormItem label="查询时间">
                  <DatePicker type="daterange" placement="bottom-end" :options="options" placeholder="请选择想要查询的时间段"
                    style="width: 100%;" show-week-numbers @on-change="timeChange" v-model="search.time"></DatePicker>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem>
                    <Button type="success"  icon="ios-search" class="searchBtn" @click="handlePage(1)">搜索</Button>
                    <Button type="info"  icon="ios-refresh" class="searchBtn" @click="handleReset">重置</Button>
                </FormItem>
              </Col>
            </Row>
        </Form>

    <Table border highlight-row :loading="loading" :columns="columns" :data="data" @on-row-dblclick="draw"></Table>
    <div class="tab_footer">
      <!-- :pageSizeOpts="pageSizeOpts" 自定义页码大小 -->
      <Page :total="page.total" :current="page.current" :page-size="page.size" show-total show-elevator show-sizer
        @on-change.self="handlePage" @on-page-size-change.self="handleSize"/>
    </div>
        </div>
      </div>
    </div>
    <!-- 图表参数弹框 -->
    <Modal
      title="图表参数"
      v-model="selectModal"
      footer-hide
      :closable="false">
      <Table border highlight-row  :columns="selectcolumns" :data="selectdata" ref="test"></Table>
      <div class="tab_footer">
        <Page :total="selectpage.total" :current="selectpage.current" :page-size="selectpage.size" show-total show-elevator
          @on-change.self="handlePage" @on-page-size-change.self="handleSize"/>
      </div>
    </Modal>
  </div>
</template>

<script>
// import $ from 'jquery'
import {createColorCode, GetDateStrByF, GetDateStrByBF} from '@/utils/methods'
export default {
  data () {
    return {
      gather: true, // 汇总图表 是否展示
      options: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      },
      colors: [
        '#2F9323',
        '#D9B63A',
        '#2E2AA4',
        '#9F2E61',
        '#4D670C',
        '#BF675F',
        '#1F814A',
        '#357F88',
        '#673509',
        '#310937',
        '#1B9637',
        '#F7393C'],
      maxWidth: 0,
      search: {
        biaoduan: '1', // 标段选择
        psoname: '',
        type: '1',
        // time: [new Date(GetDateStrByF(-7, ',')), new Date(GetDateStrByF(0, ','))],
        time: ['', ''],
        startTime: '',
        endTime: ''
      },
      startTime: new Date(GetDateStrByF(-7, '/')),
      endTime: new Date(GetDateStrByF(0, '/')),
      step: 0, // 翻页步长
      custType: '', // 自定义图表参数类型
      baseType: '1', // 本页面必要类型
      baseCount: 1,
      selectModal: false, // 图表参数弹框
      chartsSeries: [], // 动态变化的图表series
      selectcolumns: [
        {
          type: 'index',
          width: '45',
          align: 'center'
        }, {
          title: '测点',
          key: 'lacid'
        }, {
          title: '类型',
          key: 'type',
          render: (h, params) => {
            // 类型 1-水位 2-墒情 3-降雨 4-流量
            let txt = ''
            switch (params.row.type) {
              case '1':
                txt = '水位'
                break
              case '2':
                txt = '墒情'
                break
              case '3':
                txt = '降雨'
                break
              case '4':
                txt = '流量'
                break
              default:
                txt = ''
            }
            return h('span', txt)
          }
        }, {
          title: '操作',
          key: 'action',
          width: 100,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('checkbox', {
                props: {
                  label: '选择',
                  value: this.$refs.test.$refs.tbody.objData[params.index]._isChecked
                },
                style: {
                },
                on: {
                  'on-change': (val) => {
                    this.$refs.test.$refs.tbody.objData[params.index]._isChecked = val
                    // 选择的类型
                    let custType = params.row.type
                    // 操作行id
                    let id = params.row.id
                    if (val) {
                      if (custType !== this.baseType) {
                        // 新增自定义数据
                        if (this.custType) {
                          // 已经勾选一条其他类型的数据，禁止再次勾选
                          this.$Message.error('非水位数据仅可选择一条')
                          // 勾选状态更新为之前状态
                          this.$nextTick(() => {
                            this.$refs.test.$refs.tbody.objData[params.index]._isChecked = !val
                          })
                          return false
                        } else {
                          this.custType = custType
                          // 绘制自定义数据 异步请求数据
                          let txt = ''
                          let yAxisIndex
                          switch (this.custType) {
                            case '1':
                              txt = '水位'
                              yAxisIndex = 0
                              break
                            case '2':
                              txt = '墒情'
                              yAxisIndex = 2
                              break
                            case '3':
                              txt = '降雨量'
                              yAxisIndex = 1
                              break
                            case '4':
                              txt = '流量'
                              yAxisIndex = 3
                              break
                          }
                          this.chartsSeries.push({
                            name: txt,
                            type: txt === '降雨量' ? 'bar' : 'line',
                            showName: txt,
                            yAxisIndex: yAxisIndex,
                            id: id,
                            color: createColorCode('#' + Math.floor(Math.random() * 16777215).toString(16), this.colors),
                            data: [
                              Math.ceil(Math.random() * 100),
                              Math.ceil(Math.random() * 100),
                              Math.ceil(Math.random() * 100),
                              Math.ceil(Math.random() * 100),
                              Math.ceil(Math.random() * 100),
                              Math.ceil(Math.random() * 100),
                              Math.ceil(Math.random() * 100),
                              Math.ceil(Math.random() * 100),
                              Math.ceil(Math.random() * 100),
                              Math.ceil(Math.random() * 100),
                              Math.ceil(Math.random() * 100),
                              Math.ceil(Math.random() * 100)
                            ]
                          })
                        }
                      } else {
                        if (this.baseCount > 4) { // 同类数据最多选择4个
                          this.$Message.error('同类数据选择已超过上限')// 勾选状态更新为之前状态
                          this.$nextTick(() => {
                            this.$refs.test.$refs.tbody.objData[params.index]._isChecked = !val
                          })
                          return false
                        } else {
                          this.baseCount += 1
                        }
                        // 新增基础类型数据
                        // 绘制 基础类型数据 异步请求数据
                        this.chartsSeries.push({
                          name: '水位',
                          type: 'line',
                          showName: Math.ceil(Math.random() * 100),
                          yAxisIndex: 0,
                          id: id,
                          color: createColorCode('#' + Math.floor(Math.random() * 16777215).toString(16), this.colors),
                          data: [
                            Math.ceil(Math.random() * 1000),
                            Math.ceil(Math.random() * 100),
                            Math.ceil(Math.random() * 100),
                            Math.ceil(Math.random() * 100),
                            Math.ceil(Math.random() * 100),
                            Math.ceil(Math.random() * 100),
                            Math.ceil(Math.random() * 100),
                            Math.ceil(Math.random() * 100),
                            Math.ceil(Math.random() * 100),
                            Math.ceil(Math.random() * 100),
                            Math.ceil(Math.random() * 100),
                            Math.ceil(Math.random() * 100)
                          ]
                        })
                      }
                    } else {
                      // 删除操作
                      if (custType !== this.baseType) {
                        this.custType = '' // 删除自定义数据 处理前端保存数据
                      } else {
                        this.baseCount -= 1
                        console.log(this.baseCount)
                      }
                      this.chartsSeries.map((val, index) => {
                        if (val.id === id) {
                          this.chartsSeries.splice(index, 1)
                          return true
                        }
                      })
                    }
                    this.drawChart('char', this.chartsSeries)
                    // 选择 图表参数
                    // 校验 type type为本页面主类型，放行 可多个新增
                    // type 为其他类型，先校验 现在展示的类型是什么， 如果是现在展示的类型 要提示先删除之前的 才能新增这个
                    // 如果是未展示的新类型 提示 先删除之前的
                    // true addChar
                    // false deleChar 删除 要根据测点的唯一标识 进行判断
                  }
                }
              }, '选择')
            ])
          }
        }
      ],
      columns: [
        {
          type: 'index',
          width: '45',
          align: 'center'
        }, {
          title: '标段',
          key: 'biaoduan'
        }, {
          title: '记录时间',
          key: 'cellid'
        }, {
          title: '站点',
          key: 'psoname'
        }, {
          title: '测点',
          key: 'lacid'
        }, {
          title: '水位绝对值(m)',
          key: 'poistion'
        }, {
          title: '水位相对值(m)',
          key: 'poistion'
        }, {
          title: '相对下限插值(m)',
          key: 'poistion'
        }, {
          title: '背景值(下/上限)(m)',
          key: 'key1'
        }, {
          title: '阶段变化(m)',
          key: 'poistion'
        }, {
          title: '操作',
          key: 'action',
          width: 200,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'info',
                  size: 'small'
                },
                style: {
                  marginRight: '10px'
                },
                on: {
                  click: () => {
                    // 详情信息弹框展示
                    this.selectModal = true
                  }
                }
              }, '图表参数'),
              h('Button', {
                props: {
                  type: 'warning',
                  size: 'small'
                },
                style: {},
                on: {
                  click: () => {
                    this.logModal = true
                    // 选择开始结束时间 导出弹框展示
                  }
                }
              }, '导出')
            ])
          }
        }
      ],
      loading: true,
      data: [],
      selectdata: [],
      page: {
        total: 0,
        size: 10,
        current: 1
      },
      selectpage: {
        total: 0,
        size: 5,
        current: 1
      },
      pageSizeOpts: [5, 10, 20],
      charRadio: '月均'
    }
  },
  mounted () {
    this.maxWidth = this.$refs.divWidth.offsetWidth - 10
    this.init()
  },
  methods: {
    timeChange (value) {
      let startTime = value[0].substr(0, 4) + value[0].substr(5, 2) + value[0].substr(8, 2) + '000000'
      let endTime = value[1].substr(0, 4) + value[1].substr(5, 2) + value[1].substr(8, 2) + '235959'

      this.search.startTime = startTime
      this.search.endTime = endTime
    },
    test () {
      alert('点击了我')
    },
    draw (data) {
      console.log(data)
      this.gather = false
      this.$nextTick(() => {
        // 绘制默认数据
        this.drawChart('char', [])
      })
    },
    cancel (name) { // 复选框全部重置为 false
      // 设置已勾选项为空或者勾选true
      console.log(this.selectdata)
      console.log(this.$refs[name].$refs.tbody.objData)
      for (let i = 0, le = this.selectdata.length; i < le; i++) {
        this.$refs[name].$refs.tbody.objData[i]._isChecked = false
      }
    },
    handleSearch (type) {
      // 查询条件：站点名称 类型 page pageSize [测点id, 测点id] 时间
      // 上一页 时间范围向前 +7
      // 下一页 时间范围向后 +7 且不能超过今天

      // 翻半页
      // 上一页 时间范围向前 + 3 开始、结束+3
      // 下一页 时间范围向后 +3 且不能超过今天
      if (type === 'forward') {
        this.step -= 7
        this.endTime = GetDateStrByBF(this.startTime, 0, '/')
        this.startTime = GetDateStrByBF(this.startTime, -7, '/')
      } else if (type === 'backward') {
        this.step += 7
        this.startTime = GetDateStrByBF(this.endTime, 0, '/')
        this.endTime = GetDateStrByBF(this.endTime, 7, '/')
      }
      console.log('查询时间段为：' + this.startTime + '-' + this.endTime)
    },
    handleSelect () {
      // 选择图表
    },
    initChar () {
      // 初始话 图表数据
    },
    addChar () {
      // 增加图表参数
    },
    deleChar () {
      // 删除图表参数
    },
    init () { // 初始化table表格数据
      this.page.current = 1
      this.selectpage.current = 1
      this.loading = true
      let data = {
        list: [
          {
            psoname: '茅坪山隧道进口测站',
            biaoduan: 'CZSG-1',
            cellid: '2020-03-16 14:31:25',
            lacid: '山顶村1#泉眼水位',
            poistion: '125.3',
            key1: '110.35/126.75',
            type: '1',
            id: 2
          },
          {
            psoname: '高坪隧道1#斜井测站',
            biaoduan: 'CZSG-1',
            cellid: '2020-03-18 14:31:25',
            lacid: '1#机井水位测点',
            poistion: '152.3',
            key1: '110.35/126.75',
            type: '2',
            id: 3
          },
          {
            psoname: '茅坪山隧道进口测站',
            biaoduan: 'CZSG-1',
            cellid: '2020-03-19 11:31:25',
            lacid: '福州',
            poistion: '120.3',
            key1: '110.35/126.75',
            type: '3',
            id: 4
          },
          {
            psoname: '茅坪山隧道进口测站',
            biaoduan: 'CZSG-2',
            cellid: '2020-03-20 10:32:25',
            lacid: '厦门',
            poistion: '36.2',
            key1: '110.35/126.75',
            type: '4',
            id: 5
          },
          {
            psoname: '茅坪山隧道进口测站',
            biaoduan: 'CZSG-2',
            cellid: '2020-03-28 14:31:25',
            lacid: '泉州',
            poistion: '12.2',
            key1: '110.35/126.75',
            type: '1',
            id: 6
          }
        ],
        count: 5
      }
      this.data = data.list
      this.selectdata = data.list
      this.page.total = data.count
      this.selectpage.total = data.count
      this.loading = false
      this.drawPie('pie')
      this.drawTop10('bar')
      // this.axios.get('/getWaterLevelData').then((res) => {
      //   if (res.code === 200) {
      //     console.log(res)
      //   }
      // })
    },
    drawPie (id) {
      let charts = this.$echarts.init(document.getElementById(id))
      charts.clear()
      let option = {
        title: {
          text: '点位变化情况汇总',
          left: 'left',
          top: 20
        },
        tooltip: {
          trigger: 'item',
          formatter: '数据 <br/>{b} : {c}个 ({d}%)'
        },
        series: [{
          name: '点位变化情况汇总',
          type: 'pie',
          radius: '55%',
          center: ['50%', '50%'],
          data: [{
            value: 210,
            name: '均值上升点位'
          },
          {
            value: 235,
            name: '均值下降点位'
          }
          ],
          roseType: 'radius',
          label: {
            color: '#888',
            formatter: '{b} : {d}%'
          },
          labelLine: {
            lineStyle: {
              color: '#888'
            }
          },
          itemStyle: {
            normal: {
              color: function (params) {
                var colorList = ['#00ff99', '#33ccff', '#388df6', '#ffff99', '#00ffcc']
                return colorList[params.dataIndex % colorList.length]
              }
            }
          },
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
            return Math.random() * 200
          }
        }]
      }
      charts.setOption(option, true)
      this.chartsSeries = charts.getOption().series
      window.addEventListener('resize', function () {
        charts.resize()
      })
    },
    drawTop10 (id) {
      let charts = this.$echarts.init(document.getElementById(id))
      charts.clear()
      const colors = ['#5793f3', '#d14a61', '#9E87FF', '#73DDFF', '#fe9a8b', '#F56948', '#9E87FF']
      let option = {
        title: {
          text: '水位下降幅度top10',
          left: 'left',
          top: 20
        },
        color: colors,
        tooltip: {
          trigger: 'axis',
          axisPointer: {type: 'cross'},
          formatter: '{b} <br/>下降幅度 : {c}%'
        },
        grid: {
          y: 100
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            data: ['测点1', '测点2', '测点3', '测点4', '测点5', '测点6', '测点7', '测点8', '测点9', '测点10']
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '幅度',
            position: 'left',
            axisLine: {
              lineStyle: {
                color: colors[3]
              }
            },
            axisLabel: {
              formatter: '{value} %'
            }
          }
        ],
        series: [
          {
            name: '下降幅度',
            type: 'bar',
            id: 1,
            data: [90, 85, 70, 65, 52, 43, 32, 21, 15, 6],
            color: colors[3]
          }
        ]
      }
      // let yAxis = charts.getOption().yAxis
      charts.setOption(option, true)
      this.chartsSeries = charts.getOption().series
      window.addEventListener('resize', function () {
        charts.resize()
      })
    },
    drawChart (id, data) {
      let charts = this.$echarts.init(document.getElementById(id))
      charts.clear()
      const colors = ['#5793f3', '#d14a61', '#9E87FF', '#73DDFF', '#fe9a8b', '#F56948', '#9E87FF']
      let option = {
        color: colors,
        tooltip: {
          trigger: 'axis',
          axisPointer: {type: 'cross'},
          formatter: function (params) {
            // 根据 seriesIndex 找到 series数据
            var seriesdata = option.series
            let tip = ''
            if (params != null || params.length > 0) {
              tip += params[0].name + '</br>'
              for (let i = 0, le = params.length; i < le; i++) {
                tip += params[i].marker + seriesdata[i].showName + '(' + params[i].seriesName + ')' + ':' + params[i].value + '</br>'
              }
            }
            return tip
          }
        },
        legend: {
          show: false,
          data: ['水位', '降雨量', '墒情', '流量'],
          x: 'center',
          y: 'bottom'
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '水位',
            position: 'left',
            axisLine: {
              lineStyle: {
                color: colors[0]
              }
            },
            axisLabel: {
              formatter: '{value} m'
            }
          },
          {
            show: this.custType === '3', // 是否展示 - 降水量
            type: 'value',
            name: '降雨量',
            position: 'right',
            offset: 10,
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: colors[1]
              }
            },
            axisLabel: {
              formatter: '{value} mm'
            }
          },
          {
            show: this.custType === '2', // 是否展示 - 墒情
            type: 'value',
            name: '墒情',
            position: 'right',
            offset: 10,
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: colors[1]
              }
            },
            axisLabel: {
              formatter: '{value} %'
            }
          },
          {
            show: this.custType === '4', // 是否展示 - 流量
            type: 'value',
            name: '流量',
            position: 'right',
            offset: 10,
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: colors[1]
              }
            },
            axisLabel: {
              formatter: '{value} m³/h'
            }
          }
        ],
        series: data.length > 0 ? data : [
          {
            name: '水位',
            type: 'line',
            showName: '名称1',
            id: 1,
            data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
            color: colors[3]
          }
          // {
          //   name: '降雨量',
          //   type: 'bar',
          //   showName: '名称2',
          //   yAxisIndex: 1,
          //   data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
          //   color: colors[0]
          //   // color: function (params) {
          //   //   return colors[params.dataIndex]
          //   // }
          // },
          // {
          //   name: '水位',
          //   type: 'line',
          //   showName: '名称4',
          //   yAxisIndex: 2,
          //   data: [6, 9, 190, 30, 29, 7, 17, 182, 487, 18, 6, 3],
          //   color: colors[4]
          // }
        ]
      }
      // let yAxis = charts.getOption().yAxis
      charts.setOption(option, true)
      this.chartsSeries = charts.getOption().series
      window.addEventListener('resize', function () {
        charts.resize()
      })
    },
    handleReset () {
      // 展示 汇总 图表
      this.gather = true
    }
  }
}
</script>

<style lang="css" scoped>
/* 通用部分 */
.Relative {
  position: relative;
}
.flex {
  display: flex;
}
.space-around{
  justify-content: space-around;
}
.space-between{
  justify-content: space-between;
}
.justify-content-center {
  justify-content: center;
}
.align-items-center {
  align-items: center;
}
.flex-direction-coloum {flex-direction:column;}
.border-normal{
  border: 1px solid #dcdee2;
}
.border-light{
  border: 1px solid #dcdee2;
}
.border-none {
  border: 0 !important;
}
.border-bottom-normal{border-bottom: 1px solid #dcdee2;}
/* 布局部分 */
.box-left{width: 100%;height: 100%;}
.box-left-top{height: 49%;}
.box-left-top .tubiao {
  flex: 0 0 70%;
}
.box-left-top .image {
  flex: 0 0 25%;
  box-sizing: border-box;
  padding: 10px;
}
.box-left-bottom{height: 49%;}
.box-right{width: 23%;}
.box-title {height: 40px;line-height: 40px;padding-left: 10px;}
/* .box-content {height: calc(100% - 40px);width: 100%;padding: 10px;overflow-y: auto;} */
.box-content {height: 100%;width: 100%;padding: 10px;overflow-y: auto;}
/* 图表翻页 */
.arrow {
  position: absolute;
  z-index: 999;
  top: 50%;
  margin-top: -25px;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-radius: 50%;
  color: #fff;
  background: #eee;
  cursor: pointer;
}
.arrow:hover {
  background: rgb(48, 47, 47);
  color: #eee;
}
.arrow-left {
  left: 10px;
}
.arrow-right {
  right: 10px;
}
.arrow-disable {
  pointer-events: none;
}
.arrow-disable:hover {
  color: #fff;
  background: #eee;
}
/* 图表下的单选框 */
.radio-box {
  position: absolute;
  bottom: 0;
  width: 100%;
  left: 0;
  height: 30px;
}
/*面板分割*/
.classify {
  padding: 10px;
  height: 100%;
}
/*左右向滚动条隐藏*/
.ivu-table-tip {
  overflow-x: hidden;
}

/*搜索按钮*/
.searchBtn {
  margin: 0 25px;
}

/*分割线*/
.ivu-divider-horizontal {
  height: 2px;
}

/*分页控件*/
.tab_footer {
  margin-top: 10px;
  text-align: center;
  overflow: hidden;
}
.ivu-page-total {
  margin-left: 15px;
}
.ivu-page-options {
  margin-right: 15px;
}
/* iview更改部分 */
.ivu-menu-vertical.ivu-menu-light:after{
  background: transparent;
}
</style>
