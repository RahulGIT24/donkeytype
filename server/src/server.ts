import express from 'express'
import {config} from 'dotenv'
import cors from "cors"

const app = express();
config()
app.use(express.json())
app.use(cors())
const port = process.env.PORT || 5000

app.get('/',(req,res)=>{
    res.send("Hello from Donkeytype")
})

app.listen(port,()=>{
    console.log("Server Listening on port ",port)
})