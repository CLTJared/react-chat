import { useState } from 'react'

function App() {

  return (
    <>
      <nav>
        <div className="sidenav">
          <input type="checkbox" id="collapsible-group" defaultChecked /><label htmlFor="collapsible-group" className="arrow" >Elliott Group</label>
          <div className="info">
            <p className="online" name="user">Jared Elliott</p>
            <p className="dnd" name="user">Jared Elliott</p>
            <p className="online" name="user">Jared Elliott</p>
            <p className="idle" name="user">Jared Elliott</p>
            <p className="away" name="user">Jared Elliott</p>
            <p className="online" name="user">Jared Elliott</p>
          </div>
        </div>

        <ul className="important">
          <li className="icon-mail">Inbox</li>
          <li className="icon-star">Favorite</li>
        </ul>

        <ul className="channels" aria-label="channels">
          <li>Design <span className="label"></span></li>
          <li>Engineering <span className="label">4</span></li>
          <li>Marketing <span className="label"></span></li>
          <li>Support <span className="label"></span></li>
          <li>Sales <span className="label"></span></li>
        </ul>
      </nav>

      <section>
        <div name="chat-bubble" className="in">
          <p name="name">bingobango <time>9:15 PM</time></p>
          <div>Lorem ipsum dolor sit amet.</div>
        </div>

        <div name="chat-bubble" className="in">
          <p name="name">bingobango <time>9:15 PM</time></p>
          <div>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Provident beatae fuga repellat vel adipisci nulla?</div>
        </div>

        <div name="chat-bubble" className="out">
          <p name="name" style={{float: 'right'}}>bangobingo <time>9:15 PM</time></p>
          <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti, natus.</div>
        </div>
        <div name="chat-bubble" className="in">
          <p name="name">bingobango <time>9:15 PM</time></p>
          <div>Lorem ipsum dolor sit amet consectetur, adipisicing elit. In, vitae.</div>
        </div>
      </section>
    </>
  )
}

export default App