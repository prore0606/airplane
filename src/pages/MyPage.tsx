import TopNav from '../components/layout/TopNav'
import { useAuth } from '../context/AuthContext'
import ProfileCard from '../components/profile/ProfileCard'
import StepCounter from '../components/profile/StepCounter'
import BadgeGrid from '../components/profile/BadgeGrid'
import ProfileMenu from '../components/profile/ProfileMenu'

function ProfileScreen() {
  return (
    <div className="space-y-6">
      <p className="text-xl font-bold text-brand-black">MY</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <ProfileCard />
          <StepCounter />
        </div>
        <div className="space-y-4">
          <BadgeGrid />
          <ProfileMenu />
        </div>
      </div>
    </div>
  )
}

export default function MyPage() {
  const { loading } = useAuth()

  return (
    <div className="flex flex-col h-full">
      <TopNav />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-4 h-full">
          {loading
            ? <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
              </div>
            : <ProfileScreen />
          }
        </div>
      </div>
    </div>
  )
}
