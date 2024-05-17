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
import { CardActionArea, Divider } from '@mui/material';


const { Buffer ,FreqType,TagType } = window.ChameleonUltraJS

const LowFrequencyScan = (props) => {
    const [openDialog,setOpenDialog] = useState(false);
    const [dialogInfo,setDialogInfo] = useState(false);
    const [clicked, setClicked] = useState(Array(8).fill(false));
    const [messageWarning, setMessageWarning] = useState(false);
    const [messageWarningEM410, setMessageWarningEM410] = useState(false);
 
    const handleConnectScan = async() => {
        try{
            const id = await props.ultraUsb.cmdEm410xScan();
            setDialogInfo(id);
        }catch(err){
        }
        setOpenDialog(true);
    }

    const lfWriteT55xx = async() => {
        await props.ultraUsb.cmdEm410xWriteToT55xx(Buffer.from(dialogInfo, 'hex'));
    }
    const saveToChameleon = async() => {
      if (!clicked.some(element => element === true)) {
        setMessageWarning(true);
      } else {
          let slotChoose = clicked.indexOf(true)
          setMessageWarning(false);
          if(props.chameleonInfo.isSlotsEnable[slotChoose].lf <= 0 || (props.chameleonInfo.isSlotsEnable[slotChoose].lf > 0 && window.confirm(`The Slot ${slotChoose+1} is already occupy. Are you sure you want to override it ?`))){
              let slotChoose = clicked.indexOf(true)
              await props.ultraUsb.cmdSlotSetActive(slotChoose)
              
              try{
              await props.ultraUsb.cmdSlotSetEnable(slotChoose, FreqType.LF, true)
              //await props.ultraUsb.cmdSlotResetTagType(slotChoose, TagType.MIFARE_1024)
              //await props.ultraUsb.cmdSlotSaveSettings()
              
              await props.ultraUsb.cmdEm410xSetEmuId(dialogInfo)
              await props.ultraUsb.cmdSlotSaveSettings()

              onCloseDialog()
              props.setAlertDialog({dialog:true,message:'The Data Was Saved In The Slot #'+(slotChoose+1)})
          }
          catch(e){
              console.log(e)
          }
  
          }
      }
    };

      const onCloseDialog = () => {
        setOpenDialog(false)
        setDialogInfo()
      };

      const handleClickSlot = (index) => {
    
        setMessageWarning(false);
        const newClicked = Array(8).fill(false);
        newClicked[index] = !newClicked[index]; // Toggle the state for the clicked card
        setClicked(newClicked); // Update the stat
      };

      const downloadData = async() => {

        // Convert the data to a string and create a Blob from it
        
        const jsonStr = JSON.stringify({uid:dialogInfo.toString('hex')}, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
  
        // Create a link element, use it to download the blob, and remove it after
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'LF_Data.json'; // Name the download file here
        document.body.appendChild(link); // Required for Firefox
        link.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
      };

      const writeToT55XX = async() =>{
          try{
            const id = await props.ultraUsb.cmdEm410xScan();
            await props.ultraUsb.cmdEm410xWriteToT55xx(dialogInfo);
            setMessageWarningEM410(false)
            onCloseDialog()
            props.setAlertDialog({dialog:true,message:'The Data Was Written In The Chip/Card Succesfully!'})
          }
          catch(e){
            setMessageWarningEM410(true)
          }
      }

    return (
      <div>
      <Button onClick={handleConnectScan} variant="contained" sx={{ margin: '0 10px' }} style={{backgroundColor: 'green', color: 'white'}} endIcon={<DocumentScannerIcon/>}>LF Scan</Button>
      
      
      <Dialog
        open={openDialog}
        onClose={onCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth= 'xl'
      >
        {dialogInfo?
          <>
            <DialogTitle id="alert-dialog-title">
              Scanned Chip/Card Info
            </DialogTitle>
            <DialogContent>
              <div>
                <h2>Tag ID: {dialogInfo.toString('hex')}</h2>
              </div>
            <Divider style={{ marginTop: '2%', marginBottom: '2%' }}>Saved To Chameleon</Divider>
            <Box display="flex" justifyContent="center" flexWrap="wrap" gap={5}>
              {clicked.map((isClicked, index) => (
                <Card key={index} sx={{ 
                    bgcolor: isClicked ? 'green' : 'background.paper',
                    border: props.chameleonInfo.isSlotsEnable[index].lf > 0 ? '1px solid red' : '1px solid green', // Sets the border color to red and width to 1px
                    borderRadius: '8px' // Optionally add a border radius
                }}>
                  <CardActionArea onClick={() => handleClickSlot(index)}>
                    <CardContent>
                      <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
                        Slot {index + 1}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
            </Box>
            <Box display="flex" justifyContent="center" >
              {messageWarning && <h4 style={{ textAlign: 'center', color: 'red' }}>You need to select a Slot to Save!</h4>}
            </Box>
            <Box display="flex" justifyContent="center" style={{ marginTop: '1%' }}>
              <Button variant="contained" sx={{ backgroundColor: 'green', color: 'white' }} onClick={saveToChameleon}>
                Save To Chameleon
              </Button>
            </Box>
              <Divider style={{ marginTop: '2%', marginBottom: '2%' }}>Saved To T55XX</Divider>
              {messageWarningEM410 && <h4 style={{ textAlign: 'center', color: 'red' }}> No Tag / Card Detected To Write Data!</h4>}
              <Box display="flex" justifyContent="center" style={{ marginTop: '1%' }}>
                <Button variant="contained" sx={{ backgroundColor: 'green', color: 'white' }} onClick={writeToT55XX}>
                Write To T55XX
                </Button>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={downloadData} autoFocus variant="contained" style={{backgroundColor: 'green', color: 'white'}}>
                Download Data
              </Button>
              <Button onClick={onCloseDialog} autoFocus variant="contained" style={{backgroundColor: 'green', color: 'white'}}>
                Close
              </Button>
            </DialogActions>
          </>
          :
          <>
          <DialogTitle id="alert-dialog-title">Low Frequency Chip/Card Not Found!</DialogTitle>
          <DialogActions>
            <Button onClick={handleConnectScan} autoFocus variant="contained" style={{backgroundColor: 'green', color: 'white'}}>
              Scan Card
            </Button>
            <Button onClick={onCloseDialog} autoFocus variant="contained" style={{backgroundColor: 'green', color: 'white'}}>
              Close
            </Button>
          </DialogActions>
          </>
        }
      </Dialog>
      </div>

    )
}

export default LowFrequencyScan;