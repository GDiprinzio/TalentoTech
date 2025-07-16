// =========== Hamburguer button
const navToggle = document.querySelector(".navToggle");
const navMenu = document.querySelector(".navMenu");

navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("navMenu_visible");
  
  if (navMenu.classList.contains("navMenu_visible")) {
    navToggle.setAttribute("aria-label", "Cerrar menú");
  } else {
    navToggle.setAttribute("aria-label", "Abrir menú");
  }
});

// ========== Array de los productos Agregar al containerProducts en Products.html
const products= [
  {
    id:"01",
    img:"../assets/IMG/LasDinas/Dot7-scaled.jpg",
    name:"Salame tipo Tandil",
    description:"Las Dinas",
    price: 5000
  },
  {
    id:"02",
    img:"../assets/IMG/LasDinas/Nduja12-scaled.jpg",
    name:"Nduja",
    description:"Las Dinas",
    price: 5000
  },
  {
    id:"03",
    img:"../assets/IMG/LasDinas/Noisette2-scaled.jpg",
    name:"Salame con Avellanas",
    description:"Las Dinas",
    price: 5000
  },
  {
    id:"04",
    img:"../assets/IMG/LasDinas/Chistorra_Las-Dinas.jpg",
    name:"Chistorra",
    description:"Las Dinas",
    price: 5000
  },
  {
    id:"05",
    img:"../assets/IMG/LasDinas/Spianatta_Las-Dinas.jpg",
    name:"Spianatta",
    description:"Las Dinas",
    price: 5000
  },
  {
    id:"06",
    img:"../assets/IMG/LasDinas/Longaniza-tandilera_Las-Dinas.jpg",
    name:"Longaniza Tandilera",
    description:"Las Dinas",
    price: 5000
  },
  {
    id:"07",
    img:"../assets/IMG/LasDinas/Longaniza-espanola_Las-Dinas.jpg",
    name:"Longaniza Española",
    description:"Las Dinas",
    price: 5000
  },
  {
    id:"08",
    img:"../assets/IMG/BEBIDAS/Gin_Laconico_Campos.png",
    name:"Gin Laconico",
    description:"Campos destileria",
    price: 5000
  },
  {
    id:"09",
    img:"../assets/IMG/BEBIDAS/VermutPicaPedrero.png",
    name:"Vermut rosso PicaPedrero",
    description:"Picapedrero",
    price: 5000
  },
];

// ========== Agregar productos a ContainerProducts en el products.html
function addProducts() {
  const divProducts = document.querySelector(".containerProducts")
  if (!divProducts) {
    console.error("Error: No se encontro el contenedor de Productos.");
    return;
  }
  for (let i=0; i<products.length; i++) {
    const product = products[i]
    divProducts.insertAdjacentHTML("afterbegin",
      `
       <div class="productCard">
            <div class="imgProduct">
                <img src="${product.img}" alt="${product.name}">
            </div>
            <div class="infoProduct">
                <h3>${product.name}</h3>
                <p>Elavorado por: <strong>${product.description}</strong></p>
                <span>Precio: $ ${product.price}</span>
                <button class="btnStyle btnComprar" data-id="${product.id}" type="button">Comprar</button>
            </div>
        </div>
      `
    )
  }
  // ========== Delegación de Eventos para el BOTON COMPRAR
  divProducts.addEventListener("click", clickComprar);
}

// ========== Array de los productos Agregados al Carrito
let carrito = [];

// ========== Agregar producto al Carrito 
function addProductToCarrito (idProduct){
  // ========== Buscar producto en el carrito
  let productInCarrito = null;
  for (let i =0; i< carrito.length; i++){
    if (carrito[i].id === idProduct){
      productInCarrito = carrito[i];
      break;
    }
  }
  if (productInCarrito){
    // ========== Si el producto está incrementa la cantidad.
    productInCarrito.cantidad++;
  } else {
    // ========== Como el Carrito esta vacio , busca en el Array products 
    let productOrginal=null
    for (let i= 0; i < products.length; i++){
      if (products[i].id===idProduct){
        productOrginal=products[i];
        break;
      }
    }
    if (productOrginal){
      // ========== Añade el producto al carrito con la cantidad de 1
      carrito.push({...productOrginal, cantidad:1});
    }
  }
  updateCarritoHTML();
}

