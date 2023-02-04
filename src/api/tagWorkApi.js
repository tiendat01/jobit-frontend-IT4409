import { message } from "antd";
import axiosClient from "./axiosClient";

const tagWorkApi = {
  getAll: (params) => {
    const url = "/tagWorks";
    return axiosClient.get(url, { params });
  },
  getOne: (params) => {
    const url = `/tagWorks/${params}`;
    return axiosClient.get(url).then((data) => {
      return data.data;
    });
  },
  postTagWork: (params) => {
    const url = "/tagWorks";
    return axiosClient.post(url, params);
  },
  deleteTagWork: (id) => {
    const url = `/tagWorks/${id}`;
    return axiosClient.delete(url);
  },
  editTagWork: (params) => {
    const url = `/tagWorks/${params.id}`;
    return axiosClient
      .patch(url, params)
      .then((data) => {
        message.success("Sửa thành công!");
      })
      .catch((err) => {
        message.error("Có lỗi xảy ra!");
      });
  },
}
export default tagWorkApi;
