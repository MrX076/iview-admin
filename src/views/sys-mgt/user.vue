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
                    <Button type="primary">新增</Button>
                </div>

                <div class="edittable-table-height-con">
                    <can-edit-table refs="table2" v-model="userData"
                                    :columns-list="userColumns"></can-edit-table>
                </div>
                <div class="page">
                    <div style="float: right;">
                        <Page :total="totalPage" :current="page" @on-change="changePage"></Page>
                    </div>
                </div>
            </Card>
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
                userColumns: [],
                userData: [],
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
                this.userColumns = tableData.userColumns;
                // console.log(JSON.stringify(this.store));
                let token = Cookies.get('token');
                // console.log(token);
                this.$Message.success(token);
                let reqPage = this.page - 1;
                console.log('requestt page:' + reqPage);
                this.axios({
                    method: 'get',
                    url: '/api/invoice/user/list?page=' + reqPage + '&limit=' + this.limit
                }).then(resp => {
                    let result = resp.data.result;
                    let content = result.content;
                    console.log(content);
                    this.totalPage = result.totalElements;
                    // this.$Message.success(JSON.stringify(content));
                    this.userData = content;
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
                this.showCurrentTableData = true;
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
