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

    if (`${device.orderInfo.inStock}` != 0) {
        imgStock.src = 'img/icons/check 1.svg';
    } else {
        imgStock.src = 'img/icons/close 1.svg';
        btnAddToCart.setAttribute('disabled', '');
    }
    imgLike.addEventListener('click', e => {
        imgLike.src = 'img/icons/like_filled 1.svg';
    })
    container.append(like, img, title, onStock, price, btnAddToCart, devReviews);

    container.addEventListener('click', e => {
        renderModalWindow(e.currentTarget);
    }, true)
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
        modalWindow.classList.remove('visible');
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
    changePrice(type, price) {
        if (!isNaN(price)) {
            this.filtersArr[0].changes[type] = +price;
        }
        mainFilter.runAsideFilter();
    }
    change(data, index) {
        const checkIndex = this.filtersArr[index].checked.indexOf(data);
        if (checkIndex > -1) {
            this.filtersArr[index].checked.splice(checkIndex, 1)
        } else {
            this.filtersArr[index].checked.push(data);
        }
        mainFilter.runAsideFilter()
    }
}
const asideFilter = new AsideFilter();

class RenderFilter extends AsideFilter {
    constructor() {
        super()
    }
    get contentMethods() {
        return {
            check: this._renderContentCheck.bind(this),
            range: this._renderContentRange.bind(this),
        }
    }
    _renderItems(item) {
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
        const getContent = this.contentMethods[item.type];
        const filterContent = getContent(item);
        content.append(...filterContent);
        container.append(title, content);
        return container;
    }
    renderFilters() {
        const container = document.querySelector('.filterContainer');
        const filters = this.filtersArr.map(item => this._renderItems(item));
        container.innerHTML = '';
        container.append(...filters);
    }
    _renderContentCheck(item) {
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
            return label;
        })
    }
    _renderContentRange(item) {
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