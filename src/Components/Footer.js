import React from 'react';
import { useState } from 'react';
import { Toolbar, Typography, IconButton, Button } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import GitHubIcon from '@mui/icons-material/GitHub';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '4px solid #134900',
    boxShadow: 24,
    p: 4,
  };


const Footer = () => {
    //Modals in footer
    const [openCredits, setOpenCredits] = useState(false);

    const [openInformation, setOpenInformation]= useState(false);

    const [openAbout, setOpenAbout]= useState(false);

    const handleOpenCredits = () => {setOpenCredits(true)};
    const handleCloseCredits = () => {setOpenCredits(false)};

    const handleOpenInformation = () => {setOpenInformation(true)};
    const handleCloseInformation = () => {setOpenInformation(false)};

    const handleOpenAbout = () => {setOpenAbout(true)};
    const handleCloseAbout = () => {setOpenAbout(false)};
  

    return (
    <div style={{ position: 'fixed', bottom: 0,width: '100%',  flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#134900' }}>
      <Box>
      <br></br>
      <Button onClick={handleOpenCredits} variant="text" sx={{color: 'white'}}>Credits</Button>
      <Button onClick={handleOpenInformation} variant="text" sx={{color: 'white'}}>Information</Button>
      <Button onClick={handleOpenAbout} variant="text" sx={{color: 'white'}}>About us</Button>
      <Toolbar >
      <Typography variant="body1" color="white">
          Follow us:
        </Typography>
          <IconButton component="a" href="https://github.com/techsecuritytools" target="_blank" rel="noopener noreferrer" style={{color: 'white'}}>
            <GitHubIcon />
          </IconButton>
          <IconButton component="a" href="https://www.youtube.com/@TechSecurityTools" target="_blank" rel="noopener noreferrer" style={{color:'white'}}>
            <YouTubeIcon />
          </IconButton>
          <IconButton component="a" href="https://www.instagram.com/techsecuritytools/" target="_blank" rel="noopener noreferrer" style={{color: 'white'}}>
            <InstagramIcon/>
          </IconButton>
      </Toolbar>
      </Box>
      <Modal
      open={openCredits}
      onClose={handleCloseCredits}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      >
      <Box sx={style}>
      <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ textAlign: "center"}}>
      Credits
      </Typography>
      <Typography id="modal-modal-description" sx={{ mt: 2 }} >
        First we would like to thank taichunmin for building the SDK to communicate with the Chameleon Ultra.<br></br>
        
        <GitHubIcon /><b>taichunmin</b><br></br>
        <br></br>
        Second of all we would like to thank the developers behind the Chameleo Ultra GUI App.<br></br>
        <GitHubIcon /><b>GameTec-live</b><br></br>
        <GitHubIcon /><b>Foxushka</b><br></br>
        <GitHubIcon /><b>Augusto Zanellato</b><br></br>
        <GitHubIcon /><b>Thomas Cannon, Akisame, Andres Ruz Nieto</b><br></br><br></br>
        Of course the Rfidresearchgroup and Proxgrind.<br></br>
        <GitHubIcon /><b>Rfidresearchgroup</b><br></br><br></br>
        Philippe Teuwen, Iceman, xianglin1998, and everyone n the RFID Hacking community.<br></br>
        <GitHubIcon /><b>doegox</b><br></br>
        <GitHubIcon /><b>Iceman</b><br></br>
        <GitHubIcon /><b>Xianglin1998</b><br></br>
       </Typography>
       <IconButton
            sx={{ position: 'absolute', top: 5, right: 5 }}
            onClick={handleCloseCredits}
          >
        <CloseIcon />
        </IconButton>
      </Box>
      </Modal>
      <Modal
      open={openInformation}
      onClose={handleCloseInformation}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <Box sx={style}>
      <Typography id="modal-modal-title" variant="h6" component="h2" sx={{textAlign: 'center'}}>
      Information
      </Typography>
      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
        Here is a list of features that we are currently working on to add to the web app:<br></br><br></br>
        <li>Adding more Mifare attacks</li>
        <li>Adding the other settings options</li>
        <li>Adding Firmware installation</li><br></br>
        Any extra feature needed or that you will like us to add you can email us at <b>support@techsecuritytools.com</b> We are also working on other webapps therefore if theres any device in particular that you will like us to take a look at let us know.Thank you!
        </Typography>
        <IconButton
            sx={{ position: 'absolute', top: 5, right: 5 }}
            onClick={handleCloseInformation}
          >
        <CloseIcon />
        </IconButton>
        </Box>
      </Modal>

      <Modal
      open={openAbout}
      onClose={handleCloseAbout}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <Box sx={{...style, textAlign: 'center'}}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
      About us
      </Typography>
      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
        This Web App was created by the Tech Security Tools Team with much love!<br></br> <br></br> We are a passionate team that specializes in programming and cybersecurity. Our goal is to help create and develop amazing cutting edge tools. Gadgets that have that "it" factor.<br></br> <br></br> You know the devices you buy and have you like WOW! this S###T'S COOL!<br></br><br></br>For more info:<br></br>You can visit our website at <a href="https://techsecuritytools.com" target="_blank">techsecuritytools.com</a>
        </Typography>
        <IconButton
            sx={{ position: 'absolute', top: 5, right: 5 }}
            onClick={handleCloseAbout}
          >
        <CloseIcon />
        </IconButton>
        </Box>
      </Modal>





      </div>
  );
}

export default Footer;

