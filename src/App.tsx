import React, { useEffect } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
// import './App.global.css';
import { MainPage } from './pages/MainPage';
import { MessagesPage } from './pages/MessagesPage';
import { createDatabaseConnection } from './database/createConnection';
import Flow from './entities/Flow';
import ChatPage from './pages/ChatPage'

export default function App() {
  useEffect(() => {
    createDatabaseConnection().then(async (c) => {
      const template = new Flow();
      template.name = 'ad';
      await c.getRepository(Flow).save(template);
      console.log('Opa', await c.getRepository(Flow).find());
    });
  }, []);
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={ChatPage} />
        <Route path="/messages" exact component={MessagesPage} />
      </Switch>
    </Router>
  );
}
