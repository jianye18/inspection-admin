<style scoped>
  .layout{
    /*border: 1px solid #d7dde4;*/
    background: #f5f7f9;
    position: relative;
    /*border-radius: 4px;*/
    overflow: hidden;
  }
  .layout-logo{
    width: 300px;
    height: 30px;
    /*background: #5b6270;*/
    border-radius: 3px;
    float: left;
    position: relative;
    /*top: 4px;*/
    left: 110px;
    font-size: 36px;
    color: #ffffff;
  }
  .layout-nav{
    /*width: 500px;*/
    margin-left: 480px;
  }
  .layout-nav ul{
    list-style: none;
  }
  .layout-nav ul li{
    text-align: center;
    color: #ffffff;
    font-size: 14px;
    width: 120px;
    line-height: 70px;
    float: left;
  }
  .layout-nav ul li:hover{
    background-color: #0b81bf;
    cursor: pointer;
  }
  .layout-nav ul li.active_class{
    background-color: #0b81bf;
  }
</style>
<template>
  <div class="layout">
    <Layout>
      <Header style="background-color: #2c96cd; height: 70px;">
        <div class="layout-logo">
          <img src="../../assets/images/logo.png" />
        </div>
        <div class="layout-nav">
          <ul>
            <li v-for="(item, idx) in menuList"
                :key="item.value"
                :class="idx === activeIdx ? 'active_class' : ''"
                @click="changeMenu(item.value, item.path, idx)">
              {{item.label}}
            </li>
          </ul>
        </div>
      </Header>
      <router-view></router-view>
    </Layout>
  </div>
</template>
<script>
export default {
  data () {
    return {
      menuList: [
        { value: 'main', label: '首页', path: 'main' },
        { value: 'SC', label: '抽检结果', path: 'spotCheck' },
        { value: 'CC', label: '具体标准', path: 'criterion' },
        { value: 'LW', label: '法律法规', path: 'law' },
        { value: 'FC', label: '飞检结果', path: 'flightCheck' },
        { value: 'AC', label: '文章', path: 'article' }
      ],
      activeIdx: 0
    }
  },
  created () {
    const path = this.$route.path
    if (path.indexOf('main') !== -1) {
      this.activeIdx = 0
    }
    if (path.indexOf('spotCheck') !== -1) {
      this.activeIdx = 1
    }
    if (path.indexOf('criterion') !== -1) {
      this.activeIdx = 2
    }
    if (path.indexOf('law') !== -1) {
      this.activeIdx = 3
    }
    if (path.indexOf('flightCheck') !== -1) {
      this.activeIdx = 4
    }
    if (path.indexOf('article') !== -1) {
      this.activeIdx = 5
    }
  },
  watch: {
    '$store.getters.type': function (val) {
      if (val) {
        if (val === 'main') {
          this.activeIdx = 0
        }
        if (val === 'SC') {
          this.activeIdx = 1
        }
        if (val === 'CC') {
          this.activeIdx = 2
        }
        if (val === 'LW') {
          this.activeIdx = 3
        }
        if (val === 'FC') {
          this.activeIdx = 4
        }
        if (val === 'AC') {
          this.activeIdx = 5
        }
      }
    }
  },
  methods: {
    changeMenu (val, path, idx) {
      let _this = this
      if (_this.activeIdx !== idx) {
        this.$store.dispatch('CreateType', val)
        _this.activeIdx = idx
        setTimeout(function () {
          _this.$router.push({
            name: path
          })
        }, 300)
      }
    }
  }
}
</script>
