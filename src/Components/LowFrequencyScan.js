import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';



const LowFrequencyScan = (props) => {

    const [openLFscan,setOpenLFscan] = useState(false);
    const [lfScanInfo,setLFscanInfo] = useState(false);
 
    const lfScan = async() => {
        try{
            const id = await props.ultraUsb.cmdEm410xScan();
            setLFscanInfo(id.toString('hex'));
            handleOpen();
        }catch(err){
            handleOpen();
            console.log("no scan");
        }
    }

    const lfWriteT55xx = async() => {
        const { Buffer } = window.ChameleonUltraJS;
        await props.ultraUsb.cmdEm410xWriteToT55xx(Buffer.from(lfScanInfo, 'hex'));
    }

    //Slot saving
    const [slotAvailability, setSlotAvailability] = useState(false);


    const handleSlotAvalailabilityOpen = () => {
      setSlotAvailability(true);
    }

    const handleSlotAvalailabilityClose = () => {
      setSlotAvailability(false);
    }


    const handleOpen = () => {
        setOpenLFscan(true);
      };

      const handleClickClose = () => {
        setOpenLFscan(false);
        setLFscanInfo(false);
      };


    return (
        <div>
        <Button variant="contained" sx={{ margin: '0 10px' }} style={{backgroundColor: 'green', color: 'white'}} endIcon= {<DocumentScannerIcon/>} onClick={lfScan}>LF Scan</Button>
        <Dialog
        open={openLFscan}
        onClose={()=>{handleClickClose();handleSlotAvalailabilityClose()}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth= 'xl'
        >
        <DialogTitle id="alert-dialog-title">
          Scanned Tag Info
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description"></DialogContentText>
          {lfScanInfo? (
          <div>
            <h1>Tag ID: {lfScanInfo}</h1>
        
          </div> ) : (
          "No tag found" 
          )}


    {slotAvailability && (
      <Card sx={{ minWidth: 275 }} >
      <CardContent>
        <Typography variant="h5" component="div">
          Choose a Slot<br></br><br></br>
        </Typography>
        <Typography variant="body2">
          Slots here
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>)}


        </DialogContent>
          <DialogActions>
          {lfScanInfo? ( 
          <Button onClick={lfWriteT55xx} autoFocus variant="contained" sx={{ margin: '0 10px' }} style={{backgroundColor: 'green', color: 'white'}}> Write to T55xx</Button>
        ) : "" }
        {lfScanInfo? ( 
          <Button onClick={handleSlotAvalailabilityOpen} autoFocus variant="contained" sx={{ margin: '0 10px' }} style={{backgroundColor: 'green', color: 'white'}}> Save to Slot</Button>
        ) : "" }
          <Button onClick={() => {handleClickClose(); handleSlotAvalailabilityClose();}} autoFocus variant="contained" sx={{ margin: '0 10px' }} style={{backgroundColor: 'green', color: 'white'}}>close</Button>
          
          </DialogActions>
      </Dialog>
        </div>

    )
}

export default LowFrequencyScan;