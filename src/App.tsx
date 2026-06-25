import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Terminal,
  Laptop,
  Globe,
  GraduationCap,
  Code2,
  Sliders,
  Video,
  Info,
  Settings,
  Shield,
  Layers,
  Wifi,
  Mail,
  Phone,
  MapPin,
  Activity,
  ExternalLink,
  Database,
  Award,
  Send,
  ChevronRight,
  RefreshCw,
  Wallet,
  Menu,
  X,
  Volume2,
  VolumeX,
  MessageCircle,
  Download,
  Home,
  Cpu,
} from "lucide-react";
import Logo from "./components/shared/Logo";
import ScrollProgressHUD from "./components/shared/ScrollProgressHUD";
import MobileFastScroller from "./components/shared/MobileFastScroller";
import SectionDivider from "./components/shared/SectionDivider";
import { portfolioData } from "./data";
import { UptimeCounter, LocalDateTimeIndicator, PingIndicator } from "./components/shared/CockpitWidgets";
import {
  handleDownloadCV,
  playClickSound,
  normalizeVideoUrl,
  getAccentHex,
  getAccentTextClass,
  getAccentBgClass,
  getAccentRgba,
  getAccentSelectionClass,
} from "./utils";
import { AccentColor } from "./types";
import HeroSection from "./components/Hero/HeroSection";
import CompanyMarquee from "./components/shared/CompanyMarquee";
import AboutSection from "./components/About/AboutSection";
import SkillsSection from "./components/Skills/SkillsSection";
import ProjectsSection from "./components/Projects/ProjectsSection";
import WorkExperienceSection from "./components/WorkExperience/WorkExperienceSection";
import ServicesSection from "./components/Services/ServicesSection";
import CertificationsSection from "./components/Certifications/CertificationsSection";
import TestimonialsSection from "./components/Testimonials/TestimonialsSection";
import ContactSection from "./components/Contact/ContactSection";
import FooterSection from "./components/Footer/FooterSection";
import AdminSection from "./components/Admin/AdminSection";
import CVModal from "./components/shared/CVModal";
import { db, seedDatabaseIfEmpty } from "./firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
} from "firebase/firestore";

