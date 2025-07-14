'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Mail, Linkedin, MapPin } from 'lucide-react';
import NetworkVisualization from './components/NetworkVisualization';
import Navigation from './components/Navigation';
import { Typewriter } from 'react-simple-typewriter';
import { Card, Button, AnimatedSection, SkillTag, TimelineItem, ProjectCard } from './components/ui';
import { getPersonalInfo, getSkillsData, getExperienceData, getMetadataInfo, getSideProjectsData } from './lib/content-loader';

// Form validation schema
// const contactSchema = z.object({
//   name: z.string().min(2, 'Name must be at least 2 characters'),
//   email: z.string().email('Please enter a valid email'),
//   subject: z.string().min(1, 'Please select a subject'),
//   message: z.string().min(10, 'Message must be at least 10 characters'),
// });

// type ContactForm = z.infer<typeof contactSchema>;

export default function Home() {
  const [activeSection, setActiveSection] = useState('home');
  
  // Load content data
  const personalInfo = getPersonalInfo();
  const skillsData = getSkillsData();
  const experienceData = getExperienceData();
  const sideProjectsData = getSideProjectsData();

  // Form functionality temporarily disabled
  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors, isSubmitting },
  //   reset,
  // } = useForm<ContactForm>({
  //   resolver: zodResolver(contactSchema),
  // });

  // Navigation scroll handling
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'skills', 'experience', 'projects', 'contact'];
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

  // const onSubmit = async (data: ContactForm) => {
  //   // Simulate form submission
  //   await new Promise(resolve => setTimeout(resolve, 1000));
  //   console.log('Form submitted:', data);
  //   reset();
  // };

  const scrollToSection = (sectionId: string) => {
    let targetId = sectionId;
    if (sectionId === 'contact') {
      targetId = 'contact-info';
    }
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Navigation */}
      <Navigation activeSection={activeSection} scrollToSection={scrollToSection} />

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Network Visualization Background */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <NetworkVisualization className="w-full h-full" />
        </div>


        <div className="w-full flex flex-col items-center justify-center relative z-10 text-center max-w-[80vw] md:max-w-[60vw] lg:max-w-[50vw] xl:max-w-[55vw] mx-auto">
          <motion.h1 
            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-black dark:text-white mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {personalInfo.name},
            <br />
            <span className="ml-2 text-black dark:text-white">
              <Typewriter
                words={personalInfo.typewriterWords}
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
            <p className="mb-2">📍 {personalInfo.location}</p>
            <p><b>{personalInfo.heroDescription}</b></p>
          </motion.div>
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Button onClick={() => scrollToSection('experience')}>
              View My Work
            </Button>
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
          <AnimatedSection className="grid lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-3">
              <h2 className="text-4xl font-bold mb-8 text-accent-gradient">About Me</h2>
              <div className="space-y-6 text-lg text-gray-700 dark:text-gray-300">
                {personalInfo.about.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <Card className="p-8">
                <h3 className="text-2xl font-bold text-black dark:text-white mb-6">Key Highlights</h3>
                <div className="space-y-4">
                  {personalInfo.about.highlights.map((highlight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      viewport={{ once: true }}
                      className="text-gray-700 dark:text-gray-300"
                    >
                      {highlight}
                    </motion.div>
                  ))}
                </div>
              </Card>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20">
        <div className="w-full max-w-full sm:max-w-[80vw] md:max-w-[60vw] lg:max-w-[50vw] xl:max-w-[55vw] mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-accent-gradient">{skillsData.title}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">{skillsData.subtitle}</p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {skillsData.categories.map((category, categoryIndex) => (
              <AnimatedSection
                key={category.id}
                delay={categoryIndex * 0.1}
                duration={0.6}
              >
                <Card>
                  <h3 className="text-xl font-bold text-black dark:text-white mb-4">{category.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => {
                      const colorConfig = skillsData.colorMap[skill.color];
                      return (
                        <SkillTag
                          key={skill.name}
                          skill={skill}
                          colorConfig={colorConfig}
                        />
                      );
                    })}
                  </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20" style={{ backgroundColor: 'var(--color-accent)' }}>
        <div className="w-full max-w-full sm:max-w-[80vw] md:max-w-[60vw] lg:max-w-[50vw] xl:max-w-[55vw] mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-accent-gradient">{experienceData.title}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">{experienceData.subtitle}</p>
          </AnimatedSection>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600"></div>
            
            {experienceData.jobs.map((job, index) => (
              <TimelineItem key={job.id} job={job} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Side Projects Section */}
      <section id="projects" className="py-20">
        <div className="w-full max-w-full sm:max-w-[80vw] md:max-w-[70vw] lg:max-w-[80vw] xl:max-w-[90vw] mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-accent-gradient">{sideProjectsData.title}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">{sideProjectsData.subtitle}</p>
          </AnimatedSection>

          <div className="flex flex-wrap justify-center gap-6">
            {sideProjectsData.projects.map((project, index) => (
              <AnimatedSection
                key={project.id}
                delay={index * 0.1}
                duration={0.6}
                className="w-full max-w-sm md:w-80 lg:w-96 flex-shrink-0"
              >
                <ProjectCard project={project} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <AnimatedSection className="space-y-8 w-full max-w-md">
              <div className="p-6 rounded-lg" id="contact-info" style={{ backgroundColor: 'var(--color-accent)' }}>
                <h3 className="text-xl font-bold mb-6 text-accent-gradient">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <a 
                      href={`mailto:${personalInfo.email}`}
                      className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200"
                    >
                      {personalInfo.email}
                    </a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Linkedin className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <a 
                      href={personalInfo.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200"
                    >
                      linkedin.com/in/hannasage
                    </a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{personalInfo.location}</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black dark:bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; {getMetadataInfo().footer.copyright}</p>
        </div>
      </footer>
    </div>
  );
}
