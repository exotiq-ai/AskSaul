"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, ChevronRight } from "lucide-react";
import { NAV_LINKS, SERVICES_DROPDOWN } from "@/lib/constants";
import Button from "@/components/ui/Button";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-obsidian/80 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[90vw] bg-carbon border-l border-wire flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex items-center justify-between p-6 border-b border-wire">
          <Link
            href="/"
            onClick={onClose}
            className="font-display text-xl font-bold text-cloud"
          >
            Ask<span className="text-cyan">Saul</span>
          </Link>
          <button
            onClick={onClose}
            className="text-slate hover:text-cloud transition-colors p-1"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-6 space-y-2">
          {NAV_LINKS.map((link) => (
            <div key={link.href}>
              <Link
                href={link.href}
                onClick={onClose}
                className="flex items-center justify-between py-3 text-cloud hover:text-cyan transition-colors font-medium border-b border-wire/30"
              >
                {link.label}
                <ChevronRight className="w-4 h-4 text-slate" />
              </Link>
              {link.hasDropdown && (
                <div className="pl-4 mt-1 space-y-1">
                  {SERVICES_DROPDOWN.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className="block py-2 text-sm text-slate hover:text-cyan transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="p-6 border-t border-wire space-y-3">
          <Link href="/contact" onClick={onClose} className="block">
            <Button variant="ghost" className="w-full">
              Talk to Saul
            </Button>
          </Link>
          <Link href="/build-your-proposal" onClick={onClose} className="block">
            <Button variant="primary" className="w-full">
              Build Your Proposal
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
