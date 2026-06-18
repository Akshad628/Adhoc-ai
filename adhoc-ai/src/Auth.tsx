import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Phone, Building, ArrowRight, Globe, Monitor, Loader2 } from 'lucide-react';
import { useAuthStore } from './store/useAuthStore';

export default function Auth({ onLogin }: { onLogin?: () => void }) {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();
    const { user, isAuthenticated, login, signup, isLoading, initialize } = useAuthStore();
    const [error, setError] = useState('');

    // Login Form State
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Signup Form State
    const [signupRole, setSignupRole] = useState<'student' | 'admin' | 'faculty' | 'counsellor' | 'parent' | 'placement' | ''>('');
    const [signupName, setSignupName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPhone, setSignupPhone] = useState('');
    const [signupInstitution, setSignupInstitution] = useState('');
    const [signupPassword, setSignupPassword] = useState('');

    // Onboarding Form State
    const [isOnboarding, setIsOnboarding] = useState(false);
    const [oauthToken, setOauthToken] = useState('');
    const [onboardingFirstName, setOnboardingFirstName] = useState('');
    const [onboardingLastName, setOnboardingLastName] = useState('');
    const [onboardingPhone, setOnboardingPhone] = useState('');
    const [onboardingRoll, setOnboardingRoll] = useState('');
    const [onboardingBranch, setOnboardingBranch] = useState('CSE');
    const [onboardingSemester, setOnboardingSemester] = useState(1);
    const [onboardingStudentRoll, setOnboardingStudentRoll] = useState('');
    const [onboardingEmpId, setOnboardingEmpId] = useState('');
    const [onboardingDept, setOnboardingDept] = useState('CSE');
    const [onboardingDesg, setOnboardingDesg] = useState('Assistant Professor');

    // If already authenticated, redirect to correct dashboard
    useEffect(() => {
        if (isAuthenticated && user) {
            navigate(`/dashboard/${user.role}`, { replace: true });
            if (onLogin) onLogin();
        }
    }, [isAuthenticated, user, navigate, onLogin]);

    // Parse URL tokens from Google / Microsoft SSO Callback redirects
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const onboarding = params.get('onboarding');

        if (token) {
            if (onboarding === 'true') {
                setIsOnboarding(true);
                setOauthToken(token);
            } else {
                // User already has a role. Retrieve profile from database.
                const fetchUserProfile = async () => {
                    try {
                        const response = await fetch('http://localhost:8000/api/v1/auth/me', {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        if (response.ok) {
                            const userData = await response.json();
                            localStorage.setItem('adhoc_token', token);
                            localStorage.setItem('adhoc_user', JSON.stringify(userData));
                            initialize();
                        } else {
                            setError('SSO verification failed to fetch user profile details.');
                        }
                    } catch (err) {
                        console.error(err);
                        setError('Connection to backend failed during SSO login verification.');
                    }
                };
                fetchUserProfile();
            }
        }
    }, [initialize]);

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!loginEmail || !loginPassword) {
            setError('Please enter both email and password.');
            return;
        }

        // Deduce role from email for quick prototype navigation convenience
        let derivedRole: typeof signupRole = 'student';
        const lowerEmail = loginEmail.toLowerCase();
        if (lowerEmail.includes('admin')) derivedRole = 'admin';
        else if (lowerEmail.includes('faculty')) derivedRole = 'faculty';
        else if (lowerEmail.includes('counsellor')) derivedRole = 'counsellor';
        else if (lowerEmail.includes('parent')) derivedRole = 'parent';
        else if (lowerEmail.includes('placement')) derivedRole = 'placement';

        const success = await login(loginEmail, derivedRole);
        if (!success) {
            setError('Failed to log in. Please try again.');
        }
    };

    const handleSignupSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!signupRole) {
            setError('Please select a role.');
            return;
        }
        if (!signupName || !signupEmail || !signupPassword) {
            setError('Please fill in all required fields.');
            return;
        }

        const success = await signup({
            email: signupEmail,
            fullName: signupName,
            role: signupRole,
            phone: signupPhone || undefined,
            institutionName: signupInstitution || undefined,
        });

        if (!success) {
            setError('Failed to create account. Please try again.');
        }
    };

    const handleOnboardingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!signupRole) {
            setError('Please select an institutional role.');
            return;
        }
        if (!onboardingFirstName || !onboardingLastName) {
            setError('First name and Last name are required.');
            return;
        }

        const payload: any = {
            role: signupRole,
            first_name: onboardingFirstName,
            last_name: onboardingLastName,
            phone: onboardingPhone || undefined
        };

        if (signupRole === 'student') {
            if (!onboardingRoll || !onboardingBranch) {
                setError('Student roll number and branch are required.');
                return;
            }
            payload.roll_number = onboardingRoll;
            payload.branch = onboardingBranch;
            payload.semester = onboardingSemester;
        } else if (signupRole === 'parent') {
            payload.student_roll_number = onboardingStudentRoll || undefined;
        } else if (signupRole === 'faculty') {
            if (!onboardingEmpId || !onboardingDept) {
                setError('Employee ID and department are required.');
                return;
            }
            payload.employee_id = onboardingEmpId;
            payload.department = onboardingDept;
            payload.designation = onboardingDesg;
        }

        try {
            const response = await fetch('http://localhost:8000/api/v1/auth/onboarding', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${oauthToken}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('adhoc_token', data.access_token);
                localStorage.setItem('adhoc_user', JSON.stringify(data.user));
                initialize();
            } else {
                const errData = await response.json();
                setError(errData.detail || 'Failed to finalize profile onboarding.');
            }
        } catch (err) {
            console.error(err);
            setError('Network error connecting to the backend for onboarding.');
        }
    };

    return (
        <div className="min-h-screen flex bg-background text-white font-sans overflow-hidden">

            {/* LEFT SCREEN - BRANDING & ANIMATION */}
            <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center p-16 overflow-hidden border-r border-white/5 bg-black">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-primary/20 blur-[120px] rounded-full animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-secondary/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="z-10 max-w-lg relative">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent mb-6">
                        ADhoc.ai
                    </h1>
                    <h2 className="text-5xl font-bold tracking-tight leading-tight mb-6">
                        Intelligence,<br />Automated.
                    </h2>
                    <p className="text-lg text-gray-400">
                        Sign in to access your enterprise AI dashboard, manage institutional workflows, and communicate seamlessly.
                    </p>
                </div>
            </div>

            {/* RIGHT SCREEN - AUTHENTICATION FORMS */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 z-10 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-surface to-background z-0 lg:hidden"></div>

                <motion.div
                    layout
                    className="w-full max-w-md bg-panel/80 backdrop-blur-2xl border border-white/10 rounded-[28px] p-8 shadow-2xl z-10"
                >
                    {isOnboarding ? (
                        <div>
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-accent-primary to-orange-500 bg-clip-text text-transparent">
                                    Complete Profile
                                </h2>
                                <p className="text-xs text-gray-400 mt-2">
                                    Select your institutional role to finalize your ADhoc.ai account setup.
                                </p>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-3 mb-4 text-center">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleOnboardingSubmit} className="max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar space-y-4">
                                <div className="relative">
                                    <label className="text-xs text-gray-400 block mb-1">Select Role</label>
                                    <select
                                        value={signupRole}
                                        onChange={(e: any) => setSignupRole(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-accent-primary/50 appearance-none"
                                        required
                                    >
                                        <option value="" disabled className="bg-surface">Select Role</option>
                                        <option value="student" className="bg-surface">Student</option>
                                        <option value="parent" className="bg-surface">Parent</option>
                                        <option value="faculty" className="bg-surface">Faculty</option>
                                        <option value="counsellor" className="bg-surface">Counsellor</option>
                                        <option value="placement" className="bg-surface">Placement Officer</option>
                                        <option value="admin" className="bg-surface">Administrator</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-400 block mb-1">First Name</label>
                                        <input
                                            type="text"
                                            placeholder="First Name"
                                            value={onboardingFirstName}
                                            onChange={(e) => setOnboardingFirstName(e.target.value)}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent-primary/50 transition-colors"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 block mb-1">Last Name</label>
                                        <input
                                            type="text"
                                            placeholder="Last Name"
                                            value={onboardingLastName}
                                            onChange={(e) => setOnboardingLastName(e.target.value)}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent-primary/50 transition-colors"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs text-gray-400 block mb-1">Mobile Number (Optional)</label>
                                    <input
                                        type="tel"
                                        placeholder="+91 XXXXX XXXXX"
                                        value={onboardingPhone}
                                        onChange={(e) => setOnboardingPhone(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent-primary/50 transition-colors"
                                    />
                                </div>

                                {signupRole === 'student' && (
                                    <>
                                        <div>
                                            <label className="text-xs text-gray-400 block mb-1">Roll Number</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. 21R11A0501"
                                                value={onboardingRoll}
                                                onChange={(e) => setOnboardingRoll(e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent-primary/50 transition-colors"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-400 block mb-1">Branch</label>
                                            <select
                                                value={onboardingBranch}
                                                onChange={(e) => setOnboardingBranch(e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent-primary/50"
                                                required
                                            >
                                                <option value="CSE" className="bg-surface">Computer Science (CSE)</option>
                                                <option value="CSE (AI&ML)" className="bg-surface">CSE (Artificial Intelligence & Machine Learning)</option>
                                                <option value="CSE (DS)" className="bg-surface">CSE (Data Science)</option>
                                                <option value="ECE" className="bg-surface">Electronics & Communication (ECE)</option>
                                                <option value="EEE" className="bg-surface">Electrical & Electronics (EEE)</option>
                                                <option value="ME" className="bg-surface">Mechanical Engineering (ME)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-400 block mb-1">Current Semester</label>
                                            <select
                                                value={onboardingSemester}
                                                onChange={(e) => setOnboardingSemester(Number(e.target.value))}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent-primary/50"
                                                required
                                            >
                                                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                                                    <option key={sem} value={sem} className="bg-surface">Semester {sem}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </>
                                )}

                                {signupRole === 'parent' && (
                                    <div>
                                        <label className="text-xs text-gray-400 block mb-1">Student Roll Number (Optional)</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 21R11A0501"
                                            value={onboardingStudentRoll}
                                            onChange={(e) => setOnboardingStudentRoll(e.target.value)}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent-primary/50 transition-colors"
                                        />
                                    </div>
                                )}

                                {signupRole === 'faculty' && (
                                    <>
                                        <div>
                                            <label className="text-xs text-gray-400 block mb-1">Employee ID</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. EMP12345"
                                                value={onboardingEmpId}
                                                onChange={(e) => setOnboardingEmpId(e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent-primary/50 transition-colors"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-400 block mb-1">Department</label>
                                            <select
                                                value={onboardingDept}
                                                onChange={(e) => setOnboardingDept(e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent-primary/50"
                                                required
                                            >
                                                <option value="CSE" className="bg-surface">Computer Science (CSE)</option>
                                                <option value="ECE" className="bg-surface">Electronics & Communication (ECE)</option>
                                                <option value="EEE" className="bg-surface">Electrical & Electronics (EEE)</option>
                                                <option value="ME" className="bg-surface">Mechanical Engineering (ME)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-400 block mb-1">Designation</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Assistant Professor"
                                                value={onboardingDesg}
                                                onChange={(e) => setOnboardingDesg(e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent-primary/50 transition-colors"
                                                required
                                            />
                                        </div>
                                    </>
                                )}

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-accent-primary to-orange-600 hover:to-orange-500 text-white font-medium py-3 rounded-full flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(255,122,24,0.2)] transition-all hover:shadow-[0_0_25px_rgba(255,122,24,0.4)]"
                                >
                                    <span>Complete Registration</span>
                                    <ArrowRight size={18} />
                                </button>
                            </form>
                        </div>
                    ) : (
                        <>
                            {/* Toggle Tabs */}
                            <div className="flex bg-black/40 rounded-full p-1 mb-8 border border-white/5">
                                <button
                                    onClick={() => {
                                        setIsLogin(true);
                                        setError('');
                                    }}
                                    className={`flex-1 text-sm font-medium py-2 rounded-full transition-all ${isLogin ? 'bg-surface text-white shadow-md border border-white/10' : 'text-gray-500 hover:text-white'}`}
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => {
                                        setIsLogin(false);
                                        setError('');
                                    }}
                                    className={`flex-1 text-sm font-medium py-2 rounded-full transition-all ${!isLogin ? 'bg-surface text-white shadow-md border border-white/10' : 'text-gray-500 hover:text-white'}`}
                                >
                                    Sign Up
                                </button>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-3 mb-4 text-center">
                                    {error}
                                </div>
                            )}

                            <AnimatePresence mode="wait">
                                {isLogin ? (
                                    <form onSubmit={handleLoginSubmit} key="login">
                                        <div className="space-y-4 mb-6">
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                                <input
                                                    type="email"
                                                    placeholder="Email Address"
                                                    value={loginEmail}
                                                    onChange={(e) => setLoginEmail(e.target.value)}
                                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-accent-primary/50 transition-colors"
                                                    required
                                                />
                                            </div>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                                <input
                                                    type="password"
                                                    placeholder="Password"
                                                    value={loginPassword}
                                                    onChange={(e) => setLoginPassword(e.target.value)}
                                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-accent-primary/50 transition-colors"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mb-8 text-sm">
                                            <label className="flex items-center space-x-2 cursor-pointer group">
                                                <input type="checkbox" className="sr-only" />
                                                <div className="w-4 h-4 rounded border border-white/20 bg-black/20 group-hover:border-accent-primary/50 transition-colors flex items-center justify-center"></div>
                                                <span className="text-gray-400 group-hover:text-white transition-colors">Remember me</span>
                                            </label>
                                            <a href="#" className="text-accent-primary hover:text-orange-400 transition-colors">Forgot Password?</a>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full bg-gradient-to-r from-accent-primary to-orange-600 hover:to-orange-500 text-white font-medium py-3 rounded-full flex items-center justify-center space-x-2 mb-6 shadow-[0_0_20px_rgba(255,122,24,0.2)] transition-all hover:shadow-[0_0_25px_rgba(255,122,24,0.4)] disabled:opacity-50"
                                        >
                                            {isLoading ? (
                                                <Loader2 className="animate-spin h-5 w-5" />
                                            ) : (
                                                <>
                                                    <span>Continue</span>
                                                    <ArrowRight size={18} />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                ) : (
                                    <form onSubmit={handleSignupSubmit} key="signup" className="max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                                        <div className="space-y-4 mb-6">
                                            <div className="relative">
                                                <select
                                                    value={signupRole}
                                                    onChange={(e: any) => setSignupRole(e.target.value)}
                                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-accent-primary/50 appearance-none"
                                                    required
                                                >
                                                    <option value="" disabled className="bg-surface">Select Role</option>
                                                    <option value="student" className="bg-surface">Student</option>
                                                    <option value="parent" className="bg-surface">Parent</option>
                                                    <option value="faculty" className="bg-surface">Faculty</option>
                                                    <option value="counsellor" className="bg-surface">Counsellor</option>
                                                    <option value="placement" className="bg-surface">Placement Officer</option>
                                                    <option value="admin" className="bg-surface">Administrator</option>
                                                </select>
                                            </div>

                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                                <input
                                                    type="text"
                                                    placeholder="Full Name"
                                                    value={signupName}
                                                    onChange={(e) => setSignupName(e.target.value)}
                                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-accent-primary/50 transition-colors"
                                                    required
                                                />
                                            </div>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                                <input
                                                    type="email"
                                                    placeholder="Email Address"
                                                    value={signupEmail}
                                                    onChange={(e) => setSignupEmail(e.target.value)}
                                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-accent-primary/50 transition-colors"
                                                    required
                                                />
                                            </div>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                                <input
                                                    type="tel"
                                                    placeholder="Mobile Number"
                                                    value={signupPhone}
                                                    onChange={(e) => setSignupPhone(e.target.value)}
                                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-accent-primary/50 transition-colors"
                                                />
                                            </div>
                                            <div className="relative">
                                                <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                                <input
                                                    type="text"
                                                    placeholder="Institution Name"
                                                    value={signupInstitution}
                                                    onChange={(e) => setSignupInstitution(e.target.value)}
                                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-accent-primary/50 transition-colors"
                                                />
                                            </div>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                                <input
                                                    type="password"
                                                    placeholder="Password"
                                                    value={signupPassword}
                                                    onChange={(e) => setSignupPassword(e.target.value)}
                                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-accent-primary/50 transition-colors"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full bg-gradient-to-r from-accent-primary to-orange-600 hover:to-orange-500 text-white font-medium py-3 rounded-full flex items-center justify-center space-x-2 mb-6 shadow-[0_0_20px_rgba(255,122,24,0.2)] transition-all hover:shadow-[0_0_25px_rgba(255,122,24,0.4)] disabled:opacity-50"
                                        >
                                            {isLoading ? (
                                                <Loader2 className="animate-spin h-5 w-5" />
                                            ) : (
                                                <>
                                                    <span>Create Account</span>
                                                    <ArrowRight size={18} />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </AnimatePresence>

                            <div className="relative flex items-center justify-center mb-6">
                                <div className="border-t border-white/10 w-full absolute"></div>
                                <span className="bg-panel px-4 text-xs text-gray-500 relative z-10">OR CONTINUE WITH</span>
                            </div>

                            <div className="flex flex-col space-y-3">
                                <button 
                                    type="button" 
                                    onClick={() => window.location.href = 'http://localhost:8000/api/v1/auth/google'}
                                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 hover:scale-[1.02]"
                                >
                                    <Globe size={18} className="text-gray-300" />
                                    <span className="text-sm font-medium text-gray-300">Continue with Google</span>
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => window.location.href = 'http://localhost:8000/api/v1/auth/microsoft'}
                                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 hover:scale-[1.02]"
                                >
                                    <Monitor size={18} className="text-gray-300" />
                                    <span className="text-sm font-medium text-gray-300">Continue with Microsoft</span>
                                </button>
                            </div>
                        </>
                    )}
                </motion.div>
            </div>

            {/* Required for the custom scrollbar in Signup */}
            <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 122, 24, 0.5);
        }
      `}</style>
        </div>
    );
}