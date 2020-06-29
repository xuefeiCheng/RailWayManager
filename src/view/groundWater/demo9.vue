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
        name: '',
        time: [new Date(GetDateStrByF(0, ',')), new Date(GetDateStrByF(0, ','))]
      },
      // ---------------------表格数据------------------------------------
      columns: [
        {
          title: '诈骗号码',
          key: 'phoneNumber'
        },
        {
          title: '归属地市',
          render: (h, params) => {
            return h('span', params.row.city.city)
          }
        },
        {
          title: '归属省',
          render: (h, params) => {
            return h('span', params.row.city.province)
          }
        }
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
    // this.initailSearch('searchForm')
    this.init()
  },
  methods: {
    init: function () {
      this.axios.get('/gethyposition').then((res) => {
        if (res.code === 200) {
          this.tableData = res.data
          this.pageConfig.total = res.total
        }
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
    }
  }
}
</script>

<style lang="css">
@import "../../../static/css/base.css";
</style>
