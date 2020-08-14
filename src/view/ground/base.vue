<template lang="html">
  <div class="classify" ref="divWidth">
    <div class="moshiBtn" @click="moshi = !moshi">切换模式</div>
    <!-- 地图区域 -->
    <div class="box box-map" v-show="moshi">
      <div id="baiduMap" style="height:100%;width:100%"></div>
      <div class="box-images hidden">
        <div class="box-images-title flex space-between">
          <div>图片记录</div>
          <div class="box-images-title-icon"  @click="handleImageBox()">{{icon}}</div>
        </div>
        <div class="box-images-content">
          <div style="height:20px">tu</div>
        </div>
      </div>
    </div>
    <!-- 表格区域 -->
    <div class="box box-map" v-show="!moshi">
      <Form ref="search" :model="search" :label-width="80">
        <Row>
          <Col span="8">
            <FormItem label="站点名称">
              <Input type="text" v-model="search.name" placeholder="请输入想要查询的站点名称" />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem>
              <Button type="success" icon="ios-search" class="searchBtn" @click="handleSearch">查询</Button>
              <Button type="info"  icon="ios-refresh" class="searchBtn" @click="handleReset">重置</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Divider />
      <Table border highlight-row :columns="columns" :data="tableData"></Table>
      <div class="tab_footer">
        <Page
          :total="page.total"
          :current="page.current"
          :page-size="page.pageSize"
          @on-change="pageChange"
          @on-page-size-change="pageSizeChange"
          show-sizer
          show-elevator
          show-total
        />
      </div>
    </div>
    <!-- 编辑model -->
    <Modal
      title="报告信息"
      :width= 800
      v-model="msgModal"
      :closable="false">
      <Form
        ref="editform"
        :model="editform"
        :label-width="80"
        style="display:flex;flex-wrap:wrap"
      >
        <FormItem label="站点" style="flex: 0 1 50%">
          <Input type="text" v-model="editform.desc" disabled></Input>
        </FormItem>
        <FormItem label="编号" style="flex: 0 1 50%">
          <Input type="text" v-model="editform.desc" placeholder="备注" disabled></Input>
        </FormItem>
        <FormItem label="站点备注" style="flex: 0 1 50%">
          <Input type="text" v-model="editform.desc" placeholder="备注" disabled></Input>
        </FormItem>
        <FormItem label="建站时间" style="flex: 0 1 50%">
          <Input type="text" v-model="editform.desc" placeholder="备注" disabled></Input>
        </FormItem>
        <FormItem label="当前状态" style="flex: 0 1 50%">
          <Input type="text" v-model="editform.desc" placeholder="备注" disabled></Input>
        </FormItem>
        <FormItem label="测点" style="flex: 0 1 50%">
          <Input type="text" v-model="editform.desc" placeholder="备注" disabled></Input>
        </FormItem>
        <FormItem label="关联工点" style="flex: 0 1 50%">
          <Select v-model="editform.gongdian">
            <Option value="1">月报</Option>
            <Option value="2">季报</Option>
            <Option value="3">总结报告</Option>
            <Option value="4">专题报告</Option>
            <Option value="5">其他</Option>
          </Select>
        </FormItem>
        <FormItem label="站点备注" style="flex: 0 1 50%">
          <Input v-model="editform.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入站点备注..."></Input>
        </FormItem>
        <FormItem label="站点图片" style="flex: 0 1 100%">
          <div class="demo-upload-list" v-for="(item, index) in uploadList" :key="index">
            <template v-if="item.status === 'finished'">
              <img :src="item.url">
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
              </div>
            </template>
            <template v-else>
              <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
          </div>
          <Upload
            ref="upload"
            :show-upload-list="false"
            :default-file-list="defaultList"
            :on-success="handleSuccess"
            :format="['jpg','jpeg','png']"
            :max-size="2048"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
            multiple
            type="drag"
            action="//jsonplaceholder.typicode.com/posts/"
            style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
        </FormItem>
        <!-- <FormItem label="请选择文件" prop="file">
          <Upload ref="uploadBtn" :before-upload="beforeUpload" action="" :accept="add.accept" :format="add.format">
            <Button icon="ios-cloud-upload-outline">请选择报告文件</Button>
            <p style="margin-left: 10px; color: red;">(.txt文件) 格式：号码,添加原因[逗号为英文字符]</p>
          </Upload>
          <div v-if="add.data.fileName !== null">已选中文件: {{ add.data.fileName }}</div>
        </FormItem> -->
      </Form>
    </Modal>
    <Modal title="View Image" v-model="visible">
      <img :src="imgName" v-if="visible" style="width: 100%">
    </Modal>
  </div>
</template>

