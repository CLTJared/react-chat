import { useState, useRef, useEffect, useMemo } from 'react';
import { io } from 'socket.io-client';

const URL = process.env.NODE_ENV === 'production' ? process.env.SITEURL : 'http://localhost:4000';
export const socket = io.connect(URL);

function App() {
  const [chatConnected, setChatConnected] = useState(socket.connected);
  const [chatMessages, setChatMessage] = useState([]);
  const [chatUsers, setChatUsers] = useState([]);
  const whoami = socket.id;
  const chatNickname = useRef();
  const chatMessage = useRef();
  const NewUserCheck = useRef();
  const NewMsgCheck = useRef();

  const connectChat = () => {
    socket.connect()
    setChatConnected(true)
  };
  const disconnectChat = () => {
    socket.disconnect()
    setChatConnected(false)
    setChatUsers([])
    chatNickname.current.value = ''
  };


  const handleNewChat = (e) => {
    e.preventDefault();

    //keep user from submitting blank message
    if(chatMessage.current.value.trim() === '') return 0;

    const d = new Date()

    socket.emit('messages', {
      id: crypto.randomUUID(),
      nickname: chatNickname.current.value,
      message: chatMessage.current.value,
      socketID: socket.id,
      time: ('0'+d.getHours()).slice(-2) + ":" + ('0'+d.getMinutes()).slice(-2),
    })

    e.target.reset();
  }

const newSound = (type, freq, gain, len) => {
  // one context per document
  var context = new (window.AudioContext || window.webkitAudioContext)();
  var osc = context.createOscillator(); // instantiate an oscillator
  var vol = context.createGain();
  osc.type = type; // this is the default - also square, sawtooth, triangle
  osc.frequency.value = freq; // Hz
  vol.gain.value = 0;
  vol.gain.value = gain;

  osc.connect(vol); // set the volume
  vol.connect(context.destination) // connect it to the destination
  osc.start(); // start the oscillator
  osc.stop(context.currentTime + len);
}

  const handleNickname = (e) => {
    e.preventDefault();
    socket.emit('userUpdate', {
      id: socket.id,
      nickname: chatNickname.current.value
    })
  }

  useEffect(() => {
    socket.on('msgResponse', (data) => {
      setChatMessage([...chatMessages, data])
      if(NewMsgCheck.current.checked) newSound('triangle', 510, .005, .25)
    })
    
    socket.on('userList', (data) => {
      setChatUsers(data)
      if(NewUserCheck.current.checked) newSound('sine', 400, .02, .05)
    })
  }, [socket, chatMessages, chatUsers])


  useEffect(() => {
    setChatConnected(socket.connected)
  }, [])

  return (
    <>
      {/* Make Nav Component */}
      <nav>
        <div className="sidenav">
            <input type="text" placeholder={whoami} ref={chatNickname} disabled={!chatConnected} onBlur={handleNickname} onKeyPress={(e) => { if(e.key === 'Enter') {e.target.blur()} }} />
          <div className="__chat_connect">
            <p>Connected: {chatConnected ? '🟢' : '🔴'}</p>
            {!chatConnected ? <button className="btn full-width" onClick={connectChat}>Connect</button> : <button className="btn full-width" onClick={disconnectChat}>Disconnect</button>}
          </div>
          <br />
          <input type="checkbox" id="collapsible-group" defaultChecked /><label htmlFor="collapsible-group" className="arrow" >Chat Users</label>
          <div className="__chat_info">
            {chatUsers.map((data, index) => <p name="user" key={index}>{data.nickname !== '' ? data.nickname : data.id}</p>)}
          </div>
          <div>
            <hr />
            <div id="__chat_options">
              <h5>Notifications</h5>
              <label htmlFor="NewMsg"><input ref={NewMsgCheck} type="checkbox" id="NewMsg" defaultChecked />New Message</label>
              <label htmlFor="NewUser"><input ref={NewUserCheck} type="checkbox" id="NewUser" defaultChecked />New User</label>
            </div>
          </div>
        </div>
      </nav>
      {/* End Nav Component */}

      {/* Body Content */}
      <section>
        <div>
          <form onSubmit={handleNewChat}>
            <input ref={chatMessage} type="text" placeholder="Enter your message..." disabled={!chatConnected} />
          </form>
        </div>
        <br />
        <div style={{paddingTop: '.5rem' }}>
          {chatMessages.map((chat, index) => chat.socketID === whoami ? <div name="chat-bubble" key={index} className="out" title={chat.socketID}><span className="username">{chat.nickname !== '' ? chat.nickname : chat.socketID} | {chat.time}</span>{chat.message}</div> : <div name="chat-bubble" key={index} className="in"><span className="username">{chat.nickname !== '' ? chat.nickname : chat.socketID} | {chat.time}</span>{chat.message}</div>)}
        </div>
      </section>
      {/* End Body Content */}
    </>
  );
}

export default App