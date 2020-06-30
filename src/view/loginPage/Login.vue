<template>
  <div class="login-bg login-wrapper">
    <div class="login-form-wrapper">
      <Form ref="login" :model="login" :rules="ruleValidate" :label-width="0" class="login-form bg-color-f border-box">
        <div class="login-form-title text-align m-b-xs">管理子系统</div>
        <p class="text-align m-t-md p-n color-subtext ">请输入您的账号.</p>
        <Row>
          <Col span="24">
            <FormItem label="用户名" prop="userName">
              <Input v-model="login.userName" placeholder="请输入用户名" prop="userName"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="密  码" prop="password">
              <Input type="password" v-model="login.password" placeholder="请输入密码"></Input>
            </FormItem>
          </Col>
        </Row>
        <!-- <Row>
          <Col span="19">
            <FormItem label="验证码" prop="verifyCode" class="border-box p-r-ls">
              <Input v-model="login.verifyCode" placeholder="请输入验证码"></Input>
            </FormItem>
          </Col>
          <Col span="5">
            <img :src="codeSrc" style="width: 100%; minWidth: 50px; maxWidth: 110px; cursor: pointer; height:32px;" @click="getCode()"/>
          </Col>
        </Row> -->
        <Row>
          <Col span="12" class="login-btn">
            <FormItem>
              <Button type="primary" @click="handleSubmit('login')" class="width-fill">登录</Button>
            </FormItem>
          </Col>
          <Col span="12" class="login-btn">
            <FormItem>
              <Button @click="handleReset('login')" class="width-fill" >重置</Button>
            </FormItem>
          </Col>
        </Row>
        <p class="text-align m-t-xs text-sm p-n color-subtext ">为了好的体验，建议使用谷歌、火狐等高版本的浏览器</p>
      </Form>
    </div>

    <!-- 修改密码提示模态框 -->
    <Modal v-model="alertModal" width="360" :closable="false" :mask-closable="false">
        <p slot="header" style="color:#f60;text-align:center">
            <Icon type="ios-information-circle"></Icon>
            <span>密码过期提示</span>
        </p>
        <div style="text-align:center">
            <p v-html="tipMsg"></p>
        </div>
        <div slot="footer">
            <Button type="error" size="large" long @click="confirm()">确定</Button>
        </div>
    </Modal>

    <!-- 修改密码模态框 -->
    <Modal
      v-model="pwdModal"
      title="修改密码"
      @on-ok="ok('pwd')"
      @on-cancel="cancel('pwd')"
      :closable="false"
      :loading="pwdLoading"
      :mask-closable="false">
      <Alert type="success" show-icon>
        <Icon type="ios-bulb-outline" slot="icon"></Icon>
        <font color="red">{{tipMsg}}</font>
      </Alert>

      <Form ref="pwd" :model="pwd" :rules="pwdValidate" :label-width="80">
        <Row>
          <Col span="23">
            <FormItem label="用户名" prop="userName">
                <Input v-model="pwd.userName" disabled placeholder="请输入新密码"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="23">
            <FormItem label="原始密码" prop="oldPwd">
                <Input type="password" v-model="pwd.oldPwd" disabled placeholder="请输入新密码"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="23">
            <FormItem label="新密码" prop="newPwd">
                <Input type="password" v-model="pwd.newPwd" placeholder="请输入新密码"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="23">
            <FormItem label="确认密码" prop="confirmPwd">
                <Input type="password" v-model="pwd.confirmPwd" placeholder="请再次输入密码"></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  </div>
</template>
<script>
import Cookies from 'js-cookie'
import sessionStore from '../../utils/sessionStore'
import md5 from 'js-md5'
import store from '@/store/index' // 引入全局store

