<template>
  <div class="classify flex space-between border-none" ref="divWidth">
    <div class="box-left flex flex-direction-coloum space-between">
      <div class="box-left-top border-normal Relative">
        <div class="arrow arrow-left" @click="handleSearch('forward')"><span class="iconfont icon-icon-test"></span></div>
        <div class="box-content" id="char"></div>
        <div class="arrow arrow-right" :class="step === 0 ? 'arrow-disable' : ''" @click="handleSearch('backward')"><span class="iconfont icon-icon-test1"></span></div>
      </div>
      <div class="box-left-bottom border-normal">
        <div class="box-content">
          <Form :model="search" :label-width="80">
            <Row>
              <Col span="8">
                <FormItem label="站点名称">
                  <Input v-model="search.psoname" placeholder="请输入要查询的站点名称..."></Input>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="统计类型">
                  <Select v-model="search.type">
                    <Option value="1">日均值</Option>
                    <Option value="2">小时值</Option>
                  </Select>
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
        psoname: '',
        type: '1'
      },
      startTime: new Date(GetDateStrByF(-7, '/')),
      endTime: new Date(GetDateStrByF(0, '/')),
      step: 0, // 翻页步长
      custType: '', // 自定义图表参数类型
      baseType: '2', // 本页面必要类型
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
                          this.$Message.error('非墒情数据仅可选择一条')
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
                              yAxisIndex = 3
                              break
                            case '2':
                              txt = '墒情'
                              yAxisIndex = 0
                              break
                            case '3':
                              txt = '降雨量'
                              yAxisIndex = 1
                              break
                            case '4':
                              txt = '流量'
                              yAxisIndex = 2
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
                          name: '墒情',
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
          title: '记录时间',
          key: 'cellid'
        }, {
          title: '站点',
          key: 'psoname'
        }, {
          title: '测点',
          key: 'lacid'
        }, {
          title: '墒情(%)',
          key: 'poistion'
        }, {
          title: '对上次变化(%)',
          key: 'poistion'
        }, {
          title: '埋深(m)',
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
      pageSizeOpts: [5, 10, 20]
    }
  },
  mounted () {
    this.maxWidth = this.$refs.divWidth.offsetWidth - 10
    this.init()
  },
  methods: {
    test () {
      alert('点击了我')
    },
    draw (data) {
      console.log(data)
      alert('双击了')
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
            cellid: '2020-03-16 14:31:25',
            lacid: '山顶村1#泉眼水位',
            poistion: '125.3',
            type: '1',
            style: '1',
            id: 2
          },
          {
            psoname: '高坪隧道1#斜井测站',
            cellid: '2020-03-18 14:31:25',
            lacid: '1#机井水位测点',
            poistion: '152.3',
            type: '2',
            style: '2',
            id: 3
          },
          {
            psoname: '茅坪山隧道进口测站',
            cellid: '2020-03-19 11:31:25',
            lacid: '福州',
            poistion: '120.3',
            type: '3',
            style: '1',
            id: 4
          },
          {
            psoname: '茅坪山隧道进口测站',
            cellid: '2020-03-20 10:32:25',
            lacid: '厦门',
            poistion: '36.2',
            type: '4',
            style: '1',
            id: 5
          },
          {
            psoname: '茅坪山隧道进口测站',
            cellid: '2020-03-28 14:31:25',
            lacid: '泉州',
            poistion: '12.2',
            type: '1',
            style: '1',
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
      this.drawChart('char', [])
      // this.axios.get('/getWaterLevelData').then((res) => {
      //   if (res.code === 200) {
      //     console.log(res)
      //   }
      // })
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
            name: '墒情',
            position: 'left',
            axisLine: {
              lineStyle: {
                color: colors[0]
              }
            },
            axisLabel: {
              formatter: '{value} %'
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
              formatter: '{value} ml'
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
          },
          {
            show: this.custType === '1', // 是否展示 - 水位
            type: 'value',
            name: '水位',
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
              formatter: '{value} ml'
            }
          }
        ],
        series: data.length > 0 ? data : [
          {
            name: '墒情',
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
    handleReset () {}
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
