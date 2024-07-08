
// Obtener los elementos del formulario
const usernameInput = document.getElementById("username");
const fullnameInput = document.getElementById("fullname");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const avatarImage = document.getElementById('avatar');

//Obtener elemento del input de la imagen seleccionada
const imagen_selec = document.getElementById('avatar-input');

//Contenido y nombre de la imagen
let imageContent
let imageName
let photoBase64


imagen_selec.addEventListener('change', handleImageUpload);

// Función para manejar la imagen
function handleImageUpload(event) {
    const file = event.target.files[0]; // Obtiene el archivo seleccionado

    if (file) {
        // Crea un objeto URL para la imagen seleccionada
        const imageUrl = URL.createObjectURL(file);

        // Actualiza la imagen en la sección de avatar
        const avatarImage = document.getElementById('avatar');
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
        };
    }
}


document.getElementById("formulario_registro").addEventListener("submit", async (event) => {
    event.preventDefault(); // Evita que el formulario se envíe automáticamente

    // Obtener los valores ingresados por el usuario
    const username = usernameInput.value;
    const fullname = fullnameInput.value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;


    // Mostrar los valores en la consola
    console.log("Username:", username);
    console.log("Nombre Completo:", fullname);
    console.log("Contraseña:", password);
    console.log("Verificar Contraseña:", confirmPassword);

    if (user_repetidio(username)) {
        alert('Usuario ingresado ya existe, intenta con otro nombre de usuario');
    } else {
        // Verificar si las contraseñas coinciden
        if (password === confirmPassword) {
            alert('Las contraseñas coinciden. ¡Registro exitoso!');
            console.log("Las contraseñas coinciden. ¡Registro exitoso!");
            // Crear un objeto FormData para enviar los datos del formulario
            const formData = new FormData();
            formData.append('userName', username);
            formData.append('name', fullname);
            formData.append('imageContent', imageContent);
            formData.append('imageName', imageName);
            formData.append('password', password);

            // Convertir formData a objeto JSON
            const jsonObject = {};
            formData.forEach((value, key) => {
                jsonObject[key] = value;
            });

            // Realizar la solicitud POST a la API
            console.log("------------Datos para POST API-----------")
            console.log(formData)
            const response = await fetch('http://18.118.153.195:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonObject),
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Respuesta de la API:', data);
                })
                .catch(error => {
                    console.error('Error al enviar los datos:', error);
                });

        } else {
            alert('Las contraseñas no coinciden. Por favor, inténtalo de nuevo.');
            console.error("Las contraseñas no coinciden. Por favor, inténtalo de nuevo.");
            // Aquí puedes mostrar un mensaje al usuario o realizar otras acciones
        }
    }


});


//Funcion para tomar foto de perfil con camara
document.addEventListener('DOMContentLoaded', function () {
    const loginCamaraButton = document.getElementById('login_camara');

    loginCamaraButton.addEventListener('click', async function () {
        try {
            // Acceder a la cámara
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            const videoElement = document.createElement('video');
            videoElement.srcObject = stream;
            videoElement.autoplay = true;
            videoElement.style.width = '100%';
            videoElement.style.height = 'auto';

            // Mostrar ventana emergente con la cámara y la opción de tomar la foto
            const confirmResult = confirm('¿Quieres tomar una foto?');
            if (confirmResult) {
                photoBase64 = await takePhoto(videoElement);
                avatarImage.src = photoBase64;
                console.log('Foto en base64:', photoBase64);
                imageContent = photoBase64;
            }
        } catch (error) {
            console.error('Error al acceder a la cámara:', error);
        }
    });

    async function takePhoto(videoElement) {
        return new Promise((resolve, reject) => {
            // Crear un contenedor para la cámara y el botón de tomar la foto
            const container = document.createElement('div');
            container.style.position = 'fixed';
            container.style.top = '0';
            container.style.left = '0';
            container.style.width = '100%';
            container.style.height = '100%';
            container.style.background = 'rgba(0, 0, 0, 0.5)';
            container.style.display = 'flex';
            container.style.justifyContent = 'center';
            container.style.alignItems = 'center';
            container.style.zIndex = '9999';

            // Agregar la cámara al contenedor
            container.appendChild(videoElement);

            // Agregar un botón para tomar la foto
            const captureButton = document.createElement('button');
            captureButton.textContent = 'Tomar Foto';
            captureButton.style.padding = '10px 20px';
            captureButton.style.fontSize = '16px';
            captureButton.style.marginTop = '20px';
            container.appendChild(captureButton);

            // Capturar la foto al hacer clic en el botón
            captureButton.addEventListener('click', function () {
                const canvas = document.createElement('canvas');
                canvas.width = videoElement.videoWidth;
                canvas.height = videoElement.videoHeight;
                const context = canvas.getContext('2d');
                context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
                const photoBase64 = canvas.toDataURL('image/jpeg');
                resolve(photoBase64);
                container.remove();
            });

            // Mostrar el contenedor
            document.body.appendChild(container);
        });
    }
});

//Funcion con AWS
function user_repetidio(user) {
    //Consultar base de datos para buscar user ingresado
    const user_con = "user123"

    //Verificar si existe el usuario
    if (user == user_con) {
        return true
    } else {
        return false
    }
}



