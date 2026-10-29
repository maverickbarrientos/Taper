import AthleteProfileCard from "@/components/athlete-profile-card"
import UserUpdateForm from "@/components/user-update-form"
import LogoutButton from "@/components/logout-button"
import { getAthleteProfile } from "@/api/users"

export default async function Profile() {

  const { data: athlete } = await getAthleteProfile()

  return (
    <div>
      <AthleteProfileCard athlete={athlete} action={<><UserUpdateForm user={athlete} includeAthleteFields /><LogoutButton variant="button" /></>} />
    </div>
  )

}
