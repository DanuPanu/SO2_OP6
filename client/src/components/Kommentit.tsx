import React, { useEffect, useRef, useState } from 'react';
import { List, ListItem, ListItemText, Alert, Backdrop, CircularProgress, Stack, TextField, Button, Container, Box, Typography } from '@mui/material';

interface Kommentti {
  kommenttiId : number
  uutisId : number
  kayttajatunnus : string
  kommentti : string
  aikaleima : string
}

interface ApiData {
  kommentit : Kommentti[]
  virhe : string
  haettu : boolean
}

interface Props {
  token : string
}

const Kommentit : React.FC<Props> = (props : Props) : React.ReactElement => {

  const paiva : String = new Date().toLocaleString("de-DE");

  const lomakeRef = useRef<any>();

  const [apiData, setApiData] = useState<ApiData>({
                                        kommentit : [],
                                        virhe : "",
                                        haettu : false
                                      });


  const lisaaKommentti = (e: React.FormEvent) => {
    e.preventDefault();

    apiKutsu("POST", {
      kommenttiId: 0,
      uutisId : 1,
      kayttajatunnus : "",
      kommentti : lomakeRef.current?.uusiKommentti.value,
      aikaleima : String(paiva)
    });
  }

const apiKutsu = async (metodi? : string, kommentti? : Kommentti, id? : number) : Promise<void> => {

  setApiData({
    ...apiData,
    haettu : false
  });

  let url = `http://localhost:3106/api/kaikki/kommentit`;

  let asetukset : any = { 
    method : metodi || "GET",
    headers : {
      'Authorization' : `Bearer ${props.token}`
    }
  };

  if (metodi === "POST") {

    asetukset = {
      ...asetukset,
      headers : {
        ...asetukset.headers,
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify(kommentti)
    }

  }
  
  try {

    const yhteys = await fetch(url, asetukset);

    if (yhteys.status === 200) {
      setApiData({
        ...apiData,
        kommentit : await yhteys.json(),
        haettu : true
      });
    } else {

      let virheteksti :string = "";

      switch (yhteys.status) {

        case 400 : virheteksti = "Virhe pyynnön tiedoissa"; break;
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

  return (
    <>
    {(Boolean(apiData.virhe))
        ? <Alert severity="error">{apiData.virhe}</Alert>
        : (apiData.haettu) 
          ? <Stack
              component="form"
              onSubmit={lisaaKommentti}
              ref={lomakeRef}
              spacing={2}>
                      <List>
                {apiData.kommentit.map((kommentti : Kommentti, idx : number) => {
                  return <ListItem 
                      key={idx}
                    >
                    <ListItemText 
                      primary={kommentti.kommentti}
                      secondary={`Käyttäjätunnus: ${kommentti.kayttajatunnus}, aika: ${kommentti.aikaleima}, uutis id: ${kommentti.uutisId}`}
                    />
                       </ListItem> 
                    })}               
              </List>
              <TextField name="uusiKommentti" label="Kommentoi..." multiline/>
              <Button type='submit' variant='contained'>Jätä kommentti</Button>
            </Stack>
          : <Backdrop open={true}>
              <CircularProgress color='inherit'/>
            </Backdrop>
            
      }
    </>
  );
}

export default Kommentit;
