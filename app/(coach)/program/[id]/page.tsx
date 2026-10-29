
import Link from "next/link";
import { format } from "date-fns";
import { FlagBannerFoldIcon } from "@phosphor-icons/react/dist/ssr";
import { BackButton, EditButton } from "@/components/action-buttons";
import { DeleteProgramButton } from "@/components/delete-button";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/page-header";
import PhaseForm from "@/components/phase-form";
import ProgramStatusButton from "@/components/program-status-button";
import ProgramDetailsCard from "@/components/program-details-card";
import ProgramAiSummaryCard from "@/components/program-ai-summary-card";
import PhaseDetails from "@/components/phase-details";
import { getProgramDetails } from "@/api/program";
import { cn } from "@/lib/utils"

type ProgramDetailsProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ phaseId: string }>
}

export default async function ProgramDetails({ params, searchParams }: ProgramDetailsProps) {

  const { phaseId } = await searchParams;
  const { id } = await params;

  const { data: program } = await getProgramDetails(id);

  return (
    <div>
      <BackButton label="Program" />

      <PageHeader heading={program.name}>
        <div className="flex items-center gap-2">
          <ProgramStatusButton programId={program.id} status={program.status} />
          <EditButton label="Edit program" href={`/program/edit/${program.id}`} />
          <DeleteProgramButton id={program.id} name={program.name} label="Delete" redirectTo="/program" />
        </div>
      </PageHeader>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">

        <aside className="space-y-6 lg:order-2 lg:sticky lg:top-6">
          <ProgramDetailsCard program={program} />
          <ProgramAiSummaryCard aiSummary={program.aiSummary[0]} programId={program.id} athleteId={program.athlete.id} />
        </aside>

        <div className="min-w-0 space-y-6 lg:order-1">
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="m-0">Phases</h2>
              <PhaseForm
                programId={program.id}
                mode={{ mode: "create" }}
                formLabel="Add phase"
                triggerLabel="Add phase"
              />
            </div>

            {program.phase.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {program.phase.map((phase) => (
                  <Link
                    key={phase.id}
                    href={`?phaseId=${phase.id}`}
                    scroll={false}
                    aria-current={phase.id === phaseId}
                    className={cn(
                      "block space-y-2 rounded-xl p-4 ring-1 ring-foreground/10 transition-colors hover:bg-muted",
                      phase.id === phaseId && "bg-muted ring-2 ring-primary"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <b className="truncate">{phase.name}</b>
                      <Badge variant="outline">{phase.phaseType}</Badge>
                    </div>
                    <p className="m-0 text-sm text-muted-foreground">
                      {format(new Date(phase.startDate), "MMM d")} - {format(new Date(phase.endDate), "MMM d, yyyy")}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-12 text-center">
                <FlagBannerFoldIcon size={32} />
                <b>No phases yet</b>
                <p className="m-0 text-muted-foreground">
                  Split this program into a General phase and a Specific phase <br />
                  leading up to the competition.
                </p>
              </div>
            )}
          </section>

          {phaseId ? (
            <PhaseDetails phaseId={phaseId} />
          ) : program.phase.length > 0 && (
            <p className="m-0 rounded-xl border border-dashed py-10 text-center text-muted-foreground">
              Select a phase to see its sessions.
            </p>
          )}
        </div>

      </div>
    </div>
  )
}