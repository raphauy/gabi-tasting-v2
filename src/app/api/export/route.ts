import { getTastingDAO } from "@/services/tasting-services";
import { getReportToExport } from "@/services/winery-services";
import { format } from "date-fns";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    
    const tastingId = searchParams.get("tastingId")

    if (!tastingId) {
        return NextResponse.json({ "error": "Tasting ID is required" }, { status: 400 })
    }

    const tasting = await getTastingDAO(tastingId)
    if (!tasting) {
        return NextResponse.json({ "error": "Tasting not found" }, { status: 404 })
    }

    console.log("tastingId:", tastingId)

    try {
        const excelBuffer = await getReportToExport(tastingId)
        
        // Crear el nombre del archivo
        const fileName = `${tasting.slug}_${format(new Date(), 'yyyy-MM-dd-HH-mm')}.xlsx`

        // Retornar el archivo para descarga
        return new NextResponse(excelBuffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename="${fileName}"`,
            },
        })
    } catch (error) {
        console.error("Error exporting data:", error)
        return NextResponse.json({ "error": "Error exporting data" }, { status: 500 })
    }
}

