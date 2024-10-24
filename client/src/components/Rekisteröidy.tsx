import React, { useEffect, useRef, useState } from "react";
import { Backdrop, Box, Button, Paper, Stack, TextField, Typography} from "@mui/material";
import { useNavigate, NavigateFunction } from 'react-router-dom';

interface Props {
  token : string
}

interface Kayttaja {
  kayttajaId : number
  kayttajatunnus : string
  salasana : string
}

interface ApiData {
  kayttajat : Kayttaja[]
  virhe : string
  haettu : boolean
}

const Rekisteröidy: React.FC<Props> = (props : Props) : React.ReactElement => {

    const klikki = () => {
        navigate("/")
    }

    const navigate : NavigateFunction = useNavigate();

    const lomakeRef = useRef<any>();

  const [apiData, setApiData] = useState<ApiData>({
                                        kayttajat : [],
                                        virhe : "",
                                        haettu : false
                                      });


  const lisaaKayttaja = async (e: React.FormEvent) => {
    e.preventDefault();

    apiKutsu("POST", {
      kayttajaId : 0,
      kayttajatunnus : lomakeRef.current?.kayttajatunnus.value,
      salasana : lomakeRef.current?.salasana.value,
    });

    const yhteys = await fetch("http://localhost:3106/api/uutiset/kayttajat")
    if (yhteys.status === 200){
      navigate("/")
    }

  }

const apiKutsu = async (metodi? : string, kayttaja? : Kayttaja, id? : number) : Promise<void> => {

  setApiData({
    ...apiData,
    haettu : false
  });

  let url = `http://localhost:3106/api/uutiset/kayttajat`;

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
      body : JSON.stringify(kayttaja)
    }

  }
  
  try {

    const yhteys = await fetch(url, asetukset);

    if (yhteys.status === 200) {
      setApiData({
        ...apiData,
        kayttajat : await yhteys.json(),
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
            <Backdrop open={true}>
                <Paper sx={{padding : 2}}>
                    <Box
                        component="form"
                        onSubmit={lisaaKayttaja}
                        ref={lomakeRef}
                        style={{
                            width: 300,
                            backgroundColor : "#fff",
                            padding : 20
                        }}
                    >
                        <Stack spacing={2}>
                            <Typography variant="h6">Anna uusi käyttäjätunnus ja salasana</Typography>
                            <TextField 
                                label="Käyttäjätunnus" 
                                name="kayttajatunnus"
                            />
                            <TextField 
                                label="Salasana"
                                name="salasana"
                                type="password" 
                            />
                            <Button 
                                type="submit" 
                                variant="contained" 
                                size="large"
                            >
                                Rekisteröidy
                            </Button>
                            <Button onClick={klikki}>Peruuta</Button>
                        </Stack>
                        
                    </Box>
                </Paper>
            </Backdrop>
    );
};

export default Rekisteröidy;