import React, { useEffect, useState } from 'react'
import { MeetingProvider, MeetingConsumer } from '@videosdk.live/react-sdk'
import { getToken, createMeeting } from './api'
import './VideoCall.scss'
import { useHistory } from 'react-router-dom'

import MeetingGrid from './MeetingGrid'
import JoinScreen from './JoinScreen'
import checkLoginApi from '../../../api/checkLoginApi'

function VideoCall() {
  document.body.style.backgroundColor = '#f5f5f5'
  const history = useHistory()
  console.log(history.location.state)

  const [token, setToken] = useState(null)
  const [meetingId, setMeetingId] = useState(null)

  const [micEnabled, setMicEnabled] = useState(true)
  const [webcamEnabled, setWebcamEnabled] = useState(true)
  const [displayName, setDisplayName] = useState('User 1')
  const [role, setRole] = useState('')

  useEffect(() => {
    document.body.style.backgroundColor = '#f5f5f5'
    checkLoginApi.checkLogin().then(
      (res) => {
        setRole(res.data.user.type)
      }
    )
  })

  useEffect(() => {
    return () => {
      document.body.style.backgroundColor = '#fff'
    }
  }, [])
  const getMeetingAndToken = async () => {
    const token = await getToken()
    setToken(token)
    setMeetingId(meetingId ? meetingId : await createMeeting({ token }))
  }
  const updateMeetingId = (meetingId) => {
    setMeetingId(meetingId)
  }
  const updateMicEnabled = (micEnabled) => {
    setMicEnabled(micEnabled)
  }
  const updateWebcamEnabled = (webcamEnabled) => {
    setWebcamEnabled(webcamEnabled)
  }
  const updateDisplayName = (displayName) => {
    setDisplayName(displayName)
  }

  

  return (
    <div className="video-call-container">
      {token && meetingId ? (
        <MeetingProvider
          config={{
            meetingId,
            micEnabled: micEnabled,
            webcamEnabled: webcamEnabled,
            name: displayName,
          }}
          token={token}
        >
          <MeetingConsumer>
            {() => (
              <MeetingGrid
                meetingId={meetingId}
                getMeetingAndToken={getMeetingAndToken}
                updateDisplayName={updateDisplayName}
                updateMicEnabled={updateMicEnabled}
                updateWebcamEnabled={updateWebcamEnabled}
                role={role}
                companyId={history.location.state?.companyId || '-1'}
                candidateId={history.location.state?.candidateId || '-1'}
                workId={history.location.state?.workApplyId || '-1'}
              />
            )}
          </MeetingConsumer>
        </MeetingProvider>
      ) : (
        <JoinScreen
          updateMeetingId={updateMeetingId}
          getMeetingAndToken={getMeetingAndToken}
          role={role}
        />
      )}
    </div>
  )
}

export default VideoCall
