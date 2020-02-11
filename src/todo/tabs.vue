<!--
 * @Author: your name
 * @Date: 2020-02-11 16:33:02
 * @LastEditTime : 2020-02-11 18:04:55
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-ssr-tech\src\todo\tabs.vue
 -->
<template>
    <div class="tab_wrapper">
        <span>{{unFinishTodoLen}} item left</span>
        <span
            v-for="state in states"
            :key="state"
            :class="['tab', filter == state ? 'checked' : '']"
            @click="toggleState(state)">
            {{state}}
        </span>
        <button @click="clearAll">clear</button>
    </div>
</template>
<script>
export default {
    props: {
        filter: {
            type: String,
            required: true
        },
        todos: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            states: ['all', 'actived', 'completed']
        }
    },
    computed: {
        unFinishTodoLen() {
            return this.todos.filter(item => !item.completed).length;
        }
    },
    methods: {
        toggleState(state) {
            this.$emit('toggle', state);
        },
        clearAll() {

        }
    }
}
</script>
<style lang="stylus" scoped>
.tab_wrapper{
    .tab{
        cursor pointer
        font-size 20px
        &.checked{
            color red
        }
    }
}
</style>