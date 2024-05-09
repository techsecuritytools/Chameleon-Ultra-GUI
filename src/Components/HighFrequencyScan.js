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
import _ from 'lodash'
import Keys from '../Keys/Keys';



const HighFrequencyScan = (props) => {

    const [openDialog,setOpenDialog] = useState(false);
    const [dialogInfo,setDialogInfo] = useState(false);


      const handleConnectScan = async() => {

        try{
        const { Buffer, DarksideStatus, Mf1KeyType,Slot,FreqType} = window.ChameleonUltraJS
        const { Crypto1 } = window

        const block = 0
        const keyType = Mf1KeyType.KEY_A

        const actual = await props.ultraUsb.cmdHf14aScan()
        setDialogInfo(actual[0])

        Keys.getKeys()

/*
        const key = await Crypto1.darkside(
          async attempt => {
            const accquired = await props.ultraUsb.cmdMf1AcquireDarkside(block, keyType, attempt === 0)
            console.log(_.mapValues(accquired, buf => Buffer.isBuffer(buf) ? buf.toString('hex') : buf))
            if (accquired.status === DarksideStatus.LUCKY_AUTH_OK) throw new Error('LUCKY_AUTH_OK')
            if (accquired.status !== DarksideStatus.OK) throw new Error('card is not vulnerable to Darkside attack')
            return accquired
          },
          async key => {
            return await props.ultraUsb.cmdMf1CheckBlockKey({ block, keyType, key })
          },
        )
        console.log(`key founded: ${key.toString('hex')}`)
        
*/
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
        console.log('test : ',e)
      }
        setOpenDialog(true)
    };

    const onCloseDialog = () =>{
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
            <Button onClick={onCloseDialog}>Disagree</Button>
            <Button onClick={onCloseDialog} autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
        </div>

    )
}

export default HighFrequencyScan;