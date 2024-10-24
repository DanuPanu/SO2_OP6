import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Alert, Backdrop, CircularProgress, Stack, Button } from '@mui/material';
import { NavigateFunction, useNavigate } from 'react-router-dom';

interface Uutinen {
  uutisId : number
  otsikko : string
  sisalto : string
}

interface ApiData {
  uutiset : Uutinen[]
  virhe : string
  haettu : boolean
}

interface fetchAsetukset {
    method : string
    headers? : any
    body? : string
  }

interface Props {
    token : string
    nakyy : string
}

const Uutiset : React.FC<Props> = (props : Props) : React.ReactElement => {

const navigate : NavigateFunction = useNavigate();

const [apiData, setApiData] = useState<ApiData>({
                                      uutiset : [],
                                      virhe : "",
                                      haettu : false
                                    });

const apiKutsu = async (metodi? : string, uutinen? : Uutinen, id? : number) : Promise<void> => {

  setApiData({
    ...apiData,
    haettu : false
  });

  let url = `http://localhost:3106/api/uutiset`;

  let asetukset : fetchAsetukset = { 
    method : metodi || "GET",
    headers : {
      'Authorization' : `Bearer ${props.token}`
    }
  };
  
  try {

    const yhteys = await fetch(url, asetukset);

    if (yhteys.status === 200) {
      setApiData({
        ...apiData,
        uutiset : await yhteys.json(),
        haettu : true
      });
    } else {

      let virheteksti :string = "";

      switch (yhteys.status) {

        case 400 : virheteksti = "Virhe pyynnön tiedoissa"; break;
        case 401 : navigate("/login"); break
        default : virheteksti = "Palvelimella tapahtui odottamaton virhe"; break;
      }
                                
      setApiData({
        ...apiData,
        virhe : virheteksti,
        haettu : true
      });

    }
    
  } catch (e : any) {
    setApiData({
      ...apiData,
      virhe : "Palvelimeen ei saada yhteyttä",
      haettu : true
    });
  }
}
useEffect(() => {
  apiKutsu();
}, []);

const klikki = () => {
    navigate("/login")
}

  return (
    <>
    {(Boolean(apiData.virhe))
        ? <Alert severity="error">{apiData.virhe}</Alert>
        : (apiData.haettu) 
          ? <Stack
              spacing={2}>
                      <List>
                {apiData.uutiset.map((uutinen : Uutinen, idx : number) => {
                  return <ListItem 
                      key={idx}  
                    >
                    <ListItemText 
                      primary={uutinen.otsikko}
                      secondary={uutinen.sisalto}
                    />
                       </ListItem> 
                    })}               
                
              </List>
              <Button sx={{display : props.nakyy}} onClick={klikki}>Kirjaudu sisään kommentoidaksesi</Button>
            </Stack>
          : <Backdrop open={true}>
              <CircularProgress color='inherit'/>
            </Backdrop>
            
        }
    </>
  );
}

export default Uutiset;
