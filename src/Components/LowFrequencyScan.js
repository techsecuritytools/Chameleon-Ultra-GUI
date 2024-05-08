import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';


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
        onClose={handleClickClose}
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
        </DialogContent>
          <DialogActions>
          {lfScanInfo? ( 
          <Button onClick={lfWriteT55xx} autoFocus variant="contained" sx={{ margin: '0 10px' }} style={{backgroundColor: 'green', color: 'white'}}> Write to T55xx</Button>
        ) : "" }
          <Button onClick={handleClickClose} autoFocus variant="contained" sx={{ margin: '0 10px' }} style={{backgroundColor: 'green', color: 'white'}}>close</Button>
          
          </DialogActions>
      </Dialog>
        </div>

    )
}

export default LowFrequencyScan;