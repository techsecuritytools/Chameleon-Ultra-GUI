import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Radio from '@mui/material/Radio';
import { green,red } from '@mui/material/colors';
import Paper from '@mui/material/Paper';
import Keys from '../Keys/Keys';
import _ from 'lodash'

const { Buffer } = window.ChameleonUltraJS

const HighFrequencyScan = (props) => {

    const [openDialog,setOpenDialog] = useState(false);
    const [dialogInfo,setDialogInfo] = useState(false);

    
    Keys.loadKeys()
    let allKeys = Keys.getKeys()

    const recoveryKeysByDict = async() =>{


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
      
      console.log('End recovery ...')
      console.log('copykeysMifareA',copykeysMifareA)
      console.log('copykeysMifareB',copykeysMifareB)
      setDialogInfo(prevInfo => ({
        ...prevInfo,
        keysMifareA: copykeysMifareA, // Adding new data property
        keysMifareB: copykeysMifareB, // Adding new data property
      }));

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
  
      setDialogInfo(prevInfo => ({
        ...prevInfo,
        keysMifareA: keysA, // Adding new data property
        keysMifareB: keysB, // Adding new data property
      }));
    }catch(e){
      console.log('test : ',e)
    }
      setOpenDialog(true)
    };

    const onCloseDialog = () =>{
      setDialogInfo({})
      setOpenDialog(false)
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
                {dialogInfo !== undefined && dialogInfo.keysMifareA !== undefined?
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
                {dialogInfo !== undefined && dialogInfo.keysMifareB !== undefined?
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
            <Button onClick={recoveryKeysByDict}>recover Keys By Dict</Button>
            <Button onClick={onCloseDialog} autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
        </div>

    )
}

export default HighFrequencyScan;