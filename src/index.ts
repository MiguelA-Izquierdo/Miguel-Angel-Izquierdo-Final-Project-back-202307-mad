import createDebug from 'debug';
import 'dotenv/config';
import { createServer } from 'http';
import { exit } from 'process';
import { app } from './app.js';
import { dbConnect } from './db/db.connect.js';

const debug = createDebug('TravelBook:Index');
debug('Started');
const PORT = process.env.PORT ?? 3000;

const server = createServer(app);

dbConnect()
  .then((mongoose) => {
    server.listen(PORT);
    debug('Connected to DB:', mongoose.connection.db.databaseName);
  })
  .catch((error) => {
    server.emit('error', error);
  });

server.on('listening', () => {
  const addressInfo = server.address();
  if (addressInfo === null) {
    server.emit('error', new Error('Invalid network address'));
    return;
  }

  let bind: string;
  if (typeof addressInfo === 'string') {
    bind = 'pipe ' + addressInfo;
  } else {
    bind =
      addressInfo.address === '::'
        ? `http://localhost:${addressInfo?.port}`
        : `port ${addressInfo?.port}`;
  }

  debug('Listening');
  console.log(`Listening on ${bind}`);
});

server.on('error', (error) => {
  debug(`Error ${error.message}`);
  exit(-1);
});
