<template lang="html">
  <div class="classify" ref="divWidth">
    <!-- 搜索区域 -->
    <Form :model="search" :label-width="80">
      <Row>
        <Col span="8">
          <FormItem label="时间粒度">
                <Select v-model="search.type">
                    <Option value="1">年</Option>
                    <Option value="2">月</Option>
                </Select>
              </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="时间">
            <DatePicker type="date" placement="bottom-end" style="width: 100%;" v-model="search.time" placeholder="请选择想要查询的时间"></DatePicker>
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

    </div>
</template>

<script>
import {GetDateStrByF} from '@/utils/methods'
export default {
  data () {
    return {
      maxWidth: 0,
      addModal: false,
      deleteModal: false,
      search: {
        type: '1',
        time: new Date(GetDateStrByF(0, ','))
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
          title: '日期',
          key: 'psoname'
        }, {
          title: '诈骗号码数量',
          key: 'cellid1'
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
            psoname: '202001',
            cellid1: '3233'
          },
          {
            psoname: '202002',
            cellid1: '3434'
          },
          {
            psoname: '202003',
            cellid1: '2223'
          },
          {
            psoname: '202004',
            cellid1: '454'
          }
        ],
        count: 4
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
      if (this.search.type === '1') {
        let data = {
          list: [
            {
              psoname: '202001',
              cellid1: '3434'
            },
            {
              psoname: '202002',
              cellid1: '3442'
            },
            {
              psoname: '202003',
              cellid1: '2333'
            },
            {
              psoname: '202004',
              cellid1: '444'
            }
          ],
          count: 4
        }
        this.data = data.list
        this.page.total = data.count
        this.loading = false
      } else if (this.search.type === '2') {
        let data = {
          list: [
            {
              psoname: '20200301',
              cellid1: '2233'
            },
            {
              psoname: '20200302',
              cellid1: '2332'
            },
            {
              psoname: '20200303',
              cellid1: '10000'
            },
            {
              psoname: '20200304',
              cellid1: '1000'
            },
            {
              psoname: '20200305',
              cellid1: '4000'
            },
            {
              psoname: '20200306',
              cellid1: '3422'
            },
            {
              psoname: '20200307',
              cellid1: '211'
            },
            {
              psoname: '20200308',
              cellid1: '2233'
            },
            {
              psoname: '20200309',
              cellid1: '311'
            },
            {
              psoname: '20200310',
              cellid1: '553'
            },
            {
              psoname: '20200311',
              cellid1: '778'
            },
            {
              psoname: '20200312',
              cellid1: '234'
            },
            {
              psoname: '20200313',
              cellid1: '565'
            },
            {
              psoname: '20200314',
              cellid1: '2335'
            },
            {
              psoname: '20200315',
              cellid1: '3567'
            },
            {
              psoname: '20200316',
              cellid1: '644'
            },
            {
              psoname: '20200317',
              cellid1: '875'
            },
            {
              psoname: '20200318',
              cellid1: '2344'
            },
            {
              psoname: '20200319',
              cellid1: '865'
            },
            {
              psoname: '20200320',
              cellid1: '345'
            },
            {
              psoname: '20200321',
              cellid1: '6767'
            },
            {
              psoname: '20200322',
              cellid1: '334'
            },
            {
              psoname: '20200323',
              cellid1: '452'
            },
            {
              psoname: '20200324',
              cellid1: '866'
            },
            {
              psoname: '20200325',
              cellid1: '1600'
            },
            {
              psoname: '20200326',
              cellid1: '1500'
            },
            {
              psoname: '20200327',
              cellid1: '1630'
            },
            {
              psoname: '20200328',
              cellid1: '4422'
            },
            {
              psoname: '20200329',
              cellid1: '3432'
            },
            {
              psoname: '20200330',
              cellid1: '323'
            },
            {
              psoname: '20200331',
              cellid1: '454'
            }
          ],
          count: 31
        }
        this.data = data.list
        this.page.total = data.count
        this.loading = false
      }
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
