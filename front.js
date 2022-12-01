
getProducts();
renderCartList();

//抓商品資料
function getProducts(){
    const apiName = "products";
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/${apiName}`)
    .then((res)=>{
        renderProductsCard(res.data.products);
        renderFilter(res.data.products);
    }).catch((error)=>{
        console.log(error);
    });
}

//渲染商品列表
function renderProductsCard(data) {
    let str = '';
    const productWrap = document.querySelector('.productWrap');
    data.forEach((item)=>{
        str +=`<li class="productCard">
        <h4 class="productType">新品</h4>
        <img src=${item.images} alt=${item.title}>
        <a href="#" class="addCardBtn" data-id=${item.id}>加入購物車</a>
        <h3>${item.title}</h3>
        <del class="originPrice">NT$${(item.origin_price).toLocaleString()}</del>
        <p class="nowPrice">NT$${(item.price).toLocaleString()}</p>
    </li>`
    });
    productWrap.innerHTML = str;

    const cartBtn = document.querySelectorAll('.addCardBtn');
    cartBtn.forEach(item=>{
        item.addEventListener('click',function(e){
            e.preventDefault();
            addCart(e.target.dataset.id);
        })
    })
}

//加入購物車
function addCart(id) {
    const apiName = "carts";
    let data={
        "data":{
            "productId": id,
            "quantity": 1
        }
    }
    axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/${apiName}`,data)
    .then(res=>{
        renderCartList();
    }).catch(error=>{
        console.log(error);
    })
}

//讀取購物車
function renderCartList() {
    const apiName = "carts";
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/${apiName}`)
    .then(res=>{
        renderCartListHtml(res.data);
    }).catch(error=>{
        console.log(error);
    })
}

//渲染購物車清單
function renderCartListHtml(data) {
    const shoppingCartTable = document.querySelector('.shoppingCart-table')
    let str=` <tr>
    <th width="40%">品項</th>
    <th width="15%">單價</th>
    <th width="15%">數量</th>
    <th width="15%">金額</th>
    <th width="15%"></th>
</tr>`;
    let cartList = data.carts;
    if(cartList.length==0){
        shoppingCartTable.innerHTML='購物車是空的喔!';
    }else{
        cartList.forEach(item=>{
            str+=`<tr data-id=${item.id}>
            <td>
                <div class="cardItem-title">
                    <img src=${item.product.images} alt="${item.product.title}">
                    <p>${item.product.title}</p>
                </div>
            </td>
            <td>NT$${(item.product.price).toLocaleString()}</td>
            <td><a href="#" data-minus>-</a>${item.quantity}<a href="#" data-plus>+</a></td>
            <td>NT$${((item.quantity)*(item.product.price)).toLocaleString()}</td>
            <td class="discardBtn">
                <a href="#" class="material-icons" data-id=${item.id}>
                    clear
                </a>
            </td>
        </tr>`
        })
        str+=` <tr>
        <td>
            <a href="#" class="discardAllBtn">刪除所有品項</a>
        </td>
        <td></td>
        <td></td>
        <td>
            <p>總金額</p>
        </td>
        <td>NT$${(data.finalTotal).toLocaleString()}</td>
        </tr>`
        shoppingCartTable.innerHTML=str;
    
        const discardBtn = document.querySelectorAll('.discardBtn');
        const discardAllBtn = document.querySelectorAll('.discardAllBtn');
        const minusBtn = document.querySelectorAll('[data-minus]');
        const plusBtn = document.querySelectorAll('[data-plus]');
        discardBtn.forEach(item=>{
            item.addEventListener('click',function(e){
                e.preventDefault();
                let id = item.closest('tr').dataset.id
                deleteCart(id)
            })
        });
        discardAllBtn.forEach(item=>{
            item.addEventListener('click',function(e){
                e.preventDefault();
                deleteCartAll();
            })
        })
        minusBtn.forEach(item=>{
            item.addEventListener('click',e=>{
                e.preventDefault();
                let id = item.closest('tr').dataset.id
                if(e.target.nextSibling.textContent==1){
                    deleteCart(id)
                }else{
                    let value = e.target.nextSibling.textContent*1 - 1
                    editCart(id,value)
                }
            })
        })
        plusBtn.forEach(item=>{
            item.addEventListener('click',e=>{
                e.preventDefault();
                let id = item.closest('tr').dataset.id
                let value = e.target.previousSibling.textContent*1 + 1
                editCart(id,value)
            })
        })
    }
    
}


//編輯購物車產品數量
function editCart(id,value) {
    const apiName = "carts";
    let data = {
        "data": {
            "id": id,
            "quantity": value
        }
    }
    axios.patch(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/${apiName}`,data)
    .then(res=>{
        renderCartListHtml(res.data);
    })
    .catch(res=>console.log(res));
}
//刪除購物車內單筆項目
function deleteCart(id) {
    const apiName = "carts";
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/${apiName}/${id}`)
    .then(res=>{
        renderCartList();
    })
    .catch(res=>console.log(res));
}

//清空購物車
function deleteCartAll(){
    const apiName = "carts";
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/${apiName}`)
    .then(res=>{
        renderCartList();
    })
    .catch(res=>console.log(res));
}

