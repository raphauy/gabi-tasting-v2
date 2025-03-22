import * as z from "zod"
import { prisma } from "@/lib/db"
import { getDefaultTastingDays } from "./tastingday-services"
import { WineCriticDAO } from "./winecritic-services"
import { WineDAO } from "./wine-services"
import { WineTastingDAO } from "./winetasting-services"
import { TastingDAO } from "./tasting-services"
import { ReviewDAO } from "./review-services"
import * as XLSX from 'xlsx'
import { format } from "date-fns"
import { es } from "date-fns/locale"

export type WineryDAO = {
	id: string
	name: string
	slug: string
	description: string | null | undefined
	image: string | null | undefined
	wineCriticId: string
	wineCritic: WineCriticDAO
	createdAt: Date
	updatedAt: Date
}

export const WinerySchema = z.object({
	name: z.string().min(1, "name is required."),
	slug: z.string().min(1, "slug is required."),
	description: z.string().nullable().optional(),
	image: z.string().nullable().optional(),
	wineCriticId: z.string().min(1, "wineCriticId is required."),
})

export type WineryFormValues = z.infer<typeof WinerySchema>


export async function getWinerysDAO(wineCriticId: string) {
  const found = await prisma.winery.findMany({
    where: {
      wineCriticId
    },
    orderBy: {
      id: 'asc'
    },
    include: {
      wineCritic: true,
    }
  })
  return found as WineryDAO[]
}

export async function getWineryDAO(id: string) {
  const found = await prisma.winery.findUnique({
    where: {
      id
    },
  })
  return found as WineryDAO
}

export async function getWineryDAOBySlug(slug: string) {
  console.log("getWineryDAOBySlug", slug)
  const found = await prisma.winery.findUnique({
    where: {
      slug
    },
    include: {
      wineCritic: true
    }
  })
  return found as WineryDAO
}
    
export async function createWinery(data: WineryFormValues) {
  const created = await prisma.winery.create({
    data
  })
  
  return created
}

export async function updateWinery(id: string, data: WineryFormValues) {
  const updated = await prisma.winery.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteWinery(id: string) {
  const deleted = await prisma.winery.delete({
    where: {
      id
    },
  })
  return deleted
}

export async function getWinerysDAOByTastingId(tastingId: string) {
  const found = await prisma.winery.findMany({
    where: {
      tastings: {
        some: {
          tastingId
        }
      }
    }
  })
  return found as WineryDAO[]
}

export async function getFullWinerysDAOByTastingId(tastingId: string) {
  // get wineries by tasting id, include wines and his wine tasting
  const found = await prisma.winery.findMany({
    where: {
      tastings: {
        some: {
          tastingId
        }
      }
    },
    include: {
      wines: {
        include: {
          review: true
        }
      },
    },
    orderBy: {
      name: 'asc'
    }
  })
  return found
}

export async function addWineryToTastingDay(tastingDayId: string, wineryId: string) {
  const created = await prisma.tastingDayWinery.create({
    data: {
      tastingDayId,
      wineryId
    }
  })

  return created
}

export async function getWinerysDAOByWineCriticId(wineCriticId: string) {
  const found = await prisma.winery.findMany({
    where: {
      wineCriticId
    }
  })
  return found as WineryDAO[]
}

export async function addWineryToTasting(tastingId: string, wineryId: string) {
  const created= await prisma.wineryTasting.create({
    data: {
      tastingId,
      wineryId
    }
  })

  // get default tasting day of tasting
  const defaultTastingDay= await prisma.tastingDay.findFirst({
    where: {
      tastingId
    }
  })
  if (defaultTastingDay) {
    await addWineryToTastingDay(defaultTastingDay.id, wineryId)
  } else {
    console.error("No default tasting day found for tasting", tastingId)
  }

  return created
}

export async function removeWineryFromTasting(tastingId: string, wineryId: string) {
  // first remove all tasting days of winery for this tasting
  await prisma.tastingDayWinery.deleteMany({
    where: {
      wineryId,
      tastingDay: {
        tastingId
      }
    }
  })
  const deleted = await prisma.wineryTasting.delete({
    where: {
      wineryId_tastingId: {
        wineryId,
        tastingId
      }
    }
  })
  return deleted
}

export async function addAllWineriesToTasting(tastingId: string, wineryIds: string[]) {
  
  for (const wineryId of wineryIds) {
    await addWineryToTasting(tastingId, wineryId)
  }

  return true
}

export async function removeAllWineriesFromTasting(tastingId: string) {

  const tastingWineries= await getWinerysDAOByTastingId(tastingId)
  for (const tastingWinery of tastingWineries) {
    await removeWineryFromTasting(tastingId, tastingWinery.id)
  }
  
  return true
}

export async function getFirstTastingSlug(wineryId: string) {
  const tasting= await prisma.winery.findFirst({
    where: {
      id: wineryId
    },
    include: {
      tastings: {
        orderBy: {
          order: 'asc'
        },
        include: {
          tasting: true
        }
      }
    }
  })
  if (tasting?.tastings.length === 0) return null

  return tasting?.tastings[0].tasting.slug
}

export async function getWineryNameBySlug(slug: string) {
  const winery= await prisma.winery.findUnique({
    where: {
      slug
    }
  })
  return winery?.name
}

/**
 * Función para formatear valores complejos (arrays, objetos) para Excel
 */
function formatValue(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }
  
  if (typeof value === 'object') {
    if (Array.isArray(value)) {
      return value.map(item => formatValue(item)).join(', ');
    } else {
      try {
        return JSON.stringify(value);
      } catch (e) {
        return String(value);
      }
    }
  }
  
  return String(value);
}

