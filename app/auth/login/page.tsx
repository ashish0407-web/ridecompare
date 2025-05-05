import { LoginForm } from "@/components/login-form"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
        <LoginForm />
      </main>
      <SiteFooter />
    </div>
  )
}
