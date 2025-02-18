'use client';

import { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'login' | 'signup';
  switchModal: (type: 'login' | 'signup') => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, type, switchModal }) => {
  if (!isOpen) return null;

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password: string) => {
    // Password must have at least 6 characters
    return password.length >= 6;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const email = (event.target as any).email.value;
    const password = (event.target as any).password.value;
    const confirmPassword = (event.target as any).confirmPassword?.value;

    let valid = true;

    // Reset errors
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);

    // Validate email
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    }

    // Validate password
    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 6 characters.');
      valid = false;
    }

    // Validate confirm password if signup
    if (type === 'signup' && password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      valid = false;
    }

    if (valid) {
      if (type === 'login') {
        try {
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          let res= await response.json()
          if(response.ok){
            let user = res.response.user
            localStorage.setItem('user', JSON.stringify(user))
            localStorage.setItem('token', res.response.token)
            window.dispatchEvent(new Event('authChange')); // Ensures AuthPage updates
            onClose()
          } else {
            alert(res.response);
          }

        } catch (error) {
          console.log("error", error)
          alert(error);
        }
        } else {
          try {
            const response = await fetch("/api/auth/signup", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password }),
            });
            let res= await response.json()
            if(response.ok){
              switchModal('login')
            } else {
              alert(res.response);
            }
  
          } catch (error) {
            console.log("error", error)
            alert(error);
          }
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="relative p-4 w-full max-w-md bg-white rounded-lg shadow-lg dark:bg-gray-700">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-600 border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {type === 'login' ? 'Sign in to our platform' : 'Create an account'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-3xl w-8 h-8 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            &times;
          </button>
        </div>
        <div className="p-4">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Your email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`bg-gray-50 border ${emailError ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white`}
                placeholder="name@company.com"
                required
              />
              {emailError && <p className="text-sm text-red-500">{emailError}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Your password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                className={`bg-gray-50 border ${passwordError ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white`}
                required
              />
              {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
            </div>
            {type === 'signup' && (
              <div>
                <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Confirm password
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  className={`bg-gray-50 border ${confirmPasswordError ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white`}
                  required
                />
                {confirmPasswordError && <p className="text-sm text-red-500">{confirmPasswordError}</p>}
              </div>
            )}
            <button
              type="submit"
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {type === 'login' ? 'Login to your account' : 'Sign up'}
            </button>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
              {type === 'login' ? (
                <>Not registered? <button onClick={() => switchModal('signup')} className="text-blue-700 hover:underline dark:text-blue-500">Create account</button></>
              ) : (
                <>Already have an account? <button onClick={() => switchModal('login')} className="text-blue-700 hover:underline dark:text-blue-500">Login</button></>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal