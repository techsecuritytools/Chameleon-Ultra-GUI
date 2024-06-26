import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { Alert, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider } from '@mui/material';
import WidgetsIcon from '@mui/icons-material/Widgets';
import CreateIcon from '@mui/icons-material/Create';
import SaveIcon from '@mui/icons-material/Save';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import WifiIcon from '@mui/icons-material/Wifi';
import Settings from './Settings';
import LowFrequencyScan from './LowFrequencyScan';
import HighFrequencyScan from './HighFrequencyScan/HighFrequencyScan';
import Footer from './Footer';
import Keys from '../Keys/Keys';
import _ from 'lodash'

const {Buffer, FreqType,DeviceMode,TagType } = window.ChameleonUltraJS

function Dashboard(props) {
  const [alertDialog,setAlertDialog] = useState({dialog:false,message:''})
  const [slotdialog,setSlotdialog] = useState(false)
  const [slotdialogInfo,setSlotdialogInfo] = useState({index:0,HF:{},LF:{},data:{},keys:new Set(),isDataShow:false})
  const [showLoader,setShowLoader] = useState(false)
  const [messageWarningEM410, setMessageWarningEM410] = useState(false);


  const numberOfPapers = 8

  const splitArrayIntoChunks = (array, chunkSize) => {
    let result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        let chunk = array.slice(i, i + chunkSize);
        result.push(chunk);
    }
    return result;
}

  const getDataFromSlot = async() =>{
    let data = []
    for(let x=0;x<64;x++){
      data.push((await props.ultraUsb.cmdMf1EmuReadBlock(x)).toString('hex'))
    }
    return data
    
  }

  const getKeysFromSlot = async() =>{
    Keys.loadKeys()
    let allKeys = Keys.getKeys()
    let mfkeys = new Set();
    let keysTotestFromAllKeys = allKeys
    keysTotestFromAllKeys = keysTotestFromAllKeys.split()[0].split('\r\n')
    console.log('keysTotestFromAllKeys' ,keysTotestFromAllKeys)
    try{
      const keys = Buffer.from(keysTotestFromAllKeys.join('\n'), 'hex').chunk(6)
      console.log('1',keys)
      for(let x=0; x<16;x++){
        const sectorKey  = await props.ultraUsb.mf1CheckSectorKeys( x, keys )
        console.log(_.mapValues(sectorKey, key => key.toString('hex')))
      }
      }
      catch(e){
        console.log('keysEror ',e)
      }

    /*setSlotdialogInfo(prevInfo => ({
      ...prevInfo,
      keys:mfkeys
    }))*/
  }

  const getSlotInfo = async(slotClicked) =>{
    let hf = {}
    let lf = {}
    let mfkeys = new Set()
    let data = {}
    try{
      const antiCollision = await props.ultraUsb.cmdHf14aGetAntiCollData()

      hf = {
        uid : antiCollision.uid.toString('hex'),
        atqa: antiCollision.atqa.toString('hex'),
        sak: antiCollision.sak.toString('hex'),
        ats: antiCollision.ats.toString('hex')
      }

      data = await getDataFromSlot();
      //let keys23 = await getKeysFromSlot()
    }catch(e){
      
    }
    try{
      const uid = await props.ultraUsb.cmdEm410xGetEmuId()
      lf = {uid :uid}
    }catch(e){
      
    }
    setSlotdialogInfo(prevInfo => ({
      ...prevInfo,
      index: slotClicked,
      HF: hf,
      LF:lf,
      data:data,
      keys:[]
    }))
    props.handleGetChameleonInfo()
  }
  const handleSlotClick = async(slotClicked) =>{
    try{
      await props.ultraUsb.cmdSlotSetActive(slotClicked)
      
      getSlotInfo(slotClicked)

    slotDialogOpen()
    setMessageWarningEM410(false)
    }
    catch(e){
      console.log(e)
    }
  }

  const loadData = async() =>{
    if(slotdialogInfo.isDataShow){
      setSlotdialogInfo(prevInfo => ({
        ...prevInfo,
        isDataShow:false,
      }))
    }else{
      setShowLoader(true)
      setSlotdialogInfo(prevInfo => ({
        ...prevInfo,
        isDataShow:true,
      }))
      
      setShowLoader(false)

    }
  }

  const displayData = () =>{
    let fillTable = [];
    for (let i = 0; i < 16; i++) {
      const hexA = slotdialogInfo.data[(i * 4)]+'...'+slotdialogInfo.data[(i * 4) + 3]
    fillTable.push(
      <tr key={i}>
        <td>{hexA}</td>
      </tr>
    );
    }
    return fillTable
  }

  const generatePapersFirstRow = () => {
    let papers = [];
    for (let i = 0; i < numberOfPapers; i++) {
      papers.push(
        <Paper 
        key={i} 
        elevation={8}
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'flex-end', 
          alignItems: 'center', 
          border: props.chameleonInfo.isSlotsEnable[i].hf && props.chameleonInfo.isSlotsEnable[i].lf ? '2px solid red' : '2px solid green',
          cursor: 'pointer', // Change cursor to pointer on hover
          transition: 'transform 0.2s', // Smooth transition for the transform property
          '&:hover': {
            transform: 'scale(1.05)', // Slightly enlarge the Paper on hover
          },}}
        onClick={() => handleSlotClick(i)}
      >
        <h2>{props.chameleonInfo.isSlotsEnable[i].hf && props.chameleonInfo.isSlotsEnable[i].lf ? ' Not Available' : 'Available'}</h2>
        <div>
          <CreditCardIcon />
          <label style={{ textDecoration: props.chameleonInfo.isSlotsEnable[i].hf > 0 ? 'underline red' : 'underline green' }}> 
            {props.chameleonInfo.isSlotsEnable[i].hf > 0 ? 'MIFARE_1024' : 'Empty'}
          </label>
          <br />
          <WifiIcon />
          <label style={{ textDecoration: props.chameleonInfo.isSlotsEnable[i].lf > 0 ? 'underline red' : 'underline green' }}> 
            {props.chameleonInfo.isSlotsEnable[i].lf > 0 ? 'EM410X' : 'Empty'}
          </label>
        </div>
        <div style={{ marginTop: 'auto' }}>
          <h3 style={{ margin: '0', fontWeight: 'bold', marginBottom: '20%' }}>Slot {i + 1}</h3>
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

  const slotDialogOpen = () =>{
    setSlotdialog(true)
  }

  const slotDialogClose = () =>{
    setSlotdialogInfo({index:0,HF:{},LF:{},data:{},keys:new Set(),isDataShow:false})
    setSlotdialog(false)
  }

  const uploadFileUID = async(e) => {
    const file = e.target.files[0];
    console.log('files: ',e.target.files)
    if (file) {
      const reader = new FileReader();
      reader.onload = async(event) => {
        const fileContent = event.target.result;
        try {
            await props.ultraUsb.cmdSlotChangeTagType(slotdialogInfo.index, TagType.EM410X)
            await props.ultraUsb.cmdSlotSetEnable(slotdialogInfo.index, FreqType.LF, true)
            await props.ultraUsb.cmdSlotSetActive(slotdialogInfo.index)
            const jsonDataString = JSON.parse(fileContent);
            await props.ultraUsb.cmdEm410xSetEmuId(Buffer.from(jsonDataString.uid, 'hex'))
            await props.ultraUsb.cmdSlotSaveSettings()
            await props.ultraUsb.cmdChangeDeviceMode(DeviceMode.TAG)
            getSlotInfo(slotdialogInfo.index)
        } catch (err) {
          console.error("Error parsing JSON:", err);
        }
      };
      reader.readAsText(file);
    }
  };

  const uploadFileMF = async(e) => {
    const file = e.target.files[0];
    console.log('files: ',e.target.files)
    if (file) {
      const reader = new FileReader();
      reader.onload = async(event) => {
        const fileContent = event.target.result;
        try {
            const jsonDataString = JSON.parse(fileContent);
            await props.ultraUsb.cmdSlotChangeTagType(slotdialogInfo.index, TagType.MIFARE_1024)
            await props.ultraUsb.cmdSlotSetEnable(slotdialogInfo.index, FreqType.HF, true)
            await props.ultraUsb.cmdSlotSetActive(slotdialogInfo.index)
            console.log('slotdialogInfo.HF : ',slotdialogInfo.HF)
            await props.ultraUsb.cmdHf14aSetAntiCollData({
              uid: Buffer.from(jsonDataString.antiColl.uid, 'hex'), 
              atqa: Buffer.from(jsonDataString.antiColl.atqa, 'hex'), 
              sak: Buffer.from(jsonDataString.antiColl.sak, 'hex'),
              ats: Buffer.from(jsonDataString.antiColl.ats, 'hex')
            })

            for(let x=0;x<jsonDataString.data.length;x++){
              await props.ultraUsb.cmdMf1EmuWriteBlock(x, Buffer.from(jsonDataString.data[x], 'hex'))
              await props.ultraUsb.cmdSlotSaveSettings()
            }
            
            getSlotInfo(slotdialogInfo.index)
        } catch (err) {
          console.error("Error parsing JSON:", err);
        }
      };
      reader.readAsText(file);
    }
  };

  const downloadSlotData = async() => {
    // Convert the data to a string and create a Blob from it

    let dataFormat = {
      antiColl : slotdialogInfo.HF,
      data: slotdialogInfo.data
    }
    
    const jsonStr = JSON.stringify(dataFormat, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });

    // Create a link element, use it to download the blob, and remove it after
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'SLOT'+(slotdialogInfo.index+1)+'_MF_Data.json'; // Name the download file here
    document.body.appendChild(link); // Required for Firefox
    link.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };

  const downloadSlotDataT55xx = async(data) => {
    // Convert the data to a string and create a Blob from it
    
    const jsonStr = JSON.stringify({uid:slotdialogInfo.LF.uid.toString('hex')}, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });

    // Create a link element, use it to download the blob, and remove it after
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'SLOT'+(slotdialogInfo.index+1)+'_T55xx_Data.json'; // Name the download file here
    document.body.appendChild(link); // Required for Firefox
    link.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };

  const resetMF = async() =>{
    await props.ultraUsb.cmdSlotResetTagType(slotdialogInfo.index, TagType.MIFARE_1024)
    await props.ultraUsb.cmdSlotSetEnable(slotdialogInfo.index, FreqType.HF, false)
    await props.ultraUsb.cmdSlotSaveSettings()
    getSlotInfo(slotdialogInfo.index)
  }

  const resetEm410x = async() =>{
    await props.ultraUsb.cmdSlotResetTagType(slotdialogInfo.index, TagType.EM410X)
    await props.ultraUsb.cmdSlotSetEnable(slotdialogInfo.index, FreqType.LF, false)
    await props.ultraUsb.cmdSlotSaveSettings()
    getSlotInfo(slotdialogInfo.index)
  }

  const writeToCard = () =>{
    //console.log('keys ',slotdialogInfo)
  }
  const writeToT55XX = async() =>{
    try{
      await props.ultraUsb.cmdEm410xScan();
      await props.ultraUsb.cmdEm410xWriteToT55xx(slotdialogInfo.LF.uid);
      setMessageWarningEM410(false)
      setAlertDialog({dialog:true,message:'The Data Was Written In The Chip/Card Succesfully!'})
    }
    catch(e){
      setMessageWarningEM410(true)
    }

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
                width: 200,
                height: 150,
              }
          }}
        >
          {generatePapersFirstRow()}
        </Box>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <HighFrequencyScan setAlertDialog={setAlertDialog} chameleonInfo={props.chameleonInfo} ultraUsb={props.ultraUsb} />
        <LowFrequencyScan setAlertDialog={setAlertDialog} chameleonInfo={props.chameleonInfo} ultraUsb={props.ultraUsb} />
        {/*<Button variant="contained" sx={{ margin: '0 10px' }} style={{backgroundColor: 'green', color: 'white'}} endIcon={<WidgetsIcon/>}>Slot Manager</Button>
        <Button variant="contained" sx={{ margin: '0 10px' }} style={{backgroundColor: 'green', color: 'white'}} endIcon= {<SaveIcon/>}>Saved Cards</Button>
        <Button variant="contained" sx={{ margin: '0 10px' }} style={{backgroundColor: 'green', color: 'white'}} endIcon={<CreateIcon/>}>Write Card</Button>*/}
        <Settings ultraUsb={props.ultraUsb}/>
      </div>
      <Dialog
        open={alertDialog.dialog}
        onClose={onCloseAlertDialog}>
        <Alert severity="success">{alertDialog.message}</Alert>
      </Dialog>
      
      <Dialog
        open={slotdialog}
        onClose={slotDialogClose}
        maxWidth= 'xl'
      >
        <DialogTitle style={{ fontSize: 30, textAlign: 'center' }}>
          Slot#{slotdialogInfo.index + 1} Information
        </DialogTitle>
        <DialogContent
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Divider style={{ fontSize: 25, width: '100%' }}>Mifare Data</Divider>
          {props.chameleonInfo.isSlotsEnable[slotdialogInfo.index].hf && slotdialogInfo.HF !== undefined && Object.keys(slotdialogInfo.HF).length > 0 ?
            <>
              <br />
              <table>
                <tr>
                  <td><span style={{ fontWeight: 700 }}>UID</span></td>
                  <td>{slotdialogInfo.HF.uid}</td>
                  <td><span style={{ fontWeight: 700 }}>ATQA</span></td>
                  <td>{slotdialogInfo.HF.atqa}</td>
                  <td><span style={{ fontWeight: 700 }}>SAK</span></td>
                  <td>{slotdialogInfo.HF.sak}</td>
                  <td><span style={{ fontWeight: 700 }}>ATS</span></td>
                  <td>{slotdialogInfo.HF.ats}</td>
                </tr>
                
              </table>
              
              {slotdialogInfo.isDataShow?
                <table>
                  <th>Data</th>
                  {displayData()}
                </table>
                :
                showLoader?
                  <CircularProgress />
                :
                  <></>
              }
              
              <DialogActions>
                <Button  autoFocus variant="contained" sx={{backgroundColor: 'green', color: 'white'}} onClick={loadData}>
                  {slotdialogInfo.isDataShow? 'Hide Data' : 'Show Data'}
                </Button>
                <Button  autoFocus variant="contained" sx={{backgroundColor: 'green', color: 'white'}} onClick={downloadSlotData}>
                  Download Data
                </Button>
                <Button  autoFocus variant="contained" sx={{backgroundColor: 'green', color: 'white'}}>
                <input type="file" id="files" onChange={uploadFileMF} class="hidden" style={{display:'none'}}/>
                <label for="files">Upload MF</label>
                </Button>
                <Button disabled  autoFocus variant="contained" sx={{ backgroundColor: 'green', color: 'white' }} onClick={writeToCard}>
                Write To Card
                </Button>
                <Button  autoFocus variant="contained" sx={{backgroundColor: 'green', color: 'white'}} onClick={resetMF}>
                  Reset MF
                </Button>
            </DialogActions>
            </>
            :
            <>
              <h3>Empty</h3>
              <DialogActions>
              <Button  autoFocus variant="contained" sx={{backgroundColor: 'green', color: 'white'}}>
                <input type="file" id="files" onChange={uploadFileMF} class="hidden" style={{display:'none'}}/>
                <label for="files">Upload MF</label>
              </Button>
              </DialogActions>
            </>
          }
          <Divider style={{ fontSize: 25, marginTop: 5, width: '100%' }}>T55xx Data</Divider>
          {props.chameleonInfo.isSlotsEnable[slotdialogInfo.index].lf && slotdialogInfo.LF !== undefined && Object.keys(slotdialogInfo.LF).length > 0 ?
          
          <h3>UID : {slotdialogInfo.LF.uid.toString('hex')}</h3>
          :
          <>
            <h3>Empty</h3>
          </>
          }
          
            <Box display="flex" justifyContent="center" >
                {messageWarningEM410 && <h4 style={{ textAlign: 'center', color: 'red' }}>No Tag / Card Detected To Write Data!</h4>}
              </Box>
            <DialogActions>
              {props.chameleonInfo.isSlotsEnable[slotdialogInfo.index].lf && slotdialogInfo.LF !== undefined && Object.keys(slotdialogInfo.LF).length > 0 ?
                <>
                    <Button  autoFocus variant="contained" sx={{backgroundColor: 'green', color: 'white'}} onClick={downloadSlotDataT55xx}>
                      download UID
                    </Button>
                    <Button  autoFocus variant="contained" sx={{backgroundColor: 'green', color: 'white'}}>
                      <input type="file" id="files2" onChange={uploadFileUID} class="hidden" style={{display:'none'}}/>
                      <label for="files2">Upload UID</label>
                    </Button>
                    <Button  autoFocus variant="contained" sx={{ backgroundColor: 'green', color: 'white' }} onClick={writeToT55XX}>
                    Write To T55XX
                    </Button>
                    <Button  autoFocus variant="contained" sx={{backgroundColor: 'green', color: 'white'}} onClick={resetEm410x}>
                      Reset Em410x
                    </Button>
              </>
                :
                <>
                <DialogActions>
                  <Button  autoFocus variant="contained" sx={{backgroundColor: 'green', color: 'white'}}>
                    <input type="file" id="files2" onChange={uploadFileUID} class="hidden" style={{display:'none'}}/>
                    <label for="files2">Upload UID</label>
                  </Button>
                </DialogActions>
                </>
              }
            </DialogActions>
        </DialogContent>
      </Dialog>

      <Footer/>
    </div>
  );
}

export default Dashboard;
