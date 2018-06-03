<style lang="less">
    @import "./home.less";
    @import "../../styles/common.less";
</style>
<template>
    <!--https://farm4.staticflickr.com/3753/32764893633_362431a936_k.jpg-->
    <div>
        <img src="https://farm4.staticflickr.com/3753/32764893633_362431a936_k.jpg" alt=""
             style="width: 1500px; height: 700px">
    </div>
</template>

<script>
    import homeMap from './components/map.vue';
    import dataSourcePie from './components/dataSourcePie.vue';
    import visiteVolume from './components/visiteVolume.vue';
    import serviceRequests from './components/serviceRequests.vue';
    import userFlow from './components/userFlow.vue';
    import countUp from './components/countUp.vue';
    import inforCard from './components/inforCard.vue';
    import mapDataTable from './components/mapDataTable.vue';
    import toDoListItem from './components/toDoListItem.vue';

    export default {
        name: 'home',
        components: {
            homeMap,
            dataSourcePie,
            visiteVolume,
            serviceRequests,
            userFlow,
            countUp,
            inforCard,
            mapDataTable,
            toDoListItem
        }
    };
</script>
