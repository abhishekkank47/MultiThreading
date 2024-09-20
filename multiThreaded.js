import express from "express";
import morgan from "morgan";
import { Worker, workerData } from "worker_threads";

const app = express();
const PORT = 8000;
const THERAD_COUNT = 4;

//MIDDLEWARE
app.use(morgan('dev'))

app.get("/non-block", (req, res) => {
  res.status(200).send({
    message: "server is running",
  });
});

//FUNCTION FOR CREATING WORKERS
function createWorkers() {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./MultiThereading/divededWorkers.js", {
      workerData: { threadCount: THERAD_COUNT },
    });

    worker.on("message", (data) => {
      //TO RESOLVE PROMISES
      resolve(data);
    });

    worker.on("error", (error) => {
      //TO REJECT PROMISES
      reject(`Blocking server is Crashed : ${error}`);
    });
  });
}

app.get("/blocking", async (req, res) => {
  const workerPromises = [];

  for (let i = 0; i < THERAD_COUNT; i++) {
    workerPromises.push(createWorkers());
  }

  const theradResult = await Promise.all(workerPromises);
  const total =
    theradResult[0] + theradResult[1] + theradResult[2] + theradResult[3];
  res.status(200).send(`Blocking server is running And Count is : ${total}`);
});

app.listen(PORT, () => {
  console.log("SERVER IS RUNNING ON 8000");
});

//THERE ARE 7 THREADS IN NODEJS INCULDING MAIN THREAD
//2 THREADS FOR TRASH AND REMANING FOUR IS OTHER PURPOSES
//TO CHECK HOW MANY CORE WE HAVE ** MAC=> sysctl -n hw.ncpu ** LINUX=> nproc ** WINDOWS=> echo %NUMBER_OF_PROCESSORS% (NO. => THIS IS MAX NO. YOU CAN UTILSE TO RUN YOUR THREADS PARALLEL)
//THREADS DIVIDE CPU TASKS
