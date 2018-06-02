// table.vue
<template>
    <Card>
        <p slot="title">审核报销单</p>
        <p slot="extra">
            <Button type="primary" @click="success()">通过</Button>
            <Button type="error" @click="fail()">打回</Button>
        </p>
        <div>
            <Table :columns="verifyColumn" :data="receiptData" @on-selection-change="selectItem"></Table>
        </div>
    </Card>
</template>
<script>
    import expandRow from './table-expand.vue';

    export default {
        components: {expandRow},
        data () {
            return {
                verifyColumn: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        type: 'expand',
                        width: 50,
                        render: (h, params) => {
                            return h(expandRow, {
                                props: {
                                    row: params.row.invoices
                                }
                            });
                        }
                    },
                    {
                        title: '报销单名称',
                        key: 'name'
                    },
                    {
                        title: '报销单金额',
                        key: 'amount'
                    },
                    {
                        title: '报销人',
                        key: 'userName'
                    },
                    {
                        title: '报销时间',
                        key: 'updateDate'
                    },
                    {
                        title: '备注',
                        key: 'remark'
                    }
                ],
                receiptData: [],
                selected: []
            };
        },
        created () {
            this.getAllData();
        },
        methods: {
            getAllData () {
                this.axios({
                    method: 'get',
                    url: '/api/invoice/receipt/all'
                }).then(resp => {
                    let reqData = resp.data.result;
                    for (let receipt of reqData) {
                        let amount = 0;
                        for (let invoice of receipt['invoices']) {
                            amount += invoice['amount'];
                        }
                        receipt['amount'] = amount;
                    }
                    console.log('receipt-verify get all receipt:');
                    console.log(reqData);
                    this.receiptData = reqData;
                }).catch(error => {
                    this.$Message.error(error.message);
                    this.getAllReceipt();
                });
            },
            selectItem (selected) {
                this.selected = selected.map(item => item['id']);
            },
            success () {
                this.axios({
                    method: 'put',
                    url: '/api/invoice/receipt/success',
                    data: this.selected
                }).then(resp => {
                    this.$Message.success('操作成功');
                    this.getAllData();
                }).catch(error => {
                    this.$Message.error(error.message);
                    this.getAllReceipt();
                });
            },
            fail () {
                this.axios({
                    method: 'put',
                    url: '/api/invoice/receipt/fail',
                    data: this.selected
                }).then(resp => {
                    this.$Message.success('操作成功');
                    this.getAllData();
                }).catch(error => {
                    this.$Message.error(error.message);
                    this.getAllReceipt();
                });
            }
        }
    };
</script>