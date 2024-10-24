import express from 'express';
import path from 'path';
import apiUutisetRouter from './routes/apiUutiset';
import virhekasittelija from './errors/virhekasittelija';
import apiAuthRouter from './routes/apiAuth';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app : express.Application = express();

const portti : number = Number(process.env.PORT) || 3106;

app.use(cors({origin : "http://localhost:3000"}));

app.use(express.static(path.resolve(__dirname, "public")));

const checkToken = (req : express.Request, res : express.Response, next : express.NextFunction) => {

    try {

        let token : string = req.headers.authorization!.split(" ")[1];

        res.locals.kayttaja = jwt.verify(token, "ToinenSuuriSalaisuus!!!");

        next();

    } catch (e: any) {
        res.status(401).json({});
    }
}

app.use("/api/auth", apiAuthRouter);

app.use("/api/uutiset", apiUutisetRouter);

app.use("/api/rekisteröidy", apiUutisetRouter);

app.use("/api/kaikki", checkToken, apiUutisetRouter);

app.use(virhekasittelija);

app.use((req : express.Request, res : express.Response, next : express.NextFunction) => {

    if (!res.headersSent) {
        res.status(404).json({ viesti : "Virheellinen reitti"});
    }

    next();
});

app.listen(portti, () => {

    console.log(`Palvelin käynnistyi porttiin : ${portti}`);    

});