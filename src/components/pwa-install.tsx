'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Download, X } from 'lucide-react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISS_KEY = 'isabela_pwa_dismissed_until'

function dismissed() {
  try {
    const until = Number(localStorage.getItem(DISMISS_KEY) || 0)
    return Date.now() < until
  } catch {
    return false
  }
}

function alreadyInstalled() {
  if (typeof window === 'undefined') return true
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // iOS Safari
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

export function PwaInstall() {
  const pathname = usePathname()
  const onOwner = pathname?.startsWith('/owner') ?? false
  const [mounted, setMounted] = useState(false)
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [showIosHint, setShowIosHint] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
    // The owner dashboard has its own inline install card.
    if (onOwner) return
    if (alreadyInstalled()) return

    // Register the service worker (required for installability on Android).
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }

    if (dismissed()) return

    const onPrompt = (e: Event) => {
      e.preventDefault()
      setInstallEvent(e as BeforeInstallPromptEvent)
      // Only nudge on touch devices — desktop install stays available from the browser UI.
      if (window.matchMedia('(pointer: coarse)').matches) setVisible(true)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)

    // iOS never fires beforeinstallprompt — show manual instructions once.
    const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent)
    const timer = isIos
      ? window.setTimeout(() => {
          setShowIosHint(true)
          setVisible(true)
        }, 4000)
      : undefined

    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      if (timer) window.clearTimeout(timer)
    }
  }, [onOwner])

  function close() {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now() + 14 * 24 * 60 * 60 * 1000))
    } catch {
      /* private mode */
    }
    setVisible(false)
  }

  async function install() {
    if (!installEvent) return
    await installEvent.prompt()
    const choice = await installEvent.userChoice
    if (choice.outcome === 'accepted') setVisible(false)
    else close()
  }

  if (!mounted || !visible) return null

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-900/20 sm:inset-x-auto sm:right-4">
      <div className="flex items-start gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/icon-192.png" alt="" className="h-11 w-11 shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900">Keep the directory on your phone</p>
          {showIosHint ? (
            <p className="mt-0.5 text-xs text-slate-500">
              Tap <strong>Share</strong> then <strong>Add to Home Screen</strong> to install.
            </p>
          ) : (
            <p className="mt-0.5 text-xs text-slate-500">
              One tap from your home screen — no app store, no account.
            </p>
          )}
          {!showIosHint && installEvent && (
            <button
              onClick={install}
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              <Download size={13} /> Install
            </button>
          )}
        </div>
        <button onClick={close} aria-label="Dismiss" className="shrink-0 rounded-lg p-1 text-slate-400 hover:bg-slate-50">
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
