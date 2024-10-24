import express from 'express';
import crypto from 'crypto';
import { Virhe } from '../errors/virhekasittelija';
import { PrismaClient } from '@prisma/client';

const prisma : PrismaClient = new PrismaClient();

const apiUutisetRouter : express.Router = express.Router();

apiUutisetRouter.use(express.json());

apiUutisetRouter.get("/", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

    try {
        res.json(await prisma.uutiset.findMany());
    } catch (e : any) {
        next(new Virhe());
    }

});

apiUutisetRouter.get("/kayttajat", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

    try {
        res.json(await prisma.kayttajat.findMany());
    } catch (e : any) {
        next(new Virhe());
    }

});

apiUutisetRouter.get("/kommentit", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

    try {
        res.json(await prisma.kommentit.findMany());
    } catch (e : any) {
        next(new Virhe());
    }

});

apiUutisetRouter.post("/kommentit", async (req : express.Request, res : express.Response, next : express.NextFunction) => {
 
    if (req.body.kommentti?.length > 0) {

      try {

          await prisma.kommentit.create({
              data : {
                uutisId : req.body.uutisId,
                kayttajatunnus : String(res.locals.kayttaja.kayttajatunnus),
                kommentti : req.body.kommentti,
                aikaleima : req.body.aikaleima
              }
          });
  
          res.json(await prisma.kommentit.findMany());
  
      } catch (e : any) {
          next(new Virhe())
      }

  } else {
      next(new Virhe(400, "Virheellinen pyynnön body"));
  } 

});

apiUutisetRouter.post("/kayttajat", async (req : express.Request, res : express.Response, next : express.NextFunction) => {
 
    if (req.body.kayttajatunnus.length > 0) {

    let hash : string = crypto.createHash("SHA512").update(req.body.salasana).digest("hex");

      try {

          await prisma.kayttajat.create({
              data : {
                kayttajatunnus : req.body.kayttajatunnus,
                salasana : hash,
              }
          });
  
          res.json(await prisma.kayttajat.findMany());
  
      } catch (e : any) {
          next(new Virhe())
      }

  } else {
      next(new Virhe(400, "Virheellinen pyynnön body"));
  } 

});


export default apiUutisetRouter;