import { useState } from 'react';
import Dashboard from './Components/Dashboard';
import { Button } from '@mui/material';
import UsbIcon from '@mui/icons-material/Usb';
import Footer from './Components/Footer';


const {ChameleonUltra,WebserialAdapter} = window.ChameleonUltraJS


function App() {
  const [isDeviceConnected,setIsDeviceConnected] = useState(false)
  const [chameleonInfo,setChameleonInfo] = useState({})
  const [ultraUsb,setUltraUsb] = useState()


  const handleGetChameleonInfo = async() => {
    let ultra =ultraUsb;
    if(!isDeviceConnected){
      ultra = new ChameleonUltra()
      await ultra.use(new WebserialAdapter())
    }
    
    var appVersion = await ultra.cmdGetAppVersion()
    var gitVersion = await ultra.cmdGetGitVersion()
    var slotsInfo  = await ultra.cmdSlotGetInfo()
    var isSlotsEnable = await ultra.cmdSlotGetIsEnable()

    setUltraUsb(ultra)
    setChameleonInfo(
      {
      version : appVersion + ' '+gitVersion, 
      slotsInfo  : slotsInfo,
      isSlotsEnable : isSlotsEnable
    })
    
    setIsDeviceConnected(true)
  }

  return (
    isDeviceConnected === false?
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1><i>Connect that bad boy killer!</i></h1>
        <img src={process.env.PUBLIC_URL + '/chameleon.png'} alt="Chameleon" />

        <Button variant="contained" size='large' onClick={handleGetChameleonInfo} endIcon={<UsbIcon />}  style={{backgroundColor: 'green', color: 'white'}}>

        
        Connect your Chameleon-Ultra</Button>
        <Footer/>
      </div>
      :
      <Dashboard handleGetChameleonInfo={handleGetChameleonInfo} ultraUsb={ultraUsb} chameleonInfo={chameleonInfo}/>
  );
}

export default App;
