import React, {useState} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import SettingsIcon from '@mui/icons-material/Settings';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import BuildIcon from '@mui/icons-material/Build';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';






const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '5px solid #0b751c',
    boxShadow: 24,
    p: 4,
    textAlign: 'center', 
  };


const Settings = (props) => {
    
    const [open, setOpen] = useState(false);
    const handleOpen = () =>  setOpen(true);
    const handleClose = () => setOpen(false);
    //Battery Info
    const [voltageLevel, setVoltageLevel]= useState();
    const [batteryLevel, setBatteryLevel]= useState();
    //Device Chip ID
    const [chipID, setChipID] = useState();
    const [model, setModel] = useState();



    const deviceInfo = async() => {
        const battery = await props.ultraUsb.cmdGetBatteryInfo();
        let voltageLvl = JSON.stringify(battery);
        voltageLvl = JSON.parse(voltageLvl).voltage;
        setVoltageLevel(voltageLvl);
        
        let batteryLvl = JSON.stringify(battery);
        batteryLvl = JSON.parse(batteryLvl).level;
        setBatteryLevel(batteryLvl);

        const chipInfo = await props.ultraUsb.cmdGetDeviceChipId();
        setChipID(chipInfo);

        const { DeviceModel } = window.ChameleonUltraJS
        const model = await props.ultraUsb.cmdGetDeviceModel();
        setModel(DeviceModel[model]);
    }
    
    //Red buttons
    const enterBootoader = async() => {
        await props.ultraUsb.cmdEnterBootloader();
    }

    const defaultReset = async() => {
        await props.ultraUsb.cmdResetSettings();
    }

    const factoryReset = async() => {
        await props.ultraUsb.cmdWipeFds();
    }

    //save settings
    const saveSettings = async() => {
        await props.ultraUsb.cmdSaveSettings();
    }


    return (
        <div>
        <Button variant="contained" sx={{ margin: '0 10px' }} style={{backgroundColor: 'green', color: 'white'}} endIcon= {<SettingsIcon/>} onClick={() => {handleOpen(); deviceInfo();}}>Settings</Button>
        <Modal 
            open={open}
            onClose = {handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
        <Box sx={style}>
        <IconButton
            sx={{ position: 'absolute', top: 5, right: 5 }}
            onClick={handleClose}
          >
        <CloseIcon />
        </IconButton>
        
        <Typography id="modal-modal-title" variant="h5" component="h2" >
        Device Infromation
        </Typography>
        
        <p>Battery Level:  <b>{batteryLevel}% </b></p>
        <p>Battery Voltage:  <b>{voltageLevel}mV</b></p>
        <p>Chip ID:  <b>{chipID}</b></p>
        <p>Model: <b>{model}</b></p>
        
        <Typography id="modal-modal-description" sx={{ mt: 2 }} variant="h6">
            Chameleon Management Be Careful:
        </Typography>
        <br></br>
        <Button variant="contained" sx={{ width: '100%', margin: '0px 10px' }} style={{backgroundColor: 'red', color: 'white' }} startIcon={<HealthAndSafetyIcon />} onClick={enterBootoader}>Enter Bootloader Mode</Button>
        <Button variant="contained" sx={{ width: '100%', margin: '10px 10px' }} style={{backgroundColor: 'red', color: 'white'}} startIcon={<RestartAltIcon />} onClick={defaultReset}>Reset Settings to default</Button>
        <Button variant="contained" sx={{ width: '100%', margin: '0px 10px' }} style={{backgroundColor: 'red', color: 'white'}} startIcon={<BuildIcon />} onClick={factoryReset}>Reset To Factory Settings</Button>
        <Button variant="contained" sx={{ width: '100%', margin: '10px 10px' }} style={{backgroundColor: 'blue', color: 'white'}} startIcon={<CloudDownloadIcon />} onClick={saveSettings}>Save Settings</Button>

        </Box>

        </Modal>
            
        </div>
          
    )

}

export default Settings;
      

