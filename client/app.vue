<template>
    <div id="box">
        <Button @click="handleClick">素材管理器</Button>
    </div>
</template>

<script>

export default {
    data() {
        return {
            
        }
    },
    methods: {
        handleClick () {
            this.$selectMaterial({
                type: 'video',
                selectedData: [],
                multi: 1,
                getList (item) {
                    // 获取返回的数据
                    console.log(item)
                }
            });
        }
    }
}
</script>