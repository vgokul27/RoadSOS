import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import {
  Upload,
  Camera,
  Play,
  Loader2,
  Brain,
  ImageIcon,
  Gauge,
  Car,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  sampleImages,
  vehicleTypes,
  demoScenarios,
} from '../lib/accidentDetection';
import Slider from '../components/Slider';
import SeverityBadge from '../components/SeverityBadge';
import SOSButton from '../components/SOSButton';

export default function Detection() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);

  const [imageUrl, setImageUrl] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [useCamera, setUseCamera] = useState(false);
  const [speed, setSpeed] = useState(40);
  const [vehicleType, setVehicleType] = useState('car');
  const [model, setModel] = useState(null);
  const [modelLoading, setModelLoading] = useState(true);
  const [predictions, setPredictions] = useState(null);

  // COCO-SSD object classes for accident detection
  const accidentIndicators = {
    vehicle: ['car', 'truck', 'bus', 'motorcycle'],
    emergency: ['fire truck', 'ambulance'],
    person: ['person'],
    dangerous: ['traffic light'],
  };

  // Load COCO-SSD model on component mount
  useEffect(() => {
    const loadModel = async () => {
      try {
        setModelLoading(true);
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
        setModelLoading(false);
      } catch (error) {
        console.error('Error loading model:', error);
        setModelLoading(false);
      }
    };
    loadModel();
  }, []);

  // Calculate severity based on speed and vehicle type
  const calculateSeverity = (spd) => {
    if (spd < 20) return 'Low';
    if (spd < 80) return 'Medium';
    return 'High';
  };

  // Analyze objects detected in image to determine accident
  const analyzeObjectsForAccident = (predictions) => {
    const detectedObjects = {};
    const detectedClasses = [];

    // Count and categorize detected objects
    predictions.forEach((pred) => {
      const className = pred.class.toLowerCase();
      detectedClasses.push(className);
      detectedObjects[className] = (detectedObjects[className] || 0) + 1;
    });

    // Accident detection logic
    let accidentScore = 0;
    let accidentReasons = [];

    // Check for emergency vehicles (strong indicator of accident)
    if (detectedObjects['fire truck'] || detectedObjects['ambulance']) {
      accidentScore += 50;
      accidentReasons.push('🚑 Emergency vehicle detected on scene');
    }

    // Check for multiple vehicles (collision indicator)
    const vehicleCount = (detectedObjects['car'] || 0) + (detectedObjects['truck'] || 0) + (detectedObjects['bus'] || 0) + (detectedObjects['motorcycle'] || 0);
    if (vehicleCount >= 2) {
      accidentScore += 40;
      accidentReasons.push(`🚗 Multiple vehicles detected (${vehicleCount}) - possible collision`);
    } else if (vehicleCount >= 1) {
      accidentScore += 15;
    }

    // Check for people on road (dangerous situation) - STRONG indicator with vehicle
    const personCount = detectedObjects['person'] || 0;
    if (personCount >= 2 && vehicleCount >= 1) {
      accidentScore += 35;
      accidentReasons.push(`👥 ${personCount} people detected near vehicle(s) - emergency situation`);
    } else if (personCount >= 1 && vehicleCount >= 1) {
      accidentScore += 25;
      accidentReasons.push(`👥 Person(s) detected near vehicle`);
    }

    // Check for high object density (chaotic scene)
    if (predictions.length > 8) {
      accidentScore += 20;
      accidentReasons.push('🔴 High object density - chaotic scene');
    } else if (predictions.length > 5) {
      accidentScore += 10;
      accidentReasons.push('Multiple objects detected in scene');
    }

    // Check for traffic light (context of road incident)
    if (detectedObjects['traffic light'] && vehicleCount > 0) {
      accidentScore += 10;
      accidentReasons.push('🚦 Traffic control visible');
    }

    const accidentDetected = accidentScore >= 25; // Lower threshold for realistic detection
    
    return {
      accidentDetected,
      accidentScore,
      accidentReasons,
      detectedObjects,
      detectedClasses,
      vehicleCount,
      personCount,
    };
  };

  // Classify image using COCO-SSD
  const classifyImage = async (imgElement) => {
    if (!model) return null;

    try {
      const detections = await model.detect(imgElement);
      setPredictions(detections);

      const analysis = analyzeObjectsForAccident(detections);
      const severity = calculateSeverity(speed);

      const result = {
        accidentDetected: analysis.accidentDetected,
        severity,
        confidence: analysis.accidentScore / 100,
        details: analysis.accidentReasons.length > 0
          ? analysis.accidentReasons.join(' • ')
          : 'Safe road condition - no accident indicators detected',
        recommendation: getRecommendation(severity, analysis.accidentDetected),
        topPredictions: detections
          .slice(0, 5)
          .map((d) => ({
            className: d.class,
            probability: d.score,
            bbox: d.bbox,
          })),
        detectedObjects: analysis.detectedObjects,
        analysisDetails: analysis,
      };

      return result;
    } catch (error) {
      console.error('Error detecting objects:', error);
      return null;
    }
  };

  // Get recommendation based on severity
  const getRecommendation = (severity, accidentDetected) => {
    if (!accidentDetected) {
      return 'No emergency assistance needed. Stay safe on the road.';
    }

    switch (severity) {
      case 'Low':
        return 'Minor accident detected. Visit a nearby repair shop or clinic if needed.';
      case 'Medium':
        return 'Moderate accident detected. Contact emergency services and seek medical attention at a hospital.';
      case 'High':
        return '⚠️ Severe accident detected! Immediately call emergency services and go to the nearest trauma center.';
      default:
        return 'Contact emergency services for assistance.';
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImageUrl(ev.target.result);
        setResult(null);
        setPredictions(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    setUseCamera(true);
    setResult(null);
    setImageUrl(null);
    setPredictions(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Camera access denied:', error);
      setUseCamera(false);
      alert('Camera access denied. Please check permissions.');
    }
  };

  const captureFromCamera = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);
    setImageUrl(canvas.toDataURL('image/jpeg'));
    setUseCamera(false);
    if (videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
    }
  };

  const handleAnalyze = async () => {
    if (!imageUrl || !model) return;
    setAnalyzing(true);
    setResult(null);

    // Create image element and load image
    const img = new Image();
    img.src = imageUrl;
    img.onload = async () => {
      const analysisResult = await classifyImage(img);
      setResult(analysisResult);
      setAnalyzing(false);
    };
    img.onerror = () => {
      console.error('Error loading image');
      setAnalyzing(false);
    };
  };

  const loadScenario = useCallback((scenario) => {
    setSpeed(scenario.speed);
    setVehicleType(scenario.vehicle);
    const randomImage =
      sampleImages[Math.floor(Math.random() * sampleImages.length)];
    setImageUrl(randomImage.url);
    setResult(null);
    setPredictions(null);
  }, []);

  const simulateAccident = useCallback(async () => {
    // Load a sample accident-related image (using a generic crash image)
    const accidentImages = [
      'https://images.unsplash.com/photo-1449626645711-2d6ec774e1c6?w=400',
      'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=400',
    ];
    const randomAccidentImage = accidentImages[Math.floor(Math.random() * accidentImages.length)];
    
    setSpeed(80);
    setVehicleType('car');
    setImageUrl(randomAccidentImage);
    setResult(null);
    setPredictions(null);

    // Auto-analyze after image loads
    setTimeout(() => {
      if (model) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = randomAccidentImage;
        img.onload = async () => {
          setAnalyzing(true);
          const analysisResult = await classifyImage(img);
          setResult(analysisResult);
          setAnalyzing(false);
        };
      }
    }, 500);
  }, [model]);

  const handleFindHelp = () => {
    navigate('/emergency-map', {
      state: {
        severity: result.severity,
        accidentDetected: result.accidentDetected,
        speed,
        vehicleType,
      },
    });
  };

  return (
    <div
      className="min-h-screen pt-24 pb-16 px-2"
      style={{
        background:
          'linear-gradient(135deg, hsl(220 20% 4%) 0%, hsl(220 25% 8%) 30%, hsl(15 70% 20%) 100%)',
      }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Model Loading Indicator */}
        {modelLoading && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-lg p-3 flex items-center gap-3"
            style={{
              backgroundColor: 'hsl(45 95% 55% / 0.2)',
              borderColor: 'hsl(45 95% 55%)',
              borderWidth: '1px',
            }}
          >
            <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'hsl(45 95% 55%)' }} />
            <p className="text-sm text-yellow-300">Loading AI model... This may take a moment.</p>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'hsl(0 85% 55% / 0.2)' }}
            >
              <Brain className="w-5 h-5" style={{ color: 'hsl(0 85% 55%)' }} />
            </div>
            <h1 className="text-3xl font-bold text-white">AI Accident Detection</h1>
          </div>
          <p className="text-gray-400 ml-13">
            Powered by TensorFlow.js & COCO-SSD Object Detection - Upload an image or use your camera to detect accidents with real AI
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Input */}
          <div className="space-y-5">
            {/* Upload Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div
                className="rounded-2xl p-6"
                style={{
                  backgroundColor: 'hsl(220 13% 10% / 0.6)',
                  backdropFilter: 'blur(8px)',
                  borderColor: 'hsl(0 0% 100% / 0.1)',
                  borderWidth: '1px',
                  boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
                }}
              >
                <div className="flex gap-3 mb-5">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 flex items-center justify-center cursor-pointer gap-2 px-4 py-3 rounded-xl text-white font-medium hover:opacity-80 transition text-sm"
                    style={{
                      background: 'hsl(220 13% 25%)',
                    }}
                  >
                    <Upload className="w-4 h-4" /> Upload
                  </button>
                  <button
                    onClick={startCamera}
                    className="flex-1 flex items-center justify-center cursor-pointer gap-2 px-4 py-3 rounded-xl text-white font-medium hover:opacity-80 transition text-sm"
                    style={{
                      background: 'hsl(220 13% 25%)',
                    }}
                  >
                    <Camera className="w-4 h-4" /> Camera
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <canvas ref={canvasRef} className="hidden" />

                <div
                  className="relative aspect-video rounded-xl overflow-hidden flex items-center justify-center"
                  style={{ background: 'hsl(220 13% 15%)' }}
                >
                  {useCamera ? (
                    <div className="relative w-full h-full">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      <motion.button
                        onClick={captureFromCamera}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full text-white font-semibold text-sm"
                        style={{
                          background:
                            'linear-gradient(135deg, hsl(0 85% 55%), hsl(0 85% 55%))',
                          boxShadow: '0 0 20px hsl(0 85% 55% / 0.4)',
                        }}
                      >
                        📸 Capture
                      </motion.button>
                    </div>
                  ) : imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Upload"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-40" />
                      <p className="text-sm">Upload or capture an image</p>
                    </div>
                  )}
                </div>

                {imageUrl && !useCamera && (
                  <motion.button
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition disabled:opacity-50"
                    style={{
                      background: analyzing
                        ? 'gray'
                        : 'linear-gradient(135deg, hsl(0 85% 55%), hsl(0 85% 55%))',
                      boxShadow: '0 0 20px hsl(0 85% 55% / 0.4)',
                    }}
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Analyzing...
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" /> Analyze with AI
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </motion.div>

            {/* AI Parameters Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <div
                className="rounded-2xl p-5"
                style={{
                  backgroundColor: 'hsl(220 13% 10% / 0.6)',
                  backdropFilter: 'blur(8px)',
                  borderColor: 'hsl(0 0% 100% / 0.1)',
                  borderWidth: '1px',
                  boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles
                    className="w-4 h-4"
                    style={{ color: 'hsl(45 95% 55%)' }}
                  />
                  <h3 className="font-semibold text-sm text-white">AI Parameters</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full text-white ml-auto"
                    style={{ background: 'hsl(45 95% 55% / 0.3)' }}>
                    AI-Powered
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400 flex items-center gap-1">
                        <Gauge className="w-3.5 h-3.5" /> Speed
                      </span>
                      <span className="font-semibold text-white">{speed} km/h</span>
                    </div>
                    <Slider
                      value={[speed]}
                      onValueChange={([v]) => setSpeed(v)}
                      min={0}
                      max={200}
                      step={5}
                    />
                  </div>

                  <div>
                    <p className="text-sm text-gray-400 mb-2 flex items-center gap-1">
                      <Car className="w-3.5 h-3.5" /> Vehicle Type
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {vehicleTypes.map((v) => (
                        <motion.button
                          key={v.value}
                          onClick={() => setVehicleType(v.value)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-3 py-1.5 rounded-lg text-xs cursor-pointer font-medium transition-all border`}
                          style={{
                            background:
                              vehicleType === v.value
                                ? 'hsl(0 85% 55% / 0.2)'
                                : 'hsl(220 13% 25%)',
                            borderColor:
                              vehicleType === v.value
                                ? 'hsl(0 85% 55%)'
                                : 'transparent',
                            color:
                              vehicleType === v.value
                                ? 'hsl(0 85% 55%)'
                                : 'white',
                          }}
                        >
                          {v.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Demo Scenarios */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div
                className="rounded-2xl p-5"
                style={{
                  backgroundColor: 'hsl(220 13% 10% / 0.6)',
                  backdropFilter: 'blur(8px)',
                  borderColor: 'hsl(0 0% 100% / 0.1)',
                  borderWidth: '1px',
                  boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4" style={{ color: 'hsl(45 95% 55%)' }} />
                  <h3 className="font-semibold text-sm text-white">
                    🧪 Demo & Scenarios
                  </h3>
                </div>

                {/* Simulate Accident Button */}
                <motion.button
                  onClick={simulateAccident}
                  disabled={!model || modelLoading}
                  whileHover={{ scale: 1.02 }}
                  className="w-full text-center rounded-xl p-3 transition-all mb-3 disabled:opacity-50"
                  style={{
                    backgroundColor: 'hsl(0 85% 55% / 0.2)',
                    borderColor: 'hsl(0 85% 55%)',
                    borderWidth: '2px',
                  }}
                >
                  <p className="text-sm font-semibold text-white">🚨 Simulate Accident Detection</p>
                  <p className="text-xs text-gray-400 mt-1">Load & analyze a sample accident image</p>
                </motion.button>

                <div className="space-y-2">
                  {demoScenarios.map((s) => (
                    <motion.button
                      key={s.label}
                      onClick={() => loadScenario(s)}
                      whileHover={{ scale: 1.02 }}
                      className="w-full text-left rounded-xl p-3 transition-all"
                      style={{
                        backgroundColor: 'hsl(220 13% 15%)',
                        borderColor: 'hsl(0 0% 100% / 0.1)',
                        borderWidth: '1px',
                      }}
                    >
                      <p className="text-sm font-medium text-white">{s.label}</p>
                      <p className="text-xs text-gray-400">
                        {s.description} • {s.speed} km/h • {s.vehicle}
                      </p>
                    </motion.button>
                  ))}
                </div>

                <div className="mt-3 grid grid-cols-3 gap-3">
                  {sampleImages.map((s) => (
                    <motion.button
                      key={s.label}
                      onClick={() => {
                        setImageUrl(s.url);
                        setResult(null);
                      }}
                      whileHover={{ scale: 1.05 }}
                      className="group"
                    >
                      <div
                        className="aspect-video rounded-lg overflow-hidden border transition"
                        style={{
                          borderColor: 'hsl(0 0% 100% / 0.1)',
                          borderWidth: '1px',
                        }}
                      >
                        <img
                          src={s.url}
                          alt={s.label}
                          className="w-full h-full object-cover group-hover:scale-110 transition"
                        />
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1 text-center">
                        {s.label}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Results */}
          <div className="space-y-5">
            <AnimatePresence mode="wait">
              {analyzing && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-2xl p-10 flex flex-col items-center justify-center"
                  style={{
                    backgroundColor: 'hsl(220 13% 10% / 0.6)',
                    backdropFilter: 'blur(8px)',
                    borderColor: 'hsl(0 0% 100% / 0.1)',
                    borderWidth: '1px',
                    boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  <div
                    className="w-20 h-20 rounded-full border-4 border-t-4 animate-spin mb-5"
                    style={{
                      borderColor: 'hsl(0 85% 55% / 0.2)',
                      borderTopColor: 'hsl(0 85% 55%)',
                    }}
                  />
                  <p className="font-semibold text-white">Analyzing Image...</p>
                  <p className="text-sm text-gray-400 mt-1">
                    AI model processing • Speed: {speed} km/h • {vehicleType}
                  </p>
                </motion.div>
              )}

              {result && !analyzing && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-5"
                >
                  {/* Detection Result */}
                  <div
                    className="rounded-2xl p-6"
                    style={{
                      backgroundColor: 'hsl(220 13% 10% / 0.6)',
                      backdropFilter: 'blur(8px)',
                      borderColor: result.accidentDetected
                        ? 'hsl(0 85% 55% / 0.3)'
                        : 'hsl(145 65% 42% / 0.3)',
                      borderWidth: '1px',
                      boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-white">Detection Result</h3>
                      <span className="text-xs text-gray-400 px-2 py-1 rounded-md"
                        style={{ background: 'hsl(220 13% 20%)' }}>
                        COCO-SSD + Smart Analysis
                      </span>
                    </div>

                    <div
                      className="rounded-xl p-5 mb-4"
                      style={{
                        background: result.accidentDetected
                          ? 'hsl(0 85% 55% / 0.1)'
                          : 'hsl(145 65% 42% / 0.1)',
                        borderColor: result.accidentDetected
                          ? 'hsl(0 85% 55% / 0.2)'
                          : 'hsl(145 65% 42% / 0.2)',
                        borderWidth: '1px',
                      }}
                    >
                      <p className="font-bold text-2xl mb-2 text-white">
                        {result.accidentDetected
                          ? '🚨 Accident Detected'
                          : '✅ No Accident Detected'}
                      </p>
                      <SeverityBadge severity={result.severity} />
                    </div>

                    {/* Top 5 Detected Objects */}
                    <div className="mb-4 space-y-2">
                      <p className="text-xs text-gray-500 font-semibold uppercase">Detected Objects</p>
                      {result.topPredictions && result.topPredictions.map((pred, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="text-gray-300 capitalize">{pred.className}</span>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-20 h-2 rounded-full overflow-hidden"
                              style={{ background: 'hsl(220 13% 20%)' }}
                            >
                              <div
                                className="h-full"
                                style={{
                                  width: `${pred.probability * 100}%`,
                                  background: 'linear-gradient(90deg, hsl(45 95% 55%), hsl(0 85% 55%))',
                                }}
                              />
                            </div>
                            <span className="font-semibold text-white w-12 text-right">
                              {(pred.probability * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Accident Analysis Details */}
                    {result.analysisDetails && result.analysisDetails.accidentReasons.length > 0 && (
                      <div className="mb-4 space-y-2 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                        <p className="text-xs text-red-300 font-semibold">ACCIDENT INDICATORS:</p>
                        <ul className="text-xs text-red-200 space-y-1">
                          {result.analysisDetails.accidentReasons.map((reason, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-red-400 mt-0.5">•</span>
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                        <p className="text-xs text-red-300 mt-2">
                          <strong>Accident Score: {result.analysisDetails.accidentScore}/100</strong>
                        </p>
                      </div>
                    )}

                    <div className="space-y-3 border-t border-white/10 pt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Confidence</span>
                        <span className="font-semibold text-white">
                          {(result.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div
                        className="w-full h-2 rounded-full overflow-hidden"
                        style={{ background: 'hsl(220 13% 20%)' }}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${result.confidence * 100}%` }}
                          transition={{ duration: 0.8 }}
                          className="h-full"
                          style={{
                            background:
                              'linear-gradient(135deg, hsl(0 85% 55%), hsl(0 85% 55%))',
                          }}
                        />
                      </div>
                      <p className="text-sm text-gray-400">{result.details}</p>
                    </div>
                  </div>

                  {/* AI Recommendation */}
                  <div
                    className="rounded-2xl p-5"
                    style={{
                      backgroundColor: 'hsl(220 13% 10% / 0.6)',
                      backdropFilter: 'blur(8px)',
                      borderColor: 'hsl(45 95% 55% / 0.3)',
                      borderLeftColor: 'hsl(45 95% 55%)',
                      borderWidth: '1px',
                      borderLeftWidth: '4px',
                      boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles
                        className="w-4 h-4"
                        style={{ color: 'hsl(45 95% 55%)' }}
                      />
                      <h4 className="font-semibold text-sm text-white">
                        Smart AI Recommendation
                      </h4>
                    </div>
                    <p className="text-sm text-gray-300 mb-3">{result.recommendation}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                      <span className="px-2 py-1 rounded"
                        style={{ background: 'hsl(220 13% 20%)' }}>
                        ⚡ Speed: {speed} km/h
                      </span>
                      <span className="px-2 py-1 rounded"
                        style={{ background: 'hsl(220 13% 20%)' }}>
                        🚗 Vehicle: {vehicleType}
                      </span>
                      <span className="px-2 py-1 rounded col-span-2"
                        style={{ background: 'hsl(220 13% 20%)' }}>
                        📊 Severity: {result.severity}
                      </span>
                    </div>
                  </div>

                  {/* SOS For Severe Accidents */}
                  {result.accidentDetected && result.severity === 'High' && (
                    <div
                      className="rounded-2xl p-6 flex flex-col items-center"
                      style={{
                        backgroundColor: 'hsl(220 13% 10% / 0.6)',
                        backdropFilter: 'blur(8px)',
                        borderColor: 'hsl(0 85% 55% / 0.3)',
                        borderWidth: '1px',
                        boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
                      }}
                    >
                      <p className="font-semibold text-white mb-4">Send Emergency Alert</p>
                      <SOSButton severity={result.severity} />
                    </div>
                  )}

                  {/* Find Nearby Help Button */}
                  <motion.button
                    onClick={handleFindHelp}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2"
                    style={{
                      background:
                        'linear-gradient(135deg, hsl(0 85% 55%), hsl(0 85% 55%))',
                      boxShadow: '0 0 20px hsl(0 85% 55% / 0.4)',
                    }}
                  >
                    📍 Find Nearby Help
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {!result && !analyzing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl p-10 flex flex-col items-center text-center"
                style={{
                  backgroundColor: 'hsl(220 13% 10% / 0.6)',
                  backdropFilter: 'blur(8px)',
                  borderColor: 'hsl(0 0% 100% / 0.1)',
                  borderWidth: '1px',
                  boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
                }}
              >
                <Brain className="w-16 h-16 text-gray-600 mb-4" />
                <p className="text-gray-400 text-sm">
                  Upload or capture an image, configure AI parameters, then click
                  "Analyze with AI"
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
