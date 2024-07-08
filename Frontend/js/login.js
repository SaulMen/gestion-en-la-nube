

// Obtener el formulario
const loginForm = document.getElementById('login-form');
const btnCamara = document.getElementById('login_camara');


let photoBase64;

//Funcion para verificar usuario y contraseña
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar que se recargue la página

    // Obtener los valores de los campos de texto
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Mostrar los valores en la consola
    console.log('Usuario:', username);
    console.log('Contraseña:', password);

    try {
        const response = await fetch('http://18.118.153.195:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userName: username,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Extracción de datos del JSON
            const userId = data.data.idUser;
            const profileImage = data.data.imgPerfil;
            const full_name = data.data.name;
            const us_password = data.data.passw;
            const us_username = data.data.userName;
            //
            /*console.log("-------Datos JSON API ----------")
            console.log("User ID: " + userId)
            console.log("URL imagen perfil: " + profileImage)
            console.log("Nombre Completo: " + full_name)
            console.log("Nombre de usuario: " + us_username)
            console.log("------------------------------")*/

            localStorage.clear();
            localStorage.setItem('userId', userId);
            localStorage.setItem('profileImage', profileImage);
            localStorage.setItem('full_name', full_name);
            localStorage.setItem('us_username', us_username);

            console.log('Login Exitoso:', data.data);
            // Redirige a pagina de inicio
            window.location.replace('pagina_inicio.html');
        } else {
            // Error de login
            console.error('Error en el login:', data.message);
            alert('Usuario o contraseña incorrectos. Inténtalo de nuevo.');
        }
    } catch (error) {
        console.error('Error de red:', error);
    }
});


//Funcion para ingreso con camara
document.addEventListener('DOMContentLoaded', function () {
    // Obtener los valores de los campos de texto
    //const username = document.getElementById('username').value;
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
                console.log('Foto en base64:', photoBase64);
            }
        } catch (error) {
            console.error('Error al acceder a la cámara:', error);
        }

        try {
            const usernameC = document.getElementById('username').value;
            console.log('Foto en base64:', photoBase64);
            console.log('Nombre de Usuario: ', usernameC)
            const response = await fetch('http://18.118.153.195:3000/loginImage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userName: usernameC,
                    imageContent: photoBase64
                })
            });
            const data = await response.json();

            if (response.ok) {
                // Extracción de datos del JSON
                const userId = data.data.idUser;
                const profileImage = data.data.imgPerfil;
                const full_name = data.data.name;
                const us_password = data.data.passw;
                const us_username = data.data.userName;
                //Local Storage datos usuario
                localStorage.clear();
                localStorage.setItem('userId', userId);
                localStorage.setItem('profileImage', profileImage);
                localStorage.setItem('full_name', full_name);
                localStorage.setItem('us_username', us_username);

                console.log('Login Exitoso:', data.data);
                // Redirige a pagina de inicio
                window.location.replace('pagina_inicio.html');
            } else {
                // Error de login
                console.error('Error en el login:', data.message);
                alert('El rostro no coincide con la imagen de usuario!');
            }
        } catch (error) {
            console.error('Error de red:', error);
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
                const photo = canvas.toDataURL('image/jpeg');
                resolve(photo);
                container.remove();
            });

            // Mostrar el contenedor
            document.body.appendChild(container);
        });
    }


});
