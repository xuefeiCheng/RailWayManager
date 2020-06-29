<template lang="html">
  <div class="classify" ref="divWidth">
    <!-- 搜索区域 -->
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

    <Divider/>

    <Table border highlight-row :loading="loading" :columns="columns" :data="data" :width="maxWidth"></Table>
    <div class="tab_footer">
      <Page :total="page.total" :current="page.current" :page-size="page.size" show-total show-elevator show-sizer
        @on-change.self="handlePage" @on-page-size-change.self="handleSize"/>
    </div>
<!-- 导出日志模态框 -->
    <Modal v-model="logModal" title="日志导出" @on-ok="auditOK('audit')" @on-cancel="auditCancel('audit')" :loading="loading">
      <Form ref="audit" :label-width="100">
        <FormItem label="开始时间">
          <Date-picker type="date" placeholder="选择日期" style="width:80%"></Date-picker>
        </FormItem>
        <FormItem label="结束时间">
          <Date-picker type="date" placeholder="选择日期" style="width:80%"></Date-picker>
        </FormItem>
      </Form>
    </Modal>
<!-- 审阅模态框 -->
    <Modal v-model="searchModal" title="信息展示" @on-ok="addOK('audit')" @on-cancel="addCancel('audit')" :loading="loading" width="60%" class="overflowlll">
      <Form ref="detail"  :label-width="100">
        <!-- :model="detail.data" -->
        <Row>
          <Col span="12">
            <FormItem label="策略名称">
              <span>
                名称
              </span>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="策略名称">
              <span>
                名称
              </span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="策略名称">
              <span>
                名称
              </span>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="策略名称">
              <span>
                名称
              </span>
            </FormItem>
          </Col>
        </Row>
      </Form>

      <Divider />
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
    </Modal>
  </div>
</template>

<script>
import {} from '@/utils/methods'
export default {
  data () {
    return {
      maxWidth: 0,
      searchModal: false, // 查阅弹框
      logModal: false, // 日志弹框
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
    },
    handleReset () { // 重置查询条件
      this.search.psoname = ''
      this.page.size = 10
      this.init()
    },
    handleTime (time) {
      this.search.time = time
    },
    getSearchCondition () {
      return {
        'psoname': this.search.psoname
      }
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
