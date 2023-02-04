import React, { useEffect, useRef } from 'react'
import {
  useParticipant,
} from '@videosdk.live/react-sdk'
import './VideoCall.scss'

export default function ParticipantView(props) {
  const webcamRef = useRef(null)
  const micRef = useRef(null)
  const screenShareRef = useRef(null)

  const {
    displayName,
    webcamStream,
    micStream,
    screenShareStream,
    webcamOn,
    micOn,
    screenShareOn,
  } = useParticipant(props.participantId)

  useEffect(() => {
    if (webcamRef.current) {
      if (webcamOn) {
        const mediaStream = new MediaStream()
        mediaStream.addTrack(webcamStream?.track)

        webcamRef.current.srcObject = mediaStream
        webcamRef.current.play().catch((e) => {
          console.log('videoElm.current.play() failed', e)
        })
      } else {
        webcamRef.current.srcObject = null
      }
    }
  }, [webcamStream, webcamOn])

  useEffect(() => {
    if (micRef.current) {
      if (micOn) {
        const mediaStream = new MediaStream()
        mediaStream.addTrack(micStream?.track)

        micRef.current.srcObject = mediaStream
        micRef.current.play().catch((e) => {
          console.log('videoElm.current.play() failed', e)
        })
      } else {
        micRef.current.srcObject = null
      }
    }
  }, [micStream, micOn])

  useEffect(() => {
    if (screenShareRef.current) {
      if (screenShareOn) {
        const mediaStream = new MediaStream()
        mediaStream.addTrack(screenShareStream?.track)

        micRef.current.srcObject = mediaStream
        micRef.current.play().catch((e) => {
          console.log('videoElm.current.play() failed', e)
        })
      } else {
        screenShareRef.current.srcObject = null
      }
    }
  }, [screenShareStream, screenShareOn])

  return (
    <div className='participant' key={props.participantId}>
      <audio ref={micRef} autoPlay />
      {webcamRef || micOn ? (
        <>
          <h5 style={{
            margin: '0 auto',
            color: '#fff',
            textAlign: 'center'
          }}>{displayName}</h5>
          <video height={'100%'} width={'100%'} ref={webcamRef} autoPlay />
        </>
      ) : null}

      {/* {screenShareOn ? (
        <div>
          <h2>Screen Shared</h2>
          <video height={'100%'} width={'100%'} ref={screenShareRef}
           autoPlay />
        </div>
      ) : null}

      <br />
 */}
      {/* <span>Mic: {micOn ? "Yes" : "No"}, Camera: {webcamOn ? "Yes" : "No"}, Screen Share: {screenShareOn ? "Yes" : "No"}</span> */}
    </div>
  )
}