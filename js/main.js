const cElem = (tagName, className, text) => {
    const elem = document.createElement(tagName);
    elem.className = className || '';
    elem.innerText = text || '';
    return elem
}

const gElem = param => {
    const elem = document.querySelector(param);
    elem.clear = function() {
        this.innerHTML = '';
        return this
    }
    elem.add = function(listOfElem) {
        this.append(...listOfElem);
        return this
    }
    return elem;
}

const listOfDevices = gElem('.list_device')

const renderDevice = device => {
    const container = cElem('div', 'card');
    const like = cElem('div', 'device_like');
    const imgLike = cElem('img');
    imgLike.src = 'img/icons/like_empty.svg';
    imgLike.alt = 'cart';
    imgLike.className = 'like_empty';
    like.append(imgLike)
    const img = cElem('img', 'card_img');
    img.src = `img/${device.imgUrl}`;
    const title = cElem('h3', 'card_title', device.name);
    const onStock = cElem('p', 'card_stock');
    onStock.innerText = `${device.orderInfo.inStock} left in stock`;
    const imgStock = cElem('img');
    imgStock.src = 'img/icons/check 1.svg';
    imgStock.alt = 'cart';
    imgStock.className = 'check';
    onStock.append(imgStock);
    const price = cElem('p', 'card_price', `Price: ${device.price} $`);
    const btnAddToCart = cElem('button');
    btnAddToCart.innerText = 'Add to cart';
    const devReviews = cElem('div', 'card_reviews');
    const right = cElem('div', 'review_right');
    devReviews.innerHTML = `<p><img src="img/icons/like_filled 1.svg" alt="cart" class="like_fill"><b> ${device.orderInfo.reviews}%</b> Positive reviews<br> Above avarage</p>`
    right.innerHTML = `<p><b> ${device.price}</b> <br> orders</p>`
    devReviews.appendChild(right);

    if (`${device.orderInfo.inStock}` != 0) {
        imgStock.src = 'img/icons/check 1.svg';
    } else {
        imgStock.src = 'img/icons/close 1.svg';
        btnAddToCart.setAttribute('disabled', '');
    }
    container.append(like, img, title, onStock, price, btnAddToCart, devReviews);
    return container;

}

const renderItems = list => {
    const elems = list.map(item => renderDevice(item))
    listOfDevices.clear().add(elems);
}

renderItems(items);