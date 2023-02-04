import { configureStore } from '@reduxjs/toolkit'

import companyReducer from './Slice/companySlice'
import typeWorkReducer from './Slice/typeWorkSlice'
import workReducer from './Slice/workSlice'
import newReducer from "./Slice/newSlice"
import contactReducer from "./Slice/contactSlice"
import socialNetworkReducer from './Slice/socialNetworkSlice'
import tagReducer from "./Slice/tagSlice"
import userReducer from './Slice/userSlice'

import checkCompanyReducer from './Slice/admin/checkCompanySlice'
import worksCensorshipReducer  from './Slice/admin/workCensorshipSlice'

const rootReducer = {
  companys: companyReducer,
  typeWorks: typeWorkReducer,
  works: workReducer,
  news: newReducer,
  contacts: contactReducer,
  socialNetworks: socialNetworkReducer,
  tags: tagReducer,
  users: userReducer,

  checkCompanys: checkCompanyReducer,
  worksCensorship: worksCensorshipReducer,
}
export default configureStore({
  reducer: rootReducer,
})
