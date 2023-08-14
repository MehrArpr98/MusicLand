import { defineStore } from "pinia";

export default defineStore('mobile',{
    state: () => ({
        isOpenMenu: false
    }),
    getters:{
        hiddenClass(state){
            return !state.isOpenMenu ? "hidden" : " "
        }
      }
})