
const apiPath = "azami";
const token = {
    "headers": {
        "Authorization": '11T9j0DLoINfVlLsiZj1QN6q9Og1'
    }
};
const CancelToken = axios.CancelToken;
const source = CancelToken.source();
const cancel = {
    cancelToken: source.token
}
//前台URL
const customerApi = axios.create({
    baseURL: `https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}`
});
//後台URL
const adminApi = axios.create({
    baseURL: `https://livejs-api.hexschool.io/api/livejs/v1/admin/${apiPath}`
});

//前台
//抓商品資料
export const getProducts = () =>customerApi.get('/products');
//抓購物車資料
export const renderCartListApi = () => customerApi.get('/carts');
//加入購物車
export const addCartApi= (data) => customerApi.post('/carts',data);
//編輯購物車產品數量
export const editCartApi = (data) => customerApi.patch('/carts',data,cancel);
//刪除購物車內單筆項目
export const deleteCartApi = (id) => customerApi.delete(`/carts/${id}`);
//清空購物車
export const deleteCartAllApi = () => customerApi.delete('/carts');
//送出訂單
export const sendOrderApi = (obj) => customerApi.post('/orders',obj)

//後台
//抓去訂單資料
export const getOrderListApi = () =>adminApi.get('/orders',token);
//刪除所有訂單
export const deleteAllOrdersApi = () =>adminApi.delete('/orders',token);
//刪除單筆訂單
export const deleteOrderApi = (id) => adminApi.delete(`/orders/${id}`,token);
//修蓋訂單狀態
export const editStatusApi = (data) => adminApi.put('/orders',data,token)
