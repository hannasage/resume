'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Menu, X, ChevronDown, Mail, Linkedin, MapPin, Send } from 'lucide-react';
import { Github } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import NetworkVisualization from './components/NetworkVisualization';
import { Typewriter } from 'react-simple-typewriter';
import ThemeToggle from './components/ThemeToggle';

// Form validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  subject: z.string().min(1, 'Please select a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.8]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  // Navigation scroll handling
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'experience', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const onSubmit = async (data: ContactForm) => {
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Form submitted:', data);
    reset();
  };

  const scrollToSection = (sectionId: string) => {
    let targetId = sectionId;
    if (sectionId === 'contact') {
      targetId = 'contact-info';
    }
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 w-full z-50 transition-all duration-300"
        style={{ opacity }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="text-2xl font-bold text-black dark:text-white"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              Hanna Sage
            </motion.div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {['home', 'about', 'skills', 'experience', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`capitalize transition-colors duration-200 ${
                    activeSection === section 
                      ? 'text-black dark:text-white border-b-2 border-black dark:border-white' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {section}
                </button>
              ))}
            </div>

            {/* Social Icons & Theme Toggle */}
            <div className="flex items-center space-x-2 ml-4">
              <ThemeToggle />
              <a
                href="https://github.com/hannasage"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </a>
              <a
                href="https://linkedin.com/in/hannasage"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-black dark:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          className={`md:hidden border-t ${
            isMenuOpen ? 'block' : 'hidden'
          }`}
          style={{ 
            backgroundColor: 'var(--color-background)', 
            borderColor: 'var(--color-border)' 
          }}
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: isMenuOpen ? 1 : 0, 
            height: isMenuOpen ? 'auto' : 0 
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-4 py-2 space-y-2">
            {['home', 'about', 'skills', 'experience', 'contact'].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={`block w-full text-left py-2 capitalize transition-colors duration-200 ${
                  activeSection === section 
                    ? 'text-black dark:text-white font-medium' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                }`}
              >
                {section}
              </button>
            ))}
          </div>
        </motion.div>
      </motion.nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Network Visualization Background */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <NetworkVisualization className="w-full h-full" />
        </div>


        <div className="w-full flex flex-col items-center justify-center relative z-10 text-center max-w-full sm:max-w-[80vw] md:max-w-[60vw] lg:max-w-[50vw] xl:max-w-[55vw] mx-auto">
          <motion.h1 
            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-black dark:text-white mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Hanna Sage,
            <br />
            <span className="ml-2 text-black dark:text-white">
              <Typewriter
                words={["Software Engineer", "AI Enthusiast", "Creative Technologist", "Full-Stack Developer", "Cloud Architect"]}
                loop={0}
                cursor
                cursorStyle="|"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1500}
              />
            </span>
          </motion.h1>
          <motion.h2 
            className="text-2xl lg:text-3xl text-gray-600 dark:text-gray-400 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {/* Optionally keep a subtitle here or remove */}
          </motion.h2>
          <motion.div 
            className="text-lg text-gray-600 dark:text-gray-400 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <p className="mb-2">📍 Baltimore, Maryland</p>
            <p><b>5+ years</b> building scalable systems and leading teams. Currently expanding <b>AI/ML expertise.</b></p>
          </motion.div>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <button 
              onClick={() => scrollToSection('experience')}
              className="px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
              style={{ 
                backgroundColor: 'var(--color-accent-vibrant)', 
                color: 'white'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              View My Work
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="px-8 py-3 border-2 rounded-lg font-semibold transition-colors duration-200"
              style={{ 
                borderColor: 'var(--color-accent-vibrant)', 
                color: 'var(--color-accent-vibrant)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-accent-vibrant)';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--color-accent-vibrant)';
              }}
            >
              Get In Touch
            </button>
          </motion.div>
        </div>
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <ChevronDown className="h-8 w-8 text-gray-400 animate-bounce" />
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20" style={{ backgroundColor: 'var(--color-accent)' }}>
        <div className="w-full max-w-full sm:max-w-[80vw] md:max-w-[60vw] lg:max-w-[50vw] xl:max-w-[55vw] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-5 gap-12 items-center"
          >
            <div className="lg:col-span-3">
              <h2 className="text-4xl font-bold mb-8" style={{ color: 'var(--color-accent-vibrant)' }}>About Me</h2>
              <div className="space-y-6 text-lg text-gray-700 dark:text-gray-300">
                <p>
                  Creative and technically adept Software Engineer with a passion for building 
                  innovative solutions that bridge the gap between complex technical challenges 
                  and user-friendly experiences.
                </p>
                <p>
                  With over 5 years of full-stack development experience, I specialize in 
                  cloud-based application modernization and AI-integrated systems. My background 
                  uniquely combines engineering expertise with business analysis and media production, 
                  enabling me to approach problems from multiple perspectives.
                </p>
                <p>
                  Currently focused on expanding my machine learning certifications and deepening 
                  my expertise in AI integration, I'm passionate about leveraging technology to 
                  create meaningful impact.
                </p>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <div className="p-8 rounded-lg shadow-lg" style={{ backgroundColor: 'var(--color-background)' }}>
                <h3 className="text-2xl font-bold text-black dark:text-white mb-6">Key Highlights</h3>
                <div className="space-y-4">
                  {[
                    '5+ years full-stack development',
                    'Cloud-based application modernization',
                    'AI-integrated systems expertise',
                    'Team leadership and mentoring',
                    'Engineering + Business + Media background'
                  ].map((highlight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      viewport={{ once: true }}
                      className="flex items-center space-x-3"
                    >
                      <div className="w-2 h-2 bg-black dark:bg-white rounded-full"></div>
                      <span className="text-gray-700 dark:text-gray-300">{highlight}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20">
        <div className="w-full max-w-full sm:max-w-[80vw] md:max-w-[60vw] lg:max-w-[50vw] xl:max-w-[55vw] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-accent-vibrant)' }}>Skills & Technologies</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Comprehensive toolkit for modern software development</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Languages & Frameworks",
                skills: ["Python", "JavaScript/TypeScript", "Go", "Java", "Kotlin", "React", "Next.js", "Node.js", "Express.js", "SQL", "GraphQL"],
                colors: [
                  "bg-blue-200 text-blue-900 dark:bg-blue-800 dark:text-blue-100 border border-blue-300 dark:border-blue-600",
                  "bg-amber-200 text-amber-900 dark:bg-amber-800 dark:text-amber-100 border border-amber-300 dark:border-amber-600",
                  "bg-emerald-200 text-emerald-900 dark:bg-emerald-800 dark:text-emerald-100 border border-emerald-300 dark:border-emerald-600",
                  "bg-purple-200 text-purple-900 dark:bg-purple-800 dark:text-purple-100 border border-purple-300 dark:border-purple-600",
                  "bg-pink-200 text-pink-900 dark:bg-pink-800 dark:text-pink-100 border border-pink-300 dark:border-pink-600",
                  "bg-cyan-200 text-cyan-900 dark:bg-cyan-800 dark:text-cyan-100 border border-cyan-300 dark:border-cyan-600",
                  "bg-indigo-200 text-indigo-900 dark:bg-indigo-800 dark:text-indigo-100 border border-indigo-300 dark:border-indigo-600",
                  "bg-lime-200 text-lime-900 dark:bg-lime-800 dark:text-lime-100 border border-lime-300 dark:border-lime-600",
                  "bg-orange-200 text-orange-900 dark:bg-orange-800 dark:text-orange-100 border border-orange-300 dark:border-orange-600",
                  "bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-slate-100 border border-slate-300 dark:border-slate-600",
                  "bg-teal-200 text-teal-900 dark:bg-teal-800 dark:text-teal-100 border border-teal-300 dark:border-teal-600"
                ]
              },
              {
                title: "Backend & Infrastructure",
                skills: ["AWS (EC2, S3, Lambda, RDS, SageMaker)", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "GitHub Actions", "CI/CD", "PostgreSQL", "Supabase"],
                colors: [
                  "bg-amber-200 text-amber-900 dark:bg-amber-800 dark:text-amber-100 border border-amber-300 dark:border-amber-600",
                  "bg-blue-200 text-blue-900 dark:bg-blue-800 dark:text-blue-100 border border-blue-300 dark:border-blue-600",
                  "bg-red-200 text-red-900 dark:bg-red-800 dark:text-red-100 border border-red-300 dark:border-red-600",
                  "bg-cyan-200 text-cyan-900 dark:bg-cyan-800 dark:text-cyan-100 border border-cyan-300 dark:border-cyan-600",
                  "bg-emerald-200 text-emerald-900 dark:bg-emerald-800 dark:text-emerald-100 border border-emerald-300 dark:border-emerald-600",
                  "bg-purple-200 text-purple-900 dark:bg-purple-800 dark:text-purple-100 border border-purple-300 dark:border-purple-600",
                  "bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-slate-100 border border-slate-300 dark:border-slate-600",
                  "bg-pink-200 text-pink-900 dark:bg-pink-800 dark:text-pink-100 border border-pink-300 dark:border-pink-600",
                  "bg-indigo-200 text-indigo-900 dark:bg-indigo-800 dark:text-indigo-100 border border-indigo-300 dark:border-indigo-600",
                  "bg-lime-200 text-lime-900 dark:bg-lime-800 dark:text-lime-100 border border-lime-300 dark:border-lime-600"
                ]
              },
              {
                title: "AI & Data Tools",
                skills: ["LangChain", "LlamaIndex", "Hugging Face Transformers", "OpenAI API", "Model Context Protocol", "Pandas", "NumPy"],
                colors: [
                  "bg-purple-200 text-purple-900 dark:bg-purple-800 dark:text-purple-100 border border-purple-300 dark:border-purple-600",
                  "bg-pink-200 text-pink-900 dark:bg-pink-800 dark:text-pink-100 border border-pink-300 dark:border-pink-600",
                  "bg-amber-200 text-amber-900 dark:bg-amber-800 dark:text-amber-100 border border-amber-300 dark:border-amber-600",
                  "bg-blue-200 text-blue-900 dark:bg-blue-800 dark:text-blue-100 border border-blue-300 dark:border-blue-600",
                  "bg-emerald-200 text-emerald-900 dark:bg-emerald-800 dark:text-emerald-100 border border-emerald-300 dark:border-emerald-600",
                  "bg-orange-200 text-orange-900 dark:bg-orange-800 dark:text-orange-100 border border-orange-300 dark:border-orange-600",
                  "bg-cyan-200 text-cyan-900 dark:bg-cyan-800 dark:text-cyan-100 border border-cyan-300 dark:border-cyan-600"
                ]
              },
              {
                title: "Leadership & Soft Skills",
                skills: ["Team Leadership & Mentoring", "Cross-functional Communication", "Creative Problem Solving", "Agile Methodology"],
                colors: [
                  "bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-slate-100 border border-slate-300 dark:border-slate-600",
                  "bg-blue-200 text-blue-900 dark:bg-blue-800 dark:text-blue-100 border border-blue-300 dark:border-blue-600",
                  "bg-emerald-200 text-emerald-900 dark:bg-emerald-800 dark:text-emerald-100 border border-emerald-300 dark:border-emerald-600",
                  "bg-amber-200 text-amber-900 dark:bg-amber-800 dark:text-amber-100 border border-amber-300 dark:border-amber-600"
                ]
              }
            ].map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                style={{ backgroundColor: 'var(--color-background)' }}
              >
                <h3 className="text-xl font-bold text-black dark:text-white mb-4">{category.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, skillIndex) => {
                    const colorClasses = category.colors[skillIndex % category.colors.length];
                    return (
                      <span
                        key={skill}
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium shadow-sm ${colorClasses} max-w-[14rem] truncate overflow-hidden whitespace-nowrap`}
                      >
                        {skill}
                      </span>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20" style={{ backgroundColor: 'var(--color-accent)' }}>
        <div className="w-full max-w-full sm:max-w-[80vw] md:max-w-[60vw] lg:max-w-[50vw] xl:max-w-[55vw] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-accent-vibrant)' }}>Professional Experience</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Building impactful solutions across diverse domains</p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600"></div>
            
            {[
              {
                title: "Software Engineer II",
                company: "Fearless",
                period: "Dec 2022 - Present",
                location: "Baltimore, MD",
                achievements: [
                  "Led React component design for OneMAC (Medicaid/Medicare systems)",
                  "Contributed to Smithsonian's Searchable Museum platform",
                  "Federal policy translation to compliant UI workflows",
                  "CI/CD optimization and team mentoring"
                ]
              },
              {
                title: "Software Engineer I",
                company: "Fearless",
                period: "Aug 2021 - Dec 2022",
                location: "Baltimore, MD",
                achievements: [
                  "ReportStream frontend re-architecture (React + TypeScript)",
                  "API integrations with Kotlin and Azure Functions",
                  "Test-driven development implementation",
                  "New engineer onboarding leadership"
                ]
              },
              {
                title: "Technical Business Analyst",
                company: "Advanced Metrics",
                period: "Sep 2020 - Jul 2021",
                location: "Remote",
                achievements: [
                  "Healthy Pathways platform liaison",
                  "Clinical requirements to software translation",
                  "UAT cycles and training program development"
                ]
              },
              {
                title: "Independent/Open Source",
                company: "Various Projects",
                period: "Nov 2019 - Aug 2020",
                location: "Remote",
                achievements: [
                  "Startup and nonprofit application development",
                  "HospitalRun EHR platform contributions",
                  "Global healthcare access community collaboration"
                ]
              }
            ].map((job, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
                className={`relative mb-12 ${
                  index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'
                }`}
              >
                {/* Timeline dot */}
                <div className={`absolute top-6 w-4 h-4 bg-black dark:bg-white rounded-full ${
                  index % 2 === 0 ? 'left-2 md:left-auto md:right-[-8px]' : 'left-2 md:left-[-8px]'
                }`}></div>
                
                <div className={`ml-12 md:ml-0 ${
                  index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'
                }`}>
                  <div className="p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300" style={{ backgroundColor: 'var(--color-background)' }}>
                    <h3 className="text-xl font-bold text-black dark:text-white">{job.title}</h3>
                    <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">{job.company}</p>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">{job.period} • {job.location}</p>
                    <ul className="space-y-2">
                      {job.achievements.map((achievement, achievementIndex) => (
                        <li key={achievementIndex} className="text-gray-700 dark:text-gray-300 flex items-start">
                          <span className="text-black dark:text-white mr-2">•</span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <motion.div
              initial={{ opacity: 0, x: 0 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8 w-full max-w-md"
            >
              <div className="p-6 rounded-lg" id="contact-info" style={{ backgroundColor: 'var(--color-accent)' }}>
                <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--color-accent-vibrant)' }}>Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <a 
                      href="mailto:sagemac.ext@gmail.com"
                      className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200"
                    >
                      sagemac.ext@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Linkedin className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <a 
                      href="https://linkedin.com/in/hannasage"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200"
                    >
                      linkedin.com/in/hannasage
                    </a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">Baltimore, Maryland</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black dark:bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 Hanna Sage. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
