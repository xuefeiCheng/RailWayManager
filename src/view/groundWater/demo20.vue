<template lang="html">
  <div class="classify" ref="divWidth">
    <!-- 搜索区域 -->
    <Form :model="search" :label-width="80">
      <Row>
        <Col span="8">
          <FormItem label="受害号码">
              <Input v-model="search.psoname" placeholder="请输入要查询的受害号码..."></Input>
              </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="时间">
            <DatePicker type="daterange" placement="bottom-end" style="width: 100%;" v-model="search.time" placeholder="请选择想要查询的时间"></DatePicker>
          </FormItem>
        </Col>
            </Row>
                <Row>
        <Col span="24" justify="start" style="text-align: center;">
          <FormItem>
                <Button type="success"  icon="ios-search" class="searchBtn" @click="handlePage(1)">搜索</Button>
                <Button type="info"  icon="ios-refresh" class="searchBtn" @click="handleReset">重置</Button>
          </FormItem>

        </Col>

      </Row>
    </Form>

    <Divider/>

    <Table border highlight-row :loading="loading" :columns="columns" :data="data" :width="maxWidth"></Table>
    <div class="tab_footer">
      <Page :total="page.total" :current="page.current" :page-size="page.size" show-total show-elevator show-sizer
        @on-change.self="handlePage" @on-page-size-change.self="handleSize"/>
    </div>
    </div>
</template>

<script>
import {} from '@/utils/methods'
export default {
  data () {
    return {
      maxWidth: 0,
      addModal: false,
      deleteModal: false,
      search: {

        psoname: ''
      },
      addForm: {
        lacid: '',
        cellid: '',
        psoname: ''
      },
      validateAddForm: {
        lacid: [
          { required: true, message: 'lacid不能为空', trigger: 'blur' }
        ],
        cellid: [{
          required: true, message: 'cellid不能为空', trigger: 'blur'
        }],
        psoname: [{
          required: true, message: '基站名称不能为空', trigger: 'blur'
        }]
      },
      columns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        }, {
          title: '受害号码',
          key: 'psoname'
        }, {
          title: '预警策略',
          key: 'cellid1'
        }, {
          title: '疑似诈骗号码',
          key: 'cellid2'
        }, {
          title: '案发时间',
          key: 'cellid3'
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
            cellid1: '策略1',
            cellid2: '15096367871',
            cellid3: '2020-03-16 14:31:25'
          },
          {
            psoname: '13600207316',
            cellid1: '策略2',
            cellid2: '13873254697',
            cellid3: '2020-03-16 14:31:25'
          },
          {
            psoname: '13873217868',
            cellid1: '策略3',
            cellid2: '13973202711',
            cellid3: '2020-03-16 14:31:25'
          },
          {
            psoname: '13975227978',
            cellid1: '策略4',
            cellid2: '13627321629',
            cellid3: '2020-03-16 14:31:25'
          },
          {
            psoname: '15873272863',
            cellid1: '策略5',
            cellid2: '13875232963',
            cellid3: '2020-03-16 14:31:25'
          }
        ],
        count: 5
      }
      this.data = data.list
      this.page.total = data.count
      this.loading = false
    },
    handleReset () { // 重置查询条件
      this.search.psoname = ''
      this.page.size = 10
      this.init()
    },
    handleUpload (file) {
      let formData = new FormData()
      formData.append('file', file)
      let headers = {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
      this.axios.post('/zcjz/addBaseFile', formData, headers).then(res => {
        // console.log('返回值', res)
        if (res.code === 200) {
          this.$Message.success('导入成功')
          this.handlePage(1)
        } else {
          this.$Message.error('导入失败')
        }
        this.changeLoading()
      })
      return false
    },
    handleTime (time) {
      this.search.time = time
    },
    getSearchCondition () {
      return {
        'psoname': this.search.psoname
      }
    },
    addSingleData (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.axios.post('/zcjz/addBaseStation', this.addForm).then(data => {
            // console.log('添加黑名单数据', data)
            if (data.code === 200) {
              // this.initailSearch('searchForm')
              this.handlePage(1)
              this.$refs[formName].resetFields()
            } else {
              this.$Message.error('正常基站数据添加失败')
              this.$refs[formName].resetFields()
            }
          })
          this.addModal = false
        } else {
          this.addModal = true
          this.$Message.warning('数据格式错误，请填写正确再提交')
        }
      })
    },
    cancalAddSingleData (formName) {
      this.addModal = false
      this.$refs[formName].resetFields()
    },
    deleteSingleData () {
      this.axios.delete(`/zcjz/del/byId/${this.deleteIndex}`).then(data => {
        if (data.code === 200) {
          this.handlePage(1)
        } else {
          this.$Message.error('数据删除失败')
        }
      })
      this.deleteModal = false
    },
    handlePage (page) { // 切换页码/查询
      this.loading = true
      this.page.current = page
      page = page - 1
      this.axios.post('/zcjz/' + page + '/' + this.page.size, this.getSearchCondition()).then((response) => {
        let code = response.code
        if (code === 200) {
          let data = response.data
          this.data = data.list
          this.page.total = data.count
        } else {
          this.$Message.error(response.msg)
        }
        this.loading = false
      }).catch((e) => {
        this.loading = false
      })
    },
    handleSize (size) { // 改变页大小
      this.loading = true
      this.page.size = size
      this.axios.post('/zcjz/0/' + size, this.getSearchCondition()).then((response) => {
        let code = response.code
        if (code === 200) {
          let data = response.data
          this.data = data.list
          this.page.total = data.count
        } else {
          this.$Message.error(response.msg)
        }
        this.loading = false
      }).catch((e) => {
        this.loading = false
      })
    },
    changeLoading () { // 关闭加载状态
      this.addLoading = false
      this.$nextTick(() => {
        this.addLoading = true
      })
    }
  }
}
</script>

<style lang="css">
/*面板分割*/
.classify {
  border: 1px solid #dcdee2;
  padding: 10px;
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
</style>
