import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProfileTabs } from "@/components/profile-tabs"
import { UserProfileHeader } from "@/components/user-profile-header"

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-6">
        <UserProfileHeader />
        <ProfileTabs />
      </main>
      <SiteFooter />
    </div>
  )
}
