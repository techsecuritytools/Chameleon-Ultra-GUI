import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import WifiIcon from '@mui/icons-material/Wifi';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Radio from '@mui/material/Radio';
import { green,red } from '@mui/material/colors';

const { Buffer, DarksideStatus, DeviceMode, Mf1KeyType } = window.ChameleonUltraJS
const {Crypto1} = window



function Dashboard(props) {

  const [openDialog,setOpenDialog] = useState(false)
  const [dialogInfo,setDialogInfo] = useState()

  const onCloseDialog = () =>{
    setOpenDialog(false)
  }

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

  const handleConnectScan = async() => {

    //try{
    try{
    const actual = await props.ultraUsb.cmdHf14aScan()
    setDialogInfo(actual[0])
    
    let keysA = []
    let keysB = []
    for(let i=0;i<16;i++){
      let actual = await props.ultraUsb.cmdMf1CheckBlockKey({
        block: i,
        key: Buffer.fromHexString('FFFFFFFFFFFF'),
        keyType: Mf1KeyType.KEY_A,
      })
      let actual2 = await props.ultraUsb.cmdMf1CheckBlockKey({
        block: i,
        key: Buffer.fromHexString('FFFFFFFFFFFF'),
        keyType: Mf1KeyType.KEY_B,
      })
      keysA[i] = {'name': 'A','status': actual, 'key' : actual?'FFFFFFFFFFFF':''}
      keysB[i] = {'name': 'B','status': actual2, 'key' : actual2?'FFFFFFFFFFFF':''}
    }

    setDialogInfo(prevInfo => ({
      ...prevInfo,
      keysMifareA: keysA, // Adding new data property
      keysMifareB: keysB, // Adding new data property
    }));
  }catch(e){
    
  }
    setOpenDialog(true)
  
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
      <Dialog
        open={openDialog}
        onClose={onCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth= 'xl'
      >
        <DialogTitle id="alert-dialog-title">
          Scanned Card Info
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
           {dialogInfo?
            Object.entries(dialogInfo).map(([key, value]) => (
              <div key={key}>
                <strong>{key}</strong>: {value.toString('hex')}
              </div>
            ))
            :
            "No Card Detected"
          }
          {dialogInfo?
           <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell >Get Keys</TableCell>
                  <TableCell align="center">0</TableCell>
                  <TableCell align="center">1</TableCell>
                  <TableCell align="center">2</TableCell>
                  <TableCell align="center">3</TableCell>
                  <TableCell align="center">4</TableCell>
                  <TableCell align="center">5</TableCell>
                  <TableCell align="center">6</TableCell>
                  <TableCell align="center">7</TableCell>
                  <TableCell align="center">8</TableCell>
                  <TableCell align="center">9</TableCell>
                  <TableCell align="center">10</TableCell>
                  <TableCell align="center">11</TableCell>
                  <TableCell align="center">12</TableCell>
                  <TableCell align="center">13</TableCell>
                  <TableCell align="center">14</TableCell>
                  <TableCell align="center">15</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                  <TableCell align="center">A</TableCell>
              {dialogInfo!= undefined && dialogInfo.keysMifareA != undefined?
              dialogInfo.keysMifareA.map((row) => (
                <TableCell >
                  <Radio
                    checked={true}
                    inputProps={{ 'aria-label': 'A' }}
                    sx={{
                      color: row.status? green[800] : red[800],
                      '&.Mui-checked': {
                        color: row.status? green[600] : red[600],
                      },
                    }}
                  />
                </TableCell>
              ))
              : ''  
            }
            </TableRow>
            <TableRow
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                  <TableCell align="center">B</TableCell>
              {dialogInfo!= undefined && dialogInfo.keysMifareB != undefined?
              dialogInfo.keysMifareB.map((row) => (
                <TableCell >
                  <Radio
                    checked={true}
                    inputProps={{ 'aria-label': 'A' }}
                    sx={{
                      color: row.status? green[800] : red[800],
                      '&.Mui-checked': {
                        color: row.status? green[600] : red[600],
                      },
                    }}
                  />
                </TableCell>
              ))
              : ''  
            }
            </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          :''}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseDialog}>Disagree</Button>
          <Button onClick={onCloseDialog} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Dashboard;
