
import React from 'react';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Radio from '@mui/material/Radio';
import { green,red } from '@mui/material/colors';
import Paper from '@mui/material/Paper';
import _ from 'lodash'
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

const ScannedCardDisplay = (props) => {

    return(
        <>
          <DialogTitle id="alert-dialog-title">
            Scanned Card Info
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
            {props.dialogInfo?
              Object.entries(props.dialogInfo).map(([key, value]) => (
                !key.includes('keysMifare') ?
                <div key={key}>
                  <strong>{key}</strong>: {value.toString('hex')}
                </div>
                :
                <div />
              ))
              :
              "No Card Detected"
            }
            {props.dialogInfo?
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
                {props.dialogInfo !== undefined && props.dialogInfo.keysMifareA !== undefined?
                props.dialogInfo.keysMifareA.map((row) => (
                  <TableCell >
                    {!row.status && props.isRecoveryKeysInProcess?
                    <Box sx={{ display: 'flex' }}>
                      <CircularProgress />
                    </Box>
                    :
                    <Tooltip title={row.key} placement="top">
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
                    </Tooltip>
                    }
                  </TableCell>
                ))
                : ''  
              }
              </TableRow>
              <TableRow
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <TableCell align="center">B</TableCell>
                {props.dialogInfo !== undefined && props.dialogInfo.keysMifareB !== undefined?
                props.dialogInfo.keysMifareB.map((row) => (
                  <TableCell >
                    {!row.status && props.isRecoveryKeysInProcess?
                    <Box sx={{ display: 'flex' }}>
                      <CircularProgress />
                    </Box>
                    :
                    <Tooltip title={row.key} placement="top">
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
                    </Tooltip>
                    }
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
        </>
    )
}
export default ScannedCardDisplay