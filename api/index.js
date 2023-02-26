import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/" , (req , res) => {
    res.status(200).send({message : "this is chatgpt message"})
})

app.listen(4000 , () => {
    console.log("server is run");
})