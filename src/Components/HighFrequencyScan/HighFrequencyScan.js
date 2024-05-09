import React, { useState,useEffect } from 'react';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import { Button } from '@mui/material';
import ScannedCardDisplay from './ScannedCardDisplay';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Keys from '../../Keys/Keys';
import _ from 'lodash'

const { Buffer } = window.ChameleonUltraJS

const HighFrequencyScan = (props) => {

    const [OpenScannedCardInfo,setOpenScannedCardInfo] = useState(false);
    const [dialogInfo,setDialogInfo] = useState(false);
    const [openDialog,setOpenDialog] = useState(false);
    const [isRecoveryKeysInProcess,setIsRecoveryKeysInProcess] = useState(false)
    const [seconds, setSeconds] = useState(0);
    const [allKeysDecrypted,setAllKeysDecrypted] = useState(false)

    useEffect(() => {
      // Set up the interval
      const interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
  
      // Clear the interval on component unmount
      return () => clearInterval(interval);
    }, []);

    Keys.loadKeys()
    let allKeys = Keys.getKeys()

    const timerSet0 = () =>{
        setSeconds(0)
    }

    const checkStatus = (keysMifareA,keysMifareB) => {
      setAllKeysDecrypted(keysMifareA.some(element => element.status === false) || keysMifareB.some(element => element.status === false))
  }
    

    const handleConnectScan = async() => {

      try{
      const actual = await props.ultraUsb.cmdHf14aScan()
      setDialogInfo(actual[0])

      let keysA = []
      let keysB = []
      const keys = Buffer.from('FFFFFFFFFFFF\n000000000000\nA0A1A2A3A4A5\nD3F7D3F7D3F7','hex').chunk(6)
      for(let i=0;i<16;i++){
        const sectorKey = await props.ultraUsb.mf1CheckSectorKeys(i, keys)
        if(sectorKey['96'] !== undefined){
          keysA[i] = {'name': 'A','status': true, 'key' : sectorKey['96'].toString('hex')}
        }else{
          keysA[i] = {'name': 'A','status': false, 'key' : ''}
        }
        if(sectorKey['97'] !== undefined){
          keysB[i] = {'name': 'B','status': true, 'key' : sectorKey['97'].toString('hex')}
        }else{
          keysB[i] = {'name': 'B','status': false, 'key' : ''}
        }
      }
      checkStatus(keysA,keysB)
      setDialogInfo(prevInfo => ({
        ...prevInfo,
        keysMifareA: keysA, // Adding new data property
        keysMifareB: keysB, // Adding new data property
      }));
    }catch(e){
      console.log('test : ',e)
    }
      setOpenDialog(true)
      setOpenScannedCardInfo(true)
    };

    const recoveryKeysByDict = async() =>{

      timerSet0()
      let keysToTest;
      let sectorKey;
      let copykeysMifareA = dialogInfo.keysMifareA
      let copykeysMifareB = dialogInfo.keysMifareB

      const falseIndices = dialogInfo.keysMifareA.reduce((indices, item, index) => {
        if (!item.status) {
          indices.push(index);
        }
        return indices;
      }, []);

      console.log('Start recovery ...')
      setIsRecoveryKeysInProcess(true)
      for(let x=0;x<falseIndices.length;x++){
          keysToTest = Buffer.from(allKeys,'hex').chunk(6)
          sectorKey = await props.ultraUsb.mf1CheckSectorKeys(falseIndices[x], keysToTest)
          console.log('sectorKey',_.mapValues(sectorKey, key => key.toString('hex')))
          if(sectorKey['96'] !== undefined){
              console.log('KEY A FOUND : ',sectorKey['96'].toString('hex'))
              copykeysMifareA[falseIndices[x]] = {'name': 'A','status': true, 'key' : sectorKey['96'].toString('hex')}
          }else{
            copykeysMifareA[falseIndices[x]] = {'name': 'A','status': false, 'key' : ''}
          }

          if(sectorKey['97'] !== undefined){
            console.log('KEY B FOUND : ',sectorKey['97'].toString('hex'))
              copykeysMifareB[falseIndices[x]] = {'name': 'B','status': true, 'key' : sectorKey['97'].toString('hex')}
            }else{
              copykeysMifareB[falseIndices[x]] = {'name': 'B','status': false, 'key' : ''}
          }
            break
      }
      setIsRecoveryKeysInProcess(false)
      setDialogInfo(prevInfo => ({
        ...prevInfo,
        keysMifareA: copykeysMifareA, // Adding new data property
        keysMifareB: copykeysMifareB, // Adding new data property
      }));
      checkStatus(copykeysMifareA,copykeysMifareB)

    }

    const onCloseDialog = () =>{
      setDialogInfo({})
      setOpenDialog(false)
      setOpenScannedCardInfo(false)
    }

    return (
        <div>
        <Button onClick={handleConnectScan} variant="contained" sx={{ margin: '0 10px' }} style={{backgroundColor: 'green', color: 'white'}} endIcon={<DocumentScannerIcon/>}>HF Scan</Button>
        
        <Dialog
          open={openDialog}
          onClose={onCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth= 'xl'
        >
          {
          OpenScannedCardInfo && <ScannedCardDisplay isRecoveryKeysInProcess={isRecoveryKeysInProcess} dialogInfo={dialogInfo} OpenScannedCardInfo={OpenScannedCardInfo} />
          
          }
          <DialogActions>
            {isRecoveryKeysInProcess?
            <h4>Recovery Keys (~300 sec) : <label style={{color:'red'}}> {seconds} sec</label></h4>
            :
            allKeysDecrypted?
            <Button onClick={recoveryKeysByDict}  variant="contained" style={{backgroundColor: 'green', color: 'white'}}>recover Keys By Dict</Button>
            :
            <Button onClick={onCloseDialog} autoFocus variant="contained" style={{backgroundColor: 'green', color: 'white'}}>
              Download Card
            </Button>
            }
            <Button onClick={onCloseDialog} autoFocus variant="contained" style={{backgroundColor: 'green', color: 'white'}}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
        </div>

    )
}

export default HighFrequencyScan;