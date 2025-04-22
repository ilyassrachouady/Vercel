import ytdl from "ytdl-core";

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  try {
    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, {
      quality: "highest",
      filter: (format) => format.container === "mp4" && format.hasVideo && format.hasAudio,
    });

    res.setHeader("Content-Disposition", 'attachment; filename="video.mp4"');
    res.setHeader("Content-Type", "video/mp4");

    ytdl(url, { format }).pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to download video" });
  }
}
