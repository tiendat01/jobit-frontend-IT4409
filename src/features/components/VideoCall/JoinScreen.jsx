import { useState } from 'react'

export default function JoinScreen({
  updateMeetingId,
  getMeetingAndToken,
  role,
}) {
  const [input, setInput] = useState(null)

  const render = () => {
    console.log(role)
    if (role === 'company') {
      return (
        <>
          <input
            type="text"
            placeholder="Enter Meeting ID"
            onChange={(e) => {
              setInput(e.target.value)
              updateMeetingId(e.target.value)
            }}
          />
          <button
            className="btn join"
            onClick={getMeetingAndToken}
            disabled={!input}
          >
            Join
          </button>
          <button className="btn create" onClick={getMeetingAndToken}>
            Create Meeting
          </button>
        </>
      )
    } else if (role === "user") {
      return (
        <>
          <input
            type="text"
            placeholder="Enter Meeting ID"
            onChange={(e) => {
              setInput(e.target.value)
              updateMeetingId(e.target.value)
            }}
          />
          <button
            className="btn join"
            onClick={getMeetingAndToken}
            disabled={!input}
          >
            Join
          </button>
        </>
      )
    } else {
      return (
        <h6>Ẩn danh không truy cập được</h6>
      )
    }
  }

  return (
    <div className="box">
      <h2
        style={{
          margin: '0 auto',
        }}
      >
        Online Meeting
      </h2>
      {render()}
    </div>
  )
}
