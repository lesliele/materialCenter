<!--
 * @Author: your name
 * @Date: 2020-02-10 14:54:25
 * @LastEditTime : 2020-02-10 19:12:55
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-ssr-tech\src\app.vue
 -->
<template>
    <div id="test">
        {{text}}
    </div>
</template>

<script>
export default {
    data() {
        return {
            text: 'hello'
        }
    },
    mounted() {
        cons.log('123')
    },
}
</script>

<style>
#test{
    color: red;
}
</style>