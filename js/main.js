const cElem = (tagName, className, text) => {
    const elem = document.createElement(tagName);
    elem.className = className || '';
    elem.innerText = text || '';
    return elem;
}

const gElem = param => {
    const elem = document.querySelector(param);
    elem.clear = function() {
        this.innerHTML = '';
        return this;
    }
    elem.add = function(listOfElem) {
        this.append(...listOfElem);
        return this;
    }
    return elem;
}

const listOfDevices = gElem('.list_device')

const renderDevice = device => {
    const container = cElem('div', 'card');
    container.id = device.id;
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
    const btnAddToCart = cElem('button', 'card__btn');
    btnAddToCart.innerText = 'Add to cart';
    const devReviews = cElem('div', 'card_reviews');
    const right = cElem('div', 'review_right');
    devReviews.innerHTML = `<p><img src="img/icons/like_filled 1.svg" alt="cart" class="like_fill"><b> ${device.orderInfo.reviews}%</b> Positive reviews<br> Above avarage</p>`
    right.innerHTML = `<p><b> ${device.price}</b> <br> orders</p>`
    devReviews.appendChild(right);
    if (btnAddToCart.classList[0] === 'card__btn') {
        btnAddToCart.onclick = e => {
            e.stopPropagation();
            mainCart.addToCart(device.id);
        }
    }
    if (`${device.orderInfo.inStock}` != 0) {
        imgStock.src = 'img/icons/check 1.svg';
    } else {
        imgStock.src = 'img/icons/close 1.svg';
        btnAddToCart.setAttribute('disabled', '');
    }
    imgLike.addEventListener('click', e => {
        if (imgLike.src = 'img/icons/like_empty.svg')
            imgLike.src = 'img/icons/like_filled 1.svg';
    })
    container.append(like, img, title, onStock, price, btnAddToCart, devReviews);

    container.addEventListener('click', e => {
        renderModalWindow(container);
    })
    return container;

}

const renderItems = list => {
    const elems = list.map(item => renderDevice(item))
    listOfDevices.clear().add(elems);
}

renderItems(items);

/////////////// Render modal window ////////////

const renderModalWindow = (card) => {
    const device = items.find(item => item.id === +card.id);
    const modalWindow = gElem('.modalWindow');
    modalWindow.classList.add('visible');
    const container = cElem('div', 'modalWindow__container');
    const containerWithImg = cElem('div', 'modalWindow__container__leftimg');
    const containerInCenter = cElem('div', 'modalWindow__container__center');
    const containerRight = cElem('div', 'modalWindow__container__right');
    const img = cElem('img', 'modalWindow__container__leftimg__img');
    img.src = `img/${device.imgUrl}`;
    modalWindow.addEventListener('click', e => {
        e.stopPropagation();
        e.target.classList[0] === 'modalWindow' && modalWindow.classList.remove('visible');
    })
    containerWithImg.append(img);
    const infoAboutDevice = {
        title: cElem('h3', 'modalWindow__container__center__title', device.name),
        statistic: cElem('div', 'card_reviews'),
        color: cElem('p', 'modalWindow__container__center__color', `Color: ${device.color.join(', ')}`),
        os: cElem('p', 'modalWindow__container__center__os', `Operation System: ${device.os}`),
        chip: cElem('p', 'modalWindow__container__center__chip', `Chip: ${device.chip.name}`),
        storage: cElem('p', 'modalWindow__container__center__storage', `Storage: ${device.storage} GB`),
        display: cElem('p', 'modalWindow__container__center__display', `Display: ${device.display} inch`),
        height: cElem('p', 'modalWindow__container__center__height', `Height: ${device.size.height} cm`),
        width: cElem('p', 'modalWindow__container__center__width', `Width: ${device.size.width} cm`),
        depth: cElem('p', 'modalWindow__container__center__depth', `Depth: ${device.size.depth} cm`),
        weight: cElem('p', 'modalWindow__container__center__weight', `Weight: ${device.size.weight} kg`),
    }

    infoAboutDevice.statistic.innerHTML = card.querySelector('.card_reviews').innerHTML;
    containerInCenter.append(...(Object.values(infoAboutDevice)));
    const price = cElem('p', 'modalWindow__container__right__price', `$ ${device.price}`);
    const stock = cElem('p', 'modalWindow__container__right__stock', `Stock: ${device.orderInfo.inStock} psc.`);
    const btn = cElem('button', 'card__btn', 'Add to cart');
    containerRight.append(price, stock, btn);
    if (device.orderInfo.inStock === 0) {
        btn.setAttribute('disabled', '');
    }
    if (btn.classList[0] === 'card__btn') {
        btn.onclick = e => {
            e.stopPropagation();
            mainCart.addToCart(device.id)
        }
    }
    container.append(containerWithImg, containerInCenter, containerRight);
    modalWindow.clear().appendChild(container);
}

