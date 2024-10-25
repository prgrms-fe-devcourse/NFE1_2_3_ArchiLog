import React, { useState } from "react";
import { useRouter } from "next/router";
import { useDarkMode } from "@/contexts/DarkModeContext";
import LoginLayout from "@/components/Layout/LoginLayout";

const LoginPage: React.FC = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

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

    // 로그인 처리
    setTimeout(() => {
      if (email === "test@example.com" && password === "password") {
        alert("로그인 되었습니다.");
        router.push("/");
      } else {
        setErrorMessage(
          "로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해주세요."
        );
      }
    }, 1000);
  };

  return (
    <LoginLayout>
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
          className={`w-1/2 px-4 py-2 border-2 border-gray-200 rounded-lg bg-white text-black hover:bg-gray-200`}
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
            <img
              src="/images/eye.svg"
              alt="Show Password"
              className="h-6 w-6"
            />
          </button>
        </div>
      </div>

      <div className="w-full text-right mb-2">
        <a href="#" className="text-sm hover:underline">
          Forgot password?
        </a>
      </div>

      {errorMessage && (
        <p className="text-red-500 text-center mb-2">{errorMessage}</p>
      )}

      <button
        onClick={handleLogin}
        className="w-full py-3 bg-black text-white rounded-md hover:bg-gray-800 mt-4 text-lg"
      >
        Login
      </button>
    </LoginLayout>
  );
};

export default LoginPage;
