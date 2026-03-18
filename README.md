# Jardín Genético (Genetic Gardener)

Una simulación interactiva de herencia genética, dinámica de poblaciones y selección evolutiva.

## 🌿 Descripción Conceptual

**Jardín Genético** es una herramienta pedagógica diseñada para visualizar conceptos complejos de la biología evolutiva a través de la metáfora de un jardín de flores. El proyecto permite a los usuarios observar cómo los rasgos (fenotipos) se transmiten de generación en generación basándose en la arquitectura genética subyacente (genotipos).

### Conceptos Clave
- **Herencia Mendeliana**: Transmisión de rasgos discretos a través de alelos dominantes y recesivos.
- **Dominancia Incompleta**: Rasgos que muestran un estado intermedio en individuos heterocigotos.
- **Herencia Poligénica**: Rasgos determinados por múltiples genes, lo que resulta en una distribución continua (curva de campana).
- **Deriva Genética**: Cambios aleatorios en las frecuencias alélicas, especialmente potentes en poblaciones pequeñas.
- **Selección Natural**: El proceso por el cual los individuos con rasgos favorables para un "objetivo" ambiental tienen más probabilidades de reproducirse.

---

## 🎮 Guía de Uso

El simulador avanza a través de varias fases de complejidad creciente:

1.  **Simplicidad Mendeliana**: Un solo gen, dominancia completa.
2.  **Mendelismo Frágil**: Un solo gen, dominancia incompleta (colores intermedios).
3.  **Multigénico**: Introducción de 4 genes que suman sus efectos.
4.  **Poligénico Completo**: 20 genes trabajando juntos para crear un espectro de color.
5.  **Robustez**: Cómo los sistemas genéticos pueden amortiguar mutaciones.
6.  **Selección vs. Deriva**: El desafío final donde controlas la presión selectiva.

### Controles Principales
- **Jardinero Genético**: Permite inspeccionar una flor individual, ver su ADN y realizar cruces dirigidos o ediciones genéticas.
- **Gestión del Jardín**: Ajusta la tasa de mutación, el tamaño de la población y la velocidad de las estaciones.
- **Modos de Vista**: Cambia entre una disposición aleatoria, por frecuencia (los más comunes al centro) o por color (degradado circular).

---

## 🛠️ Detalles Técnicos

### Arquitectura
- **Frontend**: React 18 con TypeScript.
- **Estilizado**: Tailwind CSS para una interfaz moderna y responsiva.
- **Animaciones**: Framer Motion para transiciones fluidas.
- **Visualización**: D3.js y Recharts para el análisis de datos en tiempo real.

### El Motor Genético (`engine.ts`)
- **Genotipo**: Representado como un array de bits (0 y 1). Cada gen consta de dos alelos.
- **Fenotipo**: Calculado como una proporción de alelos dominantes, con funciones de "estiramiento" estadístico para permitir que los rasgos extremos sean alcanzables a pesar del Teorema del Límite Central.
- **Reproducción**: Implementa segregación independiente y mutación puntual.

### Régimen de Selección (Fase 6)
En la fase final, el sistema utiliza un modelo de **Aptitud Biológica (Fitness)**:
1.  **Cálculo de Aptitud**: Se mide la distancia entre el color de la flor y el objetivo. La aptitud sigue una curva exponencial:  
    `fitness = exp(-distancia^1.5 * 12 * fuerza_seleccion)`
2.  **Elitismo**: El 5% superior de la población sobrevive automáticamente a la siguiente generación para preservar los mejores rasgos.
3.  **Selección por Ruleta**: Los padres para el resto de la población se eligen proporcionalmente a su aptitud.

---

## 🌐 Soporte Multi-idioma
La aplicación es completamente bilingüe (Español/Inglés), permitiendo su uso en diversos entornos educativos.

---

## 🚀 Desarrollo
Para ejecutar el proyecto localmente:
1. `npm install`
2. `npm run dev`

Desarrollado con un enfoque en la **estética minimalista** y la **claridad pedagógica**.
