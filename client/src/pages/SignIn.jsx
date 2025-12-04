import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useAuth';
import OAuth from '../components/OAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const { mutate: login, isPending, error } = useLogin();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return;
    }

    login(formData);
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-primary text-primary-foreground rounded-lg">
              Bangboy's
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            Sign in to your account and start sharing your thoughts with the world.
          </p>
        </div>
        {/* right */}
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="email">Your Email</Label>
              <Input
                type="email"
                placeholder="Enter your email"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="password">Your Password</Label>
              <Input
                type="password"
                placeholder="Enter your password"
                id="password"
                onChange={handleChange}
              />
            </div>
            <Button
              type="submit"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>
              Don't have an account?{' '}
              <Link to="/sign-up" className="text-primary hover:underline">
                Sign Up
              </Link>
            </span>
          </div>

          {error && (
            <Alert variant="destructive" className="mt-5">
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
