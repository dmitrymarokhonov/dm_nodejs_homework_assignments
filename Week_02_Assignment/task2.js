const http = require('http');

const params = process.argv.slice(2);
params.length < 2 && exit();
params.forEach(p => isNaN(p) && exit());

function exit() {
  console.log(
    'Please insert numeric parameters (in seconds) for date print duration and intervals between each output'
  );
  process.exit();
}

let duration = +params[0] * 1000;
let interval = +params[1] * 1000;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

http
  .createServer(async (req, res) => {
    console.log('Listening at port 8080');
    debugger;
    const endAt = new Date(new Date().getTime() + duration);
    let end = false;
    while (!end) {
      const current = new Date();
      if (current > endAt) {
        end = true;
      } else {
        console.log(current);
        await sleep(interval);
      }
    }
    res.write(new Date().toISOString());
    res.end();
  })
  .listen(8080);
