
type Props = {
  params: Promise<{
    wineCriticSlug: string
    winerySlug: string
  }>
}

export default async function UsersPage({ params }: Props) {
  const { wineCriticSlug, winerySlug } = await params
  return (  
    <div className="w-full text-center">
      <h1>Winery Users Page</h1>
      <p>{wineCriticSlug}</p>
      <p>{winerySlug}</p>
    </div>
  )
}
