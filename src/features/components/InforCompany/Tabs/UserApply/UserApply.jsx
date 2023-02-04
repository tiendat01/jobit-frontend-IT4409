import { Modal, Popover } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'

import workApplyApi from '../../../../../api/workApplyApi'
import SpinLoad from '../../../Spin/Spin'
import sendMailApi from '../../../../../api/sendMailApi'

import '../../../../scss/InforCompany/UserApply.scss'

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

export default function UserApply({ id }) {
  const [data, setData] = useState()
  console.log('data', data)
  const [numReload, setNumReload] = useState(1)
  const [state, setState] = useState({
    isModalUserVisible: false,
    titleModal: '',
    date: new Date(),
    textSendMail: '',
    email: '',
    userId: '',
    workId: '',
  })

  const {
    isModalUserVisible,
    titleModal,
    textSendMail,
    email,
    date,
    userId,
    workId,
  } = state

  const getApi = async () => {
    await workApplyApi.checkWorkApply(id).then((data) => {
      setData(data.Works)
    })
  }

  const handleOk = () => {
    setState({ ...state, isModalUserVisible: false })
    sendMailApi.send({
      email,
      textSendMail,
      // sechedule: moment(date).format("DD/MM/YYYY"),
    })
    // workApplyApi
    //     .editworkApply({ userId, workId })
    //     .then((data) => {
    //         setNumReload((prev) => prev + 1);
    //     });
  }

  const handleCancel = () => {
    setState({ ...state, isModalUserVisible: false })
  }

  const handleClickContact = (name, email, userId, workId) => {
    setState({
      ...state,
      isModalUserVisible: true,
      titleModal: `Bạn đang liên hệ với ứng viên ${name}`,
      email,
      userId,
      workId,
    })
  }

  const statusDisplay = (status) => {
    switch (status) {
      case STATUS.APPLIED:
        return 'Mới ứng tuyển'
      case STATUS.INTERVIEW:
        return 'Chờ phỏng vấn'
      case STATUS.ACCEPTED:
        return 'Đã nhận việc'
      case STATUS.REJECTED:
        return 'Đã từ chối'
      default:
        return 'Lỗi'
    }
  }

  const handleChangeStatus = (userId, workId, status) => {
    var data = JSON.stringify({
      userId: userId,
      workId: workId,
      status: status,
    })
    workApplyApi.editworkApply(data)

    window.location.reload()
  }

  // const onChangeDate = (date, dateString) => {
  //   if (dateString) {
  //     setState({
  //       ...state,
  //       date: dateString,
  //     })
  //   }
  // }

  const handleOnchaneTextSendMail = (e) => {
    const { value } = e.target
    setState({
      ...state,
      textSendMail: value,
    })
  }

  useEffect(() => {
    getApi()
  }, [numReload])

  let styleTextarea = {
    width: '100%',
    resize: 'none',
    borderRadius: '6px',
    padding: '10px 20px',
  }
  return (
    <div className="userApply">
      <div className="heading">
        <div className="heading__title">
          <h3>Ứng viên ứng tuyển</h3>
        </div>
        <div className="heading__hr"></div>
      </div>

      <div className="content">
        {!data ? (
          <SpinLoad />
        ) : (
          data.map((ok, index) => (
            <div className="content___box" key={index}>
              <div className="content___box--title">
                <Link to={`jobs/work/${ok.id}`} className="text-dark">
                  {ok.name}
                </Link>
              </div>
              <div className="hr"></div>
              <div className="content___box---user">
                <div className="row">
                  {ok.workapply2.length === 0 ? (
                    <p className="text-danger">Chưa có ứng viên ứng tuyển</p>
                  ) : (
                    ok.workapply2.map((oki, index) => (
                      <div className="user-container col-md-12" key={index}>
                        <div className="d-flex">
                          <div className="content___box---user---img">
                            <Link to={`candidates/${oki.id}`}>
                              <img
                                alt="avatar"
                                src={oki.avatar}
                                title={oki.name}
                                width={130}
                              />
                            </Link>
                          </div>
                          <div className="content___box---user---infor position-relative">
                            <table>
                              <tbody>
                                <tr>
                                  <td className="td">Tên người dùng</td>
                                  <td>{oki.name}</td>
                                </tr>
                                <tr>
                                  <td className="td">Địa chỉ</td>
                                  <td>{oki.address}</td>
                                </tr>
                                <tr>
                                  <td className="td">Email</td>
                                  <td>{oki.email}</td>
                                </tr>
                                <tr>
                                  <td className="td">Điện thoại</td>
                                  <td>{oki.phone}</td>
                                </tr>
                                <tr>
                                  <td className="td">Giới tính</td>
                                  <td>{oki.male}</td>
                                </tr>
                                {oki.WorkApplies.sechedule && (
                                  <tr>
                                    <td className="td">Lịch phỏng vấn</td>
                                    <td>
                                      {moment(oki.WorkApplies.sechedule).format(
                                        'DD/MM/yyyy'
                                      )}
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>

                            <div className="status-container">
                              <span
                                style={{
                                  color: statusColor[oki?.WorkApplies?.status],
                                }}
                              >
                                {statusDisplay(oki?.WorkApplies?.status)}
                              </span>

                              {oki?.WorkApplies?.status === STATUS.INTERVIEW ? (
                                <Popover content="Video call meeting">
                                  <Link
                                    to={{
                                      pathname: '/interview',
                                      state: {
                                        companyId: id,
                                        candidateId: oki.id,
                                        workApplyId: ok.id
                                      },
                                    }}
                                  >
                                    <button className="btn-videocall">
                                      <i className="fas fa-video"></i>
                                    </button>
                                  </Link>
                                </Popover>
                              ) : null}

                              <Popover
                                content={oki.WorkApplies.message}
                                title="Lời nhắn"
                              >
                                <button className="btn-message">
                                  <i className="fas fa-comment-dots"></i>
                                </button>
                              </Popover>
                            </div>

                            <div className="btn-userApply">
                              <button
                                className={`btn-link ${
                                  oki.WorkApplies.status === STATUS.APPLIED
                                    ? ''
                                    : 'hidden'
                                }`}
                                onClick={(e) => {
                                  e.preventDefault()
                                  handleChangeStatus(
                                    oki.id,
                                    ok.id,
                                    STATUS.INTERVIEW
                                  )
                                }}
                              >
                                Chấp nhận phỏng vấn
                              </button>

                              <button
                                className={`btn-link ${
                                  oki.WorkApplies.status === STATUS.INTERVIEW
                                    ? ''
                                    : 'hidden'
                                }`}
                                onClick={(e) => {
                                  e.preventDefault()
                                  handleChangeStatus(
                                    oki.id,
                                    ok.id,
                                    STATUS.ACCEPTED
                                  )
                                }}
                              >
                                Nhận việc
                              </button>

                              <button
                                className={`btn-link ${
                                  oki.WorkApplies.status === STATUS.APPLIED ||
                                  oki.WorkApplies.status === STATUS.INTERVIEW
                                    ? ''
                                    : 'hidden'
                                }`}
                                onClick={(e) => {
                                  e.preventDefault()
                                  handleChangeStatus(
                                    oki.id,
                                    ok.id,
                                    STATUS.REJECTED
                                  )
                                }}
                              >
                                Từ chối
                              </button>

                              {/* {!oki.WorkApplies.sechedule && ( */}
                              <button
                                className={`btn-link ${
                                  oki.WorkApplies.status === STATUS.REJECTED || oki.WorkApplies.status === STATUS.ACCEPTED
                                    ? 'hidden'
                                    : ''
                                }`}
                                onClick={() =>
                                  handleClickContact(
                                    oki.name,
                                    oki.email,
                                    oki.id,
                                    ok.id
                                  )
                                }
                              >
                                Liên hệ ngay
                              </button>
                              {/* // )} */}
                              {oki.WorkApplies.link && (
                                <button
                                  className="btn-link"
                                  onClick={() => {
                                    window.open(oki.WorkApplies.link)
                                  }}
                                >
                                  Xem CV
                                </button>
                              )}
                            </div>
                            <Modal
                              title={titleModal}
                              open={isModalUserVisible}
                              onOk={handleOk}
                              onCancel={handleCancel}
                            >
                              {/* <p>
                                Lịch phỏng vấn:{' '}
                                <Space direction="vertical" className="w-100">
                                  <DatePicker
                                    onChange={onChangeDate}
                                    className="form-control input-ant"
                                    value={moment(
                                      date ?? new Date(),
                                      'YYYY-MM-DD'
                                    )}
                                  />
                                </Space>
                              </p> */}
                              <p>Lời nhắn:</p>
                              <textarea
                                className="box-textarea"
                                name=""
                                placeholder="Điền các thông tin ứng tuyển cho ứng viên và đừng quên lịch phỏng vấn cụ thể"
                                value={textSendMail}
                                onChange={handleOnchaneTextSendMail}
                                rows="11"
                                style={styleTextarea}
                              ></textarea>
                            </Modal>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
