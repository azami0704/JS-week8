let orderData;
getOrderList();
function getOrderList() {
    const apiPath = 'azami';
    const apiName = 'orders';
    const token = {
        "headers": {
            "Authorization": '11T9j0DLoINfVlLsiZj1QN6q9Og1'
        }
    }
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${apiPath}/${apiName}`, token)
        .then(res => {
            renderOrderList(res.data.orders);
            if(res.data.orders.length){
                dataForC3(res.data.orders);
            }
        })
        .catch(res => console.log(res));
}

function dataForC3(data) {
    let allOrders = [];
    data.forEach(item=>{
        item.products.forEach(item=>{
            allOrders.push(item.title);
        })
    })
    let soldSort = allOrders.reduce((a,b)=>{
        a[b]?a[b]++:a[b]=1;
        return a;
    },{})
    let soldSorted = Object.entries(soldSort).sort((a,b)=>{
        return b[1]-a[1];
    })
    let otherSum = 0;
    for (let i = 3; i < soldSorted.length; i++) {
        otherSum += soldSorted[i][1]  
    }
    soldSorted.splice(3,(soldSorted.length-3),['其他',otherSum]);
    console.log(soldSorted);
    let soldSortedNo1 = soldSorted[0][0];
    let soldSortedNo2 = soldSorted[1][0];
    let soldSortedNo3 = soldSorted[2][0];
    let chart = c3.generate({
        bindto: '#chart', // HTML 元素綁定
        data: {
            type: "pie",
            columns:soldSorted,
            colors: {
                soldSortedNo1: "#DACBFF",
                soldSortedNo2: "#9D7FEA",
                soldSortedNo3: "#5434A7",
                "其他": "#301E5F",
            }
        },
    });
}


function renderOrderList(data) {
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
            <p>${item.products[0].title}</p>
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
    orderStatusBtn.forEach(item=>{
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const id = item.closest('tr').dataset.id;
            editStatus(id);
        })
    })
}

function deleteOrder(id) {
    const apiPath = 'azami';
    const apiName = 'orders';
    const orderId = id;
    const token = {
        "headers": {
            "Authorization": '11T9j0DLoINfVlLsiZj1QN6q9Og1'
        }
    }
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${apiPath}/${apiName}/${orderId}`, token)
        .then(res => {
            renderOrderList(res.data.orders);
        })
        .catch(res => console.log(res));
}

function deleteAllOrders() {
    const apiPath = 'azami';
    const apiName = 'orders';
    const token = {
        "headers": {
            "Authorization": '11T9j0DLoINfVlLsiZj1QN6q9Og1'
        }
    }
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${apiPath}/${apiName}`, token)
        .then(res => {
            getOrderList();
        })
        .catch(res => console.log(res));
}
//修改訂單狀態
function editStatus(id) {
    const apiPath = 'azami';
    const apiName = 'orders';
    const token = {
        "headers": {
            "Authorization": '11T9j0DLoINfVlLsiZj1QN6q9Og1'
        }
    }
    const data = {
        "data": {
            "id": id,
            "paid": true
        },
    }
    axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${apiPath}/${apiName}`,data, token)
        .then(res => {
            getOrderList(res.data.orders);
            alert('訂單狀態調整成功');
        })
        .catch(res => console.log(res));
}

// createdAt
// :
// 1669816752
// id
// :
// "ONXsFrayesVmsxnPD1HZ"
// paid
// :
// false
// products
// :
// (2) [{…}, {…}]
// quantity
// :
// 2
// total
// :
// 1980
// updatedAt
// :
// 1669816752
// user
// :
// {tel: '0931394552', payment: 'ATM', email: 'doggy0704@gmail.com', name: '呂育綺', address: '民利街100巷3弄2號1樓'}