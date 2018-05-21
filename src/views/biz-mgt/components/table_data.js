export const table1Columns = [
    {
        title: '序号',
        type: 'index',
        width: 80,
        align: 'center'
    },
    {
        title: '姓名',
        align: 'center',
        key: 'name',
        editable: true
    },
    {
        title: '性别',
        align: 'center',
        key: 'sex'
    },
    {
        title: '岗位',
        align: 'center',
        key: 'work',
        editable: true
    },
    {
        title: '操作',
        align: 'center',
        width: 120,
        key: 'handle',
        handle: ['delete']
    }
];

export const table1Data = [
    {
        name: 'Aresn',
        sex: '男',
        work: '前端开发'
    },
    {
        name: 'Lison',
        sex: '男',
        work: '前端开发'
    },
    {
        name: 'lisa',
        sex: '女',
        work: '程序员鼓励师'
    }
];

export const editInlineColumns = [
    {
        title: '序号',
        type: 'index',
        width: 80,
        align: 'center'
    },
    {
        title: '姓名',
        align: 'center',
        key: 'name',
        width: 90,
        editable: true
    },
    {
        title: '性别',
        align: 'center',
        key: 'sex'
    },
    {
        title: '岗位',
        align: 'center',
        key: 'work',
        width: 150,
        editable: true
    },
    {
        title: '操作',
        align: 'center',
        width: 190,
        key: 'handle',
        handle: ['edit', 'delete']
    }
];

export const userData = [
    {
        name: 'Aresn',
        sex: '男',
        work: '前端开发'
    },
    {
        name: 'Lison',
        sex: '男',
        work: '前端开发'
    },
    {
        name: 'lisa',
        sex: '女',
        work: '程序员鼓励师'
    }
];

export const editIncellColumns = [
    {
        title: '序号',
        type: 'index',
        width: 80,
        align: 'center'
    },
    {
        title: '姓名',
        align: 'center',
        key: 'name',
        width: 120,
        editable: true
    },
    {
        title: '性别',
        align: 'center',
        key: 'sex'
    },
    {
        title: '岗位',
        align: 'center',
        width: 160,
        key: 'work',
        editable: true
    },
    {
        title: '操作',
        align: 'center',
        width: 120,
        key: 'handle',
        handle: ['delete']
    }
];

export const editIncellData = [
    {
        name: 'Aresn',
        sex: '男',
        work: '前端开发'
    },
    {
        name: 'Lison',
        sex: '男',
        work: '前端开发'
    },
    {
        name: 'lisa',
        sex: '女',
        work: '程序员鼓励师'
    }
];

export const editInlineAndCellColumn = [
    {
        title: '序号',
        type: 'index',
        width: 80,
        align: 'center'
    },
    {
        title: '姓名',
        align: 'center',
        key: 'name',
        width: 300,
        editable: true
    },
    {
        title: '性别',
        align: 'center',
        key: 'sex'
    },
    {
        title: '岗位',
        align: 'center',
        width: 300,
        key: 'work',
        editable: true
    },
    {
        title: '操作',
        align: 'center',
        width: 200,
        key: 'handle',
        handle: ['edit', 'delete']
    }
];

export const editInlineAndCellData = [
    {
        name: 'Aresn',
        sex: '男',
        work: '前端开发'
    },
    {
        name: 'Lison',
        sex: '男',
        work: '前端开发'
    },
    {
        name: 'lisa',
        sex: '女',
        work: '程序员鼓励师'
    }
];

export const showCurrentColumns = [
    {
        title: '序号',
        type: 'index',
        width: 80,
        align: 'center'
    },
    {
        title: '姓名',
        align: 'center',
        key: 'name',
        width: 300,
        editable: true
    },
    {
        title: '性别',
        align: 'center',
        key: 'sex'
    },
    {
        title: '岗位',
        align: 'center',
        width: 300,
        key: 'work',
        editable: true
    }
];

export const  invoiceColumns = [
    {
        title: 'id',
        width: 70,
        align: 'center',
        key : 'id'
    },
    {
        title: '买方',
        width: 120,
        align: 'center',
        key : 'name'
    },
    {
        title: '购买方银行账户',
        width: 210,
        align: 'center',
        key : 'account'
    },
    {
        title: '购买方地址',
        width: 230,
        align: 'center',
        key : 'address',
        editable: true        
    },
    {
        title: '总金额',
        width: 80,
        align: 'center',
        editable: true,
        key : 'amount',
    },
    // {
    //     title: 'checkcode',
    //     type: 'index',
    //     width: 80,
    //     align: 'center',
    //     key : 'checkCode'
    // },
    // {
    //     title: 'invoceCode',
    //     width: 80,
    //     align: 'center',
    //     key : 'invoiceCode'
    // },
    // {
    //     title: 'invoiceData',
    //     width: 80,
    //     align: 'center',
    //     key : 'invoiceData'
    // },
    // {
    //     title: 'invoiceNo',
    //     type: 'index',
    //     width: 80,
    //     align: 'center',
    //     key : 'invoiceNo'
    // },
    // {
    //     title: '公司名称',
    //     type: 'index',
    //     width: 80,
    //     align: 'center',
    //     key : 'name'
    // },
   
    {
        title: '销售方',
        width: 120,
        align: 'center',
        key : 'sellerName'
    },
     {
        title: '备注',
        width: 80,
        align: 'center',
        key : 'remark',
        editable: true        
    },
    // {
    //     title: '状态',
    //     type: 'index',
    //     width: 80,
    //     align: 'center',
    //     key : 'status'
    // },
    // {
    //     title: 'taxpayerCode',
    //     type: 'index',
    //     width: 80,
    //     align: 'center',
    //     key : 'taxpayerCode'
    // },
    {
        title: '操作',
        align: 'center',
        width: 180,
        key: 'handle', 
        handle: ['edit','delete','detail']
    },
];

export const  receptsColumns = [
    {
        title: 'id',
        width: 70,
        align: 'center',
        key : 'id'
    },
    {
        title: 'name',
        width: 100,
        align: 'center',
        key : 'name'
    },
    {
        title: 'remark',
        width: 100,
        align: 'center',
        key : 'remark',
        editable: true        
    },
]


const tableData = {
    table1Columns: table1Columns,
    table1Data: table1Data,
    userColumns: editInlineColumns,
    userData: userData,
    editIncellColumns: editIncellColumns,
    editIncellData: editIncellData,
    editInlineAndCellColumn: editInlineAndCellColumn,
    editInlineAndCellData: editInlineAndCellData,
    showCurrentColumns: showCurrentColumns,
    invoiceColumns : invoiceColumns,  
    receptsColumns : receptsColumns,  
};

export default tableData;
