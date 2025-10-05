import { useState } from 'react';
import { Shield, AlertCircle, Lock, Mail, User, Eye, EyeOff, Activity, Fingerprint, Waves } from 'lucide-react';

interface User {
  email: string;
  fullName?: string;
}

interface AuthProps {
  onSignIn: (user: User) => void;
}

export default function Auth({ onSignIn }: AuthProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isSignUp) {
        // Simple sign up - just validate and show success
        if (!email || !password || !fullName) {
          throw new Error('All fields are required');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        setSuccess('Account created successfully! Please sign in.');
        setIsSignUp(false);
        setEmail('');
        setPassword('');
        setFullName('');
      } else {
        // Simple sign in - check against demo credentials
        if (email === 'admin@gmail.com' && password === '123456789') {
          setSuccess('Signed in successfully!');
          onSignIn({ email, fullName: 'Admin User' });
        } else {
          throw new Error('Invalid email or password');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050d1a] via-[#0a1628] to-[#0f1f35] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[#4a9eff]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-[#4a9eff]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4a9eff]/3 rounded-full blur-3xl"></div>

        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(74, 158, 255, 0.1)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
        <div className="hidden lg:flex flex-col justify-center space-y-8 px-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-[#4a9eff] to-[#2d7dd2] p-4 rounded-2xl shadow-lg shadow-[#4a9eff]/20">
                <Shield className="w-12 h-12 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white tracking-tight">
                  Campus Security
                </h1>
                <p className="text-xl text-[#4a9eff] font-semibold">Entity Resolution System</p>
              </div>
            </div>

            <p className="text-slate-300 text-lg leading-relaxed mt-6">
              Advanced multi-modal entity tracking and security monitoring platform for modern campus environments.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-[#1a2942]/50 backdrop-blur-sm border border-[#4a9eff]/20 rounded-xl p-4 hover:border-[#4a9eff]/40 transition-all group">
              <div className="bg-[#4a9eff]/10 w-12 h-12 rounded-lg flex items-center justify-center mb-3 group-hover:bg-[#4a9eff]/20 transition-colors">
                <Activity className="w-6 h-6 text-[#4a9eff]" />
              </div>
              <h3 className="text-white font-semibold mb-1">Real-time Tracking</h3>
              <p className="text-slate-400 text-sm">Monitor entity movements across campus</p>
            </div>

            <div className="bg-[#1a2942]/50 backdrop-blur-sm border border-[#4a9eff]/20 rounded-xl p-4 hover:border-[#4a9eff]/40 transition-all group">
              <div className="bg-[#4a9eff]/10 w-12 h-12 rounded-lg flex items-center justify-center mb-3 group-hover:bg-[#4a9eff]/20 transition-colors">
                <Fingerprint className="w-6 h-6 text-[#4a9eff]" />
              </div>
              <h3 className="text-white font-semibold mb-1">Identity Resolution</h3>
              <p className="text-slate-400 text-sm">Cross-source entity matching</p>
            </div>

            <div className="bg-[#1a2942]/50 backdrop-blur-sm border border-[#4a9eff]/20 rounded-xl p-4 hover:border-[#4a9eff]/40 transition-all group">
              <div className="bg-[#4a9eff]/10 w-12 h-12 rounded-lg flex items-center justify-center mb-3 group-hover:bg-[#4a9eff]/20 transition-colors">
                <Waves className="w-6 h-6 text-[#4a9eff]" />
              </div>
              <h3 className="text-white font-semibold mb-1">Predictive Analysis</h3>
              <p className="text-slate-400 text-sm">ML-powered behavior prediction</p>
            </div>

            <div className="bg-[#1a2942]/50 backdrop-blur-sm border border-[#4a9eff]/20 rounded-xl p-4 hover:border-[#4a9eff]/40 transition-all group">
              <div className="bg-[#4a9eff]/10 w-12 h-12 rounded-lg flex items-center justify-center mb-3 group-hover:bg-[#4a9eff]/20 transition-colors">
                <Lock className="w-6 h-6 text-[#4a9eff]" />
              </div>
              <h3 className="text-white font-semibold mb-1">Secure Access</h3>
              <p className="text-slate-400 text-sm">Enterprise-grade security</p>
            </div>
          </div>

          <div className="flex items-center gap-6 pt-6 border-t border-slate-700/50">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">7000+</p>
              <p className="text-slate-400 text-sm">Active Entities</p>
            </div>
            <div className="h-12 w-px bg-slate-700"></div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">94.7%</p>
              <p className="text-slate-400 text-sm">Resolution Rate</p>
            </div>
            <div className="h-12 w-px bg-slate-700"></div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">24/7</p>
              <p className="text-slate-400 text-sm">Monitoring</p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto lg:mx-0">
          <div className="lg:hidden flex items-center justify-center mb-8">
            <div className="bg-gradient-to-br from-[#4a9eff] to-[#2d7dd2] p-3 rounded-xl shadow-lg shadow-[#4a9eff]/20">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold text-white">Campus Security</h1>
              <p className="text-sm text-[#4a9eff]">Entity Resolution System</p>
            </div>
          </div>

          <div className="bg-[#1a2942]/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
            <div className="bg-gradient-to-r from-[#4a9eff]/10 to-transparent p-6 border-b border-slate-700/50">
              <h2 className="text-2xl font-bold text-white mb-2">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-slate-400">
                {isSignUp
                  ? 'Register for secure access to the system'
                  : 'Sign in to access the security operations center'}
              </p>
            </div>

            <div className="p-6">
              <div className="flex mb-6 bg-[#0f1d30]/80 backdrop-blur-sm rounded-xl p-1 border border-slate-700/30">
                <button
                  onClick={() => {
                    setIsSignUp(false);
                    setError(null);
                    setSuccess(null);
                  }}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    !isSignUp
                      ? 'bg-gradient-to-r from-[#4a9eff] to-[#3d8ae6] text-white shadow-lg shadow-[#4a9eff]/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setIsSignUp(true);
                    setError(null);
                    setSuccess(null);
                  }}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isSignUp
                      ? 'bg-gradient-to-r from-[#4a9eff] to-[#3d8ae6] text-white shadow-lg shadow-[#4a9eff]/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {error && (
                <div className="mb-5 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-300">{error}</p>
                  </div>
                </div>
              )}

              {success && (
                <div className="mb-5 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl animate-in slide-in-from-top-2 duration-300">
                  <p className="text-sm font-medium text-emerald-300">{success}</p>
                </div>
              )}

              {!isSignUp && (
                <div className="mb-5 p-4 bg-[#4a9eff]/10 border border-[#4a9eff]/30 rounded-xl">
                  <p className="text-sm font-medium text-[#4a9eff] mb-3">Quick Access (Demo)</p>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('admin@gmail.com');
                      setPassword('123456789');
                    }}
                    className="w-full bg-gradient-to-r from-[#4a9eff]/20 to-[#3d8ae6]/20 hover:from-[#4a9eff]/30 hover:to-[#3d8ae6]/30 text-[#4a9eff] font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 border border-[#4a9eff]/30 hover:border-[#4a9eff]/50"
                  >
                    Use Demo Credentials
                  </button>
                </div>
              )}

              <form onSubmit={handleAuth} className="space-y-5">
                {isSignUp && (
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-300">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="w-5 h-5 text-slate-500" />
                      </div>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="w-full pl-12 pr-4 py-3.5 bg-[#0f1d30]/80 backdrop-blur-sm border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4a9eff] focus:border-transparent transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-slate-500" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-[#0f1d30]/80 backdrop-blur-sm border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4a9eff] focus:border-transparent transition-all"
                      placeholder="user@campus.edu"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-300">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-slate-500" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full pl-12 pr-12 py-3.5 bg-[#0f1d30]/80 backdrop-blur-sm border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4a9eff] focus:border-transparent transition-all"
                      placeholder={isSignUp ? 'Create a secure password' : 'Enter your password'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {isSignUp && (
                    <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Minimum 6 characters required
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#4a9eff] to-[#3d8ae6] hover:from-[#3d8ae6] hover:to-[#2d7dd2] text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#4a9eff]/30 hover:shadow-[#4a9eff]/50 hover:scale-[1.02] active:scale-[0.98] mt-6"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : isSignUp ? (
                    <span className="flex items-center justify-center gap-2">
                      Create Secure Account
                      <Shield className="w-4 h-4" />
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Access Security Center
                      <Lock className="w-4 h-4" />
                    </span>
                  )}
                </button>
              </form>

              {!isSignUp && (
                <div className="mt-6 text-center">
                  <button className="text-sm text-[#4a9eff] hover:text-[#3d8ae6] font-medium transition-colors hover:underline">
                    Forgot your password?
                  </button>
                </div>
              )}
            </div>

            <div className="bg-[#0f1d30]/50 backdrop-blur-sm px-6 py-4 border-t border-slate-700/50">
              <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                <Lock className="w-3 h-3" />
                <p>Authorized personnel only. All access attempts are logged and monitored.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