<script>
import $ from 'jquery'
import {} from '@/utils/methods'
export default {
  data () {
    return {
      maxWidth: 0,
      data: [],
      icon: '-',
      search: {
        name: ''
      },
      moshi: false,
      msgModal: false,
      editform: {
        gongdian: '',
        desc: ''
      },
      page: {
        total: 2,
        current: 1,
        pageSize: 10
      },
      columns: [
        {
          type: 'index',
          width: '45',
          align: 'center'
        }, {
          title: '站点编码',
          key: 'code'
        }, {
          title: '建站时间',
          key: 'createtime'
        }, {
          title: '当前状态',
          key: 'status',
          render: (h, params) => {
            let txt = ''
            switch (params.row.status) {
              case '1':
                txt = '运行'
                break
              case '2':
                txt = '停用'
                break
              default:
                txt = ''
            }
            return h('span', txt)
          }
        }, {
          title: '测点数量',
          key: 'count'
        }, {
          title: '关联工点',
          key: 'gongdian'
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
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'warning',
                  size: 'small',
                  disabled: (params.row.status === '1')
                },
                on: {
                  click: () => {}
                }
              }, '删除')
            ])
          }
        }
      ],
      tableData: [
        {
          'code': '名称',
          'status': '1',
          'createtime': '2020/08/10',
          'count': 2,
          'gongdian': '测试'
        },
        {
          'code': '名1称',
          'status': '2',
          'createtime': '2020/08/10',
          'count': 2,
          'gongdian': '测试'
        }
      ],
      defaultList: [
        {
          'name': 'a42bdcc1178e62b4694c830f028db5c0',
          'url': 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png'
        },
        {
          'name': 'bc7521e033abdd1e92222d733590f104',
          'url': 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png'
        }
      ],
      imgName: '',
      visible: false,
      uploadList: []
    }
  },
  mounted () {
    this.maxWidth = this.$refs.divWidth.offsetWidth - 10
    this.uploadList = this.$refs.upload.fileList
    this.init()
  },
  methods: {
    init () { // 初始化列表
      var map = new window.BMap.Map('baiduMap')
      // 创建地图实例
      var point = new window.BMap.Point(116.404, 39.915)
      // 创建点坐标
      map.centerAndZoom(point, 15)
      map.enableScrollWheelZoom(true) // 开启滚轮缩放
      var marker = new window.BMap.Marker(point) // 创建标注
      map.addOverlay(marker) // 将标注添加到地图中
      var opts = {
        width: 200, // 信息窗口宽度
        height: 100, // 信息窗口高度
        title: '故宫博物院', // 信息窗口标题
        message: '这里是故宫'
      }
      var infoWindow = new window.BMap.InfoWindow('地址：北京市东城区王府井大街88号乐天银泰百货八层', opts) // 创建信息窗口对象
      map.openInfoWindow(infoWindow, point) // 开启信息窗口
      map.addControl(new window.BMap.NavigationControl()) // 控件 放大缩小 方位选择
      // marker.addEventListener('click', function () {
      //   map.openInfoWindow(infoWindow, point) // 开启信息窗口
      // })
    },
    handleImageBox () { // 图片展示框展示与否
      if (this.icon === '-') {
        $('div.box-images-content').slideUp()
        this.icon = '+'
      } else {
        $('div.box-images-content').slideDown()
        this.icon = '-'
      }
    },
    pageChange (pageIndex) {
      this.page.current = pageIndex
      this.init()
    },
    pageSizeChange (pageSize) {
      this.page.pageSize = pageSize
      this.page.current = 1
      this.init()
    },
    handleSearch () {},
    handleReset () {},
    handleView (name) {
      this.imgName = name
      this.imgName = name
      this.visible = true
    },
    handleRemove (file) {
      const fileList = this.$refs.upload.fileList
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
    },
    handleSuccess (res, file) {
      file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar'
      file.name = '7eb99afb9d5f317c912f08b5212fd69a'
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: 'The file format is incorrect',
        desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
      })
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: 'Exceeding file size limit',
        desc: 'File  ' + file.name + ' is too large, no more than 2M.'
      })
    },
    handleBeforeUpload () {
      const check = this.uploadList.length < 5
      if (!check) {
        this.$Notice.warning({
          title: 'Up to five pictures can be uploaded.'
        })
      }
      return check
    }
  }
}
</script>

<style lang="css" scoped>
.flex {
  display: flex;
}
.space-around{
  justify-content: space-around;
}
.space-between{
  justify-content: space-between;
}
.border-normal{
  border: 1px solid #dcdee2;
}
.border-light{
  border: 1px solid #dcdee2;
}
/*面板分割*/
.classify {
  border: 1px solid #dcdee2;
  padding: 10px;
  height: 100%;
}
.box{
  height: 100%;
  width: 100%;
}
.box-map{
  position: relative;
}
.box-images{
  position: absolute;
  top: 0;
  right: 10px;
  width: 20%;
  height: 99%;
}
.box-images-title {
  height: 20px;
  line-height: 20px;
  background: #278bd2;
  color: #fff;
  padding: 0 0 0 10px;
}
.box-images-title-icon {
  width: 20%;
  padding-right: 10px;
  text-align: right;
  cursor: pointer;
}
.box-images-content{
  height: calc(100% - 20px);
  overflow-y: auto;
  background: #dcdee2;
}
/* 内容展示部分 */
.box-content{
  display: flex;
  padding: 10px;
  box-sizing: border-box;
  justify-content: space-around;
}
.box-content-title {
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #dcdee2;
  padding: 0 15px;
  font-weight: bold;
  font-size: 15px;
}
.box-content-content {
  height: calc(100% - 40px);
  padding: 15px;
}
.box-content-content-log {
  height: 100%;
  overflow-y: auto;
}
.box-log{
  flex: 0 1 65%;
  margin-right: 10px;
}
.box-search{
  flex: 0 1 34%;
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
/* 单独 */
.moshiBtn {
  position:absolute;
  top:85px;
  right:0px;
  background:#1567f4;
  z-index:999;
  color:#fff;
  padding:10px;
  border-radius: 10px 0 0 10px;
  text-align:center;
  cursor: pointer;
}
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0,0,0,.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,.6);
}
</style>