/////////////////// Filters aside of the page  //////////


class Utils {
    constructor() {
        this.priceRange = this._getPriceRange();
        this.colors = this._getColors();
        this.operationSystem = this._getOS();
        this.storage = this._getStorage();
    }
    _getPriceRange() {
        const sortedByAsc = [...items]
            .sort((a, b) => a.price - b.price);
        return {
            from: sortedByAsc[0].price,
            to: sortedByAsc[sortedByAsc.length - 1].price,
        }
    }
    _getColors() {
        let result = [];
        items.forEach(item => {
            item.color.forEach(col => {
                result.includes(col) || result.push(col)
            })
        })
        return result;
    }
    _getOS() {
        let result = [];
        items.forEach(item => {
            result.includes(item.os) || result.push(item.os)
        })
        return result;
    }
    _getStorage() {
        let result = [];
        items.forEach(item => {
            result.includes(item.storage) || result.push(item.storage)
        })
        return result;
    }
}
const utils = new Utils();

class AsideFilter {
    constructor() {
        this.renderItems = [...items];
        this.config = {
            searchValue: '',
        }
        this.filtersArr = [{
                type: 'range',
                title: 'Price',
                classFr: 'inputFrom',
                classTo: 'inputTo',
                variant: utils.priceRange,
                changes: {...utils.priceRange }
            },
            {
                type: 'check',
                title: 'Colors',
                class: 'colorParam',
                variants: utils.colors,
                checked: [],
            },
            {
                type: 'check',
                title: 'Memory',
                class: 'storageParam',
                variants: utils.storage,
                checked: [],
            },
            {
                type: 'check',
                title: 'OS',
                class: 'osParam',
                variants: utils.operationSystem,
                checked: [],
            },
            {
                type: 'check',
                title: 'Display',
                class: 'displayParam',
                variants: ['1 - 6 inch', '6 - 11 inch', '11 - 16 inch', '16 - 27 inch'],
                checked: [],
            },
        ]
    }
    renderPrice(type, price) {
        if (!isNaN(price)) {
            this.filtersArr[0].changes[type] = +price;
        }
        mainFilter.sortItemsByFilter();
    }
    changeByPoints(data, index) {
        const checkIndex = this.filtersArr[index].checked.indexOf(data);
        if (checkIndex > -1) {
            this.filtersArr[index].checked.splice(checkIndex, 1)
        } else {
            this.filtersArr[index].checked.push(data);
        }
        mainFilter.sortItemsByFilter()
    }
}
const asideFilter = new AsideFilter();

class RenderFilter extends AsideFilter {
    constructor() {
        super()
    }
    get contentRenderMethods() {
        return {
            check: this.checkFilters.bind(this),
            range: this.filterPrice.bind(this),
        }
    }
    renderByCategory(item) {
        const container = cElem('div', 'filterItem');
        const title = cElem('div', 'filterItem__title');
        title.innerHTML = `
    <span>${item.title}</span>
    <div class="arrow"></div>
`;
        title.onclick = function() {
            this.classList.toggle('filterItem__title--active');
            const content = this.parentElement.children[1];
            content.classList.toggle('filterItem__content--active');
        }
        const content = cElem('div', 'filterItem__content');
        const getContent = this.contentRenderMethods[item.type];
        const filterContent = getContent(item);
        content.append(...filterContent);
        container.append(title, content);
        return container;
    }
    renderFilters() {
        const container = document.querySelector('.filterContainer');
        const filters = this.filtersArr.map(item => this.renderByCategory(item));
        container.innerHTML = '';
        container.append(...filters);
    }
    checkFilters(item) {
        const index = item.variants.indexOf(null);
        index === -1 || item.variants.splice(index, 1);
        return item.variants.map(variant => {
            const title = cElem('span', null, variant);
            const label = cElem('label');
            const inp = cElem('input');
            inp.type = 'checkbox';
            inp.name = variant;
            inp.classList.add(item.class);
            label.append(inp, title);
            if (item.title === 'Memory') {
                title.innerText += " GB";
            }
            return label;
        })
    }
    filterPrice(item) {
        const containerFrom = cElem('div');
        const labelFrom = cElem('label', null, 'From');
        const inputFrom = cElem('input');
        inputFrom.value = item.variant.from;
        inputFrom.classList.add(item.classFr);
        containerFrom.append(labelFrom, inputFrom);
        const containerTo = cElem('div');
        const labelTo = cElem('label', null, 'To');
        const inputTo = cElem('input');
        inputTo.value = item.variant.to;
        inputTo.classList.add(item.classTo);
        containerTo.append(labelTo, inputTo);
        return [containerFrom, containerTo];
    }
}
const renderFilter = new RenderFilter();
renderFilter.renderFilters();



