import Mock from 'mockjs'
import {GetDateStrByF} from '@/utils/methods'
var Ranndom = Mock.Random

/**
  用 @ 来标识其后的字符串是 占位符。
  占位符 引用的是 Mock.Random 中的方法。
  通过 Mock.Random.extend() 来扩展自定义占位符。
  占位符 也可以引用 数据模板 中的属性。
  占位符 会优先引用 数据模板 中的属性。
  占位符 支持 相对路径 和 绝对路径。
 */

const clList = [
  '一证多号拓查',
  '高危imei拓查',
  '同一imei拓查',
  '批量渠道拓查',
  '诈骗骚扰行为分析模型',
  '养卡分析模型',
  '交际圈分析模型',
  '新场景适配分析',
  '渠道开卡分析模型',
  '高危地区位置分析模型'
]
// const phoneLIst = [
//   '152******22',
//   '158******14',
//   '157******19',
//   '138******11',
//   '152******22',
//   '152******64',
//   '152******34',
//   '152******52',
//   '152******46',
//   '152******82'
// ]
const jiangxiCity = [
  '南昌市', '九江市', '上饶市', '抚州市', '宜春市', '吉安市', '赣州市', '景德镇市', '萍乡市', '新余市', '鹰潭市'
]
// const fujianCity = [
//   '福州市', '厦门市', '莆田市', '三明市', '泉州市', '漳州市', '南平市', '龙岩市', '宁德市'
// ]
const timeList = [
  '00:00-01:00', '01:00-02:00', '02:00-03:00', '03:00-04:00', '04:00-05:00', '05:00-06:00', '06:00-07:00', '07:00-08:00', '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
  '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00', '18:00-19:00', '19:00-20:00', '20:00-21:00', '21:00-22:00', '22:00-23:00', '23:00-24:00'
]
const othersCity = [
  '上海市',
  '开封市',
  '银川市',
  '安康市',
  '青岛市',
  '伊春市',
  '枣庄市',
  '运城市',
  '松原市',
  '三亚市',
  '昆明市',
  '日照市',
  '厦门市',
  '成都市',
  '宜兰市',
  '永州市',
  '随州市',
  '乌海市',
  '承德市'
]
function baseList () {
  let res = Mock.mock({
    'data|10': [
      {
        // /^1(5|3|7|8)[0-9]{9}$/ //生成随机电话号
        // 'phoneNumber': function () {
        //   return Mock.mock({
        //     'array|1': phoneLIst
        //   }).array
        // },
        'phoneNumber': /^1(5|3|7|8)[0-9]{9}$/,
        'res|0-1': 0,
        'createTime1': function () {
          var category = [] // 最近30天 时间集合
          var dottedBase = +new Date()
          for (var i = 30; i > 0; i--) {
            var date = new Date((dottedBase -= 1000 * 3600 * 24))
            category.push([date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-'))
          }
          return Mock.mock({
            'array|1': category
          }).array
        },
        'createTime': function () {
          // return Mock.mock('@datetime')
          return Mock.mock('@now')
        },
        'cl': function () {
          return Mock.mock({
            'array|1': clList
          }).array
        }
      }
    ]
  })
  return res.data
}

// 号源地分析
function hyposition () {
  let res = Mock.mock({
    'data|10': [
      {
        'phoneNumber': /^1(5|3|7|8)[0-9]{9}$/,
        'res|0-1': 0,
        'createTime1': function () {
          var category = [] // 最近30天 时间集合
          var dottedBase = +new Date()
          for (var i = 30; i > 0; i--) {
            var date = new Date((dottedBase -= 1000 * 3600 * 24))
            category.push([date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-'))
          }
          return Mock.mock({
            'array|1': category
          }).array
        },
        'city': function () {
          return Mock.mock({
            'city|1': [
              {
                city: '福州市',
                province: ''
              },
              {
                city: '厦门市',
                province: ''
              },
              {
                city: '莆田市',
                province: ''
              },
              {
                city: '三明市',
                province: ''
              },
              {
                city: '泉州市',
                province: ''
              },
              {
                city: '漳州市',
                province: ''
              },
              {
                city: '南平市',
                province: ''
              },
              {
                city: '烟台市',
                province: '山东省'
              },
              {
                city: '威海市',
                province: '山东省'
              },
              {
                city: '滨海新区',
                province: '天津市'
              },
              {
                city: '昌平区',
                province: '北京市'
              },
              {
                city: '成都市',
                province: '四川省'
              },
              {
                city: '西安市',
                province: '陕西省'
              },
              {
                city: '青岛市',
                province: '山东省'
              },
              {
                city: '济南市',
                province: '山东省'
              }
            ]
          }).city
        },
        'createTime': function () {
          // return Mock.mock('@datetime')
          return Mock.mock('@now')
        },
        'cl': function () {
          return Mock.mock({
            'array|1': clList
          }).array
        }
      }
    ]
  })
  return res.data
}

// 诈骗趋势分析 -折线图数据
function linedata () {
  let res = Mock.mock({
    'value': function () {
      let res = []
      for (var i = 0; i < 30; i++) {
        res.push(Ranndom.integer(10, 200))
      }
      return res
    },
    time: function () {
      let res = []
      for (var i = 30; i > 0; i--) {
        res.push(GetDateStrByF(-i, '-'))
      }
      return res
    }
  })
  return res
}
// 号码呼叫量top100
function gettop100phone () {
  let res = Mock.mock({
    'data|10': [{
      'phone': /^1(5|3|7|8)[0-9]{9}$/,
      'num|1-100': 100,
      'hjnum|1-100': 100,
      'cl': function () {
        return Mock.mock({
          'array|1': clList
        }).array
      },
      'city': function () {
        return Mock.mock({
          'city|1': jiangxiCity
        }).city
      },
      'time': Ranndom.now()
    }]
  })
  return res.data
}
// 呼叫地市top50
function gettop100area () {
  let res = Mock.mock({
    'data|10': [{
      'phone': /^1(5|3|7|8)[0-9]{9}$/,
      'ds': function () {
        // return Mock.mock('@city()')
        return Mock.mock({
          'city|1': othersCity
        }).city
      },
      'num|1-100': 100,
      'cl': function () {
        return Mock.mock({
          'array|1': clList
        }).array
      },
      'city': function () {
        return Mock.mock({
          'city|1': jiangxiCity
        }).city
      },
      'time': Ranndom.now()
    }]
  })
  return res.data
}
// 时间分析
function timefx () {
  let res = Mock.mock({
    value: function () {
      let res = []
      for (var i = 0; i < 24; i++) {
        res.push(Ranndom.integer(10, 200))
      }
      return res
    },
    'ser|24': [
      {
        'value|15-190': 100,
        'itemStyle': {
          'color': function () {
            // return Mock.mock('@hex')
            return '#3398DB'
          }
        }
      }
    ],
    time: timeList
  })
  return res
}
// 滚动条 - 疑似受骗实时监控
export function scrollList () {
  let res = Mock.mock({
    'data|20': [{
      'phone': /^1(5|3|7|8)[0-9][*]{4}[0-9]{4}$/,
      'ysphone': /^1(5|3|7|8)[0-9][*]{4}[0-9]{4}$/,
      // 'ysphone': /^1(5|3|7|8)[0-9]{9}$/,
      'reason': function () {
        return Mock.mock({
          'reason|1': ['原因1', '原因2', '原因3']
        }).reason
      },
      'time': function () {
        return Mock.mock({
          'time|1': Ranndom.time()
        }).time
      }
    }]
  })
  return res.data
}
export default {
  getgtList: () => {
    return {
      code: 200,
      msg: 'ok',
      total: 20,
      data: baseList()
    }
  },
  gethyposition: () => {
    return {
      code: 200,
      msg: 'ok',
      total: 20,
      data: hyposition()
    }
  },
  getlinedata: () => {
    return {
      code: 200,
      msg: 'ok',
      data: linedata()
    }
  },
  getHJLtop () {
    return {
      code: 200,
      msg: 'ok',
      total: 100,
      data: gettop100phone()
    }
  },
  getAreatop () {
    return {
      code: 200,
      msg: 'ok',
      total: 50,
      data: gettop100area()
    }
  },
  gettime () {
    return {
      code: 200,
      msg: 'ok',
      data: timefx()
    }
  },
  getScrollList () {
    return {
      code: 200,
      msg: 'ok',
      data: scrollList()
    }
  }
}
