import { getDb } from '../../lib/mongodb';

const DEFAULTS = {
  _id: 'main',
  name: 'Ananya Goyal',
  eyebrow: 'Web Developer · Frontend & UI',
  heroLine1: "Hi, I'm",
  heroLine2: 'Ananya Goyal.',
  funkyHero: 'console.log("hello, world 👋");',
  heroDesc:
    'Part coder, part designer, permanently curious. I like taking ideas from "what if we made this?" to "wait… this actually works."',
  aboutHeadingLine1: 'Part coder, part designer,',
  aboutHeadingLine2: 'permanently curious.',
  aboutParagraph:
    "I'm into web development, clean UI, creative design, and building digital experiences that feel as good as they look. Currently learning, breaking, fixing, and building my way toward full-stack development.",
  location: 'Bengaluru, IN',
  email: 'ananya00476@gmail.com',
  github: 'https://github.com/ananyagoyal04',
  linkedin: 'https://www.linkedin.com/in/ananya-goyal040706/',
  resumeUrl: '',
  portraitUrl: ''
};

export default async function handler(req, res) {
  const db = await getDb();
  const col = db.collection('profile');

  try {
    if (req.method === 'GET') {
      const doc = await col.findOne({ _id: 'main' });
      return res.status(200).json(doc || DEFAULTS);
    }

    if (req.method === 'PUT') {
      const { _id, ...rest } = req.body || {};
      await col.updateOne({ _id: 'main' }, { $set: rest }, { upsert: true });
      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', ['GET', 'PUT']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export { DEFAULTS };
