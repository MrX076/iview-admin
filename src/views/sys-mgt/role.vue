<style lang="less">
    @import '../../styles/common.less';
    @import 'role.less';

    .ivu-card-body {
        min-height: 550px;
    }
</style>

<template>
    <div>
        <Row>
            <Col span="8">
                <Card>
                    <p slot="title">
                        <Icon type="ios-paper-outline"></Icon>
                        角色列表
                    </p>
                    <div style="height: 520px;">
                        <ul id="roleList" class="iview-admin-draggable-list">
                            <li v-for="(item, index) in roles" :key="index" class="notwrap"
                                :data-index="index" @click="getRoleUser(item)" @dblclick="editRole(item)">
                                {{ item.name }}-{{item.remark}}
                            </li>
                        </ul>
                    </div>
                </Card>
            </Col>
            <Col span="16" class="padding-left-10">
                <Row>
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
                                <ul id="doList" class="iview-admin-draggable-list">
                                    <li v-for="(item, index) in ownerArray" :key="index" class="notwrap"
                                        :data-index="index">
                                        {{ item.username }}
                                    </li>
                                </ul>
                            </div>
                        </Card>
                        <!--<Card dis-hover>
                            <p slot="title">
                                <Icon type="ios-list-outline"></Icon>
                                本周欲完成任务清单(拖拽到右侧删除)
                            </p>
                            <div style="height: 360px;">
                                <ul id="doList" class="iview-admin-draggable-list"></ul>
                            </div>
                        </Card>-->
                    </Col>
                    <Col span="12">
                        <!--<Card dis-hover>
                            <p slot="title">
                                <Icon type="ios-list"></Icon>
                                未拥有用户
                            </p>
                            <div style="height: 520px;">
                                <ul id="leftUser" class="iview-admin-draggable-list">
                                    <li v-for="(item, index) in leftArray" :key="index" class="notwrap todolist-item"
                                        :data-index="index">
                                        {{ item.username }}
                                    </li>
                                </ul>
                            </div>
                        </Card>-->
                        <Card dis-hover>
                            <p slot="title">
                                <Icon type="ios-list"></Icon>
                                未拥有用户
                            </p>
                            <div style="height: 520px;">
                                <ul id="todoList" class="iview-admin-draggable-list">
                                    <!--<li v-for="(item, index) in leftArray" :key="index" class="notwrap todolist-item"-->
                                    <li v-for="(item, index) in leftArray" :key="index" class="notwrap"
                                        :data-index="index">
                                        {{ item.username }}
                                    </li>
                                </ul>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Col>
        </Row>
    </div>
</template>

<script>
    import Sortable from 'sortablejs';

    export default {
        name: 'draggable-list',
        data () {
            return {
                leftSortable: null,
                ownerSortable: null,
                todoArray: [
                    {
                        content: '完成iview-admin基本开发'
                    },
                    {
                        content: '对iview-admin进行性能优化'
                    },
                    {
                        content: '对iview-admin的细节进行优化'
                    },
                    {
                        content: '完成iview-admin开发'
                    },
                    {
                        content: '解决发现的bug'
                    },
                    {
                        content: '添加更多组件'
                    },
                    {
                        content: '封装更多图表'
                    },
                    {
                        content: '增加更多人性化功能'
                    }
                ],
                curRole: 0,
                roles: [],
                allArray: [],
                leftArray: [
                    {
                        username: '完成iview-admin基本开发'
                    },
                    {
                        username: '对iview-admin进行性能优化'
                    },
                    {
                        username: '对iview-admin的细节进行优化'
                    },
                    {
                        username: '完成iview-admin开发'
                    },
                    {
                        username: '解决发现的bug'
                    },
                    {
                        username: '添加更多组件'
                    }
                ],
                ownerArray: [
                    {
                        username: '封装更多图表'
                    },
                    {
                        username: '增加更多人性化功能'
                    }
                ]
            };
        },
        created () {
            this.getRoleList();
            this.getAllUser();
        },
        mounted () {
            document.body.ondrop = function (event) {
                event.preventDefault();
                event.stopPropagation();
            };
            let vm = this;

            let todoList = document.getElementById('todoList');
            this.leftSortable = Sortable.create(todoList, {
                group: {
                    name: 'list',
                    pull: true
                },
                animation: 120,
                ghostClass: 'placeholder-style',
                fallbackClass: 'iview-admin-cloned-item',
                onRemove (event) {
                    // vm.ownerArray.splice(event.newIndex, 0, vm.leftArray[event.item.getAttribute('data-index')]);
                }
            });
            let doList = document.getElementById('doList');
            this.leftSortable = Sortable.create(doList, {
                group: {
                    name: 'list',
                    pull: true
                },
                sort: false,
                filter: '.iview-admin-draggable-delete',
                animation: 120,
                fallbackClass: 'iview-admin-cloned-item',
                onRemove (event) {
                    vm.ownerArray.splice(event.oldIndex, 1);
                }
            });
        },
        methods: {
            // 获取角色拥有的用户
            getRoleUser (data) {
                this.ownerArray = [];
                this.curRole = data.id;
                this.axios({
                    method: 'get',
                    url: '/api/invoice/role/users?roleId=' + data.id
                }).then(resp => {
                    document.getElementById('doList').innerHTML = null;

                    let reqData = resp.data.result;
                    console.log('rolemgt get role user:' + JSON.stringify(reqData.map(item => item.username)));
                    this.ownerArray = reqData;
                    this.calLeft();
                }).catch(error => {
                    this.$Message.error(error.message);
                    this.getAllRole();
                });
            },
            // 计算角色没有的用户
            calLeft () {
                this.leftArray.splice(0, this.leftArray.length);
                for (let item of this.allArray) {
                    let contain = false;
                    for (let user of this.ownerArray) {
                        if (item.id === user.id) {
                            contain = true;
                            break;
                        }
                    }
                    if (!contain) {
                        this.leftArray.push(item);
                    }
                }
            },
            // 编辑角色
            editRole (data) {
                console.log('edit :' + JSON.stringify(data));
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
                    data: this.ownerArray.map(item => item.id)
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
                    console.log('rolemgt get all role:' + JSON.stringify(reqData.map(item => item.name)));
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
                    url: '/api/invoice//user/all'
                }).then(resp => {
                    let reqData = resp.data.result;
                    console.log('role-mgt get all role:' + JSON.stringify(reqData.map(item => item.username)));
                    this.allArray = reqData;
                }).catch(error => {
                    this.$Message.error(error.message);
                    this.getAllUser();
                });
            }
        }
    };
</script>
