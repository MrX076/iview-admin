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
                    <form class="addForm" id="addForm" >                       
                        <div>
                            <span>买方：</span><input type="text" placeholder="请输入买方名称" name="sell" value="">
                        </div>

                        <div>
                            <span>银行账号：</span><input type="text" placeholder="请输入银行账号" value="">
                        </div>

                        <div>
                            <span>地址：</span><input type="text" placeholder="请输入地址" value="">
                        </div>

                        <div>
                            <span>金额：</span><input type="text" placeholder="请输入金额" value="">
                        </div>

                        <div>
                            <span>销售方：</span><input type="text" placeholder="请输入销售方" value="">
                        </div>

                        <div>
                            <span>销售方纳税识别号：</span><input type="text" placeholder="请输入销售方" value="">
                        </div>

                        <div>
                            <span>校验码:</span><input type="text" placeholder="请输入校验码" value="" >
                        </div>

                        <div>
                            <span>发票代码：</span><input type="text" placeholder="请输入发票代码" value="">
                        </div>

                        <div>
                            <span>开票日期：</span><input type="date" placeholder="请输入开票日期" value="">
                        </div>

                        <div>
                            <span>发票号：</span><input type="text" placeholder="请输入发票号" value="">
                        </div>

                        
                        <div>
                            <span>taxpayerCode ：</span><input type="text" placeholder="请输入taxpayerCode " value="">
                        </div>

                        <div>
                            <span>备注：</span><input type="text" placeholder="请输入备注" value="">
                        </div>
                         
                        <div>
                            <button class="btn ivu-btn-success" @click="addMsg()">提交</button>
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
                            <Page :total="total" :current="page" @on-change="changePage"></Page>
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
    import axios from 'axios';
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
                roleModel: false, 
                total: 0,
                newData:[],
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
                let reqPage = this.page -1;
                // console.log('requestt page:' + reqPage);
                //获取订单列表数据
                this.axios({
                    method: 'get',
                    url: '/api/invoice/invoice/list?page=' + reqPage + '&limit=' + this.limit
                }).then(resp => {
                    // 跳转到主页面
                   
                    let result = resp.data.result;
                    let content = result.content; 
                    // console.log(result.totalElements)
                    this.total = result.totalElements;
                    // if(result.totalElements/this.limit==0){
                    //     this.total = result.totalElements;
                    // }
                    // else{
                    //     this.total = result.totalElements+this.limit;
                    // }                  
                    this.invoiceData = content;
                }).catch(error => {
                    this.$Message.error(error.message);
                });

            },
           
            changeRo(){
                this.roleModel = !this.roleModel;
            },
            addMsg(){
               
                let form = document.getElementById('addForm');
                let div = form.children;
                
                for(let i=0;i<div.length-1;i++){
                    this.newData.push(div[i].children[1])
                    console.log(this.newData[i].value)
                } 
                
                console.log(this.newData)

                let newdata={
                    name : this.newData[0].value,
                    account:this.newData[1].value,
                    address: this.newData[2].value,
                    amount: this.newData[3].value,
                    sellerName : this.newData[4].value,
                    sellerCode : this.newData[5].value,
                    checkCode : this.newData[6].value,
                    invoiceCode : this.newData[7].value,
                    invoiceDate : this.newData[8].value,
                    invoiceNo : this.newData[9].value,
                    taxpayerCode : this.newData[10].value,
                    remark : this.newData[11].value,
                    
                   
                    
                }
                    axios.post('api/invoice/invoice',JSON.stringify(newdata),{
                             headers: {
                            'Content-Type': 'application/json'
                      }
                    })
                    .then(res => {
                        // console.log(res.result);
                        this.$Message.success("成功添加");
                    })

                                    
            },
        
            

        },
        created() {

            this.getData();
        }
    };
</script>
