import express from "express";
import { Worker } from "worker_threads";
import dotenv from 'dotenv'
import morgan from "morgan";
dotenv.config()

const app = express();
const PORT = process.env.PORT || 8000;

//MIDDLEWARE
app.use(morgan('dev'))

app.get("/non-block", (req, res) => {
  res.status(200).send({
    message: "server is running",
  });
});

app.get("/blocking", async(req, res) => {

  const worker = new Worker("./MultiThereading/worker.js");
  worker.on('message', (data=>{
    res.status(200).send(
        `Blocking server is running And Count is : ${data}`
      );
  }))

  worker.on('error', (error=>{
    res.status(200).send(
        `Blocking server is Crashed : ${error}`
      );
  }))

});

app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON ${PORT}`);
});

//THERE ARE 7 THREADS IN NODEJS INCULDING MAIN THREAD
//2 THREADS FOR TRASH AND REMANING FOUR IS OTHER PURPOSES
//TO CHECK HOW MANY CORE WE HAVE ** MAC=> sysctl -n hw.ncpu ** LINUX=> nproc ** WINDOWS=> echo %NUMBER_OF_PROCESSORS% (NO. => THIS IS MAX NO. YOU CAN UTILSE TO RUN YOUR THREADS PARALLEL)
