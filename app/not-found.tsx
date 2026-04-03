import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Home, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <div className="bg-obsidian text-cloud min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="dot-pattern min-h-[70vh] flex items-center justify-center px-4">
          <div className="text-center max-w-lg mx-auto">
            <p className="font-display text-8xl font-bold text-cyan leading-none mb-6">
              404
            </p>

            <h1 className="font-display text-3xl sm:text-4xl font-bold text-cloud mb-4">
              Looks like this page wandered off.
            </h1>

            <p className="font-body text-slate text-lg mb-10">
              Whatever you were looking for isn&apos;t here. But there&apos;s plenty back home.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-cyan text-obsidian font-display font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
              >
                <Home size={18} />
                Back to Home
              </Link>

              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center gap-2 border border-wire text-cloud font-display font-semibold px-6 py-3 rounded-lg hover:border-cyan hover:text-cyan transition-colors"
              >
                <ArrowLeft size={18} />
                View Portfolio
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
