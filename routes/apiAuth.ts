import express from 'express';
import { PrismaClient } from '@prisma/client';
import { Virhe } from '../errors/virhekasittelija';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const apiAuthRouter : express.Router = express.Router();

const prisma : PrismaClient = new PrismaClient();

apiAuthRouter.use(express.json());

apiAuthRouter.post("/login", async (req : express.Request, res : express.Response, next : express.NextFunction) : Promise<void> => {

    try {

        const kayttaja = await prisma.kayttajat.findFirst({
            where : {
                kayttajatunnus : req.body.kayttajatunnus
            }
        });

        if (req.body.kayttajatunnus === kayttaja?.kayttajatunnus) {

            let hash = crypto.createHash("SHA512").update(req.body.salasana).digest("hex");

            if (hash === kayttaja?.salasana) {

                let token = jwt.sign({kayttajatunnus : kayttaja.kayttajatunnus}, "ToinenSuuriSalaisuus!!!");

                res.json({ token : token })

            } else {
                next(new Virhe(401, "Virheellinen käyttäjätunnus tai salasana"));
            }

        } else {
            next(new Virhe(401, "Virheellinen käyttäjätunnus tai salasana"));
        }

    } catch {
        next(new Virhe());
    }

});

export default apiAuthRouter;