'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Mail, Linkedin, MapPin, Github } from 'lucide-react';
import Navigation from './components/Navigation';
import { Typewriter } from 'react-simple-typewriter';
import {
  Card,
  Button,
  AnimatedSection,
  TimelineItem,
  ProjectCard,
  AnalysisCard,
} from './components/ui';
import { Badge } from '@hannasage/projection-ui';
import {
  getPersonalInfo,
  getSkillsData,
  getExperienceData,
  getMetadataInfo,
  getSideProjectsData,
  getAnalysesData,
} from './lib/content-loader';

const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Stack' },
  { id: 'experience', label: 'Work' },
  { id: 'analyses', label: 'Analyses' },
  { id: 'applications', label: 'Applications' },
  { id: 'contact', label: 'Contact' },
];

export default function Home() {
  const [activeSection, setActiveSection] = useState('home');

  const personalInfo = getPersonalInfo();
  const skillsData = getSkillsData();
  const experienceData = getExperienceData();
  const sideProjectsData = getSideProjectsData();
  const analysesData = getAnalysesData();
  const metadata = getMetadataInfo();

  const featuredProject = sideProjectsData.projects.find((p) => p.featured);
  const otherProjects = sideProjectsData.projects.filter((p) => !p.featured);

  const featuredAnalysis = analysesData.analyses.find((a) => a.featured);
  const otherAnalyses = analysesData.analyses.filter((a) => !a.featured);

  // Mark that this visitor has been on the resume site during this session.
  // Standalone analysis pages read this to decide whether to offer a "back to
  // site" link — shared links opened cold never get one. Not a URL query, so
  // the shared URL stays clean.
  useEffect(() => {
    try {
      sessionStorage.setItem('sa:fromResume', '1');
    } catch {
      /* private mode / storage disabled — no back link, acceptable */
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'skills', 'experience', 'analyses', 'applications', 'contact'];
      const scrollPosition = window.scrollY + 120;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const targetId = sectionId === 'contact' ? 'contact-info' : sectionId;
    const element = document.getElementById(targetId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <Navigation
        activeSection={activeSection}
        scrollToSection={scrollToSection}
      />

      <main>

      {/* Hero */}
      <section
        id="home"
        className="relative min-h-screen flex items-center overflow-hidden pt-14"
      >
        {/* dotted grid backdrop, à la Projection */}
        <div
          aria-hidden
          className="absolute inset-0 grid-bg opacity-40 pointer-events-none"
        />
        {/* soft lime glow */}
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            top: '12%',
            right: '-15%',
            width: '60vw',
            height: '60vw',
            background:
              'radial-gradient(closest-side, var(--color-accent-soft), transparent)',
            filter: 'blur(40px)',
          }}
        />

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left column */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-2 mb-5"
              >
                <span className="pip" aria-hidden />
                <span className="eyebrow">Open to opportunities</span>
              </motion.div>

              <motion.h1
                className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tightish text-ink mb-5"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.7 }}
              >
                {personalInfo.name},
                <br />
                <span className="text-accent">
                  <Typewriter
                    words={personalInfo.typewriterWords}
                    loop={0}
                    cursor
                    cursorStyle="_"
                    typeSpeed={70}
                    deleteSpeed={50}
                    delaySpeed={1500}
                  />
                </span>
              </motion.h1>

              <motion.p
                className="text-ink-dim text-base sm:text-lg max-w-xl mb-4 leading-relaxed"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.7 }}
              >
                {personalInfo.heroDescription}
              </motion.p>

              <motion.div
                className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-widest2 text-ink-muted mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" />
                  {personalInfo.location}
                </span>
                <span aria-hidden>·</span>
                <span>7+ years experience</span>
              </motion.div>

              <motion.div
                className="flex flex-wrap items-center gap-3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <Button onClick={() => scrollToSection('experience')}>
                  View experience
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => scrollToSection('contact')}
                >
                  Contact
                </Button>
              </motion.div>

              <motion.div
                className="grid grid-cols-3 gap-3 sm:gap-4 mt-10 max-w-xl"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.7 }}
              >
                {[
                  { k: 'Tenure', v: '7+ yr' },
                  { k: 'Focus', v: 'Full-stack' },
                  { k: 'Status', v: 'Open' },
                ].map((s) => (
                  <div
                    key={s.k}
                    className="panel-flat px-3 py-3"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <div className="text-[10px] uppercase tracking-widest2 text-ink-muted mb-1">
                      {s.k}
                    </div>
                    <div className="font-display text-lg font-bold text-ink">
                      {s.v}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right column – featured project card */}
            {featuredProject && (
              <motion.div
                className="lg:col-span-5"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.7 }}
              >
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="eyebrow">Featured project</span>
                  <button
                    onClick={() => scrollToSection('applications')}
                    className="text-[11px] uppercase tracking-widest2 text-ink-dim hover:text-accent transition-colors"
                  >
                    see all ↘
                  </button>
                </div>
                <ProjectCard project={featuredProject} accentBackground headingLevel={2} />
              </motion.div>
            )}
          </div>
        </div>

        {/* Bottom hairline + scroll cue */}
        <div
          className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 sm:px-8 py-3 text-[10px] uppercase tracking-widest2 text-ink-muted"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <span className="truncate max-w-[45%] sm:max-w-none">
            {metadata.author} · Baltimore, MD
          </span>
          <button
            onClick={() => scrollToSection('about')}
            className="flex items-center gap-2 hover:text-accent transition-colors"
          >
            scroll <ArrowDown className="w-3 h-3 animate-bounce" />
          </button>
          <span className="hidden sm:inline text-ink-muted/80">
            © {new Date().getFullYear()}
          </span>
        </div>
      </section>

      {/* ============================================================
          ABOUT
          ============================================================ */}
      <section
        id="about"
        className="py-20 sm:py-24"
        style={{ borderTop: '1px solid var(--color-border)' }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-3">
              <div className="eyebrow mb-3">About</div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tightish text-ink">
                Background
              </h2>
            </div>

            <AnimatedSection className="lg:col-span-6">
              <div className="space-y-5 text-ink-dim text-[15px] leading-relaxed">
                {personalInfo.about.paragraphs.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.15} className="lg:col-span-3">
              <Card padding="md">
                <div className="eyebrow mb-3">Highlights</div>
                <ul className="space-y-2.5">
                  {personalInfo.about.highlights.map((h, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-[13px] text-ink-dim leading-relaxed"
                    >
                      <span
                        aria-hidden
                        className="mt-1.5 inline-block w-1.5 h-1.5 flex-shrink-0"
                        style={{ background: 'var(--color-accent)' }}
                      />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ============================================================
          SKILLS
          ============================================================ */}
      <section
        id="skills"
        className="py-20 sm:py-24"
        style={{
          borderTop: '1px solid var(--color-border)',
          background: 'var(--color-bg-elevated)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-12">
            <div className="eyebrow mb-3">Stack</div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tightish text-ink mb-2">
              {skillsData.title}
            </h2>
            <p className="text-ink-dim text-[14px]">{skillsData.subtitle}</p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skillsData.categories.map((category, i) => (
              <AnimatedSection
                key={category.id}
                delay={i * 0.08}
                duration={0.5}
              >
                <Card>
                  <div className="flex items-center justify-between mb-4 pb-3 border-b hairline">
                    <h3 className="font-display text-lg font-bold tracking-tightish text-ink">
                      {category.title}
                    </h3>
                    <span className="text-[10px] uppercase tracking-widest2 text-ink-muted">
                      {String(category.skills.length).padStart(2, '0')} items
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {category.skills.map((skill) => (
                      <Badge
                        key={skill.name}
                        className="tracking-widest2"
                        style={{ letterSpacing: '0.2em' }}
                      >
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          EXPERIENCE / TIMELINE
          ============================================================ */}
      <section
        id="experience"
        className="py-20 sm:py-24"
        style={{ borderTop: '1px solid var(--color-border)' }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-12">
            <div className="eyebrow mb-3">Work</div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tightish text-ink mb-2">
              {experienceData.title}
            </h2>
            <p className="text-ink-dim text-[14px]">
              {experienceData.subtitle}
            </p>
          </AnimatedSection>

          <div className="relative">
            {experienceData.jobs.map((job, index) => (
              <TimelineItem key={job.id} job={job} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          ANALYSES
          ============================================================ */}
      <section
        id="analyses"
        className="py-20 sm:py-24"
        style={{
          borderTop: '1px solid var(--color-border)',
          background: 'var(--color-bg-elevated)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-12">
            <div className="eyebrow mb-3">Research</div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tightish text-ink mb-2">
              {analysesData.title}
            </h2>
            <p className="text-ink-dim text-[14px]">
              {analysesData.subtitle}
            </p>
          </AnimatedSection>

          {featuredAnalysis && (
            <AnimatedSection className="mb-6">
              <AnalysisCard analysis={featuredAnalysis} accentBackground />
            </AnimatedSection>
          )}

          {otherAnalyses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {otherAnalyses.map((analysis, i) => (
                <AnimatedSection key={analysis.id} delay={i * 0.08} duration={0.5}>
                  <AnalysisCard analysis={analysis} />
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============================================================
          APPLICATIONS (formerly Side Projects)
          ============================================================ */}
      <section
        id="applications"
        className="py-20 sm:py-24"
        style={{ borderTop: '1px solid var(--color-border)' }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-12">
            <div className="eyebrow mb-3">Projects</div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tightish text-ink mb-2">
              {sideProjectsData.title}
            </h2>
            <p className="text-ink-dim text-[14px]">
              {sideProjectsData.subtitle}
            </p>
          </AnimatedSection>

          {featuredProject && (
            <AnimatedSection className="mb-6">
              <ProjectCard project={featuredProject} accentBackground />
            </AnimatedSection>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherProjects.map((project, i) => (
              <AnimatedSection key={project.id} delay={i * 0.08} duration={0.5}>
                <ProjectCard project={project} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          CONTACT
          ============================================================ */}
      <section
        id="contact"
        className="py-20 sm:py-24"
        style={{ borderTop: '1px solid var(--color-border)' }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-10">
            <div className="eyebrow mb-3">Contact</div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tightish text-ink mb-3">
              Get in touch
            </h2>
            <p className="text-ink-dim text-[14px]">
              Email and LinkedIn are the fastest ways to reach me.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div id="contact-info">
              <Card padding="lg">
                <div className="grid sm:grid-cols-2 gap-4">
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="panel-flat px-4 py-4 flex items-center gap-3 hover:border-accent transition-colors group"
                >
                  <Mail className="w-4 h-4 text-accent" />
                  <div>
                    <div className="text-[10px] uppercase tracking-widest2 text-ink-muted mb-0.5">
                      Email
                    </div>
                    <div className="text-ink group-hover:text-accent transition-colors text-[13px] break-all">
                      {personalInfo.email}
                    </div>
                  </div>
                </a>

                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="panel-flat px-4 py-4 flex items-center gap-3 hover:border-accent transition-colors group"
                >
                  <Linkedin className="w-4 h-4 text-accent" />
                  <div>
                    <div className="text-[10px] uppercase tracking-widest2 text-ink-muted mb-0.5">
                      LinkedIn
                    </div>
                    <div className="text-ink group-hover:text-accent transition-colors text-[13px]">
                      linkedin.com/in/hannasage
                    </div>
                  </div>
                </a>

                <a
                  href="https://github.com/hannasage"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="panel-flat px-4 py-4 flex items-center gap-3 hover:border-accent transition-colors group"
                >
                  <Github className="w-4 h-4 text-accent" />
                  <div>
                    <div className="text-[10px] uppercase tracking-widest2 text-ink-muted mb-0.5">
                      GitHub
                    </div>
                    <div className="text-ink group-hover:text-accent transition-colors text-[13px]">
                      github.com/hannasage
                    </div>
                  </div>
                </a>

                  <div className="panel-flat px-4 py-4 flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-accent" />
                    <div>
                      <div className="text-[10px] uppercase tracking-widest2 text-ink-muted mb-0.5">
                        Location
                      </div>
                      <div className="text-ink text-[13px]">
                        {personalInfo.location}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </AnimatedSection>
        </div>
      </section>

      </main>

      {/* ============================================================
          FOOTER
          ============================================================ */}
      <footer
        className="py-8"
        style={{
          borderTop: '1px solid var(--color-border)',
          background: 'var(--color-bg)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] uppercase tracking-widest2 text-ink-muted">
            <div className="flex items-center gap-2">
              <span className="pip" aria-hidden />
              <span>© {metadata.footer.copyright}</span>
            </div>
            <div className="flex items-center gap-3">
              {SECTIONS.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => scrollToSection(s.id)}
                  className="hover:text-accent transition-colors"
                >
                  {String(i + 1).padStart(2, '0')} · {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
