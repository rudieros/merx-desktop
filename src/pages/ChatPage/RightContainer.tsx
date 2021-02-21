import { Avatar, CardContent, CardHeader, Grid, IconButton } from '@material-ui/core'
import ImageIcon from '@material-ui/icons/Image'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import { ChatFeed, Message } from 'react-chat-ui'
import React from 'react'

const title = 'Diego'
const changeName = () => {
  CardHeader.title = 'Jairo'
}
export const RightContainer = ({ classes }) => (
  <Grid className={classes.heightAdjust} item xs={9}>
    <CardHeader
      avatar={
        <Avatar aria-label="Recipe" className={classes.avatar}>
          <ImageIcon onClick={changeName}/>
        </Avatar>
      }
      action={
        <IconButton>
          <MoreVertIcon/>
        </IconButton>
      }
      title={title}
    />
    <CardContent className={[classes.rightContainer, classes.content]}>
      <ChatFeed
        messages={[
          new Message({
            id: 1,
            message: 'I\'m the recipient! (The person you\'re talking to)',
          }),
          new Message({ id: 0, message: 'I\'m you -- the blue bubble!' }),
        ]}
        isTyping={false}
        hasInputField={false}
        showSenderName
        bubblesCentered={false}
      />
    </CardContent>
  </Grid>
)
