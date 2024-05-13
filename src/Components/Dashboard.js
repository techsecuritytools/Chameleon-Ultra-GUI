import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { Alert, Button, Dialog } from '@mui/material';
import WidgetsIcon from '@mui/icons-material/Widgets';
import CreateIcon from '@mui/icons-material/Create';
import SaveIcon from '@mui/icons-material/Save';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import WifiIcon from '@mui/icons-material/Wifi';
import Settings from './Settings';
import LowFrequencyScan from './LowFrequencyScan';
import HighFrequencyScan from './HighFrequencyScan/HighFrequencyScan';
import Footer from './Footer';

const { Slot, FreqType } = window.ChameleonUltraJS

function Dashboard(props) {
  const [alertDialog,setAlertDialog] = useState({dialog:false,message:''})

  const numberOfPapers = 8

  const generatePapersFirstRow = () => {
    let papers = [];
    for (let i = 0; i < numberOfPapers; i++) {
      papers.push(
        <Paper 
        key={i} 
        elevation={8}
        sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', border: props.chameleonInfo.isSlotsEnable[i].hf && props.chameleonInfo.isSlotsEnable[i].lf?  '2px solid red' : '2px solid green' }}>
            <h2>{props.chameleonInfo.isSlotsEnable[i].hf && props.chameleonInfo.isSlotsEnable[i].lf? ' Not Available' : 'Available'}</h2>
            <div>
                <CreditCardIcon />
                <label style={{ textDecoration: props.chameleonInfo.isSlotsEnable[i].hf > 0 ? 'underline red' : 'underline green' }}> 
                    {props.chameleonInfo.isSlotsEnable[i].hf > 0? 'MIFARE_1024' : 'UNDEFINED'}</label>
                <br />
                <WifiIcon />
                <label style={{ textDecoration: props.chameleonInfo.isSlotsEnable[i].lf > 0 ? 'underline red' : 'underline green' }}> 
                    {props.chameleonInfo.isSlotsEnable[i].lf > 0? 'EM410X' : 'UNDEFINED'}</label>
            </div>
            <div style={{ marginTop: 'auto' }}>
            <h3 style={{ margin: '0',fontWeight: 'bold',marginBottom: '20%'  }}>Slot {i + 1}</h3>
            </div>
        </Paper>
      );
    }
    return papers;
  };

  const onCloseAlertDialog = () =>{
    setAlertDialog({dialog:false,message:''})
    props.handleGetChameleonInfo()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', }}>
        <h1>Chameleon-Ultra</h1>
        <label style={{fontWeight:'bold'}}>Firmware Version : </label><label>{props.chameleonInfo.version ? props.chameleonInfo.version : ''}</label>
        <br />
        <br />
        <CreditCardIcon />
        <label style={{marginRight: '5%'}}> : High Frequency</label>

        <WifiIcon />
        <label> : Low  Frequency</label>
      </div>
      <div>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            '& > :not(style)': {
                m: 2,
                width: 250,
                height: 200,
              }
          }}
        >
          {generatePapersFirstRow()}
        </Box>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <HighFrequencyScan setAlertDialog={setAlertDialog} chameleonInfo={props.chameleonInfo} ultraUsb={props.ultraUsb} />
        <LowFrequencyScan ultraUsb={props.ultraUsb} />
        <Button variant="contained" sx={{ margin: '0 10px' }} style={{backgroundColor: 'green', color: 'white'}} endIcon={<WidgetsIcon/>}>Slot Manager</Button>
        <Button variant="contained" sx={{ margin: '0 10px' }} style={{backgroundColor: 'green', color: 'white'}} endIcon= {<SaveIcon/>}>Saved Cards</Button>
        <Button variant="contained" sx={{ margin: '0 10px' }} style={{backgroundColor: 'green', color: 'white'}} endIcon={<CreateIcon/>}>Write Card</Button>
        <Settings ultraUsb={props.ultraUsb}/>
      </div>
      <Dialog
        open={alertDialog.dialog}
        onClose={onCloseAlertDialog}>
        <Alert severity="success">This is a success Alert.</Alert>
      </Dialog>
      <Footer/>
    </div>
  );
}

export default Dashboard;
