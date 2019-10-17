<style scoped>
  .main-layout-con .ivu-layout-sider .ivu-layout-sider-children{
    width: 204px !important;
  }
  .main-layout-con ul{
    width: 199px !important;
  }
  .ivu-menu-item-group-title{
    background-color: #dadee2 !important;
    color: #0074a9 !important;
    font-weight: bold !important;
    font-size: 18px !important;
  }
</style>
<template>
  <Layout :style="{padding: '0 180px', minHeight: '620px', height: '100%'}">
    <Breadcrumb :style="{margin: '10px 0'}">
      <BreadcrumbItem>抽检数据</BreadcrumbItem>
      <BreadcrumbItem>产品分类</BreadcrumbItem>
      <BreadcrumbItem>{{pageName}}</BreadcrumbItem>
    </Breadcrumb>
    <Content :style="{minHeight: '280px', background: '#fff'}">
      <Layout style="height: 100%" class="main-layout-con">
        <Sider hide-trigger style="background-color: #fff; margin-right: 15px; border: 1px solid #dcdee2">
          <Menu theme="light" @on-select="toRouter" :active-name="activeName" class="main-menu-con" width="auto" style="height: auto;">
            <MenuGroup title="抽检产品分类">
              <MenuItem name="1">
                <Icon type="md-document"/>
                皮肤用化妆品
              </MenuItem>
              <MenuItem name="2">
                <Icon type="md-chatbubbles" />
                毛发用化妆品
              </MenuItem>
              <MenuItem name="3">
                <Icon type="md-chatbubbles" />
                指(趾)甲用化妆品
              </MenuItem>
              <MenuItem name="4">
                <Icon type="md-chatbubbles" />
                口唇用化妆品
              </MenuItem>
            </MenuGroup>
          </Menu>
        </Sider>
        <Content :style="{padding: '24px', minHeight: '280px', height: 'calc(100% - 80px)', overflowY: 'inherit', background: '#fff'}">
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
      activeName: ''
    }
  },
  mounted () {
    this.toRouter()
  },
  methods: {
    toRouter (index) {
      const _this = this
      console.log(index)
      _this.pageName = _this.productTypeName[index]
      _this.activeName = index
      setTimeout(function () {
        _this.$router.push({
          name: 'list-data'
        })
      }, 300)
    }
  }
}
</script>

<style>

</style>
