import { useState } from 'react';
import Dashboard from './Components/Dashboard';
import { Box, Button, Typography } from '@mui/material';
import UsbIcon from '@mui/icons-material/Usb';
import Footer from './Components/Footer';
import Modal from '@mui/material/Modal';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';

import { Buffer, ChameleonUltra } from 'chameleon-ultra.js'
import WebserialAdapter from 'chameleon-ultra.js/plugin/WebserialAdapter'


function App() {
  const [isDeviceConnected,setIsDeviceConnected] = useState(false)
  const [chameleonInfo,setChameleonInfo] = useState({})
  const [ultraUsb,setUltraUsb] = useState()
  const [isUserNeedFirmwareUpdate, setIsUserNeedFirmwareUpdate] = useState(false);
  const [progressUpdateFirmware,setPFW] = useState(0)


  const handleGetChameleonInfo = async() => {
    setIsUserNeedFirmwareUpdate(false)
    let ultra =ultraUsb;
    if(!isDeviceConnected || !ultra.isConnected()){
      ultra = new ChameleonUltra()
      await ultra.use(new WebserialAdapter())
      setUltraUsb(ultra)
    }
    try{
    var appVersion = await ultra.cmdGetAppVersion()
    var gitVersion = await ultra.cmdGetGitVersion()
    var slotsInfo  = await ultra.cmdSlotGetInfo()
    var isSlotsEnable = await ultra.cmdSlotGetIsEnable()

    setChameleonInfo(
      {
      version : appVersion + ' '+gitVersion, 
      slotsInfo  : slotsInfo,
      isSlotsEnable : isSlotsEnable
    })
    
    setIsDeviceConnected(true)
  }catch(e){
    setIsUserNeedFirmwareUpdate(true);
    
    const { DeviceModel } = await import('https://cdn.jsdelivr.net/npm/chameleon-ultra.js@0/+esm')
    const { default: DfuZip } = await import('https://cdn.jsdelivr.net/npm/chameleon-ultra.js@0/dist/plugin/DfuZip.mjs/+esm')
    const model =  'ultra' 
    const dfuZipUrl = `https://taichunmin.idv.tw/ChameleonUltra-releases/dev/${model}-dfu-app.zip`
    const dfuZip = new DfuZip(new Buffer((await axios.get(dfuZipUrl, { responseType: 'arraybuffer' }))?.data))
    const image = await dfuZip.getAppImage()
    const imageGitVersion = await dfuZip.getGitVersion()
    // {
    //   "type": "application",
    //   "headerSize": 141,
    //   "bodySize": 222844,
    //   "gitVersion": "v2.0.0-135-g3cadd47"
    // }
    
    if (typeof ultra.cmdDfuEnter === 'function') {
      if(!(await ultra.isDfu())){await ultra.cmdDfuEnter()};
      ultra.emitter.on('progress', handleProgressBar);
      await ultra.dfuUpdateImage(image);
      ultra.emitter.removeListener('progress', handleProgressBar);
    } else {
      console.error('cmdDfuEnter is not available on the ultra object');
    }
  }
  
  }
  const handleProgressBar = (info) =>{
    setPFW((info.offset/info.size)*100)
  }
  
  const handleUpdateFirmware = async() =>{
    
  }
  

  const handleClosefirwamreupdateModal = () => {
    setIsUserNeedFirmwareUpdate(false);
    setPFW(0)
  };

  return (
    <>
      {isDeviceConnected === false ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h1><i>Connect that bad boy killer!</i></h1>
          <img src={process.env.PUBLIC_URL + '/chameleon.png'} alt="Chameleon" width={500} height={400} />
          <Button variant="contained" onClick={handleGetChameleonInfo} endIcon={<UsbIcon />} sx={{ backgroundColor: 'green', color: 'white' }}>
            Connect your Chameleon-Ultra
          </Button>
          <Footer />
        </div>
      ) : (
        <Dashboard handleGetChameleonInfo={handleGetChameleonInfo} ultraUsb={ultraUsb} chameleonInfo={chameleonInfo} />
      )}

      <Modal
        open={isUserNeedFirmwareUpdate}
        onClose={handleClosefirwamreupdateModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box 
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          {progressUpdateFirmware ==0 ?
          <>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Firmware Update Required
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Your device requires a firmware update to continue. Please update to the latest version.
          </Typography>
          <Button 
            variant="contained" 
            onClick={handleUpdateFirmware} 
            sx={{ mt: 3, backgroundColor: 'blue', color: 'white' }}
          >
            Update Firmware
          </Button>
          </>
          :
          <>
          
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {progressUpdateFirmware <100 ?'We are updating the Firmware, Do not disconnect the Chameleon.': 'The update is complete. Press finish to continue!'}
          </Typography>
          {progressUpdateFirmware < 100?
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" size={50} value={progressUpdateFirmware} />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant="caption"
                component="div"
                sx={{ color: 'text.secondary' }}
              >{`${Math.round(progressUpdateFirmware)}%`}</Typography>
              
            </Box>
            
          </Box>
          :
          <Button 
          variant="contained" 
          onClick={handleGetChameleonInfo} 
          sx={{ mt: 3, backgroundColor: 'blue', color: 'white' }}
        >
          Finish
        </Button>}
          </>
          }
          
        </Box>
        
      </Modal>
    </>
  );
}

export default App;
