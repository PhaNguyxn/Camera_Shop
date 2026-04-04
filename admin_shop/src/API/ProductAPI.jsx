import axiosClient from "./axiosClient"

const ProductAPI = {

    getAPI: () => {
        const url = '/products'
        return axiosClient.get(url)
    },

    getCategory: (query) => {
        const url = `/products/category${query}`
        return axiosClient.get(url)
    },

    getDetail: (id) => {
        const url = `/products/${id}`
        return axiosClient.get(url)
    },

    getPagination: (query) => {
        const url = `/products/pagination${query}`
        return axiosClient.get(url)
    },

    getCategories: () => {
        const url = `/products/category/list`;
        return axiosClient.get(url);
    },

    getDetailCategory: (id) => {
        const url = `/products/category/detail/${id}`;
        return axiosClient.get(url);
    },

    updateCategory: (id, data) => {
        const url = `/products/category/update/${id}`;
        return axiosClient.put(url, data);
    },

    createCategory: (data) => {
        const url = `/products/category/create`;
        return axiosClient.post(url, data);
    },

    createProduct: (data) => {
        const url = `/products/create`;
        return axiosClient.post(url, data);
    },

    updateProduct: (id, data) => {
        const url = `/products/update/${id}`;
        return axiosClient.put(url, data);
    },

    deleteProduct: (id) => axiosClient.delete(`/products/${id}`),

    deleteCategory: (id) => {
    const url = `/products/category/delete/${id}`;
    return axiosClient.delete(url);
    },
} 

export default ProductAPI