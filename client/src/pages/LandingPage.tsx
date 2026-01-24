import { useNavigate } from "react-router-dom";
import {
    Menu,
    QrCode,
    Settings,
    CreditCard,
    CheckCircle2,
    ArrowRight,
    ChevronDown,
    Zap,
    ShieldCheck,
    Smartphone,
    TrendingUp,
    Clock,
    Users,
    Sparkles,
    Star,
    Play,
    Award,
    BarChart3,
    Globe,
    Heart,
    Rocket
} from "lucide-react";
import { useState, useEffect } from "react";
import logo from "../assets/logo.png";

const LandingPage = () => {
    const navigate = useNavigate();
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const features = [
        {
            title: "Digital Menu Magic",
            desc: "Update items, prices, and availability in real-time. Your menu evolves with your business instantly.",
            icon: <Menu className="w-7 h-7" />,
            gradient: "from-[#16516f] to-[#1a5b7d]",
            bgGradient: "from-[#16516f]/10 to-[#1a5b7d]/5"
        },
        {
            title: "QR Code Revolution",
            desc: "Contactless ordering that delights customers. Watch your service speed soar by 45%.",
            icon: <QrCode className="w-7 h-7" />,
            gradient: "from-orange-500 to-red-500",
            bgGradient: "from-orange-500/10 to-red-500/5"
        },
        {
            title: "Smart Inventory",
            desc: "Never run out unexpectedly. Intelligent alerts keep you always prepared and stocked.",
            icon: <Settings className="w-7 h-7" />,
            gradient: "from-emerald-500 to-teal-500",
            bgGradient: "from-emerald-500/10 to-teal-500/5"
        },
        {
            title: "Customer Loyalty",
            desc: "Build relationships that last. Credit ledger for your trusted regulars and VIPs.",
            icon: <CreditCard className="w-7 h-7" />,
            gradient: "from-purple-500 to-pink-500",
            bgGradient: "from-purple-500/10 to-pink-500/5"
        },
        {
            title: "Real-Time Analytics",
            desc: "Track sales, popular items, and customer trends with beautiful, insightful dashboards.",
            icon: <BarChart3 className="w-7 h-7" />,
            gradient: "from-blue-500 to-cyan-500",
            bgGradient: "from-blue-500/10 to-cyan-500/5"
        },
        {
            title: "Global Reach",
            desc: "Serve customers anywhere, anytime. Multi-language support and global payment options.",
            icon: <Globe className="w-7 h-7" />,
            gradient: "from-indigo-500 to-violet-500",
            bgGradient: "from-indigo-500/10 to-violet-500/5"
        }
    ];

    const stats = [
        { number: "500+", label: "Happy Restaurants", icon: <Users className="w-6 h-6" />, color: "from-[#16516f] to-[#1a5b7d]" },
        { number: "45%", label: "Faster Service", icon: <TrendingUp className="w-6 h-6" />, color: "from-orange-500 to-red-500" },
        { number: "24/7", label: "Support", icon: <Clock className="w-6 h-6" />, color: "from-emerald-500 to-teal-500" },
        { number: "99.9%", label: "Uptime", icon: <Sparkles className="w-6 h-6" />, color: "from-purple-500 to-pink-500" }
    ];

    const faqs = [
        {
            q: "What is LeafClutch Technology?",
            a: "LeafClutch is a modern restaurant management platform designed to help cafes, restaurants, and hotels digitize their menus and streamline operations through QR ordering and smart admin tools."
        },
        {
            q: "Do I need to download an app?",
            a: "No! LeafClutch is entirely web-based. Customers simply scan a QR code and order directly from their browser, while admins manage everything through our sleek web dashboard."
        },
        {
            q: "How does the credit ledger work?",
            a: "The credit ledger allows you to record 'Pay Later' orders for trusted customers. You can track their total due, send reminders, and manage payments easily."
        },
        {
            q: "Can I customize my digital menu?",
            a: "Absolutely! You have full control over your menu's appearance, categories, items, and pricing. Update everything in real-time with just a few clicks."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#16516f]/5 font-sans text-slate-800 overflow-x-hidden relative">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div 
                    className="absolute top-16 left-6 w-96 h-96 bg-[#16516f]/10 rounded-full blur-3xl animate-blob"
                    style={{ transform: `translate(${mousePosition.x * 0.012}px, ${mousePosition.y * 0.012}px)` }}
                ></div>
                <div 
                    className="absolute top-24 right-6 w-[460px] h-[460px] bg-orange-400/10 rounded-full blur-3xl animate-blob animation-delay-2000"
                    style={{ transform: `translate(${mousePosition.x * -0.012}px, ${mousePosition.y * -0.012}px)` }}
                ></div>
                <div 
                    className="absolute -bottom-20 left-[55%] w-[500px] h-[500px] bg-purple-400/10 rounded-full blur-3xl animate-blob animation-delay-4000"
                    style={{ transform: `translate(${mousePosition.x * 0.006}px, ${mousePosition.y * 0.006}px)` }}
                ></div>
            </div>

            {/* Navbar */}
            <nav className="px-4 md:px-10 lg:px-20 fixed right-0 left-0 top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-slate-200/50 shadow-2xl shadow-slate-900/5">
                <div className="max-w-7xl mx-auto px-2 md:px-7 py-3 md:py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 md:gap-4 group cursor-pointer select-none" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#16516f] to-[#1a5b7d] rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                            <div className="relative w-11 h-11 md:w-14 md:h-14 bg-gradient-to-br from-[#16516f] to-[#1a5b7d] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#16516f]/30 group-hover:scale-105 transition-transform duration-300 p-2">
                                <img src={logo} alt="LeafClutch Logo" className="w-full h-full object-contain" />
                            </div>
                        </div>
                        <span className="text-2xl md:text-3xl font-black tracking-tight">
                            <span className="text-slate-900">Leaf</span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16516f] to-[#1a5b7d]">Clutch</span>
                        </span>
                    </div>
                    
                    {/* Desktop button */}
                    <div className="hidden sm:flex items-center gap-2 md:gap-4">
                        <button
                            onClick={() => navigate('/admin/login')}
                            className="relative group px-5 md:px-7 py-2.5 md:py-3 bg-gradient-to-r from-[#16516f] to-[#1a5b7d] text-white rounded-full font-bold text-sm shadow-2xl shadow-[#16516f]/20 hover:shadow-[#16516f]/40 transition-all duration-300 hover:scale-110 active:scale-98 overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Get Started
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                    </div>
                    {/* Mobile button */}
                    <div className="flex sm:hidden items-center">
                        <button
                            onClick={() => navigate('/admin/login')}
                            className="relative group px-3 py-2 bg-gradient-to-r from-[#16516f] to-[#1a5b7d] text-white rounded-full font-bold text-xs shadow-2xl shadow-[#16516f]/20 hover:shadow-[#16516f]/40 transition-all duration-300 hover:scale-105 active:scale-98 overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-1">
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                <span>Start</span>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="px-4 sm:px-8 md:px-16 lg:px-32 pt-[92px] md:pt-36 relative max-w-7xl mx-auto pb-14 md:pb-28 min-h-[90vh] flex items-center">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-center w-full">
                    <div className="space-y-8 md:space-y-10 relative z-10">
                        <div className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2.5 md:py-3 rounded-full bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-[#16516f]/10 border border-emerald-500/20 backdrop-blur-sm animate-fade-in">
                            <Zap className="w-4 h-4 md:w-5 md:h-5 text-emerald-600 animate-pulse" />
                            <span className="text-xs md:text-sm font-black text-emerald-700 tracking-wide">The Future of Dining is Here</span>
                            <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-600 animate-pulse" />
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight tracking-tight animate-slide-up">
                            <span className="text-slate-900">Digital</span>
                            <br />
                            <span className="text-slate-900">Dining,</span>
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16516f] via-[#1a5b7d] to-orange-500 animate-gradient">
                                Redefined
                            </span>
                        </h1>

                        <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed font-medium animate-slide-up-delay">
                            Transform your restaurant with cutting-edge QR ordering, real-time inventory, and powerful admin tools.
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16516f] to-orange-500 font-bold"> Join the digital revolution.</span>
                        </p>

                        <div className="flex flex-wrap gap-2 md:gap-3 pt-2.5 md:pt-4 animate-slide-up-delay-2">
                            <button 
                                onClick={() => navigate('/admin/login')}
                                className="group relative px-4 md:px-5 py-3 md:py-4 bg-gradient-to-r from-[#16516f] to-[#1a5b7d] text-white rounded-2xl font-bold text-base md:text-lg shadow-2xl shadow-[#16516f]/30 hover:shadow-[#16516f]/40 transition-all duration-300 hover:scale-110 active:scale-98 overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Get Started Free
                                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </button>

                            <button className="group px-4 md:px-5 py-3 md:py-4 bg-white/90 backdrop-blur-sm text-slate-900 border border-slate-200 rounded-2xl font-bold text-base md:text-lg hover:bg-white hover:border-[#16516f]/40 transition-all duration-300 hover:scale-110 active:scale-98 shadow-xl flex items-center gap-2 md:gap-3">
                                <Play className="w-5 h-5 md:w-6 md:h-6 text-[#16516f] group-hover:scale-110 transition-transform" />
                                Watch Demo
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-4 pt-5 md:pt-8 animate-slide-up-delay-3">
                            {stats.map((stat, i) => (
                                <div 
                                    key={i} 
                                    className="group relative p-3 md:p-5 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/50 hover:border-transparent transition-all duration-300 hover:scale-110 hover:-translate-y-2"
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
                                    <div className={`flex justify-center mb-2 md:mb-3 text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`}>
                                        {stat.icon}
                                    </div>
                                    <p className="text-xl md:text-2xl font-extrabold text-slate-900">{stat.number}</p>
                                    <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative scale-90 md:scale-110 animate-float mt-10 md:mt-0">
                        <div className="absolute -inset-2 md:-inset-7 bg-gradient-to-r from-[#16516f]/20 via-orange-400/20 to-purple-400/20 rounded-[1.5rem] md:rounded-[2.5rem] blur-3xl animate-pulse-slow"></div>
                        <div className="relative rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-900/30 border-4 border-white/80 backdrop-blur-sm transform hover:rotate-2 transition-transform duration-700 w-64 sm:w-72 md:w-full mx-auto">
                            <img
                                src="/chef.webp"
                                alt="Restaurant Hero"
                                className="w-full h-auto"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#16516f]/30 via-transparent to-transparent"></div>
                        </div>
                        {/* Floating Cards */}
                        <div className="absolute -bottom-2 md:-bottom-7 left-2 md:-left-7 bg-white/95 backdrop-blur-xl p-2.5 md:p-6 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-2 md:gap-3 max-w-[145px] md:max-w-xs hover:scale-110 transition-transform duration-300 animate-float-delay">
                            <div className="w-7 h-7 md:w-12 md:h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-xl">
                                <CheckCircle2 className="w-5 h-5 md:w-7 md:h-7 text-white" />
                            </div>
                            <div>
                                <p className="font-extrabold text-slate-900 text-sm md:text-lg">45% Faster</p>
                                <p className="text-[10px] md:text-sm text-slate-500 font-bold leading-snug">Service Speed</p>
                            </div>
                        </div>
                        <div className="absolute top-3 md:-top-7 right-3 md:-right-7 bg-gradient-to-br from-orange-400 to-red-500 p-2 md:p-5 rounded-2xl shadow-2xl animate-bounce-slow">
                            <Star className="w-5 h-5 md:w-8 md:h-8 text-white fill-white" />
                        </div>
                        <div className="absolute top-[65%] md:top-1/2 right-2 md:-right-10 bg-gradient-to-br from-[#16516f] to-[#1a5b7d] p-2 md:p-4 rounded-xl shadow-xl animate-float-delay-2">
                            <Award className="w-4 h-4 md:w-7 md:h-7 text-white" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Section */}
            <section className="py-10 md:py-20 px-4 sm:px-8 md:px-16 lg:px-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-slate-50"></div>
                <div className="relative max-w-7xl mx-auto">
                    <div className="text-center mb-10 md:mb-14 space-y-3 md:space-y-5">
                        <div className="inline-flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-full bg-gradient-to-r from-[#16516f]/10 to-purple-500/10 border border-[#16516f]/20">
                            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-[#16516f]" />
                            <span className="text-xs md:text-sm font-black text-[#16516f] uppercase tracking-widest">Features</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
                            Everything you need,{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16516f] to-orange-500">
                                nothing you don't
                            </span>
                        </h2>
                        <p className="text-base md:text-lg text-slate-600 max-w-3xl mx-auto font-medium leading-normal">
                            Powerful features designed to make your restaurant operations seamless, efficient, and profitable.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {features.map((f, i) => (
                            <div
                                key={i}
                                className="group relative bg-white/90 backdrop-blur-sm p-5 md:p-8 rounded-3xl border border-slate-200/50 hover:border-transparent transition-all duration-500 hover:scale-110 hover:-translate-y-2 shadow-xl hover:shadow-2xl"
                                style={{ animationDelay: `${i * 120}ms` }}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${f.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl -z-10 blur-lg`}></div>
                                <div className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br ${f.gradient} rounded-2xl flex items-center justify-center mb-4 md:mb-6 text-white shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500`}>
                                    {f.icon}
                                </div>
                                <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2 md:mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#16516f] group-hover:to-orange-500 transition-all duration-300">
                                    {f.title}
                                </h3>
                                <p className="text-slate-600 text-sm md:text-base leading-snug font-normal">
                                    {f.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Big Feature Section */}
            <section className="relative px-4 sm:px-8 md:px-16 lg:px-32 py-10 md:py-20 bg-gradient-to-br from-[#16516f] via-[#1a5b7d] to-[#11425c] overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
                </div>

                <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
                    <div className="space-y-7 md:space-y-10 text-white">
                        <div className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                            <Rocket className="w-4 h-4 md:w-5 md:h-5" />
                            <span className="text-xs md:text-sm font-black uppercase tracking-widest">Stand Out</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
                            Stand out from <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-yellow-300 to-orange-200">
                                the competition
                            </span>
                        </h2>
                        <p className="text-base md:text-lg text-blue-100 leading-normal font-medium">
                            Your customers expect modern, seamless experiences. LeafClutch delivers exactly that, making your restaurant feel premium and tech-forward.
                        </p>
                        <div className="space-y-3.5 md:space-y-5">
                            {[
                                "Real-time order tracking for guests",
                                "Beautiful branded digital menus",
                                "Integrated WhatsApp notifications",
                                "Seamless credit management"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2.5 md:gap-4 group">
                                    <div className="w-8 h-8 md:w-11 md:h-11 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110 border border-white/20">
                                        <ShieldCheck className="w-5 h-5 md:w-7 md:h-7 text-emerald-300" />
                                    </div>
                                    <span className="font-bold text-base md:text-lg group-hover:translate-x-2 transition-transform duration-300">
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <button 
                            onClick={() => navigate('/admin/login')}
                            className="group mt-6 md:mt-10 px-6 md:px-10 py-3 md:py-4 bg-white text-[#16516f] rounded-2xl font-bold text-base md:text-lg shadow-2xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-110 active:scale-98 flex items-center gap-2 md:gap-3"
                        >
                            Explore Features
                            <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>

                    <div className="relative mt-8 md:mt-0">
                        <div className="absolute -inset-4 md:-inset-7 bg-gradient-to-r from-orange-400/30 to-purple-400/30 rounded-[1.5rem] md:rounded-[2.5rem] blur-3xl animate-pulse-slow"></div>
                        <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border-4 border-white/40 backdrop-blur-sm hover:scale-110 transition-transform duration-700">
                            <img
                                src="/landing-qr.jpg"
                                alt="QR Scanning"
                                className="w-full h-auto"
                            />
                        </div>
                        <div className="absolute -top-5 md:-top-10 -right-5 md:-right-10 bg-gradient-to-br from-orange-400 to-red-500 p-5 md:p-8 rounded-2xl shadow-2xl animate-float">
                            <QrCode className="w-8 h-8 md:w-12 md:h-12 text-white" />
                        </div>
                        <div className="absolute -bottom-5 md:-bottom-10 -left-5 md:-left-10 bg-gradient-to-br from-[#16516f] to-[#1a5b7d] p-4 md:p-6 rounded-2xl shadow-2xl animate-float-delay">
                            <Heart className="w-7 h-7 md:w-9 md:h-9 text-white fill-white" />
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="px-2.5 sm:px-6 md:px-12 lg:px-20 py-8 md:py-16 max-w-2xl md:max-w-4xl mx-auto">
                <div className="text-center mb-8 md:mb-14 space-y-3 md:space-y-5">
                    <div className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-gradient-to-r from-[#16516f]/10 to-orange-500/10 border border-[#16516f]/20">
                        <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-[#16516f]" />
                        <span className="text-xs md:text-sm font-black text-[#16516f] uppercase tracking-widest">FAQ</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900">
                        Got <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16516f] to-orange-500">Questions?</span>
                    </h2>
                    <p className="text-base md:text-lg text-slate-600 font-medium">We've got answers</p>
                </div>

                <div className="space-y-4 md:space-y-6">
                    {faqs.map((f, i) => (
                        <div
                            key={i}
                            className="bg-white/90 backdrop-blur-sm border border-slate-200/50 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-[#16516f]/30"
                        >
                            <button
                                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                className="w-full flex items-center justify-between p-4 md:p-7 hover:bg-gradient-to-r hover:from-[#16516f]/5 hover:to-orange-500/5 transition-colors group"
                            >
                                <span className="font-bold text-base md:text-lg text-slate-800 text-left pr-3 md:pr-5 group-hover:text-[#16516f] transition-colors">{f.q}</span>
                                <ChevronDown
                                    className={`w-5 h-5 md:w-6 md:h-6 text-[#16516f] transition-transform duration-300 flex-shrink-0 ${activeFaq === i ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-500 ${activeFaq === i ? 'max-h-60' : 'max-h-0'
                                    }`}
                            >
                                <div className="p-4 md:p-7 pt-0 text-slate-600 leading-relaxed font-medium text-sm md:text-base">
                                    {f.a}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative px-2.5 sm:px-8 md:px-16 lg:px-32 py-8 md:py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#16516f] via-[#1a5b7d] to-[#11425c]"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-10"></div>

                <div className="relative max-w-xl md:max-w-4xl mx-auto text-center space-y-8 md:space-y-12 text-white">
                    <div className="inline-flex items-center gap-2 md:gap-3 px-5 md:px-7 py-2 md:py-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                        <Sparkles className="w-4 h-4 md:w-5 md:h-5 animate-pulse" />
                        <span className="text-xs md:text-sm font-black uppercase tracking-widest">Join 500+ Restaurants</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                        Ready to transform
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-orange-200">your restaurant?</span>
                    </h2>

                    <p className="text-base md:text-lg text-white/95 font-medium max-w-lg md:max-w-2xl mx-auto leading-relaxed">
                        Get your digital menu ready in minutes. No credit card required. <span className="font-bold">Start your free trial today.</span>
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 md:gap-8 pt-2 md:pt-6">
                        <button 
                            onClick={() => navigate('/admin/login')}
                            className="group px-7 md:px-12 py-4 md:py-6 bg-white text-[#16516f] rounded-2xl font-bold text-lg md:text-xl shadow-2xl hover:shadow-white/40 transition-all duration-300 hover:scale-110 active:scale-98"
                        >
                            <span className="flex items-center gap-2 md:gap-3">
                                Start Free Trial
                                <ArrowRight className="w-6 h-6 md:w-7 md:h-7 group-hover:translate-x-2 transition-transform" />
                            </span>
                        </button>

                        <button className="px-7 md:px-12 py-4 md:py-6 bg-white/10 backdrop-blur-sm text-white border border-white/30 rounded-2xl font-bold text-lg md:text-xl hover:bg-white/20 transition-all duration-300 hover:scale-110 active:scale-98 flex items-center gap-2 md:gap-3">
                            <Smartphone className="w-6 h-6 md:w-7 md:h-7" />
                            Download App
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="px-3 sm:px-8 md:px-16 lg:px-32 relative bg-white/90 backdrop-blur-2xl py-8 md:py-16 border-t border-slate-200/40 shadow-2xl shadow-slate-900/5">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-14">
                    <div className="col-span-1 md:col-span-2 space-y-4 md:space-y-8">
                        <div className="flex items-center gap-3 md:gap-4">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-[#16516f] to-[#1a5b7d] rounded-2xl flex items-center justify-center shadow-2xl p-2">
                                <img src={logo} alt="LeafClutch Logo" className="w-full h-full object-contain" />
                            </div>
                            <span className="text-2xl md:text-3xl font-black text-slate-900">
                                <span className="text-slate-900">Leaf</span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16516f] to-[#1a5b7d]">Clutch</span>
                            </span>
                        </div>
                        <p className="text-slate-600 max-w-lg leading-snug text-base md:text-lg font-medium">
                            Empowering the hospitality industry with cutting-edge digital solutions. From street food stalls to luxury resorts, we're your partner in growth.
                        </p>
                    </div>

                    {/* Make Product and Company side by side on mobile */}
                    <div className="col-span-2 grid grid-cols-2 gap-8 md:gap-14">
                        <div>
                            <h4 className="font-extrabold mb-3 md:mb-6 text-slate-700 uppercase tracking-wider text-xs md:text-sm">Product</h4>
                            <ul className="space-y-2 md:space-y-3 text-slate-600">
                                {["Features", "Digital Menu", "QR Ordering", "Inventory"].map(item => (
                                    <li key={item}>
                                        <a href="#" className="hover:text-[#16516f] transition-colors hover:translate-x-2 inline-block font-semibold text-sm md:text-base">
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-extrabold mb-3 md:mb-6 text-slate-700 uppercase tracking-wider text-xs md:text-sm">Company</h4>
                            <ul className="space-y-2 md:space-y-3 text-slate-600">
                                {["About", "Contact", "Privacy", "Terms"].map(item => (
                                    <li key={item}>
                                        <a href="#" className="hover:text-[#16516f] transition-colors hover:translate-x-2 inline-block font-semibold text-sm md:text-base">
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto pt-6 md:pt-12 mt-6 md:mt-8 border-t border-slate-200/40 text-center">
                    <p className="text-slate-500 font-medium text-base md:text-lg">
                        &copy; {new Date().getFullYear()} LeafClutch Technology. Crafted with <Heart className="w-5 h-5 inline text-red-500 fill-red-500" /> for modern hospitality.
                    </p>
                </div>
            </footer>

            {/* Custom Animations */}
            <style>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1.08); }
                    25% { transform: translate(28px, -52px) scale(1.14); }
                    50% { transform: translate(-26px, 25px) scale(1.02); }
                    75% { transform: translate(48px, 52px) scale(1.09); }
                }
                .animate-blob {
                    animation: blob 8.3s infinite ease-in-out;
                }
                .animation-delay-2000 {
                    animation-delay: 2.2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4.4s;
                }
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-gradient {
                    background-size: 220% 220%;
                    animation: gradient 5s ease infinite;
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.7; }
                    50% { opacity: 1; }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 6.5s ease-in-out infinite;
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-30px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 5.1s ease-in-out infinite;
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg) scale(1.04); }
                    50% { transform: translateY(-26px) rotate(5deg) scale(1.13); }
                }
                .animate-float {
                    animation: float 7.1s ease-in-out infinite;
                }
                .animate-float-delay {
                    animation: float 7.1s ease-in-out infinite;
                    animation-delay: 1.6s;
                }
                .animate-float-delay-2 {
                    animation: float 7.1s ease-in-out infinite;
                    animation-delay: 3.1s;
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-14px) scale(1.07); }
                    to { opacity: 1; transform: translateY(0) scale(1.08);}
                }
                .animate-fade-in {
                    animation: fade-in 1.1s ease-out;
                }
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(27px) scale(1.07);}
                    to { opacity: 1; transform: translateY(0);}
                }
                .animate-slide-up {
                    animation: slide-up 1.1s ease-out;
                }
                .animate-slide-up-delay {
                    animation: slide-up 1.1s ease-out 0.28s both;
                }
                .animate-slide-up-delay-2 {
                    animation: slide-up 1.1s ease-out 0.6s both;
                }
                .animate-slide-up-delay-3 {
                    animation: slide-up 1.1s ease-out 0.9s both;
                }
            `}</style>
        </div>
    );
};

export default LandingPage;
