// Efemérides de programación curadas por fecha (mes-día)
// Cada entrada contiene eventos reales de la historia de la programación

export interface EphemerideData {
  id: string
  date: string
  title: string
  description: string
  year: number
  category: string
  created_at: string
}

// Mapa de efemérides por mes-día (formato MM-DD)
export const EPHEMERIDES_BY_DATE: Record<string, EphemerideData> = {
  '08-14': {
    id: 'aug-14-1',
    date: '2025-08-14',
    title: 'Primer uso del término "Debugging"',
    description: 'El 14 de agosto de 1947, Grace Hopper, pionera de la computación, encontró una polilla real atrapada en un relé del Harvard Mark II, causando un mal funcionamiento. Este incidente popularizó el término "debugging" (depuración) en la programación. Hopper pegó la polilla en su bitácora con la nota "First actual case of bug being found". Aunque el término ya se usaba antes, este evento físico lo inmortalizó en la cultura de la programación.',
    year: 1947,
    category: 'Historia de la Depuración',
    created_at: new Date().toISOString()
  },
  '08-13': {
    id: 'aug-13-1',
    date: '2025-08-13',
    title: 'Nacimiento de Dan Bricklin',
    description: 'El 13 de agosto de 1951 nació Dan Bricklin, co-creador de VisiCalc, la primera hoja de cálculo electrónica. VisiCalc fue lanzada en 1979 y se considera el "killer app" que impulsó las ventas de computadoras personales Apple II. Su invención revolucionó la forma en que las empresas manejaban datos financieros y se convirtió en el precursor de Microsoft Excel y otras hojas de cálculo modernas.',
    year: 1951,
    category: 'Software de Productividad',
    created_at: new Date().toISOString()
  },
  '08-15': {
    id: 'aug-15-1',
    date: '2025-08-15',
    title: 'Lanzamiento de Windows 95',
    description: 'El 15 de agosto de 1995, Microsoft lanzó Windows 95, un sistema operativo que transformó la computación personal. Introdujo el botón Inicio, la barra de tareas y soporte nativo para nombres de archivo largos. Fue el primer Windows en integrar MS-DOS y Windows en un solo producto. Su campaña publicitaria con "Start Me Up" de los Rolling Stones costó 300 millones de dólares. Windows 95 vendió 7 millones de copias en las primeras cinco semanas.',
    year: 1995,
    category: 'Sistemas Operativos',
    created_at: new Date().toISOString()
  },
  '01-01': {
    id: 'jan-01-1',
    date: '2025-01-01',
    title: 'El Bug del Año 2000 no colapsa el mundo',
    description: 'El 1 de enero de 2000, millones de programadores celebraron cuando sus esfuerzos por corregir el "Bug Y2K" resultaron exitosos. Durante años, la industria trabajó para actualizar sistemas que usaban solo dos dígitos para el año, temiendo un colapso global. El problema surgía porque muchos sistemas interpretarían "00" como 1900 en lugar de 2000. Aunque algunos sistemas menores fallaron, no ocurrió la catástrofe predicha, demostrando la efectividad de la preparación masiva de la comunidad de desarrollo.',
    year: 2000,
    category: 'Crisis Tecnológica',
    created_at: new Date().toISOString()
  },
  '12-09': {
    id: 'dec-09-1',
    date: '2025-12-09',
    title: 'Nacimiento de Grace Hopper',
    description: 'El 9 de diciembre de 1906 nació Grace Murray Hopper, pionera de la programación de computadoras. Desarrolló el primer compilador para un lenguaje de programación y fue instrumental en el desarrollo de COBOL. Popularizó el término "debugging" y creó el concepto de lenguajes de programación independientes de la máquina. Su trabajo sentó las bases para hacer la programación más accesible y comprensible para humanos.',
    year: 1906,
    category: 'Pioneros de la Programación',
    created_at: new Date().toISOString()
  }
}

// Función para obtener la efeméride del día
export function getTodayEphemeride(): EphemerideData {
  const today = new Date()
  const monthDay = today.toISOString().slice(5, 10) // Formato MM-DD
  
  // Si existe una efeméride específica para hoy, devolverla
  if (EPHEMERIDES_BY_DATE[monthDay]) {
    const ephemeride = EPHEMERIDES_BY_DATE[monthDay]
    return {
      ...ephemeride,
      date: today.toISOString().split('T')[0] // Actualizar con la fecha actual
    }
  }
  
  // Fallback: devolver una efeméride aleatoria
  const ephemerides = Object.values(EPHEMERIDES_BY_DATE)
  const randomIndex = Math.floor(Math.random() * ephemerides.length)
  const randomEphemeride = ephemerides[randomIndex]
  
  return {
    ...randomEphemeride,
    id: `random-${Date.now()}`,
    date: today.toISOString().split('T')[0],
    title: `${randomEphemeride.title} (Efeméride Aleatoria)`,
    description: `${randomEphemeride.description}\n\n[Nota: Esta es una efeméride aleatoria ya que no hay una específica para el ${today.getDate()} de ${today.toLocaleDateString('es-ES', { month: 'long' })}.]`
  }
}

// Función para obtener efeméride por fecha específica
export function getEphemerideByDate(dateString: string): EphemerideData | null {
  const date = new Date(dateString)
  const monthDay = date.toISOString().slice(5, 10)
  
  if (EPHEMERIDES_BY_DATE[monthDay]) {
    return {
      ...EPHEMERIDES_BY_DATE[monthDay],
      date: dateString
    }
  }
  
  return null
}

// Lista de todas las fechas con efemérides disponibles
export function getAvailableDates(): string[] {
  return Object.keys(EPHEMERIDES_BY_DATE).sort()
}
