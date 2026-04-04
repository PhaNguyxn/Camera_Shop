// API/AiAPI.js
import axiosClient from "./axiosClient"; 

const AIAPI = {
    chat: (data) => {
        const url = "/ai/chat"; 
        return axiosClient.post(url, data);
    },
};

export default AIAPI;