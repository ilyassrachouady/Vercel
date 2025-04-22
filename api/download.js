// File: api/download.js

const ytdl = require('ytdl-core');

module.exports = async (req, res) => {
  const { url } = req.query;

  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).json({ error: 'Invalid YouTube URL' });
  }

  try {
    const info = await ytdl.getInfo(url);

    const format = ytdl.chooseFormat(info.formats, {
      quality: '18', // mp4 360p — stable
      filter: 'audioandvideo',
    });

    if (!format || !format.url) {
      return res.status(500).json({ error: 'No downloadable format found' });
    }

    res.setHeader('Content-Disposition', `attachment; filename="video.mp4"`);
    ytdl(url, { format }).pipe(res);

  } catch (err) {
    console.error('Download error:', err);
    res.status(500).json({ error: 'Failed to download video' });
  }
};
