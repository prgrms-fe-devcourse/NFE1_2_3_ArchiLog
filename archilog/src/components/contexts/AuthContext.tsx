// import { createContext, useContext, useEffect, useState } from 'react';
// import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
// }

// const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const auth = getAuth();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setUser(user);
//       setLoading(false);
//     });

//     return unsubscribe;
//   }, [auth]);

//   return (
//     <AuthContext.Provider value={{ user, loading }}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);