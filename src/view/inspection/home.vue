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
            <li v-for="(item, idx) in menuList" :key="item.value" :class="idx === activeIdx ? 'active_class' : ''" @click="changeMenu(item.value)">{{item.label}}</li>
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
        { value: '0', label: '首页', path: 'main' },
        { value: '1', label: '抽检结果', path: 'spotCheck' },
        { value: '2', label: '具体标准', path: 'criterion' },
        { value: '3', label: '法律法规', path: 'law' }
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
  },
  watch: {
    '$store.getters.type': function (val) {
      if (val) {
        if (val === 1) {
          this.activeIdx = 1
        }
        if (val === 2) {
          this.activeIdx = 2
        }
        if (val === 3) {
          this.activeIdx = 3
        }
      }
    }
  },
  methods: {
    changeMenu (index) {
      this.$store.dispatch('CreateType', index)
      let _this = this
      if (_this.activeIdx !== index) {
        _this.activeIdx = Number(index)
        setTimeout(function () {
          _this.$router.push({
            name: _this.menuList[index].path,
            params: {
              type: _this.menuList[index].value
            }
          })
        }, 300)
      }
    }
  }
}
</script>
