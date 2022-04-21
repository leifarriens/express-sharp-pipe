const axios = require('axios');
const express = require('express');
const morgan = require('morgan');
const sharp = require('sharp');
require('dotenv').config();

const app = express();

app.use(morgan('tiny'));

app.get('/:filename', async (req, res) => {
  const { filename } = req.params;
  let { width, height, format = 'webp' } = req.query;

  width = parseInt(width) || null;
  height = parseInt(height) || null;

  try {
    const { data } = await axios.get(`${process.env.CDN_URL}/${filename}`, {
      responseType: 'arraybuffer',
    });

    const buffer = Buffer.from(data, 'base64');

    const transformed = await sharp(buffer)
      .resize({
        width,
        height,
        withoutEnlargement: true,
      })
      .toFormat(format, { quality: 100 })
      .toBuffer();

    res.set('Content-Type', `image/${format}`);
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    return res.send(transformed);
  } catch (error) {
    console.log(error);
    res.json({
      message: error.message,
    });
  }
});

app.listen(3000);
