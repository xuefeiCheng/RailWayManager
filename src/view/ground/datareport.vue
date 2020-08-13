<template>
  <div ref="divWidth" class="div-border">
    <!-- 搜索框 -->
    <Form ref="search" :model="search" :label-width="80">
      <Row>
        <Col span="8">
          <FormItem label="报告名称">
            <Input type="text" v-model="search.filename" placeholder="请输入想要查询的报告名" />
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="报告类型">
            <Select v-model="search.type">
              <Option value="1">月报</Option>
              <Option value="2">季报</Option>
              <Option value="3">总结报告</Option>
              <Option value="4">专题报告</Option>
              <Option value="5">其他</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="查询时间">
            <DatePicker type="daterange" placement="bottom-end" :options="options" placeholder="请选择想要查询的时间段"
              style="width: 100%;" show-week-numbers @on-change="timeChange" v-model="search.time"></DatePicker>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="24" style="text-align: center;">
          <FormItem>
            <Button type="success" icon="ios-search" class="searchBtn">查询</Button>
            <Button type="info"  icon="ios-refresh" class="searchBtn">重置</Button>
            <Button type="warning" icon="ios-add-circle-outline" class="searchBtn" @click="msgModal = true">新增</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>

    <Divider/>
    <Table border highlight-row  :columns="columns" :data="data"></Table>
    <div class="tab_footer">
        <Page :total="page.total" :current="page.current" :page-size="page.size" show-total show-elevator
          @on-change.self="handlePage" @on-page-size-change.self="handleSize"/>
      </div>

      <!-- 新增编辑查看 -->
    <Modal
      title="报告信息"
      v-model="msgModal"
      :closable="false">
      <Form
        ref="editform"
        :model="editform"
        :label-width="100"
      >
        <FormItem label="报告名称">
          <Input type="text" v-model="editform.filename" placeholder="报告名称"></Input>
        </FormItem>
        <FormItem label="报告类型">
          <Select v-model="editform.type">
            <Option value="1">月报</Option>
            <Option value="2">季报</Option>
            <Option value="3">总结报告</Option>
            <Option value="4">专题报告</Option>
            <Option value="5">其他</Option>
          </Select>
        </FormItem>
        <FormItem label="请选择文件" prop="file">
          <Upload ref="uploadBtn" :before-upload="beforeUpload" action="" :accept="add.accept" :format="add.format">
            <Button icon="ios-cloud-upload-outline">请选择报告文件</Button>
            <!-- <p style="margin-left: 10px; color: red;">(.txt文件) 格式：号码,添加原因[逗号为英文字符]</p> -->
          </Upload>
          <div v-if="add.data.fileName !== null">已选中文件: {{ add.data.fileName }}</div>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import {GetDateStrByF} from '@/utils/methods'
export default {
  data () {
    return {
      maxWidth: 0,
      msgModal: false,
      search: {
        filename: '',
        time: [new Date(GetDateStrByF(0, ',')), new Date(GetDateStrByF(0, ','))],
        startTime: '',
        endTime: '',
        type: '1'
      },
      editform: {
        filename: '',
        type: '1'
      },
      add: {
        accept: '.txt',
        format: ['.txt'],
        data: {
          file: null,
          fileName: null
        }
      },
      options: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      },
      columns: [
        {
          type: 'index',
          width: '45',
          align: 'center'
        }, {
          title: '报告名称',
          key: 'filename'
        }, {
          title: '报告类型',
          key: 'type',
          render: (h, params) => {
            let txt = ''
            switch (params.row.type) {
              case '1':
                txt = '月报'
                break
              case '2':
                txt = '季报'
                break
              case '3':
                txt = '总结报告'
                break
              case '4':
                txt = '专题报告'
                break
              case '5':
                txt = '其他'
                break
              default:
                txt = ''
            }
            return h('span', txt)
          }
        }, {
          title: '上传日期',
          key: 'uploadTime'
        }, {
          title: '上传人',
          key: 'uploadUser'
        }, {
          title: '操作',
          key: 'action',
          width: 200,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small'
                },
                style: {
                  marginRight: '10px'
                },
                on: {
                  click: () => {
                    this.msgModal = true
                  }
                }
              }, '查看'),
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
                    this.msgModal = true
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'warning',
                  size: 'small'
                },
                on: {
                  click: () => {}
                }
              }, '删除')
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
            'filename': '名称',
            'type': '1',
            'uploadTime': '2020/08/10',
            'uploadUser': '测试'
          }
        ],
        count: 1
      }
      this.data = data.list
      this.page.total = data.count
      this.loading = false
    },
    timeChange (value) {
      let startTime = value[0].substr(0, 4) + value[0].substr(5, 2) + value[0].substr(8, 2) + '000000'
      let endTime = value[1].substr(0, 4) + value[1].substr(5, 2) + value[1].substr(8, 2) + '235959'

      this.search.startTime = startTime
      this.search.endTime = endTime
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
    handleReset () {}
  }
}
</script>

<style lang="css" scoped>
/* 通用部分 */
.flex {
  display: flex;
}
.space-around{
  justify-content: space-around;
}
.space-between{
  justify-content: space-between;
}
.flex-direction-coloum {flex-direction:column;}
.border-normal{
  border: 1px solid #dcdee2;
}
.border-light{
  border: 1px solid #dcdee2;
}
.border-none {
  border: 0 !important;
}
.border-bottom-normal{border-bottom: 1px solid #dcdee2;}
/*面板分割*/
.classify {
  padding: 10px;
  height: 100%;
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
  margin-left: 15px;
}
.ivu-page-options {
  margin-right: 15px;
}
/* iview更改部分 */
.ivu-menu-vertical.ivu-menu-light:after{
  background: transparent;
}
</style>
