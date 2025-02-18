'use client';

import { useEffect } from 'react';
import AuthModal from './ui/AuthModal';

interface AuthModalProps {
  modalType: 'login' | 'signup' | null;
  setModalType: (type: 'login' | 'signup' | null) => void;
  loggedOut: () => void;
  setToken: (token: string| null) => void;
  token: string|null
}

const AuthPage: React.FC<AuthModalProps> = ({ modalType, setModalType, loggedOut, token, setToken }) => {
  

  // Load token from localStorage when component mounts
  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  // Custom event listener for localStorage changes
  useEffect(() => {
    const handleAuthChange = () => {
      setToken(localStorage.getItem('token'));
    };

    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  // Logout function
  const logdOut = () => {
  loggedOut()
    setToken(null);
  };

  return (
    <>
      {token ? (
        <button
          onClick={logdOut}
          className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Logout
        </button>
      ) : (
        <>
          <button
            onClick={() => setModalType('login')}
            className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Login
          </button>
          <button
            onClick={() => setModalType('signup')}
            className="ml-4 block text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Sign Up
          </button>
          <AuthModal
            isOpen={modalType !== null}
            onClose={() => setModalType(null)}
            type={modalType || 'login'}
            switchModal={setModalType}
          />
        </>
      )}
    </>
  );
};

export default AuthPage;
