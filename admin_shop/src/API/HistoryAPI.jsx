import axiosClient from './axiosClient'

const HistoryAPI = {

    getHistoryAPI: (query) => {
        return axiosClient.get(`/histories${query}`);
    },

    getDetail: (id) => {
        return axiosClient.get(`/histories/${id}`);
    },

    getAll: () => {
        return axiosClient.get("/histories/all");
    },

    updateStatus: (id, data) => {
    return axiosClient.put(`/histories/update-status/${id}`, data);
    },

    updateOrder: (id, data) => {
    return axiosClient.put(
      `/histories/update-order/${id}`,
      data
    );
  }

}

export default HistoryAPI