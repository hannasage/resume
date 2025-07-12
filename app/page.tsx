'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Menu, X, ChevronDown, Mail, Linkedin, MapPin, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import NetworkVisualization from './components/NetworkVisualization';
import { Typewriter } from 'react-simple-typewriter';

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
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 w-full z-50 transition-all duration-300"
        style={{ opacity }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="text-2xl font-bold text-black"
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
                      ? 'text-black border-b-2 border-black' 
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  {section}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          className={`md:hidden bg-white border-t border-gray-200 ${
            isMenuOpen ? 'block' : 'hidden'
          }`}
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
                    ? 'text-black font-medium' 
                    : 'text-gray-600 hover:text-black'
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

        {/* Floating geometric shapes */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="floating-shape absolute top-20 left-10 w-8 h-8 border-2 border-gray-300 opacity-20"></div>
          <div className="floating-shape absolute top-40 right-20 w-6 h-6 border-2 border-gray-300 opacity-20"></div>
          <div className="floating-shape absolute bottom-40 left-20 w-10 h-10 border-2 border-gray-300 opacity-20"></div>
        </div>

        <div className="w-full flex flex-col items-center justify-center relative z-10 text-center max-w-[55vw] mx-auto">
          <motion.h1 
            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-black mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Hanna Sage,
            <br />
            <span className="ml-2 text-primary">
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
            className="text-2xl lg:text-3xl text-gray-600 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {/* Optionally keep a subtitle here or remove */}
          </motion.h2>
          <motion.div 
            className="text-lg text-gray-600 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <p className="mb-2">📍 Baltimore, Maryland</p>
            <p>5+ years building scalable systems and leading teams. Currently expanding AI/ML expertise.</p>
          </motion.div>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <button 
              onClick={() => scrollToSection('experience')}
              className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
            >
              View My Work
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="px-8 py-3 border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition-colors duration-200"
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
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-5 gap-12 items-center"
          >
            <div className="lg:col-span-3">
              <h2 className="text-4xl font-bold text-black mb-8">About Me</h2>
              <div className="space-y-6 text-lg text-gray-700">
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
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold text-black mb-6">Key Highlights</h3>
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
                      <div className="w-2 h-2 bg-black rounded-full"></div>
                      <span className="text-gray-700">{highlight}</span>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-black mb-4">Skills & Technologies</h2>
            <p className="text-xl text-gray-600">Comprehensive toolkit for modern software development</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Languages & Frameworks",
                skills: ["Python", "JavaScript/TypeScript", "Go", "Java", "Kotlin", "React", "Next.js", "Node.js", "Express.js", "SQL", "GraphQL"]
              },
              {
                title: "Backend & Infrastructure",
                skills: ["AWS (EC2, S3, Lambda, RDS, SageMaker)", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "GitHub Actions", "CI/CD", "PostgreSQL", "Supabase"]
              },
              {
                title: "AI & Data Tools",
                skills: ["LangChain", "LlamaIndex", "Hugging Face Transformers", "OpenAI API", "Model Context Protocol", "Pandas", "NumPy"]
              },
              {
                title: "Leadership & Soft Skills",
                skills: ["Team Leadership & Mentoring", "Cross-functional Communication", "Creative Problem Solving", "Agile Methodology"]
              }
            ].map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="text-xl font-bold text-black mb-4">{category.title}</h3>
                <div className="space-y-2">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: (categoryIndex * 0.1) + (skillIndex * 0.05), duration: 0.4 }}
                      viewport={{ once: true }}
                      className="text-gray-700 hover:text-black transition-colors duration-200 cursor-pointer"
                    >
                      {skill}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-black mb-4">Professional Experience</h2>
            <p className="text-xl text-gray-600">Building impactful solutions across diverse domains</p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gray-300"></div>
            
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
                <div className={`absolute top-6 w-4 h-4 bg-black rounded-full ${
                  index % 2 === 0 ? 'left-2 md:left-auto md:right-[-8px]' : 'left-2 md:left-[-8px]'
                }`}></div>
                
                <div className={`ml-12 md:ml-0 ${
                  index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'
                }`}>
                  <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-xl font-bold text-black">{job.title}</h3>
                    <p className="text-lg text-gray-600 font-medium">{job.company}</p>
                    <p className="text-gray-500 mb-4">{job.period} • {job.location}</p>
                    <ul className="space-y-2">
                      {job.achievements.map((achievement, achievementIndex) => (
                        <li key={achievementIndex} className="text-gray-700 flex items-start">
                          <span className="text-black mr-2">•</span>
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
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-black mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-600">Available for new opportunities and collaborations</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <motion.form
                onSubmit={handleSubmit(onSubmit)}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      {...register('name')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Your name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    {...register('subject')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="">Select a subject</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Job Opportunity">Job Opportunity</option>
                    <option value="Collaboration">Collaboration</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.subject && (
                    <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    {...register('message')}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Tell me about your project or opportunity..."
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </motion.form>
            </div>
            
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-black mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-600" />
                    <a 
                      href="mailto:sagemac.ext@gmail.com"
                      className="text-gray-700 hover:text-black transition-colors duration-200"
                    >
                      sagemac.ext@gmail.com
                    </a>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Linkedin className="h-5 w-5 text-gray-600" />
                    <a 
                      href="https://linkedin.com/in/hannasage"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:text-black transition-colors duration-200"
                    >
                      linkedin.com/in/hannasage
                    </a>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-700">Baltimore, Maryland</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h4 className="text-lg font-bold text-green-800 mb-2">Status</h4>
                <p className="text-green-700">Available for new opportunities</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Hanna Sage. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
