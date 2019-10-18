import Vue from 'vue'
import Vuex from 'vuex'

import user from './module/user'
import app from './module/app'

const product = {
  state: {
    productType: 0
  },
  mutations: {
    setProductType: (state, productType) => {
      state.productType = productType
    }
  },
  actions: {
    CreateProductType ({ commit }, productType) {
      commit('setProductType', productType)
    }
  }
}

Vue.use(Vuex)

export default new Vuex.Store({
  getters: {
    productType: state => state.product.productType
  },
  modules: {
    user,
    app,
    product
  }
})
