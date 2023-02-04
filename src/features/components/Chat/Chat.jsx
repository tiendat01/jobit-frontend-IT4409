import Talk from 'talkjs'
import { useEffect, useRef, useState } from 'react'

export default function Chat() {
  const [talkLoaded, markTalkLoaded] = useState(false)
  Talk.ready.then(() => markTalkLoaded(true))

  useEffect(() => {
    if (talkLoaded) {
      console.log('effect: create session')

      const other = new Talk.User({
        id: 'vingroup@gmail.com',
        name: 'Vingroup',
        email: 'vingroup@gmail.com',
        photoUrl:
          'https://firebasestorage.googleapis.com/v0/b/my-job-react-with-node.appspot.com/o/imagescompany%2Fs.png?alt=media&token=f13fd929-6f1e-4786-966a-f1e2a0d9afda',
        // welcomeMessage: 'Hey there! Love to chat :-)',
      })
      const me = new Talk.User({
        id: 'tuly6474@gmail.com',
        name: 'Tu Ly',
        email: 'tuly6474@gmail.com',
        photoUrl:
          'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
        // welcomeMessage: 'Hey there! How are you? :-)',
      })
      const session = new Talk.Session({
        appId: 'thrneZVP',
        me: me,
      })

      const conversation = session.getOrCreateConversation(
        Talk.oneOnOneId(me, other)
      )
      conversation.setParticipant(me)
      conversation.setParticipant(other)

      const chatbox = session.createInbox()
      chatbox.select(conversation)
      chatbox.mount(chatboxEl.current)

      return () => {
        console.log('cleanup: destroy session')
        //chatbox.destroy();
        session.destroy()
      }
    }
  }, [talkLoaded])

  console.log('render')

  const chatboxEl = useRef()
  const [width, setWidth] = useState(300)
  return (
    <>
      <div ref={chatboxEl} style={{ height: 500, width: 300 }} />
    </>
  )
}

