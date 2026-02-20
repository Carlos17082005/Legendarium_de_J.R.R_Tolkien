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

const DOM = {  // Array con las variables del DOM
    boton_menu: document.getElementById('boton_menu'),
    menu: document.getElementById('menu'),
    contenido: document.getElementById('contenido'),
    overlay: document.getElementById('overlay'),
    logo: document.getElementById('logo'),
    container: document.getElementById('contenido_container'),
    titulo_general: document.getElementById('titulo_general')
}

function menu()  {
    DOM.contenido.classList.toggle('menu_oculto')
    if (DOM.contenido.classList.contains('menu_oculto')) {
        DOM.overlay.classList.remove('activo')
        document.body.style.overflow = 'auto' // Permitir scroll
    } else {
        DOM.overlay.classList.add('activo')
        document.body.style.overflow = 'hidden' // Bloquear scroll de fondo
    }
}

// Listeners
DOM.logo.addEventListener('click', (e) => {
    cargar_inicio()
})

DOM.boton_menu.addEventListener('click', (e) => {
    e.stopPropagation()
    menu()
})

DOM.overlay.addEventListener('click', () => {
    if (!contenido.classList.contains('menu_oculto')) {
        menu()
    }
})


DOM.menu.addEventListener('click', (e) => { 
    const boton = e.target.closest('.elemento_menu') || e.target.closest('.menu_header')
    if (!boton) return

    const seccion = boton.dataset.seccion
    switch (seccion)  {
        case 'inicio':
            cargar_inicio()
            break
        case 'libro':
            let indice = boton.dataset.id
            cargar_libro(indice)
            break
        case 'otros':
            cargar_otros()
            break
    }
})

function cargar_inicio() {
    render('inicio')
}
function cargar_libro(indice) {
    render(indice)
}
function cargar_otros() {
    render('otros')
}

document.addEventListener('DOMContentLoaded', () => {
    iniciar()    
})





/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

function render(apartado) {
    DOM.titulo_general.innerHTML = data[apartado].titulo_general
    const datos = data[apartado].apartados
    let html =  ''
        
    datos.forEach(apartado => {
        if (apartado.titulo)  {
            html += `<h1>${apartado.titulo}</h1>`
        }
        apartado.contenido.forEach(item => {
            if (typeof item === 'string') {
                html += `<p>${item}</p>`

            } else if (typeof item === 'object' && item.tipo === 'tabla') {
                html += render_tabla(item)

            } else if (typeof item === 'object' && item.tipo === 'lista' || item.tipo === 'lista_ordenada') {
                html += render_lista(item)
            }
        })
        if (apartado.imagen) {
            html += `<img src="${apartado.imagen.url}" class="${apartado.imagen.style}">`
        }
    })
    DOM.container.innerHTML = html
}

function render_tabla(item)  {
    let html = '<table>'

    item.lineas.forEach(linea => {
        html += '<tr>'
        for (const [clave_linea, contenido] of Object.entries(linea)) {    
            if (clave_linea === 'titulo')  {
                html += `<td colspan="2"><h2>${contenido}</h2></td></tr><tr>`
            
            }  else if (typeof contenido === 'object' && clave_linea !== 'imagen') {
                html += `<td>`
                
                for (const [clave_info, elemento_linea] of Object.entries(contenido)) {
                    let nombre = clave_info.replace(/_/g, ' ')
                    nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1)
                    if (Array.isArray(elemento_linea))  {
                        html += `<b>${nombre}:</b><ul>`
                        elemento_linea.forEach(lista => {
                            html += `<li>${lista}</li>`
                        })
                        html += `</ul>`
                    
                    }  else  {
                        html += `<strong>${nombre}:</strong> ${elemento_linea}<br>`
                    }
                }
                html += `</td>`
            
            }  
            else  {
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

function render_lista(item)  {
    let html = ''
    if (item.titulo)  {
        html += `<h3>${item.titulo}</h3>`
    }
    if (item.tipo === "lista_ordenada") {
        html += '<ol>'
    }  else {
        html += '<ul>'
    }
    
    item.lineas.forEach(linea => {
        if (typeof linea === 'object' && linea.tipo === 'lista') {
            html += '<li>' + render_lista(linea) + '</li>'
        
        }  else {
            if (linea.dd)  {
                html += `<li><b>${linea.li}</b></li><dd>${linea.dd}</dd><br>`

            } else  {
                const marcador = linea.li.indexOf(':')
                if (marcador !== -1) {
                    const b = linea.li.substring(0, marcador + 1);
                    const normal = linea.li.substring(marcador + 1);
                    
                    html += `<li><b>${b}</b>${normal}</li>`
                } 
                else {
                    html += `<li>${linea.li}</li>`
                }
            }
        }
    })
    if (item.tipo === "lista_ordenada") {
        html += '</ol>'
    }  else {
        html += '</ul>'
    }

    if (item.contenido)  {
        item.contenido.forEach(item => {
            if (typeof item === 'string') {
                html += `<p>${item}</p>`

            } else if (typeof item === 'object' && item.tipo === 'tabla') {
                html += render_tabla(item)

            } else if (typeof item === 'object' && item.tipo === 'lista' || item.tipo === 'lista_ordenada') {
                html += render_lista(item)
            }
        })
    }

    if (item.imagen) {
        html += `<img src="${item.imagen.url}" class="${item.imagen.style}">`
    }

    return html
}
