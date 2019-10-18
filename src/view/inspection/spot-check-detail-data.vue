<style>
  .detail-data{
    border: 1px solid #e5e5e5;
    background-color: #ffffff;
    padding: 20px;
  }
  .detail-title{
    height: 100px;
    margin-bottom: 10px ;
  }
  .detail-con{
    padding-top: 30px;
  }
  .detail-con>div{
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .detail-con-tab{
    width: 100%;
    /*border: 1px solid #e5e5e5;*/
    border-collapse: collapse;
  }
  .detail-con-tab td{
    width: 25%;
    text-align: center;
    border: 1px solid #e5e5e5;
    height: 45px;
  }
</style>
<template>
  <div>
    <div class="detail-data detail-title">
      <div style="font-size: 16px; height: 16px; line-height: 16px; padding-left: 5px; font-weight: bold;border-left: 9px solid #1788bc;">
        搜索抽检结果
      </div>
      <div class="search-con search-con-top">
        <Select v-model="formData.institution" style="width:200px" placeholder="请选择公布机构" clearable>
          <Option value="" key="">全部</Option>
          <Option v-for="item in institutionList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Select v-model="formData.checkResult" style="width:200px" placeholder="请选择抽检结果" clearable>
          <Option value="" key="">全部</Option>
          <Option value="1" key="1">合格</Option>
          <Option value="0" key="0">不合格</Option>
        </Select>
        <Input @on-change="handleClear" clearable placeholder="输入标称生产企业/进口代理商名称/样品名称搜索" class="search-input" v-model="formData.searchPhrase"/>
        <Button @click="handleSearch" class="search-btn" type="primary"><Icon type="md-search"/>&nbsp;&nbsp;搜索</Button>
      </div>
    </div>
    <div class="detail-data detail-con">
      <div>
        广州宝洁有限公司
      </div>
      <table class="detail-con-tab" border="1" cellspacing="0" cellpadding="0">
        <tr>
          <td>标称生产企业/进口代理商名称</td>
          <td colspan="3">{{spotCheckData.producer}}</td>
        </tr>
        <tr>
          <td>委托企业名称</td>
          <td colspan="3">{{spotCheckData.company}}</td>
        </tr>
        <tr>
          <td>被采样单位名称</td>
          <td colspan="3">{{spotCheckData.unit}}</td>
        </tr>
        <tr>
          <td>样品名称</td>
          <td>{{spotCheckData.sample}}</td>
          <td>包装规格</td>
          <td>{{spotCheckData.specification}}</td>
        </tr>
        <tr>
          <td>抽检结果</td>
          <td>{{spotCheckData.resultName}}</td>
          <td>不合格项目</td>
          <td>{{spotCheckData.subject}}</td>
        </tr>
        <tr>
          <td>保质期</td>
          <td>{{spotCheckData.expireTime}}</td>
          <td>产品分类</td>
          <td>{{spotCheckData.productTypeName}}</td>
        </tr>
        <tr>
          <td>产地</td>
          <td>{{spotCheckData.location}}</td>
          <td>公布日期</td>
          <td>{{spotCheckData.publishDate}}</td>
        </tr>
        <tr>
          <td>涉嫌假冒</td>
          <td>{{spotCheckData.fakeName}}</td>
          <td>公布机构</td>
          <td>{{spotCheckData.institution}}</td>
        </tr>
        <tr>
          <td>来源链接</td>
          <td colspan="3"><a :href="spotCheckData.sourceLink" target="view_window">{{spotCheckData.sourceLink}}</a></td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
import axios from '@/libs/api.request'
export default {
  name: 'spot_check_detail_data_page',
  data () {
    return {
      modelShow: false,
      formData: {
        searchPhrase: '',
        institution: '',
        checkResult: ''
      },
      institutionList: [],
      spotCheckData: {}
    }
  },
  mounted () {
    this.getAllSystemDataTypeList()
    this.spotCheckData = this.$route.params
    this.spotCheckData['resultName'] = this.spotCheckData.checkResult === 1 ? '合格' : '不合格'
    this.spotCheckData['fakeName'] = this.spotCheckData.isFake === 1 ? '是' : '否'
  },
  methods: {
    handleUploadFile () {
      this.getTablePageData()
    },
    getAllSystemDataTypeList () {
      const option = {
        url: '/system/getAllSystemDataTypeList',
        method: 'get'
      }
      axios.request(option).then(res => {
        this.institutionList = res.data.data.institutionList
      })
    },
    handleClear (e) {

    },
    handleSearch () {

    }
  }
}
</script>
