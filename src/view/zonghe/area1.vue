<template lang="html">
  <Tabs type="card" :animated="false">
    <TabPane label="地域top分析" style='min-height:400px'>
      <div class="div-border">
        <!-- 搜索区域 -->
        <Form :model="tab2.search" :label-width="100">
          <Row>
            <Col span="8">
              <FormItem label="维度">
                <Select v-model="tab2.search.type">
                    <Option value="1">呼叫地域主叫Top50</Option>
                    <Option value="2">呼叫地域被叫Top50</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="查询时间">
                <DatePicker type="date" placement="bottom-end" style="width: 100%;" v-model="tab2.search.time" placeholder="请选择想要查询的时间"></DatePicker>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem>
                <Button type="success" size="large" icon="ios-search" class="searchBtn" @click="tab2Handlesearch">搜索</Button>
                <Button type="info" size="large" icon="ios-refresh" class="searchBtn" @click="tab2HandleReset">重置</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>

        <Divider/>

        <!-- 数据表格区域 -->
        <Table border highlight-row :loading="tab2.table.loading" :columns="tab2.table.columns" :data="tab2.table.data"></Table>
        <div class="tab_footer">
          <Page :total="tab2.page.total" :current="tab2.page.current" :page-size="tab2.page.size" show-total show-elevator show-sizer
            @on-change.self="tab2HandlePage" @on-page-size-change.self="tab2HandleSize"></Page>
        </div>
      </div>
    </TabPane>

    <TabPane label="地域统计">
      <div class="div-border">
        <!-- 搜索区域 -->
        <Form :model="tab3.search" :label-width="100">
          <Row>
            <Col span="8">
              <FormItem label="维度">
                <Select v-model="tab3.search.type">
                  <Option value="1">主叫呼叫地域统计</Option>
                  <Option value="2">被叫呼叫地域统计</Option>
                </Select>
              </FormItem>
            </Col>
            <!-- <Col span="8">
              <FormItem label="地市">
                <Select v-model="tab3.search.city">
                  <Option value="">请选择</Option>
                  <Option value="1">11</Option>
                  <Option value="2">2</Option>
                </Select>
              </FormItem>
            </Col> -->
            <Col span="8">
              <FormItem label="查询时间">
                <DatePicker type="date" placement="bottom-end" style="width: 100%;" v-model="tab3.search.time" placeholder="请选择想要查询的时间"></DatePicker>
              </FormItem>
            </Col>
             <Col span="8" offset="8">
              <FormItem>
                <Button type="success" size="large" icon="ios-search" class="searchBtn" @click="tab3Handlesearch">搜索</Button>
                <Button type="info" size="large" icon="ios-refresh" class="searchBtn" @click="tab3HandleReset">重置</Button>
              </FormItem>
            </Col>
          </Row>
          <!-- <Row>
            <Col span="8" offset="8">
              <FormItem>
                <Button type="success" size="large" icon="ios-search" class="searchBtn" @click="tab3Handlesearch">搜索</Button>
                <Button type="info" size="large" icon="ios-refresh" class="searchBtn" @click="tab3HandleReset">重置</Button>
              </FormItem>
            </Col>
          </Row> -->
        </Form>

        <Divider/>

        <!-- 数据表格区域 -->
        <Table border highlight-row :loading="tab3.table.loading" :columns="tab3.table.columns" :data="tab3.table.data"></Table>
        <div class="tab_footer">
          <Page :total="tab3.page.total" :current="tab2.page.current" :page-size="tab3.page.size" show-total show-elevator show-sizer
            @on-change.self="tab3HandlePage" @on-page-size-change.self="tab3HandleSize"></Page>
        </div>
      </div>
    </TabPane>
  </Tabs>
</template>

