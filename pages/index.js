import Head from 'next/head';
import { getDb } from '../lib/mongodb';
import { DEFAULTS as PROFILE_DEFAULTS } from './api/profile';

import CosmicBackground from '../components/CosmicBackground';
import Cursor from '../components/Cursor';
import Nav from '../components/Nav';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import ResumeSection from '../components/ResumeSection';
import About from '../components/About';
import Skills from '../components/Skills';
import Certificates from '../components/Certificates';
import Projects from '../components/Projects';
import Education from '../components/Education';
import Contact from '../components/Contact';
import Quote from '../components/Quote';
import Footer from '../components/Footer';

export default function Home({ profile, skills, certificates, projects, education }) {
  return (
    <>
      <Head>
        <title>{profile.name} — Web Developer, Frontend &amp; UI</title>
      </Head>

      <CosmicBackground />
      <Cursor />
      <Nav email={profile.email} />

      <main id="top">
        <Hero profile={profile} />
        <Marquee />
        <ResumeSection profile={profile} />

        <About profile={profile} />
        <Quote text={<><span className="grad-text">Code is like humor</span> — when you have to explain it, it&apos;s bad.</>} cite="Cory House" />

        <Skills skills={skills} />
        <Certificates certificates={certificates} />
        <Quote text={<>First, <span className="grad-text">solve the problem.</span> Then, write the code.</>} cite="John Johnson" />

        <Projects projects={projects} />
        <Education education={education} />
        <Quote text={<>Turning ideas into <span className="grad-text">interfaces,</span> one commit at a time.</>} cite={profile.name} />

        <Contact profile={profile} />
      </main>

      <Footer />
    </>
  );
}

export async function getServerSideProps() {
  const db = await getDb();

  const [profileDoc, skills, certificates, projects, education] = await Promise.all([
    db.collection('profile').findOne({ _id: 'main' }),
    db.collection('skills').find({}).sort({ order: 1 }).toArray(),
    db.collection('certificates').find({}).sort({ order: 1 }).toArray(),
    db.collection('projects').find({}).sort({ order: 1 }).toArray(),
    db.collection('education').find({}).sort({ order: 1 }).toArray()
  ]);

  const profile = JSON.parse(JSON.stringify(profileDoc || PROFILE_DEFAULTS));

  return {
    props: {
      profile,
      skills: JSON.parse(JSON.stringify(skills)),
      certificates: JSON.parse(JSON.stringify(certificates)),
      projects: JSON.parse(JSON.stringify(projects)),
      education: JSON.parse(JSON.stringify(education))
    }
  };
}
