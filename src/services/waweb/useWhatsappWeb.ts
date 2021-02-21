import { Client, ClientOptions } from 'whatsapp-web.js';
import { useLegacyState } from '../../utils/useLegacyState';
import { useCallback } from 'react';

let client: Client | undefined;

const sessionFilePath = './waweb-session.json';
const fs = require('fs');

export const useWhatsappWeb = (config: ClientOptions = {}) => {
  const [{ loading, qrCode, ready }, setState] = useLegacyState(() => ({
    loading: false,
    ready: false,
    qrCode: undefined as undefined | string,
  }));

  const initialize = useCallback(() => {
    if (!client) {
      let sessionData;
      if (fs.existsSync(sessionFilePath)) {
        sessionData = JSON.parse(fs.readFileSync(sessionFilePath).toString());
        sessionData =
          (sessionData && Object.keys(sessionData).length && sessionData) ||
          undefined;
      }
      client = new Client({
        session: sessionData,
        ...config,
        puppeteer: {
          headless: false,
          devtools: true,
        },
      });
    }
    client.on('qr', (qr) => {
      // Generate and scan this code with your phone
      console.log('QR RECEIVED', qr);
      setState({ qrCode: qr });
    });

    client.on('authenticated', (session) => {
      // const sessionData = session;
      fs.writeFile(sessionFilePath, JSON.stringify(session), function (err) {
        if (err) {
          console.error(err);
        }
      });
    });

    client.on('ready', () => {
      console.log('Client is ready!', new Date());
      setState({ loading: false, ready: true });
    });
    setState({ loading: true });
    return client.initialize();
  }, []);

  return { client, loading, qrCode, initialize, ready };
};
