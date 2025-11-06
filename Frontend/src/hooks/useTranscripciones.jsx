import { useState, useEffect } from 'react'

export function useTranscripciones() {
    const [textos, setTextos] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Simulación: esto luego puedes reemplazar por tu API real
        setTimeout(() => {
            setTextos({
                TXT: `Bienvenidos a este curso de React Hooks...`,
                'SRT/VTT': `1\n00:00:00,000 --> 00:00:05,000\nBienvenidos a este curso de React Hooks.`,
                MARKDOWN: `# Curso de React Hooks\n\n**useState** nos permite añadir estado...`
            })
            setLoading(false)
        }, 1000)
    }, [])

    return { textos, loading }
}