/**
 * Función para sanitizar el nombre de una hoja de Excel (máx 31 caracteres, sin caracteres prohibidos)
 */
function sanitizeSheetName(name: string): string {
  // Excel limita los nombres de hoja a 31 caracteres y no permite: [ ] * ? : / \
  return name
    .replace(/[\[\]*?:/\\]/g, '')
    .substring(0, 31);
}

export async function getReportToExport(tastingId: string) {
  // Obtener los datos de bodegas, vinos y reviews
  const wineries = await getFullWinerysDAOByTastingId(tastingId);
  
  // Formatear la fecha en español
  const formatDate = (date: Date | null | undefined) => {
    if (!date) return '';
    return format(date, "d 'de' MMMM, yyyy", { locale: es });
  };
  
  // Procesar los datos para aplanarlos y poder exportarlos a Excel
  const flattenedData = wineries.flatMap(winery => {
    return winery.wines.map(wine => {
      // Limpiar el HTML de las notas de cata si existe
      let tastingNote = '';
      if (wine.review?.tastingNote) {
        // Eliminar etiquetas HTML de manera simple
        tastingNote = wine.review.tastingNote.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      }
      
      return {
        // Solo incluimos los datos que se muestran en la UI
        'Bodega': winery.name,
        'Vino': wine.name, 
        'Añada': wine.vintage,
        'Región': wine.region || '',
        'ABV (%)': wine.abv ? `${wine.abv}%` : '',
        'Puntaje': wine.review?.score || '',
        'Nota de Cata': tastingNote,
        'Fecha de Cata': wine.review?.createdAt ? formatDate(wine.review.createdAt) : '',
      } as Record<string, string | number>;
    });
  });
  
  // Definir el orden de las columnas para el Excel
  const columns = [
    'Bodega',
    'Vino', 
    'Añada', 
    'Región', 
    'ABV (%)',
    'Puntaje', 
    'Nota de Cata',
    'Fecha de Cata',
  ];
  
  // Crear matriz de datos para Excel
  const excelData = [
    columns, // Primera fila con los nombres de las columnas
    ...flattenedData.map(item => 
      columns.map(col => (item as Record<string, any>)[col] || '') // Para cada columna, obtener el valor o vacío si no existe
    )
  ];
  
  // Crear el libro de Excel
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(excelData);
  
  // Ajustar el ancho de las columnas
  const maxWidth = 80; // Ampliamos el ancho máximo para la nota de cata
  const colWidths = columns.map(col => {
    // Para la nota de cata, damos un ancho generoso
    if (col === 'Nota de Cata') {
      return { wch: 80 };
    }
    
    const maxContentLength = Math.max(
      col.length,
      ...flattenedData.map(item => {
        const content = String((item as Record<string, any>)[col] || '');
        // Calculamos el ancho basado en la línea más larga si hay múltiples líneas
        return Math.min(maxWidth, 
          Math.max(...content.split('\n').map(line => line.length))
        );
      })
    );
    return { wch: maxContentLength };
  });
  ws['!cols'] = colWidths;
  
  // Ajustar el alto de las filas para acomodar contenido multilínea
  const rowHeights = excelData.map(row => {
    const maxLines = Math.max(...row.map(cell => 
      String(cell).split('\n').length
    ));
    return { hpt: maxLines * 15 }; // 15 puntos por línea
  });
  ws['!rows'] = rowHeights;
  
  // Obtener el nombre de la cata para la hoja
  const tasting = await prisma.tasting.findUnique({
    where: { id: tastingId }
  });
  
  const sheetName = sanitizeSheetName(tasting?.name || 'Reporte de Cata');
  
  // Agregar la hoja al libro
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  
  // Generar el archivo Excel
  const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  
  return excelBuffer;
}