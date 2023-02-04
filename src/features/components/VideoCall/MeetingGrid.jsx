import React, { useState } from 'react'
import { message, Switch, Button } from 'antd'
import { useMeeting } from '@videosdk.live/react-sdk'

import ParticipantView from './ParticipantView'

import sendMailApi from '../../../api/sendMailApi'
import userApi from '../../../api/userApi'
import companyApi from '../../../api/companyApi'
import workApi from '../../../api/workApi'

const chunk = (arr) => {
  const newArr = []
  while (arr.length) newArr.push(arr.splice(0, 3))
  return newArr
}

export default function MeetingGrid(props) {
  // video sdk
  const [joined, setJoined] = useState(false)
  const [state, setState] = useState({
    micOn: true,
    webcamOn: true,
  })
  document.body.style.backgroundColor = joined ? '#444791' : '#f5f5f5' // 444791
  const { join, leave, toggleMic, toggleWebcam, toggleScreenShare } =
    useMeeting()
  const { participants } = useMeeting()
  const joinMeeting = () => {
    setJoined(true)
    join()
  }

  const { updateDisplayName, updateMicEnabled, updateWebcamEnabled, role, companyId, candidateId, workId, meetingId } = props

  const onChangeWebcam = (checked) => {
    console.log(checked)
    setState({
      ...state,
      webcamOn: checked,
    })
    updateWebcamEnabled(checked)
  }
  const onChangeMic = (checked) => {
    console.log(checked)
    setState({
      ...state,
      micOn: checked,
    })
    updateMicEnabled(checked)
  }
  const onChangeDisplayName = (e) => {
    console.log(e.target.value)
    updateDisplayName(e.target.value)
  }

  const onCopyClick = async () => {
    if ('clipboard' in navigator) {
      await navigator.clipboard.writeText(props.meetingId)
    } else {
      document.execCommand('copy', true, props.meetingId)
    }
    message.success('Đã sao chép Meeting ID!')
  }

  const handleSendMail = async () => {
    let email = null
    let textSendMail = null

    let companyName = null
    let candidateName = null
    let workName = null

    let res = await companyApi.getOne(String(companyId))
    companyName = res.name
    res = await userApi.getOne(String(candidateId))
    email = res.email
    candidateName = res.name
    res = await workApi.getOne(workId)
    console.log(res)
    workName = res.name

    textSendMail = `Xin chào bạn ${candidateName}, thông báo từ nhà tuyển dụng từ công ty ${companyName}: 
      <br />Meeting ID: <span style="color: red; font-size: 16px;">${meetingId}</span> 
      <br />để phục vụ cho buổi phỏng vấn online đối với công việc bạn đã ứng tuyển: ${workName}.
      <br />Mong bạn sắp xếp thời gian cho buổi phỏng vấn. 
      <br />
      <br />Cảm ơn bạn đã đọc mail này, bỏ qua nếu bị làm phiền.
      <br />From JobIT
    `

    sendMailApi.send({
      email,
      textSendMail,
      // sechedule: moment(date).format("DD/MM/YYYY"),
    }).then((res) => {
      message.success("Gửi mail thành công")
    }).catch((err) => {
      message.error("Gửi mail thất bại: ", err)
    })
  }

  return (
    <>
      {joined ? (
        <div className="call-box">
          <div>
            {chunk([...participants.keys()]).map((k) => {
              return (
                <div className="participantView" key={k}>
                  {k.map((l) => (
                    <ParticipantView key={l} participantId={l} />
                  ))}
                </div>
              )
            })}
          </div>
          <div className='btn-group'>
            <Button
              onClick={() => {
                toggleMic()
                setState({
                  ...state,
                  micOn: !state.micOn,
                })
              }}
              title={!state.micOn ? 'Bật micro' : 'Tắt micro'}
              type="primary"
              shape="circle"
              icon={
                state.micOn ? (
                  <i class="fas fa-microphone"></i>
                ) : (
                  <i class="fas fa-microphone-slash"></i>
                )
              }
              size="large"
            />
            <Button
              title={!state.webcamOn ? 'Bật camera' : 'Tắt camera'}
              onClick={() => {
                toggleWebcam()
                setState({
                  ...state,
                  webcamOn: !state.webcamOn,
                })
              }}
              type="primary"
              shape="circle"
              icon={
                state.webcamOn ? (
                  <i class="fas fa-video"></i>
                ) : (
                  <i class="fas fa-video-slash"></i>
                )
              }
              size="large"
            />

            <Button
              title="Rời khỏi cuộc họp"
              onClick={() => {
                leave()
                setJoined(false)
              }}
              type="danger"
              shape="circle"
              icon={<i class="fas fa-sign-out-alt"></i>}
              size="large"
            />

            {/* <button onClick={leave}>Leave</button>
            <button onClick={toggleMic}>Toggle Mic</button>
            <button onClick={toggleWebcam}>Toggle Webcam</button>
            <button onClick={toggleScreenShare}>Toggle Screen Share</button> */}
          </div>
        </div>
      ) : (
        <div className="box">
          <h2
            style={{
              margin: '0 auto',
            }}
          >
            Online Meeting
          </h2>
          <h5>
            Meeting ID:
            <span className="wrapper">
              <span className="id">{props.meetingId}</span>
              <span className="op-group">
                <button className="op copy" title="Copy" onClick={onCopyClick}>
                  <i class="far fa-clone"></i>
                </button>
                { role === 'company' && (<button className="op send-mail" title="Send mail" onClick={handleSendMail}>
                  <i class="fas fa-paper-plane"></i>
                </button>) }
              </span>
            </span>
          </h5>

          <div className="meeting-info">
            <div className="info">
              <input
                type="text"
                placeholder="Enter display name"
                onChange={onChangeDisplayName}
              />
              <span className="btn-checkbox">
                <span>
                  <i class="fas fa-video"></i>
                  <Switch
                    className="switch"
                    defaultChecked
                    onChange={onChangeWebcam}
                  ></Switch>
                </span>
                <span style={{ marginLeft: '25px' }}>
                  <i class="fas fa-microphone"></i>
                  <Switch
                    className="switch"
                    defaultChecked
                    onChange={onChangeMic}
                  ></Switch>
                </span>
              </span>
            </div>
            <button className="btn join" onClick={joinMeeting}>
              Join
            </button>
          </div>
        </div>
      )}
    </>
  )
}

