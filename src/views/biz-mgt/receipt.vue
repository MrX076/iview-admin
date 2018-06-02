<style lang="less">
    @import '../../styles/common.less';
    @import './components/table.less';

    .ivu-modal-footer {
        display: none !important;
    }
</style>

<template>
    <!--<div style="height: 550px;">
        <Row class="margin-top-10">
            <Col span="12">
                <Card>
                    <p slot="title">
                        <Icon type="android-remove"></Icon>
                        可编辑单元行
                    </p>
                    <div class="edittable-table-height-con">
                        <can-edit-table refs="table2" v-model="receptData"
                                        :columns-list="receptsColumns"></can-edit-table>
                    </div>
                    <div class="page">
                        <div style="float: right;">
                            <Page :total="2" :current="1" @on-change="changePage"></Page>
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
                        <can-edit-table refs="table3" v-model="editIncellData" :hover-show="true" :edit-incell="true"
                                        :columns-list="editIncellColumns"></can-edit-table>
                    </div>
                </Card>
            </Col>
        </Row>
    </div>-->
    <div>
        <Modal v-model="receiptModal" width="400px">
            <p slot="header" style="color:#0055aa;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>{{modalTitle}}</span>
            </p>
            <div style="text-align:center">
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100"
                      label-position="left">
                    <FormItem label="报销单名称" prop="name">
                        <Input v-model="formValidate.name" placeholder="输入报销单名称"></Input>
                    </FormItem>
                    <FormItem label="报销单描述" prop="remark">
                        <Input v-model="formValidate.remark" placeholder="输入报销单描述"></Input>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="addReceipt('formValidate')" v-show="leftShow">增加</Button>
                        <Button type="primary" @click="editReceipt('formValidate')" v-show="rightShow">保存</Button>
                    </FormItem>
                </Form>
            </div>
        </Modal>
        <Row>
            <Col span="12">
                <Card>
                    <p slot="title">报销单列表</p>
                    <p slot="extra">
                        <Button type="primary" @click="showAdd()">增加</Button>
                        <Button type="primary" @click="commitReceipt()">报销</Button>
                    </p>
                    <div>
                        <Table highlight-row
                               @on-selection-change="recordSelect"
                               @on-current-change="getCurInvoice"
                               border :columns="receiptColumns"
                               height="500"
                               :data="receiptData"></Table>

                    </div>
                </Card>
            </Col>
            <Col span="12">
                <Card style="margin-left: 10px">
                    <p slot="title">
                        <Icon type="ios-paper-outline"></Icon>
                        发票
                    </p>
                    <p slot="extra">
                        <Button type="primary" size="middle" @click="changeInvoice()">保存</Button>
                    </p>
                    <div style="text-align:center">
                        <Transfer
                                :data="allInvoice"
                                :target-keys="inInvoice"
                                :list-style="{width: '250px', height: '500px'}"
                                :titles="['可添加发票','已添加发票']"
                                :operations="['移除','增加']"
                                @on-change="invoiceChange"></Transfer>
                    </div>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                curSelect: [],
                // 当前报销单id
                curReceipt: 0,
                // 新增/修改弹框
                receiptModal: false,
                modalTitle: '',
                leftShow: false,
                rightShow: false,
                // 穿梭框
                allInvoice: [],
                inInvoice: [],
                // 弹框表单数据和校验
                formValidate: {
                    name: '',
                    remark: ''
                },
                ruleValidate: {
                    name: [
                        {required: true, message: '名称不能为空', trigger: 'blur'}
                    ],
                    remark: [
                        {required: true, message: '描述不能为空', trigger: 'blur'}
                    ]
                },
                // table表头
                receiptColumns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '报销单名称',
                        key: 'name',
                        render: (h, params) => {
                            return h('div', [
                                h('Icon', {
                                    props: {
                                        type: 'person'
                                    }
                                }),
                                h('strong', params.row.name)
                            ]);
                        }
                    },
                    {
                        title: '描述',
                        key: 'remark'
                    },
                    {
                        title: '状态',
                        key: 'status',
                        filters: [
                            {
                                label: '所有',
                                value: 0
                            },
                            {
                                label: '未提交',
                                value: 1
                            },
                            {
                                label: '审核中',
                                value: 2
                            },
                            {
                                label: '未通过',
                                value: 3
                            },
                            {
                                label: '已通过',
                                value: 4
                            }
                        ],
                        filterMultiple: false,
                        filterMethod (value, row) {
                            if (value === 0) {
                                return true;
                            } else if (value === 1) {
                                return row.status === 'created';
                            } else if (value === 2) {
                                return row.status === 'commit';
                            } else if (value === 3) {
                                return row.status === 'fail';
                            } else if (value === 4) {
                                return row.status === 'success';
                            }
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.receiptModal = true;
                                            this.modalTitle = '修改报销单';
                                            this.rightShow = true;
                                            this.leftShow = false;
                                        }
                                    }
                                }, '修改'),
                                h('Poptip', {
                                    props: {
                                        confirm: true,
                                        title: '您确定要删除这条数据吗?',
                                        transfer: true
                                    },
                                    on: {
                                        'on-ok': () => {
                                            this.deleteReceipt(params['row']['id']);
                                            // this.deleteReceipt(params,index);
                                            this.remove(params.index);
                                            // vm.thisTableData.splice(index, 1);
                                            // vm.$emit('input', vm.handleBackdata(vm.thisTableData));
                                            // vm.$emit('on-delete', vm.handleBackdata(vm.thisTableData), index);
                                        }
                                    }
                                }, [
                                    h('Button', {
                                        style: {
                                            margin: '0 5px'
                                        },
                                        props: {
                                            type: 'error',
                                            placement: 'top',
                                            size: 'small'
                                        }
                                    }, '删除')
                                ])
                                //     h('Button', {
                                //         props: {
                                //             type: 'error',
                                //             size: 'small'
                                //         },
                                //         on: {
                                //             click: () => {
                                //                 this.remove(params.index);
                                //             }
                                //         }
                                //     }, '删除')
                            ]);
                        }
                    }
                ],
                receiptData: []
            };
        },
        created () {
            this.getAllReceipt();
            // this.getAllInvoice();
        },
        methods: {
            // 为报销单设置发票
            changeInvoice () {
                this.$Loading.start();
                this.axios({
                    method: 'put',
                    url: '/api/invoice/receipt/invoices',
                    params: {
                        receiptId: this.curReceipt
                    },
                    data: this.inInvoice
                }).then(resp => {
                    this.$Loading.finish();
                    this.$Message.success('保存成功');
                    this.getAllReceipt();
                }).catch(error => {
                    this.$Loading.error();
                    this.$Message.error(error.message);
                });
            },
            // 显示增加弹框
            showAdd () {
                this.receiptModal = true;
                this.modalTitle = '增加报销单';
                this.rightShow = false;
                this.leftShow = true;
            },
            // 获取所有报销单
            getAllReceipt () {
                this.axios({
                    method: 'get',
                    url: '/api/invoice/receipt/curAll'
                }).then(resp => {
                    let reqData = resp.data.result;
                    // 设置可选中状态：只有fail或者created可被选中
                    for (let item of reqData) {
                        item['_disabled'] = item['status'] === 'commit' || item['status'] === 'success';
                    }
                    console.log('receipt-mgt get all receipt:' + JSON.stringify(reqData.map(item => item.name)));
                    this.receiptData = reqData;
                }).catch(error => {
                    this.$Message.error(error.message);
                    this.getAllReceipt();
                });
            },
            // 获取所有有效的发票
            getAllInvoice (currentRow) {
                this.axios({
                    method: 'get',
                    url: '/api/invoice/invoice/valid',
                    params: {
                        receiptId: currentRow['id']
                    }
                }).then(resp => {
                    let reqData = resp.data.result;
                    for (let item of reqData) {
                        item['key'] = item['id'];
                        item['label'] = item['sellerName'] + '-' + item['remark'];
                        item['disabled'] = item['status'] === 'invalid';
                    }
                    this.allInvoice = reqData;
                    // console.log('receipt-mgt get all valid invoice:' + JSON.stringify(reqData));
                }).catch(error => {
                    this.$Message.error(error.message);
                    this.getAllInvoice();
                });
            },
            // 记录被选中的报销单
            recordSelect (selectArr) {
                console.log('record select:' + JSON.stringify(selectArr.map(item => item['id'])));
                this.curSelect = selectArr.map(item => item['id']);
            },
            // 获取当前报销单发票
            getCurInvoice (currentRow) {
                this.curReceipt = currentRow['id'];
                this.inInvoice = currentRow['invoices'].map(item => item.id);
                console.log(currentRow);
                this.getAllInvoice(currentRow);
            },
            // transfer内容改变
            invoiceChange (newTargetKeys) {
                this.inInvoice = newTargetKeys;
                console.log(this.inInvoice);
            },
            // 增加报销单
            addReceipt (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Loading.start();
                        this.axios({
                            method: 'post',
                            url: '/api/invoice/receipt',
                            data: {
                                name: this.formValidate.name,
                                remark: this.formValidate.remark
                            }
                        }).then(resp => {
                            this.$Loading.finish();
                            this.$Message.success('新增成功');
                            // 弹框消失
                            this.receiptModal = false;
                            // 重新获取报销单列表
                            this.getAllReceipt();
                        }).catch(error => {
                            this.$Loading.error();
                            this.$Message.error(error.message);
                        });
                    } else {
                        this.$Message.error('请填写正确的数据');
                    }
                });
            },
            // 提交报销单
            commitReceipt () {
                this.$Loading.start();
                this.axios({
                    method: 'put',
                    url: '/api/invoice/receipt/commit',
                    data: this.curSelect
                }).then(resp => {
                    this.$Loading.finish();
                    this.$Message.success('提交成功');
                    // 弹框消失
                    this.receiptModal = false;
                    // 重新获取报销单列表
                    this.getAllReceipt();
                }).catch(error => {
                    this.$Loading.error();
                    this.$Message.error(error.message);
                });
            },
            // 删除报销单
            deleteReceipt (id) {
                this.$Loading.start();
                this.axios({
                    method: 'delete',
                    url: '/api/invoice/receipt',
                    params: {
                        id: id
                    }
                }).then(resp => {
                    this.$Loading.finish();
                    this.$Message.success('删除成功');
                    // 弹框消失
                    this.receiptModal = false;
                    // 重新获取报销单列表
                    this.getAllReceipt();
                }).catch(error => {
                    this.$Loading.error();
                    this.$Message.error(error.message);
                });
            },
            // 修改报销单
            editReceipt (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Loading.start();
                        this.axios({
                            method: 'put',
                            url: '/api/invoice/receipt',
                            data: {
                                name: this.formValidate.name,
                                remark: this.formValidate.remark,
                                id: this.curReceipt
                            }
                        }).then(resp => {
                            this.$Loading.finish();
                            this.$Message.success('保存成功');
                            // 弹框消失
                            this.receiptModal = false;
                            // 重新获取报销单列表
                            this.getAllReceipt();
                        }).catch(error => {
                            this.$Loading.error();
                            this.$Message.error(error.message);
                        });
                    } else {
                        this.$Message.error('请填写正确的数据');
                    }
                });
            },
            // 删除数据
            remove (index) {
                this.receiptData.splice(index, 1);
            }
        }
    };
    // import canEditTable from './components/canEditTable.vue';
    // import tableData from './components/table_data.js';
    // import Cookies from 'js-cookie';
    //
    // export default {
    //     name: 'editable-table',
    //     components: {
    //         canEditTable
    //     },
    //     data () {
    //         return {
    //             receptsColumns: [],
    //             receptData: [],
    //             // userColumns: [],
    //             // userData: [],
    //             editIncellColumns: [],
    //             editIncellData: [],
    //             // editInlineAndCellColumn: [],
    //             // editInlineAndCellData: [],
    //             // showCurrentColumns: [],
    //             showCurrenttableData: false,
    //             page: 1,
    //             limit: 8,
    //             totalPage: 0
    //         };
    //     },
    //     methods: {
    //         changePage (page) {
    //             console.log('changePage:' + page);
    //             this.page = page;
    //             this.getData();
    //         },
    //         getData () {
    //             this.receptsColumns = tableData.receptsColumns;
    //
    //             let token = Cookies.get('token');
    //             // console.log(token);
    //             // this.$Message.success(token);
    //             let reqPage = this.page - 1;
    //             // console.log('request page:' + reqPage);
    //             this.axios({
    //                 method: 'get',
    //                 url: '/api/invoice/receipt/list?page=' + this.page + '&limit=' + this.limit
    //             }).then(resp => {
    //                 // 跳转到主页面
    //
    //                 let result = resp.data.result;
    //                 let content = result.content;
    //                 // console.log(content)
    //                 this.totalPage = result.totalElements;
    //                 // this.$Message.success(JSON.stringify(content));
    //                 this.receptData = content;
    //             }).catch(error => {
    //                 this.$Message.error(error.message);
    //             });
    //         },
    //         handleNetConnect (state) {
    //             this.breakConnect = state;
    //         },
    //         handleLowSpeed (state) {
    //             this.lowNetSpeed = state;
    //         },
    //         getCurrentData () {
    //             this.showCurrenttableData = true;
    //         },
    //         handleDel (val, index) {
    //             this.$Message.success('删除了第' + (index + 1) + '行数据');
    //         },
    //         handleCellChange (val, index, key) {
    //             this.$Message.success('修改了第 ' + (index + 1) + ' 行列名为 ' + key + ' 的数据');
    //         },
    //         handleChange (val, index) {
    //             this.$Message.success('修改了第' + (index + 1) + '行数据');
    //         }
    //     },
    //     created () {
    //         this.getData();
    //     }
    // };
</script>
