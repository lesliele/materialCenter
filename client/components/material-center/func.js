import ExtendComponent from './extend-component';
import Vue from 'vue';

const ComponentConstructor = Vue.extend(ExtendComponent);

const selectMaterial = options => {
  const {
    getList,
    ...props
  } = options;
  const instance = new ComponentConstructor({
    propsData: props
  });
  instance.$on('handleList', list => {
    getList(list);
  })
  const vm = instance.$mount();
  document.body.appendChild(vm.$el);
  vm.isVisible = true;
  return instance;
}

export default selectMaterial;
