$(document).ready(function(){
    let page = 1
    let skipedItems = 0
    let cards = $('.cards')

    if(localStorage.getItem('page')){//добавление номера страницы в localStorage
        page = localStorage.getItem('page')
    }

    fetching()//первичное заполнение данными
    
    let pagination = $('.pagination__inner')
    
    function fetching(){
        fetch(`http://testtask.alto.codes/front-products.php?skip=${page == 1 ? skipedItems = 0 : skipedItems = (page-1) * 4}`)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                let allPages = Math.ceil(data.totalCount/4)
                let products = data.products
                
                //отрисовка пагинации
                let firstPage
                if(page <= 2)
                    firstPage = 1
                else if(allPages - page == 0 || allPages - page == 1){
                    firstPage = allPages - 3
                }
                else if(allPages - page <= 3)
                    firstPage = page - 1

                let dots = `<button class="pagination__item" disabled><span>...</span></button>`

                let pagBtn = `<button class="pagination__item pagination__back" ${page == 1 ? 'disabled' : ''}>Назад</button>`+
                            `${page > 2 ? dots : ''}`+
                            `<button class="pagination__item ${page == firstPage ? 'active': ''}">${firstPage}</button>`+
                            `<button class="pagination__item ${page == firstPage+1 ? 'active': ''}">${firstPage+1}</button>`+
                            `<button class="pagination__item ${page == firstPage+2 ? 'active': ''}">${firstPage+2}</button>`+
                            `<button class="pagination__item ${page == firstPage+3 ? 'active': ''}">${firstPage+3}</button>` + 
                            `${firstPage + 3 < allPages ? dots : ''}` + 
                            `<button class="pagination__item pagination__next" ${page == allPages ? 'disabled' : ''}>Вперед</button>`;

                pagination.append(pagBtn)

                let pagItem = $('.pagination__item')
                let pagNext = $('.pagination__next')
                let pagBack = $('.pagination__back')

                //кнопка пагинации
                pagItem.on('click', function() {
                    if(!$(this).hasClass('pagination__next') && !$(this).hasClass('pagination__back')){
                        page = +$(this)[0].innerHTML
                        pagination.empty()
                        cards.empty()
                        fetching()
                    }
                })

                //кнопка пагинации Вперед
                pagNext.on('click', function() {
                    if(page + 4 <= allPages){
                        page += + 4
                        pagination.empty()
                        cards.empty()
                        fetching()
                    }
                    else if(page + 4 > allPages){
                        page = allPages
                        pagination.empty()
                        cards.empty()
                        fetching()
                    }
                })

                //кнопка пагинации Назад
                pagBack.on('click', function(){
                    if(page - 4 >= 1){
                        page -= 4
                        pagination.empty()
                        cards.empty()
                        fetching()
                    }
                    else if(page - 4 < 1){
                        page = 1
                        pagination.empty()
                        cards.empty()
                        fetching()
                    }
                })

                //отрисовка карточек
                for(let i = 0; i < products.length; i++){
                    let id = products[i].id
                    let name = products[i].name
                    let price = products[i].price
                    let imgUrl = products[i].image_url
                    let color = products[i].color
                    let shortDesc = products[i].short_desc
                    let availability = products[i].availability == 1 ? 'В наличии' : 'Под заказ'
                    let availabilityClass = products[i].availability == 1 ? 'card_in-stock' : 'card_on-order'

                    fillingCard(name, price, imgUrl, color, shortDesc, availability, availabilityClass);
                }
                localStorage.setItem('page', page);
            })
    }

    //заполнение карточки данными
    function fillingCard(name, price, imgUrl, color, shortDesc, availability, availabilityClass){
        let html = `<div class="card">` + 
        `<div class="card__img"><img src="${imgUrl}" alt="Тестовый товар"></div>` + 
            `<div class="card__info">` + 
                `<div class="card__status ${availabilityClass}"><span>${availability}</span></div>` +
                `<div class="card__name">${name}</div>` +
                `<div class="card__price">${price} ₽</div>` +
                `<div class="card__color hidden_info">Цвет - ${color}</div>` +
                `<div class="card__description hidden_info">${shortDesc}</div>` +
                `<div class="card__buy hidden_info"><button><img src="img/icons/Cart.svg"><span>В КОРЗИНУ</span></button></div>` +
            `</div>` +
        `</div>`;

        cards.append(html).html();
    }
})