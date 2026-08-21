/**
 * Usage: npm run seed
 * Loads your original portfolio content into MongoDB so the site
 * looks the same as before the very first time it goes live.
 * Safe to re-run — it clears and re-inserts each collection.
 */
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'portfolio';

const skills = [
  { category: 'Languages', items: ['C', 'C++', 'Java', 'Python', 'JavaScript'], order: 0 },
  { category: 'Web', items: ['HTML', 'CSS', 'React.js', 'Vite'], order: 1 },
  { category: 'Design', items: ['Figma', 'UI/UX'], order: 2 },
  { category: 'Tools', items: ['Git', 'GitHub', 'VS Code'], order: 3 },
  { category: 'Database / Cloud', items: ['MongoDB', 'Firebase'], order: 4 },
  { category: 'Exploring', items: ['Node.js', 'REST APIs', 'Full-Stack Development'], order: 5 }
];

const certificates = [
  {
    title: 'MongoDB Certified Associate',
    subtitle: 'Atlas Administrator',
    imageUrl: '',
    certUrl: '',
    order: 0
  },
  { title: 'Exploring Data Analysis', subtitle: 'Infosys Springboard', imageUrl: '', certUrl: '', order: 1 },
  {
    title: 'Data Visualization using Python',
    subtitle: 'Infosys Springboard',
    imageUrl: '',
    certUrl: '',
    order: 2
  },
  { title: 'Programming using Java', subtitle: 'Infosys Springboard', imageUrl: '', certUrl: '', order: 3 }
];

const projects = [
  {
    name: 'Parkwise',
    status: 'Prototype · In Progress',
    description:
      "A smart parking solution I'm currently prototyping — helping drivers find and reserve a spot without the usual guesswork. Still early, still rough around the edges, still very much mine.",
    techStack: ['React.js', 'Node.js', 'MongoDB', 'Firebase'],
    funkyLine: 'turning "no parking" signs into a UI problem',
    order: 0
  }
];

const education = [
  {
    level: '24—NOW',
    degree: 'B.E. Computer Science & Engineering',
    institution: 'Nitte Meenakshi Institute of Technology (NMIT), Bengaluru',
    note: 'Currently surviving semester assignments, collecting skills, and building things along the way.',
    years: '2024 — Present',
    score: 'CGPA — 8.9',
    order: 0
  },
  {
    level: '12th',
    degree: 'Class XII',
    institution: 'Holy Angels Convent School, Muzaffarnagar, Uttar Pradesh',
    note: 'Wrapped up school with 70% — the last stop before engineering took over.',
    years: '',
    score: 'Score — 70%',
    order: 1
  }
];

const profile = {
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

async function seed() {
  if (!uri) {
    console.error('Missing MONGODB_URI — check your .env.local file.');
    process.exit(1);
  }
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  await db.collection('skills').deleteMany({});
  await db.collection('skills').insertMany(skills);

  await db.collection('certificates').deleteMany({});
  await db.collection('certificates').insertMany(certificates);

  await db.collection('projects').deleteMany({});
  await db.collection('projects').insertMany(projects);

  await db.collection('education').deleteMany({});
  await db.collection('education').insertMany(education);

  await db.collection('profile').updateOne({ _id: 'main' }, { $set: profile }, { upsert: true });

  console.log('Seed complete: skills, certificates, projects, education, profile.');
  await client.close();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
