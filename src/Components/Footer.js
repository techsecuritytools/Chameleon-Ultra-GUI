import React from 'react';
import { Toolbar, Typography, IconButton, AppBar, Button } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import GitHubIcon from '@mui/icons-material/GitHub';
import Box from '@mui/material/Box';



const Footer = () => {
  return (

    <div style={{ position: 'fixed', bottom: 0,width: '100%',  flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#134900' }}>
      <Box>
      <br></br>
      <Button variant="text" style={{color: 'white'}}>Credits</Button>
      <Button variant="text" style={{color: 'white'}}>Information</Button>
      <Button variant="text" style={{color: 'white'}}>About us</Button>
      <Toolbar >
      <Typography variant="body1" color="white">
          Follow us:
        </Typography>
          <IconButton style={{color: 'white'}}>
            <GitHubIcon />
          </IconButton>
          <IconButton style={{color:'white'}}>
            <YouTubeIcon />
          </IconButton>
          <IconButton  style={{color: 'white'}}>
            <InstagramIcon/>
          </IconButton>
      </Toolbar>
      </Box>
      

      </div>
  );
}

export default Footer;

