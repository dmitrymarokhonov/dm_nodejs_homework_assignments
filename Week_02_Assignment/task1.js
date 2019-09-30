const http = require('http');

const params = process.argv.slice(2);
params.length === 0 && exit();
params.forEach(p => isNaN(p) && exit());

function exit() {
  console.log(
    'Please insert numeric parameters (in seconds) for date print duration and intervals between each output'
  );
  process.exit();
}

let duration = +params[0] * 1000;
let interval = +params[1] * 1000;

http
  .createServer((req, res) => {
    console.log('Listening at port 8080');
    const endAt = new Date(new Date().getTime() + duration);
    const runInterval = setInterval(() => {
      const current = new Date();
      if (endAt < current) {
        clearInterval(runInterval);
        res.write(new Date().toISOString());
        res.end();
      } else {
        console.log(current.toISOString());
      }
    }, interval);
  })
  .listen(8080);
