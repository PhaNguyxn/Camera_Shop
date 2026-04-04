import axiosClient from './axiosClient'

const UserAPI = {

    getAllData: () => {
        const url = '/users'
        return axiosClient.get(url)
    },

    getDetailData: (id) => {
        const url = `/users/${id}`
        return axiosClient.get(url)
    },

    postSignUp: (data) => {
    return axiosClient.post('/users/signup', data)
    },

    deleteUser: (id) => axiosClient.delete(`/users/${id}`),

    updateUser: (id, data) => axiosClient.put(`/users/${id}`, data),

    postLogin: (data) => {
    return axiosClient.post('/users/login', data)
    },

}

export default UserAPI