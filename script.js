/* =============================================================================
   CARGA DE DATOS
   Obtiene el JSON con todo el contenido de la app y arranca el renderizado
============================================================================= */
let data = []

async function iniciar() {
    try {
        const res = await fetch('./data.json')
        data = await res.json()
        render('inicio')
    } catch (e) {
        console.error("Error cargando datos:", e)
    }
}

document.addEventListener('DOMContentLoaded', () => {
    iniciar()
})


/* =============================================================================
   REFERENCIAS AL DOM
   Centraliza todos los elementos del DOM para no repetir getElementById
============================================================================= */
const DOM = {
    boton_menu:     document.getElementById('boton_menu'),
    menu:           document.getElementById('menu'),
    contenido:      document.getElementById('contenido'),
    overlay:        document.getElementById('overlay'),
    logo:           document.getElementById('logo'),
    container:      document.getElementById('contenido_container'),
    titulo_general: document.getElementById('titulo_general')
}


/* =============================================================================
   MENÚ LATERAL
   Abre y cierra el menú deslizante y gestiona el scroll y el overlay
============================================================================= */
function menu() {
    DOM.contenido.classList.toggle('menu_oculto')

    if (DOM.contenido.classList.contains('menu_oculto')) {
        DOM.overlay.classList.remove('activo')
        document.body.style.overflow = 'auto'
    } else {
        DOM.overlay.classList.add('activo')
        document.body.style.overflow = 'hidden'
    }
}


/* =============================================================================
   LISTENERS DE EVENTOS
   Asocia las acciones del usuario (clic en logo, menú y overlay) a funciones
============================================================================= */

// Clic en el logo → vuelve a inicio
DOM.logo.addEventListener('click', () => {
    cargar_inicio()
})

// Clic en el botón ☰ → abre/cierra el menú lateral
DOM.boton_menu.addEventListener('click', (e) => {
    e.stopPropagation()
    menu()
})

// Clic en el overlay → cierra el menú si está abierto
DOM.overlay.addEventListener('click', () => {
    if (!DOM.contenido.classList.contains('menu_oculto')) {
        menu()
    }
})

// Delegación de eventos en el menú: detecta el botón pulsado y navega
DOM.menu.addEventListener('click', (e) => {
    const boton = e.target.closest('.elemento_menu') || e.target.closest('.menu_header')
    if (!boton) return

    const seccion = boton.dataset.seccion
    switch (seccion) {
        case 'inicio': cargar_inicio();            break
        case 'libro':  cargar_libro(boton.dataset.id); break
        case 'otros':  cargar_otros();             break
    }
})


/* =============================================================================
   NAVEGACIÓN
   Funciones que traducen una acción de menú en una llamada al renderizador
============================================================================= */
function cargar_inicio() { render('inicio') }
function cargar_libro(indice) { render(indice) }
function cargar_otros() { render('otros') }


/* =============================================================================
   RENDERIZADOR PRINCIPAL
   Recorre los apartados del JSON seleccionado y genera el HTML de la sección
============================================================================= */
function render(apartado) {
    DOM.titulo_general.innerHTML = data[apartado].titulo_general
    const datos = data[apartado].apartados
    let html = ''

    datos.forEach(apartado => {
        if (apartado.titulo) {
            html += `<h1>${apartado.titulo}</h1>`
        }

        let contenido_html = ''
        
        apartado.contenido.forEach(item => {
            if (typeof item === 'string') {
                contenido_html += `<p>${item}</p>`
            } else if (typeof item === 'object' && item.tipo === 'tabla') {
                contenido_html += render_tabla(item)
            } else if (typeof item === 'object' && (item.tipo === 'lista' || item.tipo === 'lista_ordenada')) {
                contenido_html += render_lista(item)
            }
        })

        if (apartado.imagen && apartado.imagen.style === 'grip-i') {
            html += `<div class="grip_container-i">`
            html += `<img src="${apartado.imagen.url}" class="${'grip'}">`
            html += `<div>${contenido_html}</div>`
            html += `</div>`

        } else if (apartado.imagen && apartado.imagen.style === 'grip-d') {
            html += `<div class="grip_container-d">`
            html += `<div>${contenido_html}</div>`
            html += `<img src="${apartado.imagen.url}" class="${'grip'}">`
            html += `</div>`

        } else {
            html += contenido_html
            if (apartado.imagen) {
                html += `<img src="${apartado.imagen.url}" class="${apartado.imagen.style}">`
            }
        }
    })

    DOM.container.innerHTML = html
    window.scrollTo({ top: 0, behavior: 'smooth' })
}


