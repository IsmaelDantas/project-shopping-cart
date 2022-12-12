const itemsFromCart = document.querySelector('.cart__items');

const totalValue = () => {
  const itemsPrices = document.querySelector('.total-price');
  const currentItems = document.querySelectorAll('.cart__item');
  const arrayFromItems = Array.from(currentItems);

  const priceSum = arrayFromItems.reduce((accumulator, item) => (
    accumulator + parseFloat(item.innerText.split(': $')[1])
  ), 0);
  itemsPrices.innerText = priceSum;
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
  saveCartItems(itemsFromCart.innerHTML);
  totalValue();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const createProductList = async () => {
  const promisseProducts = await fetchProducts('computador');
  const productsArray = promisseProducts.results;
  const itemList = document.querySelector('.items');

  productsArray.forEach((item) => { // <- CADA ITEM DA LISTA ->
    const { id: sku, title: name, thumbnail: image } = item;
    itemList.appendChild(createProductItemElement({ sku, name, image }));
    saveCartItems(itemsFromCart.innerHTML);
  });
};

const addItensToCart = async () => {
  await createProductList();
  const addButton = document.querySelectorAll('.item__add');

  addButton.forEach((button) => button.addEventListener('click', async (event) => {
    const ProductId = event.target.parentNode.firstChild.innerText;
    const productObject = await fetchItem(ProductId);
    const { id: sku, title: name, price: salePrice } = productObject;
    itemsFromCart.appendChild(createCartItemElement({ sku, name, salePrice }));
    saveCartItems(itemsFromCart.innerHTML);
    totalValue();
  }));
};

const getSaved = () => {
  itemsFromCart.innerHTML = getSavedCartItems();
  const arrayItemsFromCart = document.querySelectorAll('.cart__item');
  arrayItemsFromCart.forEach((item) => item.addEventListener('click', cartItemClickListener));
};

const eraseList = () => {
  itemsFromCart.innerHTML = '';
  localStorage.removeItem('cartItems');
  totalValue();
};

const eraseButton = document.querySelector('.empty-cart');
eraseButton.addEventListener('click', eraseList);

window.onload = () => { 
  addItensToCart();
  getSaved();
  totalValue();
};