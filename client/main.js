import Vue from 'vue';
import App from './app.vue';
import MaterialCenter from './components/material-center';
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import Viewer from 'v-viewer';
import 'viewerjs/dist/viewer.css';
import axios from './axios';
import httpApi from './config/http-api.js';
Vue.prototype.$axios = axios;
Vue.prototype.$api = httpApi;

Vue.use(ViewUI);
Vue.use(MaterialCenter);
Vue.use(Viewer);
Viewer.setDefaults({
    title: [1, (image, imageData) => `${image.alt} (${imageData.naturalWidth} × ${imageData.naturalHeight})`]
});

const root = document.createElement('div');
document.body.appendChild(root);

new Vue({
    render: h => h(App)
}).$mount(root);