/* =============================================================================
   RENDERIZADOR DE TABLAS
   Genera una <table> a partir de un bloque de tipo "tabla" del JSON.
   Soporta filas con título, imagen y objeto de información clave-valor
============================================================================= */
function render_tabla(item) {
    let html = '<table>'

    item.lineas.forEach(linea => {
        html += '<tr>'
        for (const [clave_linea, contenido] of Object.entries(linea)) {

            if (clave_linea === 'titulo') {
                html += `<td colspan="2"><h2>${contenido}</h2></td></tr><tr>`

            } else if (typeof contenido === 'object' && clave_linea !== 'imagen') {
                html += `<td>`
                for (const [clave_info, elemento_linea] of Object.entries(contenido)) {
                    let nombre = clave_info.replace(/_/g, ' ')
                    nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1)
                    if (Array.isArray(elemento_linea)) {
                        html += `<b>${nombre}:</b><ul>`
                        elemento_linea.forEach(lista => { html += `<li>${lista}</li>` })
                        html += `</ul>`
                    } else {
                        html += `<strong>${nombre}:</strong> ${elemento_linea}<br>`
                    }
                }
                html += `</td>`

            } else {
                if (clave_linea === 'imagen') {
                    html += `<td><img src="${contenido.url}" style="${contenido.style}" alt="imagen"></td>`
                } else {
                    html += `<td>${contenido}</td>`
                }
            }
        }
        html += '</tr>'
    })

    html += '</table>'
    return html
}


/* =============================================================================
   RENDERIZADOR DE LISTAS
   Genera <ul> o <ol> a partir de bloques "lista" / "lista_ordenada" del JSON.
   Soporta anidamiento, descripciones (dd) y formato "negrita: texto normal"
============================================================================= */
function render_lista(item) {
    let contenido_html = ''

    if (item.titulo) {
        contenido_html += `<h3>${item.titulo}</h3>`
    }

    contenido_html += item.tipo === 'lista_ordenada' ? '<ol>' : '<ul>'

    item.lineas.forEach(linea => {
        if (typeof linea === 'object' && linea.tipo === 'lista') {
            contenido_html += '<li>' + render_lista(linea) + '</li>'

        } else {
            if (linea.dd) {
                contenido_html += `<li><b>${linea.li}</b></li><dd>${linea.dd}</dd><br>`

            } else {
                const marcador = linea.li.indexOf(':')
                if (marcador !== -1) {
                    const negrita = linea.li.substring(0, marcador + 1)
                    const normal  = linea.li.substring(marcador + 1)
                    contenido_html += `<li><b>${negrita}</b>${normal}</li>`
                } else {
                    contenido_html += `<li>${linea.li}</li>`
                }
            }
        }
    })

    contenido_html += item.tipo === 'lista_ordenada' ? '</ol>' : '</ul>'

    // Contenido adicional tras la lista (párrafos, tablas, sublistas)
    if (item.contenido) {
        item.contenido.forEach(elemento => {
            if (typeof elemento === 'string') {
                contenido_html += `<p>${elemento}</p>`
            } else if (typeof elemento === 'object' && elemento.tipo === 'tabla') {
                contenido_html += render_tabla(elemento)
            } else if (typeof elemento === 'object' && (elemento.tipo === 'lista' || elemento.tipo === 'lista_ordenada')) {
                contenido_html += render_lista(elemento)
            }
        })
    }

    let html = ''

    if (item.imagen && item.imagen.style === 'grip-i') {
        html += `<div class="grip_container-i">`
        html += `<img src="${item.imagen.url}" class="${'grip'}">`
        html += `<div>${contenido_html}</div>`
        html += `</div>`
    } else {
        html += contenido_html
        if (item.imagen) {
            html += `<img src="${item.imagen.url}" class="${item.imagen.style}">`
        }
    }

    return html
}
