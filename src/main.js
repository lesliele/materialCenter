/*
 * @Author: your name
 * @Date: 2020-02-10 15:18:32
 * @LastEditTime : 2020-02-10 17:48:22
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-ssr-tech\src\main.js
 */
import Vue from 'vue';
import App from './app.vue';
import './assets/images/dog.jpg';
import './assets/styles/main.css';
import './assets/styles/test.styl';

const root = document.createElement('div');
document.body.appendChild(root);

new Vue({
    render: h => h(App)
}).$mount(root);