<template>
  <div>
    <div class="detail-data detail-title">
      <div style="font-size: 16px; height: 16px; line-height: 16px; padding-left: 5px; font-weight: bold;border-left: 9px solid #1788bc;">
        搜索标准结果
      </div>
      <div class="search-con search-con-top">
        <Select v-model="formData.publishUnit" style="width:200px" placeholder="请选择发布机构" clearable>
          <Option v-for="item in publishUnitList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Select v-model="formData.status" style="width:200px; margin-left: 2px;" placeholder="请选择状态" clearable>
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
          <td class="detail-content">{{criterionData.statusName}}</td>
          <td>标准分类</td>
          <td class="detail-content">{{criterionData.typeName}}</td>
        </tr>
        <tr>
          <td>发布日期</td>
          <td class="detail-content">{{criterionData.publishDate}}</td>
          <td>实施日期</td>
          <td class="detail-content">{{criterionData.implementDate}}</td>
        </tr>
        <tr>
          <td>发布单位</td>
          <td colspan="3" class="detail-content">{{criterionData.publishUnitName}}</td>
        </tr>
        <tr>
          <td>标准摘要</td>
          <td colspan="3" class="detail-content">{{criterionData.summary}}</td>
        </tr>
        <tr>
          <td>附件下载</td>
          <td colspan="3" class="detail-content">
            {{criterionData.annexs}}
            <Button size="large" type="primary" icon="ios-book-outline" style="float: right; margin-right: 10px;">浏览文件</Button>
            <Button size="large" type="success" icon="ios-download-outline" style="float: right; margin-right: 10px;">下载文件</Button>
          </td>
        </tr>
        <!--<tr>-->
          <!--<td>一键分享</td>-->
          <!--<td colspan="3">{{criterionData.annexs}}</td>-->
        <!--</tr>-->
      </table>
      <div>
        <div class="data-detail-about">
          <div class="data-detail-about-title">
            <span>{{leftAboutData.title}}</span>
            <span class="data-detail-about-more-span" @click="getMoreAboutData(1)">
              更多
              <Icon type="ios-arrow-dropright" color="#d0d0d0" size="20" style="margin-top: -3px;"/>
            </span>
          </div>
          <div class="data-detail-about-content">
            <ul>
              <li v-for="item in leftAboutData.list" :key="item.id">
                <span>
                  <a :href="'/view/spotCheckDetail?id=' + item.id" :title="item.name">{{item.name}}</a>
                </span>
                <em>{{statusList[item.status].label}}</em>
              </li>
              <li v-if="leftAboutData.list.length === 0">
                <span>
                  <a href="#">暂无相关内容</a>
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div class="data-detail-about" style="margin-left: 2%;">
          <div class="data-detail-about-title">
            <span>{{rightAboutData.title}}</span>
            <span class="data-detail-about-more-span" @click="getMoreAboutData(2)">
              更多
              <Icon type="ios-arrow-dropright" color="#d0d0d0" size="20" style="margin-top: -3px;"/>
            </span>
          </div>
          <div class="data-detail-about-content">
            <ul>
              <li v-for="item in rightAboutData.list" :key="item.id">
                <span>
                  <a :href="'/view/spotCheckDetail?id=' + item.id" :title="item.name">{{item.name}}</a>
                </span>
                <em>{{statusList[item.status].label}}</em>
              </li>
              <li v-if="rightAboutData.list.length === 0">
                <span>
                  <a href="#">暂无相关内容</a>
                </span>
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
import './search.less'
import './detail.less'
export default {
  name: 'CriterionDetail',
  data () {
    return {
      modelShow: false,
      formData: {
        searchPhrase: '',
        institution: '',
        checkResult: ''
      },
      currentId: 0,
      publishUnitList: [],
      statusList: [
        {value: '1', label: '现行有效'},
        {value: '2', label: '即将实施'},
        {value: '3', label: '已经作废'}
      ],
      criterionData: {},
      leftAboutData: {
        title: '相关机构标准',
        type: 'publish_unit',
        code: '皮肤用化妆品',
        list: []
      },
      rightAboutData: {
        title: '相关分类标准',
        type: 'category',
        code: '皮肤用化妆品',
        list: []
      }
    }
  },
  mounted () {
    this.getAllSystemDataTypeList()
    this.currentId = this.$route.query.id
    this.getCriterionById()
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
    getCriterionById () {
      const _this = this
      const option = {
        url: '/show/getCriterionById/' + this.currentId,
        method: 'get'
      }
      axios.request(option).then(res => {
        if (res.data.code === 200) {
          _this.criterionData = res.data.data
          _this.criterionData['statusName'] = _this.statusList[_this.criterionData.status].label
          // _this.criterionData['annexs'] = _this.criterionData.annexList ? _this.criterionData.annexList.join(' ') : ''
          _this.getTablePageData(1)
          _this.getTablePageData(2)
        }
      })
    },
    handleClear (e) {

    },
    handleSearch () {
      this.$router.push({
        name: 'criterion',
        params: this.formData
      })
    },
    getTablePageData (param) {
      // console.log(this.formData)
      const _this = this
      const option = {
        url: '/show/getCriterionPageList',
        data: {
          pageNum: 1, // 当前页
          pageSize: 5, // 一页展示数量
          publishUnit: param === 1 ? _this.criterionData.publishUnit : 0,
          category: param === 2 ? _this.criterionData.category : 0,
          currentId: _this.criterionData.id
        },
        method: 'post'
      }
      axios.request(option).then(res => {
        if (param === 1) {
          _this.leftAboutData.code = _this.criterionData.publishUnitName
          _this.leftAboutData.list = res.data.data.list
        }
        if (param === 2) {
          _this.rightAboutData.code = _this.criterionData.categoryName
          _this.rightAboutData.list = res.data.data.list
        }
      })
    },
    getMoreAboutData (param) {
      if (param === 1) {
        this.formData.publishUnit = this.criterionData.publishUnit
      }
      if (param === 2) {
        this.$store.dispatch('CreateCriterionCategory', this.criterionData.category)
        this.formData.category = this.criterionData.category
      }
      this.handleSearch()
    }
  }
}
</script>
