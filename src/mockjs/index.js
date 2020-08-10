// var Mock = require('mockjs')
import Mock from 'mockjs'
import Methods from './methods/index'
Mock.mock('/getgtList', 'get', Methods.getgtList)
Mock.mock('/getlinedata', 'post', Methods.getlinedata)
Mock.mock('/getHJLtop', 'post', Methods.getHJLtop)
Mock.mock('/getAreatop', 'post', Methods.getAreatop)
Mock.mock('/gettime', 'post', Methods.gettime)
Mock.mock('/getScrollList', 'post', Methods.getScrollList)
Mock.mock('/gethyposition', 'get', Methods.gethyposition)
Mock.mock('/getWaterLevelData', 'get', Methods.getWaterLevelData)

export default Mock
