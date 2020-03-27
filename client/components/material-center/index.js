import MaterialCenter from './material-center.vue';
import Vue from 'vue';
import selectMaterial from './func';

export default (Vue) => {
  Vue.component(MaterialCenter.name, MaterialCenter);
  Vue.prototype.$selectMaterial = selectMaterial;
}