<script>
import {GetDateStrByF} from '@/utils/methods'
export default {
  data () {
    return {
      tab2: {
        search: {
          time: new Date(GetDateStrByF(0, ',')),
          type: '1'
        },
        table: {
          loading: false,
          columns: [],
          columns1: [
            {
              title: '主叫号码',
              key: 'phone'
            },
            // {
            //   title: '主叫地市',
            //   key: 'ds'
            // },
            {
              title: '呼叫量',
              key: 'num',
              sortable: true,
              sortType: 'desc'
            },
            {
              title: '中标策略',
              key: 'cl'
            },
            {
              title: '归属地市',
              key: 'city'
            },
            {
              title: '开户时间',
              key: 'time'
            }
          ],
          columns2: [
            {
              title: '被叫号码',
              key: 'phone'
            },
            // {
            //   title: '被叫地市',
            //   key: 'ds'
            // },
            {
              title: '呼叫量',
              key: 'num',
              sortable: true,
              sortType: 'desc'
            },
            {
              title: '中标策略',
              key: 'cl'
            },
            {
              title: '归属地市',
              key: 'city'
            },
            {
              title: '开户时间',
              key: 'time'
            }
          ],
          data: []
        },
        page: {
          current: 1,
          size: 10,
          total: 0
        }
      },
      tab3: {
        search: {
          time: new Date(GetDateStrByF(0, ',')),
          type: '1',
          city: ''
        },
        table: {
          loading: false,
          columns: [
            {
              key: 'city',
              title: '地市'
            },
            {
              key: 'num',
              title: '诈骗号码量',
              sortable: true,
              sortType: 'desc'
            },
            {
              key: 'zpnum',
              title: '呼叫量',
              sortable: true,
              sortType: 'desc'
            }
          ],
          data: []
        },
        page: {
          current: 1,
          size: 10,
          total: 0
        }
      }
    }
  },
  mounted () {
    this.tab2.table.columns = this.tab2.table.columns1
    this.tab2List()
    this.tab3List()
  },
  methods: {
    tab2List () {
      // 默认请求数据
      this.axios.post('/getAreatop', `${this.tab2.search.type}`).then((res) => {
        if (res.code === 200) {
          this.tab2.table.data = res.data
          this.tab2.page.total = res.total
        }
      })
    },
    tab2HandlePage (page) {
      this.tab2.page.current = page

      this.tab2List()
    },
    tab2HandleSize (size) {
      this.tab2.page.size = size

      this.tab2List()
    },
    tab2Handlesearch () {
      // 搜索查询
      if (this.tab2.search.type !== '1') {
        this.tab2.table.columns = this.tab2.table.columns2
      } else {
        this.tab2.table.columns = this.tab2.table.columns1
      }
      this.tab2List()
    },
    tab2HandleReset () {
      // 重置搜索条件
      this.tab2.search = {
        time: new Date(GetDateStrByF(0, ',')),
        type: '1'
      }
      this.tab2.pageConfig = {
        total: 0,
        current: 1,
        pageSize: 10
      }
      this.tab2.table.columns = this.tab2.table.columns1
      // 请求数据
      this.tab2List()
    },
    tab3List () {
      if (this.tab3.search.type === '1') {
        // 主叫地市
        this.tab3.table.data = [
          {
            city: '南昌市',
            num: 523,
            zpnum: 43323
          },
          {
            city: '九江市',
            num: 320,
            zpnum: 26212
          },
          {
            city: '吉安市',
            num: 652,
            zpnum: 26023
          },
          {
            city: '上饶市',
            num: 532,
            zpnum: 24142
          },
          {
            city: '抚州市',
            num: 354,
            zpnum: 23523
          },
          {
            city: '昆明市',
            num: 854,
            zpnum: 23411
          },
          {
            city: '上海市',
            num: 242,
            zpnum: 15522
          },
          {
            city: '运城市',
            num: 232,
            zpnum: 12342
          }
        ]
        this.tab3.page.total = 8
      } else {
        // 被叫地市
        this.tab3.table.data = [
          {
            city: '运城市',
            num: 714,
            zpnum: 23545
          },
          {
            city: '三亚市',
            num: 625,
            zpnum: 35264
          },
          {
            city: '厦门市',
            num: 421,
            zpnum: 15211
          },
          {
            city: '上海市',
            num: 362,
            zpnum: 42324
          },
          {
            city: '枣庄市',
            num: 360,
            zpnum: 23024
          },
          {
            city: '松原市',
            num: 152,
            zpnum: 25213
          },
          {
            city: '三亚市',
            num: 523,
            zpnum: 15242
          },
          {
            city: '日照市',
            num: 142,
            zpnum: 52453
          },
          {
            city: '厦门市',
            num: 160,
            zpnum: 23064
          },
          {
            city: '成都市',
            num: 262,
            zpnum: 12564
          }
        ]
        this.tab3.page.total = 10
      }
    },
    tab3HandleTime (time) {
      this.tab3.search.time = time
    },
    tab3HandlePage (page) {
      this.tab3.page.current = page

      this.tab3List()
    },
    tab3HandleSize (size) {
      this.tab3.page.size = size

      this.tab3List()
    },
    tab3Handlesearch () {
      this.tab3List()
    },
    tab3HandleReset () {
      this.tab3.search = {
        time: new Date(GetDateStrByF(0, ',')),
        type: '1',
        city: ''
      }
      this.tab3.page.current = 1

      this.tab3List()
    }
  }
}
</script>

<style lang="css" scoped>
@import "../../../static/css/base.css";
.modal-add .ivu-modal-body {
  max-height: none !important;
}
</style>
