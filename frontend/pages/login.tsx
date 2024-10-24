import React, { useState } from "react";
import HeaderLogin from "../src/components/Layout/HeaderLogin"; 

const LoginLayout: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const handleLogin = () => {
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className={`${darkMode ? "dark bg-black text-white" : "bg-white text-black"} min-h-screen flex flex-col`}>
      <header>
        <HeaderLogin darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      </header>

      <main className="flex-grow flex m-0 p-5 md:p-0">
        <div className="flex-none w-full md:w-1/2 flex items-center justify-center m-0 p-0">
          <div className={`${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"} rounded-md shadow-2xl p-6 md:p-8 w-full md:max-w-[85%] mx-4 min-h-[45rem] flex flex-col justify-between transition-all duration-300`}>
            <div className="text-center mb-4">
              <h1 className="text-3xl md:text-5xl font-bold">Login</h1>
            </div>

            <div className="flex mb-2 w-full relative">
              <button className={`w-1/2 px-4 py-2 border-2 border-gray-200 rounded-lg ${darkMode ? "bg-gray-600 text-yellow-300" : "bg-gray-300 text-black"} hover:bg-gray-400`} style={{ position: 'relative', zIndex: 10, marginRight: '-10px' }}>
                Sign in
              </button>
              <button className={`w-1/2 px-4 py-2 border-2 border-gray-200 rounded-lg bg-white text-black hover:bg-gray-200`} style={{ zIndex: 1 }}>
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
                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500 ${darkMode ? "bg-gray-700 text-white" : "bg-white text-black"}`}
              />
            </div>

            <div className="w-full mb-2">
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500 ${darkMode ? "bg-gray-700 text-white" : "bg-white text-black"}`}
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center h-full">
                  <img src="/images/eye.svg" alt="Show Password" className="h-6 w-6" />  {/* Eye SVG Image */}
                </button>
              </div>
            </div>

            <div className="w-full text-right mb-2">
              <a href="#" className="text-sm hover:underline">Forgot password?</a>
            </div>

            <button onClick={handleLogin} className="w-full py-3 bg-black text-white rounded-md hover:bg-gray-800 mt-4 text-lg">Login</button>
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

export default LoginLayout;
