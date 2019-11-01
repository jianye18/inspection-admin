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
      state.type = type
    }
  },
  actions: {
    CreateType ({ commit }, type) {
      commit('setType', type)
    }
  }
}

const criterion = {
  state: {
    criterionCategory: 0,
    criterionType: 0
  },
  mutations: {
    setCriterionType: (state, criterionType) => {
      state.criterionType = criterionType
    },
    setCriterionCategory: (state, criterionCategory) => {
      state.criterionCategory = criterionCategory
    }
  },
  actions: {
    CreateCriterionType ({ commit }, criterionType) {
      commit('setCriterionType', criterionType)
    },
    CreateCriterionCategory ({ commit }, criterionCategory) {
      commit('setCriterionCategory', criterionCategory)
    }
  }
}

const law = {
  state: {
    lawCategory: 0,
    lawType: 0
  },
  mutations: {
    setLawType: (state, lawType) => {
      state.lawType = lawType
    },
    setLawCategory: (state, lawCategory) => {
      state.lawCategory = lawCategory
    }
  },
  actions: {
    CreateLawType ({ commit }, lawType) {
      commit('setLawType', lawType)
    },
    CreateLawCategory ({ commit }, lawCategory) {
      commit('setLawCategory', lawCategory)
    }
  }
}

Vue.use(Vuex)

export default new Vuex.Store({
  getters: {
    type: state => state.base.type,
    productType: state => state.product.productType,
    criterionCategory: state => state.criterion.criterionCategory,
    criterionType: state => state.criterion.criterionType,
    lawCategory: state => state.criterion.lawCategory,
    lawType: state => state.criterion.lawType
  },
  modules: {
    user,
    app,
    base,
    product,
    criterion,
    law
  }
})
