<template>
  <div>
    <Row :gutter="20">
      <i-col span="4" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" count-class="count-style"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 20px;">
      <i-col span="8">
        <Card shadow>
          <chart-pie style="height: 300px;" :value="pieData" text="数据统计"></chart-pie>
        </Card>
      </i-col>
      <i-col span="16">
        <Card shadow>
          <chart-bar style="height: 300px;" :value="barData" text="每周用户活跃量"/>
        </Card>
      </i-col>
    </Row>
    <Row style="margin-top: 20px;">
      <Card shadow>
        <example style="height: 310px;"/>
      </Card>
    </Row>
  </div>
</template>

<script>
import axios from '@/libs/api.request'
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar } from '_c/charts'
import Example from './example.vue'
export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    Example
  },
  data () {
    return {
      inforCardData: [
        { title: '累计点击', icon: 'md-locate', count: 0, color: '#19be6b' },
        { title: '新增法规', icon: 'ios-keypad-outline', count: 0, color: '#2d8cf0' },
        { title: '新增标准', icon: 'ios-information-circle-outline', count: 0, color: '#ff9900' },
        { title: '新增抽检', icon: 'ios-pizza-outline', count: 0, color: '#ed3f14' },
        { title: '新增飞检', icon: 'ios-paper-plane-outline', count: 0, color: '#E46CBB' },
        { title: '新增文章', icon: 'ios-paper-outline', count: 0, color: '#9A66E4' }
      ],
      pieData: [
        {value: 0, name: '法规'},
        {value: 0, name: '标准'},
        {value: 0, name: '抽检'},
        {value: 0, name: '监督检查'},
        {value: 0, name: '文章'}
      ],
      barData: {
        Mon: 13253,
        Tue: 34235,
        Wed: 26321,
        Thu: 12340,
        Fri: 24643,
        Sat: 1322,
        Sun: 1324
      }
    }
  },
  created () {
    this.getTotalCount()
  },
  mounted () {
    this.getShowCount()
    this.getVisitorCount()
  },
  methods: {
    getShowCount () {
      const _this = this
      const option = {
        url: '/api/show/getShowCount/1',
        method: 'get'
      }
      axios.request(option).then(res => {
        if (res.data.code === 200) {
          let showCount = res.data.data
          _this.inforCardData[1].count = showCount.lawCount
          _this.inforCardData[2].count = showCount.criterionCount
          _this.inforCardData[3].count = showCount.spotCheckCount
          _this.inforCardData[4].count = showCount.flightCheckCount
          _this.inforCardData[5].count = showCount.articleCount
        }
      })
    },
    getTotalCount () {
      const _this = this
      const option = {
        url: '/api/show/getShowCount/2',
        method: 'get'
      }
      axios.request(option).then(res => {
        if (res.data.code === 200) {
          let showCount = res.data.data
          _this.pieData[0].value = showCount.lawCount
          _this.pieData[1].value = showCount.criterionCount
          _this.pieData[2].value = showCount.spotCheckCount
          _this.pieData[3].value = showCount.flightCheckCount
          _this.pieData[4].value = showCount.articleCount
        }
      })
    },
    getVisitorCount () {
      const _this = this
      const option = {
        url: '/visitor/getVisitorCount/1',
        method: 'get'
      }
      axios.request(option).then(res => {
        if (res.data.code === 200) {
          _this.inforCardData[0].count = res.data.data
        }
      })
    }
  }
}
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
</style>
