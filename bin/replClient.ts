import { connect } from 'net';

const main = () => {
  const { argv } = process;

  let host = '127.0.0.1';
  let port = 2580;

  if (argv.length === 4) {
    host = argv[2];
    port = Number(argv[3]);
  } else if (argv.length === 3) {
    port = Number(argv[2]);
  } else {
    throw new Error('The command is supposed to be used as: yarn remote [server address] [REPL port]');
  }

  const sock = connect(port, host);

  process.stdin.pipe(sock);
  sock.pipe(process.stdout);

  sock.on('connect', function () {
    process.stdin.resume();
    process.stdin.setRawMode(true);
  });

  sock.on('close', function done() {
    process.stdin.setRawMode(false);
    process.stdin.pause();
    sock.removeListener('close', done);
  });

  process.stdin.on('end', function () {
    sock.destroy();
    console.log();
  });
};

main();
