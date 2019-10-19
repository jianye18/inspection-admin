<style scoped>
  .main-layout-con ul{
    width: 199px !important;
  }
  .menu-title{
    padding-top: 17px;
    padding-left: 15px;
    padding-bottom: 16px;
    border-bottom: 1px solid #e5e5e5;
    background: #f5f5f5;
    z-index: 1;
    position: relative;
    font-weight: bold;
    font-size: 18px;
    color: #0074a9;
  }
  .menu-ul{
    list-style: none;
  }
  .menu-ul li{
    height: 50px;
    line-height: 50px;
    padding-left: 20px;
    font-size: 16px;
    border-bottom: 1px dashed #e5e5e5;
    color: #000;
  }
  .menu-ul li.active_class{
    background-color: #f3f9fc;
  }
  .menu-ul li:hover{
    color: #0b81bf;
    cursor: pointer;
    background-color: #f3f9fc;
  }
</style>
<template>
  <Layout style="padding: 0 180px; max-height: calc(100vh - 200px); min-height: calc(100vh - 200px); overflow: auto">
    <Breadcrumb separator=">" :style="{margin: '10px 0'}">
      <BreadcrumbItem v-for="(item, key) in breadList" :key="item" v-if="key == 1">{{item}}</BreadcrumbItem>
    </Breadcrumb>
    <Content>
      <Layout class="main-layout-con">
        <Sider hide-trigger style="height: 262px; background-color: #fff; margin-right: 15px; border: 1px solid #dcdee2">
          <div class="menu-title">
            <Icon type="md-chatbubbles" />
            {{menuData.title}}
          </div>
          <ul class="menu-ul">
            <li v-for="(item, idx) in menuData.menuList" :key="item.value" :class="idx === activeIdx ? 'active_class' : ''"
                @click="toRouter(item.value)">{{item.label}}</li>
          </ul>
        </Sider>
        <Content>
          <router-view/>
        </Content>
      </Layout>
    </Content>
  </Layout>
</template>
<script>
export default {
  data () {
    return {
      productTypeName: ['', '皮肤用化妆品', '毛发用化妆品', '指（趾）甲用化妆品', '口唇用化妆品'],
      pageName: '',
      breadList: [],
      menuData: {
        title: '抽检产品分类',
        menuList: [
          {value: '1', label: '皮肤用化妆品'},
          {value: '2', label: '毛发用化妆品'},
          {value: '3', label: '指（趾）甲用化妆品'},
          {value: '4', label: '口唇用化妆品'}
        ]
      },
      activeIdx: null
    }
  },
  mounted () {
    this.toRouter(0)
  },
  methods: {
    toRouter (index) {
      const _this = this
      _this.breadList = ['抽检数据', '产品分类']
      if (index !== 0) {
        _this.pageName = _this.productTypeName[index]
        _this.activeIdx = index - 1
        _this.breadList.push(_this.productTypeName[index])
      }
      this.$store.dispatch('CreateProductType', index)
      setTimeout(function () {
        // console.log(index)
        _this.$router.push({
          name: 'spot-check-list-data',
          params: {
            productType: index !== 0 ? index : ''
          }
        })
      }, index === 0 ? 300 : 0)
    }
  }
}
</script>

<style>

</style>
