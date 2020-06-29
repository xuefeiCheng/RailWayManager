<template>
  <div ref="divWidth" class="div-border">
    <Form ref="search" :model="search" :label-width="80">
      <Row>
        <Col span="8">
          <FormItem label="号码">
            <Input type="text" v-model="search.name" placeholder="请输入想要查询的号码" />
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="时间">
            <DatePicker type="daterange" placement="bottom-end" style="width: 90%;" v-model="search.time" placeholder="请选择想要查询的时间"></DatePicker>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="黑名单类别">
            <Select v-model="search.state">
              <Option value="1">设备黑名单</Option>
              <Option value="2">基站黑名单</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="24" style="text-align: center;">
          <FormItem>
            <Button type="success" icon="ios-search" class="searchBtn" @click="handleSearch">查询</Button>
            <Button type="info"  icon="ios-refresh" class="searchBtn" @click="handleReset">重置</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
    <Divider />
    <Button type="primary" icon="ios-add-circle-outline" @click="showSingleAddModal">新增</Button>
    <Button type="success" icon="ios-cloud-upload" @click="showimportModal">导入</Button>
    <!-- <Button type="info" icon="ios-cloud-download" @click="exportErrorFile">错误文件下载</Button> -->
    <Button type="warning" icon="ios-cloud-download" @click="exportData">导出</Button>
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
      width="620"
      :mask-closable="false"
      :closable="false"
    >
      <Form
        ref="singleAddForm"
        :model="singleAddForm"
        :label-width="100"
        :rules="validateSingleAddForm"
      >
        <FormItem label="项目1" prop="item1">
          <Input type="text" v-model="singleAddForm.item1" placeholder="项目1"></Input>
        </FormItem>
        <FormItem label="项目2" prop="item2">
          <Select v-model="singleAddForm.item2">
            <Option value="1">项目1</Option>
            <Option value="2">项目2</Option>
            <Option value="3">项目3</Option>
          </Select>
        </FormItem>
        <FormItem label="项目3" prop="item3">
          <Input type="textarea" v-model="singleAddForm.item3" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入模板内容及需要参入的参数···"></Input>
        </FormItem>
        <FormItem label="项目4" prop='item4'>
          <CheckboxGroup v-model="singleAddForm.item4">
            <Checkbox label="callTypeDesc">
              <span>{callTypeDesc}</span>
            </Checkbox>
            <Checkbox label="markType">
              <span>{markType}</span>
            </Checkbox>
            <Checkbox label="showTimes">
              <span>{showTimes}</span>
            </Checkbox>
            <Checkbox label="sourceName">
              <span>{sourceName}</span>
            </Checkbox>
            <Checkbox label="num">
              <span>{num}</span>
            </Checkbox>
          </CheckboxGroup>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="success" @click="cancalAddSingleData('singleAddForm')">取消</Button>
        <Button type="primary" @click="addSingleData('singleAddForm')">确认</Button>
        <Button type="info" @click="resetSingleData('singleAddForm')">重置</Button>
      </div>
    </Modal>

    <!-- 确认删除model -->
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
        <Button type="error" size="large" long @click="handleDelete">删除</Button
        >
      </div>
    </Modal>

    <!-- 导入弹框 -->
    <Modal
      v-model="importModal"
      title="导入"
      @on-ok="handleUpload('add')"
      @on-cancel="cancel('add')"
    >
      <Form ref="add" :model="add.data" :label-width="100" label-position="right">
        <FormItem label="请选择文件" prop="file">
          <Upload ref="uploadBtn" :before-upload="beforeUpload" action="" :accept="add.accept" :format="add.format">
            <Button icon="ios-cloud-upload-outline">请选择号码文件</Button>
            <p style="margin-left: 10px; color: red;">(.txt文件) 格式：号码,添加原因[逗号为英文字符]</p>
          </Upload>
          <div v-if="add.data.fileName !== null">已选中号码文件: {{ add.data.fileName }}</div>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { timeFilter, getBraceStrDev, dateToyymmdd } from '@/utils/methods'
