import CoachProfileCard from "@/components/coach-profile-card"
import UserUpdateForm from "@/components/user-update-form"
import LogoutButton from "@/components/logout-button"
import { getCoachProfile } from "@/api/users"

export default async function Profile() {

  const { data: coach } = await getCoachProfile()

  return (
    <div>
      <CoachProfileCard coach={coach} action={<><UserUpdateForm user={coach} /><LogoutButton variant="button" /></>} />
    </div>
  )

}
