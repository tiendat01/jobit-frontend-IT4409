import { message } from "antd";
import axiosClient from "./axiosClient";

const workApi = {
    getAll: (params) => {
        const url = '/works';
        return axiosClient.get(url, { params });
    },
    getAllCensorship: (params) => {
        const url = '/works/Censorship';
        return axiosClient.get(url, { params });
    },
    search: (params) => {
        const url = '/searchWorks';
        return axiosClient.get(url, { params });
    },
    getAllId: (params) => {
        const url = '/workId';
        return axiosClient.get(url, { params });
    },
    getAllRejectId: (params) => {
        const url = '/workId/reject';
        return axiosClient.get(url, { params });
    },
    getOne: (params) => {
        const url = `/works/${params}`;
        return axiosClient.get(url).then(data => {
            return data.data
        });
    },
    postwork: (params) => {
        const url = '/works';
        return axiosClient.post(url, params).then(data => {
            message.success("Thêm công việc thành công!");
        }).catch(err => {
            message.error("Có lỗi xảy ra!");
        });
    },
    deletework: (id) => {
        const url = `/works/${id}`;
        return axiosClient.delete(url)
    },
    editwork: (params) => {
        const url = `/works/${params.id}`;
        return axiosClient.patch(url, params).then(data => {
            message.success("Sửa thành công!");
        }).catch(err => {
            message.error("Có lỗi xảy ra!");
        });
    }
}

export default workApi;