<style lang="less">
    @import '../../styles/common.less';
    @import './components/table.less';
    @import './user.less';

    .ivu-modal-footer {
        display: none;
    }
</style>

<template>
    <div>
        <Row class="margin-top-10" style="margin-bottom: 10px">

            <Modal v-model="userModal" width="360px">
                <p slot="header" style="color:#0055aa;text-align:center">
                    <Icon type="information-circled"></Icon>
                    <span>增加用户</span>
                </p>
                <div>
                    <Form :model="formTop" ref="formTop" label-position="top" :rules="ruleValidate">
                        <FormItem label="名称" prop="name">
                            <Input v-model="formTop.name"></Input>
                        </FormItem>
                        <FormItem label="电话" prop="phone">
                            <Input v-model="formTop.phone"></Input>
                        </FormItem>
                        <FormItem label="邮箱" prop="email">
                            <Input v-model="formTop.email"></Input>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" @click="addUser('formTop')">保存</Button>
                        </FormItem>
                    </Form>
                </div>
            </Modal>
            <Card>
                <p slot="title" class="title">
                    <Icon type="android-remove"></Icon>
                    用户列表
                </p>
                <div class="t-button">
                    <Button type="primary" @click="showAdd()">新增</Button>
                </div>

                <div class="edittable-table-height-con">
                    <can-edit-table refs="table2" v-model="userData" @on-delete="handleDel" @on-change="handleChange"
                                    :columns-list="userColumns"></can-edit-table>
                </div>
                <div class="page">
                    <div style="float: right;">
                        <Page :total="totalItem" :current="page" @on-change="changePage"></Page>
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
                userModal: false,
                userColumns: [],
                userData: [],
                page: 1,
                limit: 8,
                totalItem: 0,
                formTop: {
                    name: '',
                    phone: '',
                    email: ''
                },
                ruleValidate: {
                    name: [
                        {required: true, message: '名称不能为空', trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: '邮箱不能为空', trigger: 'blur'},
                        {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, message: '电话不能为空', trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            addUser (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('Success!');
                        console.log('add role');
                        this.$Loading.start();
                        this.axios({
                            method: 'post',
                            url: '/api/invoice/user',
                            data: {
                                username: this.formTop.name,
                                phone: this.formTop.phone,
                                email: this.formTop.email
                            }
                        }).then(resp => {
                            this.$Loading.finish();
                            this.$Message.success('新增成功');
                            // 弹框消失
                            this.userModal = false;
                            // 重新获取角色列表
                            this.getData();
                        }).catch(error => {
                            this.$Loading.error();
                            this.$Message.error(error.message);
                        });
                    } else {
                        this.$Message.error('请填写正确的数据');
                    }
                });
            },
            showAdd () {
                console.log('show add ' + this.userModal);
                this.userModal = true;
            },
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
                    console.log('get user data:' + JSON.stringify(content.map(item => item.username)));
                    this.totalItem = result.totalElements;
                    // this.$Message.success(JSON.stringify(content));
                    this.userData = content;
                }).catch(error => {
                    this.$Message.error(error.message);
                });
            },
            handleDel (val, index) {
                // this.$Message.success('删除了第' + (index + 1) + '行数据');
                console.log('val:' + JSON.stringify(val) + ' index:' + index);
                console.log('remove user:' + JSON.stringify(val[index]));
                this.$Loading.start();
                this.axios({
                    method: 'delete',
                    url: '/api/invoice/user',
                    params: {
                        id: val[index]['id']
                    }
                }).then(resp => {
                    this.$Loading.finish();
                    console.log('删除成功' + JSON.stringify(resp.data));
                    this.$Message.success('删除成功');
                    // 弹框消失
                    this.userModal = false;
                    // 重新获取用户列表
                    this.getData();
                }).catch(error => {
                    this.$Loading.error();
                    this.$Message.error(error.message);
                });
            },
            handleChange (val, index) {
                console.log('change user data:' + JSON.stringify(val[index]));
                this.$Message.success('修改了第' + (index + 1) + '行数据');

                console.log('save role');
                this.$Loading.start();
                this.axios({
                    method: 'put',
                    url: '/api/invoice/user',
                    data: {
                        username: val[index]['username'],
                        email: val[index]['email'],
                        phone: val[index]['phone'],
                        id: val[index]['id']
                    }
                }).then(resp => {
                    this.$Loading.finish();
                    this.$Message.success('保存成功');
                    // 弹框消失
                    this.userModal = false;
                    // 重新获取用户列表
                    this.getData();
                }).catch(error => {
                    this.$Loading.error();
                    this.$Message.error(error.message);
                });
            }
        },
        created () {
            this.getData();
        }
    };
</script>