//以資料庫有的品項產商品篩選器選項
function renderFilter(data) {
    const productSelect = document.querySelector('.productSelect');
    let categorySort = 
    data.map(item=>item.category).filter((item,index,arr)=>arr.indexOf(item)==index);

    let str = '<option value="全部" selected>全部</option>';
    categorySort.forEach(item=>{
        str+=`<option value=${item}>${item}</option>`
    })
    productSelect.innerHTML = str;
    productSelect.addEventListener('change',(e)=>{
        let renderData = data;
        if(e.target.value!='全部'){
            renderData = data.filter(item=>item.category==e.target.value);
        }
        renderProductsCard(renderData);
    })
}

//預訂資料表單綁監聽抓資料&驗證
const orderInfoForm = document.querySelector('.orderInfo-form');
orderInfoForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const inputAll = document.querySelectorAll('.orderInfo-input');
    let valueList = {};
    inputAll.forEach(item=>{
        valueList[item.id]=(item.value)
    })
    const OderData = {
        'data':{
            'user':{
                'name': valueList.customerName,
                'tel': valueList.customerPhone,
                'email': valueList.customerEmail,
                'address': valueList.customerAddress,
                'payment': valueList.tradeWay
            }
        }
    }

    var constraints = {
        "姓名":{
            presence: {
                message:"必填"
            }
        },
        "電話":{
            presence: {
                message:"必填"
            },
            length: {
                maximum: 10,
                message: "字數怪怪的喔"
            }
        },
        "Email":{
            presence: {
                message:"必填"
            },
            email: {
                message: "輸入格式有誤!"
            }
        },
        "寄送地址":{
            presence: {
                message:"必填"
            }
        }
    }
    const error = validate(orderInfoForm,constraints)
    
    //清空錯誤訊息
    inputAll.forEach(item=>{
        if(item.tagName=='INPUT'){
            item.nextElementSibling.textContent = '';
        }
    })
    //如果沒有錯誤訊息就跑購物車檢查
    if(!error){
        //先檢查購物車有沒有商品再送出頂單
        const apiName = "carts";
        axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/${apiName}`)
        .then(res=>{
            if((res.data.carts).length===0){
                alert('購物車內無商品喔!')
            }else{
                sendOrder(OderData);
            }
        }).catch(error=>{
            console.log(error);
        })
    }else{
        inputAll.forEach(item=>{
            if(error[item.name]){
                item.nextElementSibling.textContent = error[item.name];
            }
        })
    }
})


//送出訂單
function sendOrder(obj){
    const apiName = "orders";
    axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/${apiName}`,obj)
    .then(res=>{
        renderCartList();
        alert('預購成功!');
        orderInfoForm.reset();
    })
    .catch(error=>console.log(error));
}


