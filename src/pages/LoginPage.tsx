import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import logo from '@/assests/Logo.jpg';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('citizen');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const { getRolePath } = useRole();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const success = await login(email, password, role);
    if (success) {
      navigate(getRolePath(role));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-divider">
        <Link to="/" className="p-2 -m-2 ripple rounded-full">
          <ArrowLeft className="h-6 w-6 text-text-primary" />
        </Link>
        <div className="flex items-center gap-2">
          <img src={logo} alt="JeevanDhara logo" className="h-8 w-8 rounded-full object-cover" />
          <span className="title-medium text-primary">JeevanDhara</span>
        </div>
        <div className="w-10" />
      </header>

      {/* Content */}
      <div className="flex-1 container mx-auto px-4 py-8 max-w-md">
        <div className="text-center mb-8">
          <h1 className="headline-small mb-2">Welcome Back</h1>
          <p className="body-medium text-text-secondary">Sign in to continue to JeevanDhara</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selection */}
          <div className="space-y-2">
            <Label className="label-medium text-text-primary">Role</Label>
            <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
              <SelectTrigger className="material-button border-input bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="citizen">👤 Citizen</SelectItem>
                <SelectItem value="asha">🏥 ASHA Worker</SelectItem>
                <SelectItem value="coordinator">📊 Health Coordinator</SelectItem>
                <SelectItem value="doctor">👩‍⚕️ Doctor / Clinic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="label-medium text-text-primary">Email or Phone</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email or phone"
              className="material-button border-input bg-background"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="label-medium text-text-primary">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="material-button border-input bg-background pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-secondary ripple rounded"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full material-button bg-primary text-primary-foreground hover:bg-primary/90 ripple"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                Signing In...
              </div>
            ) : (
              'Sign In'
            )}
          </Button>

          {/* Demo Credentials */}
          <div className="material-card p-4 bg-muted">
            <p className="label-medium text-text-primary mb-2">Demo Credentials:</p>
            <p className="body-small text-text-secondary">Email: demo@healthhub.com</p>
            <p className="body-small text-text-secondary">Password: demo123</p>
            <p className="body-small text-text-secondary">Select any role to try the platform</p>
          </div>

          {/* Sign Up Link */}
          <div className="text-center pt-4 border-t border-divider">
            <p className="body-medium text-text-secondary">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
