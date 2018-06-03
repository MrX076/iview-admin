<style lang="less">
    @import './own-space.less';

    .ivu-modal-footer {
        display: block !important;
    }
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="person"></Icon>
                个人信息
            </p>
            <div>
                <Form
                        ref="userForm"
                        :model="userForm"
                        :label-width="100"
                        label-position="right"
                        :rules="inforValidate">
                    <FormItem label="用户姓名：" prop="username">
                        <div style="display:inline-block;width:300px;">
                            <Input v-model="userForm.username"></Input>
                        </div>
                    </FormItem>
                    <FormItem label="电话：" prop="phone">
                        <div style="display:inline-block;width:300px;">
                            <Input v-model="userForm.phone"></Input>
                        </div>
                    </FormItem>
                    <FormItem label="邮箱：" prop="email">
                        <div style="display:inline-block;width:300px;">
                            <Input v-model="userForm.email"></Input>
                        </div>
                    </FormItem>
                    <!--<FormItem label="角色：">-->
                    <!--<span>{{ userForm.role }}</span>-->
                    <!--</FormItem>-->
                    <FormItem label="登录密码：">
                        <Button type="text" size="small" @click="showEditPassword">修改密码</Button>
                    </FormItem>
                    <div>
                        <Button type="text" style="width: 100px;" @click="cancelEditUserInfor">取消</Button>
                        <Button type="primary" style="width: 100px;" :loading="save_loading" @click="saveEdit">保存
                        </Button>
                    </div>
                </Form>
            </div>
        </Card>
        <Modal v-model="editPasswordModal" :closable='false' :mask-closable=false :width="500">
            <h3 slot="header" style="color:#2D8CF0">修改密码</h3>
            <Form ref="editPasswordForm" :model="editPasswordForm" :label-width="100" label-position="right"
                  :rules="passwordValidate">
                <FormItem label="原密码" prop="oldPass" :error="oldPassError">
                    <Input v-model="editPasswordForm.oldPass" placeholder="请输入现在使用的密码"></Input>
                </FormItem>
                <FormItem label="新密码" prop="newPass">
                    <Input v-model="editPasswordForm.newPass" placeholder="请输入新密码，至少6位字符"></Input>
                </FormItem>
                <FormItem label="确认新密码" prop="rePass">
                    <Input v-model="editPasswordForm.rePass" placeholder="请再次输入新密码"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancelEditPass">取消</Button>
                <Button type="primary" :loading="savePassLoading" @click="saveEditPass">保存</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import Cookies from 'js-cookie';

    export default {
        name: 'ownspace_index',
        data () {
            const validePhone = (rule, value, callback) => {
                var re = /^1[0-9]{10}$/;
                if (!re.test(value)) {
                    callback(new Error('请输入正确格式的手机号'));
                } else {
                    callback();
                }
            };
            const valideRePassword = (rule, value, callback) => {
                if (value !== this.editPasswordForm.newPass) {
                    callback(new Error('两次输入密码不一致'));
                } else {
                    callback();
                }
            };
            return {
                userForm: {
                    username: '',
                    phone: '',
                    email: ''
                },
                uid: '', // 登录用户的userId
                securityCode: '', // 验证码
                save_loading: false,
                editPasswordModal: false, // 修改密码模态框显示
                savePassLoading: false,
                oldPassError: '',
                inforValidate: {
                    username: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                        {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, message: '请输入手机号码'},
                        {validator: validePhone}
                    ]
                },
                editPasswordForm: {
                    oldPass: '',
                    newPass: '',
                    rePass: ''
                },
                passwordValidate: {
                    oldPass: [
                        {required: true, message: '请输入原密码', trigger: 'blur'}
                    ],
                    newPass: [
                        {required: true, message: '请输入新密码', trigger: 'blur'},
                        {min: 6, message: '请至少输入6个字符', trigger: 'blur'},
                        {max: 32, message: '最多输入32个字符', trigger: 'blur'}
                    ],
                    rePass: [
                        {required: true, message: '请再次输入新密码', trigger: 'blur'},
                        {validator: valideRePassword, trigger: 'blur'}
                    ]
                },
                inputCodeVisible: false, // 显示填写验证码box
                gettingIdentifyCodeBtnContent: '获取验证码' // “获取验证码”按钮的文字
            };
        },
        methods: {
            showEditPassword () {
                this.editPasswordModal = true;
            },
            cancelEditUserInfor () {
                this.$store.commit('removeTag', 'ownspace_index');
                localStorage.pageOpenedList = JSON.stringify(this.$store.state.app.pageOpenedList);
                let lastPageName = '';
                if (this.$store.state.app.pageOpenedList.length > 1) {
                    lastPageName = this.$store.state.app.pageOpenedList[1].name;
                } else {
                    lastPageName = this.$store.state.app.pageOpenedList[0].name;
                }
                this.$router.push({
                    name: lastPageName
                });
            },
            saveEdit () {
                this.$refs['userForm'].validate((valid) => {
                    if (valid) {
                        this.axios({
                            method: 'put',
                            url: '/api/invoice/user',
                            data: {
                                email: this.userForm.email,
                                phone: this.userForm.phone,
                                username: this.userForm.username
                            }
                        }).then(resp => {
                            this.$Message.success('修改成功');
                            this.init();
                        }).catch(error => {
                            this.$Message.error(error.message);
                            this.init();
                        });
                    }
                });
            },
            cancelEditPass () {
                this.editPasswordModal = false;
            },
            saveEditPass () {
                this.$refs['editPasswordForm'].validate((valid) => {
                    if (valid) {
                        this.savePassLoading = true;
                        this.axios({
                            method: 'put',
                            url: '/api/invoice/user/resetPasswd',
                            params: {
                                old: this.editPasswordForm.oldPass,
                                last: this.editPasswordForm.newPass
                            }
                        }).then(resp => {
                            console.log(resp.data);
                            if (resp.data.success) {
                                this.$Message.success('修改成功');
                                this.editPasswordModal = false;
                            } else {
                                this.$Message.error(resp.data.result);
                                this.editPasswordForm.oldPass = '';
                            }
                            this.savePassLoading = false;
                        }).catch(error => {
                            this.$Message.error(error.message);
                            this.init();
                        });
                    }
                });
            },
            init () {
                this.axios({
                    method: 'get',
                    url: '/api/invoice/user',
                    data: this.selected
                }).then(resp => {
                    let message = resp.data.result;
                    this.userForm.username = message.username;
                    this.userForm.phone = message.phone;
                    this.userForm.email = message.email;
                }).catch(error => {
                    this.$Message.error(error.message);
                    this.init();
                });
            }
        },
        mounted () {
            this.init();
        }
    };
</script>
