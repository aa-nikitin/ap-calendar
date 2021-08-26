const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const PORT = config.get('port') || 5000;

app.use('/api', require('./routes'));

async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true
      //   useCreateIndex: true
    });
    require('./config/config-passport');
    app.listen(PORT, () => console.log(`app has been started on PORT ${PORT}...`));
  } catch (error) {
    console.log('Server Error', error.message);
    process.exit(1);
  }
}

start();
