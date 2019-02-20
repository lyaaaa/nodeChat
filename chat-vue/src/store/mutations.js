import * as types from './mutation-types'

const mutations = {
   [types.SET_USER](state, userInfo){
       state.userInfo = userInfo
   }
}

export default mutations