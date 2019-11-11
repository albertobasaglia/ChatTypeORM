import * as Express from "express";
export const userRouter = Express.Router();
userRouter.get('/list',(req,res) => {
    res.send('Listing users!');
});