<style lang="less">
    @import '../../styles/common.less';
    @import './components/table.less';
</style>

<template>
    <div>
        <Row class="margin-top-10">
            <Col >
                <Card @click="doit()">
                    <p slot="title">
                        <Icon type="android-remove"></Icon>
                        报销单列表
                    </p>
                    <div class="edittable-table-height-con" >
                        <can-edit-table refs="table2" v-model="invoiceData"
                                        :columns-list="invoiceColumns" class=" table2"></can-edit-table>
                    </div>
                    <!-- 分页 -->
                     <div class="page">
                        <div style="float: right;">
                            <Page :total="totalPage" :current="page" @on-change="changePage"></Page>
                        </div>
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
        data() {
            return {
                invoiceColumns: [],
                invoiceData: [],
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
            getData() {
                         
                this.invoiceColumns = tableData.invoiceColumns;
                let token = Cookies.get('token');
                console.log(token);
                this.$Message.success(token);
                let reqPage = this.page - 1;
                console.log('requestt page:' + reqPage);
                this.axios({
                    method: 'get',
                    url: '/api/invoice/invoice/list?page=' + reqPage + '&limit=' + this.limit
                }).then(resp => {
                    // 跳转到主页面
                   
                    let result = resp.data.result;
                    let content = result.content; 
                    console.log(content)
                    this.totalPage = result.totalElements;
                    // this.$Message.success(JSON.stringify(content));
                    this.invoiceData = content;
                }).catch(error => {
                    this.$Message.error(error.message);
                });

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
            },
            doit(){
                console.log("123")
            }
            

        },
        created() {

            this.getData();
        }
    };
</script>
