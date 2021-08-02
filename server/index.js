const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const redis = require('redis');

const keys = require('./keys');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
});
pgClient.on('error', () => console.log('Lost Postgres connection'));
pgClient.on('connect', client => {
  client
    .query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch(err => console.log(err(err)));
});

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});
const redisPublisher = redisClient.duplicate();

app.get('/', (req, res) => {
  res.send('Sup.');
});

app.get('/values/all', async (req, res) => {
  try {
    const values = await pgClient.query('SELECT * from values');
    res.send(values.rows);
  } catch (e) {
    console.error(e);
    res.status(400).send({});
  }
});

app.get('/values/current', async (req, res) => {
  try {
    redisClient.hgetall('values', (err, values) => {
      res.send(values);
    });
  } catch (e) {
    console.error(e);
    res.status(400).send({});
  }
});

app.post('/values', async (req, res) => {
  try {
    const { index } = req.body;
    if (parseInt(index) > 40) {
      return res.status(422).send('Index is too high.');
    }

    redisClient.hset('values', index, 'Nothing yet!');
    redisPublisher.publish('insert', index);

    pgClient.query(`INSERT INTO values(number) VALUES(${index})`);

    res.send({ working: true });
  } catch (e) {
    console.log(e);
    res.status(400).send({});
  }
});

app.listen(5000, err => {
  console.log('Listening on port 5000');
});
