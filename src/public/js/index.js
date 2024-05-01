const socket = io();

const productList = document.getElementById("ul-productos");

socket.on("newProduct", obj => {
  const li = document.createElement("li");
  li.textContent = obj.title;
  li.id = `product-${obj.id}`;
  li.classList.add("list-group-item");
  productList.appendChild(li);
});

socket.on("deleteProduct", obj => {
  const productElement = document.getElementById(`product-${obj.id}`);
  if (productElement) {
    productList.removeChild(productElement);
  }
});

socket.on("productModification", obj => {
  const productElement = document.getElementById(`product-${obj.id}`);
  if (productElement) {
    productElement.textContent = obj.title;
  }
});
