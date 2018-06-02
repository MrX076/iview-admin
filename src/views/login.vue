<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="title">
            <h1>发票管理系统</h1>
        </div>
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="请输入用户名">
                            <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                            <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                    <p class="login-tip">输入任意用户名和密码即可</p>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
    import Cookies from 'js-cookie';
    import {appRouter} from '../router/router';
    import util from '@/libs/util.js';

    export default {
        data () {
            return {
                form: {
                    userName: 'root',
                    password: ''
                },
                rules: {
                    userName: [
                        {required: true, message: '账号不能为空', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '密码不能为空', trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            handleSubmit () {
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        // fetch('api/auth/oauth/token').then()
                        this.$Loading.start();
                        this.axios({
                            method: 'post',
                            url: '/api/auth/oauth/token',
                            headers: {
                                'Authorization': 'Basic YWNtZTphY21lc2VjcmV0',
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            data: 'grant_type=password&username=' + this.form.userName + '&password=' + this.form.password
                            // {
                            //     grant_type: 'password',
                            //     username: this.form.userName,
                            //     password: this.form.password
                            // }
                        }).then(resp => {
                            this.$Loading.finish();
                            let token = resp.data['access_token'];
                            // store把token存到本地 issue：store里面的token会丢失
                            // this.$store.commit(types.LOGIN, token);
                            // console.log('store token ');
                            // console.log(this.$store);
                            // this.$Message.success('login success：' + this.$store.state.user.token);

                            // cookie 存token
                            Cookies.set('token', token);
                            // 使用token获取用户信息
                            this.axios({
                                method: 'get',
                                url: '/api/auth/oauth/check_token?token=' + token,
                                headers: {
                                    'Authorization': 'Basic YWNtZTphY21lc2VjcmV0'// 需要http basic验证
                                }
                            }).then(tokenResp => {
                                Cookies.set('user', tokenResp.data);
                                // 跳转到主页面
                                this.$store.commit('setAvator', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg');
                                this.$router.push({
                                    name: 'home_index'
                                });
                                this.$Message.success('check user info success：' + JSON.stringify(tokenResp.data));

                                // 获取菜单列表
                                this.axios({
                                    method: 'get',
                                    url: '/api/invoice/menu/menuRole'
                                }).then(menuResp => {
                                    // 刷新router
                                    let data = menuResp.data.result;
                                    console.log('before menu set:');
                                    console.log(appRouter);
                                    console.log('data:');
                                    console.log(data);
                                    util.setRouterProps(appRouter, data);
                                    // this.$store.commit('updateMenulist');
                                    console.log('after menu set:');
                                    console.log(appRouter);

                                    // 跳转主菜单
                                    this.$router.push({
                                        name: 'home_index'
                                    });
                                }).catch(error => {
                                    console.log('获取菜单列表失败');
                                    console.log(error);
                                    this.$Message.error('获取菜单列表失败:' + error.message);
                                });
                            }).catch(error => {
                                this.$Message.error(error.message);
                            });
                        }).catch(error => {
                            this.$Message.error(error.message);
                            this.$Loading.error();
                        });

                        // Cookies.set('user', this.form.userName);
                        // Cookies.set('password', this.form.password);
                        // this.$store.commit('setAvator', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg');
                        // if (this.form.userName === 'iview_admin') {
                        //     Cookies.set('access', 0);
                        // } else {
                        //     Cookies.set('access', 1);
                        // }
                        // this.$router.push({
                        //     name: 'home_index'
                        // });
                    }
                });
            }
        }
    };
</script>

<style>

</style>
