import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Fade,
  Typography,
} from '@material-ui/core';
import { useWhatsappWeb } from '../services/waweb/useWhatsappWeb';
import QRCode from 'react-qr-code';
import { RouteComponentProps } from 'react-router';

const ANIMATION_MILLIS = 300;

export enum PagePhase {
  INITIAL,
  LOADING_QRCODE,
  QRCODE_READY,
}

export const MainPage: React.FC<RouteComponentProps> = ({ history }) => {
  const {
    initialize,
    loading: loadingWAWeb,
    qrCode,
    ready: waReady,
  } = useWhatsappWeb();
  const [phase, setPhase] = useState(
    PagePhase.INITIAL as PagePhase | undefined
  );

  const changePhase = useCallback((newPhase: PagePhase) => {
    setPhase(undefined);
    setTimeout(() => {
      setPhase(newPhase);
    }, ANIMATION_MILLIS);
  }, []);

  useEffect(() => {
    if (loadingWAWeb) {
      changePhase(PagePhase.LOADING_QRCODE);
    }
  }, [loadingWAWeb]);

  useEffect(() => {
    if (qrCode && phase !== PagePhase.QRCODE_READY) {
      changePhase(PagePhase.QRCODE_READY);
    }
  }, [qrCode, phase]);

  useEffect(() => {
    if (waReady) {
      setPhase(undefined);
      setTimeout(() => {
        history.push('/messages');
      }, ANIMATION_MILLIS);
    }
  }, [waReady]);

  return (
    <div>
      <Fade
        in={phase === PagePhase.INITIAL}
        timeout={ANIMATION_MILLIS}
        unmountOnExit
      >
        <Box>
          <Typography variant="h1">MERX</Typography>
          <Typography>Seu companheiro para atendimento!</Typography>
          <Box my={4} />
          <Typography align="center" variant="h6">
            Vamos lá?
          </Typography>
          <Box my={4} />
          <Button size="large" fullWidth onClick={initialize}>
            começar
          </Button>
        </Box>
      </Fade>
      <Fade
        in={phase === PagePhase.LOADING_QRCODE}
        timeout={ANIMATION_MILLIS}
        unmountOnExit
      >
        <Box>
          <Typography align="center" variant="h6">
            Carregando seu QR Code...
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="center" m={2}>
            <CircularProgress size={72} color="inherit" />
          </Box>
        </Box>
      </Fade>

      <Fade
        in={phase === PagePhase.QRCODE_READY}
        timeout={ANIMATION_MILLIS}
        unmountOnExit
      >
        <Box mx={8}>
          <Typography align="center" variant="h6">
            Use seu aplicativo WhatsApp para escanear o QR Code abaixo
          </Typography>
          <Typography align="center" variant="body1">
            Lembre-se que você não poderá entrar no WhtasApp Web da maneira
            convencional!
          </Typography>
          <Typography align="center" variant="body1">
            O assistente não irá funcionar nesse caso
          </Typography>
          <Box display="flex" justifyContent="center" mt={2}>
            <QRCode value={qrCode!} />
          </Box>
        </Box>
      </Fade>
    </div>
  );
};
