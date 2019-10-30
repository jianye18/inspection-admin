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
  .data-detail-about{
    display: inline-block;
    font-weight: normal;
    margin-top: 20px;
    width: 49%;
    border: 1px solid #e5e5e5;
  }
  .data-detail-about div.data-detail-about-title{
    margin: 0px;
    height: 40px;
    border-bottom: 1px solid #e8e8e8;
    font-size: 18px;
    color: #000000;
    line-height: 40px;
    padding: 0px 0px 0px 15px;
    background-color: #f8f8f8;
  }
  .data-detail-about-more-span{
    float: right;
    font-size: 13px;
    color: #2d8cf0;
  }
  .data-detail-about-more-span:hover{
    cursor: pointer;
  }
  .data-detail-about-content ul{
    position: relative;
    top: -1px;
    list-style: none;
  }
  .data-detail-about-content ul li{
    height: 35px;
    line-height: 35px;
    border-top: 1px dashed #e8e8e8;
  }
  .data-detail-about-content ul li span a{
    background: url(../../assets/images/gb_odds.jpg) left center no-repeat;
    width: 80%;
    color: #666666;
    display: block;
    float: left;
    padding-left: 8px;
    font-size: 12px;
    margin-left: 19px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .data-detail-about-content ul li em{
    float: right;
    font-size: 12px;
    color: #888888;
    margin-right: 19px;
  }
  .statement-con span.statement-con-title{
    font-size: 16px;
    color: #888;
    display: block;
    margin-top: 18px;
  }
  .statement-con p{
    font-size: 12px;
    color: #888;
    display: block;
    margin-top: 18px;
  }
</style>
<template>
  <div>
    <div class="detail-data detail-title">
      <div style="font-size: 16px; height: 16px; line-height: 16px; padding-left: 5px; font-weight: bold;border-left: 9px solid #1788bc;">
        搜索标准结果
      </div>
      <div class="search-con search-con-top">
        <Select v-model="formData.publishUnit" style="width:200px" placeholder="请选择发布机构" clearable>
          <Option value="" key="">全部</Option>
          <Option v-for="item in publishUnitList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Select v-model="formData.status" style="width:200px" placeholder="请选择状态" clearable>
          <Option value="" key="">全部</Option>
          <Option v-for="item in statusList" :value="item.value">{{item.label}}</Option>
        </Select>
        <Input @on-change="handleClear" clearable placeholder="输入标准名称搜索" class="search-input" v-model="formData.searchPhrase"/>
        <Button @click="handleSearch" class="search-btn" type="primary"><Icon type="md-search"/>&nbsp;&nbsp;搜索</Button>
      </div>
    </div>
    <div class="detail-data detail-con">
      <div>
        {{criterionData.name}}
      </div>
      <table class="detail-con-tab" border="1" cellspacing="0" cellpadding="0">
        <tr>
          <td>标准状态</td>
          <td>{{criterionData.statusName}}</td>
          <td>标准分类</td>
          <td>{{criterionData.typeName}}</td>
        </tr>
        <tr>
          <td>发布日期</td>
          <td>{{criterionData.publishDate}}</td>
          <td>实施日期</td>
          <td>{{criterionData.implementDate}}</td>
        </tr>
        <tr>
          <td>发布单位</td>
          <td colspan="3">{{criterionData.publishUnitName}}</td>
        </tr>
        <tr>
          <td>标准摘要</td>
          <td colspan="3">{{criterionData.summary}}</td>
        </tr>
        <tr>
          <td>附件下载</td>
          <td colspan="3">{{criterionData.summary}}</td>
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
      <div>
        <div class="data-detail-about">
          <div class="data-detail-about-title">
            <span>{{leftAboutData.title}}</span>
            <span class="data-detail-about-more-span">
              更多
              <Icon type="ios-arrow-dropright" color="#d0d0d0" size="20" style="margin-top: -3px;"/>
            </span>
          </div>
          <div class="data-detail-about-content">
            <ul>
              <li v-for="item in leftAboutData.list" :key="item.id">
                <span>
                  <a href="#" :title="item.name">{{item.name}}</a>
                </span>
                <em>{{item.status}}</em>
              </li>
            </ul>
          </div>
        </div>
        <div class="data-detail-about" style="margin-left: 2%;">
          <div class="data-detail-about-title">
            <span>{{leftAboutData.title}}</span>
            <span class="data-detail-about-more-span">
              更多
              <Icon type="ios-arrow-dropright" color="#d0d0d0" size="20" style="margin-top: -3px;"/>
            </span>
          </div>
          <div class="data-detail-about-content">
            <ul>
              <li v-for="item in leftAboutData.list" :key="item.id">
                <span>
                  <a href="#" :title="item.name">{{item.name}}</a>
                </span>
                <em>{{item.status}}</em>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="statement-con">
        <span class="statement-con-title">负责声明：</span>
        <div>
          <p>本网站所有标准资料，都来自于网络和食品同行，内容仅供食品行业技术交流学习使用，请勿作他用，正式场合使用请购买正版。若网站内容与纸质文件相关内容不一致时，以纸质文件为准，否则由此产生的一切后果自行承担。</p>
          <p>本网站对此不承担任何技术及版权问题；如本站有相关内容侵权，请告知。</p>
          <p>未经食品商务网（www.21food.cn）许可，任何网站不得非法抄袭本网站的资料、资源。</p>
        </div>
      </div>
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
      publishUnitList: [],
      statusList: [
        {value: '1', label: '现行有效'},
        {value: '2', label: '即将实施'},
        {value: '3', label: '已经作废'}
      ],
      criterionData: {},
      leftAboutData: {
        title: '相关分类抽检结果',
        type: 'product_type',
        code: '皮肤用化妆品',
        list: [
          {id: 1, name: '祟拜你协商的发货速度覅俺还是短发还是短发', status: '合格'},
          {id: 2, name: '祟拜你协商的发货速度覅俺还是短发还是短发祟拜你协商的发货速度覅俺还是短发还是短发祟拜你协商的发货速度覅俺还是短发还是短发', status: '不合格'},
          {id: 3, name: '祟拜你协商的发货速度覅俺还是短发还是短发祟拜你协商的发货速度覅俺还是短发还是短发祟拜你协商的发货速度覅俺还是短发还是短发', status: '合格'},
          {id: 4, name: '祟拜你协商的发货速度覅俺还是短发还是短发', status: '不合格'},
          {id: 5, name: '祟拜你协商的发货速度覅俺还是短发还是短发', status: '合格'}
        ]
      }
    }
  },
  mounted () {
    this.getAllSystemDataTypeList()
    this.criterionData = this.$route.params
    this.spotCheckData['statusName'] = this.statusList[this.criterionData.status]
    this.spotCheckData['annexs'] = this.spotCheckData.annexList.join(' ')
  },
  methods: {
    handleUploadFile () {
      this.getTablePageData()
    },
    getAllSystemDataTypeList () {
      const option = {
        url: '/system/getAllSystemDataTypeList/2',
        method: 'get'
      }
      axios.request(option).then(res => {
        this.publishUnitList = res.data.data.publishUnitList
      })
    },
    handleClear (e) {

    },
    handleSearch () {

    }
  }
}
</script>
