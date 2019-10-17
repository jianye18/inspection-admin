<style scoped>
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
    margin-right: 30px;
  }
  .data-type-select:hover{
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
</style>
<template>
  <Layout :style="{padding: '0 180px', marginTop: '10px'}">
    <Content :style="{minHeight: '620px', marginRight: '15px'}">
      <div class="search-box">
        <Row>
          <Col span="24">
            <Select v-model="dataType" style="width:150px; float: left" placeholder="">
              <Option value="1" key="1">抽检结果</Option>
            </Select>
            <Input search enter-button="搜索" placeholder="请输入您想要查询的关键词" style="width: 400px" />
          </Col>
        </Row>
      </div>
      <div class="data-con">
        <div class="data-title">
              <span style="font-size: 18px; font-weight: bold;">
                <Icon type="ios-flask"/>
                &nbsp;
                抽检结果
              </span>
          <span class="data-type-select">
                按产品分类
              </span>
        </div>
        <div class="data-list">
          <span>皮肤用化妆品</span>
          <span class="data-line">|</span>
          <span>毛发用化妆品</span>
          <span class="data-line">|</span>
          <span>指（趾）甲用化妆品</span>
          <span class="data-line">|</span>
          <span>口唇用化妆品</span>
          <span class="data-line">|</span>
          <span><a href="data-view">更多 ></a></span>
        </div>
      </div>
    </Content>
    <Sider hide-trigger :style="{background: '#fff'}" width="400">
      右侧
    </Sider>
  </Layout>
</template>
<script>
export default {
  data () {
    return {
      dataType: '1',
      productTypeName: ['', '皮肤用化妆品', '毛发用化妆品', '指（趾）甲用化妆品', '口唇用化妆品'],
      pageName: ''
    }
  },
  methods: {
    changeMenu (index) {
      this.activeIdx = index - 1
      this.$router.push({
        name: this.nameList[index]
      })
    }
  }
}
</script>

<style>

</style>
