const axios = require('axios');
const express = require('express');
const sharp = require('sharp');
require('dotenv').config();

const app = express();

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
      .resize({ width, height })
      .toFormat(format)
      .toBuffer();

    res.set('Content-Type', `image/${format}`);
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    res.send(transformed);

  } catch (error) {
    res.json(error);
  }
});

app.listen(3000);
