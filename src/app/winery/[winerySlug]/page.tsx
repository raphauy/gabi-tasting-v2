
type Props = {
  params: Promise<{
    winerySlug: string
  }>
}

export default async function WineryPage({ params }: Props) {
  const { winerySlug } = await params
  return (
    <div className="w-full text-center">
      <h1>WineryPage</h1>
      <p>{winerySlug}</p>
    </div>
  )
}
