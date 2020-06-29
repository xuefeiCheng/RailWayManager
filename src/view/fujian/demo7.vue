<template>
  <div ref="divWidth" class="div-border">
    <Form ref="search" :model="search" :label-width="80">
      <Row>
         <Col span="5">
          <FormItem label="时间粒度">
                <Select v-model="search.psoname">
                    <Option value="1">月</Option>
                    <Option value="2">日</Option>
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
            <Button type="warning"  icon="ios-eye" class="searchBtn" @click="handleShow">查看</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>

    <Divider />
    <div style="padding-left:20px;color:red;display:none">
      <p>
        时间段内：关停号码量为：657  投诉复机量为：96 投诉复机占比为：12.75%
      </p>
    </div>
    <Table
      border
      highlight-row
      :columns="columns"
      :data="tableData"
      style="margin-top:1rem;"
    ></Table>
    <div class="tab_footer">
      <Page
        :total="pageConfig.total"
        :current="pageConfig.current"
        :page-size="pageConfig.pageSize"
        @on-change="pageChange"
        @on-page-size-change="pageSizeChange"
        show-sizer
        show-elevator
        show-total
      />
    </div>
  <Modal
    v-model="showModal"
    title="占比"
    width="600"
    height="400">
      <div style="width:100%;height:100%">
        <div  id="pie" style="width:550px;height:350px;"></div>
      </div>
    <!-- 自定义footer -->
    <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
import {GetDateStrByF} from '@/utils/methods'
export default {
  data () {
    return {
      search: {
        psoname: '',
        name: '',
        time: [new Date(GetDateStrByF(0, ',')), new Date(GetDateStrByF(0, ','))]
      },
      // ---------------------表格数据------------------------------------
      columns: [
        {
          title: '时间',
          key: 'time'
        },
        {
          title: '工单量',
          render: (h) => {
            // let num = parseInt(Math.random() * (max - min + 1) + min, 10)
            let num = parseInt(Math.random() * (100 - 10 + 1) + 10, 10)
            return h('span', num)
          }
        },
        {
          title: '关停量',
          render: (h) => {
            // let num = parseInt(Math.random() * (max - min + 1) + min, 10)
            let num = parseInt(Math.random() * (20 - 10 + 1) + 10, 10)
            return h('span', num)
          }
        },
        {
          title: '投诉量',
          render: (h) => {
            // let num = parseInt(Math.random() * (max - min + 1) + min, 10)
            let num = parseInt(Math.random() * (20 - 10 + 1) + 10, 10)
            return h('span', num)
          }
        },
        {
          title: '准确率',
          render: (h) => {
            // let num = parseInt(Math.random() * (max - min + 1) + min, 10)
            let num = (Math.random() * 10).toFixed(2)
            return h('span', num + '%')
          }
        },
        {
          title: '复机率',
          render: (h) => {
            // let num = parseInt(Math.random() * (max - min + 1) + min, 10)
            let num = (Math.random() * 10).toFixed(2)
            return h('span', num + '%')
          }
        }
      ],
      tableData: [],
      pageConfig: {
        total: 0,
        current: 1,
        pageSize: 10
      },
      // ----------------------------查看弹框----------------------------
      showModal: false
    }
  },
  mounted () {
    // this.initailSearch('searchForm')
    this.init()
  },
  methods: {
    init: function () {
      let data = {
        list: [
          {
            time: '202001'
          }, {
            time: '202002'
          }, {
            time: '202003'
          }, {
            time: '202004'
          }]
      }
      this.tableData = data.list
      this.pageConfig.total = 4
      /* this.axios.get('/getgtList').then((res) => {
        if (res.code === 200) {
          this.tableData = res.data
          this.pageConfig.total = res.total
        }
      }) */
    },
    searchArguments () {
      // 搜索条件
    },
    handleSearch () {
      if (this.search.psoname === '1') {
        this.init()
      // 搜索查询
      } else {
        let data = {
          list: [
            {
              time: '20200301'
            }, {
              time: '20200302'
            }, {
              time: '20200303'
            }, {
              time: '20200304'
            }, {
              time: '20200305'
            }, {
              time: '20200306'
            }, {
              time: '20200307'
            }, {
              time: '20200308'
            }, {
              time: '20200309'
            }, {
              time: '20200302'
            }, {
              time: '20200310'
            }]
        }
        this.tableData = data.list
        this.pageConfig.total = 15
        this.pageSize = 10
      }
    },
    handleReset () {
      // 重置搜索条件
      this.search = {
        name: '',
        time: [new Date(GetDateStrByF(0, ',')), new Date(GetDateStrByF(0, ','))]
      }
      this.pageConfig = {
        total: 0,
        current: 1,
        pageSize: 10
      }
      // 请求数据
      this.init()
    },
    pageChange (pageIndex) {
      this.pageConfig.current = pageIndex
      this.init()
    },
    pageSizeChange (pageSize) {
      this.pageConfig.pageSize = pageSize
      this.init()
    },
    handleShow () {
      this.showModal = true
      this.drawPie('pie')
    },
    drawPie (id) {
      let charts = this.$echarts.init(document.getElementById(id))
      let options = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          data: ['关停', '投诉复机']
        },
        series: [
          {
            name: '占比',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              {value: 657, name: '关停'},
              {value: 96, name: '投诉复机'}
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
