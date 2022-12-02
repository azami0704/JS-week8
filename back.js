import {
    getOrderListApi,
    deleteAllOrdersApi,
    deleteOrderApi,
    editStatusApi
} from "./config.js";

getOrderList();

//抓取訂單資料
function getOrderList() {
    getOrderListApi()
        .then(res => {
            renderOrderList(res.data.orders);
            if (res.data.orders.length) {
                //如果沒訂單資料就不跑C3圓餅圖
                dataForC3(res.data.orders);
            }
        })
        .catch(res => console.log(res));
}

//整理銷售數據&渲染圓餅圖
function dataForC3(data) {
    let allOrders = [];
    //將所有訂單內品項撈出
    data.forEach(item => {
        item.products.forEach(item => {
            allOrders.push([item.title, item.quantity]);
        })
    })
    //統計各品項的銷售數量
    let soldSort = allOrders.reduce((a, b) => {
        a[b[0]] ? a[b[0]] += (b[1]) * 1 : a[b[0]] = ([b[1]]) * 1;
        return a;
    }, {})
    //將物件轉陣列並依照銷售數量排序
    let soldSorted = Object.entries(soldSort).sort((a, b) => {
        return b[1] - a[1];
    })
    //統計第三名之後的品項數量
    let otherSum = 0;
    for (let i = 3; i < soldSorted.length; i++) {
        otherSum += soldSorted[i][1]
    }
    //刪除陣列內第三名之後的資料並插入"其他"選項跟加總個數
    soldSorted.splice(3, (soldSorted.length - 3), ['其他', otherSum]);
    let soldSortedNo1 = soldSorted[0][0];
    let soldSortedNo2 = soldSorted[1][0];
    let soldSortedNo3 = soldSorted[2][0];
    let chart = c3.generate({
        bindto: '#chart', // HTML 元素綁定
        data: {
            type: "pie",
            columns: soldSorted,
            colors: {
                soldSortedNo1: "#DACBFF",
                soldSortedNo2: "#9D7FEA",
                soldSortedNo3: "#5434A7",
                "其他": "#301E5F",
            }
        },
    });
}

//渲染訂單清單
function renderOrderList(data='') {
    const orderPageTable = document.querySelector('.orderPage-table');
    let str = ` <thead>
                <tr>
                    <th>訂單編號</th>
                    <th>聯絡人</th>
                    <th>聯絡地址</th>
                    <th>電子郵件</th>
                    <th>訂單品項</th>
                    <th>訂單日期</th>
                    <th>訂單狀態</th>
                    <th>操作</th>
                </tr>
                </thead>`
                orderPageTable.innerHTML = str;
    if(data){
        data.forEach(item => {
            let date = new Date(item.createdAt * 1000);
            let dateStr = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
            let deal = item.paid ? '已處理' : '未處理';
            str += `<tr data-id="${item.id}">
                <td>${item.id}</td>
                <td>
                <p>${item.user.name}</p>
                <p>${item.user.tel}</p>
                </td>
                <td>${item.user.address}</td>
                <td>${item.user.email}</td>
                <td>
                <p>${item.products[0].title}...(共${item.quantity}項)</p>
                </td>
                <td>${dateStr}</td>
                <td class="orderStatus">
                <a href="#">${deal}</a>
                </td>
                <td>
                <input type="button" class="delSingleOrder-Btn" value="刪除">
                </td>
            </tr>`;
        })
        orderPageTable.innerHTML = str;
        //單筆刪除按鈕綁監聽
        const delSingleOrderBtns = document.querySelectorAll('.delSingleOrder-Btn');
        delSingleOrderBtns.forEach(item => {
            item.addEventListener('click', (e) => {
                const id = item.closest('tr').dataset.id;
                deleteOrder(id);
            })
        })
        //刪除全部訂單按鈕黨監聽
        const discardAllBtn = document.querySelector('.discardAllBtn');
        discardAllBtn.addEventListener('click', (e) => {
            e.preventDefault();
            deleteAllOrders();
        })
        //訂單狀態按鈕綁監聽
        const orderStatusBtn = document.querySelectorAll('.orderStatus')
        orderStatusBtn.forEach(item => {
            item.addEventListener('click', (e) => {
                if (e.target.nodeName == 'TD') {
                    return;
                } else {
                    e.preventDefault();
                    const id = item.closest('tr').dataset.id;
                    let ChangeStatus = e.target.innerText == '未處理' ? true : false;
                    editStatus(id, ChangeStatus);
                }
            })
        })
    }
}

//送出刪除單筆訂單
function deleteOrder(id) {
    deleteOrderApi(id)
        .then(res => {
            renderOrderList(res.data.orders);
            if (res.data.orders.length) {
                //如果沒訂單資料就不跑C3圓餅圖
                dataForC3(res.data.orders);
            }
        })
        .catch(res => console.log(res));
}

//送出全部刪除訂單
function deleteAllOrders() {
    deleteAllOrdersApi()
        .then(res => {
            renderOrderList();
        })
        .catch(res => console.log(res));
}

//修改訂單狀態
function editStatus(id, status) {
    const data = {
        "data": {
            "id": id,
            "paid": status
        },
    }
    editStatusApi(data)
        .then(res => {
            getOrderList();
            alert('訂單狀態調整成功');
        })
        .catch(res => console.log(res));
}

