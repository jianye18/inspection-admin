<style>
  .layout-footer-center{
    text-align: center;
  }
  .search-box{
    height: 200px;
    /*background-color: #67647D;*/
    margin: 0;
    padding: 70px 0 0 150px;
    background-image: url('../../assets/images/search-box-back.jpg');
  }
  .data-con{
    background-color: #fff;
    /*min-height: 300px;*/
    height: auto;
    border: 1px solid #f2f2f2;
    margin-top: 10px;
  }
  .data-title{
    padding-left: 20px;
    height: 60px;
    /*text-align: center;*/
    line-height: 60px;
    border-bottom: 1px solid #f2f2f2;
  }
  .data-type-select{
    font-size: 14px;
    float: right;
    margin-right: 10px;
  }
  .data-type-select-active{
    color: #2d8cf0;
  }
  .data-type-select-hover:hover{
    color: #2d8cf0;
    cursor: pointer;
  }
  .data-list{
    min-height: 50px;
    padding: 10px 20px;
    display: inline-block;
  }
  .data-list span{
    font-size: 13px;
    width: 80px;
    height: 50px;
    left: 20px;
    top: 5px;
  }
  .data-list span:hover{
    color: #2d8cf0;
    cursor: pointer;
  }
  .data-list span a:hover{
    text-decoration: #2d8cf0;
  }
  .data-list span.data-line{
    margin-left: 15px;
    margin-right: 15px;
  }
  .data-list-div{
    display: inline-block;
    margin: 15px 0;
  }
  .ivu-layout-sider-children{
   height: auto;
  }
  .article_class{
    margin-top: 10px;
    background-color: #ffffff;
  }
  .article_class .ivu-tabs-bar{
    margin-bottom: 0px;
  }
  .article_class .ivu-tabs-bar .ivu-tabs-nav-scroll .nav-text{
    height: 60px;
  }
  .article_class .ivu-tabs-bar .ivu-tabs-nav-scroll .nav-text div.ivu-tabs-tab{
    font-size: 20px;
    font-weight: bold;
    line-height: 40px;
  }
  .article_class ul{
    list-style: none;
  }
  .article_class ul li{
    font-size: 13px;
    font-weight: bold;
    margin-left: 15px;
    height: 45px;
    line-height: 45px;
    max-width: 360px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    border-bottom: 1px solid #f5f5f5;
  }
  .article_class ul li:hover{
    color: #2d8cf0;
    cursor: pointer;
  }
  .article_more{
    height: 50px;
    width: 200px;
    line-height: 50px;
    text-align: center;
    font-size: 14px;
    border: 1px solid #e5e5e5;
    margin: 10px 100px 10px 100px;
  }
  .article_more:hover{
    color: #2d8cf0;
    cursor: pointer;
  }
