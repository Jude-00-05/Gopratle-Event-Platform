import Link from 'next/link';
import { ArrowRight, CalendarDays, ClipboardCheck, Sparkles, UsersRound } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import styles from './page.module.css';

const steps = [
  { icon: CalendarDays, title: 'Share the occasion', copy: 'Tell us what you’re planning, when it is, and where it will happen.' },
  { icon: UsersRound, title: 'Set your requirements', copy: 'Choose a planner, performer, or crew and spell out what you need.' },
  { icon: ClipboardCheck, title: 'Review your brief', copy: 'Check the details and send one clear brief to the GoPratle team.' },
];

export default function Home() {
  return (
    <div className={styles.page}>
      <Navbar />
      <main>
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <span className={styles.eyebrow}><Sparkles size={14} aria-hidden="true" /> A better way to plan together</span>
              <h1>Good events start with a <span>clear plan.</span></h1>
              <p>Bring your event vision and the right people together. Tell us what you have in mind and we’ll help shape the brief.</p>
              <div className={styles.actions}>
                <Link href="/requirements/new" className={styles.primaryCta}>Start your event brief <ArrowRight size={17} /></Link>
                <Link href="/requirements" className={styles.secondaryCta}>Explore requirements</Link>
              </div>
              <p className={styles.note}>A few thoughtful details are all you need to get started.</p>
            </div>
            <div className={styles.heroAside} aria-label="Plan overview">
              <div className={styles.asideTop}><span className={styles.liveDot} /> Your event, taking shape</div>
              <div className={styles.asideRule} />
              <p className={styles.asideLabel}>A clear brief brings</p>
              <p className={styles.asideHeadline}>the right details<br />into one place.</p>
              <div className={styles.asideItems}>
                <span><CalendarDays size={16} /> Event details</span>
                <span><UsersRound size={16} /> People you need</span>
                <span><ClipboardCheck size={16} /> Plans & preferences</span>
              </div>
              <div className={styles.asideFoot}>Thoughtful planning starts here</div>
            </div>
          </div>
        </section>
        <section className={styles.process}>
          <div className={styles.processInner}>
            <div className={styles.sectionHeading}>
              <h2>From first idea to a useful brief.</h2>
              <p>Three simple moments to get the important details in order.</p>
            </div>
            <div className={styles.steps}>
              {steps.map(({ icon: Icon, title, copy }, index) => (
                <article className={styles.step} key={title}>
                  <div className={styles.stepTop}><span className={styles.stepIcon}><Icon size={19} strokeWidth={1.8} /></span><span className={styles.stepNumber}>0{index + 1}</span></div>
                  <h3>{title}</h3><p>{copy}</p>
                </article>
              ))}
            </div>
            <div className={styles.bottomCta}><p>Have an event in mind?</p><Link href="/requirements/new">Create your brief <ArrowRight size={16} /></Link></div>
          </div>
        </section>
      </main>
      <footer className={styles.footer}><span>GoPratle</span><span>Plan well. Celebrate fully.</span><Link href="/requirements">Browse requirements</Link></footer>
    </div>
  );
}
