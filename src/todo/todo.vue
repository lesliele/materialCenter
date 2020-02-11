<!--
 * @Author: your name
 * @Date: 2020-02-11 16:05:51
 * @LastEditTime : 2020-02-11 18:05:43
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-ssr-tech\src\todo\todo.vue
 -->
<template>
    <div class="todo">
        <input
            type="text"
            class="input_todo"
            placeholder="please enter value"
            @keyup.enter="addTodo"
        />
        <Item :todo="todo" v-for="todo in filterTodo" :key="todo.id" @del="handleDel"></Item>
        <Tabs :filter="filter" :todos="todos" @toggle="handelToggle"></Tabs>
    </div>
</template>

<script>
import Item from './item.vue';
import Tabs from './tabs.vue';
let id = 0;
export default {
    components: {
        Item,
        Tabs
    },
    data() {
        return {
            todos: [],
            filter: 'all'
        }
    },
    computed: {
        filterTodo() {
            if (this.filter == 'all') {
                return this.todos;
            }
            let completed = this.filter == 'completed';
            return this.todos.filter(item => completed == item.completed);
        }
    },
    methods: {
        addTodo(e) {
            this.todos.unshift({
                id: id++,
                completed: false,
                content: e.target.value
            });
            e.target.value = '';
        },
        handleDel(id) {
            this.todos.splice(this.todos.findIndex(item => item.id === id), 1)
        },
        handelToggle(state) {
            this.filter = state;
        }
    }
}
</script>

<style lang="stylus" scoped>
.todo{
    width 500px
    height 400px
    background white
    margin 0 auto    
    padding 10px
    .input_todo{
        display block
        width 300px
        height 50px
        margin 0 auto
        text-align center
    }
}
</style>