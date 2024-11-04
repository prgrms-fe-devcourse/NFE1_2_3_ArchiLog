import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ForgotPasswordModal from "./password";
import {
  signIn,
  signInWithGithubPopup,
  signInWithGooglePopup,
  sendResetPasswordEmail,
  checkEmailExists,
  checkUsernameExists,
  auth,
} from "@/firebase/auth";
import { getCurrentUserInfo } from "@/firebase/users";
import { useDarkMode } from "@/contexts/DarkModeContext";

const LoginLayout: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetUsername, setResetUsername] = useState("");
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const router = useRouter();
  const { darkMode } = useDarkMode();

  useEffect(() => {
    document.documentElement.setAttribute('data-color-mode', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const user = await getCurrentUserInfo();
        if (user && user.username) {
          router.push(`/${user.username}`);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Authentication check error:", error);
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [router]);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleSignup = () => {
    router.push(`/register`);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    setErrorMessage(null);
  
    if (!email) {
      setErrorMessage("Email을 입력해주세요.");
      return;
    }
  
    if (!validateEmail(email)) {
      setErrorMessage("유효한 이메일 형식이 아닙니다.");
      return;
    }
  
    if (!password) {
      setErrorMessage("Password를 입력해주세요.");
      return;
    }
  
    const loginResult = await signIn(email, password);
  
    if (typeof loginResult === "string") {
      setErrorMessage(loginResult);
    } else {
      alert("로그인 되었습니다.");
      const user = auth.currentUser;
      router.push(`/${user?.displayName}`);
    }
  };  

  const handleGithubLogin = async () => {
    try {
      const user = await signInWithGithubPopup();
      if(user){
        router.push(`/${user.displayName}`);
      }
    } catch {
      setErrorMessage("GitHub 로그인에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const user = await signInWithGooglePopup();
      console.log(user)
      if(user){
        router.push(`/${user.displayName}`);
      }
    } catch {
      setErrorMessage("Google 로그인에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleSendCode = async () => {
    if (!resetUsername && !resetEmail) {
      setVerificationMessage("유저네임과 이메일을 입력해주세요.");
      return;
    }

    if (!resetUsername) {
      setVerificationMessage("유저네임을 입력해주세요.");
      return;
    }

    if (!resetEmail) {
      setVerificationMessage("이메일을 입력해주세요.");
      return;
    }

    if (!validateEmail(resetEmail)) {
      setVerificationMessage("유효한 이메일 형식이 아닙니다.");
      return;
    }

    const accountExists = await checkEmailExists(resetEmail);
    const usernameExists = await checkUsernameExists(resetUsername);

    if (!accountExists || !usernameExists) {
      setVerificationMessage("해당 계정은 존재하지 않습니다.");
      return;
    }

    await sendResetPasswordEmail(resetEmail);
    setVerificationMessage("비밀번호 재설정 이메일이 발송되었습니다.");
    setIsCodeSent(true);
  };

  const handlePasswordReset = () => setIsModalOpen(true);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  if (isLoading) return null;

  return (
    <div
      className={`${
        darkMode ? "dark bg-black text-white" : "bg-white text-black"
      } min-h-screen flex flex-col`}
    >

      <main className="flex-grow flex m-0 p-5 md:p-0">
        <div className="flex-none w-full md:w-1/2 flex items-center justify-center m-0 p-0">
          <div
            className={`${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
            } rounded-md shadow-2xl p-6 md:p-8 w-full md:max-w-[85%] mx-4 min-h-[45rem] flex flex-col justify-between transition-all duration-300`}
            onKeyDown={handleKeyDown} 
          >
            <div className="text-center mb-4">
              <h1 className="text-3xl md:text-5xl font-bold">Login</h1>
            </div>

            <div className="flex mb-2 w-full relative">
              <button
                className={`w-1/2 px-4 py-2 border-2 border-gray-200 rounded-lg ${
                  darkMode ? "bg-gray-600 text-yellow-300" : "bg-gray-300 text-black"
                } hover:bg-gray-400`}
                style={{
                  position: "relative",
                  zIndex: 10,
                  marginRight: "-10px",
                }}
              >
                Sign in
              </button>
              <button
                onClick={handleSignup}
                className="w-1/2 px-4 py-2 border-2 border-gray-200 rounded-lg bg-white text-black hover:bg-gray-200"
                style={{ zIndex: 1 }}
              >
                Sign up
              </button>
            </div>

            <div className="w-full mb-2">
              <label className="block text-sm font-medium mb-1">Email address</label>
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500 ${
                  darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                }`}
              />
            </div>

            <div className="w-full mb-2">
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500 ${
                    darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                  }`}
                />
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center h-full"
                  onClick={togglePasswordVisibility}
                >
                  <img src="/images/eye.svg" alt="Show Password" className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="w-full text-right mb-2">
              <a onClick={handlePasswordReset} className="text-sm hover:underline cursor-pointer">
                Forgot password?
              </a>
            </div>

            {errorMessage && <p className="text-red-500 text-center mb-2">{errorMessage}</p>}

            <div className="text-center text-sm text-gray-500 mt-1">
              <p>
                <span onClick={handleGithubLogin} className="cursor-pointer hover:underline">
                  Login with GitHub
                </span>{" "}
                |
                <span onClick={handleGoogleLogin} className="cursor-pointer hover:underline">
                  {" "}
                  Login with Google
                </span>
              </p>
            </div>

            <button
              onClick={handleLogin}
              className="w-full py-3 bg-black text-white rounded-md hover:bg-gray-800 mt-4 text-lg"
            >
              Login
            </button>
          </div>
        </div>

        <div className="flex-none w-full md:w-1/2 flex items-center justify-center">
          <div className="text-center">
            <p className={`text-3xl md:text-4xl ${darkMode ? "text-white" : "text-black"}`}>Hello!</p>
            <p className={`text-3xl md:text-4xl ${darkMode ? "text-white" : "text-black"} mt-2`}>
              Thank you for visiting ArchiLog.
            </p>
          </div>
        </div>
      </main>

      <ForgotPasswordModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setResetEmail("");
          setResetUsername("");
          setVerificationMessage(null);
          setIsCodeSent(false);
        }}
        resetEmail={resetEmail}
        resetUsername={resetUsername}
        setResetEmail={setResetEmail}
        setResetUsername={setResetUsername}
        handleSendCode={handleSendCode}
        verificationMessage={verificationMessage}
        setVerificationMessage={setVerificationMessage}
        isCodeSent={isCodeSent}
        darkMode={darkMode}
      />
    </div>
  );
};

export default LoginLayout;
