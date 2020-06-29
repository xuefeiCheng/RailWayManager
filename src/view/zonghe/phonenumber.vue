<template>
  <div ref="divWidth" class="div-border">
    <Form ref="search" :model="search" :label-width="80">
      <Row>
        <Col span="8">
          <FormItem label="维度">
            <Select v-model="search.type">
                <Option value="1">号码呼叫量Top100</Option>
                <Option value="2">号码处置量Top5</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="查询时间">
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
  </div>
</template>

<script>
import {GetDateStrByF} from '@/utils/methods'
export default {
  data () {
    return {
      search: {
        time: new Date(GetDateStrByF(0, ',')),
        type: '1'
      },
      columns: [],
      // ---------------------表格数据------------------------------------
      columns1: [
        {
          title: '号码',
          key: 'phone'
        },
        {
          title: '呼叫量',
          key: 'num',
          sortable: true,
          sortType: 'desc'
        },
        {
          title: '中标策略',
          key: 'cl'
        },
        {
          title: '归属地市',
          key: 'city'
        },
        {
          title: '开户时间',
          key: 'time'
        }
      ],
      columns2: [
        {
          title: '地市',
          key: 'city'
        },
        // {
        //   title: '号码',
        //   key: 'phone'
        // },
        {
          title: '处置量',
          key: 'num',
          sortable: true,
          sortType: 'desc'
        },
        {
          title: '呼叫量',
          key: 'hjnum',
          render: (h, params) => {
            return h('span', params.row.num * 12)
          }
        }
        // {
        //   title: '中标策略',
        //   key: 'cl'
        // },
        // {
        //   title: '开户时间',
        //   key: 'time'
        // }
      ],
      tableData: [],
      pageConfig: {
        total: 0,
        current: 1,
        pageSize: 10
      }
    }
  },
  mounted () {
    this.columns = this.columns1
    this.init()
  },
  methods: {
    init () {
      // 默认请求数据
      this.axios.post('/getHJLtop', `${this.search.type}`).then((res) => {
        if (res.code === 200) {
          this.tableData = res.data
          if (this.search.type === '2') {
            this.tableData = res.data.slice(5)
            this.pageConfig.total = 5
          } else {
            this.tableData = res.data
            this.pageConfig.total = res.total
          }
        }
      })
    },
    handleSearch () {
      // 搜索查询
      if (this.search.type !== '1') {
        this.columns = this.columns2
      } else {
        this.columns = this.columns1
      }
      this.init()
    },
    handleReset () {
      // 重置搜索条件
      this.search = {
        time: new Date(GetDateStrByF(0, ',')),
        type: '1'
      }
      this.pageConfig = {
        total: 0,
        current: 1,
        pageSize: 10
      }
      this.columns = this.columns1
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
    }
  }
}
</script>

<style lang="css" scoped>
@import "../../../static/css/base.css";
.modal-add .ivu-modal-body {
  max-height: none !important;
}
</style>
