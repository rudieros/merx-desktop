import React, { useEffect } from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import icon from '../assets/icon.svg';
import './App.global.css';
import { Client } from 'whatsapp-web.js';
import { MainPage } from './pages/MainPage'
import { MessagesPage } from './pages/MessagesPage'

const Hello = () => {
  useEffect(() => {
    const client = new Client({});
    client.on('qr', (qr) => {
      // Generate and scan this code with your phone
      console.log('QR RECEIVED', qr);
    });

    client.on('ready', () => {
      console.log('Client is ready!');
    });

    client.on('message', (msg) => {
      console.log('Message', msg);
      if (msg.body === '!ping') {
        msg.reply('pong');
      }
    });

    client.initialize();
  });
  return (
    <div>
      <div className="Hello">
        <img width="200px" alt="icon" src={icon} />
      </div>
      <h1>electron-react-boilerplate</h1>
      <div className="Hello">
        <a
          href="https://electron-react-boilerplate.js.org/"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="books">
              📚
            </span>
            Read our docs
          </button>
        </a>
        <a
          href="https://github.com/sponsors/electron-react-boilerplate"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="books">
              🙏
            </span>
            Donate
          </button>
        </a>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={MainPage} />
        <Route path="/messages" exact component={MessagesPage} />
      </Switch>
    </Router>
  );
}
