
import { parentPort, workerData } from "worker_threads";

let counter=0
for (let i = 0; i < 20_000_000_000 / workerData.threadCount ; i++) {
    counter++;
}

//BECAUSE OF THIS WE COMMUNICATE TO MAIN THREAD 
parentPort.postMessage(counter) 