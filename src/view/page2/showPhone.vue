<template>
  <div ref="divWidth" class="div-border">
    <Form ref="search" :model="search" :label-width="80">
      <Row>
        <Col span="8">
          <FormItem label="提醒号码">
            <Input type="text" v-model="search.name" placeholder="请输入想要查询的提醒号码" />
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

    <!-- <Button type="success" icon="ios-cloud-upload" @click="batchAdd">导入</Button> -->
    <Table
      border
      :loading="tableLoading"
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

    <!-- 导入modal -->
    <Modal
      v-model="importModal"
      title="导入"
      @on-ok="handleUpload('add')"
      @on-cancel="cancel('add')"
      :loading="add.loading"
    >
      <Form ref="add" :model="add.data" :label-width="100"  label-position="right">
        <FormItem label="疑似号码文件" prop="file">
          <Upload :before-upload="beforeUpload" ref="uploadBtn" action="" :accept="add.accept" :format="add.format">
            <Button icon="ios-cloud-upload-outline">请选择疑似号码文件</Button>
            <span style="margin-left: 10px; color: red;">只支持txt、csv格式的文件</span>
          </Upload>
          <div v-if="add.data.fileName !== null">已选中文件: {{ add.data.fileName }}</div>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { timeFilter } from '@/utils/methods'
export default {
  data () {
    return {
      search: {
        name: '',
        time: [null, null]
      },
      // ---------------------表格数据------------------------------------
      tableLoading: false,
      columns: [
        {
          type: 'index',
          width: 50,
          align: 'center'
        },
        {
          title: '主叫号码',
          key: 'phoneNumber'
        },
        {
          title: '被叫号码',
          key: 'callNumber'
        },
        {
          title: '投递结果',
          key: 'result'
        },
        {
          title: '投递类型',
          key: 'type'
        },
        {
          title: '投递时间',
          key: 'createTime',
          render: (h, params) => {
            return h('span', timeFilter(params.row.createTime))
          }
        }
      ],
      tableData: [
        {
          phoneNumber: '138******83',
          callNumber: '139******63',
          result: '闪信投递失败',
          createTime: '201908041034',
          type: '闪信'
        },
        {
          phoneNumber: '152******12',
          callNumber: '157******95',
          result: '闪信投递成功',
          createTime: '201908011302',
          type: '闪信'
        },
        {
          phoneNumber: '137******92',
          callNumber: '152******03',
          result: '闪信投递失败',
          createTime: '201907041334',
          type: '闪信'
        },
        {
          phoneNumber: '138******60',
          callNumber: '137******16',
          result: '闪信投递成功',
          createTime: '201906201634',
          type: '闪信'
        },
        {
          phoneNumber: '159******32',
          callNumber: '138******62',
          result: '闪信投递失败',
          createTime: '201906041624',
          type: '闪信'
        }
      ],
      pageConfig: {
        total: 5,
        current: 1,
        pageSize: 10
      },
      // ----------------------------导入数据----------------------------
      importModal: false,
      add: {
        loading: true,
        appept: '.txt',
        format: ['.txt'],
        data: {
          source: '',
          file: null,
          fileName: null
        }
      }
    }
  },
  mounted () {
    // this.initailSearch('searchForm')
  },
  methods: {
    init () {
      // 默认请求数据
    },
    searchArguments () {
      // 搜索条件
    },
    handleSearch () {
      // 搜索查询
    },
    handleReset () {
      // 重置搜索条件
      this.search = {
        name: '',
        time: [null, null]
      }
      this.pageConfig = {
        total: 5,
        current: 1,
        pageSize: 10
      }
      // 请求数据
      // this.init()
    },
    batchAdd () {
      // 批量新增按钮 触发 弹框展示
      this.importModal = true
    },
    pageChange (pageIndex) {
      this.pageConfig.current = pageIndex
      this.searchData()
    },
    pageSizeChange (pageSize) {
      this.pageConfig.pageSize = pageSize
    },
    handleUpload (name) { // 导入 实现
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.add.data.file == null) {
            this.$Message.error('请选择号码文件')
          } else {
            this.importModal = false
            this.cancel(name)
          }
        } else {
        }
      })
    },
    // --------------------导入相关方法------------------------------
    beforeUpload (file) {
      this.add.data.file = file
      this.add.data.fileName = file.name
      return false
    },
    cancel (name) { // 取消批量新增
      this.add.data.fileName = null
      this.add.data.file = null
      this.$refs[name].resetFields()
    }
  }
}
</script>

<style lang="css">
@import "../../../static/css/base.css";
</style>
