<style scoped>
  .main-layout-con ul{
    width: 198px !important;
  }
  .menu-title{
    padding-top: 17px;
    padding-left: 15px;
    padding-bottom: 16px;
    /*border-bottom: 1px solid #e5e5e5;*/
    /*border-top: 1px solid #dcdee2;*/
    /*border-left: 1px solid #dcdee2;*/
    /*border-right: 1px solid #dcdee2;*/
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
    border-top: 1px dashed #e5e5e5;
    /*border-left: 1px solid #dcdee2;*/
    /*border-right: 1px solid #dcdee2;*/
    color: #000;
    background: #ffffff;
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
  <Layout style="padding: 0 180px 100px; max-height: calc(100vh); overflow-y: auto">
    <Breadcrumb separator=">" :style="{margin: '10px 0'}">
      <BreadcrumbItem v-for="item in breadList" :key="item">{{item}}</BreadcrumbItem>
    </Breadcrumb>
    <Content>
      <Layout class="main-layout-con">
        <Sider hide-trigger style="background-color: #f5f7f9; margin-right: 15px;">
          <div v-for="(item, index) in menuData" style="border: 1px solid #dcdee2; margin-bottom: 15px;">
            <div class="menu-title">
              <Icon type="md-chatbubbles" />
              {{item.title}}
            </div>
            <ul class="menu-ul">
              <li v-for="(menu, idx) in item.menuList" :key="menu.value" :class="idx === activeIdx ? 'active_class' : ''"
                  @click="toRouter(index, idx, menu.value)">{{menu.label}}</li>
            </ul>
          </div>
        </Sider>
        <Content>
          <router-view/>
        </Content>
      </Layout>
    </Content>
    <Footer class="layout-footer-center">2011-2016 &copy; TalkingData</Footer>
  </Layout>
</template>
<script>
import axios from '@/libs/api.request'
export default {
  data () {
    return {
      type: '1',
      productTypeName: ['', '皮肤用化妆品', '毛发用化妆品', '指（趾）甲用化妆品', '口唇用化妆品'],
      breadData: [
        {list: ['抽检数据', '产品分类']},
        {list: ['标准数据', '标准分类']}
      ],
      breadList: [],
      menuData: [{
        title: '抽检产品分类',
        menuList: [
          { value: '1', label: '皮肤用化妆品' },
          { value: '2', label: '毛发用化妆品' },
          { value: '3', label: '指（趾）甲用化妆品' },
          { value: '4', label: '口唇用化妆品' }
        ]
      }],
      activeIdx: null,

    }
  },
  // created () {
  //   if (this.$route.params.type) {
  //     this.type = this.$route.params.type
  //   }
  // },
  watch: {
    '$route': function (to, from) {
      console.log(to)
      this.type = to.params.type ? Number(to.params.type) : 1
      if (to.name !== 'data-view') {
        this.getLeftMenuData(this.type)
      }
      if (to.name === 'data-view') {
        this.breadList = this.breadData[this.type - 1].list
        this.$router.push({
          name: this.type === 1 ? 'spot-check-list-data' : 'criterion-list-data',
          params: {
            type: this.type
          }
        })
      }
    }
  },
  mounted () {
    this.toRouter(0, 0, 0)
  },
  methods: {
    getLeftMenuData (type) {
      let _this = this
      _this.menuData= []
      const option = {
        url: '/system/getAllSystemDataTypeList/' + type,
        method: 'get'
      }
      axios.request(option).then(res => {
        if (type === 1) {
          _this.menuData.push({title: '抽检产品分类', menuList: res.data.data.productTypeList})
        }
        if (type === 2) {
          _this.menuData.push({title: '标准一级分类', menuList: res.data.data.categoryList})
          _this.menuData.push({title: '标准二级分类', menuList: res.data.data.typeList})
        }
      })
    },
    toRouter (index, idx, val) {
      const _this = this
      this.breadList = this.breadData[this.type - 1].list
      if (val !== 0) {
        _this.activeIdx = idx
        _this.breadList.push(_this.menuData[index].menuList[idx].label)
      }
      this.$store.dispatch('CreateProductType', val)
      setTimeout(function () {
        // console.log(index)
        _this.$router.push({
          name: 'spot-check-list-data',
          params: {
            productType: val !== 0 ? val : ''
          }
        })
      }, val === 0 ? 300 : 0)
    }
  }
}
</script>

<style>

</style>
