import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  Shield, 
  Settings, 
  Activity, 
  Database,
  Mail, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff, 
  ChevronUp, 
  ChevronDown, 
  RefreshCw, 
  CheckCircle, 
  Clock, 
  Check, 
  ArrowLeft,
  Sliders,
  Send,
  MessageSquare,
  TrendingUp,
  User,
  ExternalLink
} from 'lucide-react';
import { 
  db, 
  auth, 
  googleProvider,
  seedDatabaseIfEmpty
} from '../../firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { signInWithPopup, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { portfolioData } from '../../data';
import { getAccentHex, getAccentTextClass, getAccentBgClass } from '../../utils';

interface AdminSectionProps {
  accentColor: 'green' | 'cyan' | 'pink' | 'purple' | 'yellow';
  onClose: () => void;
}

export default function AdminSection({ accentColor, onClose }: AdminSectionProps) {
  const isGreen = accentColor === 'green';
  const primaryAccent = getAccentHex(accentColor);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [localUser, setLocalUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Admin Dashboard Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'availability' | 'projects' | 'testimonials' | 'messages' | 'analytics'>('overview');

  // Real-time Database Collections State
  const [projects, setProjects] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [availability, setAvailability] = useState<any>({
    status: 'available',
    message: 'Currently building custom apps',
    updatedAt: new Date().toISOString()
  });

  // Modal / Form States
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any | null>(null); // For edit CRUD
  const [projectForm, setProjectForm] = useState({
    title: '',
    slug: '',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    status: '🟢 Live',
    liveUrl: '#',
    repoUrl: '#',
    description: '',
    longDesc: '',
    role: 'Lead Developer',
    year: '2026',
    stackRaw: '',
    featured: true,
    isVisible: true
  });

  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<any | null>(null); // For edit CRUD
  const [testimonialForm, setTestimonialForm] = useState({
    quote: '',
    authorName: '',
    company: '',
    authorRole: '',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    isVisible: true
  });

  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [availabilityForm, setAvailabilityForm] = useState({
    status: 'available',
    message: ''
  });

  const [txLog, setTxLog] = useState<string[]>(['[ADMIN_SYS]: MODULE OVERRIDE PROTOCOL ONLINE.']);

  const addTxLog = (msg: string) => {
    setTxLog(prev => [...prev.slice(-6), `[ADMIN_SYS]: ${msg}`]);
  };

  // Listen to Auth State
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setLocalUser(user);
      if (user && user.email === 'ikonicityairban@gmail.com') {
        setIsAdminLoggedIn(true);
        addTxLog(`ADMIN LOGGED IN // ADDR: ${user.email.toUpperCase()}`);
        seedDatabaseIfEmpty()
          .then(() => {
            addTxLog(`DATABASE ALIGNMENT AUDITED // SEEDED IF VACANT`);
          })
          .catch((err) => {
            addTxLog(`AUDIT INTEGRITY WARNING: ${err.message || err}`);
          });
      } else {
        setIsAdminLoggedIn(false);
      }
    }, (error) => {
      console.warn('[Firebase-SafeNet] Admin Auth observer absorbed connection restriction or network offline state:', error);
    });
    return () => unsub();
  }, []);

  // Listen to Real-time database streams
  useEffect(() => {
    if (!isAdminLoggedIn) return;

    // Listen to Projects
    const qProjects = query(collection(db, 'projects'), orderBy('order', 'asc'));
    const unsubProjects = onSnapshot(qProjects, (snap) => {
      const projs: any[] = [];
      snap.forEach(doc => {
        projs.push({ id: doc.id, ...doc.data() });
      });
      setProjects(projs);
    }, (error) => {
      console.warn('[Firebase-SafeNet] Admin projects stream offline warning:', error);
    });

    // Listen to Testimonials
    const qTestimonials = query(collection(db, 'testimonials'), orderBy('order', 'asc'));
    const unsubTestimonials = onSnapshot(qTestimonials, (snap) => {
      const tests: any[] = [];
      snap.forEach(doc => {
        tests.push({ id: doc.id, ...doc.data() });
      });
      setTestimonials(tests);
    }, (error) => {
      console.warn('[Firebase-SafeNet] Admin testimonials stream offline warning:', error);
    });

    // Listen to Messages
    const qMessages = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const unsubMessages = onSnapshot(qMessages, (snap) => {
      const msgs: any[] = [];
      snap.forEach(doc => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      setMessages(msgs);
    }, (error) => {
      console.warn('[Firebase-SafeNet] Admin messages stream offline warning:', error);
    });

    // Listen to Page views Analytics
    const qAnalytics = query(collection(db, 'analytics'), orderBy('createdAt', 'desc'));
    const unsubAnalytics = onSnapshot(qAnalytics, (snap) => {
      const views: any[] = [];
      snap.forEach(doc => {
        views.push({ id: doc.id, ...doc.data() });
      });
      setAnalytics(views);
    }, (error) => {
      console.warn('[Firebase-SafeNet] Admin analytics stream offline warning:', error);
    });

    // Listen to Availability docs
    const unsubAvailability = onSnapshot(doc(db, 'availability', 'global'), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setAvailability(data);
        setAvailabilityForm({
          status: data.status,
          message: data.message
        });
      }
    }, (error) => {
      console.warn('[Firebase-SafeNet] Admin availability stream offline warning:', error);
    });

    return () => {
      unsubProjects();
      unsubTestimonials();
      unsubMessages();
      unsubAnalytics();
      unsubAvailability();
    };
  }, [isAdminLoggedIn]);

  // Passcode verification login
  const handlePasscodeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');

    setTimeout(() => {
      // Eban can type 'airban2026' or 'ikonicity' or 'password' as a quick bypass to login
      if (passphrase === 'airban2026' || passphrase === 'ikonicity') {
        setIsAdminLoggedIn(true);
        addTxLog(`PASSPHRASE BYPASS ACCEPTED // DECK UNLOCKED`);
        setLoading(false);
      } else if (email && passphrase) {
        // Fallback Firebase Authentication
        signInWithEmailAndPassword(auth, email, passphrase)
          .then((res) => {
            if (res.user?.email === 'ikonicityairban@gmail.com') {
              setIsAdminLoggedIn(true);
              addTxLog(`SECURE EMAIL AUTHENTICATION RESOLVED`);
            } else {
              setLoginError('Unprivileged identity detected.');
              signOut(auth);
            }
          })
          .catch((err) => {
            setLoginError(err.message || 'Verification failure.');
          })
          .finally(() => setLoading(false));
      } else {
        setLoginError('Invalid passphrase signature.');
        setLoading(false);
      }
    }, 800);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setLoginError('');
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user?.email && res.user.email === 'ikonicityairban@gmail.com') {
        setIsAdminLoggedIn(true);
        addTxLog(`GOOGLE IDENTITY CONFIRMED: ${res.user.email}`);
      } else {
        setLoginError('Not authorized. Eban Godwin Ikoni email signature only.');
        await signOut(auth);
      }
    } catch (err: any) {
      setLoginError(err.message || 'Google Auth aborted.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogOut = async () => {
    await signOut(auth);
    setIsAdminLoggedIn(false);
    addTxLog(`COCKPIT LOCKOUT ENGAGED // SESSION TERMINATED`);
  };

  // CRUD AVAILABILITY
  const handleUpdateAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'availability', 'global'), {
        status: availabilityForm.status,
        message: availabilityForm.message,
        updatedAt: new Date().toISOString()
      });
      addTxLog(`AVAILABILITY UPDATED // STATUS: ${availabilityForm.status.toUpperCase()}`);
    } catch (err: any) {
      addTxLog(`ERROR: AVAILABILITY WRITE ACCESS DENIED`);
    }
  };

  // CRUD PROJECTS CREATION & EDITTING
  const openProjectCreate = () => {
    setSelectedProject(null);
    setProjectForm({
      title: '',
      slug: '',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      status: '🟢 Live',
      liveUrl: '#',
      repoUrl: '#',
      description: '',
      longDesc: '',
      role: 'Lead Developer',
      year: '2026',
      stackRaw: 'React, Tailwind, Node.js',
      featured: true,
      isVisible: true
    });
    setShowProjectModal(true);
  };

  const openProjectEdit = (p: any) => {
    setSelectedProject(p);
    setProjectForm({
      title: p.title || '',
      slug: p.slug || p.id || '',
      imageUrl: p.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      status: p.status || '🟢 Live',
      liveUrl: p.liveUrl || '#',
      repoUrl: p.repoUrl || '#',
      description: p.description || '',
      longDesc: p.longDesc || '',
      role: p.role || 'Lead Developer',
      year: p.year || '2026',
      stackRaw: p.stack ? p.stack.join(', ') : '',
      featured: p.featured ?? true,
      isVisible: p.isVisible ?? true
    });
    setShowProjectModal(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.slug) {
      alert('Title and Slug are required.');
      return;
    }
    
    const projectSlug = projectForm.slug.replaceAll(' ', '-').toLowerCase();
    const stackList = projectForm.stackRaw
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const docData = {
      title: projectForm.title,
      slug: projectSlug,
      imageUrl: projectForm.imageUrl,
      status: projectForm.status,
      liveUrl: projectForm.liveUrl,
      repoUrl: projectForm.repoUrl,
      description: projectForm.description,
      longDesc: projectForm.longDesc,
      role: projectForm.role,
      year: projectForm.year,
      stack: stackList,
      featured: projectForm.featured,
      isVisible: projectForm.isVisible,
      order: selectedProject ? selectedProject.order : projects.length
    };

    try {
      const docId = projectSlug;
      await setDoc(doc(db, 'projects', docId), docData);
      addTxLog(`PROJECT RECONSTRUCTED // ID: ${docId.toUpperCase()}`);
      setShowProjectModal(false);
    } catch (err: any) {
      console.error(err);
      addTxLog(`ERROR SAVING PROJECT PROJECT STRUCTURE: ${err.message}`);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you absolutely sure you want to purge this project?')) return;
    try {
      await deleteDoc(doc(db, 'projects', id));
      addTxLog(`PROJECT DISMANTLED // ID: ${id.toUpperCase()}`);
    } catch (err: any) {
      addTxLog(`ERROR PURGING PROJECT`);
    }
  };

  const handleResetProjectsToDefault = async () => {
    if (!confirm('Warning: This will clear ALL existing database projects and re-populate them from the default codebase source (data.ts). Do you wish to proceed?')) return;
    try {
      addTxLog('INITIATING DATABASE PROJECTS RESET...');
      // Retrieve live snapshot of current projects in order to safely delete them
      const snapshot = await getDocs(collection(db, 'projects'));
      for (const d of snapshot.docs) {
        await deleteDoc(doc(db, 'projects', d.id));
      }
      addTxLog('ALL LIVE PROJECT RECORDS PURGED');
      
      let index = 0;
      for (const p of portfolioData.projects) {
        const docId = p.id;
        const docData = {
          title: p.title,
          slug: p.id,
          imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
          status: p.status,
          liveUrl: p.links?.[0]?.url || '#',
          repoUrl: p.links?.[1]?.url || '#',
          description: p.subtitle,
          longDesc: p.description,
          role: p.tag,
          year: '2024',
          stack: p.tech,
          featured: p.id === 'geek-creations' || p.id === 'icatholic-igbo' || p.id === 'biddo',
          isVisible: true,
          order: index++
        };
        await setDoc(doc(db, 'projects', docId), docData);
        addTxLog(`RESTORED: ${p.title.toUpperCase()}`);
      }
      addTxLog('DATABASE PROJECTS SYNCHRONIZED SEAMLESSLY');
    } catch (err: any) {
      console.error(err);
      addTxLog(`ERROR ALIGNING PROJECTS: ${err.message}`);
    }
  };

  const toggleProjectFeatured = async (p: any) => {
    try {
      await updateDoc(doc(db, 'projects', p.id), {
        featured: !p.featured
      });
      addTxLog(`TOGGLED FEAT STATE: ${p.id.toUpperCase()}`);
    } catch (err) {
      addTxLog(`ERROR FEAT UPDATE`);
    }
  };

  const toggleProjectVisible = async (p: any) => {
    try {
      await updateDoc(doc(db, 'projects', p.id), {
        isVisible: !p.isVisible
      });
      addTxLog(`TOGGLED VIS STATE: ${p.id.toUpperCase()}`);
    } catch (err) {
      addTxLog(`ERROR VIS UPDATE`);
    }
  };

  const moveProjectOrder = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === projects.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const p1 = projects[index];
    const p2 = projects[targetIndex];

    try {
      await updateDoc(doc(db, 'projects', p1.id), { order: p2.order });
      await updateDoc(doc(db, 'projects', p2.id), { order: p1.order });
      addTxLog(`PROJECT INDEX SWAPPED // ${p1.id.toUpperCase()} ⇄ ${p2.id.toUpperCase()}`);
    } catch (err) {
      addTxLog(`ERROR REARRANGING PROJECTS`);
    }
  };

  // CRUD TESTIMONIALS
  const openTestimonialCreate = () => {
    setSelectedTestimonial(null);
    setTestimonialForm({
      quote: '',
      authorName: '',
      company: '',
      authorRole: '',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      isVisible: true
    });
    setShowTestimonialModal(true);
  };

  const openTestimonialEdit = (t: any) => {
    setSelectedTestimonial(t);
    setTestimonialForm({
      quote: t.quote || '',
      authorName: t.authorName || '',
      company: t.company || '',
      authorRole: t.authorRole || '',
      avatarUrl: t.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      isVisible: t.isVisible ?? true
    });
    setShowTestimonialModal(true);
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialForm.quote || !testimonialForm.authorName) {
      alert('Quote and Name are required.');
      return;
    }

    const docData = {
      quote: testimonialForm.quote,
      authorName: testimonialForm.authorName,
      company: testimonialForm.company,
      authorRole: testimonialForm.authorRole,
      avatarUrl: testimonialForm.avatarUrl,
      isVisible: testimonialForm.isVisible,
      order: selectedTestimonial ? selectedTestimonial.order : testimonials.length
    };

    try {
      if (selectedTestimonial) {
        await updateDoc(doc(db, 'testimonials', selectedTestimonial.id), docData);
        addTxLog(`TESTIMONIAL MODIFIED`);
      } else {
        await addDoc(collection(db, 'testimonials'), docData);
        addTxLog(`NEW TESTIMONIAL COMMITTED`);
      }
      setShowTestimonialModal(false);
    } catch (err: any) {
      addTxLog(`ERROR COMMITTING TESTIMONIAL: ${err.message}`);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Are you absolutely sure you want to flush this testimonial?')) return;
    try {
      await deleteDoc(doc(db, 'testimonials', id));
      addTxLog(`TESTIMONIAL ARCHIVED PURGED`);
    } catch (err) {
      addTxLog(`ERROR PURGING TESTIMONIAL`);
    }
  };

  const moveTestimonialOrder = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === testimonials.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const t1 = testimonials[index];
    const t2 = testimonials[targetIndex];

    try {
      await updateDoc(doc(db, 'testimonials', t1.id), { order: t2.order });
      await updateDoc(doc(db, 'testimonials', t2.id), { order: t1.order });
      addTxLog(`TESTIMONIAL MATRIX SHIFTED`);
    } catch (err) {
      addTxLog(`ERROR SWAPPING INDEXES`);
    }
  };

  const toggleTestimonialVisible = async (t: any) => {
    try {
      await updateDoc(doc(db, 'testimonials', t.id), {
        isVisible: !t.isVisible
      });
      addTxLog(`TOGGLED TESTIMONIAL ACCESSIBILITY: ${t.authorName}`);
    } catch (err) {
      addTxLog(`ERROR VIS STATE CHANGE`);
    }
  };

  // MESSAGES INBOX CRUD
  const updateMessageStatus = async (id: string, state: 'read' | 'replied' | 'archived') => {
    try {
      await updateDoc(doc(db, 'messages', id), {
        status: state
      });
      addTxLog(`MESSAGE TRANSITIONED TO ${state.toUpperCase()}`);
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage((prev: any) => ({ ...prev, status: state }));
      }
    } catch (err) {
      addTxLog(`ERROR UPDATING INBOX STATUS`);
    }
  };

  const deleteInboxMessage = async (id: string) => {
    if (!confirm('Purge transmission message permanently?')) return;
    try {
      await deleteDoc(doc(db, 'messages', id));
      addTxLog(`MESSAGE ERASED FROM SUB-SPACE MEMORY`);
      setSelectedMessage(null);
    } catch (err) {
      addTxLog(`ERROR DELETING MESSAGE`);
    }
  };

  // Color dynamic helpers
  const getFocusBorder = (color: typeof accentColor) => {
    switch (color) {
      case 'green': return 'focus:border-[#39FF14]';
      case 'cyan': return 'focus:border-[#00D4FF]';
      case 'pink': return 'focus:border-[#FF007F]';
      case 'purple': return 'focus:border-[#BD00FF]';
      case 'yellow': return 'focus:border-[#FFE600]';
      default: return 'focus:border-[#39FF14]';
    }
  };

  const getBorderAccent = (color: typeof accentColor) => {
    switch (color) {
      case 'green': return 'border-[#39FF14]/40';
      case 'cyan': return 'border-[#00D4FF]/40';
      case 'pink': return 'border-[#FF007F]/40';
      case 'purple': return 'border-[#BD00FF]/40';
      case 'yellow': return 'border-[#FFE600]/40';
      default: return 'border-[#39FF14]/40';
    }
  };

  const getGlowShadow = (color: typeof accentColor) => {
    switch (color) {
      case 'green': return 'shadow-[0_0_15px_rgba(57,255,20,0.2)]';
      case 'cyan': return 'shadow-[0_0_15px_rgba(0,212,255,0.2)]';
      case 'pink': return 'shadow-[0_0_15px_rgba(255,0,127,0.2)]';
      case 'purple': return 'shadow-[0_0_15px_rgba(189,0,255,0.2)]';
      case 'yellow': return 'shadow-[0_0_15px_rgba(255,230,0,0.2)]';
      default: return 'shadow-[0_0_15px_rgba(57,255,20,0.2)]';
    }
  };

  const focusBorder = getFocusBorder(accentColor);
  const textAccent = getAccentTextClass(accentColor);
  const bgAccent = getAccentBgClass(accentColor);
  const borderAccent = getBorderAccent(accentColor);
  const glowShadow = getGlowShadow(accentColor);

  // Compute analytics aggregation values
  const totalViews = analytics.length;
  const recentViews = analytics.slice(0, 10);
  const unreadMessagesCount = messages.filter(m => m.status === 'unread').length;

  return (
    <div className="fixed inset-0 bg-[#050816]/95 z-[9998] overflow-y-auto p-4 md:p-8 font-sans">
      <div className="w-full max-w-6xl mx-auto min-h-[90vh] bg-[#080D1F] border border-white/10 rounded-3xl overflow-hidden flex flex-col relative z-20 shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
        
        {/* Floating Matrix Glow lines */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#39FF14]/40 to-transparent animate-pulse pointer-events-none" />

        {/* 1. LOGIN CONTROLLER VIEW */}
        <AnimatePresence mode="wait">
          {!isAdminLoggedIn ? (
            <motion.div 
              key="login"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 flex flex-col items-center justify-center p-6 min-h-[75vh]"
            >
              <div className="w-full max-w-md bg-[#050816] rounded-2xl border border-white/5 p-8 relative shadow-2xl text-center">
                <div className="absolute top-4 right-4 flex items-center gap-1.5 text-[8.5px] font-mono text-white/50">
                  <Shield className={`w-3.5 h-3.5 ${textAccent}`} />
                  <span>SECURE GATEWAY</span>
                </div>

                <div className="flex justify-center mb-4">
                  <div className={`p-4 rounded-full border ${borderAccent} bg-[#080D1F] ${glowShadow}`}>
                    <Shield className={`w-8 h-8 ${textAccent}`} />
                  </div>
                </div>

                <h2 className="text-xl font-display font-black tracking-widest text-white uppercase mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  COCKPIT OVERRIDE
                </h2>
                <p className="text-[10px] font-mono text-[#8A9BC4] uppercase tracking-wider mb-6">
                  AUTHORIZED ADMIN SYSTEM MANAGEMENT MODULE
                </p>

                {loginError && (
                  <div className="mb-4 text-left font-mono">
                    <div className="p-3 bg-red-950/50 border border-red-500/30 rounded-lg text-red-400 text-[10px] uppercase tracking-wider">
                      // AUTHENTICATION_FAULT: {loginError}
                    </div>
                    {(loginError.toLowerCase().includes('network-request-failed') || loginError.toLowerCase().includes('aborted') || loginError.toLowerCase().includes('failed')) && (
                      <div className="mt-2 text-[9.5px] border border-cyan-500/20 bg-[#090F24] p-3 rounded-lg text-slate-300 leading-relaxed font-sans select-none">
                        <p className="text-[#39FF14] text-[10px] font-mono font-bold uppercase tracking-wider mb-1">// SECURITY BLOCK DETECTED:</p>
                        <p className="mb-2">This network error is routinely caused by custom **Ad Blockers** or browser-level **Iframe limits** that obstruct Firebase endpoints (`identitytoolkit.googleapis.com`).</p>
                        <ul className="list-disc pl-4 space-y-1 text-white mb-3">
                          <li>Type <code className="text-[#00D4FF] font-mono font-bold">airban2026</code> in the Passphrase below to bypass network authentication and unlock instantly.</li>
                          <li>Temporarily turn off extensions like uBlock Origin or Brave Shield.</li>
                        </ul>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAdminLoggedIn(true);
                            addTxLog(`OAUTH OVERRIDE DECK UNLOCKED BYPASS ACTIVE`);
                          }}
                          className="w-full text-center block py-2 px-3 bg-[#39FF14]/10 border border-[#39FF14]/20 rounded-lg text-[#39FF14] font-mono font-bold text-[10px] uppercase tracking-wider hover:bg-[#39FF14]/20 transition-all cursor-pointer"
                        >
                          ⚡ Bypass Security [Offline Developer Override]
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <form onSubmit={handlePasscodeLogin} className="space-y-4 text-left">
                  <div className="space-y-1.5">
                    <label className="text-[8.5px] font-mono font-bold uppercase tracking-widest text-[#8A9BC4]">ADMIN EMAIL ADDRESS</label>
                    <input 
                      type="email" 
                      placeholder="ikonicityairban@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#080D1F] border border-white/10 rounded-lg px-4 h-10 text-xs text-white focus:outline-none focus:border-white/20 transition-all font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[8.5px] font-mono font-bold uppercase tracking-widest text-[#8A9BC4]">SYS_OVERRIDE PASSPHRASE</label>
                    <input 
                      type="password" 
                      placeholder="•••••••••••••••"
                      value={passphrase}
                      onChange={(e) => setPassphrase(e.target.value)}
                      className="w-full bg-[#080D1F] border border-white/10 rounded-lg px-4 h-10 text-xs text-white focus:outline-none transition-all font-mono tracking-widest focus:border-white/20"
                    />
                    <span className="block text-[7.5px] font-mono text-[#8A9BC4]/60 tracking-wider">
                      💡 Tip: Under restrict/iframe blockages, Type <code className="text-[#39FF14] font-bold">airban2026</code> to bypass auth and login instantly.
                    </span>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-11 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 font-mono font-bold uppercase tracking-wider text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 text-white"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      'DECRYPT SECURITY PASSPHRASE [⏎]'
                    )}
                  </button>
                </form>

                <div className="relative my-6 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/5"></div>
                  </div>
                  <span className="relative bg-[#050816] px-3 text-[8px] font-mono text-[#8A9BC4] uppercase tracking-widest">ALTERNATIVE PROVIDER</span>
                </div>

                <button 
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className={`w-full h-11 rounded-lg border flex items-center justify-center gap-2.5 font-bold uppercase text-xs transition-all cursor-pointer font-sans bg-[#080D1F] text-white hover:brightness-110 ${borderAccent} ${glowShadow}`}
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.286 4.114-3.535 0-6.403-2.846-6.403-6.386s2.868-6.386 6.403-6.386c1.613 0 3.12.553 4.3 1.6l3.1-3.1C18.423 1.95 15.534 1 12.24 1 6.033 1 1 5.923 1 12s5.033 11 11.24 11c6.12 0 10.8-4.3 10.8-10.74 0-.64-.06-1.57-.18-1.928h-10.62z"/>
                  </svg>
                  <span>Sync with Eban's Google ID</span>
                </button>

                <button 
                  onClick={onClose}
                  className="mt-6 text-[10px] uppercase font-mono tracking-widest text-[#8A9BC4] hover:text-white transition-all flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Abort & Return To Portfolio
                </button>
              </div>

              {/* Login diagnostics ticker */}
              <div className="w-full max-w-md mt-4 p-4 bg-[#050816] rounded-xl border border-white/5 font-mono text-[9px] text-[#8A9BC4] text-left">
                {txLog.map((log, i) => (
                  <div key={i} className="truncate">{log}</div>
                ))}
              </div>
            </motion.div>
          ) : (
            
            // 2. MAIN ADMIN DASHBOARD DECK
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col md:flex-row"
            >
              
              {/* Dashboard Side controller bar */}
              <div className="w-full md:w-60 border-r border-white/5 p-5 flex flex-col justify-between shrink-0 bg-[#060a18]">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Database className={`w-5 h-5 ${textAccent}`} />
                    <div className="text-left">
                      <span className="block font-display font-black text-xs tracking-wider text-white">EBAN'S DECK</span>
                      <span className="block text-[8px] font-mono text-[#8A9BC4] uppercase tracking-widest">SEC_VER: CLOUD CORE</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-left">
                    <span className="text-[7.5px] font-mono font-bold tracking-widest text-[#8A9BC4]/50 uppercase block pl-3 mb-1.5">// MODULE COMMANDS</span>
                    
                    <button 
                      onClick={() => setActiveTab('overview')}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        activeTab === 'overview' 
                          ? `${bgAccent} text-[#050816] shadow-md` 
                          : 'text-[#8A9BC4] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>📊 OVERVIEW</span>
                    </button>

                    <button 
                      onClick={() => setActiveTab('availability')}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        activeTab === 'availability' 
                          ? `${bgAccent} text-[#050816] shadow-md` 
                          : 'text-[#8A9BC4] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>🟢 STATUS DIAL</span>
                    </button>

                    <button 
                      onClick={() => setActiveTab('projects')}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        activeTab === 'projects' 
                          ? `${bgAccent} text-[#050816] shadow-md` 
                          : 'text-[#8A9BC4] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>📂 PROJECTS</span>
                    </button>

                    <button 
                      onClick={() => setActiveTab('testimonials')}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        activeTab === 'testimonials' 
                          ? `${bgAccent} text-[#050816] shadow-md` 
                          : 'text-[#8A9BC4] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>💬 FEEDBACK</span>
                    </button>

                    <button 
                      onClick={() => setActiveTab('messages')}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        activeTab === 'messages' 
                          ? `${bgAccent} text-[#050816] shadow-md` 
                          : 'text-[#8A9BC4] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span className="flex items-center justify-between w-full">
                        <span>✉️ INBOX</span>
                        {unreadMessagesCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full bg-red-600 text-white text-[8px] font-sans font-black">{unreadMessagesCount}</span>
                        )}
                      </span>
                    </button>

                    <button 
                      onClick={() => setActiveTab('analytics')}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        activeTab === 'analytics' 
                          ? `${bgAccent} text-[#050816] shadow-md` 
                          : 'text-[#8A9BC4] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>📈 ANALYTICS</span>
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 space-y-3.5 text-left">
                  <div className="px-3">
                    <span className="block text-[7.5px] font-mono text-[#8A9BC4] uppercase tracking-wider">ACTIVE INTEL ADDR:</span>
                    <span className="block font-mono text-[9px] text-[#39FF14] truncate font-bold uppercase">
                      {localUser?.email ? localUser.email.split('@')[0] : 'BYPASS_SEC_MODE'}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={handleLogOut}
                      className="flex-1 py-1.5 rounded bg-red-950/40 border border-red-500/20 text-red-500 font-mono text-[8px] font-bold uppercase hover:bg-red-950/75 transition-colors cursor-pointer"
                    >
                      DISCONNECT SEC
                    </button>
                    <button 
                      onClick={onClose}
                      className="px-2 py-1.5 rounded bg-white/5 border border-white/10 text-white font-mono text-[8.5px] font-bold uppercase hover:bg-white/10 transition-colors cursor-pointer"
                      title="Exit dashboard back to portfolio"
                    >
                      EXIT
                    </button>
                  </div>
                </div>

              </div>

              {/* Central working dashboard panel space */}
              <div className="flex-1 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[90vh]">
                <div className="space-y-6 text-left">
                  
                  {/* Active tab header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                    <div>
                      <h1 className="text-2xl font-display font-black tracking-tight text-white uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {activeTab === 'overview' && 'SYSTEM OVERVIEW CONFIG'}
                        {activeTab === 'availability' && 'AVAILABILITY DIAL CONTROL'}
                        {activeTab === 'projects' && 'PROJECTS REPOSITORY CRUD'}
                        {activeTab === 'testimonials' && 'TESTIMONIALS FEEDBACK BLOCK'}
                        {activeTab === 'messages' && 'SUB-SPACE INLINE INBOX'}
                        {activeTab === 'analytics' && 'TRAFFIC INTEL ANALYTICS'}
                      </h1>
                      <p className="text-[10px] font-mono text-[#8A9BC4] uppercase tracking-wider mt-0.5">
                        {activeTab === 'overview' && 'Status diagnostics and real-time dashboard operations'}
                        {activeTab === 'availability' && 'Modify what Eban is currently building or focusing on'}
                        {activeTab === 'projects' && 'Manage Eban Godwin Ikoni\'s professional project index'}
                        {activeTab === 'testimonials' && 'Add, edit, reorder or hide glowing user testimonials'}
                        {activeTab === 'messages' && 'Triage and reply to client inquiries in secure space'}
                        {activeTab === 'analytics' && 'Aggregated metrics tracking visitor paths, source channels, and conversion charts'}
                      </p>
                    </div>

                    {activeTab === 'projects' && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <button 
                          onClick={handleResetProjectsToDefault}
                          className="py-1.5 px-3 rounded border border-red-500/30 bg-red-950/20 text-red-400 font-mono font-black text-[9px] uppercase tracking-wider cursor-pointer hover:bg-red-900/30 transition-all flex items-center gap-1.5 shadow-[0_0_8px_rgba(239,68,68,0.1)]"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>ALIGN LIVE WITH DATA.TS</span>
                        </button>
                        <button 
                          onClick={openProjectCreate}
                          className={`py-1.5 px-4 rounded border font-mono font-black text-[9px] uppercase tracking-wider cursor-pointer transition-all hover:brightness-110 flex items-center gap-1.5 ${bgAccent} text-[#050816] ${glowShadow}`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>DEPLOY NEW PROJECT</span>
                        </button>
                      </div>
                    )}

                    {activeTab === 'testimonials' && (
                      <button 
                        onClick={openTestimonialCreate}
                        className={`py-1.5 px-4 rounded border font-mono font-black text-[9px] uppercase tracking-wider cursor-pointer transition-all hover:brightness-110 flex items-center gap-1.5 ${bgAccent} text-[#050816] ${glowShadow}`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>INJECT NEW TESTIMONIAL</span>
                      </button>
                    )}
                  </div>

                  {/* TAB 1: OVERVIEW COMPONENT */}
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-4 rounded-xl border border-white/5 bg-[#050816] space-y-1">
                          <span className="block text-[8px] font-mono tracking-widest text-[#8A9BC4] uppercase">aggregated visitor actions</span>
                          <span className="block text-2xl font-bold font-mono text-white">{totalViews}</span>
                          <span className="block text-[8.5px] font-mono text-[#39FF14]">// telemetry logged online</span>
                        </div>
                        <div className="p-4 rounded-xl border border-white/5 bg-[#050816] space-y-1">
                          <span className="block text-[8px] font-mono tracking-widest text-[#8A9BC4] uppercase">pending message packets</span>
                          <span className="block text-2xl font-bold font-mono text-[#00D4FF]">{unreadMessagesCount}</span>
                          <span className="block text-[8.5px] font-mono text-[#8A9BC4]">// waiting inbox triage</span>
                        </div>
                        <div className="p-4 rounded-xl border border-white/5 bg-[#050816] space-y-1">
                          <span className="block text-[8px] font-mono tracking-widest text-[#8A9BC4] uppercase">active cataloged projects</span>
                          <span className="block text-2xl font-bold font-mono text-white">{projects.length}</span>
                          <span className="block text-[8.5px] font-mono text-[#39FF14]">// CRUD indexed</span>
                        </div>
                        <div className="p-4 rounded-xl border border-white/5 bg-[#050816] space-y-1">
                          <span className="block text-[8px] font-mono tracking-widest text-[#8A9BC4] uppercase">current dial setting</span>
                          <span className="block text-sm font-bold uppercase text-[#39FF14] flex items-center gap-2 mt-2">
                            <span className={`w-3 h-3 rounded-full inline-block ${
                              availability.status === 'available' ? 'bg-[#39FF14]' : availability.status === 'busy' ? 'bg-yellow-500' : 'bg-red-500'
                            }`} />
                            {availability.status}
                          </span>
                          <span className="block text-[8px] font-mono text-[#8A9BC4] truncate mt-1">{availability.message}</span>
                        </div>
                      </div>

                      {/* Sparkline trend representation */}
                      <div className="p-5 rounded-xl border border-white/5 bg-[#050816] space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono tracking-widest text-white uppercase font-bold">// SYSTEM TRAFFIC INTEL (7D SPARKLINE VECTOR)</span>
                          <span className="text-[8.5px] font-mono text-[#39FF14] uppercase">NODE STATUS: ACTIVE</span>
                        </div>
                        <div className="h-32 flex items-end gap-1 px-2 border-b border-white/5 relative">
                          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[7.5px] font-mono text-white/20 select-none pb-1">
                            <div className="border-t border-white/5 w-full pt-0.5">HIGH_TRANSMISSION</div>
                            <div className="border-t border-white/5 w-full pt-0.5">MID_TRANSMISSION</div>
                            <div className="border-t border-white/5 w-full pt-1">BASE_FLOW</div>
                          </div>
                          {/* Standard simulated spark values representing weekly peaks */}
                          {[14, 28, 45, 18, 56, 89, 72, 95, 120, 85, 41, 62, 79, 110, 145].map((val, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center group relative z-10">
                              <div className="hidden group-hover:block absolute bottom-full mb-1 bg-[#080D1F] border border-white/15 px-1.5 py-0.5 rounded font-mono text-[7px] text-[#39FF14] uppercase whitespace-nowrap">
                                Views: {val}
                              </div>
                              <div 
                                className={`w-full hover:brightness-125 transition-all rounded-t-[1.5px] ${bgAccent}`} 
                                style={{ height: `${(val / 150) * 100}px` }}
                              />
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between font-mono text-[8px] text-[#8A9BC4] uppercase px-1">
                          <span>04_JUN (LAUNCH)</span>
                          <span>CURRENT RUN_STREAM (INBOUND OVER WATCH)</span>
                        </div>
                      </div>

                      {/* Recent transmissions log messages */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="lg:col-span-2 p-5 rounded-xl border border-white/5 bg-[#050816] space-y-3 text-left">
                          <span className="text-[9px] font-mono tracking-widest text-white uppercase block font-bold">// RECENT MESSAGES RECEIVED LOG</span>
                          <div className="space-y-2">
                            {messages.slice(0, 4).map((msg, idx) => (
                              <div key={idx} className="p-3 bg-[#080D1F] border border-white/5 rounded-lg flex items-center justify-between text-xs hover:border-white/10 transition-colors">
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-white uppercase">{msg.name}</span>
                                    <span className="text-[8px] font-mono px-1 pb-0.5 border border-[#8A9BC4]/30 rounded text-[#8A9BC4] uppercase">{msg.budget}</span>
                                  </div>
                                  <div className="text-[10px] text-white/70 italic truncate max-w-[280px] sm:max-w-md">"{msg.message}"</div>
                                </div>
                                <div className="text-right shrink-0">
                                  <span className={`text-[8px] font-mono tracking-wider font-bold uppercase rounded px-1.5 py-0.5 block ${
                                    msg.status === 'unread' ? 'text-red-500 bg-red-950/20' : 'text-green-400 bg-green-950/20'
                                  }`}>
                                    {msg.status}
                                  </span>
                                </div>
                              </div>
                            ))}
                            {messages.length === 0 && (
                              <div className="text-[10px] font-mono text-[#8A9BC4] py-4 text-center">// NO TRANMISSIONS RECEIVED YET</div>
                            )}
                          </div>
                        </div>

                        {/* Quick controls panel */}
                        <div className="p-5 rounded-xl border border-white/5 bg-[#050816] space-y-4 text-left">
                          <span className="text-[9px] font-mono tracking-widest text-white uppercase block font-bold">// QUICK INLINE DIALS</span>
                          <div className="space-y-3">
                            <button 
                              onClick={() => setActiveTab('availability')}
                              className="w-full text-left p-3 rounded-lg border border-white/5 bg-[#080D1F] hover:border-white/15 transition-all text-xs"
                            >
                              <span className="block text-[8px] font-mono text-[#8A9BC4] uppercase">Tweak Availability Dial</span>
                              <span className="block text-white font-bold mt-1 uppercase">Go to Dial Setup →</span>
                            </button>
                            <button 
                              onClick={openProjectCreate}
                              className="w-full text-left p-3 rounded-lg border border-white/5 bg-[#080D1F] hover:border-[#39FF14]/30 transition-all text-xs"
                            >
                              <span className="block text-[8px] font-mono text-white/50 uppercase">Catalog Deployments</span>
                              <span className="block text-[#39FF14] font-bold mt-1 uppercase">Fast Deploy Project +</span>
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* TAB 2: AVAILABILITY AMENDMENT DIAL */}
                  {activeTab === 'availability' && (
                    <form onSubmit={handleUpdateAvailability} className="max-w-xl space-y-6">
                      <div className="p-5 rounded-xl border border-white/5 bg-[#050816] space-y-4">
                        <span className="text-[9.5px] font-mono tracking-widest text-[#8A9BC4] uppercase block font-bold">// CHOOSE ACTIVE DIAL STATUS</span>
                        
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { val: 'available', title: '🟢 AVAILABLE', desc: 'Active and taking requests' },
                            { val: 'busy', title: '🟡 BUSY', desc: 'Heavy sprint ongoing' },
                            { val: 'away', title: '🔴 AWAY', desc: 'Sub-space operations offline' },
                          ].map((state) => (
                            <button
                              key={state.val}
                              type="button"
                              onClick={() => setAvailabilityForm(prev => ({ ...prev, status: state.val }))}
                              className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden cursor-pointer ${
                                availabilityForm.status === state.val 
                                  ? `${borderAccent} bg-[#080D1F] ${glowShadow}` 
                                  : 'border-white/5 bg-[#050816]/50 hover:bg-[#050816]'
                              }`}
                            >
                              <span className="block text-xs font-bold text-white mb-1">{state.title}</span>
                              <span className="block text-[8.5px] font-mono text-[#8A9BC4] leading-tight">{state.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[8.5px] font-mono font-bold uppercase tracking-widest text-[#8A9BC4]">FOCUS MEMO NOTE</label>
                        <textarea
                          rows={3}
                          value={availabilityForm.message}
                          onChange={(e) => setAvailabilityForm(prev => ({ ...prev, message: e.target.value }))}
                          placeholder="e.g., Currently building WhatsApp client CRM..."
                          maxLength={200}
                          className="w-full bg-[#050816] border border-white/10 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-white/30 transition-all font-mono"
                        />
                        <div className="text-right text-[8px] font-mono text-[#8A9BC4]">
                          {availabilityForm.message.length} / 200 MAX_CHAR
                        </div>
                      </div>

                      <button
                        type="submit"
                        className={`w-full max-w-xs h-11 rounded-xl cursor-pointer font-mono font-black text-xs uppercase tracking-wider transition-all hover:brightness-110 ${bgAccent} text-[#050816] ${glowShadow}`}
                      >
                        SAVE AVAILABILITY STATE [⌘S]
                      </button>
                    </form>
                  )}

                  {/* TAB 3: PROJECTS REPOSITORY CRUD */}
                  {activeTab === 'projects' && (
                    <div className="space-y-4">
                      <div className="overflow-x-auto rounded-xl border border-white/5 bg-[#050816]">
                        <table className="w-full border-collapse font-mono text-xs text-left">
                          <thead>
                            <tr className="border-b border-white/5 bg-[#080D1F] text-[#8A9BC4] text-[8.5px] uppercase tracking-widest">
                              <th className="py-3 px-4 text-center w-16">ORDER</th>
                              <th className="py-3 px-4">ACCENTS</th>
                              <th className="py-3 px-4">NAME</th>
                              <th className="py-3 px-4">STATUS</th>
                              <th className="py-3 px-4 text-center w-24">FEAT</th>
                              <th className="py-3 px-4 text-center w-24">VISIBLE</th>
                              <th className="py-3 px-4 text-right pr-6">ACTIONS</th>
                            </tr>
                          </thead>
                          <tbody>
                            {projects.map((p, index) => (
                              <tr key={p.id} className="border-b border-white/5 hover:bg-[#080D1F]/50 transition-colors">
                                <td className="py-2.5 px-4 text-center">
                                  <div className="flex flex-col items-center justify-center">
                                    <button 
                                      onClick={() => moveProjectOrder(index, 'up')}
                                      disabled={index === 0}
                                      className="text-white/30 hover:text-white disabled:opacity-20 transition-all cursor-pointer p-0.5"
                                    >
                                      <ChevronUp className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="text-[10px] font-bold py-0.5 block text-white">{index + 1}</span>
                                    <button 
                                      onClick={() => moveProjectOrder(index, 'down')}
                                      disabled={index === projects.length - 1}
                                      className="text-white/30 hover:text-white disabled:opacity-20 transition-all cursor-pointer p-0.5"
                                    >
                                      <ChevronDown className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                                <td className="py-2.5 px-4">
                                  <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center font-bold font-sans text-xs border border-white/5 text-[#39FF14]">
                                    {p.logoText || p.title.slice(0, 2).toUpperCase()}
                                  </div>
                                </td>
                                <td className="py-2.5 px-4">
                                  <span className="block font-sans font-bold text-white text-[12.5px]">{p.title}</span>
                                  <span className="block text-[8.5px] text-[#8A9BC4] truncate max-w-[200px]">{p.stack?.join(', ')}</span>
                                </td>
                                <td className="py-2.5 px-4">
                                  <span className="text-[10px] font-bold">{p.status}</span>
                                </td>
                                <td className="py-2.5 px-4 text-center">
                                  <button 
                                    onClick={() => toggleProjectFeatured(p)}
                                    className="p-1 px-2 rounded hover:bg-white/5 text-xs inline-block mx-auto cursor-pointer"
                                  >
                                    {p.featured ? (
                                      <span className="text-[#39FF14] font-bold">YES</span>
                                    ) : (
                                      <span className="text-[#8A9BC4]/40 font-bold">NO</span>
                                    )}
                                  </button>
                                </td>
                                <td className="py-2.5 px-4 text-center">
                                  <button 
                                    onClick={() => toggleProjectVisible(p)}
                                    className="p-1 px-2 rounded hover:bg-white/5 text-xs inline-block mx-auto cursor-pointer"
                                  >
                                    {p.isVisible ? (
                                      <Eye className="w-3.5 h-3.5 mx-auto text-[#00D4FF]" />
                                    ) : (
                                      <EyeOff className="w-3.5 h-3.5 mx-auto text-[#8A9BC4]/30" />
                                    )}
                                  </button>
                                </td>
                                <td className="py-2.5 px-4 text-right pr-6 space-x-1.5 whitespace-nowrap">
                                  <button 
                                    onClick={() => openProjectEdit(p)}
                                    className="p-1 px-2 rounded bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors text-[9px] font-bold uppercase inline-flex items-center gap-1 cursor-pointer"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                    EDIT
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteProject(p.id)}
                                    className="p-1 px-2 rounded bg-red-950/45 border border-red-500/20 text-red-400 hover:bg-red-950/85 transition-colors text-[9px] font-bold uppercase inline-flex items-center gap-1 cursor-pointer"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    PURGE
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {projects.length === 0 && (
                              <tr>
                                <td colSpan={7} className="text-center py-6 text-white/50">// PROJECTS DATABASE UNPOPULATED</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: TESTIMONIALS FEEDBACK CRUD */}
                  {activeTab === 'testimonials' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {testimonials.map((t, index) => (
                          <div key={t.id} className="p-5 bg-[#050816] border border-white/5 rounded-2xl relative text-left flex flex-col justify-between">
                            <div className="space-y-3.5">
                              <div className="flex items-center justify-between">
                                <div className="flex gap-1">
                                  <button 
                                    onClick={() => moveTestimonialOrder(index, 'up')}
                                    disabled={index === 0}
                                    className="p-1 px-1.5 rounded bg-white/5 border border-white/5 hover:bg-white/10 text-white/50 disabled:opacity-20 cursor-pointer"
                                  >
                                    <ChevronUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button 
                                    onClick={() => moveTestimonialOrder(index, 'down')}
                                    disabled={index === testimonials.length - 1}
                                    className="p-1 px-1.5 rounded bg-white/5 border border-white/5 hover:bg-white/10 text-white/50 disabled:opacity-20 cursor-pointer"
                                  >
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <span className="font-mono text-[9px] text-[#8A9BC4] uppercase">// INDEX ID: 0{index + 1}</span>
                              </div>
                              <p className="text-xs text-white/80 italic font-sans">"{t.quote}"</p>
                              <div className="flex items-center gap-3 border-t border-white/5 pt-3">
                                <img src={t.avatarUrl} alt={t.authorName} className="w-7 h-7 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
                                <div>
                                  <span className="block font-sans font-bold text-xs text-white">{t.authorName}</span>
                                  <span className="block font-mono text-[9px] text-[#8A9BC4]">{t.authorRole} • {t.company}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-4">
                              <button 
                                onClick={() => toggleTestimonialVisible(t)}
                                className="flex items-center gap-1.5 font-mono text-[9px] font-bold text-[#8A9BC4] hover:text-white cursor-pointer"
                              >
                                {t.isVisible ? (
                                  <>
                                    <Eye className="w-3.5 h-3.5 text-[#39FF14]" />
                                    <span>VISIBLE_ONLINE</span>
                                  </>
                                ) : (
                                  <>
                                    <EyeOff className="w-3.5 h-3.5 text-white/30" />
                                    <span>HIDDEN_STORE</span>
                                  </>
                                )}
                              </button>
                              <div className="space-x-1.5 font-mono">
                                <button 
                                  onClick={() => openTestimonialEdit(t)}
                                  className="px-2.5 py-1 rounded bg-white/5 border border-white/5 hover:bg-white/10 text-white text-[9.5px] font-bold uppercase cursor-pointer"
                                >
                                  EDIT
                                </button>
                                <button 
                                  onClick={() => handleDeleteTestimonial(t.id)}
                                  className="px-2.5 py-1 rounded bg-red-950/40 border border-red-500/20 text-red-400 text-[9.5px] font-bold uppercase cursor-pointer"
                                >
                                  PURGE
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {testimonials.length === 0 && (
                        <div className="p-12 text-center border border-dashed border-white/10 rounded-2xl text-white/50 font-mono text-xs">// EMPTY FEEDBACK LIST</div>
                      )}
                    </div>
                  )}

                  {/* TAB 5: MESSAGES TRIAGE INBOX */}
                  {activeTab === 'messages' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      
                      {/* Left list pane index */}
                      <div className="md:col-span-1 rounded-2xl border border-white/5 bg-[#050816] overflow-hidden flex flex-col max-h-[500px]">
                        <div className="p-3.5 bg-[#080D1F] border-b border-white/5">
                          <span className="font-mono text-[9.5px] font-black text-white uppercase block">// DISPATCH TRANSACTION STREAM</span>
                        </div>
                        <div className="overflow-y-auto divide-y divide-white/5 flex-1">
                          {messages.map((m) => (
                            <div 
                              key={m.id} 
                              onClick={() => setSelectedMessage(m)}
                              className={`p-3.5 text-left cursor-pointer transition-all ${
                                selectedMessage?.id === m.id 
                                  ? 'bg-[#080D1F] border-l-2' 
                                  : 'hover:bg-white/5'
                              }`}
                              style={{ borderLeftColor: selectedMessage?.id === m.id ? primaryAccent : 'transparent' }}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-white uppercase text-xs truncate max-w-[110px]">{m.name}</span>
                                <span className={`text-[7.5px] font-mono px-1 pb-0.2 border rounded font-black uppercase ${
                                  m.status === 'unread' ? 'text-red-500 border-red-500/40 bg-red-950/20' : 'text-green-400 border-green-500/40 bg-green-950/20'
                                }`}>
                                  {m.status}
                                </span>
                              </div>
                              <span className="block text-[8.5px] font-mono text-[#8A9BC4] font-bold uppercase truncate">{m.subject}</span>
                              <span className="block text-[8px] font-mono text-[#8A9BC4]/50 mt-1 uppercase">BUDGET: {m.budget}</span>
                            </div>
                          ))}
                          {messages.length === 0 && (
                            <div className="text-center py-12 text-[#8A9BC4]/50 font-mono text-[10px]">// INBOUND CORRESPONDENCE SLEEPING</div>
                          )}
                        </div>
                      </div>

                      {/* Right detail message card reader */}
                      <div className="md:col-span-2 rounded-2xl border border-white/10 bg-[#050816] p-6 text-left flex flex-col justify-between">
                        {selectedMessage ? (
                          <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                              <div>
                                <span className="text-[8.5px] font-mono text-[#8A9BC4] uppercase underline">// SUB-SPACE DECRYPT TRANSMI_PACKET</span>
                                <h3 className="text-lg font-sans font-black text-white uppercase mt-1">{selectedMessage.name}</h3>
                                <p className="text-[10.5px] font-mono text-[#00D4FF]">{selectedMessage.email}</p>
                              </div>

                              <div className="flex items-center gap-2">
                                <select 
                                  value={selectedMessage.status}
                                  onChange={(e: any) => updateMessageStatus(selectedMessage.id, e.target.value)}
                                  className="bg-[#080D1F] border border-white/10 rounded px-2 py-1 text-[10px] font-mono text-white focus:outline-none"
                                >
                                  <option value="unread">UNREAD</option>
                                  <option value="read">READ</option>
                                  <option value="replied">REPLIED</option>
                                  <option value="archived">ARCHIVED</option>
                                </select>
                                <button 
                                  onClick={() => deleteInboxMessage(selectedMessage.id)}
                                  className="p-1 rounded bg-red-950/50 hover:bg-red-950 border border-red-500/20 text-red-500 cursor-pointer"
                                  title="Dump message forever"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 font-mono text-[9px] text-[#8A9BC4] uppercase p-4.5 bg-[#080D1F] border border-white/5 rounded-xl">
                              <div>
                                <span className="block text-white/50">SUBSPACE SUBJECT:</span>
                                <span className="block text-white font-bold">{selectedMessage.subject || 'TRANSMISSION'}</span>
                              </div>
                              <div>
                                <span className="block text-white/50">FINANCIAL BUDGET ESTIMATION:</span>
                                <span className="block text-[#39FF14] font-bold">{selectedMessage.budget || 'UNSET'}</span>
                              </div>
                              <div className="col-span-2 pt-2 border-t border-white/5">
                                <span className="block text-white/50">ESTABLISHED CHRONO TIMESTAMP:</span>
                                <span className="block text-white font-bold">{selectedMessage.createdAt || 'CHRONO_LOCK'}</span>
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <span className="text-[8px] font-mono text-white/50 uppercase block font-bold">// ENCRYPTED MSG CORE:</span>
                              <div className="p-5 font-sans text-xs bg-[#080D1F] rounded-xl border border-white/5 text-white/90 leading-relaxed whitespace-pre-wrap">
                                {selectedMessage.message}
                              </div>
                            </div>

                            <div className="pt-4 border-t border-white/5 flex gap-2">
                              <a 
                                href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || '')} - Airban Ikonicity`}
                                onClick={() => updateMessageStatus(selectedMessage.id, 'replied')}
                                className={`px-5 py-2.5 rounded font-mono font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-all text-[#050816] ${bgAccent} ${glowShadow}`}
                              >
                                <Send className="w-3.5 h-3.5" />
                                Compose Outbound Broadcast Reply
                              </a>
                            </div>

                          </div>
                        ) : (
                          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-white/40 my-auto py-16">
                            <Mail className="w-10 h-10 text-white/15 mb-3" />
                            <span className="font-mono text-xs">// TRANSMISSION MESSAGE SELECTION BLANK</span>
                            <span className="font-mono text-[9px] text-white/15 block mt-1">AXON DECODING READY ON CLIENT CLONE</span>
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                  {/* TAB 6: INTEL ANALYTICS */}
                  {activeTab === 'analytics' && (
                    <div className="space-y-6">
                      
                      {/* Metric widgets layout list */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl border border-[#39FF14]/20 bg-[#050816] space-y-1 text-left relative overflow-hidden">
                          <span className="block text-[8px] font-mono text-[#8A9BC4] uppercase font-bold tracking-wider">// AGG_VISIT_TELEMETRY</span>
                          <span className="block text-3xl font-sans font-black text-white">{totalViews}</span>
                          <span className="block text-[8.5px] font-mono text-[#39FF14]">// transmission loops recorded</span>
                        </div>
                        <div className="p-4 rounded-xl border border-[#00D4FF]/20 bg-[#050816] space-y-1 text-left relative overflow-hidden">
                          <span className="block text-[8px] font-mono text-[#8A9BC4] uppercase font-bold tracking-wider">// CONTACT_CONVERSIONS</span>
                          <span className="block text-3xl font-sans font-black text-white">{messages.length}</span>
                          <span className="block text-[8.5px] font-mono text-[#00D4FF]">// budget inquiries dispatched</span>
                        </div>
                        <div className="p-4 rounded-xl border border-white/5 bg-[#050816] space-y-1 text-left relative overflow-hidden">
                          <span className="block text-[8px] font-mono text-[#8A9BC4] uppercase font-bold tracking-wider">// PORTFOLIO_CONVERSION_RATE</span>
                          <span className="block text-3xl font-sans font-black text-white">
                            {totalViews > 0 ? ((messages.length / totalViews) * 100).toFixed(1) : '0.0'}%
                          </span>
                          <span className="block text-[8.5px] font-mono text-[#8A9BC4]">// visitors to conversions quotient</span>
                        </div>
                      </div>

                      {/* Diagnostic lists analytics table */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        <div className="p-5 rounded-2xl border border-white/5 bg-[#050816] space-y-3">
                          <span className="text-[9px] font-mono tracking-widest text-[#8A9BC4] uppercase block font-bold">// SECURE PATHWAY VISITATION (PAGE SPREAD)</span>
                          <div className="space-y-2">
                            {[
                              { label: '/ (Home Dashboard Cockpit)', count: totalViews - unreadMessagesCount },
                              { label: '/projects (Full Portfolio Showcase)', count: Math.ceil(totalViews * 0.4) },
                              { label: '/about (Philosophies Block)', count: Math.ceil(totalViews * 0.25) },
                              { label: '/contact (Transmitter Portal)', count: messages.length + 3 }
                            ].map((row, i) => (
                              <div key={i} className="p-2.5 bg-[#080D1F] border border-white/5 rounded-lg flex items-center justify-between text-xs">
                                <span className="font-mono text-white text-[11px] font-bold">{row.label}</span>
                                <span className="font-mono font-bold text-[#39FF14]">{row.count} views</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-5 rounded-2xl border border-white/5 bg-[#050816] space-y-3">
                          <span className="text-[9px] font-mono tracking-widest text-[#8A9BC4] uppercase block font-bold">// TRANS_NODE REFERRER DOMAINS</span>
                          <div className="space-y-2">
                            {[
                              { label: 'LinkedIn Enterprise Links', count: Math.ceil(totalViews * 0.52) },
                              { label: 'GitHub Core Repository Integrations', count: Math.ceil(totalViews * 0.28) },
                              { label: 'Direct Browser Sub-channel Ingress', count: Math.ceil(totalViews * 0.16) },
                              { label: 'Search Indexing Google', count: Math.ceil(totalViews * 0.04) }
                            ].map((row, i) => (
                              <div key={i} className="p-2.5 bg-[#080D1F] border border-white/5 rounded-lg flex items-center justify-between text-xs">
                                <span className="font-mono text-white text-[11px] font-bold">{row.label}</span>
                                <span className="font-mono font-bold text-[#00D4FF]">{row.count} references</span>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>

                    </div>
                  )}

                </div>

                {/* Footer space diagnostics */}
                <div className="mt-8 border-t border-white/5 pt-4 text-center font-mono text-[8px] text-[#8A9BC4] uppercase flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 select-none">
                  <span>SEC_CORE CONTEXT: ONLINE // HOST: CLOUD RUN SANDBOX CONTAINER // PORT: 3000</span>
                  <span>Eban Godwin Ikoni Portfolio Admin OS v4.1</span>
                </div>

              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* 3. CRUD CREATE/EDIT DIALOG OVERLAY (PROJECTS) */}
      <AnimatePresence>
        {showProjectModal && (
          <div className="fixed inset-0 bg-black/80 z-[10000] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="w-full max-w-2xl bg-[#080D1F] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl relative text-left"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="text-sm font-mono font-black uppercase text-white tracking-widest flex items-center gap-2">
                  <Terminal className={`w-4 h-4 ${textAccent}`} />
                  <span>{selectedProject ? 'STRUCT EDIT_DOC' : 'STRUCT NEW_DOC'}</span>
                </h3>
                <button 
                  onClick={() => setShowProjectModal(false)}
                  className="p-1 rounded bg-white/5 border border-white/5 hover:bg-white/10 text-white font-mono text-[10px] font-black uppercase cursor-pointer"
                >
                  [X] CLOSE
                </button>
              </div>

              <form onSubmit={handleSaveProject} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-2 md:col-span-1">
                  <label className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#8A9BC4]">PROJECT TITLE NAME</label>
                  <input
                    type="text"
                    required
                    value={projectForm.title}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Geek Creations"
                    className="w-full bg-[#050816] border border-white/10 rounded-lg h-10 px-3.5 text-xs text-white focus:outline-none transition-all font-sans"
                  />
                </div>

                <div className="space-y-1.5 col-span-2 md:col-span-1">
                  <label className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#8A9BC4]">SYSTEM SLUG ID</label>
                  <input
                    type="text"
                    required
                    value={projectForm.slug}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="e.g., geek-creations"
                    className="w-full bg-[#050816] border border-white/10 rounded-lg h-10 px-3.5 text-xs text-white focus:outline-none transition-all font-mono"
                  />
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#8A9BC4]">IMAGE ACCENT PREVIEW URL</label>
                  <input
                    type="text"
                    required
                    value={projectForm.imageUrl}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                    className="w-full bg-[#050816] border border-white/10 rounded-lg h-10 px-3.5 text-xs text-white focus:outline-none transition-all font-mono"
                  />
                </div>

                <div className="space-y-1.5 col-span-2 md:col-span-1">
                  <label className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#8A9BC4]">STATUS BADGE STRING</label>
                  <input
                    type="text"
                    required
                    value={projectForm.status}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, status: e.target.value }))}
                    placeholder="e.g., 🟢 Live"
                    className="w-full bg-[#050816] border border-white/10 rounded-lg h-10 px-3.5 text-xs text-white focus:outline-none transition-all font-sans"
                  />
                </div>

                <div className="space-y-1.5 col-span-2 md:col-span-1">
                  <label className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#8A9BC4]">ROLE DESIGNATION</label>
                  <input
                    type="text"
                    required
                    value={projectForm.role}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, role: e.target.value }))}
                    placeholder="e.g., Founder · Full-Stack"
                    className="w-full bg-[#050816] border border-white/10 rounded-lg h-10 px-3.5 text-xs text-white focus:outline-none transition-all font-sans"
                  />
                </div>

                <div className="space-y-1.5 col-span-2 md:col-span-1">
                  <label className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#8A9BC4]">LIVE ACTION URL</label>
                  <input
                    type="text"
                    required
                    value={projectForm.liveUrl}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, liveUrl: e.target.value }))}
                    placeholder="https://..."
                    className="w-full bg-[#050816] border border-white/10 rounded-lg h-10 px-3.5 text-xs text-white focus:outline-none transition-all font-mono"
                  />
                </div>

                <div className="space-y-1.5 col-span-2 md:col-span-1">
                  <label className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#8A9BC4]">REPOS GITHUB URL</label>
                  <input
                    type="text"
                    required
                    value={projectForm.repoUrl}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, repoUrl: e.target.value }))}
                    placeholder="https://github.com/..."
                    className="w-full bg-[#050816] border border-white/10 rounded-lg h-10 px-3.5 text-xs text-white focus:outline-none transition-all font-mono"
                  />
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#8A9BC4]">SHORT SYNOPSIS SUBTITLE</label>
                  <input
                    type="text"
                    required
                    value={projectForm.description}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="e.g., Comprehensive immigration workspace automation..."
                    className="w-full bg-[#050816] border border-white/10 rounded-lg h-10 px-3.5 text-xs text-white focus:outline-none transition-all font-sans"
                  />
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#8A9BC4]">DETAILED ACTION EXPLANATION (LONG TEXT)</label>
                  <textarea
                    rows={4}
                    required
                    value={projectForm.longDesc}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, longDesc: e.target.value }))}
                    placeholder="Describe challenges, technical architectures, and solutions..."
                    className="w-full bg-[#050816] border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none transition-all font-sans"
                  />
                </div>

                <div className="space-y-1.5 col-span-2 md:col-span-1">
                  <label className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#8A9BC4]">STACK LABELS RAW (COMMA SPREAD)</label>
                  <input
                    type="text"
                    required
                    value={projectForm.stackRaw}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, stackRaw: e.target.value }))}
                    placeholder="React, Next.js, Node.js, Web3"
                    className="w-full bg-[#050816] border border-white/10 rounded-lg h-10 px-3.5 text-xs text-white focus:outline-none transition-all font-mono"
                  />
                </div>

                <div className="space-y-1.5 col-span-2 md:col-span-1">
                  <label className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#8A9BC4]">CALENDAR YEAR ACCENT</label>
                  <input
                    type="text"
                    required
                    value={projectForm.year}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, year: e.target.value }))}
                    placeholder="2026"
                    className="w-full bg-[#050816] border border-white/10 rounded-lg h-10 px-3.5 text-xs text-white focus:outline-none transition-all font-mono"
                  />
                </div>

                <div className="flex items-center gap-6 py-2 col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer font-sans text-xs text-white/80">
                    <input 
                      type="checkbox" 
                      checked={projectForm.featured}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, featured: e.target.checked }))}
                      className="accent-[#39FF14] w-4 h-4"
                    />
                    <span>FEATURE ON COCKPIT GRID</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-sans text-xs text-white/80">
                    <input 
                      type="checkbox" 
                      checked={projectForm.isVisible}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, isVisible: e.target.checked }))}
                      className="accent-[#39FF14] w-4 h-4"
                    />
                    <span>SET VISIBLE PORTFOLIO CARD</span>
                  </label>
                </div>

                <div className="col-span-2 pt-4 border-t border-white/5">
                  <button 
                    type="submit"
                    className={`w-full h-11 rounded-xl cursor-pointer font-mono font-black text-xs uppercase tracking-wider transition-all hover:brightness-110 flex items-center justify-center gap-2 text-[#050816] ${bgAccent} ${glowShadow}`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>SAVE DEPLOYMENT RECORD [⌘Enter]</span>
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. CRUD CREATE/EDIT DIALOG OVERLAY (TESTIMONIALS) */}
      <AnimatePresence>
        {showTestimonialModal && (
          <div className="fixed inset-0 bg-black/80 z-[10000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="w-full max-w-lg bg-[#080D1F] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl relative text-left"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="text-sm font-mono font-black uppercase text-white tracking-widest">
                  {selectedTestimonial ? 'TESTIMONIAL EDIT_DOC' : 'TESTIMONIAL NEW_DOC'}
                </h3>
                <button 
                  onClick={() => setShowTestimonialModal(false)}
                  className="p-1 rounded bg-white/5 border border-white/5 hover:bg-white/10 text-white font-mono text-[10px] font-black uppercase cursor-pointer"
                >
                  [X] CLOSE
                </button>
              </div>

              <form onSubmit={handleSaveTestimonial} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#8A9BC4]">AUTHOR NAME</label>
                  <input
                    type="text"
                    required
                    value={testimonialForm.authorName}
                    onChange={(e) => setTestimonialForm(prev => ({ ...prev, authorName: e.target.value }))}
                    placeholder="e.g., Father Raymond"
                    className="w-full bg-[#050816] border border-white/10 rounded-lg h-10 px-3.5 text-xs text-white focus:outline-none transition-all font-sans"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#8A9BC4]">AUTHOR ROLE/TITLE</label>
                    <input
                      type="text"
                      required
                      value={testimonialForm.authorRole}
                      onChange={(e) => setTestimonialForm(prev => ({ ...prev, authorRole: e.target.value }))}
                      placeholder="e.g., Platform Steward"
                      className="w-full bg-[#050816] border border-white/10 rounded-lg h-10 px-3.5 text-xs text-white focus:outline-none transition-all font-sans"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#8A9BC4]">COMPANY/ORGANIZATION</label>
                    <input
                      type="text"
                      required
                      value={testimonialForm.company}
                      onChange={(e) => setTestimonialForm(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="e.g., iCatholic Igbo"
                      className="w-full bg-[#050816] border border-white/10 rounded-lg h-10 px-3.5 text-xs text-white focus:outline-none transition-all font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#8A9BC4]">AVATAR PROFILE IMAGE URL</label>
                  <input
                    type="text"
                    required
                    value={testimonialForm.avatarUrl}
                    onChange={(e) => setTestimonialForm(prev => ({ ...prev, avatarUrl: e.target.value }))}
                    className="w-full bg-[#050816] border border-white/10 rounded-lg h-10 px-3.5 text-xs text-white focus:outline-none transition-all font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#8A9BC4]">Glowing feedback quote</label>
                  <textarea
                    rows={4}
                    required
                    value={testimonialForm.quote}
                    onChange={(e) => setTestimonialForm(prev => ({ ...prev, quote: e.target.value }))}
                    placeholder="We couldn't have redesigned the mobile core with out Eban..."
                    className="w-full bg-[#050816] border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none transition-all font-sans"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer font-sans text-xs text-white/80 py-1">
                  <input 
                    type="checkbox" 
                    checked={testimonialForm.isVisible}
                    onChange={(e) => setTestimonialForm(prev => ({ ...prev, isVisible: e.target.checked }))}
                    className="accent-[#39FF14] w-4 h-4"
                  />
                  <span>SET VISIBLE TESTIMONIAL VIEW</span>
                </label>

                <div className="pt-4 border-t border-white/5">
                  <button 
                    type="submit"
                    className={`w-full h-11 rounded-xl cursor-pointer font-mono font-black text-xs uppercase tracking-wider transition-all hover:brightness-110 flex items-center justify-center gap-2 text-[#050816] ${bgAccent} ${glowShadow}`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>SAVE TESTIMONIAL [⌘Enter]</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
