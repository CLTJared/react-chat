import { useState, useRef, useEffect } from 'react';
import { socket } from './components/socket';

function App() {
  const [chatConnected, setChatConnected] = useState(socket.connected);
  const [chatMessages, setChatMessage] = useState([]);
  const [chatUsers, setChatUsers] = useState([]);
  const whoAmI = socket.id;
  const chatMessage = useRef();

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

    const d = new Date()

    socket.emit('messages', {
      id: crypto.randomUUID(),
      message: chatMessage.current.value,
      socketID: socket.id,
      time: ('0'+d.getHours()).slice(-2) + ":" + ('0'+d.getMinutes()).slice(-2),
    })

    e.target.reset();
  }

  useEffect(() => {
    setChatConnected(socket.connected)
  })

  useEffect(() => {
    socket.on('msgResponse', (data) => setChatMessage([...chatMessages, data]))
  }, [socket, chatMessages])

  useEffect(() => {
    socket.on('userList', (data) => setChatUsers(data))
  }, [])

  return (
    <>
      {/* Make Nav Component */}
      <nav>
        <div className="sidenav">
          <h5>{whoAmI}</h5>
          <div className="__chat_connect">
            <p>Connected: {chatConnected ? '🟢' : '🔴'}</p>
            {!chatConnected ? <button className="btn" onClick={connectChat}>Connect</button> : <button className="btn" onClick={disconnectChat}>Disconnect</button>}
          </div>
          <br />
          <input type="checkbox" id="collapsible-group" defaultChecked /><label htmlFor="collapsible-group" className="arrow" >Chat Users</label>
          <div className="__chat_info">
            {chatUsers.map((data, index) => <p name="user" key={index}>{data.id}</p>)}
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
        <div>
          {chatMessages.map((chat, index) => chat.socketID === whoAmI ? <div name="chat-bubble" key={index} className="out"><span className="username">{chat.socketID} | {chat.time}</span>{chat.message}</div> : <div name="chat-bubble" key={index} className="in"><span className="username">{chat.socketID} | {chat.time}</span>{chat.message}</div>)}
        </div>
      </section>
      {/* End Body Content */}
    </>
  );
}

export default App