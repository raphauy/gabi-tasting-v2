
type Props = {
    params: Promise<{ tastingSlug: string }>
}

export default async function TastingPage({ params }: Props) {
    const { tastingSlug } = await params

    return (
        <div className="flex flex-col items-center justify-center mt-10">
            <p className="text-2xl font-bold">TastingPage ({tastingSlug})</p>
            <p className="text-lg text-gray-500">En desarollo</p>
        </div>
    )
}