"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Mail, User, Lock, CheckCircle, AlertCircle } from "lucide-react";
import { registerUser } from "@/lib/auth";
import { Progress } from "@/components/ui/progress";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      setPasswordFeedback("");
      return;
    }

    let strength = 0;
    let feedback = "";

    // Length check
    if (password.length >= 8) {
      strength += 25;
    }

    // Contains uppercase
    if (/[A-Z]/.test(password)) {
      strength += 25;
    }

    // Contains number
    if (/[0-9]/.test(password)) {
      strength += 25;
    }

    // Contains special character
    if (/[^A-Za-z0-9]/.test(password)) {
      strength += 25;
    }

    // Set feedback based on strength
    if (strength <= 25) {
      feedback = "Weak password";
    } else if (strength <= 50) {
      feedback = "Moderate password";
    } else if (strength <= 75) {
      feedback = "Good password";
    } else {
      feedback = "Strong password";
    }

    setPasswordStrength(strength);
    setPasswordFeedback(feedback);
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    
    // Form validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    if (passwordStrength < 50) {
      setError("Please use a stronger password with uppercase letters, numbers, and special characters.");
      return;
    }
    
    setLoading(true);
    try {
      const result = await registerUser(name, email, password);
      console.log("Registration successful:", result);
      setSuccessMessage("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/30">
      <Container className="flex flex-col items-center justify-center w-full">
        <Card className="w-full md:w-5/12 max-w-2xl p-8 md:p-10 rounded-3xl shadow-2xl border border-primary/10 bg-card/90 backdrop-blur-lg mt-20">
          <div className="mb-6 text-center">
            <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-1 tracking-tight">
              Sign Up
            </h1>
            <p className="text-base text-muted-foreground font-medium">
              Create your account to start your journey with.
            </p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label
                    htmlFor="name"
                    className="block text-base font-semibold mb-1"
                  >
                    Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your name"
                      className="pl-12 py-2 text-base rounded-xl bg-card bg-opacity-80 border border-primary focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder:text-muted-foreground"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="email"
                    className="block text-base font-semibold mb-1"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-12 py-2 text-base rounded-xl bg-card bg-opacity-80 border border-primary focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder:text-muted-foreground"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-base font-semibold mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-12 py-2 text-base rounded-xl bg-card bg-opacity-80 border border-primary focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder:text-muted-foreground"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {password && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium">Password strength:</span>
                      <span className={`text-xs font-semibold ${
                        passwordStrength <= 25 ? 'text-red-500' : 
                        passwordStrength <= 50 ? 'text-yellow-500' : 
                        passwordStrength <= 75 ? 'text-blue-500' : 
                        'text-green-500'
                      }`}>
                        {passwordFeedback}
                      </span>
                    </div>
                    <Progress value={passwordStrength} className="h-1" />
                    <ul className="mt-2 text-xs space-y-1 text-muted-foreground">
                      <li className="flex items-center gap-1">
                        {password.length >= 8 ? 
                          <CheckCircle className="h-3 w-3 text-green-500" /> : 
                          <AlertCircle className="h-3 w-3 text-red-500" />
                        }
                        At least 8 characters
                      </li>
                      <li className="flex items-center gap-1">
                        {/[A-Z]/.test(password) ? 
                          <CheckCircle className="h-3 w-3 text-green-500" /> : 
                          <AlertCircle className="h-3 w-3 text-red-500" />
                        }
                        Contains uppercase letter
                      </li>
                      <li className="flex items-center gap-1">
                        {/[0-9]/.test(password) ? 
                          <CheckCircle className="h-3 w-3 text-green-500" /> : 
                          <AlertCircle className="h-3 w-3 text-red-500" />
                        }
                        Contains number
                      </li>
                      <li className="flex items-center gap-1">
                        {/[^A-Za-z0-9]/.test(password) ? 
                          <CheckCircle className="h-3 w-3 text-green-500" /> : 
                          <AlertCircle className="h-3 w-3 text-red-500" />
                        }
                        Contains special character
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-base font-semibold mb-1"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    className="pl-12 py-2 text-base rounded-xl bg-card bg-opacity-80 border border-primary focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder:text-muted-foreground"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            {error && (
              <p className="text-red-500 text-base text-center font-medium">
                {error}
              </p>
            )}
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                <p className="text-sm font-medium">{successMessage}</p>
              </div>
            )}
            <Button
              className="w-full py-2 text-base rounded-xl font-bold bg-gradient-to-r from-primary to-primary/80 shadow-md hover:from-primary/80 hover:to-primary"
              size="lg"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </Button>
          </form>
          <div className="my-6 border-t border-primary/10" />
          <p className="text-base text-center text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-semibold underline hover:text-primary/80 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </Card>
      </Container>
    </div>
  );
}