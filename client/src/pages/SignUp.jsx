import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('Please fill all the fields');
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        setErrorMessage(data.message);
      }
      setLoading(false);

      if (res.ok) {
        navigate('/sign-in');
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  console.log(formData);

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
            Sign up to create an account and start sharing your thoughts with the world!
          </p>
        </div>
        {/* right */}
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="username">Your Username</Label>
              <Input
                type="text"
                placeholder="Enter your username"
                id="username"
                onChange={handleChange}
              />
            </div>
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
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>
              Have an account?{' '}
              <Link to="/sign-in" className="text-primary hover:underline">
                Sign In
              </Link>
            </span>
          </div>

          {errorMessage && (
            <Alert variant="destructive" className="mt-5">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
