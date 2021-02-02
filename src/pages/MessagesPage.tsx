import React, { useEffect, useState } from 'react';
import { Box, Divider, Fade, Typography } from '@material-ui/core';
import { useWhatsappWeb } from '../services/waweb/useWhatsappWeb';
import { RouteComponentProps } from 'react-router';
import { Message } from 'whatsapp-web.js';

export const MessagesPage: React.FC<RouteComponentProps> = ({ history }) => {
  const { client } = useWhatsappWeb();
  const [messagesSent, setMessagesSent] = useState([] as Message[]);
  const [messagesReceived, setMessagesReceived] = useState([] as Message[]);
  useEffect(() => {
    if (!client) {
      history.push('/');
    } else {
      console.log('Listening for messages');
      client.on('message', (m) => {
        console.log('m', m);
        setMessagesReceived((om) => [m, ...om]);
      });
      client.on('message_create', (m) => {
        console.log('message_create', m);
        setMessagesSent((om) => [m, ...om]);
      });
    }
  }, []);
  return (
    <Fade in>
      <Box>
        <Typography>Aqui você pode ver todas as mensagens</Typography>
        <Typography>Recebidas:</Typography>
        <Divider />
        <Box height="200px" overflow="scroll">
          {messagesReceived.map((m) => {
            return <Typography>{`${m.author}: ${m.body}`}</Typography>;
          })}
        </Box>

        <Typography>Enviadas:</Typography>
        <Divider />
        <Box height="200px" overflow="scroll">
          {messagesSent.map((m) => {
            return <Typography>{`${m.body}`}</Typography>;
          })}
        </Box>
      </Box>
    </Fade>
  );
};
