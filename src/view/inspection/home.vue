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
  .layout-footer-center{
    text-align: center;
    background-color: #ffffff;
    height: 200px;
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
      <Footer class="layout-footer-center">2011-2016 &copy; TalkingData</Footer>
    </Layout>
  </div>
</template>
<script>
export default {
  data () {
    return {
      menuList: [
        { value: '1', label: '首页' },
        { value: '2', label: '抽检结果' },
        { value: '3', label: '具体标准' },
        { value: '4', label: '法律法规' }
      ],
      nameList: ['', 'home-content', 'data-view', '3', '4'],
      activeIdx: 0
    }
  },
  mounted () {
    const path = this.$route.path
    if (path.indexOf('inspection') !== -1) {
      this.activeIdx = 0
      this.$router.push({
        name: 'home-content'
      })
    }
    if (path.indexOf('data-view') !== -1) {
      this.activeIdx = 1
      this.$router.push({
        name: 'data-view'
      })
    }
  },
  methods: {
    changeMenu (index) {
      if (this.activeIdx !== index - 1) {
        this.activeIdx = index - 1
        this.$router.push({
          name: this.nameList[index]
        })
      }
    }
  }
}
</script>

<style>

</style>