// ========== Maneja el evento de Clic en los botones COMPRAR
function clickComprar(e){
  if (e.target.classList.contains("btnComprar")){
    const productID = e.target.dataset.id;
    addProductToCarrito(productID);
  }
}

// ========== Maneja el evento de Clic en los botones  del Carrito
function manejarClicCarrito(e){
  const target=e.target;
  if (target.classList.contains("btnCantidad") || target.classList.contains("btnEliminar")){
    const productID = target.dataset.id;
    const action = target.dataset.action;
    if (action === "eliminar") {
      eliminarProductDelCarrito(productID)
    } else if (action === "restar") {
        restarCantidadProduct(productID)
    } else if (action === "sumar") {
        sumarCantidadProduct(productID)
    }
  }
}

function updateCarritoHTML(){
  const carritoCompras = document.querySelector(".containerCarritoCompras");
  if (!carritoCompras){
    console.error("Error: No se encontro el contenedor de Carrito Compras.");
    return;
  }

  // ========== Limpia el contenido actual del carrito y recrea la extructura base.
  carritoCompras.innerHTML=
  `
  <h2>Tu carrito de compras</h2>
  <ul class="listCarrito"></ul>
  <p class="totalCarrito"></p>
  <p class="cantidadCarrito"></p>
  `;
  const listCarrito = carritoCompras.querySelector(".listCarrito");
  let totalPagar=0;
  let cantidadProductsUnicos = 0;

  if (carrito.length === 0) {
    listCarrito.innerHTML=`<p>El carrito esta vacío.</p>`
  } else {
    for (let i= 0; i< carrito.length; i++){
      const item = carrito[i];
      const li = document.createElement("li");
      li.innerHTML=
        `
        <span>${item.name} - $${item.price} x ${item.cantidad}</span>
        <div>
          <button class="btnCantidad btnStyle" data-id="${item.id}" data-action="restar">-</button>
          <button class="btnCantidad btnStyle" data-id="${item.id}" data-action="sumar">+</button>
          <button class="btnEliminar btnStyle" data-id="${item.id}" data-action="eliminar">x</button>
        </div>
        
        `;
      listCarrito.appendChild(li);
      totalPagar += item.price * item.cantidad;
      cantidadProductsUnicos++;  
    }
  }

  carritoCompras.querySelector(".totalCarrito").textContent = `Total a pagar: $${totalPagar}`;
  carritoCompras.querySelector(".cantidadCarrito").textContent = `Productos en el Carrito: ${cantidadProductsUnicos}`

  const newListCarrito = carritoCompras.querySelector(".listCarrito");
  newListCarrito.addEventListener("click", manejarClicCarrito);
}

// ========== SUMA una unidad al cantidad del producto en el carrito
function sumarCantidadProduct(idProduct){
  let productEnCarrito = null;
  for (let i = 0; i< carrito.length; i++) {
    if (carrito[i].id === idProduct){
      productEnCarrito = carrito[i];
      break;
    }
  }
  if (productEnCarrito) {
    productEnCarrito.cantidad++;
    updateCarritoHTML();
  }
}

// ========== RESTAR una unidad al cantidad del producto en el carrito
function restarCantidadProduct(idProduct){
  let productEnCarrito = null;
  for (let i = 0; i< carrito.length; i++) {
    if (carrito[i].id === idProduct){
      productEnCarrito = carrito[i];
      break;
    }
  }
  if (productEnCarrito) {
    productEnCarrito.cantidad--;
    if (productEnCarrito.cantidad <= 0){
      eliminarProductDelCarrito(idProduct);
    } else {
        updateCarritoHTML();
    }    
  }
}

function eliminarProductDelCarrito(idProduct){
  const newCarrito = [];
  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].id !== idProduct) {
      newCarrito.push(carrito[i]);
    }
  }
  carrito = newCarrito;
  updateCarritoHTML();
}

// ========== Inicializando las funciones.
addProducts();
updateCarritoHTML();