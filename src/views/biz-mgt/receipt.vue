<style lang="less">
    @import '../../styles/common.less';
    @import './components/table.less';
</style>

<template>
    <div style="height: 550px;">
        <Row class="margin-top-10">
            <Col span="12">
                <Card>
                    <p slot="title">
                        <Icon type="android-remove"></Icon>
                        可编辑单元行
                    </p>
                    <div class="edittable-table-height-con">
                        <can-edit-table refs="table2" v-model="receptData" :columns-list="receptsColumns"></can-edit-table>
                    </div>
                    <div class="page">
                        <div style="float: right;">
                            <Page :total="100" :current="1" @on-change="changePage"></Page>
                        </div>
                    </div>
                </Card>
            </Col>
            <Col span="12" class="padding-left-10">
                <Card>
                    <p slot="title">
                        <Icon type="android-more-horizontal"></Icon>
                        可编辑单元格(鼠标移入显示编辑单元格按钮)
                    </p>
                    <div class="edittable-table-height-con">
                        <can-edit-table refs="table3" v-model="editIncellData" :hover-show="true" :edit-incell="true" :columns-list="editIncellColumns"></can-edit-table>
                    </div>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import canEditTable from './components/canEditTable.vue';
import tableData from './components/table_data.js';
import Cookies from 'js-cookie';
export default {
    name: 'editable-table',
    components: {
        canEditTable
    },
    data () {
        return {
            receptsColumns: [],
            receptData: [], 
            // userColumns: [],
            // userData: [],
            editIncellColumns: [],
            editIncellData: [],
            // editInlineAndCellColumn: [],
            // editInlineAndCellData: [],
            // showCurrentColumns: [],
            showCurrenttableData: false,
            page: 1,
            limit: 8,
            totalPage: 0
        };
    },
    methods: {
        changePage (page) {
                console.log('changePage:' + page);
                this.page = page;
                this.getData();
            },
        getData () {
            this.receptsColumns = tableData.receptsColumns;
           
                let token = Cookies.get('token');
                // console.log(token);
                // this.$Message.success(token);
                let reqPage = this.page - 1;
                // console.log('request page:' + reqPage);
                this.axios({
                    method: 'get',
                    url: '/api/invoice/receipt/list?page=' + this.page + '&limit=' + this.limit
                }).then(resp => {
                    // 跳转到主页面
                   
                    let result = resp.data.result;
                    let content = result.content; 
                    // console.log(content)
                    this.totalPage = result.totalElements;
                    // this.$Message.success(JSON.stringify(content));
                    this.receptData = content;
                }).catch(error => {
                    this.$Message.error(error.message);
                });
        },
        handleNetConnect (state) {
            this.breakConnect = state;
        },
        handleLowSpeed (state) {
            this.lowNetSpeed = state;
        },
        getCurrentData () {
            this.showCurrenttableData = true;
        },
        handleDel (val, index) {
            this.$Message.success('删除了第' + (index + 1) + '行数据');
        },
        handleCellChange (val, index, key) {
            this.$Message.success('修改了第 ' + (index + 1) + ' 行列名为 ' + key + ' 的数据');
        },
        handleChange (val, index) {
            this.$Message.success('修改了第' + (index + 1) + '行数据');
        }
    },
    created () {
        this.getData();
    }
};
</script>
