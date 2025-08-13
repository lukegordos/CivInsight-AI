'use client'

import Link from 'next/link'
import { useState } from 'react'
import { CpuChipIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/' },
    { name: 'Reports', href: '/reports' },
    { name: 'Analytics', href: '/analytics' },
    { name: 'Map View', href: '/map' },
  ]

  return (
    <header className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between py-6">
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-600">
                <CpuChipIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-3">
                <div className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  CivInsight AI
                </div>
                <div className="text-sm text-slate-400">Civic Intelligence Platform</div>
              </div>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="ml-10 hidden space-x-8 lg:block">
            {navigation.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-base font-medium text-slate-300 hover:text-blue-400 transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="ml-10 hidden space-x-4 lg:flex items-center">
            <button className="inline-flex items-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all transform hover:scale-105">
              Submit Report
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-slate-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-700/50">
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block py-2 text-base font-medium text-slate-300 hover:text-blue-400 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4">
                <button className="block w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all">
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
