import { useApp } from './useApp';

export const useAuth = () => {
  const { user, loginWithProvider, logout, updateUserProfile, setIsAuthModalOpen, setAuthModalMode } = useApp();

  const openLogin = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  const openRegister = () => {
    setAuthModalMode('register');
    setIsAuthModalOpen(true);
  };

  const openForgot = () => {
    setAuthModalMode('forgot');
    setIsAuthModalOpen(true);
  };

  return {
    user,
    isLoggedIn: user.isLoggedIn,
    loginWithProvider,
    logout,
    updateUserProfile,
    openLogin,
    openRegister,
    openForgot,
  };
};
