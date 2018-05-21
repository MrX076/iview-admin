<style lang="less" xmlns="http://www.w3.org/1999/html">
    @import '../../styles/common.less';
    @import './components/table.less';

    .ivu-tree-children {
        font-size: 24px !important;
    }

    .ivu-card-body {
        min-height: 550px;
    }
</style>

<template>
    <div>
        <Card>

            <Modal v-model="roleModel" width="720">
                <p slot="header" style="color:#0055aa;text-align:center">
                    <Icon type="information-circled"></Icon>
                    <span>设置角色</span>
                </p>
                <div style="text-align:center">
                    <Transfer
                            :data="allRole"
                            :target-keys="menuRole"
                            :list-style="{width: '250px', height: '300px'}"
                            :render-format="render3"
                            :titles="['未拥有角色','已拥有角色']"
                            :operations="['移除','增加']"
                            @on-change="roleChange"></Transfer>
                </div>
                <div slot="footer">
                    <Button type="info" size="large" long :loading="modal_loading" @click="del">确定</Button>
                </div>
            </Modal>
            <Row class="margin-top-10">
                <Col span="24">
                    <Card>
                        <p slot="title">
                            <Icon type="android-remove"></Icon>
                            菜单管理
                        </p>
                        <div class="edittable-table-height-con">
                            <Tree :data="treeData" :render="renderContent"></Tree>
                        </div>
                    </Card>
                </Col>
                <!--<Col span="12" class="padding-left-10">
                    <Card dis-hover>
                        <p slot="title">
                            <Icon type="ios-list"></Icon>
                            菜单角色
                        </p>
                        <div style="height: 360px;">
                            <ul id="todoList" class="iview-admin-draggable-list">
                                <li v-for="(item, index) in todoArray" :key="index"
                                    class="notwrap todolist-item" :data-index="index">
                                    {{ item.content }}
                                </li>
                            </ul>
                        </div>
                    </Card>
                </Col>-->
            </Row>
        </Card>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                roleModel: false,
                allRole: [
                    {
                        label: 'Content all',
                        description: 'The desc of content  all'
                    }
                ],
                menuRole: [
                    {
                        label: 'Content menu',
                        description: 'The desc of content  menu'
                    }
                ],
                menuId: 0,
                treeData: [
                    {
                        title: '菜单目录',
                        expand: true,
                        render: (h, {root, node, data}) => {
                            return h('span', {
                                style: {
                                    display: 'inline-block',
                                    width: '100%'
                                }
                            }, [
                                h('span', [
                                    h('Icon', {
                                        props: {
                                            type: 'ios-folder-outline'
                                        },
                                        style: {
                                            marginRight: '8px'
                                        }
                                    }),
                                    h('span', data.title)
                                ])
                            ]);
                        },
                        children: [
                            {
                                title: 'child 1-1',
                                remark: 'child 1-1 remark',
                                expand: true,
                                children: [
                                    {
                                        title: 'leaf 1-1-1',
                                        expand: true
                                    },
                                    {
                                        title: 'leaf 1-1-2',
                                        expand: true
                                    }
                                ]
                            },
                            {
                                title: 'child 1-2',
                                expand: true,
                                children: [
                                    {
                                        title: 'leaf 1-2-1',
                                        expand: true
                                    },
                                    {
                                        title: 'leaf 1-2-1',
                                        expand: true
                                    }
                                ]
                            }
                        ]
                    }
                ],
                buttonProps: {
                    type: 'ghost',
                    size: 'small'
                }
            };
        },
        methods: {
            renderContent (h, {root, node, data}) {
                return h('span', {
                    style: {
                        display: 'inline-block',
                        width: '100%'
                    },
                    on: {
                        click: () => {
                            this.getMenuRoles(data);
                        }
                    }
                }, [
                    h('span', [
                        h('Icon', {
                            props: {
                                type: 'ios-paper-outline'
                            },
                            style: {
                                marginRight: '8px'
                            }
                        }),
                        h('span', data.title),
                        h('span', {
                            style: {
                                marginLeft: '16px',
                                fontSize: '16px',
                                color: 'gray'
                            }
                        }, data.remark)
                    ])
                ]);
            },
            getMenuRoles (data) {
                this.roleModel = true;
                this.axios({
                    method: 'get',
                    url: '/api/invoice/menu/roles?menuId=' + data.id
                }).then(resp => {
                    let reqData = resp.data.result;
                    for (let item of reqData) {
                        item['key'] = item['id'];
                        item['label'] = item['name'];
                        item['description'] = item['remark'];
                    }
                    console.log('menuRole:' + JSON.stringify(reqData));
                    this.menuRole=reqData;
                }).catch(error => {
                    this.$Message.error(error.message);
                });
            },
            getAllRole () {
                this.axios({
                    method: 'get',
                    url: '/api/invoice/role/all'
                }).then(resp => {
                    let reqData = resp.data.result;
                    console.log('treeData:' + this.treeData[0].children);
                    // this.treeData[0].children = reqData;
                }).catch(error => {
                    this.$Message.error(error.message);
                });
            },
            getData () {
                this.axios({
                    method: 'get',
                    url: '/api/invoice/menu/menuTree'
                }).then(resp => {
                    let reqData = resp.data.result;
                    console.log('treeData:' + this.treeData[0].children);
                    this.treeData[0].children = reqData;
                }).catch(error => {
                    this.$Message.error(error.message);
                });
            },
            roleChange (newTargetKeys) {
                // menuRole=newTargetKeys;
                console.log(newTargetKeys);
            },
            append (data) {
                const children = data.children || [];
                children.push({
                    title: 'appended node',
                    expand: true
                });
                this.$set(data, 'children', children);
            },
            remove (root, node, data) {
                const parentKey = root.find(el => el === node).parent;
                const parent = root.find(el => el.nodeKey === parentKey).node;
                const index = parent.children.indexOf(data);
                parent.children.splice(index, 1);
            }
        },
    
        created () {
            this.getData();
            this.getAllRole();
        }
    };
</script>
