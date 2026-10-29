
import { BackButton } from "@/components/action-buttons"
import PageHeader from "@/components/page-header"
import SessionForm from "@/components/session-form"

export default function CreateSession() {

  return (
    <div>
      <BackButton label="Program" />

      <PageHeader heading="New session" />

      <SessionForm mode={{ mode: "create" }} />

    </div>
  )

}