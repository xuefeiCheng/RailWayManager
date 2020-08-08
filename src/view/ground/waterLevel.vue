<template>
  <div class="classify flex space-between border-none" ref="divWidth">
    <div class="box-left flex flex-direction-coloum space-between">
      <div class="box-left-top border-normal Relative">
        <div class="arrow arrow-left" @click="test()"><span class="iconfont icon-icon-test"></span></div>
        <div class="box-content" id="char"></div>
        <div class="arrow arrow-right arrow-disable" @click="test()"><span class="iconfont icon-icon-test1"></span></div>
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
import {} from '@/utils/methods'
export default {
  data () {
    return {
      maxWidth: 0,
      search: {
        psoname: '',
        type: '1'
      },
      selectModal: false, // 图表参数弹框
      selectcolumns: [
        {
          type: 'index',
          width: '45',
          align: 'center'
        }, {
          title: '测点',
          key: 'lacid'
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
                    console.log(val) // 选择的状态 true false
                    console.log(params) // 选择行的数据
                    this.$refs.test.$refs.tbody.objData[params.index]._isChecked = val
                    console.log(this.$refs.test.$refs.tbody.objData)
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
          title: '水位绝对值(m)',
          key: 'poistion'
        }, {
          title: '初始偏差(m)',
          key: 'poistion'
        }, {
          title: '对上次变化(m)',
          key: 'poistion'
        }, {
          title: '累计变化(m)',
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
    handleSelect () {
      // 选择图表
    },
    init () { // 初始化列表
      this.page.current = 1
      this.selectpage.current = 1
      this.loading = true
      let data = {
        list: [
          {
            psoname: '茅坪山隧道进口测站',
            cellid: '2020-03-16 14:31:25',
            lacid: '山顶村1#泉眼水位',
            poistion: '125.3'
          },
          {
            psoname: '高坪隧道1#斜井测站',
            cellid: '2020-03-18 14:31:25',
            lacid: '1#机井水位测点',
            poistion: '152.3'
          },
          {
            psoname: '茅坪山隧道进口测站',
            cellid: '2020-03-19 11:31:25',
            lacid: '福州',
            poistion: '120.3'
          },
          {
            psoname: '茅坪山隧道进口测站',
            cellid: '2020-03-20 10:32:25',
            lacid: '厦门',
            poistion: '36.2'
          },
          {
            psoname: '茅坪山隧道进口测站',
            cellid: '2020-03-28 14:31:25',
            lacid: '泉州',
            poistion: '12.2'
          }
        ],
        count: 5
      }
      this.data = data.list
      this.selectdata = data.list
      this.page.total = data.count
      this.selectpage.total = data.count
      this.loading = false
      this.drawChart('char', {})
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
            show: true, // 是否展示 - 降水量
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
            show: false, // 是否展示 - 墒情
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
              formatter: '{value} ml'
            }
          },
          {
            show: false, // 是否展示 - 流量
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
              formatter: '{value} ml'
            }
          }
        ],
        series: [
          {
            name: '水位',
            type: 'line',
            showName: '名称1',
            data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
            color: colors[0]
          },
          {
            name: '降雨量',
            type: 'bar',
            showName: '名称2',
            yAxisIndex: 1,
            data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
            color: colors[2]
            // color: function (params) {
            //   return colors[params.dataIndex]
            // }
          },
          {
            name: '墒情',
            type: 'line',
            showName: '名称4',
            yAxisIndex: 2,
            data: [6, 9, 190, 30, 29, 7, 17, 182, 487, 18, 6, 3],
            color: colors[4]
          }
        ]
      }
      charts.setOption(option)
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
  float: left;
  margin-left: 15px;
}
.ivu-page-options {
  float: right;
  margin-right: 15px;
}
/* iview更改部分 */
.ivu-menu-vertical.ivu-menu-light:after{
  background: transparent;
}
</style>
