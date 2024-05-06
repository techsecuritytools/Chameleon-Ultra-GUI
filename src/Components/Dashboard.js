import React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import WifiIcon from '@mui/icons-material/Wifi';


function Dashboard(props) {
  // Define the number of papers
  const numberOfPapers = 8
  console.log('chameleonInfo : ',props.chameleonInfo)  

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

  const handleConnectScan = async() => {

    const actual = await props.ultraUsb.cmdHf14aScan()
    console.log("scanHF : ",actual)
    
};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', }}>
        <h1>Chameleon-Ultra</h1>
        <label style={{fontWeight:'bold'}}>FirmWare Version : </label><label>{props.chameleonInfo.version ? props.chameleonInfo.version : ''}</label>
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
        <Button onClick={handleConnectScan} variant="contained" sx={{ margin: '0 10px' }}>Scan</Button>
        <Button variant="contained" sx={{ margin: '0 10px' }}>Write</Button>
        <Button variant="contained" sx={{ margin: '0 10px' }}>Settings</Button>
      </div>
    </div>
  );
}

export default Dashboard;
