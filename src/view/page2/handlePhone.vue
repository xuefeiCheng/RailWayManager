<template>
  <div ref="divWidth" class="div-border">
    <Form ref="search" :model="search" :label-width="100" class="hidden">
      <Row>
        <Col span="8">
          <FormItem label="受害人号码">
            <Input type="text" v-model="search.name" placeholder="请输入想要查询的受害人号码" />
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="案件发生时间">
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

    <Button type="primary" icon="ios-add-circle-outline" @click="singleAdd" class="hidden">新增</Button>
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
<!-- 提示框 -->
    <Modal
      v-model="msgModal"
      title="提示"
      width="600"
      :mask-closable="false"
      :closable="false"
    >
      <Form
        :label-width="100"
      >
        <p>双方正在沟通中··········</p>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="closeModel()">确认</Button>
      </div>
    </Modal>
    <!-- 单个新增 -->
    <Modal
      v-model="singleAddModal"
      title="处理"
      width="600"
      :mask-closable="false"
      :closable="false"
    >
      <Form
        ref="singleAddForm"
        :model="singleAddForm"
        :label-width="100"
        :rules="validateSingleAddForm"
      >
      <!-- 新增 增加什么字段 暂时 号码 + 增加原因 （用户输入？ 下拉选择）-->
      <!-- 确认新增 是否需要再次确认 还是直接点击按钮就新增 -->
      <!-- 号码校验是否需要？ -->
        <FormItem label="处理结果" prop="name">
          <Select v-model="singleAddForm.name">
            <Option value="-1">请选择</Option>
            <Option value="1">成功阻止</Option>
            <Option value="2">受害人拒绝</Option>
            <Option value="3">无法接通</Option>
          </Select>
        </FormItem>
        <FormItem label="处理人员" prop="area">
          <Input type="text" v-model="singleAddForm.area" placeholder="处理人员"></Input>
        </FormItem>
        <FormItem label="涉及金额" prop="money">
          <Input type="text" v-model="singleAddForm.money" placeholder="涉及金额"></Input>
        </FormItem>
        <FormItem label="处理过程" prop="content">
          <Input type="textarea" v-model="singleAddForm.content" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入处理过程···"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="success" @click="cancalAddSingleData('singleAddForm')">取消</Button>
        <Button type="primary" @click="addSingleData('singleAddForm')">确认</Button>
        <!-- <Button type="info" @click="resetSingleData('singleAddForm')">重置</Button> -->
      </div>
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
        // {
        //   title: '案件诈骗号码',
        //   key: 'num1'
        // },
        {
          title: '受害人号码',
          key: 'num2'
        },
        {
          title: '发现时间',
          key: 'createTime',
          render: (h, params) => {
            return h('span', timeFilter(params.row.createTime))
          }
        },
        {
          title: '通话时间',
          key: 'howlong'
        },
        {
          title: '受害人位置',
          key: 'msg'
        },
        {
          title: '操作',
          width: 260,
          render: (h, params) => {
            let btns = [
              h('Icon', {
                props: {
                  type: 'ios-call'
                },
                style: {
                  fontSize: '20px',
                  color: '#009688',
                  marginRight: '15px'
                },
                on: {
                  click: () => {
                    this.msgModal = true
                  }
                }
              }, '电话')
            ]
            if (params.row.roleId !== 'admin' && params.row.roleId !== 'base') {
              btns.push(h('Button', {
                props: {
                  type: 'info',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.singleAddModal = true
                  }
                }
              }, '处理结果'))
            }
            return h('div', btns)
          }
        }
      ],
      tableData: [
        {
          howlong: '612',
          num2: '152******03',
          createTime: '201908141334',
          msg: '116.170863,39.765864'
        },
        {
          howlong: '560',
          num2: '135******30',
          createTime: '201908121234',
          msg: '116.147713,39.75692'
        },
        {
          howlong: '595',
          num2: '137******52',
          createTime: '201908100634',
          msg: '116.155905,39.757918'
        },
        {
          howlong: '635',
          num2: '138******29',
          createTime: '201906041334',
          msg: '116.164,39.763243'
        }
      ],
      pageConfig: {
        total: 4,
        current: 1,
        pageSize: 10
      },
      // ------------------------单条数据 新增--------------------------------
      singleAddModal: false,
      msgModal: false,
      singleAddForm: {
        money: '',
        name: '-1',
        content: '', // 案件反馈信息
        area: '' // 受害人号码
      },
      validateSingleAddForm: {
        money: [
          { required: true, message: '涉及金额', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '处理结果', trigger: 'change' }
        ],
        content: [
          {
            required: true,
            message: '处理过程',
            trigger: 'blur'
          }
        ],
        area: [
          {
            required: true,
            message: '处理人员',
            trigger: 'blur'
          }
        ]
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
        total: 4,
        current: 1,
        pageSize: 10
      }
      // 请求数据
      // this.init()
    },
    singleAdd () {
      // 新增按钮 触发 新增弹框
      this.singleAddModal = true
    },
    addSingleData (formName) {
      // 单条数据新增 实现
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addModal = false
        } else {
          this.addModal = true
          this.$Message.warning('数据格式错误，请填写正确再提交')
        }
      })
    },
    cancalAddSingleData (formName) {
      // 取消单条数据新增
      this.singleAddModal = false
      this.$refs[formName].resetFields()
    },
    resetSingleData (formName) {
      // 重置新增弹框
      this.$refs[formName].resetFields()
    },
    pageChange (pageIndex) {
      this.pageConfig.current = pageIndex
    },
    pageSizeChange (pageSize) {
      this.pageConfig.pageSize = pageSize
    },
    closeModel () {
      this.msgModal = false
    }
  }
}
</script>

<style lang="css">
@import "../../../static/css/base.css";
</style>
