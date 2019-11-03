<style scoped>
  .main-layout-con ul{
    width: 198px !important;
  }
  .menu-title{
    padding-top: 17px;
    padding-left: 15px;
    padding-bottom: 16px;
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
  .bread_active_class:hover{
    color: #0b81bf;
    cursor: pointer;
  }
  .layout-footer-center{
    text-align: center;
    height: 100px;
    margin-bottom: 50px;
  }
</style>
<template>
  <Layout style="padding: 0 180px 0;min-height: calc(100vh); max-height: calc(100vh); overflow-y: auto">
    <Breadcrumb separator=">" :style="{margin: '10px 0'}">
      <BreadcrumbItem
        v-for="(item, index) in breadList"
        :key="item.value"
        :class="index === 1 && breadList.length !== 2 ? 'bread_active_class' : ''">
        <span @click="backList(item.value)">{{item.name}}</span>
      </BreadcrumbItem>
    </Breadcrumb>
    <Content>
      <Layout class="main-layout-con">
        <Sider hide-trigger style="background-color: #f5f7f9; margin-right: 15px;">
          <div style="border: 1px solid #dcdee2; margin-bottom: 15px;">
            <div class="menu-title">
              <Icon type="md-chatbubbles" />
              {{leftUpData.title}}
            </div>
            <ul class="menu-ul">
              <li v-for="(menu, idx) in leftUpData.menuList" :key="menu.value" :class="idx === upActiveIdx ? 'active_class' : ''"
                  @click="toRouter('up', menu.code, idx, menu.value)">{{menu.label}}</li>
            </ul>
          </div>
          <div v-if="Number(type) === 2" style="border: 1px solid #dcdee2; margin-bottom: 15px;">
            <div class="menu-title">
              <Icon type="md-chatbubbles" />
              {{leftDownData.title}}
            </div>
            <ul class="menu-ul">
              <li v-for="(menu, idx) in leftDownData.menuList" :key="menu.value" :class="idx === downActiveIdx ? 'active_class' : ''"
                  @click="toRouter('down', menu.code, idx, menu.value)">{{menu.label}}</li>
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
      type: 1,
      breadData: [
        { list: [{ value: '', name: '抽检数据' }, { value: 'reload', name: '产品分类' }] },
        { list: [{ value: '', name: '标准数据' }, { value: 'reload', name: '标准分类' }] },
        { list: [{ value: '', name: '法规数据' }, { value: 'reload', name: '法规分类' }] }
      ],
      breadList: [],
      leftUpData: {},
      leftDownData: {},
      upActiveIdx: null,
      downActiveIdx: null

    }
  },
  created () {
    const path = this.$route.path
    if (path.indexOf('spotCheck') !== -1) {
      this.type = 1
    }
    if (path.indexOf('criterion') !== -1) {
      this.type = 2
    }
    if (path.indexOf('law') !== -1) {
      this.type = 3
    }
    this.getLeftMenuData().then(res => {
      if (this.$store.getters.productType) {
        this.initMenuActive(this.$store.getters.productType)
      } else if (this.$store.getters.criterionCategory) {
        this.initMenuActive(this.$store.getters.criterionCategory)
      } else if (this.$store.getters.lawCategory) {
        this.initMenuActive(this.$store.getters.lawCategory)
      } else if (this.$store.getters.lawType) {
        this.initMenuActive(this.$store.getters.lawType)
      } else if (this.$store.getters.criterionType) {
        const _this = this
        let list = _this.leftUpData.menuList
        for (let i = 0; i < list.length; i++) {
          let value = Number(list[i].value)
          if (value === this.$store.getters.criterionType) {
            _this.downActiveIdx = i
            break
          }
        }
      } else {
        this.toRouter('up', '', 0, 0)
      }
    })
    this.breadList = this.breadData[this.type - 1].list
  },
  mounted () {

  },
  watch: {
    // '$route': function (to, from) {
    //   console.log(from)
    //   console.log(to)
    // },
    '$store.getters.type': function (val) {
      if (Number(val) !== 0) {
        this.type = val
        this.getLeftMenuData()
        this.breadList = this.breadData[val - 1].list
      }
    },
    '$store.getters.productType': function (val) {
      if (Number(this.type) === 1) {
        this.initMenuActive(val)
      }
    },
    '$store.getters.criterionCategory': function (val) {
      if (Number(this.type) === 2) {
        this.initMenuActive(val)
      }
    }
  },
  methods: {
    initMenuActive (val) {
      const _this = this
      let list = _this.leftUpData.menuList
      for (let i = 0; i < list.length; i++) {
        let value = Number(list[i].value)
        if (value === val) {
          _this.upActiveIdx = i
          break
        }
      }
    },
    getLeftMenuData () {
      let _this = this
      _this.leftUpData = {}
      _this.leftDownData = {}
      const option = {
        url: '/system/getAllSystemDataTypeList/' + _this.type,
        method: 'get',
        async: false
      }
      return new Promise(resolve => {
        axios.request(option).then(res => {
          if (Number(_this.type) === 1) {
            _this.leftUpData = { title: '抽检产品分类', menuList: res.data.data.productTypeList }
          }
          if (Number(_this.type) === 2) {
            _this.leftUpData = { title: '标准一级分类', menuList: res.data.data.categoryList }
            _this.leftDownData = { title: '标准二级分类', menuList: res.data.data.typeList }
          }
          if (Number(_this.type) === 3) {
            _this.leftUpData = { title: '法律法规分类', menuList: res.data.data.typeList }
          }
          resolve(res.data)
        })
      })
    },
    toRouter (option, param, idx, val) {
      console.log('列表左侧菜单点击参数：' + option + '***' + param + '***' + idx + '***' + val)
      const _this = this
      this.breadList = this.breadData[this.type - 1].list.concat([])
      if (option === 'up') {
        if (Number(_this.type) === 1) {
          this.$store.dispatch('CreateProductType', Number(val))
        }
        if (Number(_this.type) === 2) {
          this.$store.dispatch('CreateCriterionCategory', Number(val))
        }
        if (Number(_this.type) === 3 && param === 'law_category') {
          this.$store.dispatch('CreateLawCategory', Number(val))
        }
        if (Number(_this.type) === 3 && param === 'law_type') {
          this.$store.dispatch('CreateLawType', Number(val))
        }
        if (val !== 0) {
          _this.upActiveIdx = idx
          _this.breadList.push({ value: _this.leftUpData.menuList[idx].value, name: _this.leftUpData.menuList[idx].label })
          this.toList()
        }
      }
      if (Number(_this.type) === 2 && option === 'down') {
        this.$store.dispatch('CreateCriterionType', Number(val))
        if (val !== 0) {
          _this.downActiveIdx = idx
          _this.breadList.push({ value: _this.leftDownData.menuList[idx].value, name: _this.leftDownData.menuList[idx].label })
          this.toList()
        }
      }
    },
    backList (path) {
      if (path === 'reload') {
        this.breadList = this.breadData[this.type - 1].list.concat([])
        this.upActiveIdx = null
        this.downActiveIdx = null
        if (Number(this.type) === 1) {
          this.$store.dispatch('CreateProductType', '')
        }
        if (Number(this.type) === 2) {
          this.$store.dispatch('CreateCriterionCategory', '')
          this.$store.dispatch('CreateCriterionType', '')
        }
        if (Number(this.type) === 3) {
          this.$store.dispatch('CreateLawCategory', '')
          this.$store.dispatch('CreateLawType', '')
        }
        this.toList()
      }
    },
    toList () {
      const _this = this
      const path = _this.$route.path
      if (path.indexOf('spotCheck') === -1 || path.indexOf('criterion') === -1 || path.indexOf('law') === -1) {
        if (Number(_this.type) === 1) {
          _this.$router.push({
            name: 'spotCheck'
          })
        }
        if (Number(_this.type) === 2) {
          _this.$router.push({
            name: 'criterion'
          })
        }
        if (Number(_this.type) === 3) {
          _this.$router.push({
            name: 'law'
          })
        }
      }
    }
  }
}
</script>
