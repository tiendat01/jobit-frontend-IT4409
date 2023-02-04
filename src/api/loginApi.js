import axiosClient from './axiosClient'

const loginApi = {
  loginCompany: (params) => {
    const url = '/loginCompany'
    return axiosClient.post(url, params)
  },
  loginUser: (params) => {
    const url = '/loginUser'
    return axiosClient.post(url, params)
  },
  loginAdmin: (params) => {
    const url = '/loginAdmin'
    return axiosClient.post(url, params)
  },
}
export default loginApi
