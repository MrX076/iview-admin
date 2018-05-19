<style lang="less">
    @import '../../styles/common.less';
    @import './components/table.less';
    @import './user.less';
</style>

<template>
    <div>
        <Row class="margin-top-10" style="margin-bottom: 10px">
            <Card>
                <p slot="title" class="title">
                    <Icon type="android-remove"></Icon>
                    用户列表

                </p>
                <div class="t-button">
                    <Button type="primary" >Primary</Button>
                </div>

                <div class="edittable-table-height-con">
                    <can-edit-table refs="table2" v-model="editInlineData"
                                    :columns-list="editInlineColumns"></can-edit-table>
                </div>
                <div class="page">
                    <div style="float: right;">
                        <Page :total="100" :current="1" @on-change="changePage"></Page>
                    </div>
                </div>
            </Card>
        </Row>
    </div>
</template>

<script>
    import canEditTable from './components/canEditTable.vue';
    import tableData from './components/table_data.js';

    export default {
        name: 'editable-table',
        components: {
            canEditTable
        },
        data() {
            return {
                columnsList: [],
                tableData: [],
                editInlineColumns: [],
                editInlineData: [],
                editIncellColumns: [],
                editIncellData: [],
                editInlineAndCellColumn: [],
                editInlineAndCellData: [],
                showCurrentColumns: [],
                showCurrentTableData: false
            };
        },
        methods: {
            getData() {
                this.columnsList = tableData.table1Columns;
                this.tableData = tableData.table1Data;
                this.editInlineColumns = tableData.editInlineColumns;
                this.editInlineData = tableData.editInlineData;
                this.editIncellColumns = tableData.editIncellColumns;
                this.editIncellData = tableData.editIncellData;
                this.editInlineAndCellColumn = tableData.editInlineAndCellColumn;
                this.editInlineAndCellData = tableData.editInlineAndCellData;
                this.showCurrentColumns = tableData.showCurrentColumns;
            },
            handleNetConnect(state) {
                this.breakConnect = state;
            },
            handleLowSpeed(state) {
                this.lowNetSpeed = state;
            },
            getCurrentData() {
                this.showCurrentTableData = true;
            },
            handleDel(val, index) {
                this.$Message.success('删除了第' + (index + 1) + '行数据');
            },
            handleCellChange(val, index, key) {
                this.$Message.success('修改了第 ' + (index + 1) + ' 行列名为 ' + key + ' 的数据');
            },
            handleChange(val, index) {
                this.$Message.success('修改了第' + (index + 1) + '行数据');
            }
        },
        created() {
            this.getData();
        }
    };
</script>