export default {
  data () {
    return {
      search: {
        name: '',
        time: ['', ''],
        state: '1'
      },
      tableLoading: false,
      columns: [
        {
          type: 'index',
          width: 40,
          align: 'center'
        }, {
          title: '号码',
          key: 'phoneNumber'
        },
        {
          title: '入库时间',
          key: 'createTime',
          render: (h, params) => {
            return h('span', timeFilter(params.row.createTime))
          }
        },
        {
          type: 'reason',
          title: '加黑原因',
          key: 'reason'
        },
        {
          title: '来源',
          key: 'source'
        },
        {
          title: '操作',
          key: 'action',
          align: 'left',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      // this.deleteIndexs = params.row.唯一标识
                      this.deleteModal = true
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ],
      tableData: [
        {
          'phoneNumber': '15201827282',
          'createTime': '20200531',
          'reason': '2',
          'source': '网站'
        }
      ],
      pageConfig: {
        total: 0,
        current: 1,
        pageSize: 10
      },
      singleAddModal: false,
      singleAddForm: {
        item1: '',
        item2: '',
        item3: '',
        item4: []
      },
      validateSingleAddForm: {
        item1: [
          { required: true, message: '内容不能为空', trigger: 'blur' },
          {
            pattern: /^[\s\S]{1,100}$/,
            message: '请在100字符以内',
            trigger: 'blur'
          }
        ],
        item2: [
          {
            required: true,
            message: '内容不能为空',
            trigger: 'blur'
          },
          {
            // 自定义校验规则
            validator (rule, value, callback, source, options) {
              const errors = []
              // 输入的参数位固定值
              // {callTypeDesc}{markType}{showTimes}{sourceName}{num}
              let res = getBraceStrDev(value, ['callTypeDesc', 'markType', 'showTimes', 'sourceName', 'num'])
              if (!res) { errors.push('内容中输入的参数不包含在下面参数中') }
              callback(errors)
            },
            trigger: 'blur'
          },
          {
            pattern: /^[\s\S]{1,200}$/,
            message: '内容请在200字符以内',
            trigger: 'blur'
          }
        ],
        item3: [
          {
            required: true,
            message: '数据类型不能为空',
            trigger: 'blur'
          }
        ],
        item4: []
      },
      deleteModal: false, // 删除弹框
      deleteIndexs: '', // 删除记录id
      importModal: false, // 导入弹框
      add: {
        appept: '.txt',
        format: ['.txt'],
        data: {
          file: null,
          fileName: null
        }
      }
    }
  },
  mounted () {
    // this.init()
  },
  methods: {
    init () {
      // 默认请求数据
      this.tableData = []
      this.axios.post('/url', this.searchArguments()).then(resp => {
        if (resp.code === 200) {
          let data = resp.data
          this.tableData = data.list
          this.pageConfig.total = data.count
        } else {
          this.$Message.error(resp.msg)
        }
      })
    },
    searchArguments (order, orderType) { // 搜索条件 统一处理
      let startTime = this.search.time[0] !== '' ? dateToyymmdd(this.search.time[0]) + '000000' : ''
      let endTime = this.search.time[1] !== '' ? dateToyymmdd(this.search.time[1]) + '235959' : ''
      return {
        'order': order || '',
        'orderType': orderType || 'asc',
        'pageIdx': this.pageConfig.current - 1,
        'pageSize': this.pageConfig.pageSize,
        'search': {
          'endTime': endTime,
          'startTime': startTime,
          'name': this.search.name,
          'status': this.search.state
        }
      }
    },
    handleSearch () {
      // 执行查询方法
      this.init()
    },
    handleReset () {
      // 重置搜索条件
      this.search = {
        name: '',
        time: ['', ''],
        state: ''
      }
      this.pageConfig = {
        total: 0,
        current: 1,
        pageSize: 10
      }
      // 请求数据
      this.init()
    },
    showSingleAddModal () {
      // 新增按钮 触发 新增弹框
      this.singleAddModal = true
    },
    showimportModal () {
      this.importModal = true
    },
    addSingleData (formName) {
      // 单条数据新增 实现
      this.$refs[formName].validate(valid => {
        if (valid) {
          // this.axios.post('/url', {
          //   // 参数
          // }).then(resp => {
          //   if (resp.code === 200) {
          //     this.init()
          //     this.$Message.success('操作成功')
          //   } else {
          //     this.$Message.error(resp.msg)
          //   }
          // })
          // this.cancalAddSingleData(formName)
        } else {
          this.singleAddModal = true
          this.$Message.warning('数据格式错误，请填写正确再提交')
        }
      })
    },
    cancalAddSingleData (formName) {
      // 取消新增
      this.singleAddModal = false
      this.$refs[formName].resetFields()
    },
    resetSingleData (formName) {
      // 重置新增弹框
      this.$refs[formName].resetFields()
    },
    exportErrorFile () { // 失败文件下载
      let headers = {
        headers: { 'Content-Type': 'application/json' },
        responseType: 'blob'
      }
      this.axios.post(`/url`, {}, headers).then(data => {
        let dataType = data.type
        if (dataType === 'application/force-download') {
          let url = window.URL.createObjectURL(data)
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', '导入失败文件.txt')
          document.body.appendChild(link)
          link.click()
        } else {
          this.$Message.error('不存在失败文件')
        }
      })
    },
    exportData () {
      // 导出数据
      let data = [
        {
          'phoneNumber': '15201827282',
          'createTime': '20200531',
          'reason': '2',
          'source': '网站'
        }
      ]
      const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'})
      let url = window.URL.createObjectURL(blob)
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', '导出文件.txt')
      document.body.appendChild(link)
      link.click()
    },
    exportData1 () {
      // 导出数据
      if (this.pageConfig.total === 0) {
        this.$Message.warning('导出数据不能为空')
      } else {
        let headers = {
          headers: { 'Content-Type': 'application/json' },
          responseType: 'blob'
        }
        this.axios.post(`/url`, {
          // 导出接口 参数
        }, headers).then(data => {
          if (data.code === null || data.code === '') {
            this.$Message.error(data.msg)
          } else {
            let url = window.URL.createObjectURL(data)
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', '导出文件.txt')
            document.body.appendChild(link)
            link.click()
          }
        })
      }
    },
    handleUpload (name) { // 具体导入功能
      this.tableData.push({
        'phoneNumber': '15201827282',
        'createTime': '20200531',
        'reason': '2',
        'source': '网站'
      })
      // this.$refs[name].validate((valid) => {
      //   if (valid) {
      //     if (this.add.data.file == null) {
      //       this.$Message.error('请选择号码文件')
      //     } else {
      //       let formData = new FormData()
      //       formData.append('file', this.add.data.file)
      //       this.axios.post('/xmSysWhite/import', formData, {
      //         headers: {
      //           'Content-Type': 'multipart/form-data'
      //         },
      //         timeout: this.longtimeout
      //       }).then((response) => {
      //         let code = response.code
      //         let da = response.data
      //         if (code === 200) {
      //           this.$Message.success(da)
      //           this.importModal = false
      //           this.init()
      //           this.cancel(name)
      //         } else {
      //           this.$Message.error('导入失败')
      //           this.importModal = false
      //           this.cancel(name)
      //         }
      //       }).catch((e) => {
      //         this.$Message.error(e)
      //       })
      //     }
      //   } else {
      //   }
      // })
    },
    beforeUpload (file) { // 文件导入前的处理
      let fileType = file.name.split('.')[1]
      if (fileType !== 'txt') {
        this.$Notice.warning({
          title: '文件格式不正确',
          desc: '文件 ' + file.name + ' 格式不正确，请上传.txt文件'
        })
      } else {
        this.add.data.file = file
        this.add.data.fileName = file.name
      }
      return false
    },
    cancel (name) { // 取消导入
      this.add.data.fileName = null
      this.add.data.file = null
      this.$refs[name].resetFields()
    },
    pageChange (pageIndex) {
      this.pageConfig.current = pageIndex
      this.init()
    },
    pageSizeChange (pageSize) {
      this.pageConfig.pageSize = pageSize
      this.pageConfig.current = 1
      this.init()
    },
    handleDelete () {
      this.axios.delete(`/url/${this.deleteIndexs}`).then(data => {
        if (data.code === 200) {
          this.$Message.success('删除成功')
          this.init()
        } else {
          this.$Message.error(data.msg)
        }
      })
      this.deleteModal = false
    }
  }
}
</script>

<style lang="css">
@import "../../../static/css/base.css";
</style>
