<style lang="less">
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
        <Row class="margin-top-10">
            <Col span="12">
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
            <Col span="12">
                <Card>
                    <p slot="title">
                        <Icon type="android-remove"></Icon>
                        当前菜单角色
                    </p>
                    <div class="edittable-table-height-con">
                        <Tree :data="treeData" :render="renderContent"></Tree>
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
                            this.getRoles(data);
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
            getRoles (data) {},
            getData () {
                this.axios({
                    method: 'get',
                    url: '/api/invoice//menu/menuTree'
                }).then(resp => {
                    let reqData = resp.data.result;
                    console.log('treeData:' + this.treeData[0].children);
                    this.treeData[0].children = reqData;
                }).catch(error => {
                    this.$Message.error(error.message);
                });
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
        }
    };
</script>
