
//Obtener datos de usuario logeado
const userId = localStorage.getItem('userId');


// Obtener los elementos del formulario
const nombre_foto = document.getElementById("photo-name");
const textarea = document.getElementById('descripcion_imagen');

//Contenido de la imagen
let imageContent
let imageName

//Arreglo de albumes de la nube
let albumesAWS = [];


document.getElementById("upload-form").addEventListener("submit", async (event) => {
    event.preventDefault(); // Evita que el formulario se envíe automáticamente

    // Obtener los valores ingresados por el usuario
    const name_foto = nombre_foto.value;
    const descripcion = textarea.value;

    // Mostrar los valores en la consola
    console.log("Nombre de la foto: ", name_foto);
    console.log("Descripcion de la imagen: ", descripcion);

    if (name_foto != '') {
        //Agregar logica para guardar album y nombre de foto en AWS
        try {
            const response = await fetch('http://18.118.153.195:3000/img/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    idUser: userId,
                    description: descripcion,
                    imageContent: imageContent,
                    imageName: imageName
                })
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Imagen Subida:', data);
                alert("La imagen se ha subido!")
            } else {
                // Error de login
                console.error('Error al subir foto:', data.message);
                alert('No se cargo la imagen');
            }
        } catch (error) {
            console.error('Error de red:', error);
        }

    } else {
        alert('No ha registrado un nombre para la foto');
    }


});


//Funcion para cagar nombres de albumes GET Albums
function cargar_datos() {
    //Obtener datos de usuario logeado
    const userId = localStorage.getItem('userId');
    console.log("Id de Usuario: " + userId)

    fetch('http://18.118.153.195:3000/album/get', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            idUser: userId
        })
    })
        .then(response => {
            if (response.ok) {
                return response.json(); // Parsea la respuesta como JSON
            } else {
                throw new Error('Error al obtener albumes');
            }
        })
        .then(data => {
            const data_array = data.data; // Accede al arreglo "data"
            if (Array.isArray(data_array)) {
                // Verifica si 'data' es un array
                data_array.forEach(album => {
                    const albumObject = {
                        albumName: album.albumName,
                        idAlbum: album.idAlbum
                    };
                    albumesAWS.push(albumObject); // Agrega el objeto al array
                });
                console.log(albumesAWS)
                vaciarAlbumes()
                llenarAlbumes()
                // Realiza otras acciones después de editar el álbum si es necesario
            } else {
                console.error('Error: Los datos no son un array');
            }
            // Puedes realizar otras acciones después de editar el álbum si es necesario
        })
        .catch(error => {
            console.error('Error:', error);
        });
    //cargarImagen('/img/barca_neon.jpg');
    //Funcion para llenar las opciones de albumes disponibles
    llenarAlbumes()

}


//Obtener elemento del input de la imagen seleccionada
const imagen_selec = document.getElementById('avatar-input');
imagen_selec.addEventListener('change', handleImageUpload);

// Función para manejar la imagen
function handleImageUpload(event) {
    const file = event.target.files[0]; // Obtiene el archivo seleccionado

    if (file) {
        // Crea un objeto URL para la imagen seleccionada
        const imageUrl = URL.createObjectURL(file);

        // Actualiza la imagen en la sección de avatar
        const avatarImage = document.getElementById('img_user');
        avatarImage.src = imageUrl;

        // Obtener el contenido de la imagen
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            imageContent = reader.result;
            console.log('Contenido de la imagen:', imageContent);

            // Obtener el nombre de la imagen
            imageName = file.name;
            console.log('Nombre de la imagen:', imageName);
            nombre_foto.value = imageName;
        };
    }
}


// Obtener imagen
function cargarImagen(ruta) {
    const rutaImagen = ruta; // Ruta específica de la imagen

    // Obtén el elemento <img> por su id
    const imgElemento = document.getElementById('img_user');

    // Asigna la ruta de la imagen al atributo src
    imgElemento.src = ruta;
}

// Arreglo de nombres de álbumes
const albumes = [];

// Función para llenar las opciones del select
function llenarAlbumes() {
    const select = document.getElementById("album-select");
    // Itera sobre el arreglo de albumes y crea una opción para cada uno
    albumesAWS.forEach((album) => {
        const option = document.createElement("option");
        option.value = album.idAlbum;
        option.textContent = album.albumName;
        select.appendChild(option);
    });
}

// Función para vaciar todas las opciones del select
function vaciarAlbumes() {
    const select = document.getElementById("album-select");
    while (select.options.length > 0) {
        select.remove(0);
    }
}

