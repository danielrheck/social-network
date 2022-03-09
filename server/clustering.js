const cluster = require("cluster");
const os = require("os");

function clusterFork() {
    let nrProc = os.cpus().length;

    cluster.setupMaster({
        exec: "./server/server.js",
    });

    for (let i = 0; i <= nrProc; i++) {
        cluster.fork();
    }

    cluster.on("exit", function (worker) {
        console.log(`${worker.process.pid} is down. Starting again...`);
        cluster.fork();
    });
}

clusterFork();
