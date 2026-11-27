'use client'

import { useEffect, useState } from 'react'
import { Download, Share, Smartphone, X } from 'lucide-react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISS_KEY = 'isabela_owner_install_dismissed'

export function OwnerInstallCard() {
  const [mounted, setMounted] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>('other')
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    setMounted(true)

    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true
    if (standalone) {
      setInstalled(true)
      return
    }
    try {
      if (localStorage.getItem(DISMISS_KEY) === '1') setHidden(true)
    } catch {
      /* private mode */
    }

    const ua = window.navigator.userAgent
    setPlatform(/iphone|ipad|ipod/i.test(ua) ? 'ios' : /android/i.test(ua) ? 'android' : 'other')

    const onPrompt = (e: Event) => {
      e.preventDefault()
      setPromptEvent(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    return () => window.removeEventListener('beforeinstallprompt', onPrompt)
  }, [])

  if (!mounted || hidden) return null

  function dismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      /* private mode */
    }
    setHidden(true)
  }

  async function install() {
    if (!promptEvent) return
    await promptEvent.prompt()
    await promptEvent.userChoice
    setPromptEvent(null)
    dismiss()
  }

  return (
    <div className="relative rounded-2xl border border-emerald-200 bg-white p-4 pr-11 sm:p-5 sm:pr-12">
      {!installed && (
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute right-2 top-2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
        >
          <X size={15} />
        </button>
      )}
      <div className="flex items-start gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/icon-192.png" alt="" className="h-10 w-10 shrink-0 rounded-xl shadow-sm" />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
            <Smartphone size={15} className="text-emerald-600" />
            Keep this on your phone
          </p>

          {installed ? (
            <p className="mt-1 text-xs text-slate-500">
              Installed — open it from your home screen any time. You stay signed in with this link.
            </p>
          ) : platform === 'ios' ? (
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Tap <Share size={12} className="inline align-[-1px] text-emerald-600" />{' '}
              <strong>Share</strong>, then <strong>Add to Home Screen</strong>.
            </p>
          ) : promptEvent ? (
            <>
              <p className="mt-1 text-xs text-slate-500">
                Add it to your home screen so updating hours and photos is one tap, not a search.
              </p>
              <button
                type="button"
                onClick={install}
                className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                <Download size={13} /> Install
              </button>
            </>
          ) : (
            <p className="mt-1 text-xs text-slate-500">
              Open this page on your phone, then use your browser menu → <strong>Add to Home Screen</strong>.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
