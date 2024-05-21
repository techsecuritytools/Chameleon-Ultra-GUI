import React, { useState } from 'react';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea} from '@mui/material';


const { Buffer ,FreqType,TagType } = window.ChameleonUltraJS

const SavedCardToChameleon = (props) => {
  const [clicked, setClicked] = useState(Array(8).fill(false));
  const [messageWarning, setMessageWarning] = useState(false);

  const handleClickSlot = (index) => {
    
    setMessageWarning(false);
    const newClicked = Array(8).fill(false);
    newClicked[index] = !newClicked[index]; // Toggle the state for the clicked card
    setClicked(newClicked); // Update the stat
  };

  const saveToChameleon = async() => {
    if (!clicked.some(element => element === true)) {
      setMessageWarning(true);
    } else {
        let slotChoose = clicked.indexOf(true)
        setMessageWarning(false);
        if(props.chameleonInfo.isSlotsEnable[slotChoose].hf <= 0 || (props.chameleonInfo.isSlotsEnable[slotChoose].hf > 0 && window.confirm(`The Slot ${slotChoose+1} is already occupy. Are you sure you want to override it ?`))){
            let slotChoose = clicked.indexOf(true)
            try{
              await props.ultraUsb.cmdSlotChangeTagType(slotChoose, TagType.MIFARE_1024)
              await props.ultraUsb.cmdSlotSetEnable(slotChoose, FreqType.HF, true)
              await props.ultraUsb.cmdSlotSetActive(slotChoose)

              await props.ultraUsb.cmdHf14aSetAntiCollData({
                uid: props.dialogInfo.uid, 
                atqa: props.dialogInfo.atqa, 
                sak: props.dialogInfo.sak,
                ats: props.dialogInfo.ats
              })
              for(let x=0;x<props.dataCard.data.length;x++){
                  await props.ultraUsb.cmdMf1EmuWriteBlock((x),Buffer.from(props.dataCard.data[x],'hex'))
                  await props.ultraUsb.cmdSlotSaveSettings()
              }
              
              props.setOpenDialog(false)
              props.setAlertDialog({dialog:true,message:'The Data Was Saved In The Slot #'+(Number(slotChoose)+1)})
            }
            catch(e){
                console.log(e)
            }

        }
    }
  };

  return (
    <>
      <Divider style={{ marginTop: '2%', marginBottom: '2%' }}>Saved To Chameleon</Divider>
      <Box display="flex" justifyContent="center" flexWrap="wrap" gap={5}>
        {clicked.map((isClicked, index) => (
          <Card key={index} sx={{ 
              bgcolor: isClicked ? 'green' : 'background.paper',
              border: props.chameleonInfo.isSlotsEnable[index].hf > 0 ? '1px solid red' : '1px solid green', // Sets the border color to red and width to 1px
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
    </>
  );
};

export default SavedCardToChameleon;
