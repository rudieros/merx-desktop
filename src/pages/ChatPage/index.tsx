import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Card, Grid, } from '@material-ui/core'
import { styles } from './styles'
import { LeftContainer } from './LeftContainer'
import { RightContainer } from './RightContainer'

const Index = ({ classes }) => (
  <Grid container className={classes.root}>
    <Grid item xs={12}>
      <Card className={classes.card}>
        <Grid container>
          <LeftContainer classes={classes} />
          <RightContainer classes={classes} />
        </Grid>
      </Card>
    </Grid>
  </Grid>
);

export default withStyles(styles)(Index);
