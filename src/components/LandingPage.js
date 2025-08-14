import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Environment, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Truck, 
  BarChart3, 
  Zap, 
  Globe, 
  Shield,
  Users,
  TrendingUp,
  Clock,
  Award
} from 'lucide-react';
import ThreeDLaptop from './ThreeDLaptop';
import Login from './Login';
import Signup from './Signup';
import './LandingPage.css';

// Animated background spheres
function BackgroundSpheres() {
  const spheres = useRef();
  
  useFrame((state) => {
    if (spheres.current) {
      spheres.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      spheres.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.3;
    }
  });

  return (
    <group ref={spheres}>
      {[...Array(5)].map((_, i) => (
        <Float key={i} speed={2 + i} rotationIntensity={0.5} floatIntensity={0.5}>
          <Sphere
            position={[
              (Math.random() - 0.5) * 20,
              (Math.random() - 0.5) * 20,
              (Math.random() - 0.5) * 20
            ]}
            scale={0.5 + Math.random() * 0.5}
          >
            <MeshDistortMaterial
              color={i % 2 === 0 ? "#6366f1" : "#8b5cf6"}
              transparent
              opacity={0.1}
              distort={0.2}
              speed={2}
            />
          </Sphere>
        </Float>
      ))}
    </group>
  );
}

const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const handleGetStarted = () => {
    // Check if user is already authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated) {
      // If already authenticated, go directly to loading page
      navigate('/loading');
    } else {
      // If not authenticated, require signup before accessing warehouse locator
      setIsSignupOpen(true);
      setIsLoginOpen(false);
    }
  };

  const openLogin = () => {
    setIsLoginOpen(true);
    setIsSignupOpen(false);
  };

  const openSignup = () => {
    setIsSignupOpen(true);
    setIsLoginOpen(false);
  };

  const closeModals = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(false);
  };

  const features = [
    {
      icon: MapPin,
      title: "Smart Location Analysis",
      description: "AI-powered algorithms analyze multiple factors to find optimal warehouse locations"
    },
    {
      icon: BarChart3,
      title: "Cost Optimization",
      description: "Minimize operational costs while maximizing efficiency and delivery speed"
    },
    {
      icon: Truck,
      title: "Logistics Integration",
      description: "Seamlessly integrate with existing supply chain and transportation networks"
    },
    {
      icon: Globe,
      title: "Global Coverage",
      description: "Support for worldwide warehouse planning with local market insights"
    },
    {
      icon: Zap,
      title: "Real-time Analysis",
      description: "Live traffic and weather data integration for accurate planning"
    },
    {
      icon: Shield,
      title: "Risk Assessment",
      description: "Evaluate potential risks and provide mitigation strategies"
    }
  ];

  const additionalFeatures = [
    {
      icon: Users,
      title: "Multi-store Management",
      description: "Handle multiple retail locations and distribution centers simultaneously"
    },
    {
      icon: TrendingUp,
      title: "Demand Forecasting",
      description: "Predict future demand patterns to optimize warehouse capacity"
    },
    {
      icon: Clock,
      title: "Delivery Time Optimization",
      description: "Calculate optimal locations for fastest delivery times to customers"
    },
    {
      icon: Award,
      title: "Compliance Tracking",
      description: "Ensure all locations meet regulatory and zoning requirements"
    }
  ];

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <motion.div 
            className="logo"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Truck className="logo-icon" />
            <span>LocateIQ</span>
          </motion.div>
          
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <motion.button 
              className="login-btn"
              onClick={openLogin}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </motion.button>
            <motion.button 
              className="signup-btn"
              onClick={openSignup}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign Up
            </motion.button>
            <motion.button 
              className="get-started-btn"
              onClick={handleGetStarted}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
            <Suspense fallback={null}>
              <Environment preset="night" />
              <BackgroundSpheres />
              <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Suspense>
          </Canvas>
        </div>
        
        <div className="hero-content">
          <div className="hero-text">
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              OPTIMIZE YOUR
              <span className="gradient-text"> WAREHOUSE</span>
              <br />
              MAXIMIZE YOUR
              <span className="gradient-text"> EFFICIENCY</span>
            </motion.h1>
            
            <motion.p
              className="hero-subtitle"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Discover the perfect warehouse location using AI-powered analytics, 
              real-time traffic data, and weather insights to optimize your supply chain.
            </motion.p>

            <motion.div
              className="hero-cta"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.button 
                className="primary-btn"
                onClick={handleGetStarted}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(99, 102, 241, 0.4)" }}
                whileTap={{ scale: 0.95 }}
              >
                Start Optimizing
                <Zap className="btn-icon" />
              </motion.button>
            </motion.div>
          </div>

          <motion.div 
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <div className="laptop-container">
              <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <Suspense fallback={null}>
                  <Environment preset="studio" />
                  <ThreeDLaptop />
                  <OrbitControls 
                    enablePan={false} 
                    enableZoom={false} 
                    autoRotate 
                    autoRotateSpeed={2}
                    maxPolarAngle={Math.PI / 2}
                    minPolarAngle={Math.PI / 3}
                  />
                </Suspense>
              </Canvas>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2>Powerful Features for Smart Warehouse Planning</h2>
            <p>Everything you need to optimize your warehouse network and supply chain</p>
          </motion.div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 20px 40px rgba(99, 102, 241, 0.2)"
                }}
              >
                <div className="feature-icon">
                  <feature.icon />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Section */}
      <section className="additional-features">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2>Advanced Capabilities</h2>
            <p>Take your warehouse optimization to the next level</p>
          </motion.div>

          <div className="features-grid">
            {additionalFeatures.map((feature, index) => (
              <motion.div 
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 20px 40px rgba(139, 92, 246, 0.2)"
                }}
              >
                <div className="feature-icon secondary">
                  <feature.icon />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <motion.div 
            className="cta-content"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2>Ready to Optimize Your Warehouse Network?</h2>
            <p>Start your journey to smarter warehouse planning today</p>
            <motion.button 
              className="primary-btn large"
              onClick={handleGetStarted}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Launch Warehouse Locator
              <MapPin className="btn-icon" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <Truck className="logo-icon" />
              <span>WareFlow</span>
            </div>
            <p>&copy; 2024 WareFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Login and Signup Modals */}
      {isLoginOpen && (
        <Login 
          isOpen={isLoginOpen}
          onClose={closeModals}
          onSwitchToSignup={openSignup}
        />
      )}
      {isSignupOpen && (
        <Signup 
          isOpen={isSignupOpen}
          onClose={closeModals}
          onSwitchToLogin={openLogin}
        />
      )}
    </div>
  );
};

export default LandingPage;