export default function App() {
  const [booting, setBooting] = useState(true);
  const [bootProgress, setBootProgress] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);

  // Helper to resolve localized boot notifications based on terminal progress metrics
  const getBootLogMessage = (pct: number) => {
    if (pct < 10) return "Establishing Secure SSH Tunnel to Enugu Server Node...";
    if (pct < 20) return "Pulling repository manifests index & package.json...";
    if (pct < 32) return "Resolving iCatholic Igbo Missal assets & 70K active user shards...";
    if (pct < 45) return "Unpacking Biddo live property bid streams & real-time heatmaps...";
    if (pct < 58) return "Configuring WAPlug automation webhooks & message automation SaaS...";
    if (pct < 72) return "Loading Oyadrop secure Paystack gateway integration & logistics maps...";
    if (pct < 85) return "Compiling RabbAi student dashboard, score gauges, and AI chatbots...";
    if (pct < 95) return "Linking high-performance avionics deck systems and dashboard indicators...";
    if (pct < 100) return "Initiating secure workspace integrity handshakes...";
    return "SUCCESS: Workspace environment fully active! Ready to render.";
  };

  const [videoUrl, setVideoUrl] = useState(() => {
    return localStorage.getItem("codeoven_video_url") || "";
  });
  const [heroBgVideoUrl, setHeroBgVideoUrl] = useState(() => {
    const saved = localStorage.getItem("codeoven_hero_bg_video_url");
    return saved
      ? normalizeVideoUrl(saved)
      : "https://res.cloudinary.com/ikonicity-airban/video/upload/f_auto,q_auto/v1781709867/vecteezy_neon-city-ai-generated-ai-generative_31698896_w8zwsf_1_bdio5w.mp4";
  });

  const [showConfig, setShowConfig] = useState(false);
  const [showCVModal, setShowCVModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSkipHovered, setIsSkipHovered] = useState(false);
  const [inputUrl, setInputUrl] = useState("");
  const [inputBgUrl, setInputBgUrl] = useState("");
  const [activePreset, setActivePreset] = useState<
    "matrix" | "neon" | "code" | "custom"
  >(() => {
    return (
      (localStorage.getItem("codeoven_active_preset") as
        | "matrix"
        | "neon"
        | "code"
        | "custom") || "matrix"
    );
  });
  const [accentColor, setAccentColor] = useState<AccentColor>(() => {
    return (
      (localStorage.getItem("codeoven_accent_color") as AccentColor) || "green"
    );
  });
  const [activeThemeProfile, setActiveThemeProfile] = useState<string>(() => {
    return (
      localStorage.getItem("codeoven_active_theme_profile") || "matrix-crypt"
    );
  });
  const [themeSwitchingName, setThemeSwitchingName] = useState<string | null>(
    null,
  );
  // Sub-space transmission logger
  const [transmissionLogs, setTransmissionLogs] = useState<string[]>([
    "[SYS]: PORTAL READY FOR NEURAL TRANSMISSION...",
  ]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [transmitting, setTransmitting] = useState(false);
  const [transmitSuccess, setTransmitSuccess] = useState(false);

  // Live Firestore database states
  const [dbProjects, setDbProjects] = useState<any[]>([]);
  const [dbTestimonials, setDbTestimonials] = useState<any[]>([]);
  const [availability, setAvailability] = useState<{
    status: string;
    message: string;
  }>({
    status: "available",
    message: "Available for work",
  });
  const [showAdmin, setShowAdmin] = useState(false);

  // MetaMask / Web3 Wallet integration
  const [walletAddress, setWalletAddress] = useState<string>(() => {
    return localStorage.getItem("codeoven_wallet_address") || "";
  });
  const [connectingWallet, setConnectingWallet] = useState(false);
  const [walletError, setWalletError] = useState("");

  // Global sound toggle control for background video audio
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    const saved = localStorage.getItem("bg_video_muted");
    return saved !== null ? saved === "true" : true;
  });

  const toggleMute = () => {
    const nextValue = !isMuted;
    setIsMuted(nextValue);
    localStorage.setItem("bg_video_muted", String(nextValue));
  };

  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const whatsappTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const roadmapEl = document.getElementById("engineering-roadmap");
      if (roadmapEl) {
        const rect = roadmapEl.getBoundingClientRect();
        // The user has passed the engineering roadmap section when the bottom of that section has crossed above the viewport bottom.
        if (rect.bottom > window.innerHeight) {
          setShowWhatsApp(false);
          if (whatsappTimeoutRef.current) {
            clearTimeout(whatsappTimeoutRef.current);
          }
          return;
        }
      } else {
        setShowWhatsApp(false);
        return;
      }

      // Show WhatsApp button while scrolling is happening
      setShowWhatsApp(true);

      // Cancel any previous timeout
      if (whatsappTimeoutRef.current) {
        clearTimeout(whatsappTimeoutRef.current);
      }

      // Hide WhatsApp button after exactly 2 seconds of scroll inactivity (denounce/throttle)
      whatsappTimeoutRef.current = setTimeout(() => {
        setShowWhatsApp(false);
      }, 2000);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (whatsappTimeoutRef.current) {
        clearTimeout(whatsappTimeoutRef.current);
      }
    };
  }, []);

  // Persist selections into LocalStorage
  useEffect(() => {
    localStorage.setItem("codeoven_active_preset", activePreset);
  }, [activePreset]);

  useEffect(() => {
    localStorage.setItem("codeoven_accent_color", accentColor);
  }, [accentColor]);

  useEffect(() => {
    localStorage.setItem("codeoven_active_theme_profile", activeThemeProfile);
  }, [activeThemeProfile]);

  // References
  const terminalLogsEndRef = useRef<HTMLDivElement>(null);

  // Dynamic boot progress loader effect
  useEffect(() => {
    if (!booting) return;
    
    const startTime = Date.now();
    const interval = setInterval(() => {
      setElapsedMs(Date.now() - startTime);
      setBootProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          const endTimeout = setTimeout(() => {
            setBooting(false);
          }, 350);
          return 100;
        }
        // Realistic step speed simulation - fast at start, holds slightly, ends clean
        const speedFactor = Math.random();
        let increment = 1;
        if (speedFactor < 0.2) {
          increment = Math.floor(Math.random() * 2) + 1; // 1-2%
        } else if (speedFactor < 0.7) {
          increment = Math.floor(Math.random() * 4) + 3; // 3-6%
        } else {
          increment = Math.floor(Math.random() * 6) + 4; // 4-9%
        }
        return Math.min(prev + increment, 100);
      });
    }, 70);

    return () => clearInterval(interval);
  }, [booting]);

  // Terminal Escape or Ctrl+C bypass key handler
  useEffect(() => {
    if (!booting) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || (e.ctrlKey && e.key.toLowerCase() === "c")) {
        e.preventDefault();
        setBooting(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [booting]);

  // Real-time Database Synchronization Setup
  useEffect(() => {
    // 1. Instantly subscribe to real-time collections so offline/cached data loads immediately without blocker
    const projectsQuery = query(
      collection(db, "projects"),
      orderBy("order", "asc"),
    );
    const unsubProjects = onSnapshot(
      projectsQuery,
      (snapshot) => {
        const fetched: any[] = [];
        snapshot.forEach((docSnap) => {
          fetched.push({ id: docSnap.id, ...docSnap.data() });
        });
        setDbProjects(fetched);
      },
      (err) => {
        console.warn("Realtime projects subscription failed (operating offline?):", err);
      },
    );

    const testimonialsQuery = query(
      collection(db, "testimonials"),
      orderBy("order", "asc"),
    );
    const unsubTestimonials = onSnapshot(
      testimonialsQuery,
      (snapshot) => {
        const fetched: any[] = [];
        snapshot.forEach((docSnap) => {
          fetched.push({ id: docSnap.id, ...docSnap.data() });
        });
        setDbTestimonials(fetched);
      },
      (err) => {
        console.warn("Realtime testimonials subscription failed (operating offline?):", err);
      },
    );

    const unsubAvailability = onSnapshot(
      doc(db, "availability", "global"),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setAvailability({
            status: data.status || "available",
            message: data.message || "Available for work",
          });
        }
      },
      (err) => {
        console.warn("Realtime availability subscription failed (operating offline?):", err);
      },
    );

    // 2. Perform database seeding as a non-blocking background check
    seedDatabaseIfEmpty()
      .then(() => {
        // Seeding completed silently or updated active docs
      })
      .catch((err) => {
        console.warn("Initial database seeding / connection check failed (expected if offline/blocked):", err);
      });

    // 3. SECURE CLEANUP: Synchronously return the unsub functions to prevent memory/quota leaks
    return () => {
      unsubProjects();
      unsubTestimonials();
      unsubAvailability();
    };
  }, []);

  const handleSaveVideoUrl = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("codeoven_video_url", inputUrl);
    setVideoUrl(inputUrl);
    setShowConfig(false);
  };

  const handleClearVideo = () => {
    localStorage.removeItem("codeoven_video_url");
    setVideoUrl("");
    setInputUrl("");
    setActivePreset("matrix");
  };

  const selectPresetVideo = (url: string, presetName: "neon" | "code") => {
    setInputUrl(url);
    setVideoUrl(url);
    localStorage.setItem("codeoven_video_url", url);
    setActivePreset(presetName);
  };

  const handleSaveBgVideoUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = normalizeVideoUrl(inputBgUrl);
    localStorage.setItem("codeoven_hero_bg_video_url", normalized);
    setHeroBgVideoUrl(normalized);
    setShowConfig(false);
  };

  const handleClearBgVideo = () => {
    localStorage.removeItem("codeoven_hero_bg_video_url");
    setHeroBgVideoUrl(
      "https://res.cloudinary.com/ikonicity-airban/video/upload/f_auto,q_auto/v1781709867/vecteezy_neon-city-ai-generated-ai-generative_31698896_w8zwsf_1_bdio5w.mp4",
    );
    setInputBgUrl("");
  };

  const selectPresetBgVideo = (url: string) => {
    const normalized = normalizeVideoUrl(url);
    setInputBgUrl(normalized);
    setHeroBgVideoUrl(normalized);
    localStorage.setItem("codeoven_hero_bg_video_url", normalized);
  };

  const applyThemeProfile = (profileId: string) => {
    playClickSound("success");
    setActiveThemeProfile(profileId);
    let name = "";
    if (profileId === "matrix-crypt") {
      name = "MATRIX OVERLOAD CRYPT";
      setAccentColor("green");
      selectPresetVideo(
        "https://assets.mixkit.co/videos/preview/mixkit-matrix-style-code-screen-background-34289-large.mp4",
        "code",
      );
      selectPresetBgVideo(
        "https://res.cloudinary.com/demo/video/upload/q_auto,vc_h264/docs/ambient_video.mp4",
      );
    } else if (profileId === "electric-subway") {
      name = "ELECTRIC SUBWAY";
      setAccentColor("cyan");
      selectPresetVideo(
        "https://assets.mixkit.co/videos/preview/mixkit-futuristic-subway-station-with-blue-neon-lights-42284-large.mp4",
        "neon",
      );
      selectPresetBgVideo(
        "https://res.cloudinary.com/demo/video/upload/q_auto,vc_h264/docs/ambient_video.mp4",
      );
    } else if (profileId === "cyber-hologram") {
      name = "CYBER COCKPIT HYBRID";
      setAccentColor("cyan");
      selectPresetVideo(
        "https://assets.mixkit.co/videos/preview/mixkit-matrix-style-code-screen-background-34289-large.mp4",
        "code",
      );
      selectPresetBgVideo(
        "https://res.cloudinary.com/demo/video/upload/q_auto,vc_h264/docs/ambient_video.mp4",
      );
    } else if (profileId === "quantum-stealth") {
      name = "QUANTUM STEALTH";
      setAccentColor("green");
      handleClearVideo();
      selectPresetBgVideo(
        "https://res.cloudinary.com/ikonicity-airban/video/upload/f_auto,q_auto/v1781709863/vecteezy_abstract-cyberpunk-animated-background_4846470_do0h7u_p8etxb.mp4",
      );
    }
    setThemeSwitchingName(name);
    setTimeout(() => {
      setThemeSwitchingName(null);
    }, 1200);
    logTransmission(`DYNAMIC_PRESET LOCKED // PROFILE: ${name}`);
  };

  // Transmission logs generator
  const logTransmission = (text: string) => {
    setTransmissionLogs((prev) => [...prev.slice(-8), `[SYS]: ${text}`]);
    if (terminalLogsEndRef.current) {
      terminalLogsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Input change logger
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    logTransmission(
      `KEYBOARD_INPUT DETECTED // FIELD: ${field.toUpperCase()} [LEN: ${value.length}]`,
    );
  };

  const handleTransmitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      logTransmission(
        "ERROR: SUB_SPACE ROUTE FAULT — MANDATORY FIELDS REJECTED",
      );
      return;
    }
    setTransmitting(true);
    logTransmission("ATTEMPTING TRANSMISSION AT EMIT FREQUENCY 395.14 MHz...");

    setTimeout(() => {
      setTransmitting(false);
      setTransmitSuccess(true);
      logTransmission(
        `SUCCESS: PACKET RECEIVED FOR ${formData.name.toUpperCase()}`,
      );
      logTransmission("ENCRYPTION LOG: SHA-256 SECURED");
      setFormData({ name: "", email: "", message: "" });
    }, 1500);
  };

  const connectMetaMask = async () => {
    setConnectingWallet(true);
    setWalletError("");
    logTransmission("ATTEMPTING METAMASK WEB3 CORE PROTOCOL CONNECT...");

    const hasEthereum =
      typeof window !== "undefined" &&
      (window as any).ethereum &&
      typeof (window as any).ethereum.request === "function";

    if (hasEthereum) {
      try {
        const accounts = await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts && accounts.length > 0) {
          const addr = accounts[0];
          setWalletAddress(addr);
          localStorage.setItem("codeoven_wallet_address", addr);
          logTransmission(
            `METAMASK LINKED SUCCESSFUL // ADDR: ${addr.toUpperCase()}`,
          );
        } else {
          throw new Error("No accounts authorized");
        }
      } catch (err: any) {
        console.error("MetaMask connection failed:", err);
        const errMsg =
          err.code !== undefined
            ? `error ${err.code}: ${err.message || "Failed to connect to MetaMask"}`
            : err.message || "Failed to connect to MetaMask";

        setWalletError(errMsg);
        setWalletAddress("");
        localStorage.removeItem("codeoven_wallet_address");
        logTransmission(
          `METAMASK CONNECTION FAILED // ${errMsg.toUpperCase()}`,
        );
      } finally {
        setConnectingWallet(false);
      }
    } else {
      // Elegant High tech fallback simulation
      setTimeout(() => {
        setConnectingWallet(false);
        const simulatedAddress = "0x39ff14fb77d4e801b7a67f10cf2edea02ad67c9b";
        setWalletAddress(simulatedAddress);
        localStorage.setItem("codeoven_wallet_address", simulatedAddress);
        logTransmission(
          `WEB3 SECURE EMULATOR ONLINE // ADDR: ${simulatedAddress.toUpperCase()}`,
        );
        logTransmission(
          "[SYS]: METAMASK EXTENSION NOT DETECTED — MOUNTED COCKPIT FALLBACK LINK",
        );
      }, 300);
    }
  };

  const disconnectMetaMask = () => {
    setWalletAddress("");
    setWalletError("");
    localStorage.removeItem("codeoven_wallet_address");
    logTransmission("METAMASK CORE LINK TERMINATED BY COCKPIT COMMAND");
  };

  // Strict colors
  const primaryAccent = getAccentHex(accentColor);
  const textAccentClass = getAccentTextClass(accentColor);
  const bgAccentClass = getAccentBgClass(accentColor);

  const getBorderAccentClassWithOpacity = (color: AccentColor) => {
    switch (color) {
      case "green":
        return "border-[#39FF14]/50";
      case "cyan":
        return "border-[#00D4FF]/50";
      case "pink":
        return "border-[#FF007F]/50";
      case "purple":
        return "border-[#BD00FF]/50";
      case "yellow":
        return "border-[#FFE600]/50";
      default:
        return "border-[#39FF14]/50";
    }
  };
  const borderAccentClass = getBorderAccentClassWithOpacity(accentColor);

  const getGlowShadowClass = (color: AccentColor) => {
    switch (color) {
      case "green":
        return "shadow-[0_0_20px_rgba(57,255,20,0.3)]";
      case "cyan":
        return "shadow-[0_0_20px_rgba(0,212,255,0.3)]";
      case "pink":
        return "shadow-[0_0_20px_rgba(255,0,127,0.3)]";
      case "purple":
        return "shadow-[0_0_20px_rgba(189,0,255,0.3)]";
      case "yellow":
        return "shadow-[0_0_20px_rgba(255,230,0,0.3)]";
      default:
        return "shadow-[0_0_20px_rgba(57,255,20,0.3)]";
    }
  };
  const glowShadowClass = getGlowShadowClass(accentColor);

  const getActivePresetBorderClass = (color: AccentColor) => {
    switch (color) {
      case "green":
        return "border-[#39FF14] bg-[#39FF14]/5 text-white";
      case "cyan":
        return "border-[#00D4FF] bg-[#00D4FF]/5 text-white";
      case "pink":
        return "border-[#FF007F] bg-[#FF007F]/5 text-white";
      case "purple":
        return "border-[#BD00FF] bg-[#BD00FF]/5 text-white";
      case "yellow":
        return "border-[#FFE600] bg-[#FFE600]/5 text-white";
      default:
        return "border-[#39FF14] bg-[#39FF14]/5 text-white";
    }
  };

  const getBtnBaseClass = (color: AccentColor) => {
    switch (color) {
      case "green":
        return "bg-[#39FF14] text-[#050816] hover:bg-[#32e012] font-black uppercase text-xs tracking-wider transition-all duration-300 shadow-[0_0_15px_rgba(57,255,20,0.25)]";
      case "cyan":
        return "bg-[#00D4FF] text-[#050816] hover:bg-[#00b2d6] font-black uppercase text-xs tracking-wider transition-all duration-300 shadow-[0_0_15px_rgba(0,212,255,0.25)]";
      case "pink":
        return "bg-[#FF007F] text-[#050816] hover:bg-[#e60072] font-black uppercase text-xs tracking-wider transition-all duration-300 shadow-[0_0_15px_rgba(255,0,127,0.25)]";
      case "purple":
        return "bg-[#BD00FF] text-[#050816] hover:bg-[#a300dc] font-black uppercase text-xs tracking-wider transition-all duration-300 shadow-[0_0_15px_rgba(189,0,255,0.25)]";
      case "yellow":
        return "bg-[#FFE600] text-[#050816] hover:bg-[#e6cf00] font-black uppercase text-xs tracking-wider transition-all duration-300 shadow-[0_0_15px_rgba(255,230,0,0.25)]";
      default:
        return "bg-[#39FF14] text-[#050816] hover:bg-[#32e012] font-black uppercase text-xs tracking-wider transition-all duration-300 shadow-[0_0_15px_rgba(57,255,20,0.25)]";
    }
  };

  const styleMap = {
    btnBase: getBtnBaseClass(accentColor),
  };

  // Git Bash progress bar metrics calculated dynamically
  const totalKBytes = 4132;
  const receivedKBytes = Math.floor((bootProgress / 100) * totalKBytes);
  const timeTotalStr = "0:00:03";
  const elapsedSecs = Math.floor(elapsedMs / 1000);
  const timeLeftSecs = Math.max(0, 3 - elapsedSecs);
  const timeLeftStr = bootProgress === 100 ? "--:--:--" : `0:00:0${timeLeftSecs}`;
  const currSpeed = bootProgress === 0 ? "0k" : bootProgress < 100 ? "2.2M" : "2.4M";

  const isSmallScreen = typeof window !== "undefined" && window.innerWidth < 480;
  const barLength = isSmallScreen ? 11 : 25;
  const filledBlocks = Math.floor((bootProgress / 100) * barLength);
  const emptyBlocks = barLength - filledBlocks;
  const bar = "█".repeat(filledBlocks) + "░".repeat(emptyBlocks);

  return (
    <div className={`relative min-h-screen bg-[#050816] text-[#F0F4FF] overflow-x-clip font-sans ${getAccentSelectionClass(accentColor)}`}>
      {/* 1. SCALING SYSTEM SCANLINE SWEEP */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none">
        <div 
          className="w-full h-[3px] absolute top-0 left-0 animate-[scanline_8s_linear_infinite]" 
          style={{
            backgroundImage: `linear-gradient(to right, transparent, ${getAccentHex(accentColor)}26, transparent)`
          }}
        />
      </div>

      {/* Edge cockpit border lights */}
      <div className="fixed top-0 bottom-0 left-0 w-[2.5px] z-50 hidden xl:block">
        <div
          className={`w-full h-full ${bgAccentClass} opacity-40 shadow-[0_0_10px_currentColor]`}
        />
      </div>
      <div className="fixed top-0 bottom-0 right-0 w-[2.5px] z-50 hidden xl:block">
        <div
          className={`w-full h-full ${bgAccentClass} opacity-40 shadow-[0_0_10px_currentColor]`}
        />
      </div>

      {/* Background grid structure */}
      <div 
        className="absolute inset-0 bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)] pointer-events-none" 
        style={{
          backgroundImage: `
            linear-gradient(to right, ${getAccentHex(accentColor)}05 1px, transparent 1px),
            linear-gradient(to bottom, ${getAccentHex(accentColor)}05 1px, transparent 1px)
          `
        }}
      />

      {/* BOOTING SEQUENCE SYSTEM LOADER (GIT BASH CONSOLE) */}
      <AnimatePresence>
        {booting && (
          <motion.div
            className="fixed inset-0 bg-[#050816]/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4 md:p-6"
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Terminal Window Shell */}
            <div className="w-full max-w-2xl bg-[#0c0d12] rounded-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden font-mono">
              
              {/* MacBook-style Git Bash Window TitleBar */}
              <div className="bg-[#181a23] px-3 md:px-4 py-2.5 flex items-center justify-between border-b border-white/5 select-none text-[11px] text-[#abb2bf] gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Terminal 
                    className="w-3.5 h-3.5 flex-shrink-0" 
                    style={{ color: getAccentHex(accentColor) }}
                  />
                  <span className="font-mono text-[#abb2bf] truncate max-w-[130px] xs:max-w-[190px] sm:max-w-xs md:max-w-none">
                    MINGW64:/c/Users/Airban/projects/airban-ikonicity-portfolio
                  </span>
                </div>
                {/* MacBook-style Terminal Actions */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button 
                    onClick={() => setBooting(false)}
                    className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] hover:brightness-110 transition-all cursor-pointer flex items-center justify-center group"
                    title="Press ESC to bypass loader"
                  >
                    <span className="text-[6px] text-black font-bold opacity-0 group-hover:opacity-100 transition-all">×</span>
                  </button>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] hover:brightness-110 transition-all cursor-pointer" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f] hover:brightness-110 transition-all cursor-pointer" />
                </div>
              </div>

              {/* Terminal window interior */}
              <div className="p-3 md:p-6 space-y-4 text-[9px] xs:text-[11px] md:text-xs text-[#abb2bf] leading-normal min-h-[310px] md:min-h-[350px] flex flex-col justify-between">
                
                {/* Scrollable command stream */}
                <div className="space-y-3.5 text-left overflow-hidden">
                  {/* Prompt line */}
                  <div className="break-all whitespace-normal text-[8.5px] xs:text-[11px] md:text-xs leading-normal">
                    <span className={`font-semibold ${textAccentClass}`}>eban@Airban-Home </span>
                    <span className="text-[#c678dd]">MINGW64 </span>
                    <span className="text-[#e5c07b] break-all">~/projects/airban-ikonicity-portfolio</span>
                    <span className="text-[#56b6c2]"> (master)</span>
                    <br />
                    <span className="text-white">$ </span>
                    <span className="text-white break-all">curl -sSL https://airban-ikonicity.dev/boot.sh | bash</span>
                  </div>

                  {/* Connecting phase */}
                  <div className="text-[7.5px] xs:text-[9.5px] md:text-[11px] text-[#5c6370] space-y-0.5 select-none overflow-x-auto whitespace-pre scrollbar-thin">
                    <div>% Total    % Received % Xferd  Average Speed   Time    Time     Time  Current</div>
                    <div>                                 Dload  Upload   Total   Spent    Left  Speed</div>
                    <div className="text-[#61afef] font-semibold">
                      {`100  4132k  100  ${String(receivedKBytes).padStart(4, " ")}k    0     0  2250k      0  ${timeTotalStr}  ${timeLeftStr === "--:--:--" ? `0:00:0${Math.floor(elapsedMs / 1000)}` : `0:00:0${Math.floor(elapsedMs / 1000)}`}  ${timeLeftStr}  ${currSpeed}`}
                    </div>
                  </div>

                  {/* Git Bash Terminal Download Output */}
                  <div className="space-y-2 border-t border-white/5 pt-3">
                    <div className={`font-semibold flex flex-col sm:flex-row sm:items-center justify-between gap-1 ${textAccentClass}`}>
                      <span className="tracking-tight text-[10px] xs:text-xs">
                        Downloading Airban Avionics: [ {bar} ] {bootProgress}%
                      </span>
                      <span className="text-[9px] xs:text-[10px] text-[#abb2bf] font-mono">
                        {((bootProgress / 100) * 4.13).toFixed(2)} MB / 4.13 MB @ {bootProgress < 100 ? `${(1.8 + Math.random() * 0.4).toFixed(1)} MB/s` : "0 B/s"}
                      </span>
                    </div>

                    {/* Step log descriptor */}
                    <div className="flex items-center gap-2 text-[#56b6c2] text-[9.5px] xs:text-[11px] md:text-sm">
                      <span className="animate-ping text-[#ff605c] text-[8px]">●</span>
                      <span className="font-mono text-white/90">{getBootLogMessage(bootProgress)}</span>
                    </div>
                  </div>
                </div>

                {/* Hotkeys / Skip button terminal style footer */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-[#5c6370]">
                  <div className="flex items-center gap-2">
                    <span className="bg-white/5 px-1.5 py-0.5 rounded text-[#ff605c] font-semibold">Ctrl+C</span>
                    <span>or</span>
                    <span className="bg-white/5 px-1.5 py-0.5 rounded text-[#ffbd2e] font-semibold">ESC</span>
                    <span>to bypass system loading</span>
                  </div>
                  <button
                    onClick={() => setBooting(false)}
                    onMouseEnter={() => setIsSkipHovered(true)}
                    onMouseLeave={() => setIsSkipHovered(false)}
                    className="px-3.5 py-1.5 rounded bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 transition-all text-[9px] uppercase font-mono tracking-wider font-bold"
                    style={{
                      borderColor: isSkipHovered ? `${getAccentHex(accentColor)}4d` : undefined,
                      color: isSkipHovered ? getAccentHex(accentColor) : "#fff",
                    }}
                  >
                    Skip Terminal [ ▶ ]
                  </button>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. PRIMARY SIDEBAR: Custom Left-Side Navigation Avionics (Desktop) */}
      <div
        className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center py-7 px-3 rounded-full border bg-[#080D1F]/85 backdrop-blur-[20px] transition-all shadow-[0_12px_32px_rgba(5,8,22,0.9)]"
        style={{
          borderColor: getAccentRgba(accentColor, 0.15),
          borderWidth: "1px",
        }}
      >
        {/* Top sidebar element: Miniature Brand Logo Link */}
        <div
          onClick={() => {
            playClickSound("synth");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="cursor-pointer mb-6 group relative p-1.5 rounded-full border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all"
          title="Scroll to Top"
        >
          <Logo size={24} showText={false} accentColor={accentColor} />
          {/* Subtle neon ring indicator */}
          <div
            className="absolute inset-0 rounded-full border border-transparent group-hover:border-current animate-pulse opacity-50"
            style={{ color: getAccentHex(accentColor) }}
          />
        </div>

        {/* Navigation Core */}
        <nav className="flex flex-col items-center gap-4">
          {[
            { label: "Home", href: "#home", icon: Home },
            { label: "About", href: "#about", icon: Info },
            { label: "Projects", href: "#projects", icon: Layers },
            { label: "Services", href: "#services", icon: Cpu },
            { label: "Contact", href: "#transmit", icon: Send },
          ].map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className="relative group flex items-center justify-center"
              >
                <a
                  href={item.href}
                  onClick={() => playClickSound("click")}
                  className="w-10 h-10 rounded-full flex items-center justify-center border border-white/5 bg-white/[0.01] text-[#8A9BC4] hover:text-white hover:bg-white/5 hover:scale-105 transition-all cursor-pointer relative"
                >
                  <IconComponent className="w-4 h-4 transition-transform group-hover:scale-110" />

                  {/* Subtle active state indicators */}
                  <div
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                    style={{
                      backgroundColor: getAccentHex(accentColor),
                    }}
                  />
                </a>

                {/* Cyberpunk Tooltip slide-out */}
                <div
                  className="absolute left-14 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 origin-left border border-white/10 bg-[#080D1F] px-3.5 py-1.5 rounded-md text-[9px] font-bold font-mono tracking-widest uppercase shadow-xl whitespace-nowrap"
                  style={{
                    borderColor: getAccentRgba(accentColor, 0.3),
                    color: getAccentHex(accentColor),
                  }}
                >
                  &gt;_ {item.label}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Bottom Elements: Quick Download CV Mini link */}
        <div className="mt-6 pt-5 border-t border-white/5 flex flex-col gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              playClickSound("success");
              setShowCVModal(true);
            }}
            className="w-9 h-9 rounded-full flex items-center justify-center border transition-all cursor-pointer"
            style={{
              borderColor: getAccentRgba(accentColor, 0.35),
              color: getAccentHex(accentColor),
              backgroundColor: "rgba(8, 13, 31, 0.6)",
            }}
            title="Download CV"
          >
            <Download className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>

      {/* 2. UNIFIED CORNER DECK: Consolidated Global Avionics (MetaMask + Customizer + Ambient Sound) */}
      <div
        className="fixed top-6 right-6 z-50 flex items-center gap-2 p-1.5 rounded-full border bg-[#080D1F]/85 backdrop-blur-[20px] transition-all shadow-[0_12px_32px_rgba(5,8,22,0.9)]"
        style={{
          borderColor: getAccentRgba(accentColor, 0.15),
          borderWidth: "1px",
        }}
      >
        {/* MetaMask Wallet Link */}
        <button
          id="connect-metamask-btn"
          onClick={walletAddress ? disconnectMetaMask : connectMetaMask}
          disabled={connectingWallet}
          className={`hidden md:flex items-center justify-center h-9 w-9 rounded-full transition-all border cursor-pointer ${
            walletAddress
              ? ""
              : "border-white/5 text-[#8A9BC4] hover:text-white hover:bg-white/5"
          }`}
          style={{
            borderColor: walletAddress ? `${getAccentHex(accentColor)}4d` : "rgba(255,255,255,0.05)",
            backgroundColor: walletAddress ? `${getAccentHex(accentColor)}1a` : undefined,
            color: walletAddress ? getAccentHex(accentColor) : undefined,
          }}
          title={
            walletAddress
              ? `WalletLinked: ${walletAddress.slice(0, 6)}...`
              : "Link Web3 Wallet"
          }
        >
          <Wallet
            className={`w-3.5 h-3.5 ${connectingWallet ? "animate-spin" : ""}`}
          />
        </button>

        {/* System Customize triggers */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            playClickSound("click");
            setShowConfig(!showConfig);
          }}
          className="hidden md:flex items-center justify-center h-9 w-9 rounded-full border border-white/5 text-[#8A9BC4] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          title="System Customize Avionics"
        >
          <Settings
            className={`w-3.5 h-3.5 ${showConfig ? "rotate-45" : ""} transition-transform`}
          />
        </motion.button>

        {/* Global ambient audio toggle control */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            toggleMute();
            if (isMuted) {
              setTimeout(() => playClickSound("synth"), 50);
            } else {
              playClickSound("click");
            }
          }}
          className="hidden md:flex items-center justify-center h-9 w-9 rounded-full border border-white/5 text-[#8A9BC4] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          title={isMuted ? "Unmute Background Audio" : "Mute Background Audio"}
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5" />
          ) : (
            <Volume2
              className="w-3.5 h-3.5 animate-pulse"
              style={{ color: getAccentHex(accentColor) }}
            />
          )}
        </motion.button>
      </div>

      {/* Wallet Error Alert Banner overlay */}
      <AnimatePresence>
        {walletError && (
          <div className="fixed top-20 right-6 z-50 flex flex-col items-end pointer-events-none max-w-sm w-full">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="px-4 py-3 bg-red-950/90 border border-red-500/40 rounded-lg text-red-500 text-[10px] font-mono pointer-events-auto shadow-lg flex items-center gap-2 w-full"
            >
              <Shield className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <div className="flex-1 text-left">
                <span className="font-bold uppercase tracking-wider block text-[8px] text-red-500">
                  // WALLET CONNECTION ERROR
                </span>
                <span id="wallet-error-msg" className="font-semibold block">
                  {walletError}
                </span>
              </div>
              <button
                onClick={() => setWalletError("")}
                className="text-red-400 hover:text-white font-black text-xs cursor-pointer px-1"
                aria-label="Dismiss error"
              >
                ×
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REAL-TIME DYNAMIC SYSTEM TELEMETRY DOCK & SCROLL PROGRESS DOCK BAR */}
      <ScrollProgressHUD accentColor={accentColor} />
      <MobileFastScroller
        accentColor={accentColor}
        onSettingsClick={() => setShowConfig(true)}
      />

      {/* MODULAR SECTIONS 1 to 4 (AND 5 & 8 SYSTEMS) */}
      <HeroSection
        accentColor={accentColor}
        videoUrl={videoUrl}
        heroBgVideoUrl={heroBgVideoUrl}
        availabilityStatus={availability.status}
        isMuted={isMuted}
        onDownloadCVClick={() => setShowCVModal(true)}
        isBooting={booting}
      />

      <CompanyMarquee accentColor={accentColor} />

      <SectionDivider
        label="NARRATIVE DECK"
        sourceSector="SEC_000"
        targetSector="SEC_001"
        accentColor={accentColor}
      />
      <AboutSection accentColor={accentColor} />

      <SectionDivider
        label="SKILLS BLUEPRINT"
        sourceSector="SEC_001"
        targetSector="SEC_003"
        accentColor={accentColor}
      />
      <SkillsSection accentColor={accentColor} />

      <SectionDivider
        label="PROJECTS BENTO"
        sourceSector="SEC_003"
        targetSector="SEC_004"
        accentColor={accentColor}
      />
      <ProjectsSection accentColor={accentColor} dbProjects={dbProjects} />

      <SectionDivider
        label="CHRONICLES INDEX"
        sourceSector="SEC_004"
        targetSector="SEC_002"
        accentColor={accentColor}
      />
      <WorkExperienceSection accentColor={accentColor} />

      <SectionDivider
        label="SERVICES GRAPH"
        sourceSector="SEC_002"
        targetSector="SEC_005"
        accentColor={accentColor}
      />
      <ServicesSection accentColor={accentColor} />

      <SectionDivider
        label="SYSTEM CREDENTIALS"
        sourceSector="SEC_005"
        targetSector="SEC_006"
        accentColor={accentColor}
      />
      <CertificationsSection accentColor={accentColor} />

      <SectionDivider
        label="FEEDBACK RECORDS"
        sourceSector="SEC_006"
        targetSector="SEC_007"
        accentColor={accentColor}
      />
      <TestimonialsSection
        accentColor={accentColor}
        dbTestimonials={dbTestimonials}
      />

      <SectionDivider
        label="CONTACT COCKPIT"
        sourceSector="SEC_007"
        targetSector="SEC_008"
        accentColor={accentColor}
      />
      <ContactSection accentColor={accentColor} />

      {/* DYNAMIC SYSTEM CONFIG / AVIONICS OVERLAY DRAWER */}
      <AnimatePresence>
        {showConfig && (
          <motion.div
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-[9999] flex justify-end cursor-default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0"
              onClick={() => setShowConfig(false)}
            />

            <motion.div
              className="relative w-full max-w-sm bg-[#080D1F] border-l border-white/10 h-full p-6 overflow-y-auto flex flex-col justify-between text-left"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
            >
              <div className="space-y-6">
                {/* Embedded branded dynamic vector logo showcase from uploaded asset */}
                <div className="flex justify-center py-6 border-b border-white/5 mb-2">
                  <Logo size={90} showText={true} accentColor={accentColor} />
                </div>

                <div className="flex items-center justify-between border-b border-white/5 pb-4 font-mono">
                  <div className="flex items-center gap-2">
                    <Sliders
                      className="w-4 h-4"
                      style={{ color: getAccentHex(accentColor) }}
                    />
                    <h3 className="font-extrabold tracking-tight text-white text-xs uppercase">
                      Interface Preferences
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowConfig(false)}
                    className="text-white hover:text-red-400 text-[10px] uppercase cursor-pointer font-bold font-mono"
                  >
                    Close [X]
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-[10px] leading-relaxed text-[#8A9BC4] font-mono">
                  Customize the visual environments of this interactive
                  portfolio. Change accents, ambient space
                  {/* Dynamic Comprehensive Presets Selection */}
                  <div className="space-y-2.5 font-mono border-t border-white/10 pt-4 mt-4">
                    <label className="block text-[8px] tracking-widest text-[#8A9BC4] uppercase font-bold mb-1.5">
                      Dynamic Theme Presets Profile
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => applyThemeProfile("matrix-crypt")}
                        onMouseEnter={() => playClickSound("hover")}
                        className={`p-2 rounded border text-left cursor-pointer transition-all ${activeThemeProfile === "matrix-crypt" ? "border-[#39FF14] bg-[#39FF14]/5 text-white animate-pulse" : "border-white/5 bg-white/[0.01] text-slate-400"}`}
                      >
                        <span className="block text-[6px] text-slate-500 mb-0.5 font-mono">
                          PROFILE 01
                        </span>
                        <span className="text-[9px] font-bold block">
                          Matrix Crypt
                        </span>
                      </button>

                      <button
                        onClick={() => applyThemeProfile("electric-subway")}
                        onMouseEnter={() => playClickSound("hover")}
                        className={`p-2 rounded border text-left cursor-pointer transition-all ${activeThemeProfile === "electric-subway" ? "border-[#00D4FF] bg-[#00D4FF]/5 text-white animate-pulse" : "border-white/5 bg-white/[0.01] text-slate-400"}`}
                      >
                        <span className="block text-[6px] text-slate-500 mb-0.5 font-mono">
                          PROFILE 02
                        </span>
                        <span className="text-[10px] font-bold block">
                          Cyber Subway
                        </span>
                      </button>

                      <button
                        onClick={() => applyThemeProfile("cyber-hologram")}
                        onMouseEnter={() => playClickSound("hover")}
                        className={`p-2 rounded border text-left cursor-pointer transition-all ${activeThemeProfile === "cyber-hologram" ? "border-[#00D4FF] bg-[#00D4FF]/5 text-white animate-pulse" : "border-white/5 bg-white/[0.01] text-slate-400"}`}
                      >
                        <span className="block text-[7px] text-slate-500 mb-0.5 font-mono">
                          PROFILE 03
                        </span>
                        <span className="text-[9px] font-bold block">
                          Hybrid Hologram
                        </span>
                      </button>

                      <button
                        onClick={() => applyThemeProfile("quantum-stealth")}
                        onMouseEnter={() => playClickSound("hover")}
                        className={`p-2 rounded border text-left cursor-pointer transition-all ${activeThemeProfile === "quantum-stealth" ? "border-[#39FF14] bg-[#39FF14]/5 text-[#39FF14] animate-pulse" : "border-white/5 bg-white/[0.01] text-slate-400"}`}
                      >
                        <span className="block text-[7px] text-slate-500 mb-0.5 font-mono">
                          PROFILE 04
                        </span>
                        <span className="text-[9px] font-bold block">
                          Quantum Void
                        </span>
                      </button>
                    </div>
                  </div>
                  , or avatar loops below.
                </div>

                {/* Primary Accent Selection */}
                <div className="space-y-2.5 font-mono">
                  <label className="block text-[8px] tracking-widest text-[#8A9BC4] uppercase font-bold">
                    Primary Accent Color
                  </label>

                  <div className="grid grid-cols-5 gap-1.5 font-mono">
                    <button
                      onClick={() => setAccentColor("green")}
                      className={`py-2.5 px-0.5 rounded-lg border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${accentColor === "green" ? "border-[#39FF14] bg-[#39FF14]/5 text-white shadow-[0_0_8px_rgba(57,255,20,0.2)]" : "border-white/5 bg-white/[0.01] text-slate-400 hover:text-white"}`}
                      title="Neon Green"
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-[#39FF14] shadow-[0_0_8px_#39FF14]" />
                      <span className="text-[7.5px] font-black uppercase tracking-wider">Green</span>
                    </button>

                    <button
                      onClick={() => setAccentColor("cyan")}
                      className={`py-2.5 px-0.5 rounded-lg border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${accentColor === "cyan" ? "border-[#00D4FF] bg-[#00D4FF]/5 text-white shadow-[0_0_8px_rgba(0,212,255,0.2)]" : "border-white/5 bg-white/[0.01] text-slate-400 hover:text-white"}`}
                      title="Electric Cyan"
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00D4FF] shadow-[0_0_8px_#00D4FF]" />
                      <span className="text-[7.5px] font-black uppercase tracking-wider">Cyan</span>
                    </button>

                    <button
                      onClick={() => setAccentColor("pink")}
                      className={`py-2.5 px-0.5 rounded-lg border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${accentColor === "pink" ? "border-[#FF007F] bg-[#FF007F]/5 text-white shadow-[0_0_8px_rgba(255,0,127,0.2)]" : "border-white/5 bg-white/[0.01] text-slate-400 hover:text-white"}`}
                      title="Neon Pink"
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF007F] shadow-[0_0_8px_#FF007F]" />
                      <span className="text-[7.5px] font-black uppercase tracking-wider">Pink</span>
                    </button>

                    <button
                      onClick={() => setAccentColor("purple")}
                      className={`py-2.5 px-0.5 rounded-lg border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${accentColor === "purple" ? "border-[#BD00FF] bg-[#BD00FF]/5 text-white shadow-[0_0_8px_rgba(189,0,255,0.2)]" : "border-white/5 bg-white/[0.01] text-slate-400 hover:text-white"}`}
                      title="Electric Purple"
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-[#BD00FF] shadow-[0_0_8px_#BD00FF]" />
                      <span className="text-[7.5px] font-black uppercase tracking-wider">Purple</span>
                    </button>

                    <button
                      onClick={() => setAccentColor("yellow")}
                      className={`py-2.5 px-0.5 rounded-lg border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${accentColor === "yellow" ? "border-[#FFE600] bg-[#FFE600]/5 text-white shadow-[0_0_8px_rgba(255,230,0,0.2)]" : "border-white/5 bg-white/[0.01] text-slate-400 hover:text-white"}`}
                      title="Cyber Yellow"
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FFE600] shadow-[0_0_8px_#FFE600]" />
                      <span className="text-[7.5px] font-black uppercase tracking-wider">Yellow</span>
                    </button>
                  </div>
                </div>

                {/* Hologram Presets */}
                <div className="space-y-2.5 font-mono">
                  <label className="block text-[8px] tracking-widest text-[#8A9BC4] uppercase font-bold">
                    Avatar Visual Presets
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() =>
                        selectPresetVideo(
                          "https://assets.mixkit.co/videos/preview/mixkit-futuristic-subway-station-with-blue-neon-lights-42284-large.mp4",
                          "neon",
                        )
                      }
                      className={`p-3 rounded-lg border text-left text-[11px] font-bold transition-all cursor-pointer ${activePreset === "neon" ? "border-[#39FF14] bg-[#39FF14]/5 text-white" : "border-white/5 hover:border-white/10 text-[#8A9BC4]"}`}
                    >
                      <span className="block text-[7px] text-slate-500 mb-1">
                        01 // SCI-FI
                      </span>
                      Futurist Station
                    </button>

                    <button
                      onClick={() =>
                        selectPresetVideo(
                          "https://assets.mixkit.co/videos/preview/mixkit-matrix-style-code-screen-background-34289-large.mp4",
                          "code",
                        )
                      }
                      className={`p-3 rounded-lg border text-left text-[11px] font-bold transition-all cursor-pointer ${activePreset === "code" ? "border-[#39FF14] bg-[#39FF14]/5 text-white" : "border-white/5 hover:border-white/10 text-[#8A9BC4]"}`}
                    >
                      <span className="block text-[7px] text-slate-500 mb-1">
                        02 // DIGITAL
                      </span>
                      Matrix Stream
                    </button>
                  </div>

                  <button
                    onClick={handleClearVideo}
                    className="w-full text-center py-2 border border-white/5 hover:border-white/10 hover:bg-white/5 text-slate-400 rounded-lg text-[9px] uppercase font-bold transition-all cursor-pointer"
                  >
                    Reset Visual Avatar
                  </button>
                </div>

                {/* Environment backdrop loop presets */}
                <div className="space-y-3 pt-4 border-t border-white/5 font-mono">
                  <span className="block text-[8px] tracking-widest text-[#8A9BC4] uppercase font-bold">
                    Hero Environment Loop
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() =>
                        selectPresetBgVideo(
                          "https://res.cloudinary.com/ikonicity-airban/video/upload/f_auto,q_auto/v1781709867/vecteezy_neon-city-ai-generated-ai-generative_31698896_w8zwsf_1_bdio5w.mp4",
                        )
                      }
                      title="Optimized Neon City HD loop"
                      className={`py-2 px-1 rounded-lg border text-center text-[9px] font-bold transition-all cursor-pointer ${heroBgVideoUrl === "https://res.cloudinary.com/ikonicity-airban/video/upload/f_auto,q_auto/v1781709867/vecteezy_neon-city-ai-generated-ai-generative_31698896_w8zwsf_1_bdio5w.mp4" ? "border-[#39FF14] bg-[#39FF14]/5 text-white" : "border-white/5 hover:border-white/10 text-[#8A9BC4]"}`}
                    >
                      Neon City
                    </button>
                    <button
                      onClick={() =>
                        selectPresetBgVideo(
                          "https://res.cloudinary.com/ikonicity-airban/video/upload/f_auto,q_auto/v1781709863/vecteezy_abstract-cyberpunk-animated-background_4846470_do0h7u_p8etxb.mp4",
                        )
                      }
                      title="Optimized Cyberpunk Animated loop"
                      className={`py-2 px-1 rounded-lg border text-center text-[9px] font-bold transition-all cursor-pointer ${heroBgVideoUrl === "https://res.cloudinary.com/ikonicity-airban/video/upload/f_auto,q_auto/v1781709863/vecteezy_abstract-cyberpunk-animated-background_4846470_do0h7u_p8etxb.mp4" ? "border-[#39FF14] bg-[#39FF14]/5 text-white" : "border-white/5 hover:border-white/10 text-[#8A9BC4]"}`}
                    >
                      Cyber Loop
                    </button>
                    <button
                      onClick={() =>
                        selectPresetBgVideo(
                          "https://res.cloudinary.com/demo/video/upload/q_auto,vc_h264/docs/ambient_video.mp4",
                        )
                      }
                      title="Neon Waves Loop (Lightweight CDN)"
                      className={`py-2 px-1 rounded-lg border text-center text-[9px] font-bold transition-all cursor-pointer ${heroBgVideoUrl === "https://res.cloudinary.com/demo/video/upload/q_auto,vc_h264/docs/ambient_video.mp4" ? "border-[#39FF14] bg-[#39FF14]/5 text-white" : "border-white/5 hover:border-white/10 text-[#8A9BC4]"}`}
                    >
                      Neon Waves
                    </button>
                  </div>

                  {/* Custom Backdrop Input form */}
                  <form onSubmit={handleSaveBgVideoUrl} className="space-y-1.5 pt-1.5 border-t border-white/5">
                    <label className="block text-[7.5px] tracking-wider text-[#8A9BC4]/70 uppercase font-black">
                      // CUSTOM DIRECT MP4 URL
                    </label>
                    <div className="flex gap-1">
                      <input
                        type="text"
                        placeholder="Paste direct MP4 or Cloudinary asset link..."
                        value={inputBgUrl}
                        onChange={(e) => setInputBgUrl(e.target.value)}
                        className="flex-1 bg-[#050816] border border-white/10 rounded px-2 py-1 text-[9px] font-mono text-white outline-none focus:border-[#39FF14]/40"
                      />
                      <button
                        type="submit"
                        className="px-2.5 bg-[#39FF14] hover:bg-[#32e012] text-[#050816] rounded font-bold text-[9px] uppercase tracking-wider transition-all duration-150 cursor-pointer"
                      >
                        Set
                      </button>
                    </div>
                  </form>

                  <button
                    onClick={handleClearBgVideo}
                    className="w-full text-center py-2 border border-white/5 hover:border-white/10 text-[#8A9BC4] hover:bg-white/5 rounded-lg text-[9px] uppercase transition-all cursor-pointer font-bold"
                  >
                    Reset Ambient Background
                  </button>
                </div>

                {/* Mute toggle configuration and status indicator */}
                <div className="space-y-2 pt-4 border-t border-white/5 font-mono">
                  <span className="block text-[8px] tracking-widest text-[#8A9BC4] uppercase font-bold">
                    Ambient Audio Loop
                  </span>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.01] border border-white/5">
                    <div className="flex flex-col text-[10px]">
                      <span className="font-bold text-white uppercase">
                        Atmospheric Synth
                      </span>
                      <span className="text-[8px] text-[#8A9BC4]">
                        {isMuted ? "MUTED // SILENT" : "PLAYING // LOOP"}
                      </span>
                    </div>

                    <button
                      onClick={toggleMute}
                      className={`px-3 py-1.5 rounded text-[9px] font-bold uppercase cursor-pointer transition-all ${isMuted ? "bg-[#39FF14]/10 border border-[#39FF14]/10 text-[#39FF14]" : "bg-white/5 text-slate-300"}`}
                    >
                      {isMuted ? "Unmute" : "Mute"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 text-[9px] text-[#8A9BC4] font-mono mt-auto pt-4 flex justify-between items-center">
                <span>DISPLAY_DYNAMICS</span>
                <span>SYSTEM OS V4.2</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <FooterSection
        accentColor={accentColor}
        onOpenAdmin={() => setShowAdmin(true)}
        availabilityStatus={availability.status}
      />

      {/* CURRICULUM VITAE MODAL */}
      <CVModal
        isOpen={showCVModal}
        onClose={() => setShowCVModal(false)}
        accentColor={accentColor}
      />

      {/* SECURE ADMINISTRATOR PORTAL OVERLAY */}
      <AnimatePresence>
        {showAdmin && (
          <div className="fixed inset-0 z-[9999] overflow-y-auto">
            <AdminSection
              accentColor={accentColor}
              onClose={() => setShowAdmin(false)}
            />
          </div>
        )}
      </AnimatePresence>

      {/* PERSISTENT FLOATING WHATSAPP CHAT BUTTON */}
      <AnimatePresence>
        {showWhatsApp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed z-50 pointer-events-auto"
            style={{ bottom: "1rem", right: "1rem" }}
          >
            <a
              href="https://wa.me/2348169862852?text=Hello%20Eban!%20I%20saw%20your%20portfolio..."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 bg-[#25D366] hover:bg-[#20ba56] text-white rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.45)] transition-all duration-300 transform hover:scale-110 cursor-pointer"
              title="Chat on WhatsApp"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 fill-current text-white"
              >
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.1 1.45 4.7 1.45 5.2 0 9.4-4.2 9.4-9.4 0-2.5-1-4.9-2.8-6.7-1.8-1.8-4.1-2.8-6.6-2.8-5.2 0-9.4 4.2-9.4 9.4 0 1.8.5 3.5 1.4 5l-.4 1.5.4-.4.1.2zm10.1-6.1c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.8.9-.1.2-.3.2-.5.1-.7-.3-1.4-.7-2-1.2-.5-.5-.9-1.1-1-1.3-.1-.2 0-.3.1-.4.1-.1.2-.2.3-.3.1-.1.1-.2.2-.3 0-.1 0-.2-.1-.3-.1-.3-.5-1.3-.7-1.8-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.1 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.4-.6 1.6-1.1.2-.5.2-.9.1-1-.1-.1-.3-.2-.6-.3z" />
              </svg>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* THEME SWITCH SCI-FI SCAN CALIBRATION SCREEN OVERLAY */}
      <AnimatePresence>
        {themeSwitchingName && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050816]/95 backdrop-blur-md select-none pointer-events-auto"
          >
            {/* Horizontal scanline sweeper line */}
            <motion.div
              initial={{ top: "0%" }}
              animate={{ top: "100%" }}
              transition={{ duration: 1.1, ease: "linear", repeat: Infinity }}
              className="absolute left-0 w-full h-[3px] opacity-80"
              style={{
                background: `linear-gradient(90deg, transparent, ${getAccentHex(accentColor)}, transparent)`,
                boxShadow: `0 0 15px ${getAccentHex(accentColor)}`,
              }}
            />

            {/* Grid background overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)] pointer-events-none" />

            <div className="text-center space-y-6 max-w-sm px-6 relative z-10 font-mono">
              <div className="flex items-center justify-center">
                <div
                  className="w-16 h-16 border-2 border-dashed rounded-full flex items-center justify-center animate-[spin_8s_linear_infinite]"
                  style={{
                    borderColor: getAccentRgba(accentColor, 0.3),
                  }}
                >
                  <div
                    className="w-10 h-10 border rounded-full flex items-center justify-center animate-ping"
                    style={{
                      borderColor: getAccentHex(accentColor),
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <span className="block text-[8px] text-[#8A9BC4] uppercase tracking-[0.25em] font-extrabold animate-pulse">
                  // PORTAL CONFIG LOCK CALIBRATING...
                </span>
                <h2
                  className="text-lg md:text-xl font-bold tracking-widest uppercase font-display"
                  style={{
                    color: getAccentHex(accentColor),
                    textShadow: `0 0 12px ${getAccentRgba(accentColor, 0.45)}`,
                  }}
                >
                  {themeSwitchingName}
                </h2>
                <div className="text-[9px] text-[#8A9BC4] space-y-1 pt-2">
                  <p className="font-bold flex items-center justify-center gap-1.5 text-white">
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-ping"
                      style={{
                        backgroundColor: getAccentHex(accentColor),
                      }}
                    />
                    RE-ROUTING NEON ENERGY NODES...
                  </p>
                  <p className="text-[7.5px] text-slate-500 uppercase tracking-wide">
                    SECURE_JWT: OK · MATRIX_BUFFER: COMMITTED · SYS_THEME:
                    APPLIED
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
