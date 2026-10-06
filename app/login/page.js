"use client"
//============================================================================
import { useEffect, useState } from 'react';
import { useAuth } from '../../controllers/auth';
import Loader from '../../components/ui/status/Loader';
import SuccessStatus from '../../components/ui/status/Success';
import ErrorStatus from '../../components/ui/status/Error';
import Image from 'next/image';

import { useRouter } from 'next/navigation';
import IdleTimeContainer from '../../autoLogout';
import { Eye, EyeOff } from 'lucide-react';
import { getSessionCache } from '../../utils/sessionCache';
//============================================================================

const SuperAdminLogin = () => {

  const router = useRouter();
  const Context = getSessionCache("dashboardContext");
  // useEffect(() => {
  //   if (params.get('reason') === 'expired') {
  //     toast.error('Your session has expired. Please log in again.');
  //   }
  // }, [params]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const guid = localStorage.getItem('guid');
      console.log('Context _________________________________', Context !== null, Context, guid)

      if (Context !== null) {
        router.replace('/dashboard');
      }
    }
  }, [router]);



  //============================================================================
  const [circleStyles, setCircleStyles] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Only runs on client, so SSR/CSR match
    setCircleStyles(
      Array.from({ length: 6 }).map((_, i) => ({
        width: `${Math.random() * 300 + 100}px`,
        height: `${Math.random() * 300 + 100}px`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animation: `float-${i} ${Math.random() * 20 + 15}s ease-in-out infinite`,
      }))
    );
  }, []);
  //============================================================================

  const [loginMethod, setLoginMethod] = useState('phone'); // 'phone' or 'email'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [apiResponse, setApiResponse] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  //============================================================================
  const { getUserByPhone, userLogin } = useAuth(); // Get the mutation hook





  const handleGetUserFromUserPhoneNumber = async (e) => {

    e.preventDefault();
    setLoading(true);
    // setError('');

    // Check for phone number login
    if (!phoneNumber || phoneNumber.length < 10) {
      // setError('Please enter a valid phone number');
      setLoading(false);
      return;
    }

    setSendingOtp(true);

    try {
      // Call your login API for phone number (send OTP)
      const result = await getUserByPhone(phoneNumber);
      if (result.success) {
        setShowSuccess(true);
        setApiResponse({ userName: result.data?.results?.name, message: result.data?.results?.message });
        // console.log('Logged in:', result.data);
        setIsOtpSent(true);

      } else {

        setError(true);
        setApiResponse({ status: 'error', message: result.error });
      }
      setSendingOtp(false);
      setLoading(false);
    } catch (error) {
      setSendingOtp(false);
      setLoading(false);
    }


  };

  const handleUserAccountLogin = async (e) => {
    setShowSuccess(false);
    setError(false);


    e.preventDefault();
    setLoading(true);
    // setError('');

    // Check for phone number login
    if (!password) {
      // setError('Please enter a valid phone number');
      setLoading(false);
      return;
    }

    setSendingOtp(true);

    try {
      // Call your login API for phone number (send OTP)
      const result = await userLogin(password);
      if (result.success) {

        setApiResponse({ userName: result.data?.results?.brand_name, message: result.data?.results?.message });
        setShowSuccess(true);
        // console.log("before profile selection:", session, profile);

        router.push('/profile-selection');

      } else {

        setError(true);
        setApiResponse({ status: 'error', message: result.error });
        // console.error('Error:', result);
      }
      setSendingOtp(false);
      setLoading(false);
    } catch (error) {
      setSendingOtp(false);
      setLoading(false);
    }
    return;


  };





  const resetOtp = () => {
    setIsOtpSent(false);
    setOtp(['', '', '', '', '', '']);
  };

  //============================================================================

  return (
    <div className="flex flex-col lg:flex-row min-h-screen  ">
      {/* <IdleTimeContainer /> */}



      {/* Status notifications */}
      {showSuccess && (
        <SuccessStatus user={apiResponse?.userName} message={apiResponse?.message} />
      )}
      {error && (
        <ErrorStatus message={apiResponse} />
      )}
      
      {/* Left Section - Brand Info */}
      <div className="hidden lg:flex flex-col justify-center  w-1/2 p-16 text-gray bg-white relative overflow-hidden">
        {/* Animated circles background */}
        <div className="absolute inset-10 overflow-hidden">
          {circleStyles.map((style, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-background backdrop-blur-xl bg-accent"
              style={style}
            />
          ))}
        </div>

        <div className="relative z-10">
          {/* Logo and Heading */}
          <div className="flex items-center mb-12">
            <div className="relative">
              <div className="relative w-28 h-28">
                <div className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-[#1981ee] to-[#15487d] dark:from-[#1981ee] dark:to-[#15487d] shadow-lg animate-pulse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white dark:bg-[#171717] flex items-center justify-center shadow-md">
                  <Image
                    src={'/logo/logo.png'}
                    alt="InfoEight Logo"
                    fill
                    className="object-contain bg-white rounded-full "
                    priority
                  />

                </div>
                <div className="absolute -inset-2 rounded-full border-2 border-[#ffffff]/20 dark:border-[#ffffff]/10 animate-spin-slow" />
              </div>
            </div>
            <div className="ml-6">
              <div className="text-sm uppercase tracking-widest text-[color:var(--color-navy-blue)]  mb-1">Web Portal</div>
              <h1 className="text-4xl font-extrabold tracking-tight text-[color:var(--color-blue-text)]">
                info<span className="text-[color:var(--color-navy-blue)]">EIGHT</span>
              </h1>

            </div>
          </div>

          {/* Description */}
          <p className="text-lg mb-12 leading-relaxed opacity-90 text-gray/80 max-w-xl">
            Your all-in-one management solution for seamless academic operations, real-time analytics, and enhanced parent-teacher engagement.          </p>

          {/* Feature tiles */}
          <div className="grid grid-cols-2 gap-6 mb-12">
            <div className="p-6 rounded-2xl bg-white shadow shadow-md backdrop-blur-lg hover:bg-white/15 transition-all">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="text-xl font-semibold text-[color:var(--color-navy-blue)] mb-2">Powerful Dashboard</h3>
              <p className="text-gray/80">Real-time analytics and insights for data-driven decisions.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white shadow shadow-md backdrop-blur-lg hover:bg-white/15 transition-all">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-xl font-semibold text-[color:var(--color-navy-blue)] mb-2">Effortless Efficiency</h3>
              <p className="text-gray/80">Streamlined operations for faster attendance, grading, and scheduling.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white shadow shadow-md backdrop-blur-lg hover:bg-white/15 transition-all">
              <div className="text-3xl mb-3">📞</div>
              <h3 className="text-xl font-semibold text-[color:var(--color-navy-blue)] mb-2">Connected Campus</h3>
              <p className="text-gray/80">Real-time updates and seamless parent-teacher communication.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white shadow shadow-md backdrop-blur-lg hover:bg-white/15 transition-all">
              <div className="text-3xl mb-3">📚</div>
              <h3 className="text-xl font-semibold text-[color:var(--color-navy-blue)] mb-2">Smart Academics</h3>
              <p className="text-gray/80">Manage classes, exams, and student progress with speed and precision.</p>
            </div>
          </div>

          {/* Footer links */}
          <div className="mt-auto pt-6 border-t border-white/10 flex justify-between text-sm text-gray/60">
            <div className="flex gap-6">
              <a href="#" className="hover:text-[color:var(--color-navy-blue)] transition-all">About</a>
              <a href="#" className="hover:text-[color:var(--color-navy-blue)] transition-all">Terms</a>
              <a href="#" className="hover:text-[color:var(--color-navy-blue)] transition-all">Privacy</a>
            </div>
            <div>© 2025 infoEight. All rights reserved.</div>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div

        className="flex items-center justify-center w-full lg:w-1/2 p-4 sm:p-8 min-h-screen bg-gray-800"
        style={{
          backgroundImage: "url('/bg/appbackground@2x.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >

        <div className="w-full max-w-md">
          {/* Mobile-only logo */}
          <div className="flex items-center justify-center mb-8 lg:hidden">
            <div className="flex items-center">
              <div className=" -translate-x-1/8 -translate-y-1/8 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-white dark:bg-[#171717] flex items-center justify-center shadow-md">
                <Image
                  src={'/logo/logo.png'}
                  alt="InfoEight Logo"
                  fill
                  className="object-contain bg-white rounded-full"
                  priority
                />
              </div>
              <div>
                <div className="text-center  text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">Web Portal</div>
                <h1 className="text-4xl font-extrabold tracking-tight text-[color:var(--color-blue-text)]">
                  info<span className="text-[color:var(--color-navy-blue)]">EIGHT</span>
                </h1>
              </div>
            </div>
          </div>

          <div className="bg-background-section p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-300">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary-text">Welcome back</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in to your account to continue</p>
            </div>


            {/* Phone Login */}
            {/* {loginMethod === 'phone' &&  ( */}
            {loginMethod === 'phone' && !isOtpSent && (
              <form
                onSubmit={handleGetUserFromUserPhoneNumber}
                className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-primary-text">
                    Phone Number
                  </label>
                  <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                    <span className="inline-flex items-center justify-center px-3 bg-gray-100 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-600 text-gray-500">
                      +91
                    </span>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      required
                      className="w-full px-4 py-3 bg-white dark:bg-white text-light dark:text-gray border-0 focus:outline-none focus:ring-0"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={sendingOtp || phoneNumber.length < 10}
                  className="cursor-pointer w-full py-3 px-4 text-white  font-bold rounded-lg bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {sendingOtp ? (
                    <span className="cursor-pointer flex items-center justify-center">
                      <Loader /> <span className="ml-2"> Logging...</span>
                    </span>
                  ) : (
                    'Login'
                  )}
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    We'll verify your phone number from the server.
                  </p>
                </div>
              </form>
            )}

            {/* OTP Verification */}
            {loginMethod === 'phone' && isOtpSent && (
              // {loginMethod === 'phone' && isOtpSent && (
              <form
                onSubmit={handleUserAccountLogin}
                className="space-y-5">




                <div className="space-y-3">
                  <div className="text-center">
                    <label className="block text-sm font-medium text-primary-text mb-1">
                      Enter Password
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      Associated with the phone number :{" "}
                      {phoneNumber.replace(/(\d{2})(\d{4})(\d{4})/, "+91 $1-$2-$3")}
                    </p>
                  </div>

                  <div className="flex justify-center gap-2 relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="one-time-code"
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 w-full rounded-lg bg-white dark:bg-white text-light border border-gray-300 dark:border-gray-600 pr-12 pl-4 text-lg font-bold text-gray focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  {/* <button
                    type="button"
                    onClick={resetOtp}
                    className="flex-1 py-3 px-4 text-gray-700 dark:text-gray-300 font-medium rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 focus:outline-none transition-all"
                  >
                    Resend OTP
                  </button> */}

                  <button
                    type="submit"
                    // disabled={loading || otp.join('').length !== 6}
                    className="cursor-pointer w-full py-3 px-4 text-white  font-bold rounded-lg bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader /> : 'Verify & Login'}
                  </button>
                </div>

                <div className="text-center mt-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Didn't receive the code?
                    <button
                      type="button"
                      onClick={resetOtp}
                      className="text-blue-600 dark:text-blue-400 ml-1 hover:underline"
                    >
                      Resend
                    </button>
                  </p>
                </div>
              </form>
            )}

          </div>

          {/* Create account link */}
          <p className="mt-6 text-center text-gray-600 dark:text-gray-400 text-sm">
            Don't have an account?{' '}
            <a href="#" className="text-blue-600 font-medium hover:underline dark:text-blue-400">
              Request access
            </a>
          </p>
        </div>
      </div>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes float-0 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-20px, -30px) rotate(8deg); }
        }
        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(20px, -20px) rotate(-5deg); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-30px, 20px) rotate(10deg); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(30px, 30px) rotate(-8deg); }
        }
        @keyframes float-4 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-10px, -40px) rotate(5deg); }
        }
        @keyframes float-5 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(15px, -15px) rotate(3deg); }
        }
      `}</style>
    </div>
  );
};

export default SuperAdminLogin;