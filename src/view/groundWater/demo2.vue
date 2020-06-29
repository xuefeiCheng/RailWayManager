<template lang="html">
  <div class="classify" ref="divWidth">
    <!-- 搜索区域 -->
        <Form ref="search" :model="search" :label-width="80">
      <Row>
        <Col span="5">
          <FormItem label="时间粒度">
                <Select v-model="search.psoname">
                    <Option value="1">月</Option>
                    <Option value="2">周</Option>
                    <Option value="3">日</Option>
                </Select>
              </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="时间">
            <DatePicker type="daterange" placement="bottom-end" style="width: 100%;" v-model="search.time" placeholder="请选择想要查询的时间"></DatePicker>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="渠道">
            <Select v-model="search.type">
                <Option value="">请选择</Option>
                <Option value="1">渠道</Option>
                <Option value="2">告发渠道</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="8" style="text-align: center;">
          <FormItem>
            <Button type="success" icon="ios-search" class="searchBtn" @click="handlePage(1)">查询</Button>
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
    <Modal v-model="modal11" fullscreen footer-hide :closable="false">
        <p slot="header" style="width: 100%;">
          <a style="float: right;" @click='closeModal'>关闭</a>
        </p>
        <div id="baiduMap" ref="baiduMap" style="width: 100%; height: 100%;"></div>
    </Modal>
  </div>
</template>

<script>
import {GetDateStrByF} from '@/utils/methods'
import {} from 'static/data/staticdata.js'
export default {
  data () {
    return {
      modal11: false,
      maxWidth: 0,
      search: {
        type: '',
        time: [new Date(GetDateStrByF(-30, ',')), new Date(GetDateStrByF(-1, ','))],
        psoname: ''
      },
      columns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        }, {
          title: '日期',
          key: 'time'
        }, {
          title: '渠道名称',
          key: 'qdName'
        }, {
          title: '入网身份证数',
          render: (h) => {
            // let num = parseInt(Math.random() * (max - min + 1) + min, 10)
            let num = parseInt(Math.random() * (20 - 10 + 1) + 10, 10)
            return h('span', num)
          }
        }, {
          title: '开卡数',
          render: (h) => {
            // let num = parseInt(Math.random() * (max - min + 1) + min, 10)
            let num = parseInt(Math.random() * (20 - 10 + 1) + 10, 10)
            return h('span', num)
          }
        }, {
          title: '手机开卡数',
          render: (h) => {
            // let num = parseInt(Math.random() * (max - min + 1) + min, 10)
            let num = parseInt(Math.random() * (20 - 10 + 1) + 10, 10)
            return h('span', num)
          }
        }, {
          title: '其他开卡数',
          render: (h) => {
            // let num = parseInt(Math.random() * (max - min + 1) + min, 10)
            let num = parseInt(Math.random() * (20 - 10 + 1) + 10, 10)
            return h('span', num)
          }
        }, {
          title: '异常号码数',
          render: (h) => {
            // let num = parseInt(Math.random() * (max - min + 1) + min, 10)
            let num = parseInt(Math.random() * (20 - 10 + 1) + 10, 10)
            return h('span', num)
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.findByStaid(params.row.staid, params.row.lat, params.row.lng)
                    }
                  }
                },
                '区域查看'
              )
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
      },
      timeout: null
    }
  },
  mounted () {
    this.maxWidth = this.$refs.divWidth.offsetWidth - 10
    this.init()
  },
  methods: {
    init () { // 初始化列表
      let data = {
        list: [
          {
            time: '20200302-20200308',
            qdName: '渠道1'
          }, {
            time: '20200309-20200315',
            qdName: '电渠1'
          }, {
            time: '20200316-20200322',
            qdName: '渠道2'
          }, {
            time: '20200323-20200329',
            qdName: '渠道3'
          }]
      }
      this.page.current = 1
      this.loading = true
      // this.data = pslistManager
      this.data = data.list
      this.page.total = 4
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
      this.axios.post('/pathTrancking/' + page + '/' + this.page.size, this.getSearchCondition()).then((response) => {
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
      this.axios.post('/pathTrancking/0/' + size, this.getSearchCondition()).then((response) => {
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
    findByStaid (id, lat, lng) {
      this.modal11 = true
      this.createMap(id, lat, lng)
    },
    changeLoading () { // 关闭加载状态
      this.addLoading = false
      this.$nextTick(() => {
        this.addLoading = true
      })
    },
    createMap (id, lat, lng) {
      this.map = new window.BMap.Map('baiduMap', {})
      // this.map.setCurrentCity('南宁') // 创建中心城市
      this.map.centerAndZoom(new window.BMap.Point(102.368855, 25.821808), 8) // 创建中心点
      // this.map.centerAndZoom(new window.BMap.Point(lng, lat), 14) // 创建中心点
      // this.map.panTo(new window.BMap.Point(lng, lat))
      this.map.enableScrollWheelZoom() // 开启鼠标滚轮缩放
      let list = [
        {
          lng: 108.368855,
          lat: 22.821808
        },
        {
          lng: 108.468855,
          lat: 22.821808
        },
        {
          lng: 108.368855,
          lat: 22.621808
        },
        {
          lng: 108.238855,
          lat: 22.521808
        },
        {
          lng: 108.248855,
          lat: 22.225808
        },
        {
          lng: 108.218855,
          lat: 22.121808
        },
        {
          lng: 108.428855,
          lat: 22.231808
        }
      ]
      list.forEach((item) => {
        let lng = item.lng
        let lat = item.lat
        this.map.addOverlay(this.createMaker(lng, lat))
      })
      this.map.setMinZoom(8) // 最小缩放级别
      this.map.setMaxZoom(15) // 最大缩放级别
      this.loading = false
    },
    createMaker (lng, lat) {
      var marker = new window.BMap.Marker(new window.BMap.Point(lng, lat))
      return marker
    },
    closeModal () {
      this.modal11 = false
      this.map.clearOverlays() // 清除覆盖物
      this.datagj = null
      window.clearInterval(this.timeout)
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