</style>
<template>
  <Layout style="padding: 10px 180px 100px; max-top: 15px; max-height: calc(100vh); overflow-y: auto">
    <Content>
      <Layout>
        <Content :style="{minHeight: '620px', marginRight: '15px'}">
          <div class="search-box">
            <Select v-model="dataType" style="width:150px; float: left" placeholder="">
              <Option value="2">抽检标准</Option>
              <Option value="3">抽检法规</Option>
            </Select>
            <Input search enter-button="搜索" placeholder="请输入您想要查询的关键词" style="width: 400px" />
          </div>
          <div class="data-con" v-for="(item, index) in contentData">
            <div class="data-title">
            <span style="font-size: 18px; font-weight: bold;">
              <Icon type="ios-flask"/>
              &nbsp;
              {{item.title}}
            </span>
              <span class="data-type-select" v-for="(type, idx) in item.typeName">
              <span :class="type.active ? 'data-type-select-hover data-type-select-active' : 'data-type-select-hover'"
                    @click="changeItem(index, idx, item.dataType, type.name)">{{type.name}}</span>
              <span v-if="idx != 0" style="margin-left: 10px;">/</span>
          </span>
            </div>
            <div class="data-list">
              <div class="data-list-div" v-for="typeData in item.typeList">
                <span @click="toShowList(item.dataType, typeData.code, typeData.name)">{{typeData.name}}</span>
                <span class="data-line">|</span>
              </div>
              <span><a href="data-view">更多 ></a></span>
            </div>
          </div>
        </Content>
        <Sider hide-trigger :style="{background: '#f5f7f9', height: '100%'}" width="400">
          <div style="height: 200px">
            <Carousel
              v-model="value3"
              autoplay
              :autoplay-speed="autoplaySpeed"
              dots="inside"
              radius-dot
              trigger="hover"
              arrow="hover">
              <CarouselItem>
                <div class="demo-carousel">
                  <img src="../../assets/images/home/1.png"/>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div class="demo-carousel">
                  <img src="../../assets/images/home/2.png"/></div>
              </CarouselItem>
              <CarouselItem>
                <div class="demo-carousel">
                  <img src="../../assets/images/home/3.png"/></div>
              </CarouselItem>
              <CarouselItem>
                <div class="demo-carousel">
                  <img src="../../assets/images/home/4.png"/></div>
              </CarouselItem>
            </Carousel>
          </div>
          <div class="article_class">
            <Tabs value="newArticle">
              <TabPane label="最新文章" name="newArticle">
                <ul>
                  <li v-for="item in newArticle" :title="item.title">{{item.title}}</li>
                </ul>
                <div class="article_more">
                  查看更多
                </div>
              </TabPane>
              <TabPane label="热门文章" name="hotArticle">
                <ul>
                  <li v-for="item in hotArticle" :title="item.title">{{item.title}}</li>
                </ul>
                <div class="article_more">
                  查看更多
                </div>
              </TabPane>
            </Tabs>
          </div>
        </Sider>
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
      dataType: '2',
      productTypeName: ['', '皮肤用化妆品', '毛发用化妆品', '指（趾）甲用化妆品', '口唇用化妆品'],
      pageName: '',
      value3: 0,
      autoplaySpeed: 2500,
      newArticle: [
        { title: '最新文章1' },
        { title: '最新文章1最新文章1最新文章1最新文章1最新文章1最新文章1最新文章1最新文章1最新文章1最新文章1最新文章1' },
        { title: '最新文章1' },
        { title: '最新文章1' },
        { title: '最新文章1' },
        { title: '最新文章1' },
        { title: '最新文章1' },
        { title: '最新文章1' },
        { title: '最新文章1' },
        { title: '最新文章1' }
      ],
      hotArticle: [
        { title: '热门文章1' },
        { title: '热门文章1热门文章1热门文章1热门文章1热门文章1热门文章1热门文章1热门文章1热门文章1热门文章1热门文章1热门文章1' },
        { title: '热门文章1' },
        { title: '热门文章1' },
        { title: '热门文章1' },
        { title: '热门文章1' },
        { title: '热门文章1' },
        { title: '热门文章1' },
        { title: '热门文章1' },
        { title: '热门文章1' }
      ],
      contentData: [
        {
          title: '抽检标准',
          dataType: 2,
          typeName: [
            { name: '按标准来源搜索', active: false },
            { name: '按产品分类搜索', active: true }
          ],
          typeList: [
            {
              code: 'product_type',
              name: '皮肤用化妆品'
            },
            {
              code: 'product_type',
              name: '毛发用化妆品'
            },
            {
              code: 'product_type',
              name: '指（趾）甲用化妆品'
            },
            {
              code: 'product_type',
              name: '口唇用化妆品'
            }
          ]
        },
        {
          title: '抽检法规',
          dataType: 3,
          typeName: [
            { name: '按法规来源搜索', active: false },
            { name: '按产品分类搜索', active: true }
          ],
          typeList: [
            {
              code: 'product_type',
              name: '皮肤用化妆品'
            },
            {
              code: 'product_type',
              name: '毛发用化妆品'
            },
            {
              code: 'product_type',
              name: '指（趾）甲用化妆品'
            },
            {
              code: 'product_type',
              name: '口唇用化妆品'
            }
          ]
        }
      ],
      filterItemList: []
    }
  },
  mounted () {
    this.getHomePageFilterItem()
  },
  methods: {
    changeMenu (index) {
      this.activeIdx = index - 1
      this.$router.push({
        name: this.nameList[index]
      })
    },
    changeItem (index, idx, type, typeName) {
      console.log(index + ',' + idx + ',' + typeName)
      if (idx === 0) {
        this.contentData[index].typeList = this.getItemListByType(type)
      } else {
        this.contentData[index].typeList = [
          {
            code: 'product_type',
            name: '皮肤用化妆品'
          },
          {
            code: 'product_type',
            name: '毛发用化妆品'
          },
          {
            code: 'product_type',
            name: '指（趾）甲用化妆品'
          },
          {
            code: 'product_type',
            name: '口唇用化妆品'
          }
        ]
      }
      this.contentData[index].typeName.forEach(function (item) {
        item.active = false
      })
      this.contentData[index].typeName[idx].active = true
    },
    toShowList (dataType, code, name) {
      console.log(dataType + ',' + code + ',' + name)
    },
    getItemListByType (type) {
      let _this = this
      let list = []
      for (let i = 0; i < _this.filterItemList.length; i++) {
        console.log(_this.filterItemList[i].type)
        if (_this.filterItemList[i].type === type) {
          list = _this.filterItemList[i].list
          break
        }
      }
      return list
    },
    getHomePageFilterItem () {
      const option = {
        url: '/system/getHomePageFilterItem',
        method: 'get'
      }
      axios.request(option).then(res => {
        this.filterItemList = res.data.data
      })
    }
  }
}
</script>

<style>

</style>
