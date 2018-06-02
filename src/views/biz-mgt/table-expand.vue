// table-expand.vue
<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>
<template>
    <Table :columns="expandColumn" :data="row"></Table>
</template>
<script>
    export default {
        data () {
            return {
                expandColumn: [
                    {
                        title: '发票代码',
                        key: 'invoiceCode'
                    },
                    {
                        title: '发票号码',
                        key: 'invoiceNo'
                    },
                    {
                        title: '发票校验码',
                        key: 'checkCode'
                    },
                    {
                        title: '销售方名称',
                        key: 'sellerName'
                    },
                    {
                        title: '购买方名称',
                        key: 'name'
                    }
                ]
            };
        },
        props: {
            row: Object
        }
    };
</script>
