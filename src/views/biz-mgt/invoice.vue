<style lang="less">
    @import '../../styles/common.less';
    @import './components/table.less';
    @import './invoice.less';
</style>

<template>
    <div>
        <Row class="margin-top-10">
            <Col >
                 <Modal v-model="roleModel" width="720">
                    <p slot="header" style="color:#0055aa;text-align:center">
                        <Icon type="information-circled"></Icon>
                        <span>新增发票</span>
                    </p>
                    <form class="addForm" style="line-height:32px;">                       
                        <div>
                            <span>买方：</span><input type="text" placeholder="请输入买方名称">
                        </div>
                        <div>
                            <span>银行账号：</span><input type="text" placeholder="请输入银行账号">
                        </div>
                        <div>
                            <span>地址：</span><input type="text" placeholder="请输入地址">
                        </div>
                        <div>
                            <span>金额：</span><input type="text" placeholder="请输入金额">
                        </div>
                        <div>
                            <span>销售方：</span><input type="text" placeholder="请输入销售方">
                        </div>
                        <div>
                            <span>备注：</span><input type="text" placeholder="请输入备注">
                        </div>
                        <div>
                            <button class="btn ivu-btn-success">提交</button>
                        </div>
                    </form>
                   
                </Modal>


                <Card >
                    <p slot="title">
                        <Icon type="android-remove"></Icon>
                        报销单列表
                    </p>
                    <p slot="extra">
                        
                        <Button @click="changeRo()" type="primary">新增</Button>
                    </p>
                    <div class="edittable-table-height-con">
                        <can-edit-table refs="table2" v-model="invoiceData"
                                        :columns-list="invoiceColumns" class=" table2"  ></can-edit-table>
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
            canEditTable,
        }, 
        // props:{
        //         roleModel: 'false',
        //     },
        data() {
            return {
                invoiceColumns: [],
                invoiceData: [],
                page: 1,
                limit: 8,
                roleModel: '',
                totalPage: 0,
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
                this.roleModel = false;
                let token = Cookies.get('token');
                // console.log(token);
                // this.$Message.success(token);
                let reqPage = this.page - 1;
                console.log('requestt page:' + reqPage);
                //获取订单列表数据
                this.axios({
                    method: 'get',
                    url: '/api/invoice/invoice/list?page=' + reqPage + '&limit=' + this.limit
                }).then(resp => {
                    // 跳转到主页面
                   
                    let result = resp.data.result;
                    let content = result.content; 
                    // console.log(content)
                    this.totalPage = result.totalElements;
                    this.invoiceData = content;
                }).catch(error => {
                    this.$Message.error(error.message);
                });

            },
           
            changeRo(){
                this.roleModel = !this.roleModel;

            }
            

        },
        created() {

            this.getData();
        }
    };
</script>