// import React, { useState } from 'react'
// import { message, Switch } from 'antd'
// import { useMeeting } from '@videosdk.live/react-sdk'

// import ParticipantView from './ParticipantView'

// const chunk = (arr) => {
//   const newArr = []
//   while (arr.length) newArr.push(arr.splice(0, 3))
//   return newArr
// }

// export default function MeetingGrid(props) {

//   // video sdk
//   const [joined, setJoined] = useState(false)
//   const { join, leave, toggleMic, toggleWebcam, toggleScreenShare } =
//     useMeeting()
//   const { participants } = useMeeting()
//   const joinMeeting = () => {
//     setJoined(true)
//     join()
//   }

//   const { updateDisplayName, updateMicEnabled, updateWebcamEnabled } = props

//   const onChangeWebcam = (checked) => {
//     console.log(checked)
//     updateWebcamEnabled(checked)
//   }
//   const onChangeMic = (checked) => {
//     console.log(checked)
//     updateMicEnabled(checked)
//   }
//   const onChangeDisplayName = (e) => {
//     console.log(e.target.value)
//     updateDisplayName(e.target.value)
//   }

//   const onCopyClick = async () => {
//     if ('clipboard' in navigator) {
//       await navigator.clipboard.writeText(props.meetingId)
//     } else {
//       document.execCommand('copy', true, props.meetingId)
//     }
//     message.success('Đã sao chép Meeting ID!')
//   }

//   return (
//     <div className="box">
//       <h2
//         style={{
//           margin: '0 auto',
//         }}
//       >
//         Online Meeting
//       </h2>
//       <h5>
//         Meeting ID:
//         <span className="wrapper">
//           <span className="id">{props.meetingId}</span>
//           <span className="op-group">
//             <button className="op copy" title="Copy" onClick={onCopyClick}>
//               <i class="far fa-clone"></i>
//             </button>
//             <button className="op send-mail" title="Send mail">
//               {/* onClick={() =>
//               handleClickContact(
//                 oki.name,
//                 oki.email,
//                 oki.id,
//                 ok.id
//               )
//             } */}
//               <i class="fas fa-paper-plane"></i>
//             </button>
//           </span>
//         </span>
//       </h5>

//       {joined ? (
//         <div>
//           <button onClick={leave}>Leave</button>
//           <button onClick={toggleMic}>Toggle Mic</button>
//           <button onClick={toggleWebcam}>Toggle Webcam</button>
//           {/* <button onClick={toggleScreenShare}>Toggle Screen Share</button> */}
//         </div>
//       ) : (
//         <div className="meeting-info">
//           <div className="info">
//             <input
//               type="text"
//               placeholder="Enter display name"
//               onChange={onChangeDisplayName}
//             />
//             <span className="btn-checkbox">
//               <span>
//                 <i class="fas fa-video"></i>
//                 <Switch
//                   className="switch"
//                   defaultChecked
//                   onChange={onChangeWebcam}
//                 ></Switch>
//               </span>
//               <span style={{ marginLeft: '25px' }}>
//                 <i class="fas fa-microphone"></i>
//                 <Switch
//                   className="switch"
//                   defaultChecked
//                   onChange={onChangeMic}
//                 ></Switch>
//               </span>
//             </span>
//           </div>
//           <button className="btn join" onClick={joinMeeting}>
//             Join
//           </button>
//         </div>
//       )}

//       <div>
//         {chunk([...participants.keys()]).map((k) => {
//           return (
//             <div key={k}>
//               {k.map((l) => (
//                 <ParticipantView key={l} participantId={l} />
//               ))}
//             </div>
//           )
//         })}
//       </div>
//     </div>
//   )
// }
