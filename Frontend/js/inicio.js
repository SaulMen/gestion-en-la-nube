//Carga los datos de usuario
function datos_usuario() {
    //Obtener datos de usuario logeado
    const userId = localStorage.getItem('userId');
    const profileImage = localStorage.getItem('profileImage');
    const full_name = localStorage.getItem('full_name');
    const us_username = localStorage.getItem('us_username');
    //cargarImagen(profileImage);
    cargarImagen("../img/fondoV.jpg");
    const nameV = "Sebastián Jerez";
    console.log("User ID: " + userId)

    // Actualizar los elementos <p>
    document.getElementById('nomUser').textContent = nameV;
    
}

// Obtener imagen
function cargarImagen(ruta) {
    const rutaImagen = ruta; // Ruta específica de la imagen

    // Obtén el elemento <img> por su id
    const imgElemento = document.getElementById('userImg');

    // Asigna la ruta de la imagen al atributo src
    imgElemento.src = ruta;
}

// Llama a la función al cargar la página
window.onload = datos_usuario;