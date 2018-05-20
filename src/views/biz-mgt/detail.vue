<style lang="less">
    @import '../../styles/common.less';
    @import './components/table.less';
</style>

<template>
    <div style="height: 550px;">
        <h1>{{detail}}</h1>
    </div>
</template>

<script>
// import canEditTable from './components/canEditTable.vue';
// import tableData from './components/table_data.js';
export default {
   
    data () {
        return {
            detail : 'detail'
        };
    },
    methods: {

    }
}
</script>
