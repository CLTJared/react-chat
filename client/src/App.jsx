import { useState, useRef, useEffect } from 'react';
import { socket } from './components/socket';

function App() {
  const [chatConnected, setChatConnected] = useState(socket.connected);
  const [chatMessages, setChatMessage] = useState([]);
  const [chatUsers, setChatUsers] = useState([]);
  const whoAmI = socket.id;
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
  };

  const handleNewChat = (e) => {
    e.preventDefault();

    //keep user from submitting blank message
    if(chatMessage.current.value.trim() === '') return 0;

    const d = new Date()

    socket.emit('messages', {
      id: crypto.randomUUID(),
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
  vol.gain.value = gain;

  osc.connect(vol); // set the volume
  vol.connect(context.destination) // connect it to the destination
  osc.start(); // start the oscillator
  osc.stop(context.currentTime + len);
}

  useEffect(() => {
    setChatConnected(socket.connected)
  })

  useEffect(() => {
    socket.on('msgResponse', (data) => setChatMessage([...chatMessages, data]))
    if(NewMsgCheck.current.checked) newSound('triangle', 510, .005, .25)
  }, [socket, chatMessages])

  useEffect(() => {
    socket.on('userList', (data) => setChatUsers(data))
    if(NewUserCheck.current.checked) newSound('sine', 935, .02, .25)
  }, [chatUsers])

  return (
    <>
      {/* Make Nav Component */}
      <nav>
        <div className="sidenav">
          <h5>{whoAmI}</h5>
          <div className="__chat_connect">
            <p>Connected: {chatConnected ? '🟢' : '🔴'}</p>
            {!chatConnected ? <button className="btn full-width" onClick={connectChat}>Connect</button> : <button className="btn full-width" onClick={disconnectChat}>Disconnect</button>}
          </div>
          <br />
          <input type="checkbox" id="collapsible-group" defaultChecked /><label htmlFor="collapsible-group" className="arrow" >Chat Users</label>
          <div className="__chat_info">
            {chatUsers.map((data, index) => <p name="user" key={index}>{data.id}</p>)}
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
          {chatMessages.map((chat, index) => chat.socketID === whoAmI ? <div name="chat-bubble" key={index} className="out"><span className="username">{chat.socketID} | {chat.time}</span>{chat.message}</div> : <div name="chat-bubble" key={index} className="in"><span className="username">{chat.socketID} | {chat.time}</span>{chat.message}</div>)}
        </div>
      </section>
      {/* End Body Content */}
    </>
  );
}

export default App