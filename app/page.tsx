"use client"

import React, { useState } from "react"
import { ToastProvider } from "@/components/landing/toast"
import { Navbar } from "@/components/landing/navbar"
import { HeroLeft } from "@/components/landing/hero-left"
import { StorefrontCard } from "@/components/landing/storefront-card"
import { FeaturesSection } from "@/components/landing/features-section"
import { CodeShowcase } from "@/components/landing/code-showcase"
import { Footer } from "@/components/landing/footer"

// Modals
import { SetupInfoModal } from "@/components/landing/modals/setup-info-modal"
import { SignInModal } from "@/components/landing/modals/sign-in-modal"
import { SignUpModal } from "@/components/landing/modals/sign-up-modal"
import { SearchSandboxModal } from "@/components/landing/modals/search-sandbox-modal"
import { AskShopMateModal } from "@/components/landing/modals/ask-shopmate-modal"
import { ApiFeedModal } from "@/components/landing/modals/api-feed-modal"
import { InfoPagesModal } from "@/components/landing/modals/info-pages-modals"

export default function LandingPage() {
  const [isSetupOpen, setIsSetupOpen] = useState(false)
  const [isSignInOpen, setIsSignInOpen] = useState(false)
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)
  const [isSandboxOpen, setIsSandboxOpen] = useState(false)
  const [isAskShopMateOpen, setIsAskShopMateOpen] = useState(false)
  const [isApiFeedOpen, setIsApiFeedOpen] = useState(false)
  const [infoModal, setInfoModal] = useState<"privacy" | "status" | "terms" | null>(null)

  return (
    <ToastProvider>
      <div className="dark min-h-screen bg-[#0d272c] text-white flex flex-col relative selection:bg-[#159478] selection:text-white">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-[#159478]/10 rounded-full blur-[140px] pointer-events-none -z-10"></div>
        <div className="absolute top-1/3 right-10 w-[500px] h-[400px] bg-[#E08E45]/8 rounded-full blur-[150px] pointer-events-none -z-10"></div>

        {/* 1. Top Navigation Bar */}
        <Navbar
          onOpenSetup={() => setIsSetupOpen(true)}
          onOpenSignIn={() => setIsSignInOpen(true)}
          onOpenSignUp={() => setIsSignUpOpen(true)}
        />

        {/* 2. Main Hero Section (Split Layout - 2 Columns) */}
        <main className="flex-1">
          <section className="relative pt-8 sm:pt-14 pb-16 sm:pb-24 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                {/* Left Column (Brand Identity & Presentation Hero) */}
                <div className="lg:col-span-6">
                  <HeroLeft
                    onOpenSandbox={() => setIsSandboxOpen(true)}
                    onOpenSetup={() => setIsSetupOpen(true)}
                  />
                </div>

                {/* Right Column (Storefront Screenshot Card Preview) */}
                <div className="lg:col-span-6">
                  <StorefrontCard
                    onOpenSandbox={() => setIsSandboxOpen(true)}
                    onOpenAskShopMate={() => setIsAskShopMateOpen(true)}
                    onOpenApiFeed={() => setIsApiFeedOpen(true)}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 3. Features & Architecture Section */}
          <FeaturesSection
            onOpenSandbox={() => setIsSandboxOpen(true)}
            onOpenSetup={() => setIsSetupOpen(true)}
          />

          {/* 4. Interactive Developer Code Playground */}
          <CodeShowcase onOpenSetup={() => setIsSetupOpen(true)} />
        </main>

        {/* 5. Footer */}
        <Footer
          onOpenPrivacy={() => setInfoModal("privacy")}
          onOpenStatus={() => setInfoModal("status")}
          onOpenTerms={() => setInfoModal("terms")}
          onOpenSetup={() => setIsSetupOpen(true)}
          onOpenSandbox={() => setIsSandboxOpen(true)}
        />

        {/* Interactive Modals */}
        <SetupInfoModal
          isOpen={isSetupOpen}
          onClose={() => setIsSetupOpen(false)}
          onOpenSandbox={() => {
            setIsSetupOpen(false)
            setIsSandboxOpen(true)
          }}
        />

        <SignInModal
          isOpen={isSignInOpen}
          onClose={() => setIsSignInOpen(false)}
          onSwitchToSignUp={() => {
            setIsSignInOpen(false)
            setIsSignUpOpen(true)
          }}
        />

        <SignUpModal
          isOpen={isSignUpOpen}
          onClose={() => setIsSignUpOpen(false)}
          onSwitchToSignIn={() => {
            setIsSignUpOpen(false)
            setIsSignInOpen(true)
          }}
        />

        <SearchSandboxModal
          isOpen={isSandboxOpen}
          onClose={() => setIsSandboxOpen(false)}
        />

        <AskShopMateModal
          isOpen={isAskShopMateOpen}
          onClose={() => setIsAskShopMateOpen(false)}
          onOpenSandbox={() => {
            setIsAskShopMateOpen(false)
            setIsSandboxOpen(true)
          }}
        />

        <ApiFeedModal
          isOpen={isApiFeedOpen}
          onClose={() => setIsApiFeedOpen(false)}
        />

        <InfoPagesModal
          isOpen={infoModal !== null}
          type={infoModal || "privacy"}
          onClose={() => setInfoModal(null)}
        />
      </div>
    </ToastProvider>
  )
}
