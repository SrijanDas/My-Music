"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function AuthForm() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const { signIn, signUp } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isSignUp) {
                if (!username.trim()) {
                    toast.error("Username is required");
                    return;
                }
                const { error } = await signUp(email, password, username);
                if (error) {
                    toast.error(error.message);
                } else {
                    toast.success(
                        "Account created! Please check your email to verify your account."
                    );
                }
            } else {
                const { error } = await signIn(email, password);
                if (error) {
                    toast.error(error.message);
                } else {
                    toast.success("Successfully signed in!");
                }
            }
        } catch {
            toast.error("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>
                        {isSignUp ? "Create Account" : "Sign In"}
                    </CardTitle>
                    <CardDescription>
                        {isSignUp
                            ? "Create an account to start listening to music together"
                            : "Sign in to your account to join music rooms"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {isSignUp && (
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    required
                                />
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading
                                ? "Loading..."
                                : isSignUp
                                ? "Create Account"
                                : "Sign In"}
                        </Button>
                    </form>
                    <div className="mt-4 text-center">
                        <Button
                            variant="link"
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-sm"
                        >
                            {isSignUp
                                ? "Already have an account? Sign in"
                                : "Don't have an account? Create one"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
