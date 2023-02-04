import { message, Tag, Popover } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import React, { useEffect, useState } from 'react'
import renderHTML from 'react-render-html'
import { Link } from 'react-router-dom'

import checkLoginApi from '../../../../api/checkLoginApi'
import saveWorkApi from '../../../../api/saveWorkApi'
import workApplyApi from '../../../../api/workApplyApi'
import { storage } from '../../../../firebase'
import { checkDateDealtime, formatDateWork } from '../../../utils/Functionjs'

import KeyTag from '../../Jobs/ListJobs/KeyTag'
import qc from '../../../images/qc-f88.com.gif'
import '../../../scss/DetailJob/Jd.scss'

const STATUS = {
  APPLIED: 0,
  INTERVIEW: 1,
  ACCEPTED: 2,
  REJECTED: -1,
}
const statusColor = {
  [STATUS.APPLIED]: '#ffc107',
  [STATUS.INTERVIEW]: '#0d6efd',
  [STATUS.ACCEPTED]: '#198754',
  [STATUS.REJECTED]: '#dc3545',
}

export default function Jd(props) {
  let { data, id, isAdmin } = props
  const [user, setUser] = useState()
  const [load, setLoad] = useState(false)
  const [deleteId, setDeleteId] = useState()
  const [notSave, setNotSave] = useState(true)
  const [messager, setMessager] = useState('')
  const [state, setState] = useState({ tenFile: '', file: '' })
  const { tenFile, file } = state

  const [isShowApply, setIsShowApply] = useState(false)

  useEffect(() => {
    console.log('data of JD: ', data)
    checkLoginApi.checkLogin().then((ok) => {
      if (ok.data.user.type === 'user') {
        setUser(ok.data.user.id)

        workApplyApi.checkUserApply(ok.data.user.id).then((ok) => {
          if (ok) {
            let checkUserApply = ok.workapply.findIndex(
              (x) => x.name === data.name
            )
            if (checkUserApply < 0) {
              setIsShowApply(true)
            }
          }
        })
      }
    })
    saveWorkApi.getAll({ userId: user, workId: id }).then((data) => {
      var a = data.data
      var b = []
      for (let i = 0; i < a.length; i++) {
        b.push({ id: a[i].id })
      }
      setDeleteId(b)
      if (data.data.length === 0) {
        setNotSave(true)
      } else {
        setNotSave(false)
      }
    })
  }, [user, load])
  const onSaveWork = async () => {
    if (user) {
      await saveWorkApi.postsaveWork([{ userId: user, workId: id }])
      setLoad(!load)
    } else {
      message.warning('Bạn chưa đăng nhập!')
    }
  }

  const onNotSaveWork = async () => {
    if (user) {
      for (let i = 0; i < deleteId.length; i++) {
        await saveWorkApi.deletesaveWork(deleteId[i].id)
      }
      setLoad(!load)
    } else {
      message.warning('Bạn chưa đăng nhập!')
    }
  }

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const showModal = (e) => {
    if (e === 'Đã hết hạn') {
      message.warning('Công việc đã hết hạn ứng tuyển!')
    } else {
      if (user) {
        setIsModalVisible(true)
      } else {
        message.warning('Bạn chưa đăng nhập!')
      }
    }
  }
  const hangdelFile = (e) => {
    setState({
      ...state,
      tenFile: e.target.files[0].name,
      file: e.target.files[0],
    })
  }
  const handleOk = async () => {
    if (messager === '' || tenFile === '') {
      message.warning('Bạn cần nhập lời nhắn và CV đính kèm!')
    } else {
      setConfirmLoading(true)

      await storage.ref(`fileCv/${file.name}`).put(file)
      const file1 = await storage.ref('fileCv').child(tenFile).getDownloadURL()

      console.log(
        'getStatusActive(data.WorkApplies)',
        getStatus(data.WorkApplies)
      )
      if (getStatus(data.WorkApplies) === 'empty') {
        await workApplyApi
          .postworkApply([
            {
              userId: user,
              workId: +id,
              message: messager,
              link: file1,
              status: 0,
              statusActive: null,
            },
          ])
          .then((ok) => {
            window.location.reload()
            // props.reload()
          })
      } else {
        let index = data.WorkApplies.findIndex((b) => b.userId === user)
        console.log('index', index)
        if (index < 0) {
          await workApplyApi
            .postworkApply([
              {
                userId: user,
                workId: +id,
                message: messager,
                link: file1,
                status: 0,
                statusActive: null,
              },
            ])
            .then((ok) => {
              // props.reload()
              window.location.reload()
            })
        } else {
          await workApplyApi
            .editworkApply({
              id: data.WorkApplies[index].id,
              userId: user,
              workId: +id,
              message: messager,
              link: file1,
              status: 0,
            })
            .then((ok) => {
              window.location.reload()
              // props.reload()
            })
        }
      }
      setIsModalVisible(false)
      setConfirmLoading(false)
    }
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const getStatus = (data) => {
    if (data.length) {
      let index = data.findIndex((x) => {
        console.log('x userid ', x.userId)
        console.log('user', user)
        return x.userId === user
      })
      if (index >= 0) {
        return data[index].status
      }
      return null
    }
    return 'empty'
  }

  const renderButtonApply = () => {
    if (!isAdmin && user) {
      if (getStatus(data.WorkApplies) === 1) {
        return (
          <span className="status-tag">
            <Tag color={statusColor[STATUS.INTERVIEW]}>Phỏng vấn</Tag>
          </span>
        )
      } else if (getStatus(data.WorkApplies) === 2) {
        return <Tag color={statusColor[STATUS.ACCEPTED]}>Nhận việc</Tag>
      } else if (getStatus(data.WorkApplies) === -1) {
        return <Tag color={statusColor[STATUS.REJECTED]}>Bị từ chối</Tag>
      } else if (getStatus(data.WorkApplies) === 0) {
        // if (isShowApply) {
        //   return (
        //     <div
        //       className="apply"
        //       onClick={() => showModal(checkDateDealtime(data.dealtime))}
        //     >
        //       <Link to="#">Ứng tuyển ngay</Link>
        //     </div>
        //   )
        // } else {
        return <Tag color={statusColor[STATUS.APPLIED]}>Đã ứng tuyển</Tag>
        // }
      } else {
        return null
      }
    }
  }

  return (
    <div className="Jd">
      <Modal
        title="Ứng tuyển"
        visible={isModalVisible}
        confirmLoading={confirmLoading}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="form-group mb-3">
          <textarea
            className="form-control"
            value={messager}
            onChange={(e) => setMessager(e.target.value)}
            name=""
            id=""
            cols="30"
            rows="4"
            placeholder="Lời nhắn"
          ></textarea>
        </div>
        <label htmlFor="file" className="file">
          File của bạn
        </label>
        <input type="file" onChange={hangdelFile} hidden name="" id="file" />
        <p>{file ? tenFile : ''}</p>
      </Modal>
      <div className="container">
        <div className="row">
          <div className="col-md-9 ">
            <div className="job__box">
              <div className="job__box__title">
                <h4 style={{ display: 'inline-block' }}>{data.name}</h4>
                {renderButtonApply()}
              </div>

              <div className="job__box__detail">
                <div className="job__box__detail--address">
                  <i className="fas fa-map-marker-alt"></i>
                  {data.address}
                </div>
                <div className="job__box__detail--fulltime">
                  <i className="fas fa-hourglass-half"></i>
                  {data.nature}
                </div>
                <div className="job__box__detail--status">
                  <i className="fas fa-unlock-alt"></i>
                  {checkDateDealtime(data.dealtime)}
                </div>
                <div className="job__box--detail--salary">
                  <i className="fas fa-dollar-sign"></i>
                  {data.price1 && data.price2
                    ? data.price1 + ' - ' + data.price2 + 'triệu'
                    : 'Thương lượng'}
                </div>
              </div>

              {!isAdmin &&
                user &&
                getStatus(data.WorkApplies) !== 2 &&
                getStatus(data.WorkApplies) !== 1 &&
                getStatus(data.WorkApplies) !== 0 && (
                  <div
                    className="apply"
                    onClick={() => showModal(checkDateDealtime(data.dealtime))}
                  >
                    <Link to="#">
                      {getStatus(data.WorkApplies) === -1
                        ? 'Ứng tuyển lại'
                        : 'Ứng tuyển ngay'}
                    </Link>
                  </div>
                )}
              {!isAdmin && user && getStatus(data.WorkApplies) === 1 && (
                <Popover content="Sử dụng meeting ID được gửi từ công ty tuyển dụng, bởi hệ thống">
                  <div
                    className="apply1"
                    onClick={() => showModal(checkDateDealtime(data.dealtime))}
                  >
                    <Link to="/interview">Phỏng vấn trực tiếp</Link>
                  </div>
                </Popover>
              )}
            </div>
            <div className="job__box">
              <div>
                <div className="job__box__title--jd">
                  <p>Mô tả công việc</p>
                </div>
                <div className="job__box__content--jd">
                  {renderHTML(data.description ?? '')}
                </div>
              </div>
              <div>
                <div className="job__box__title--jd">
                  <p>Yêu cầu công việc</p>
                </div>
                <div className="job__box__content--jd">
                  {renderHTML(data.form ?? '')}
                </div>
              </div>
              <div>
                <div className="job__box__title--jd">
                  <p>Quyền lợi được hưởng</p>
                </div>
                <div className="job__box__content--jd">
                  {renderHTML(data.interest ?? '')}
                </div>
              </div>
              <div>
                <div className="job__box__title--jd">
                  <p>Địa điểm làm việc</p>
                </div>
                <div className="job__box__content--jd">{data.address}</div>
              </div>
              <div>
                <div className="job__box__title--jd">
                  <p>Tính chất công việc</p>
                </div>
                <div className="job__box__content--jd">
                  {renderHTML(data.nature ?? '')}
                </div>
              </div>
              <div>
                <div className="job__box__title--jd">
                  <p>Yêu cầu bằng cấp(tối thiểu)</p>
                </div>
                <div className="job__box__content--jd">
                  {renderHTML(data.request ?? '')}
                </div>
              </div>
              <div>
                <div className="job__box__title--jd">
                  <p>Yêu cầu kinh nghiệm</p>
                </div>
                <div className="job__box__content--jd">
                  {renderHTML(data.exprience ?? '')}
                </div>
              </div>
              <div>
                <div className="job__box__title--jd">
                  <p>Vị trí công ty</p>
                </div>
                <div className="job__box__content--jd">
                  <div
                    id="map-container-google-1"
                    className="z-depth-1-half map-container"
                    style={{ width: '100%' }}
                  >
                    {renderHTML(data.addressGoogle ?? '')}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="deadline__box">
              <div className="deadline">
                <div className="deadline__icon">
                  <i className="far fa-clock"></i>
                </div>
                <div>
                  <div className="deadline__title">Hạn chót</div>
                  <div className="deadline__time">
                    {formatDateWork(data.dealtime ?? '')}
                  </div>
                </div>
              </div>
              <div className="deadline__icon--bot">
                <i className="far fa-clock"></i>
              </div>
            </div>
            <div className="deadline__box">
              <div className="deadline yellow">
                <div className="deadline__icon">
                  <i className="fas fa-user-graduate"></i>
                </div>
                <div>
                  <div className="deadline__title">Số lượng tuyển</div>
                  <div className="deadline__time">
                    {console.log(data)}
                    {data?.quantity}
                  </div>
                </div>
              </div>
              <div className="deadline__icon--bot">
                <i className="fas fa-user-graduate"></i>
              </div>
            </div>
            {user && (
              <div
                className="save__box"
                onClick={notSave ? onSaveWork : onNotSaveWork}
              >
                <div className="save__box__title">
                  {notSave ? 'Lưu công việc' : 'Huỷ lưu công việc'}
                </div>
              </div>
            )}
            {/* <div className="advertisement">
                            <img src={qc} alt="" />
                        </div> */}
            <div className="box__keyTag">
              <KeyTag />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
