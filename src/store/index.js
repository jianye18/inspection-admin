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
const base = {
  state: {
    type: 0
  },
  mutations: {
    setType: (state, type) => {
      state.productType = type
    }
  },
  actions: {
    CreateType ({ commit }, type) {
      commit('setType', type)
    }
  }
}

Vue.use(Vuex)

export default new Vuex.Store({
  getters: {
    type: state => state.base.type,
    productType: state => state.product.productType
  },
  modules: {
    user,
    app,
    base,
    product
  }
})
