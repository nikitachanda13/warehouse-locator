import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Warehouse, 
  MapPin, 
  Zap, 
  BarChart3, 
  Globe,
  Truck,
  Target,
  Calculator,
  TrendingUp,
  Database
} from 'lucide-react';
import './LoadingPage.css';

const LoadingPage = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);

  const loadingSteps = useMemo(() => [
    {
      id: 1,
      icon: Database,
      title: "Initializing System",
      description: "Loading core warehouse optimization algorithms...",
      duration: 800
    },
    {
      id: 2,
      icon: MapPin,
      title: "Loading Map Services",
      description: "Connecting to interactive mapping services...",
      duration: 1000
    },
    {
      id: 3,
      icon: Globe,
      title: "Fetching Location Data",
      description: "Retrieving geographic and demographic data...",
      duration: 900
    },
    {
      id: 4,
      icon: BarChart3,
      title: "Preparing Analytics",
      description: "Setting up real-time analytics dashboard...",
      duration: 700
    },
    {
      id: 5,
      icon: Calculator,
      title: "Calibrating AI Models",
      description: "Optimizing machine learning algorithms...",
      duration: 800
    },
    {
      id: 6,
      icon: Zap,
      title: "Finalizing Setup",
      description: "Preparing your workspace...",
      duration: 600
    }
  ], []);

  useEffect(() => {
    const totalTime = loadingSteps.reduce((sum, step) => sum + step.duration, 0);
    const startTime = Date.now();
    let progressInterval;
    let stepTimeouts = [];
    
    // Progress bar animation
    progressInterval = setInterval(() => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;
      const progressPercent = Math.min((elapsedTime / totalTime) * 100, 100);
      setProgress(progressPercent);
    }, 50);

    // Step progression with cumulative timing
    let cumulativeTime = 0;
    loadingSteps.forEach((step, index) => {
      if (index < loadingSteps.length - 1) {
        cumulativeTime += step.duration;
        const stepTimeout = setTimeout(() => {
          setCurrentStep(index + 1);
        }, cumulativeTime);
        stepTimeouts.push(stepTimeout);
      }
    });

    // Complete loading and navigate
    const completeTimer = setTimeout(() => {
      setProgress(100);
      setLoadingComplete(true);
      clearInterval(progressInterval);
      
      // Navigate to warehouse locator after a brief pause
      setTimeout(() => {
        navigate('/enhanced-warehouse-locator');
      }, 1000);
    }, totalTime + 500);

    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      stepTimeouts.forEach(timeout => clearTimeout(timeout));
      clearTimeout(completeTimer);
    };
  }, [navigate, loadingSteps]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.5 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const iconVariants = {
    animate: {
      scale: [1, 1.2, 1],
      rotate: [0, 180, 360],
      transition: {
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 0.5
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 1.5,
        ease: "easeInOut",
        repeat: Infinity
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className="loading-page"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Background Animation */}
        <div className="loading-background">
          <div className="animated-shapes">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className={`shape shape-${i + 1}`}
                animate={{
                  x: [0, 100, -50, 0],
                  y: [0, -100, 50, 0],
                  rotate: [0, 180, 360],
                  scale: [1, 1.2, 0.8, 1],
                }}
                transition={{
                  duration: 10 + i * 2,
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: i * 0.5
                }}
              />
            ))}
          </div>
        </div>

        <div className="loading-content">
          {/* Header */}
          <motion.div 
            className="loading-header"
            variants={itemVariants}
          >
            <motion.div 
              className="loading-logo"
              variants={pulseVariants}
              animate="animate"
            >
              <Warehouse className="logo-icon" />
            </motion.div>
            <h1>LocateIQ</h1>
            <p>Preparing your advanced warehouse optimization platform</p>
          </motion.div>

          {/* Main Loading Animation */}
          <motion.div 
            className="loading-main"
            variants={itemVariants}
          >
            {/* Central Loading Circle */}
            <div className="loading-circle-container">
              <svg className="progress-ring" width="200" height="200">
                <circle
                  className="progress-ring-background"
                  cx="100"
                  cy="100"
                  r="90"
                />
                <motion.circle
                  className="progress-ring-progress"
                  cx="100"
                  cy="100"
                  r="90"
                  strokeDasharray={`${2 * Math.PI * 90}`}
                  strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 90 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 90 * (1 - progress / 100) }}
                  transition={{ duration: 0.1, ease: "easeOut" }}
                />
              </svg>

              {/* Central Icon */}
              <motion.div 
                className="central-icon"
                variants={iconVariants}
                animate="animate"
              >
                {React.createElement(loadingSteps[currentStep]?.icon || Warehouse, {
                  size: 40
                })}
              </motion.div>

              {/* Progress Percentage */}
              <div className="progress-percentage">
                {Math.round(progress)}%
              </div>
            </div>

            {/* Floating Icons */}
            <div className="floating-icons">
              {[MapPin, Truck, Target, TrendingUp, Globe, BarChart3].map((Icon, index) => (
                <motion.div
                  key={index}
                  className={`floating-icon icon-${index + 1}`}
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 360],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3 + index * 0.5,
                    ease: "easeInOut",
                    repeat: Infinity,
                    delay: index * 0.2
                  }}
                >
                  <Icon size={24} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Loading Steps */}
          <motion.div 
            className="loading-steps"
            variants={itemVariants}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                className="current-step"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="step-icon">
                  {React.createElement(loadingSteps[currentStep]?.icon || Warehouse, {
                    size: 24
                  })}
                </div>
                <div className="step-content">
                  <h3>{loadingSteps[currentStep]?.title}</h3>
                  <p>{loadingSteps[currentStep]?.description}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Progress Dots */}
            <div className="progress-dots">
              {loadingSteps.map((_, index) => (
                <motion.div
                  key={index}
                  className={`progress-dot ${index <= currentStep ? 'active' : ''}`}
                  animate={{
                    scale: index === currentStep ? [1, 1.2, 1] : 1,
                    backgroundColor: index <= currentStep ? '#4facfe' : 'rgba(255, 255, 255, 0.3)'
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: index === currentStep ? Infinity : 0
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Loading Complete Message */}
          <AnimatePresence>
            {loadingComplete && (
              <motion.div
                className="loading-complete"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, type: "spring" }}
              >
                <motion.div
                  className="success-icon"
                  animate={{ scale: [0, 1.2, 1], rotate: [0, 360] }}
                  transition={{ duration: 0.8, type: "spring" }}
                >
                  ✅
                </motion.div>
                <h2>Ready to Optimize!</h2>
                <p>Launching your warehouse locator...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Fun Facts */}
          <motion.div 
            className="loading-facts"
            variants={itemVariants}
          >
            <div className="fact-item">
              <strong>Did you know?</strong> Our AI analyzes over 50 factors to find optimal locations
            </div>
          </motion.div>
        </div>

        {/* Loading Particles */}
        <div className="loading-particles">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="particle"
              animate={{
                x: [0, Math.random() * 400 - 200],
                y: [0, Math.random() * 400 - 200],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                ease: "easeOut",
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingPage;
