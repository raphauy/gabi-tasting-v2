import { getTastingsSummary } from "@/services/analytics";
import Dashboard from "./dashboard";

type Props = {
  params: Promise<{ wineCriticSlug: string }>
}

export default async function TastingPage({ params }: Props) {
  const { wineCriticSlug } = await params
  const tastingsSummary = await getTastingsSummary(wineCriticSlug)

  return (
    <div className="mt-10 space-y-4 text-center">
      <p className="text-2xl font-bold">Dashboard</p>
      <Dashboard tastingsSummary={tastingsSummary} />
    </div>
  )
}
