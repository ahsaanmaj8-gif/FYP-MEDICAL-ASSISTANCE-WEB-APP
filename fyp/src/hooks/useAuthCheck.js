import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
import { useAuth } from './../context/AuthContext';

export const useAuthCheck = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const requireAuth = (redirectTo = '/login') => {
    if (!isAuthenticated()) {
      navigate(redirectTo);
      return false;
    }
    return true;
  };

  return { requireAuth };
};