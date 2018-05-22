<style lang="less">
    @import './editable-table.less';
    @import '../invoice.less';
</style>

<template>
    <div>
        <!-- //  @on-current-change="recordCue()" -->
        <Table highlight-row :ref="refs" :columns="columnsList" :data="thisTableData" border disabled-hover  ></Table>
    </div>
</template>


<script>
import tableData from './table_data.js';
import axios from 'axios';
const editButton = (vm, h, currentRow, index) => {
    return h('Button', {
        props: {
            type: currentRow.editting ? 'success' : 'primary',
            loading: currentRow.saving
        },
        style: {
            margin: '0 5px',
        },
        on: {
            'click': () => {
                if (!currentRow.editting) {
                    if (currentRow.edittingCell) {
                        for (let name in currentRow.edittingCell) {
                            currentRow.edittingCell[name] = false;
                            vm.edittingStore[index].edittingCell[name] = false;
                        }
                    }
                    vm.edittingStore[index].editting = true;
                    vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                   
                } else {
                    vm.edittingStore[index].saving = true;
                    vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                    let edittingRow = vm.edittingStore[index];
                    edittingRow.editting = false;
                    edittingRow.saving = false;
                    vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                    vm.$emit('input', vm.handleBackdata(vm.thisTableData));
                    vm.$emit('on-change', vm.handleBackdata(vm.thisTableData), index);
                    
                    //修改数据
                //    console.log(vm.thisTableData[index]);
                     axios.put('api/invoice/invoice' ,vm.thisTableData[index])
                    .then(res => {
                        this.$Message.success(res.data);
                    })
                     
                }
            }
        }
    }, currentRow.editting ? '保存' : '编辑');
};
const deleteButton = (vm, h, currentRow, index) => {
    return h('Poptip', {
        props: {
            confirm: true,
            title: '您确定要删除吗?',
            transfer: true
        },
        on: {
            'on-ok': () => {
                //删除此行
                console.log(vm.thisTableData[index].id);
                let id = vm.thisTableData[index].id;
               
                vm.thisTableData.splice(index, 1);
                //删除数据库数据
                axios({
                    method: 'delete',
                    url: 'api/invoice/invoice?id='+id,                   
                }).then(resp =>{
                    console.log(resp);
                })
                //删除方法数据二
                // let id = vm.thisTableData[index].id;
                // let url ='api/invoice/invoice?id='+id;
                // let params = vm.thisTableData[index];
                //  axios.delete(url,params)
                //     .then(res => {
                //         resolve(res.data)
                //     },err => {
                //          console.log(err)
                //     }).catch(err => {
                //          console.log(err)
                //     })
                vm.$emit('input', vm.handleBackdata(vm.thisTableData));
                vm.$emit('on-delete', vm.handleBackdata(vm.thisTableData), index);
            }
        }
    }, [
        h('Button', {
            style: {
                margin: '0 5px'
            },
            props: {
                type: 'error',
                placement: 'top'
            }
        }, '删除')
    ]);
};
const detailButton = (vm, h, currentRow, index) => {
 
  return  [
        h('Button', {
            style: {
                margin: '0 5px',
                
            },
            props: {
                type: 'info',
                placement: 'top'
            },
            on : {
                'click': (event)=>{            
                    vm.thisTableData
                    // console.log(vm.thisTableData);
                    var div=document.createElement("div");
                    var html = `
                    <h1>发票详情展示</h1>
                    <div class="content">
                    <span> 发票id：${vm.thisTableData[index].id}</span>
                    <span>购买方名称：${vm.thisTableData[index].name}</span>
                    <span>够买方银行账户：${vm.thisTableData[index].account}</span>
                    <span>地址：${vm.thisTableData[index].address}</span>
                    <span>总金额：${vm.thisTableData[index].amount}</span>
                    <span>校验码：${vm.thisTableData[index].checkCode}</span>
                    <span>发票代码：${vm.thisTableData[index].invoiceCode}</span>
                    <span>发票号：${vm.thisTableData[index].invoiceNo}</span>
                    <span>发票日期：${vm.thisTableData[index].invoiceData}</span>
                    <span>卖方名称：${vm.thisTableData[index].sellerName}</span>
                    <span>卖方纳税识别号：${vm.thisTableData[index].sellerCode}</span>
                    <span>taxpyerCode：${vm.thisTableData[index].taxpayerCode}</span>
                    <span>备注：${vm.thisTableData[index].remark}</span>
                     </div>
                
                    `
                    div.innerHTML = html;
                    div.id="detail";
                    // this.closedetail();
                    //插入到最前面
                    document.body.insertBefore(div, document.body.firstElementChild);
                    console.log(index)
                    let x=(index+1)*2-2;
                    let y=(index+1)*2-1;
                   
                    document.getElementsByClassName("ivu-btn-info")[x].setAttribute("style","width:0px;padding:0px;border:none;margin:0px;");
                    // document.getElementsByClassName("ivu-btn-info")[x].style.padding="0px";
                    // document.getElementsByClassName("ivu-btn-info")[x].style.border="none";
                    document.getElementsByClassName("ivu-btn-info")[y].setAttribute("style","width:120px;padding:0 16px;border:1px solid ;margin:0px 5px;")
   


                }
                
            },
          
        }, '详情'),
                h('Button', {
            style: {
                margin: '0 5px',               
            },
            
            props: {
                type: 'info',
                placement: 'top'
            },
            on : {
                'click' : (event)=>{
                    var  detail = document.getElementById('detail');
                    // console.log(detail);
                    console.log( document.getElementsByClassName("ivu-btn-info"));
                    let x=(index+1)*2-2;
                    let y=(index+1)*2-1;
                    document.getElementsByClassName("ivu-btn-info")[y].setAttribute("style","width:0px;padding:0px;border:none;margin:0px 5px;");
                    document.getElementsByClassName("ivu-btn-info")[x].setAttribute("style","width:120px;padding:0 16px;border:1px solid ;margin:0px 5px;")
                    detail.remove();  
                    vm.$emit('remove', vm.handleBackdata(vm.thisTableData));                 
                }
            }
        }, '关闭'),
    ]
};
const incellEditBtn = (vm, h, param) => {
    if (vm.hoverShow) {
        return h('div', {
            'class': {
                'show-edit-btn': vm.hoverShow
            }
        }, [
            h('Button', {
                props: {
                    type: 'text',
                    icon: 'edit'
                },
                on: {
                    click: (event) => {
                        vm.edittingStore[param.index].edittingCell[param.column.key] = true;
                        vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                     
                    }
                }
            })
        ]);
    } else {
        return h('Button', {
            props: {
                type: 'text',
                icon: 'edit'
            },
            on: {
                click: (event) => {
                    vm.edittingStore[param.index].edittingCell[param.column.key] = true;
                    vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                    console.log("保存")
                }
            }
        });
    }
};
const saveIncellEditBtn = (vm, h, param) => {
    return h('Button', {
        props: {
            type: 'text',
            icon: 'checkmark'
        },
        on: {
            click: (event) => {
                vm.edittingStore[param.index].edittingCell[param.column.key] = false;
                vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                vm.$emit('input', vm.handleBackdata(vm.thisTableData));
                vm.$emit('on-cell-change', vm.handleBackdata(vm.thisTableData), param.index, param.column.key);
            }
        }
    });
};
const cellInput = (vm, h, param, item) => {
    return h('Input', {
        props: {
            type: 'text',
            value: vm.edittingStore[param.index][item.key]
        },
        on: {
            'on-change' (event) {
                let key = item.key;
                vm.edittingStore[param.index][key] = event.target.value;
            }
        }
    });
};
const Todetail = (h) =>{
    return h('tr',{
        on:{
            'click' (event){
                console.log(256465486154);
            }
        }
    })
}
export default {
    name: 'canEditTable',
    props: {
        // currow:String,
        refs: String,
        columnsList: Array,
        value: Array,
        url: String,
        editIncell: {
            type: Boolean,
            default: false
        },
        hoverShow: {
            type: Boolean,
            default: false
        },
        roleModel:{
            type:Boolean,
            default:false
        },
    },
    data () {
        return {
            columns: [],
            thisTableData: [],
            edittingStore: [],
            // currow:''
        };
    },
    created () {
        this.init();
       
    },
    methods: {
        init () {
            let vm = this;
            let editableCell = this.columnsList.filter(item => {
                if (item.editable) {
                    if (item.editable === true) {
                        return item;
                    }
                }
            });
            let cloneData = JSON.parse(JSON.stringify(this.value));
            let res = [];
            res = cloneData.map((item, index) => {
                let isEditting = false;
                if (this.thisTableData[index]) {
                    if (this.thisTableData[index].editting) {
                        isEditting = true;
                    } else {
                        for (const cell in this.thisTableData[index].edittingCell) {
                            if (this.thisTableData[index].edittingCell[cell] === true) {
                                isEditting = true;
                            }
                        }
                    }
                }
                if (isEditting) {
                    return this.thisTableData[index];
                } else {
                    this.$set(item, 'editting', false);
                    let edittingCell = {};
                    editableCell.forEach(item => {
                        edittingCell[item.key] = false;
                    });
                    this.$set(item, 'edittingCell', edittingCell);
                    return item;
                }
            });
            this.thisTableData = res;
            this.edittingStore = JSON.parse(JSON.stringify(this.thisTableData));
            this.columnsList.forEach(item => {
                if (item.editable) {
                    item.render = (h, param) => {
                        let currentRow = this.thisTableData[param.index];
                        if (!currentRow.editting) {
                            if (this.editIncell) {
                                return h('Row', {
                                    props: {
                                        type: 'flex',
                                        align: 'middle',
                                        justify: 'center'
                                    },
                                    // on : {
                                    //     'click' (event) {
                                    //         console.log(44465432165);
                                    //     }
                                    // }
                                }, [
                                    h('Col', {
                                        props: {
                                            span: '22'
                                        }
                                    }, [
                                        !currentRow.edittingCell[param.column.key] ? h('span', currentRow[item.key]) : cellInput(this, h, param, item)
                                    ]),
                                    h('Col', {
                                        props: {
                                            span: '2'
                                        }
                                    }, [
                                        currentRow.edittingCell[param.column.key] ? saveIncellEditBtn(this, h, param) : incellEditBtn(this, h, param)
                                    ])
                                ]);
                            } else {
                                return h('span', currentRow[item.key]);
                            }
                        } else {
                            return h('Input', {
                                props: {
                                    type: 'text',
                                    value: currentRow[item.key]
                                },
                                on: {
                                    'on-change' (event) {
                                        let key = param.column.key;
                                        vm.edittingStore[param.index][key] = event.target.value;
                                    }
                                }
                            });
                        }
                    };
                }
                if (item.handle) {
                    item.render = (h, param) => {
                        let currentRowData = this.thisTableData[param.index];
                        let children = [];
                        item.handle.forEach(item => {
                            if (item === 'edit') {
                                children.push(editButton(this, h, currentRowData, param.index));
                            }
                             else if (item === 'delete') {
                                children.push(deleteButton(this, h, currentRowData, param.index));
                            }
                            else if (item === 'detail') {
                                children.push(detailButton(this, h, currentRowData, param.index));
                            }
                        });
                        return h('div', children);
                    };
                }
            });
        },
        handleBackdata (data) {
            let clonedData = JSON.parse(JSON.stringify(data));
            clonedData.forEach(item => {
                delete item.editting;
                delete item.edittingCell;
                delete item.saving;
            });
            return clonedData;
        },  
         
        
    },
    watch: {
        value (data) {
            this.init();  
        }
    }
};
</script>
