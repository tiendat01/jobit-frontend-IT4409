import axiosClient from "./axiosClient";

const checkLoginApi =  {
  checkLogin: async (params) => {
    const url = "/checkLogin";
    // if (localStorage.getItem("token")) {
    return axiosClient.get(url).then((data) => {
      return data;
    });
    // } else {
    //   return await "";
    // }
  },
  // checkLoginUser = (params) => {
  //     const url = '/checkUserLogin';
  //     if (localStorage.getItem("token")) {
  //         return axiosClient.get(url);
  //     } else {
  //         return '';
  //     }
  // };
}
export default checkLoginApi;
