import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';
import { validateSession } from '../utils/authUtils';

const PrivateRoute = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      if (!currentUser) {
        setIsValidating(false);
        setIsValid(false);
        return;
      }

      try {
        const valid = await validateSession();

        if (!valid) {
          // Token expired or invalid, logout user
          dispatch(signoutSuccess());
          setIsValid(false);
        } else {
          setIsValid(true);
        }
      } catch (error) {
        console.error('Session validation error:', error);
        dispatch(signoutSuccess());
        setIsValid(false);
      } finally {
        setIsValidating(false);
      }
    };

    checkSession();
  }, [currentUser, dispatch]);

  // Show loading state while validating
  if (isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Validating session...</p>
        </div>
      </div>
    );
  }

  return currentUser && isValid ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivateRoute;

