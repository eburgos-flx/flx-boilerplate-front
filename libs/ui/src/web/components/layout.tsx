import { ReactNode, useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { authStore } from "@flx-front/shared/store";
import { useStore } from "zustand";

export interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const user = useStore(authStore, (state) => state.user);
  const logout = useStore(authStore, (state) => state.logout);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <nav className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Flx Boilerplate
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Modern React Stack
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-2 sm:gap-6">
              <Link
                to="/"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive("/")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Home
              </Link>
              <Link
                to="/products"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive("/products") ||
                  location.pathname.startsWith("/products/")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Products
              </Link>

              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all"
                  >
                    {user.image && (
                      <img
                        src={user.image}
                        alt={user.firstName}
                        className="w-9 h-9 rounded-full border-2 border-blue-200"
                      />
                    )}
                    <div className="text-left hidden sm:block">
                      <p className="text-sm font-semibold text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-600 transition-transform ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                      <div className="p-4 border-b border-gray-100 bg-linear-to-br from-blue-50 to-purple-50">
                        <div className="flex items-center gap-3">
                          {user.image && (
                            <img
                              src={user.image}
                              alt={user.firstName}
                              className="w-12 h-12 rounded-full border-2 border-blue-200"
                            />
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-bold text-gray-900">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-gray-600">
                              @{user.username}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-2 border-b border-gray-100">
                        <p className="text-xs text-center text-gray-500 mt-1">
                          {user.email}
                        </p>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={() => {
                            logout();
                            setIsDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive("/login")
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                      : "bg-linear-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-200"
                  }`}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="py-8">{children}</main>
    </div>
  );
}
