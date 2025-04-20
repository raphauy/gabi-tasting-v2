import { getTastingDAO } from "@/services/tasting-services";
import { getReportToExport } from "@/services/winery-services";
import { format } from "date-fns";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    
    const tastingId = searchParams.get("tastingId")
    const wineryId = searchParams.get("wineryId") || undefined

    if (!tastingId) {
        return NextResponse.json({ "error": "Tasting ID is required" }, { status: 400 })
    }

    const tasting = await getTastingDAO(tastingId)
    if (!tasting) {
        return NextResponse.json({ "error": "Tasting not found" }, { status: 404 })
    }

    console.log("tastingId:", tastingId)
    if (wineryId) {
        console.log("wineryId:", wineryId)
    }

    try {
        const excelBuffer = await getReportToExport(tastingId, wineryId)
        
        // Crear el nombre del archivo con indicación de filtrado si existe
        let fileName = `${tasting.slug}`
        
        // Si hay un filtro por bodega, agregarlo al nombre del archivo
        if (wineryId) {
            fileName += `_filtered`
        }
        
        fileName += `_${format(new Date(), 'yyyy-MM-dd-HH-mm')}.xlsx`

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

