import React, { Dispatch, SetStateAction, useRef } from "react";
import { Backdrop, Box, Button, Paper, Stack, TextField, Typography} from "@mui/material";
import { useNavigate, NavigateFunction } from 'react-router-dom';

interface Props {
    setToken : Dispatch<SetStateAction<string>>
    setNakyy : any
}

const Login: React.FC<Props> = (props : Props) : React.ReactElement => {

    const klikki = () => {
        navigate("/")
    }

    const navigate : NavigateFunction = useNavigate();

    const lomakeRef = useRef<HTMLFormElement>();

    const kirjaudu = async (e : React.FormEvent) : Promise<void> => {
        
        e.preventDefault();

        if (lomakeRef.current?.kayttajatunnus.value) {

            if (lomakeRef.current?.salasana.value) {

                const yhteys = await fetch("http://localhost:3106/api/auth/login", {
                    method : "POST",
                    headers : {
                        'Content-Type' : 'application/json'
                    },
                    body : JSON.stringify({
                        kayttajatunnus : lomakeRef.current?.kayttajatunnus.value,
                        salasana : lomakeRef.current?.salasana.value
                    })
                });

                if (yhteys.status === 200) {

                    let {token} = await yhteys.json();

                    props.setToken(token);

                    localStorage.setItem("token", token);

                    props.setNakyy("none")

                    navigate("/kaikki");

                }

            } 
        } 
    };

    return (
            <Backdrop open={true}>
                <Paper sx={{padding : 2}}>
                    <Box
                        component="form"
                        onSubmit={kirjaudu}
                        ref={lomakeRef}
                        style={{
                            width: 300,
                            backgroundColor : "#fff",
                            padding : 20
                        }}
                    >
                        <Stack spacing={2}>
                            <Typography variant="h6">Kirjaudu sisään</Typography>
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
                                Kirjaudu
                            </Button>
                            <Button onClick={klikki}>Peruuta</Button>
                            <Typography>
                                (Kirjaudu testitunnuksilla: käyttäjä: besserwisser, salasana: kissakala)
                            </Typography>
                        </Stack>
                        
                    </Box>
                </Paper>
            </Backdrop>
    );
};

export default Login;