class MainFilter extends AsideFilter {
    constructor() {
        super();
        this.sortItemsByFilter = () => {
            this.cards = [...items];

            this.cards = this.cards.filter(item => {
                const name = item.name.toLowerCase();
                const nameInp = name.includes(this.config.searchValue);
                const price = item.price >= this.filtersArr[0].changes.from && item.price <= this.filtersArr[0].changes.to;
                const color = this.filtersArr[1].checked.length < 1 || item.color.some(color => this.filtersArr[1].checked.includes(color));
                const storage = this.filtersArr[2].checked.length < 1 || this.filtersArr[2].checked.includes(item.storage);
                const os = this.filtersArr[3].checked.length < 1 || this.filtersArr[3].checked.includes(item.os);
                const display = this.filtersArr[4].checked.map(display => {
                    return display.split(' ').filter(num => !isNaN(num))
                })
                const inpDisplay = this.filtersArr[4].checked.length < 1 ||

                    display.some(elem => {
                        const from = +elem[0];
                        const to = +elem[1];
                        const result = from <= item.display && to >= item.display;
                        return result;
                    })
                return nameInp && price && color && storage && os && inpDisplay;

            })
            renderItems(this.cards);
        }
        const inpFrom = gElem('.inputFrom');
        const inpTo = gElem('.inputTo');
        const storage = document.querySelectorAll('.storageParam');
        const inpOs = document.querySelectorAll('.osParam');
        const inpColor = document.querySelectorAll('.colorParam');
        const checkDisplay = document.querySelectorAll('.displayParam');
        const devInp = gElem('#deviceInp');
        inpFrom.oninput = (e) => {
            const value = e.target.value;
            mainFilter.renderPrice('from', value);
        }
        inpTo.oninput = (e) => {
            const value = e.target.value;
            mainFilter.renderPrice('to', value);
        }
        storage.forEach(item => {
            item.oninput = (e) => {
                const name = +e.target.name;
                mainFilter.changeByPoints(name, 2)
            }
        })
        inpOs.forEach(item => {
            item.oninput = (e) => {
                const os = e.target.name;
                mainFilter.changeByPoints(os, 3)
            }
        })
        inpColor.forEach(item => {
            item.oninput = (e) => {
                const color = e.target.name;
                mainFilter.changeByPoints(color, 1)
            }
        })
        checkDisplay.forEach(item => {
            item.oninput = (e) => {
                const paramDispl = e.target.name;
                mainFilter.changeByPoints(paramDispl, 4);
            }
        })
        devInp.oninput = (e) => {
            mainFilter.config.searchValue = e.target.value.toLowerCase();
            mainFilter.sortItemsByFilter();
        }
    }

}
const mainFilter = new MainFilter();



/////////////////////////////////////////////////
////////////////// Cart ///////////////////////


const basket = document.querySelector('.basket');
const cartContainer = document.querySelector('.cart-container');
basket.addEventListener('click', event => {
    if (cartContainer.classList[1] === 'disabled') {
        cartContainer.setAttribute('class', 'cart-container')
    } else {
        cartContainer.setAttribute('class', 'cart-container disabled')
    }
})



class Cart {
    constructor() {
        this.items = [];
        this.totalAmount = 0;
        this.totalPrice = 0;
        this.removeFRomLS();
    }
    saveCart() {
        const devicesAll = JSON.stringify(this);
        localStorage.setItem('cart', devicesAll);
    }
    removeFRomLS() {
        const devicesAll = localStorage.getItem('cart')
        if (devicesAll !== null) {
            const cart = JSON.parse(devicesAll);
            Object.assign(this, cart)
        }
    }

    addToCart(id, count = 0) {
        const itemsInCard = items.find(item => item.id === id);
        const addItems = this.items.find(item => item.id === id);
        if (count < 4) {
            if (!addItems) {
                this.items.push({ id, count: 1, price: itemsInCard.price })
            } else {
                addItems.count++;
                addItems.price += itemsInCard.price;
            }
        }
        this.amountTotalValues();
    }
    deleteItemfromCart(id) {
        const indexOfCard = this.items.findIndex(item => item.id === id)
        this.items.splice(indexOfCard, 1);
        this.amountTotalValues();
    }
    deleteFromCart(id, count) {
        const itemsInCard = items.find(item => item.id === id);
        const indexOfCard = this.items.findIndex(item => item.id === id);
        if (count > 1) {
            this.items[indexOfCard].count--;
            this.items[indexOfCard].price -= itemsInCard.price;
        }
        this.amountTotalValues();
    }
    amountTotalValues() {
        this.totalAmount = 0;
        this.totalPrice = 0;
        const totalResult = this.items.forEach(item => {
            const deviceItem = this.items.find(device => item.id === device.id);
            this.totalAmount += item.count;
            this.totalPrice += deviceItem.price * item.count;
        })
        this.saveCart();
        instanceCartFilter.renderTotalInfo();
        instanceCartFilter.rendercartTotalInfo();
        instanceCartFilter.filtrationMainContent();
    }

}
const mainCart = new Cart();



