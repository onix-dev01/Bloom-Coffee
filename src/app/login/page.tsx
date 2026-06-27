import { Suspense } from "react";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { AuthForm } from "@/components/auth/AuthForm";
import { BrandPanel } from "@/components/auth/BrandPanel";

export default function LoginPage() {
  return (
    <>
      <div className="border-b bg-brand-900 px-6 py-8 text-center text-white lg:hidden">
        <div className="mx-auto flex max-w-sm flex-col items-center">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
            <svg viewBox="0 0 64 64" className="h-9 w-9" fill="currentColor" aria-hidden>
              <path d="M16 24c0-6.627 5.373-12 12-12h8c6.627 0 12 5.373 12 12v2H16v-2zm-2 6h32v4c0 8.837-7.163 16-16 16S16 42.837 16 34v-4zm8 20h16v4H22v-4z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold">Bloom Coffee</h1>
          <p className="mt-2 text-sm text-brand-100">Sign in to continue</p>
        </div>
      </div>
      <AuthSplitLayout
        form={
          <Suspense fallback={<p className="text-sm text-muted">Loading...</p>}>
            <AuthForm />
          </Suspense>
        }
        brand={<BrandPanel />}
      />
    </>
  );
}
