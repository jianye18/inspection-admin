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
    margin-left: 10px;
    margin-right: 10px;
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
</style>
<template>
  <Layout :style="{padding: '0 180px', marginTop: '10px', minHeight: '800px'}">
    <Content :style="{minHeight: '620px', marginRight: '15px'}">
      <div class="search-box">
        <Select v-model="dataType" style="width:150px; float: left" placeholder="">
          <Option value="1" key="1">抽检结果</Option>
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
          <span v-for="(type, idx) in item.typeName" :class="type.active ? 'data-type-select data-type-select-active' : 'data-type-select'">
              <span class="data-type-select-hover" @click="changeItem(index, idx, type.name)">{{type.name}}</span>
              <span v-if="idx != 0" style="margin-left: 10px;">/</span>
          </span>
        </div>
        <div class="data-list">
          <span v-for="typeData in item.typeList">
            <span @click="toShowList(item.dataType, typeData.code, typeData.name)">{{typeData.name}}</span>
            <span class="data-line">|</span>
          </span>
          <span><a href="data-view">更多 ></a></span>
        </div>
      </div>
    </Content>
    <Sider hide-trigger :style="{background: '#f5f7f9'}" width="400">
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
              <li v-for="item in newArticle" :title="item.title">{{item.title}}</li>
            </ul>
          </TabPane>
          <TabPane label="热门文章" name="hotArticle">
            <ul>
              <li v-for="item in hotArticle" :title="item.title">{{item.title}}</li>
              <li v-for="item in hotArticle" :title="item.title">{{item.title}}</li>
            </ul>
          </TabPane>
        </Tabs>
      </div>
    </Sider>
  </Layout>
</template>
<script>
export default {
  data () {
    return {
      dataType: '1',
      productTypeName: ['', '皮肤用化妆品', '毛发用化妆品', '指（趾）甲用化妆品', '口唇用化妆品'],
      pageName: '',
      value3: 0,
      autoplaySpeed: 2500,
      newArticle: [{title:'最新文章1'}, {title:'最新文章1最新文章1最新文章1最新文章1最新文章1最新文章1最新文章1最新文章1最新文章1最新文章1最新文章1'}, {title:'最新文章1'}, {title:'最新文章1'}, {title:'最新文章1'}],
      hotArticle: [{title:'热门文章1'}, {title:'热门文章1热门文章1热门文章1热门文章1热门文章1热门文章1热门文章1热门文章1热门文章1热门文章1热门文章1热门文章1'}, {title:'热门文章1'}, {title:'热门文章1'}, {title:'热门文章1'}],
      contentData: [
        {
          title: '抽检标准',
          dataType: 2,
          typeName: [
            {name: '按标准来源搜索', active: false},
            {name: '按产品分类搜索', active: true}
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
            {name: '按法规来源搜索', active: false},
            {name: '按产品分类搜索', active: true}
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
      ]
    }
  },
  methods: {
    changeMenu (index) {
      this.activeIdx = index - 1
      this.$router.push({
        name: this.nameList[index]
      })
    },
    changeItem (index, idx, typeName) {
      console.log(index + ',' + idx + ',' + typeName)
      if (idx == 0) {
        this.contentData[index].typeList = [
          {
            code: 'criterion_category',
            name: '国际标准'
          },
          {
            code: 'criterion_category',
            name: '国家标准'
          },
          {
            code: 'criterion_category',
            name: '行业标准'
          },
          {
            code: 'criterion_category',
            name: '地方标准'
          },
          {
            code: 'criterion_category',
            name: '团体标准'
          },
          {
            code: 'criterion_category',
            name: '其他标准'
          },
          {
            code: 'criterion_type',
            name: '基础标准'
          },
          {
            code: 'criterion_type',
            name: '产品标准'
          },
          {
            code: 'criterion_type',
            name: '方法标准'
          },
          {
            code: 'criterion_type',
            name: '安全标准'
          },
          {
            code: 'criterion_type',
            name: '卫生标准'
          }
        ]
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
    }
  }
}
</script>

<style>

</style>
