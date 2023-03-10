import { DatePicker, Input, message, Select, Space } from 'antd'
import JoditEditor from 'jodit-react'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { getProvinces } from 'sub-vn'

import tagWorkApi from '../../../../../api/tagWorkApi'
import workApi from '../../../../../api/workApi'
import workTypeOfWorkApi from '../../../../../api/workTypeOfWorkApi'

import { typeWorkData } from '../../../../../app/Slice/typeWorkSlice'
import { tagData } from '../../../../../app/Slice/tagSlice'
import { addwork, updatework } from '../../../../../app/Slice/workSlice'

import { FormatProvince } from '../../../../utils/Functionjs'
import SpinLoad from '../../../Spin/Spin'
export default function AddJob({ id, idEdit, onChangeTabs }) {
  const dispatch = useDispatch()
  const actionResultTag = () => {
    dispatch(tagData({ status: 1 }))
  }
  const actionResultTypeOfWork = () => {
    dispatch(typeWorkData({ status: 1 }))
  }
  const getTag = (e) => {
    let tag = []
    for (let i = 0; i < e.length; i++) {
      tag.push(`${e[i].tagId}`)
    }
    return tag
  }
  useEffect(() => {
    async function asyncFunc() {
      if (idEdit) {
        reset(
          await workApi.getOne(idEdit).then((data) => {
            setState({
              ...state,
              price1: String(data.price1),
              price2: String(data.price2),
              nature: data.nature,
              date: data.dealtime,
              address: data.address,
              typeofworkId: data.TypeOfWorks[0]?.id,
              tagId: getTag(data.tagWork),
            })
            setDescripton(data.description)
            setInterest(data.interest)
            setForm(data.form)
            setExprience(data.exprience)
            return data
          })
        )
      } else {
        reset(objDefault)
        setDescripton('')
        setInterest('')
        setForm('')
        setExprience('')
      }
    }

    // call
    asyncFunc()
  }, [idEdit])
  const tags = useSelector((state) => state.tags.tag.data)
  const loadingTag = useSelector((state) => state.tags.loading)
  const typeWorks = useSelector((state) => state.typeWorks.typeWork.data)
  const loadingTypeWork = useSelector((state) => state.typeWorks.loading)
  const { register, handleSubmit, reset } = useForm()
  const [interest, setInterest] = useState()
  const [exprience, setExprience] = useState()
  const [form, setForm] = useState()
  const [description, setDescripton] = useState()
  let objDefault = {
    load: false,
    typeofworkId: 2,
    address: 'H?? N???i',
    tagId: [],
    price1: '',
    nature: 'Full Time',
    request: 'Kh??ng y??u c???u',
    price2: '',
    date: undefined,
  }
  const [state, setState] = useState({
    ...objDefault,
  })
  const {
    tagId,
    price1,
    price2,
    nature,
    request,
    date,
    load,
    typeofworkId,
    address,
  } = state
  const onSubmit = async (data) => {
    if (
      data.name === '' ||
      request === '' ||
      nature === '' ||
      interest === '' ||
      description === '' ||
      exprience === '' ||
      form === '' ||
      data.address === '' ||
      data.phone === '' ||
      data.quantity === '' ||
      data.email === '' ||
      data.addressGoogle === '' ||
      date === ''
      // price1 === "" ||
      // price2 === "" ||
      // tagId.length === 0 ||
    ) {
      message.warning('B???n ch??a nh???p ?????y ????? th??ng tin!')
    } else {
      setState({
        ...state,
        load: true,
      })
      // var tagWork = []
      // for (let i = 0; i < tagId.length; i++) {
      //   tagWork.push({ tagId: tagId[i] })
      // }
      var workType = []
      workType.push({ typeofworkId: typeofworkId })
      if (idEdit) {
        await workTypeOfWorkApi.deleteWorkTypeOfWork(idEdit)
        await workTypeOfWorkApi.postWorkTypeOfWork([
          {
            typeofworkId,
            workId: idEdit,
          },
        ])
        // await tagWorkApi.deleteTagWork(idEdit)
        // var dataTag = []
        // for (let i = 0; i < tagId.length; i++) {
        //   let tag = tagId[i]
        //   dataTag.push({ workId: idEdit, tagId: tag })
        // }
        // await tagWorkApi.postTagWork(dataTag)
        const action = updatework({
          workType,
          companyId: id,
          id: idEdit,
          name: data.name,
          status: 1,
          price1,
          price2,
          request,
          nature,
          interest,
          description,
          exprience,
          form,
          address,
          phone: data.phone,
          quantity: data.quantity,
          email: data.email,
          addressGoogle: data.addressGoogle,
          dealtime: date,
        })
        dispatch(action)
        setState({
          ...state,
          load: false,
        })
        onChangeTabs('1', true)
      } else {
        const action = addwork({
          workType,
          companyId: id,
          name: data.name,
          status: 1,
          price1: price1 ? price1 : 0,
          price2: price2 ? price2 : 0,
          request,
          nature,
          // tagWork,
          interest,
          description,
          exprience,
          form,
          address,
          phone: data.phone,
          quantity: data.quantity,
          email: data.email,
          addressGoogle: data.addressGoogle,
          dealtime: date,
        })
        dispatch(action)
        setState({
          ...state,
          load: false,
        })
        onChangeTabs('1', true)
      }
    }
  }
  const onChangePrice1 = (e) => {
    setState({
      ...state,
      price1: e.target.value,
    })
  }
  const onChangePrice2 = (e) => {
    setState({
      ...state,
      price2: e.target.value,
    })
  }
  const onChangeNature = (e) => {
    setState({
      ...state,
      nature: e,
    })
  }
  const onChangeTypeWork = (e) => {
    setState({
      ...state,
      typeofworkId: e,
    })
  }
  const onChangeRequest = (e) => {
    setState({
      ...state,
      request: e,
    })
  }
  const onChangeDate = (date, dateString) => {
    setState({
      ...state,
      date: dateString,
    })
  }
  useEffect(() => {
    // actionResultTag()
    actionResultTypeOfWork()
  }, [])
  // const data = []
  // if (tags) {
  //   tags.rows.map((e) => {
  //     data.push(<Select.Option key={e.id}>{e.name}</Select.Option>)
  //   })
  // }
  // const onChangeTag = (e) => {
  //   setState({
  //     ...state,
  //     tagId: e,
  //   })
  // }
  const onchangeAddress = (e) => {
    setState({
      ...state,
      address: e,
    })
  }
  return (
    <div className="infor">
      <div className="heading">
        <div className="heading__title">
          <h3>????ng tuy???n vi???c l??m</h3>
        </div>
        <div className="heading__hr"></div>
      </div>
      <div className="content pb-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="d-flex">
            <div className="form-group w-45">
              <label htmlFor="">T??n c??ng vi???c</label>
              <input
                type="text"
                className="form-control"
                {...register('name')}
                id=""
                aria-describedby="helpId"
                placeholder=""
              />
            </div>
            <div className="form-group w-45">
              <label htmlFor="">?????a ch???</label>

              <Select
                value={address}
                onChange={onchangeAddress}
                className="form-control w-100"
              >
                {getProvinces().map((data, index) => (
                  <Select.Option value={FormatProvince(data.name)} key={index}>
                    {data.name}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>
          <div className="d-flex">
            <div className="form-group w-45">
              <label htmlFor="">Email</label>
              <input
                type="text"
                className="form-control"
                {...register('email')}
                id=""
                aria-describedby="helpId"
                placeholder=""
              />
            </div>
            <div className="form-group w-45">
              <label htmlFor="">Link google map</label>
              <input
                type="text"
                className="form-control"
                {...register('addressGoogle')}
                id=""
                aria-describedby="helpId"
                placeholder=""
              />
            </div>
          </div>
          <div className="d-flex">
            <div className="form-group w-45">
              <label htmlFor="">??i???n tho???i</label>
              <input
                type="text"
                className="form-control"
                {...register('phone')}
                id=""
                aria-describedby="helpId"
                placeholder=""
              />
            </div>
            <div className="form-group w-45">
              <label htmlFor="">M???c l????ng</label>
              <Input.Group compact className="w-100">
                <Input
                  style={{ width: '45%', textAlign: 'center' }}
                  onChange={onChangePrice1}
                  placeholder="??t nh???t"
                  value={price1}
                />
                <Input
                  className="site-input-split"
                  style={{
                    width: '10%',
                    textAlign: 'center',
                  }}
                  placeholder="~"
                  disabled
                />
                <Input
                  className="site-input-right"
                  style={{
                    width: '45%',
                    textAlign: 'center',
                  }}
                  onChange={onChangePrice2}
                  placeholder="Nhi???u nh???t"
                  value={price2}
                />
              </Input.Group>
              <small>Kh??ng nh???p n???u b???n mu???n th????ng l?????ng</small>
            </div>
          </div>
          <div className="d-flex">
            <div className="form-group w-45">
              <label htmlFor="">H???n ch??t</label>
              <Space direction="vertical" className="w-100">
                <DatePicker
                  onChange={onChangeDate}
                  className="form-control input-ant"
                  value={moment(date ? date : new Date(), 'YYYY-MM-DD')}
                />
              </Space>
              {console.log('new Date()', new Date())}
              {console.log('date', date ? date : new Date())}
              {console.log(
                'date',
                moment(date ? date : new Date(), 'YYYY-MM-DD')
              )}
            </div>
            {/* <div className="form-group w-45">
              <label htmlFor="">Tags li??n quan</label>
              {console.log('tagId', tagId)}
              {loadingTag ? (
                <SpinLoad />
              ) : (
                <Select
                  value={tagId ? tagId : []}
                  mode="tags"
                  onChange={onChangeTag}
                  className="form-control"
                  placeholder="Tags Mode"
                >
                  {data}
                </Select>
              )}
            </div> */}
            <div className="form-group w-45">
              <label htmlFor="">Lo???i c??ng vi???c</label>
              {loadingTypeWork ? (
                <SpinLoad />
              ) : (
                <Select
                  value={typeofworkId}
                  onChange={onChangeTypeWork}
                  className="form-control w-100"
                >
                  {typeWorks.rows.map((data, index) => (
                    <Select.Option value={data.id} key={index}>
                      {data.name}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </div>
          </div>
          <div className="d-flex">
            <div className="form-group w-45">
              <label htmlFor="">T??nh ch???t c??ng vi???c</label>
              <Select
                defaultValue="Full Time"
                onChange={onChangeNature}
                className="form-control w-100"
                value={nature}
              >
                <Select.Option value="Full Time">Full Time</Select.Option>
                <Select.Option value="Part Time">Part Time</Select.Option>
              </Select>
            </div>
            <div className="form-group w-45">
              {/* <label htmlFor="">Y??u c???u b???ng c???p</label>
              <Select
                defaultValue="Kh??ng y??u c???u"
                onChange={onChangeRequest}
                className="form-control w-100"
                value={request}
              >
                <Select.Option value="Kh??ng y??u c???u">
                  Kh??ng y??u c???u
                </Select.Option>
                <Select.Option value="Cao ?????ng">Cao ?????ng</Select.Option>
                <Select.Option value="?????i h???c">?????i h???c</Select.Option>
                <Select.Option value="Cao h???c">Cao h???c</Select.Option>
                <Select.Option value="Ti???n s???">Ti???n s???</Select.Option>
                <Select.Option value="Th???c s???">Th???c s???</Select.Option>
              </Select> */}

              <label htmlFor="">S??? l?????ng tuy???n</label>
              <input
                type="text"
                className="form-control"
                {...register('quantity')}
                id=""
                aria-describedby="helpId"
                placeholder=""
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="">M?? t???</label>
            <JoditEditor
              value={description}
              tabIndex={1}
              onChange={(e) => setDescripton(e)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="">Quy???n l???i ???????c h?????ng</label>
            <JoditEditor
              value={interest}
              tabIndex={1}
              onChange={(e) => setInterest(e)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="">Y??u c???u c??ng vi???c</label>
            <JoditEditor
              value={form}
              tabIndex={1}
              onChange={(e) => setForm(e)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="">Y??u c???u kinh nghi???m</label>
            <JoditEditor
              value={exprience}
              tabIndex={1}
              onChange={(e) => setExprience(e)}
            />
          </div>
          {load ? (
            <SpinLoad />
          ) : (
            <div className="text-center mtb">
              <input
                type="submit"
                value={idEdit ? 'S???a c??ng vi???c' : 'T???o c??ng vi???c'}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
