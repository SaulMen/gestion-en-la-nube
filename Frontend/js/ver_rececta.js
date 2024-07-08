

//Obtener secciones de recetas
const leftContentContainer = document.getElementById("left-content");
const rightContentContainer = document.getElementById("right-content");

// Establecer estilos para las secciones de imágenes
leftContentContainer.style.display = 'flex';
leftContentContainer.style.flexDirection = 'column'; // Cambio a dirección vertical
leftContentContainer.style.height = '350px'; // Establecer una altura fija para la sección
leftContentContainer.style.overflowY = 'auto'; // Cambio a scroll vertical
leftContentContainer.style.alignItems = 'flex-start'; // Alineación a la izquierda

rightContentContainer.style.display = 'flex';
rightContentContainer.style.flexDirection = 'column'; // Cambio a dirección vertical
rightContentContainer.style.height = '350px'; // Establecer una altura fija para la sección
rightContentContainer.style.overflowY = 'auto'; // Cambio a scroll vertical
rightContentContainer.style.alignItems = 'flex-start'; // Alineación a la izquierda


// Left Section Content
const leftContentData = [
    { image: "../img/fondoL.png", text: "Esta es una brebe descripcion de la receta para poder hacer", id: "1" },
    { image: "image2.jpg", text: "Receta 2", id: "2" },
    { image: "image3.jpg", text: "Receta 3", id: "3"},
    { image: "image4.jpg", text: "Receta 4", id: "4" },
    { image: "image2.jpg", text: "Receta 2", id: "5" },
    { image: "image3.jpg", text: "Receta 3", id: "6" },
    { image: "image4.jpg", text: "Receta 4", id: "7" },
];



function createContentItem(data) {
    const contentItem = document.createElement("div");
    contentItem.classList.add("content-item");
    //Valor id 
    contentItem.setAttribute('id', data.id);
    //Accion click para cada div
    contentItem.addEventListener('click', function () {
        // Obtener el id de la imagen al hacer clic
        const clickedImageId = this.getAttribute('id');
        // Guardar el id de la imagen en el localStorage
        localStorage.setItem('idReceta', clickedImageId);
        console.log('Se ha guardado el id de la receta:', clickedImageId);
        // Redirigir a la página de ver receta
        window.location.href = 'receta.html';
    });

    const image = document.createElement("img");
    image.src = data.image;
    image.alt = data.text;

    const text = document.createElement("p");
    text.textContent = data.text;

    contentItem.appendChild(image);
    contentItem.appendChild(text);
    return contentItem;
}

leftContentData.forEach((data) => {
    const contentItem = createContentItem(data);
    leftContentContainer.appendChild(contentItem);
});

// Right Section Options
const rightOptions = ["Opción 1", "Opción 2", "Opción 3"];
const rightOptionsContainer = document.getElementById("right-options");

rightOptions.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.value = option;
    optionElement.textContent = option;
    rightOptionsContainer.appendChild(optionElement);
});

// Right Section Content
const rightContentData = [
    { image: "image5.jpg", text: "Receta 5" },
    { image: "image6.jpg", text: "Receta 6" },
    { image: "image7.jpg", text: "Receta 7" },
    { image: "image8.jpg", text: "Receta 8" },
];



rightContentData.forEach((data) => {
    const contentItem = createContentItem(data);
    rightContentContainer.appendChild(contentItem);
});

