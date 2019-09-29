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
    let end = false;
    
    setInterval(() => {
      if (end) {
        res.end()
      } else {
        console.log(new Date().toISOString());
      }
    }, interval);
    
    setTimeout(() => {
      res.write(new Date().toISOString());
      end = true;
      res.end();
    }, duration);


  })
  .listen(8080);

