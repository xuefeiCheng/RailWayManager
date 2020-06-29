<template lang="html">
  <div class="classify" ref="divWidth">
    <!-- 搜索区域 -->
    <Form :model="search" :label-width="80">
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
         <Col span="8">
          <FormItem label="特征">
            <Select v-model="search.state">
              <Option value="1">呼叫频次</Option>
              <Option value="2">离散度</Option>
            </Select>
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

 <Modal v-model="addModal" title="新增一条正常基站信息" width='500' :mask-closable="false" :closable="false">
      <Form ref="addForm" :model="addForm" :label-width="80" :rules="validateAddForm">
        <FormItem label="lacid" prop="lacid">
          <Input type="text" v-model="addForm.lacid"></Input>
        </FormItem>
        <FormItem label="cellid" prop='cellid'>
          <Input type="text" v-model="addForm.cellid" ></Input>
        </FormItem>
        <FormItem label="基站名称" prop="psoname">
          <Input type="text" v-model="addForm.psoname"></Input>
        </FormItem>
        <FormItem label="经度" prop='lat'>
          <Input type="text" v-model="addForm.lat" ></Input>
        </FormItem>
         <FormItem label="纬度" prop='lng'>
          <Input type="text" v-model="addForm.lng" ></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="success" @click="cancalAddSingleData('addForm')">取消</Button>
        <Button type="primary" @click="addSingleData('addForm')">确认</Button>
      </div>
    </Modal>
<Modal v-model="deleteModal" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>确认删除</span>
      </p>
      <div style="text-align:center">
        <p>删除数据之后，数据不能恢复</p>
        <p>您确定删除吗？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long @click="deleteSingleData">删除</Button>
      </div>
    </Modal>

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
        psoname: '',
        state: '',
        time: ''
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
      columns: [],
      columns1: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        }, {
          title: '日期',
          key: 'psoname'
        }, {
          title: '呼叫频次1-5次',
          // key: 'cellid1'
          render: (h) => {
            // let num = parseInt(Math.random() * (max - min + 1) + min, 10)
            let num = parseInt(Math.random() * (10000 - 10 + 1) + 10, 10)
            return h('span', num)
          }
        }, {
          title: '呼叫频次5-10次',
          // key: 'cellid2'
          render: (h) => {
            // let num = parseInt(Math.random() * (max - min + 1) + min, 10)
            let num = parseInt(Math.random() * (500 - 10 + 1) + 10, 10)
            return h('span', num)
          }
        }, {
          title: '呼叫频次10-100次',
          // key: 'cellid3'
          render: (h) => {
            // let num = parseInt(Math.random() * (max - min + 1) + min, 10)
            let num = parseInt(Math.random() * (200 - 10 + 1) + 10, 10)
            return h('span', num)
          }
        }, {
          title: '呼叫频次>100次',
          // key: 'cellid4'
          render: (h) => {
            // let num = parseInt(Math.random() * (max - min + 1) + min, 10)
            let num = parseInt(Math.random() * (100 - 10 + 1) + 10, 10)
            return h('span', num)
          }
        }
      ],
      columns2: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        }, {
          title: '日期',
          key: 'psoname'
        }, {
          title: '离散度0',
          // key: 'cellid1'
          render: (h) => {
            // let num = parseInt(Math.random() * (max - min + 1) + min, 10)
            let num = parseInt(Math.random() * (500 - 10 + 1) + 10, 10)
            return h('span', num)
          }
        }, {
          title: '离散度0-0.2',
          // key: 'cellid2'
          render: (h) => {
            // let num = parseInt(Math.random() * (max - min + 1) + min, 10)
            let num = parseInt(Math.random() * (500 - 10 + 1) + 10, 10)
            return h('span', num)
          }
        }, {
          title: '离散度0.2-0.5',
          // key: 'cellid3'
          render: (h) => {
            // let num = parseInt(Math.random() * (max - min + 1) + min, 10)
            let num = parseInt(Math.random() * (500 - 10 + 1) + 10, 10)
            return h('span', num)
          }
        }, {
          title: '离散度0.5-0.9',
          // key: 'cellid4'
          render: (h) => {
            // let num = parseInt(Math.random() * (max - min + 1) + min, 10)
            let num = parseInt(Math.random() * (500 - 10 + 1) + 10, 10)
            return h('span', num)
          }
        }, {
          title: '离散度1',
          // key: 'cellid5'
          render: (h) => {
            // let num = parseInt(Math.random() * (max - min + 1) + min, 10)
            let num = parseInt(Math.random() * (500 - 10 + 1) + 10, 10)
            return h('span', num)
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
            psoname: '202001'
            /* cellid1: '10000',
            cellid2: '4800',
            cellid3: '3222',
            cellid4: '223' */
          },
          {
            psoname: '202002'
            /* cellid1: '10000',
            cellid2: '4800',
            cellid3: '3222',
            cellid4: '223' */
          },
          {
            psoname: '202003'
            /* cellid1: '10000',
            cellid3: '3222',
            cellid4: '223' */
          },
          {
            psoname: '202004'
            /* cellid1: '10000',
            cellid2: '4800',
            cellid3: '3222',
            cellid4: '223' */
          }
        ],
        count: 4
      }
      this.columns = this.columns1
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
      // this.loading = true
      // this.page.current = page
      // page = page - 1
      if (this.search.psoname === '1' && this.search.state === '1') {
        this.columns = this.columns1
        let data = {
          list: [
            {
              psoname: '202001'
            },
            {
              psoname: '202002'
            },
            {
              psoname: '202003'
            },
            {
              psoname: '202004'
            }
          ],
          count: 4
        }
        this.data = data.list
        this.page.total = data.count
        this.loading = false
      } else if (this.search.psoname === '2' && this.search.state === '1') {
        this.columns = this.columns1
        let data = {
          list: [
            {
              psoname: '20200401'
            },
            {
              psoname: '20200402'
            },
            {
              psoname: '20200403'
            },
            {
              psoname: '20200404'
            }
          ],
          count: 4
        }
        this.data = data.list
        this.page.total = data.count
        this.loading = false
      } else if (this.search.psoname === '1' && this.search.state === '2') {
        this.columns = this.columns2
        let data = {
          list: [
            {
              psoname: '202001'
            },
            {
              psoname: '202002'
            },
            {
              psoname: '202003'
            },
            {
              psoname: '202004'
            }
          ],
          count: 4
        }
        this.data = data.list
        this.page.total = data.count
        this.loading = false
      } else if (this.search.psoname === '2' && this.search.state === '2') {
        this.columns = this.columns2
        let data = {
          list: [
            {
              psoname: '20200401'
            },
            {
              psoname: '20200402'
            },
            {
              psoname: '20200403'
            },
            {
              psoname: '20200404'
            }
          ],
          count: 4
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
