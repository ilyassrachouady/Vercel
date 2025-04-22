import { VercelRequest, VercelResponse } from '@vercel/node';
import ytdl from 'ytdl-core';

// Download video handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Get the URL from the request query parameter
  const videoUrl = req.query.url as string;
  
  if (!videoUrl || !ytdl.validateURL(videoUrl)) {
    return res.status(400).json({ error: 'Invalid or missing video URL' });
  }

  try {
    // Fetch video information
    const info = await ytdl.getInfo(videoUrl);
    
    // Filter the formats to find the best available video format (audio + video)
    const formats = ytdl.filterFormats(info.formats, 'audioandvideo');
    if (formats.length === 0) {
      return res.status(404).json({ error: 'No suitable video format found' });
    }

    // Get the best format (you can also choose a specific format based on resolution, etc.)
    const selectedFormat = formats[0];
    
    // Set appropriate headers for downloading the video file
    res.setHeader('Content-Type', selectedFormat.container);
    res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');
    
    // Pipe the video stream to the response
    ytdl(videoUrl, { format: selectedFormat })
      .pipe(res)
      .on('finish', () => {
        console.log('Video download completed');
      })
      .on('error', (error) => {
        console.error('Download error:', error);
        res.status(500).json({ error: 'Failed to download video' });
      });
    
  } catch (error) {
    console.error('Failed to download video:', error);
    
    // Handling specific errors
    if (error instanceof ytdl.YTError) {
      if (error.message.includes('410')) {
        return res.status(410).json({ error: 'Video unavailable (status 410)' });
      }
    }
    
    // Generic error handler
    return res.status(500).json({ error: 'Failed to download video' });
  }
}
