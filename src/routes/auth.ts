import * as Express from "express";
import { userRouter } from "./user/user";
import { check, validationResult } from "express-validator";
import { Request, Response } from "express-serve-static-core";
import { getManager } from "typeorm";
import { User } from "../entity/User";
import * as bcrypt from "bcrypt";
export const authRouter = Express.Router();
authRouter.post('/register', [
    check('username').isLength({ min: 5, max: 35 }),
    check('email').isEmail(),
    check('password').isLength({ min: 8, max: 35 }),
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).send({ errors });
    } else {
        const userRepo = getManager().getRepository(User);
        const user = await userRepo.findOne({ where: { email: req.body.email } });
        if(!user) {
            const newUser = new User();
            newUser.email = req.body.email;
            newUser.username = req.body.username;
            bcrypt.hash(req.body.password,10,async (err,passwordHash) => {
                if(err) {
                    throw err;
                }
                newUser.passwordHash = passwordHash;
                const savedUser = await userRepo.save(newUser);
                res.status(200).send({id: savedUser.id});
            })
        } else {
            res.status(409).send({msg: 'user already registered!'});
        }
    }
});