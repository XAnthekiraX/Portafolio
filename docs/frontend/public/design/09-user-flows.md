# User Flows

## Flow 1: Descubrimiento del perfil

**Usuario**: visitante curioso o reclutador.

```
1. Llega al Hero
2. Lee presentación, título, descripción
3. Ve badge "Disponible para proyectos"
4. Hace scroll descendente
5. Lee About (filosofía profesional)
6. Explora Skills (stack tecnológico)
7. Ve Technologies (herramientas diarias)
8. Examina Projects (4 proyectos con detalles)
9. Revisa Education (formación académica)
10. Ve Services (qué puede contratar)
11. Decide contactar o descargar CV
```

Puntos de decisión alternativos en cualquier punto:
- Click en "Descargar CV" → descarga archivo.
- Click en red social → abre perfil externo.
- Click en enlace proyecto (Repo/Demo) → abre repositorio o demo.
- Click en "Contactar" → salta a formulario.

## Flow 2: Contacto directo

**Usuario**: potencial cliente con proyecto.

```
1. Llega al sitio (posiblemente desde red social o referral)
2. Navega brevemente Hero
3. Click CTA "Contactar" (navbar o hero)
4. Scroll directo a sección Contacto
5. Lee información de contacto (email, ubicación, disponibilidad)
6. Decide usar formulario
7. Completa: Nombre, Correo, Asunto, Mensaje
8. Click "Enviar Mensaje"
```

Punto de decisión alternativo:
- En lugar del formulario, puede copiar el email `hello@alexdoe.com`.

## Flow 3: Exploración de proyectos

**Usuario**: interesado en ver trabajo previo.

```
1. Llega al sitio
2. Navega a Projects vía navbar
3. Hover sobre cada card para ver efectos visuales
4. Click "Demo" para ver proyecto en vivo
5. Click "Repo" para ver código fuente
6. Si proyectos le interesan, continúa a Services o Contacto
```

## Flow 4: Cambio de idioma

**Usuario**: hablante no español.

```
1. Ve sitio en español
2. Click en "ES" en navbar
3. Dropdown muestra: ES (activo), EN, PT
4. Selecciona EN o PT
```

Nota: el cambio de idioma no está implementado funcionalmente en el prototipo.

## Flow 5: Cambio de tema

**Usuario**: prefiere modo claro.

```
1. Ve sitio en modo oscuro (default)
2. Click en icono sol en navbar
3. Sitio cambia a modo claro (fondos blancos, texto oscuro)
4. Click nuevamente para volver a modo oscuro
```

## Flow 6: Navegación móvil

**Usuario**: en dispositivo móvil.

```
1. Abre sitio en móvil
2. Ve navbar compacta con hamburguesa
3. Click hamburguesa para abrir drawer
4. Drawer muestra todas las opciones de navegación
5. Click en sección deseada
6. Drawer se cierra automáticamente
7. Scroll a la sección seleccionada
```
