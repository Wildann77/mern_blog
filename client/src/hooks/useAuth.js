import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { authService } from '../services/authService';

// Hook to access auth context
export const useAuth = () => {
    return useAuthContext();
};

// Hook for login mutation
export const useLogin = () => {
    const navigate = useNavigate();
    const { login } = useAuthContext();

    return useMutation({
        mutationFn: authService.loginUser,
        onSuccess: (data) => {
            login(data);
            navigate('/');
        },
        onError: (error) => {
            console.error('Login error:', error);
        },
    });
};

// Hook for register mutation
export const useRegister = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: authService.registerUser,
        onSuccess: () => {
            navigate('/sign-in');
        },
        onError: (error) => {
            console.error('Register error:', error);
        },
    });
};

// Hook for Google OAuth mutation
export const useGoogleAuth = () => {
    const navigate = useNavigate();
    const { login } = useAuthContext();

    return useMutation({
        mutationFn: authService.googleAuth,
        onSuccess: (data) => {
            login(data);
            navigate('/');
        },
        onError: (error) => {
            console.error('Google auth error:', error);
        },
    });
};

// Hook for logout mutation
export const useLogout = () => {
    const navigate = useNavigate();
    const { logout } = useAuthContext();

    return useMutation({
        mutationFn: authService.logoutUser,
        onSuccess: () => {
            logout();
            navigate('/sign-in');
        },
        onError: (error) => {
            console.error('Logout error:', error);
            // Even if API call fails, logout locally
            logout();
            navigate('/sign-in');
        },
    });
};
