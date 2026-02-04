import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "@flx-front/shared/data-access";
import { authStore } from "@flx-front/shared/store";
import {
  Container,
  Input,
  Button,
  Card,
  ErrorMessage,
} from "@flx-front/ui-web";
import { apiClient } from "../lib/api-client";

export function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");

  const loginMutation = useLogin(apiClient, {
    onSuccess: (data) => {
      authStore.getState().setToken(data.accessToken);
      authStore.getState().setUser({
        id: data.id.toString(),
        email: data.email,
        roles: [],
        firstName: data.firstName,
        lastName: data.lastName,
        image: data.image,
        username: data.username,
      });
      navigate("/products");
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ username, password });
  };

  return (
    <Container>
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-block p-4 bg-linear-to-br from-blue-600 to-purple-600 rounded-2xl mb-4">
            <span className="text-white text-4xl">🔐</span>
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to continue to your account</p>
        </div>

        <Card className="shadow-xl border-gray-200/50">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />

            {loginMutation.error && (
              <ErrorMessage
                title="Login Failed"
                message={loginMutation.error.message || "Invalid credentials"}
              />
            )}

            <Button
              type="submit"
              variant="primary"
              isLoading={loginMutation.isPending}
              className="w-full py-3 text-base font-semibold"
            >
              {loginMutation.isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-linear-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-100">
            <p className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <span>💡</span> Demo credentials:
            </p>
            <div className="flex flex-col gap-1 text-sm">
              <p className="text-blue-700">
                <strong>Username:</strong>{" "}
                <code className="bg-white/60 px-2 py-0.5 rounded">emilys</code>
              </p>
              <p className="text-blue-700">
                <strong>Password:</strong>{" "}
                <code className="bg-white/60 px-2 py-0.5 rounded">
                  emilyspass
                </code>
              </p>
            </div>
          </div>
        </Card>

        {/* Features */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4">
            <div className="text-3xl mb-2">🔒</div>
            <p className="text-sm font-semibold text-gray-900">Secure</p>
            <p className="text-xs text-gray-600">JWT Authentication</p>
          </div>
          <div className="p-4">
            <div className="text-3xl mb-2">⚡</div>
            <p className="text-sm font-semibold text-gray-900">Fast</p>
            <p className="text-xs text-gray-600">Instant Login</p>
          </div>
          <div className="p-4">
            <div className="text-3xl mb-2">💾</div>
            <p className="text-sm font-semibold text-gray-900">Persistent</p>
            <p className="text-xs text-gray-600">Stay Logged In</p>
          </div>
        </div>
      </div>
    </Container>
  );
}