export default {
  data () {
    return {
      alertModal: false,
      pwdModal: false,
      pwdLoading: true,
      tipMsg: '',
      codeSrc: this.baseURL + '/auth/code?timestamp=' + new Date().getTime(),
      login: {
        userName: '',
        password: ''
        // verifyCode: ''
      },
      ruleValidate: {
        userName: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            type: 'string',
            min: 6,
            message: '密码位数不小于六位',
            trigger: 'blur'
          }
        ]
        // verifyCode: [
        //   {
        //     required: true,
        //     message: '请输入验证码',
        //     trigger: 'blur'
        //   }
        // ]
      },
      pwd: {
        userName: '',
        oldPwd: '',
        newPwd: '',
        confirmPwd: ''
      },
      pwdValidate: {
        newPwd: [
          {
            required: true,
            message: '请输入新密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 20,
            message: '密码需在6~20个字符之间',
            trigger: 'blur'
          }
        ],
        confirmPwd: [
          {
            required: true,
            message: '请输入确认密码',
            trigger: 'blur'
          },
          {
            validator: this.pwdEquals,
            message: '两次密码输入不一致',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    loginst () {
      // 静态目录
      const token = 'b0e5021e-8a4e-45cb-bb41-0a0b6b65090b'
      const menusData = [
        {
          menuId: 'ManageOne',
          menuName: '策略管理'
        },
        {
          menuId: 'ManageTwo',
          menuName: '统计管理'
        },
        {
          menuId: 'adv',
          menuName: '管控策略',
          parentMenu: 'ManageOne'
        },
        {
          menuId: 'casePhone',
          menuName: '案件收集',
          parentMenu: 'ManageOne'
        },
        {
          menuId: 'showPhone',
          menuName: '事中提醒',
          parentMenu: 'ManageOne'
        },
        {
          menuId: 'handlePhone',
          menuName: '事中阻断',
          parentMenu: 'ManageOne'
        },
        {
          menuId: 'phone',
          menuName: '输入流量统计',
          parentMenu: 'ManageTwo'
        },
        {
          menuId: 'people',
          menuName: '业务平台流量统计',
          parentMenu: 'ManageTwo'
        },
        {
          menuId: 'remaind',
          menuName: '特征指纹库统计',
          parentMenu: 'ManageTwo'
        },
        {
          menuId: 'statistics',
          menuName: '统计报表',
          parentMenu: 'ManageTwo'
        },
        // 福建demo
        {
          menuId: 'fujianDemo',
          menuName: '福建demo'
        },
        {
          menuId: 'fujianDemo2',
          menuName: '福建demo2'
        },
        {
          menuId: 'fujianhome',
          menuName: '首页',
          parentMenu: 'fujianDemo'
        },
        // {
        //   menuId: 'psokManager',
        //   menuName: '基础信息管理',
        //   parentMenu: 'fujianDemo'
        // },
        {
          menuId: 'pslistManager',
          menuName: '入网渠道/工具',
          parentMenu: 'fujianDemo'
        },
        {
          menuId: 'demo7',
          menuName: '关停投诉报表分析',
          parentMenu: 'fujianDemo'
        },
        {
          menuId: 'demo8',
          menuName: '受害人分析',
          parentMenu: 'fujianDemo'
        },
        {
          menuId: 'demo9',
          menuName: '号源地分析',
          parentMenu: 'fujianDemo'
        },
        {
          menuId: 'LACManager',
          menuName: '工单趋势分析报表',
          parentMenu: 'fujianDemo'
        },
        // {
        //   menuId: 'UsersStationManager',
        //   menuName: '伪基站呈现追踪',
        //   parentMenu: 'fujianDemo'
        // },
        {
          menuId: 'zpphone',
          menuName: '环形饼图',
          parentMenu: 'fujianDemo'
        },
        {
          menuId: 'demo5',
          menuName: '环形饼图',
          parentMenu: 'fujianDemo'
        },
        {
          menuId: 'stopuser',
          menuName: '自动踢网、关停用户',
          parentMenu: 'fujianDemo2'
        },
        {
          menuId: 'zql',
          menuName: '准确率',
          parentMenu: 'fujianDemo2'
        },
        {
          menuId: 'zhl',
          menuName: '召回率/查全率',
          parentMenu: 'fujianDemo2'
        },
        {
          menuId: 'tzfx',
          menuName: '特征分析',
          parentMenu: 'fujianDemo2'
        },
        {
          menuId: 'xwdfx',
          menuName: '行为地分析',
          parentMenu: 'fujianDemo2'
        },
        {
          menuId: 'qsfx',
          menuName: '趋势分析',
          parentMenu: 'fujianDemo2'
        },
        {
          menuId: 'hydfx',
          menuName: '号源地分析',
          parentMenu: 'fujianDemo2'
        },
        {
          menuId: 'shrfx',
          menuName: '受害人分析',
          parentMenu: 'fujianDemo2'
        }, {
          menuId: 'yshmxx',
          menuName: '疑似号码信息监测',
          parentMenu: 'fujianDemo2'
        }, {
          menuId: 'ysshyh',
          menuName: '疑似受害用户监测',
          parentMenu: 'fujianDemo2'
        }, {
          menuId: 'myhmyc',
          menuName: '漫游号码异常监测',
          parentMenu: 'fujianDemo2'
        }, {
          menuId: 'ycmrhm',
          menuName: '异常漫入号码监测',
          parentMenu: 'fujianDemo2'
        },
        {
          menuId: 'china',
          menuName: '中国地图',
          parentMenu: 'fujianDemo'
        },
        {
          menuId: 'systemManage',
          menuName: '系统管理'
        },
        {
          menuId: 'userManage',
          menuName: '操作员管理',
          parentMenu: 'systemManage'
        },
        {
          menuId: 'roleManage',
          menuName: '角色管理',
          parentMenu: 'systemManage'
        },
        {
          menuId: 'logManage',
          menuName: '日志管理',
          parentMenu: 'systemManage'
        },
        {
          menuId: 'gtManage',
          menuName: '关停投诉报表分析'
        },
        {
          menuId: 'gtTable',
          menuName: '关停投诉报表分析',
          parentMenu: 'gtManage'
        },
        // 诈骗趋势分析
        {
          menuId: 'zpqsManage',
          menuName: '诈骗趋势分析'
        },
        {
          menuId: 'zpqs',
          menuName: '诈骗趋势分析',
          parentMenu: 'zpqsManage'
        },
        // 策略管理
        {
          menuId: 'ywgzManage',
          menuName: '业务规则管理'
        },
        {
          menuId: 'clmanage',
          menuName: '策略管理',
          parentMenu: 'ywgzManage'
        },
        // 诈骗综合分析
        {
          menuId: 'zpzhManage',
          menuName: '诈骗综合分析'
        },
        {
          menuId: 'phonenumber',
          menuName: '号码分析',
          parentMenu: 'zpzhManage'
        },
        {
          menuId: 'area',
          menuName: '地域分析',
          parentMenu: 'zpzhManage'
        },
        {
          menuId: 'yys',
          menuName: '运营商分析',
          parentMenu: 'zpzhManage'
        },
        {
          menuId: 'time',
          menuName: '时间分析',
          parentMenu: 'zpzhManage'
        },
        {
          menuId: 'home',
          menuName: '首页'
        },
        {
          menuId: 'homePage',
          menuName: '首页',
          parentMenu: 'home'
        },
        { // 数据管理
          menuId: 'datamanager',
          menuName: '数据管理'
        },
        {
          menuId: 'black',
          menuName: '黑名单管理',
          parentMenu: 'datamanager'
        },
        {
          menuId: 'white',
          menuName: '白名单管理',
          parentMenu: 'datamanager'
        },
        {
          menuId: 'sample',
          menuName: '正样本库管理',
          parentMenu: 'datamanager'
        },
        // 地下水监控
        {
          menuId: 'groundWater',
          menuName: '业务规则管理'
        },
        {
          menuId: 'stopuser',
          menuName: '策略管理',
          parentMenu: 'groundWater'
        },
        {
          menuId: 'facility',
          menuName: '监控设备',
          parentMenu: 'groundWater'
        },
        {
          menuId: 'map',
          menuName: '地图平台',
          parentMenu: 'groundWater'
        },
        {
          menuId: 'dataAnalysis',
          menuName: '数据分析',
          parentMenu: 'groundWater'
        },
        {
          menuId: 'userManager',
          menuName: '用户管理',
          parentMenu: 'groundWater'
        }

      ]
      const name = 'admin'
      Cookies.set('Admin-Token', token)
      store.commit('SET_TOKEN', token)
      store.commit('SET_MENUS', menusData)
      sessionStore.setItemData('menus', menusData)
      store.commit('SET_NAME', name)
      Cookies.set('user-name', name)
      this.$router.push({path: '/'})
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          // let salt = this.md5.salt
          // let pwd = md5(this.login.userName + salt + this.login.password)
          // let param = {
          //   userName: this.login.userName,
          //   password: pwd
          //   // verifyCode: this.login.verifyCode
          // }
          this.loginst()
          // this.axios.post('/auth/login', param).then(resp => {
          //   if (resp.code === 200) {
          //     // 判断是否需要提示
          //     let expired = resp.data.expired
          //     let firstLogin = resp.data.firstLogin

          //     // 登录信息写入
          //     this.loginInfo(resp.data, this.login.userName)

          //     if (firstLogin) {
          //       // 第一次登录提示
          //       this.tipMsg = '由于您是第一次登录，为保证安全，需修改密码后方可使用本系统'
          //       this.pwd.userName = param.userName
          //       this.pwd.oldPwd = pwd
          //       this.pwdModal = true
          //     } else if (expired !== undefined) {
          //       // 密码即将过期提示
          //       this.alertModal = true
          //       this.tipMsg = '您的密码将在' + expired + '天后过期，过期后将不能继续使用本系统。<br/>请尽快修改密码'
          //     } else {
          //       this.$router.push({path: '/'})
          //     }
          //   } else {
          //     this.$Message.error(resp.msg)
          //   }
          // })
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    getCode () {
      this.codeSrc = this.baseURL + '/auth/code?timestamp=' + (new Date()).getTime()
    },
    confirm () {
      this.$router.push({path: '/'})
    },
    ok (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let salt = this.md5.salt
          let param = {
            userName: this.pwd.userName,
            oldPwd: this.pwd.oldPwd,
            newPwd: md5(this.pwd.userName + salt + this.pwd.newPwd)
          }
          this.axios.post('/user/updatePwd', param).then(resp => {
            if (resp.code !== 200) {
              this.$Message.error(resp.msg)
              this.cacel(name)
            } else {
              this.pwdModal = false
              this.$router.push({path: '/'})
            }
            this.changePwdLoading()
          }).catch(e => {
            this.changePwdLoading()
          })
        } else {
          this.changePwdLoading()
        }
      })
    },
    cancel (name) {
      this.$refs[name].resetFields()
    },
    pwdEquals (rule, value, callback) {
      let pwd = this.pwd.newPwd
      if (pwd !== value) {
        callback(new Error())
      } else {
        callback()
      }
    },
    loginInfo (data, name) {
      // 菜单默认
      let menusData = data.menu
      // 保存token数据到cookie ，vuex
      Cookies.set('Admin-Token', data.token)
      this.$store.commit('SET_TOKEN', data.token)
      // 保存菜单数据到vuex ，sessionStorage
      this.$store.commit('SET_MENUS', menusData)
      sessionStore.setItemData('menus', menusData)
      this.$store.commit('SET_NAME', name)
      Cookies.set('user-name', name)
    },
    changePwdLoading () {
      this.pwdLoading = false
      this.$nextTick(() => {
        this.pwdLoading = true
      })
    }
  }
}
</script>

