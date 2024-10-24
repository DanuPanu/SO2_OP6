import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';


const YlaPalkki : React.FC = () : React.ReactElement => {

    const navigate : NavigateFunction = useNavigate();

    const klikki = () => {
        navigate("/rekisteröidy")
    }
return(
    <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography>Tehtävä 6 Uutiset</Typography>
        <Box>
            <Button href='http://localhost:3000/'>Kirjaudu ulos</Button>
            <Button variant='contained' onClick={klikki}>Rekisteröidy</Button>
        </Box>
    </Box>
)

}

export default YlaPalkki
