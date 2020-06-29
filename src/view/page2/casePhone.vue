<template>
  <div ref="divWidth" class="div-border">
    <Form ref="search" :model="search" :label-width="100">
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

    <Button type="primary" icon="ios-add-circle-outline" @click="singleAdd">新增</Button>
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
    <!-- 单个新增 -->
    <Modal
      v-model="singleAddModal"
      title="新增"
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
        <FormItem label="案件诈骗号码" prop="name">
          <Input type="text" v-model="singleAddForm.name" placeholder="案件诈骗号码"></Input>
        </FormItem>
        <FormItem label="受害人号码" prop="area">
          <Input type="text" v-model="singleAddForm.area" placeholder="受害人号码"></Input>
        </FormItem>
        <FormItem label="案件反馈信息" prop="content">
          <Input type="textarea" v-model="singleAddForm.content" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入案件反馈信息···"></Input>
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
        {
          title: '案件诈骗号码',
          key: 'num1'
        },
        {
          title: '受害人号码',
          key: 'num2'
        },
        {
          title: '案件发生时间',
          key: 'createTime',
          render: (h, params) => {
            return h('span', timeFilter(params.row.createTime))
          }
        },
        {
          title: '案件反馈信息',
          key: 'msg'
        }
      ],
      tableData: [
        {
          num1: '135******20',
          num2: '152******03',
          createTime: '201908041334',
          msg: '事主接到一名自称淘宝天猫客服女子的电话，对方称事主淘宝账户被官方误操作变为铂金会员每月会扣款，后对方转接到一名自称银行经理男子的电话，对方称如需取消会员需要按照对方说的操作，对方以检查流水为由让对方向指定账户转账，后事主通过手机银行向对方账户转账5000元，到账后对方挂断电话，事主反打无人接听，后经警方核实被骗'
        },
        {
          num1: '135******20',
          num2: '135******30',
          createTime: '201908011034',
          msg: '事主接到自称银行经理电话，对方称其信用额度受损，需要人工核实恢复。要求事主转账激活信用系统，事主分三次共向其转账5万元。经警方核实被骗'
        },
        {
          num1: '135******20',
          num2: '137******52',
          createTime: '201907141320',
          msg: '事主接到自称某某地方警员的信息，对方称其个人信息被盗用，需要核实是否为本人；最终事主向其转账2万元整。经某某警察局核实无此人。'
        },
        {
          num1: '135******20',
          num2: '138******29',
          createTime: '201906041334',
          msg: '事主接到自称某某医院的护士，称其母亲突发疾病住院，需要事主远程协助挂号。随即事主提供个人信息，最终个人银行卡内被盗刷4万元整。'
        }
      ],
      pageConfig: {
        total: 4,
        current: 1,
        pageSize: 10
      },
      // ------------------------单条数据 新增--------------------------------
      singleAddModal: false,
      singleAddForm: {
        name: '',
        content: '', // 案件反馈信息
        area: '' // 受害人号码
      },
      validateSingleAddForm: {
        name: [
          { required: true, message: '诈骗号码不能为空', trigger: 'blur' }
        ],
        content: [
          {
            required: true,
            message: '案件反馈信息不能为空',
            trigger: 'blur'
          }
        ],
        area: [
          {
            required: true,
            message: '受害人号码不能为空',
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
    }
  }
}
</script>

<style lang="css">
@import "../../../static/css/base.css";
</style>
