<style lang="less">
    @import '../../styles/common.less';
    @import 'role.less';

    .ivu-card-body {
        min-height: 550px;
    }

    .ivu-modal-footer {
        display: none;
    }
</style>

<template>
    <div>
        <Row>
            <Modal v-model="roleModel" width="360px">
                <p slot="header" style="color:#0055aa;text-align:center">
                    <Icon type="information-circled"></Icon>
                    <span>设置角色</span>
                </p>
                <div style="text-align:center">
                    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80"
                          label-position="left">
                        <FormItem label="角色名称" prop="name">
                            <Input v-model="formValidate.name" placeholder="输入角色名称"></Input>
                        </FormItem>
                        <FormItem label="描述" prop="remark">
                            <Input v-model="formValidate.remark" placeholder="输入角色描述"></Input>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" @click="addRole('formValidate')" v-show="leftShow">新增</Button>
                            <Button type="primary" @click="saveRole('formValidate')" v-show="middleShow">保存</Button>
                            <Button type="error" @click="removeRole('formValidate')" style="margin-left: 8px"
                                    v-show="rightShow">删除此角色
                            </Button>
                        </FormItem>
                    </Form>
                </div>
            </Modal>
            <Col span="12">
                <Card>
                    <p slot="title">
                        <Icon type="ios-paper-outline"></Icon>
                        角色列表
                    </p>
                    <p slot="extra">
                        <Button type="primary" size="middle" @click="showAdd()">新增</Button>
                    </p>
                    <div style="height: 520px;">
                        <ul id="roleList" class="iview-admin-draggable-list">
                            <li v-for="(item, index) in roles" :key="index" class="notwrap"
                                :data-index="index" @click="getRoleUser(item)" @dblclick="showEdit(item)">
                                {{ item.name }}-{{item.remark}}
                            </li>
                        </ul>
                    </div>
                </Card>
            </Col>
            <Col span="12" class="padding-left-10">
                <!--<Row>
                    <Col span="12">
                        <Card dis-hover>
                            <p slot="title">
                                <Icon type="ios-list-outline"></Icon>
                                已拥有用户
                            </p>
                            <p slot="extra">
                                <Button type="primary" size="small" @click="changeUser()">保存</Button>
                            </p>
                            <div style="height: 520px;">
                                <ul id="ownerList" class="iview-admin-draggable-list">
                                    <li v-for="(item, index) in ownerArray" :key="index" class="notwrap"
                                        :data-index="index">
                                        {{ item.username }}
                                    </li>
                                </ul>
                            </div>
                        </Card>
                    </Col>
                    <Col span="12">
                        <Card dis-hover>
                            <p slot="title">
                                <Icon type="ios-list"></Icon>
                                未拥有用户
                            </p>
                            <div style="height: 520px;">
                                <ul id="leftList" class="iview-admin-draggable-list">
                                    &lt;!&ndash;<li v-for="(item, index) in leftArray" :key="index" class="notwrap todolist-item"&ndash;&gt;
                                    <li v-for="(item, index) in leftArray" :key="index" class="notwrap"
                                        :data-index="index">
                                        {{ item.username }}
                                    </li>
                                </ul>
                            </div>
                        </Card>
                    </Col>
                </Row>-->
                <Card>
                    <p slot="title">
                        <Icon type="ios-paper-outline"></Icon>
                        用户
                    </p>
                    <p slot="extra">
                        <Button type="primary" size="middle" @click="changeUser()">保存</Button>
                    </p>
                    <div style="text-align:center">
                        <Transfer
                                :data="allArray"
                                :target-keys="ownerArray"
                                :list-style="{width: '250px', height: '500px'}"
                                :titles="['未拥有用户','已拥有用户']"
                                :operations="['移除','增加']"
                                @on-change="userChange"></Transfer>
                    </div>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
    export default {
        name: 'draggable-list',
        data () {
            return {
                leftShow: false,
                middleShow: false,
                rightShow: false,
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
                curRole: 0,
                roleModel: false,
                roles: [],
                allArray: [],
                ownerArray: []
            };
        },
        created () {
            this.getRoleList();
            this.getAllUser();
        },
        // mounted () {
        //     document.body.ondrop = function (event) {
        //         event.preventDefault();
        //         event.stopPropagation();
        //     };
        //     let vm = this;
        //
        //     let leftList = document.getElementById('leftList');
        //     this.leftSortable = Sortable.create(leftList, {
        //         group: {
        //             name: 'list',
        //             pull: true
        //         },
        //         animation: 120,
        //         ghostClass: 'placeholder-style',
        //         fallbackClass: 'iview-admin-cloned-item',
        //         onRemove (event) {
        //             // vm.ownerArray.splice(event.newIndex, 0, vm.leftArray[event.item.getAttribute('data-index')]);
        //         }
        //     });
        //     let ownerList = document.getElementById('ownerList');
        //     this.leftSortable = Sortable.create(ownerList, {
        //         group: {
        //             name: 'list',
        //             pull: true
        //         },
        //         sort: false,
        //         filter: '.iview-admin-draggable-delete',
        //         animation: 120,
        //         fallbackClass: 'iview-admin-cloned-item',
        //         onRemove (event) {
        //             vm.ownerArray.splice(event.oldIndex, 1);
        //         }
        //     });
        // },
        methods: {

            userChange (newTargetKeys) {
                // menuRole=newTargetKeys;
                this.ownerArray = newTargetKeys;
                console.log(newTargetKeys);
            },
            // 获取角色拥有的用户
            getRoleUser (data) {
                this.ownerArray = [];
                this.curRole = data.id;
                this.axios({
                    method: 'get',
                    url: '/api/invoice/role/users?roleId=' + data.id
                }).then(resp => {
                    let reqData = resp.data.result;
                    this.ownerArray = reqData.map(item => item.id);
                    console.log('role-mgt get role user:' + JSON.stringify(this.ownerArray));
                }).catch(error => {
                    this.$Message.error(error.message);
                    this.getAllRole();
                });
            },
            // // 计算角色没有的用户
            // calLeft() {
            //     document.getElementById('leftList').innerHTML = null;
            //     this.leftArray.splice(0, this.leftArray.length);
            //     let temArr = [];
            //     for (let item of this.allArray) {
            //         let contain = false;
            //         for (let user of this.ownerArray) {
            //             if (item.id === user.id) {
            //                 contain = true;
            //                 break;
            //             }
            //         }
            //         if (!contain) {
            //             temArr.push(item);
            //         }
            //     }
            //     this.leftArray = temArr;
            //     console.log(this.leftArray.length);
            // },
            // 弹出编辑角色
            showEdit (data) {
                this.middleShow = true;
                this.rightShow = true;
                this.leftShow = false;
                console.log('edit :' + JSON.stringify(data));
                this.formValidate.name = data.name;
                this.formValidate.remark = data.remark;
                this.curRole = data.id;
                this.roleModel = true;
            },
            showAdd () {
                this.middleShow = false;
                this.rightShow = false;
                this.leftShow = true;
                this.roleModel = true;
            },
            addRole () {
                console.log('add role');
                this.$Loading.start();
                this.axios({
                    method: 'post',
                    url: '/api/invoice/role',
                    data: {
                        name: this.formValidate.name,
                        remark: this.formValidate.remark
                    }
                }).then(resp => {
                    this.$Loading.finish();
                    this.$Message.success('新增成功');
                    // 弹框消失
                    this.roleModel = false;
                    // 重新获取角色列表
                    this.getRoleList();
                }).catch(error => {
                    this.$Loading.error();
                    this.$Message.error(error.message);
                });
            },
            removeRole () {
                console.log('remove role');
                this.$Loading.start();
                this.axios({
                    method: 'delete',
                    url: '/api/invoice/role',
                    params: {
                        id: this.curRole
                    }
                }).then(resp => {
                    this.$Loading.finish();
                    this.$Message.success('删除成功');
                    // 弹框消失
                    this.roleModel = false;
                    // 重新获取角色列表
                    this.getRoleList();
                }).catch(error => {
                    this.$Loading.error();
                    this.$Message.error(error.message);
                });
            },
            saveRole () {
                console.log('save role');
                this.$Loading.start();
                this.axios({
                    method: 'put',
                    url: '/api/invoice/role',
                    data: {
                        id: this.curRole,
                        name: this.formValidate.name,
                        remark: this.formValidate.remark
                    }
                }).then(resp => {
                    this.$Loading.finish();
                    this.$Message.success('保存成功');
                    // 弹框消失
                    this.roleModel = false;
                    // 重新获取角色列表
                    this.getRoleList();
                }).catch(error => {
                    this.$Loading.error();
                    this.$Message.error(error.message);
                });
            },
            // 改变角色用户
            changeUser () {
                this.$Loading.start();
                this.axios({
                    method: 'put',
                    url: '/api/invoice/role/users',
                    params: {
                        roleId: this.curRole
                    },
                    data: this.ownerArray
                }).then(resp => {
                    this.$Loading.finish();
                    this.$Message.success('保存成功');
                }).catch(error => {
                    this.$Loading.error();
                    this.$Message.error(error.message);
                });
            },
            // 获取所有角色列表
            getRoleList () {
                this.axios({
                    method: 'get',
                    url: '/api/invoice/role/all'
                }).then(resp => {
                    let reqData = resp.data.result;
                    console.log('role-mgt get all role:' + JSON.stringify(reqData.map(item => item.name)));
                    this.roles = reqData;
                }).catch(error => {
                    this.$Message.error(error.message);
                    this.getRoleList();
                });
            },
            // 获取所有用户列表
            getAllUser () {
                this.axios({
                    method: 'get',
                    url: '/api/invoice/user/all'
                }).then(resp => {
                    let reqData = resp.data.result;
                    for (let item of reqData) {
                        item['key'] = item['id'];
                        item['label'] = item['username'];
                        item['description'] = item['email'];
                    }
                    console.log('role-mgt get all user:' + JSON.stringify(reqData.map(item => item.username)));
                    this.allArray = reqData;
                }).catch(error => {
                    this.$Message.error(error.message);
                    this.getAllUser();
                });
            }
        }
    };
</script>