const cartTitle = cElem('div', 'cart_title');
cartTitle.innerHTML = `
<h3>Shopping Cart</h3>
<p>Checkout is almost done!</p>`
const cartDevices = cElem('div', 'cart_devices');
const cartTotalInfo = cElem('div', 'cart_total');
cartTotalInfo.innerHTML = `
<p>Total amount:<b> ${mainCart.totalAmount}</b> ptc.</p>
<p>Total price: <b>${mainCart.totalPrice}$</b></p>`;
const cartButtonContainer = cElem('div', 'cart_btn_container');
const cartBtn = cElem('button', 'cart_btn', `Buy`);
cartButtonContainer.append(cartBtn);
const total = document.querySelector('.cart-total-amount')
total.innerHTML = `
<p>${mainCart.totalAmount}</p>`
cartContainer.append(cartTitle, cartDevices, cartTotalInfo, cartButtonContainer);


class cartFilter {
    constructor() {
        this.renderTotalInfo();
        this.renderCards();
    }
    renderCards() {
        cartBtn.onclick = () => {
            const mainCart = cartContainer.classList.toggle('active')
            if (mainCart) {
                this.filtrationMainContent();
                this.rendercartTotalInfo();
            }
        }
    }

    filtrationMainContent() {
        cartDevices.innerHTML = '';
        if (mainCart.totalAmount === 0) {
            cartDevices.innerHTML = `<h4>Your cart is empty!!!</h4>`
            return;
        }
        const itemsForCart = [];
        const itemsFromCart = mainCart.items;
        items.forEach(devices => {
            const devicesFromCart = itemsFromCart.find(item => item.id === devices.id)
            if (devicesFromCart) {
                itemsForCart.push({
                    data: devices,
                    count: devicesFromCart.count,
                    totalPrice: devicesFromCart.price,
                })
            }
        })
        itemsForCart.forEach(item => {
            const container = cElem('div', 'cart_devices__items');
            const containerWithImg = cElem('div', 'cart_img');
            const img = cElem('img', 'imgCart');
            img.src = `img/${item.data.imgUrl}`;
            containerWithImg.append(img);
            const containerTitle = cElem('div', 'cart_devices__item');
            containerTitle.innerHTML = `
            <h4>${item.data.name}</h4>
            <div class="cart_price">
            <p>$ ${item.data.price}</p>
            </div>`
            const cartContainerAmount = cElem('div', 'cart_devices__amount');
            const minusBtn = cElem('button', 'minus_btn', '<');
            minusBtn.id = item.data.id;
            minusBtn.count = item.count;
            minusBtn.onclick = (e) => {
                let minusId = Number(e.currentTarget.id);
                let minusAmount = Number(e.currentTarget.count);
                mainCart.deleteFromCart(minusId, minusAmount);
            }
            const amountItems = cElem('div', 'item-amount');
            amountItems.innerHTML = `<p>${item.count}</p>`;
            amountItems.id = item.data.id;
            const plusBtn = cElem('button', 'plus_btn', '>');
            plusBtn.id = item.data.id;
            plusBtn.onclick = (e) => {
                let plusId = Number(e.currentTarget.id);
                mainCart.addToCart(plusId);
            }
            const deleteBtn = cElem('button', 'delete_btn', 'X');
            deleteBtn.id = item.data.id;
            deleteBtn.onclick = (e) => {
                let deleteId = Number(e.currentTarget.id);
                mainCart.deleteItemfromCart(deleteId);
            }
            if (item.count <= 1) {
                minusBtn.setAttribute('disabled', '');
            }
            if (item.count > 3) {
                plusBtn.setAttribute('disabled', '');
            }
            cartDevices.append(container);
            container.append(containerWithImg, containerTitle, cartContainerAmount)
            cartContainerAmount.append(minusBtn, amountItems, plusBtn, deleteBtn)
        })
    }
    renderTotalInfo() {
        total.innerHTML = `
        <p>${mainCart.totalAmount}</p>`
    }
    rendercartTotalInfo() {
        cartTotalInfo.innerHTML = `
        <p>Total amount:<b> ${mainCart.totalAmount}</b> ptc.</p>
        <p>Total price: <b>${mainCart.totalPrice}$</b></p>`;
    }
}

const instanceCartFilter = new cartFilter();