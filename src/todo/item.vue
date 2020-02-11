<!--
 * @Author: your name
 * @Date: 2020-02-11 16:05:57
 * @LastEditTime : 2020-02-11 17:40:55
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-ssr-tech\src\todo\item.vue
 -->
<template>
    <div class="item">
        <input
            type="checkbox"
            class="item_box"
            v-model="todo.completed"/>
        <label :class="[todo.completed ? 'checked' : '']">{{todo.content}}</label>
        <button type="button" @click="delTodo">del</button>
    </div>
</template>
<script>
export default {
    props: {
        todo: {
            type: Object,
            required: true
        }
    },
    methods: {
        delTodo() {
            this.$emit('del', this.todo.id);
        }
    }
}
</script>

<style lang="stylus" scoped>
.item {
    .checked{
        color red
    }
}
</style>