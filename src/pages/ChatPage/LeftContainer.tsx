import { Avatar, CardHeader, Grid, List, ListItem, ListItemText, Paper, Typography } from '@material-ui/core'
import React from 'react'
import ImageIcon from '@material-ui/icons/Image'
import WorkIcon from '@material-ui/icons/Work'
import BeachAccessIcon from '@material-ui/icons/BeachAccess'

const list = [
  { id: 1, name: 'Diego', text: 'Olá mundo', image: <ImageIcon/> },
  { id: 2, name: 'Jairo', text: 'Boa tarde', image: <WorkIcon/> },
  { id: 3, name: 'Willian', text: 'Boa noite', image: <WorkIcon/> },
  {
    id: 4,
    name: 'Jorge',
    text: 'Material-ui its good',
    image: <BeachAccessIcon/>,
  },
]
export const LeftContainer = ({ classes }) => (
  <Grid item xs={3}>
    <CardHeader
      className={classes.rightBorder}
      avatar={
        <Avatar aria-label="Recipe" clasName={classes.avatar}>
          J
        </Avatar>
      }
      title="Jairo Arcy"
    />
    <Paper className={classes.paper} elevation={0}>
      <Typography className={classes.information} variant="subheader">
        Aproveite o WhatsApp!
      </Typography>
    </Paper>
    <List>
      {list.map((item) => (
        <ListItem>
          <Avatar>{item.image}</Avatar>
          <ListItemText primary={item.name} secondary={item.text}/>
        </ListItem>
      ))}
    </List>
  </Grid>
)
