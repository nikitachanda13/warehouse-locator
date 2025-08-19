import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Cpu, Map, Layers, Wind, Database, Settings, Zap } from 'lucide-react';
import './AboutPage.css';

const AboutPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Cpu size={24} />,
      title: 'AI-Powered Optimization',
      description: 'Utilizes a sophisticated weighted centroid algorithm to calculate the optimal warehouse location based on store demand and user-defined criteria (cost, distance, capacity).',
    },
    {
      icon: <Map size={24} />,
      title: 'Interactive Map Interface',
      description: 'A dynamic and responsive map powered by Leaflet, allowing for easy visualization of stores, the calculated warehouse, and potential service areas.',
    },
    {
      icon: <Layers size={24} />,
      title: 'Multiple Map Views',
      description: 'Seamlessly switch between Street, Satellite, and Terrain map tiles to gain better geographical context for your logistical planning.',
    },
    {
      icon: <Settings size={24} />,
      title: 'Dynamic Scenario Planning',
      description: 'Users can add, remove, and modify store locations and their demands on-the-fly to run various "what-if" scenarios and see immediate results.',
    },
    {
      icon: <Wind size={24} />,
      title: 'Environmental Data Simulation',
      description: 'Integrates simulated real-world variables like weather and traffic data to provide a more holistic and realistic optimization analysis.',
    },
    {
      icon: <Zap size={24} />,
      title: 'Modern, Responsive UI',
      description: 'Built with React and styled with a sleek, dark-themed interface. Fully responsive and enhanced with smooth animations from Framer Motion.',
    },
  ];

  const techStack = [
    { name: 'React', description: 'For building the user interface' },
    { name: 'React Router', description: 'For client-side routing' },
    { name: 'Leaflet & React-Leaflet', description: 'For interactive maps' },
    { name: 'Framer Motion', description: 'For fluid animations' },
    { name: 'Lucide React', description: 'For crisp, modern icons' },
    { name: 'CSS', description: 'For custom styling and layout' },
  ];

  return (
    <motion.div
      className="about-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="about-container">
        <header className="about-header">
          <motion.button
            className="back-btn"
            onClick={() => navigate(-1)} // Go back to the previous page
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={20} />
            <span>Back to Locator</span>
          </motion.button>
          <h1>About WareFlow Locator</h1>
          <p className="about-subtitle">
            An advanced, AI-powered web application designed to solve complex logistical challenges by identifying the optimal location for a new warehouse.
          </p>
        </header>

        <section className="about-section">
          <h2>Key Features</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="about-section">
          <h2>How It Works</h2>
          <ol className="how-it-works-list">
            <li><strong>Input Data:</strong> Start by adding your store locations to the map, either manually or by loading sample data.</li>
            <li><strong>Set Criteria:</strong> Choose your optimization priority—whether to minimize costs, reduce travel distance, or balance warehouse capacity.</li>
            <li><strong>Calculate:</strong> Our AI engine processes the data, considering all variables, and pinpoints the most strategic location for your new warehouse.</li>
            <li><strong>Visualize Results:</strong> The optimal location is displayed on the map, along with key metrics like estimated cost, average distance, and overall efficiency.</li>
          </ol>
        </section>

        <section className="about-section">
          <h2>Technology Stack</h2>
          <div className="tech-stack-grid">
            {techStack.map((tech, index) => (
              <motion.div
                key={index}
                className="tech-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <h4>{tech.name}</h4>
                <p>{tech.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <footer className="about-footer">
          <p>WareFlow Locator &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </motion.div>
  );
};

export default AboutPage;

