<!--
 * @Author: your name
 * @Date: 2020-02-10 14:54:25
 * @LastEditTime : 2020-02-11 16:08:57
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-ssr-tech\src\app.vue
 -->
<template>
    <div id="box">
        <Header></Header>
        <Todo></Todo>
        <Footer></Footer>
        <!-- <div class="inner"></div> -->
    </div>
</template>

<script>
import Header from './todo/header.vue';
import Footer from './todo/footer.jsx';
import Todo from './todo/todo.vue';

export default {
    components: {
        Header,
        Footer,
        Todo
    },
    data() {
        return {
            
        }
    }
}
</script>

<style lang="stylus" scoped>
#box{
    position relative
    top 0
    left 0
    width 100%
    height 100%
    .inner{
        position absolute
        left 0
        top 0
        background-color white
        opacity 0 
        width 100%
        height 100%
    }
}
</style>