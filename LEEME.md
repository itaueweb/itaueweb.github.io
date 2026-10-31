# ITAUE: Lo que el tiempo escupió - Despliegue Web

Este es el paquete de despliegue completo para la presentación del libro. Incluye la Landing Page y el Lector Online con el Prólogo y Capítulo I reales.

## Cómo desplegar

1. Sube todos los archivos y carpetas a tu servidor web (Hostinger, Vercel, Netlify, etc.).
2. Asegúrate de que el archivo principal sea `index.html`.
3. El lector está en `lector.html`.

## Cómo añadir el Poemario (Escalabilidad)

Para demostrar que el motor es reutilizable (como acordamos con el cliente), puedes crear una carpeta llamada `poemario` y subir allí los archivos de "Manual para naufragar". Al compartir el mismo motor (`lector.js` y `lector.css`), solo necesitas cambiar el archivo de datos (`datos-poemario.js`) y adaptar la paleta de colores en un CSS específico.

## Arquitectura de Textos

El libro se lee desde `js/datos-itaue.js`. Si deseas cambiar el texto extraído, edita el array `paginas` en ese archivo.

## Advertencia de Seguridad
Actualmente, el texto del Prólogo y Capítulo I está visible en el código fuente. Para la versión de venta final (el libro completo), el Desarrollador Backend debe configurar un sistema de tokens para que `datos.js` no sea accesible sin pago previo.