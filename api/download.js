import pkg from '@vercel/node';
const { VercelRequest, VercelResponse } = pkg;

export default async function handler(req = VercelRequest, res = VercelResponse) {
  try {
    // Example of returning a simple response
    res.status(200).json({ message: "Hello, world!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
