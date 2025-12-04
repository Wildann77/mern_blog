import { createContext, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    signInSucess,
    signoutSuccess,
    updateSuccess,
} from '../redux/user/userSlice';

// Create Auth Context
const AuthContext = createContext(null);

// AuthContext Provider Component
export const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();
    const { currentUser, loading, error } = useSelector((state) => state.user);

    // Computed values
    const isAuthenticated = !!currentUser;

    // Helper function to login
    const login = (userData) => {
        dispatch(signInSucess(userData));
    };

    // Helper function to logout
    const logout = () => {
        dispatch(signoutSuccess());
    };

    // Helper function to update user
    const updateUser = (userData) => {
        dispatch(updateSuccess(userData));
    };

    // Check if token is expired (optional - based on JWT expiration)
    const isTokenExpired = () => {
        if (!currentUser) return true;

        // If your JWT contains an expiration time, you can check it here
        // For now, we rely on backend validation via Axios interceptors
        return false;
    };

    // Auto-logout if token is expired (optional)
    useEffect(() => {
        if (isAuthenticated && isTokenExpired()) {
            logout();
        }
    }, [isAuthenticated]);

    const value = {
        // State
        user: currentUser,
        isAuthenticated,
        loading,
        error,

        // Methods
        login,
        logout,
        updateUser,
        isTokenExpired,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuthContext = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuthContext must be used within AuthProvider');
    }

    return context;
};

export default AuthContext;
