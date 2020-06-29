<template>
  <div class="classify flex space-between border-none" ref="divWidth">
    <div class="box-left flex flex-direction-coloum space-between">
      <div class="box-left-top border-normal">
        <div class="box-title border-bottom-normal">分析图</div>
        <div class="box-content" id="char"></div>
      </div>
      <div class="box-left-bottom border-normal">
        <div class="box-title border-bottom-normal">模式计算</div>
        <div class="box-content">
          <Form :model="search" :label-width="80">
            <Row>
              <Col span="8">
                <FormItem label="设备ID">
                  <Input v-model="search.psoname" placeholder="请输入要查询的设备ID..."></Input>
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

    <Table border highlight-row :loading="loading" :columns="columns" :data="data"></Table>
    <div class="tab_footer">
      <Page :total="page.total" :current="page.current" :page-size="page.size" show-total show-elevator show-sizer
        @on-change.self="handlePage" @on-page-size-change.self="handleSize"/>
    </div>
        </div>
      </div>
    </div>
    <div class="box-right border-normal">
        <div class="box-title border-bottom-normal">点位列表</div>
        <div class="box-content">
          <Menu active-name="1-1-2" :open-names="['1','1-1']" mode="vertical" width="auto" >
            <Submenu name="1">
              <template slot="title">
                蒙华铁路
              </template>
              <Submenu name="1-1">
                  <template slot="title">中条山隧道</template>
                  <MenuItem name="1-1-1">西北张井机</MenuItem>
                  <MenuItem name="1-1-2">东北张井机</MenuItem>
              </Submenu>
          </Submenu>
        </Menu>
      </div>
    </div>
  </div>
</template>

<script>
// import $ from 'jquery'
import {} from '@/utils/methods'
export default {
  data () {
    return {
      maxWidth: 0,
      theme2: 'light',
      search: {
        psoname: ''
      },
      columns: [
        {
          title: '设备ID',
          key: 'psoname'
        }, {
          title: '名称',
          key: 'cellid'
        }, {
          title: '设备类型',
          key: 'lacid'
        }, {
          title: 'IMEI号',
          key: 'createtime'
        }, {
          title: '所属隧道',
          key: 'createtime'
        }, {
          title: '状态',
          key: 'createtime'
        }, {
          title: '操作',
          key: 'action',
          width: 150,
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
                    this.searchModal = true
                  }
                }
              }, '查阅'),
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
      page: {
        total: 0,
        size: 10,
        current: 1
      }
    }
  },
  mounted () {
    this.maxWidth = this.$refs.divWidth.offsetWidth - 10
    this.init()
  },
  methods: {
    init () { // 初始化列表
      this.page.current = 1
      this.loading = true
      let data = {
        list: [
          {
            psoname: '15600209318',
            cellid: '2020-03-16 14:31:25',
            lacid: '龙岩市',
            createtime: '话费欠费'
          },
          {
            psoname: '18516836716',
            cellid: '2020-03-18 14:31:25',
            lacid: '厦门',
            createtime: '号码违规'
          },
          {
            psoname: '17611756390',
            cellid: '2020-03-19 11:31:25',
            lacid: '福州',
            createtime: '号码违规'
          },
          {
            psoname: '18500715269',
            cellid: '2020-03-20 10:32:25',
            lacid: '厦门',
            createtime: '号码违规'
          },
          {
            psoname: '13051391287',
            cellid: '2020-03-28 14:31:25',
            lacid: '泉州',
            createtime: '号码违规'
          }
        ],
        count: 5
      }
      this.data = data.list
      this.page.total = data.count
      this.loading = false
      this.axios.post('/gettime').then((res) => {
        if (res.code === 200) {
          this.drawChart('char', res.data)
        }
      })
    },
    drawChart (id, data) {
      let charts = this.$echarts.init(document.getElementById(id))
      const colors = ['#5793f3', '#d14a61']
      let option = {
        color: colors,
        title: {
          text: '中条山隧道-广德村机井1#-监控分析图',
          x: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {type: 'cross'}
        },
        legend: {
          data: ['水位', '降水量'],
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
            min: 0,
            max: 250,
            position: 'left',
            axisLine: {
              lineStyle: {
                color: colors[0]
              }
            },
            axisLabel: {
              formatter: '{value} ml'
            }
          },
          {
            type: 'value',
            name: '降水量',
            min: 0,
            max: 250,
            position: 'right',
            offset: 10,
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
            type: 'bar',
            data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
          },
          {
            name: '降水量',
            type: 'line',
            yAxisIndex: 1,
            data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
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
.box-left{width: 76%;height: 100%;}
.box-left-top{height: 49%;}
.box-left-bottom{height: 49%;}
.box-right{width: 23%;}
.box-title {height: 40px;line-height: 40px;padding-left: 10px;}
.box-content {height: calc(100% - 40px);width: 100%;padding: 10px;overflow-y: auto;}
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
