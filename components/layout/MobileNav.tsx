"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { X, ChevronRight } from "lucide-react";
import { NAV_LINKS, SERVICES_DROPDOWN } from "@/lib/constants";
import Button from "@/components/ui/Button";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-obsidian/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        id="mobile-navigation-dialog"
        className="fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[90vw] bg-carbon border-l border-wire flex flex-col shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-navigation-title"
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
            ref={closeButtonRef}
            onClick={onClose}
            className="text-slate hover:text-cloud transition-colors p-2 rounded-lg"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h2 id="mobile-navigation-title" className="sr-only">
          Navigation menu
        </h2>

        <nav className="flex-1 overflow-y-auto p-6 space-y-2" aria-label="Mobile navigation">
          {NAV_LINKS.map((link) => (
            <div key={link.href}>
              <Link
                href={link.href}
                onClick={onClose}
                className="flex items-center justify-between py-3 text-cloud hover:text-cyan transition-colors font-medium border-b border-wire/30"
              >
                {link.label}
                <ChevronRight className="w-4 h-4 text-slate" aria-hidden="true" />
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
              Talk Through Your Workflow
            </Button>
          </Link>
          <Link href="/build-your-proposal" onClick={onClose} className="block">
            <Button variant="primary" className="w-full">
              Get Your Automation Map
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
