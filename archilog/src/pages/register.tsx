import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { signUp, checkUsernameExists } from "@/firebase/auth";
import { useDarkMode } from "@/contexts/DarkModeContext";

const RegisterLayout: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptPolicy, setAcceptPolicy] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { darkMode } = useDarkMode();

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleSignInClick = () => {
    router.push(`/login`);
  };

  const handleRegister = async () => {
    setErrorMessage(null);

    if (!username) {
      setErrorMessage("Username을 입력해주세요.");
      return;
    }

    if (!email) {
      setErrorMessage("Email을 입력해주세요.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("유효한 이메일 형식이 아닙니다.");
      return;
    }

    if (!password) {
      setErrorMessage("Password를 입력해주세요.");
      return;
    }

    if (!acceptPolicy) {
      setErrorMessage("약관에 동의해야 회원가입이 가능합니다.");
      return;
    }

    const usernameExists = await checkUsernameExists(username);
    if (usernameExists) {
      setErrorMessage("이미 사용 중인 닉네임입니다. 다른 닉네임을 선택해주세요.");
      return;
    }

    try {
      await signUp(email, password, username, router);
    } catch (error) {
      const firebaseError = error as { code: string };
      if (firebaseError.code === "auth/email-already-in-use") {
        setErrorMessage("이미 존재하는 이메일입니다. 다른 이메일을 사용해주세요.");
      } else {
        setErrorMessage("이미 존재하는 이메일입니다. 다른 이메일을 사용해주세요.");
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleRegister();
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-color-mode', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <div className={`${darkMode ? "dark bg-black text-white" : "bg-white text-black"} min-h-screen flex flex-col`}>
      <main className="flex-grow flex m-0 p-5 md:p-0">
        <div className="flex-none w-full md:w-1/2 flex items-center justify-center m-0 p-0">
          <div
            className={`${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"} rounded-md shadow-2xl p-6 md:p-8 w-full md:max-w-[85%] mx-4 min-h-[45rem] flex flex-col justify-between transition-all duration-300`}
            onKeyDown={handleKeyDown} 
          >
            <div className="text-center mb-4">
              <h1 className="text-3xl md:text-5xl font-bold">Register</h1>
            </div>

            <div className="flex mb-2 w-full relative mt-[11px]">
              <button
                className={`w-1/2 px-4 py-2 border-2 border-gray-200 rounded-lg bg-white text-black hover:bg-gray-200`}
                style={{
                  zIndex: 1,
                  position: "relative",
                  marginRight: "-15px",
                }}
                onClick={handleSignInClick}
              >
                Sign in
              </button>

              <button
                className={`w-1/2 px-4 py-2 border-2 border-gray-200 rounded-lg ${darkMode ? "bg-gray-600 text-yellow-300" : "bg-gray-300 text-black"} hover:bg-gray-400`}
                style={{ position: "relative", zIndex: 10 }}
              >
                Sign up
              </button>
            </div>

            <div className="w-full mb-2">
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                placeholder="Your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500 ${darkMode ? "bg-gray-700 text-white" : "bg-white text-black"}`}
              />
            </div>

            <div className="w-full mb-2">
              <label className="block text-sm font-medium mb-1">Email address</label>
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500 ${darkMode ? "bg-gray-700 text-white" : "bg-white text-black"}`}
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
                  className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500 ${darkMode ? "bg-gray-700 text-white" : "bg-white text-black"}`}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center h-full"
                >
                  <img
                    src="/images/eye.svg"
                    alt="Show Password"
                    className="h-6 w-6"
                  />
                </button>
              </div>
            </div>

            <div className="w-full flex items-center mb-2">
              <input
                type="checkbox"
                id="acceptPolicy"
                checked={acceptPolicy}
                onChange={() => setAcceptPolicy((prev) => !prev)}
                className="mr-2"
              />
              <label htmlFor="acceptPolicy" className="text-sm">
                I accept the terms and privacy policy
              </label>
            </div>

            {errorMessage && (
              <p className="text-red-500 text-center mb-2">{errorMessage}</p>
            )}

            <button
              onClick={handleRegister}
              className="w-full py-3 bg-black text-white rounded-md hover:bg-gray-800 mt-4 text-lg"
            >
              Create account
            </button>
          </div>
        </div>

        <div className="flex-none w-full md:w-1/2 flex items-center justify-center">
          <div className="text-center">
            <p className={`text-3xl md:text-4xl ${darkMode ? "text-white" : "text-black"}`}>Hello!</p>
            <p className={`text-3xl md:text-4xl ${darkMode ? "text-white" : "text-black"} mt-2`}>Thank you for visiting ArchiLog.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterLayout;
