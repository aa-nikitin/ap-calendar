const express = require('express');
const config = require('config');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api', require('./routes'));
app.use('/files', express.static(path.join(__dirname, 'files')));

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = config.get('port') || 5000;

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
