const statusList = [
  {value: '1', label: '启用'},
  {value: '2', label: '禁用'}
]

const spotCheckStatusList = [
  {value: '1', label: '合格'},
  {value: '0', label: '不合格'}
]

const criterionStatusList = [
  {value: '1', label: '现行有效'},
  {value: '2', label: '即将实施'},
  {value: '3', label: '已经作废'}
]

const lawStatusList = [
  {value: '1', label: '现行有效'},
  {value: '2', label: '征求意见'},
  {value: '3', label: '已经废止'},
  {value: '4', label: '未知状态'}
]

function getLabelByVal(val, arr) {
  let l = arr.length
  let label = ''
  if (l > 0) {
    for (let i = 0; i < l; i++) {
      if (arr[i]['value'] === val) {
        label = arr[i]['label']
        break
      }
    }
    return label
  }
}

export default {
  statusList,
  spotCheckStatusList,
  criterionStatusList,
  lawStatusList,
  getLabelByVal
}