<style scoped>
.hidden {
  display: none !important;
}
.login-wrapper {
  width: 100%;
  height: 100%;
}
.login-bg {
  background: url(/static/img/login-bg.png) center no-repeat;
  background-size: cover;
}
.bg-color-f {
  background-color: #fff;
}
.border-box {
  box-sizing: border-box;
}
.width-fill {
  width: 90%;
}
.text-align {
  text-align: center;
}
.p-n {
  display: block;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: normal;
  line-height: 22px;
  margin: 0 0 10px;
  font-style: normal;
  white-space: normal;
}
.m-t-md {
  margin-top: 20px;
}
.m-t-xs {
  margin-top: 10px;
}
.m-b-xs {
  margin-bottom: 10px;
}
.p-r-ls {
  padding-right: 15px;
}
.text-sm {
  font-size: 12px;
}
.login-form-wrapper {
  display: flex;
  height: 85%;
  align-items: center;
}
.login-form-title {
  font-size: 18px;
  color: #000;
  font-weight: bold;
  text-decoration: none;
}
.color-subtext {
  color: #8491a6
}
.login-form {
  flex: 0 1 25%;
  margin: 0 auto;
  padding: 30px 20px 0 20px;
  border: 1px solid #e2e2e2;
  border-radius: 5px;
  min-width: 410px;
}
.login-form >>> .ivu-form-item-label {
  display: none;
}
.login-btn >>> .ivu-form-item{
  text-align: center;
}
</style>
