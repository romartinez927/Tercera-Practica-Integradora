const API_URL = `/api${window.location.pathname}`
const search = `${window.location.search}`
const API_SEARCH = search.slice(1)

// DOM
// form para agregar productos
const formProductos = document.querySelector("#formProductos")

// products
const productContainer = document.querySelector('#productContainer')

// pagination
const prevPageButton = document.querySelector('#prevPage-button')
const nextPageButton = document.querySelector('#nextPage-button')
const inputPage = document.querySelector('#inputPage')

const pagination = ({ data, nextPageClickHandler, prevPageClickHandler, inputPageChangeHandler, inputPageInputHandler }) => {
    inputPage.value = data.page
    inputPage.setAttribute('max', data.totalPages)
    inputPage.addEventListener('input', inputPageInputHandler)
    nextPageButton.addEventListener('click', nextPageClickHandler)
    prevPageButton.addEventListener('click', prevPageClickHandler)
    inputPage.addEventListener('change', inputPageChangeHandler)
}

const removePaginationHandlers = ({ nextPageClickHandler, prevPageClickHandler, inputPageChangeHandler, inputPageInputHandler }) => {
    nextPageButton.removeEventListener('click', nextPageClickHandler)
    prevPageButton.removeEventListener('click', prevPageClickHandler)
    inputPage.removeEventListener('change', inputPageChangeHandler)
    inputPage.removeEventListener('input', inputPageInputHandler)
}

const eventUploadFetch = (page) => {
    fetch(`${API_URL}?page=${page}&${API_SEARCH}`)
        .then(res => res.json())
        .then(data => {
            productContainer.innerHTML = ''

            let product = ''
            data.payload.forEach(item => {
                product += `
            <div>
                <h3>Title: ${item.title}</h5>
                <p>Description: ${item.description}.</p>
                <p>Price: $${item.price}</p>
                <p>Category: ${item.category}.</p>
                <button>Agregar al carrito</button>
            </div><br/><br/>
            `
            });
            productContainer.innerHTML = product
            // pagination

            const nextPageClickHandler = () => {
                let pageNext = data.nextLink
                let page = Number(inputPage.value)
                if (data.hasNextPage) {
                    page = pageNext
                    removePaginationHandlers({ nextPageClickHandler, prevPageClickHandler, inputPageChangeHandler, inputPageInputHandler })
                    eventUploadFetch(page)
                }
            }

            const prevPageClickHandler = () => {
                let pagePrev = data.prevLink
                if (data.hasPrevPage) {
                    page = pagePrev
                    removePaginationHandlers({ nextPageClickHandler, prevPageClickHandler, inputPageChangeHandler, inputPageInputHandler })
                    eventUploadFetch(page)
                }
            }

            const inputPageChangeHandler = () => {
                if (page > data.totalPages) {
                    page = data.totalPages
                    inputPage.value = page
                } else if (page < 1) {
                    page = 1;
                    inputPage.value = page
                } else {
                    page = inputPage.value
                }

                removePaginationHandlers({ nextPageClickHandler, prevPageClickHandler, inputPageChangeHandler, inputPageInputHandler })
                eventUploadFetch(page)
            }

            const inputPageInputHandler = () => {
                debugger
                if (page > data.totalPages) {
                    page = inputPage.max
                } else if (page < 1) {
                    page = 1;
                } else {
                    page = inputPage.value
                }

                removePaginationHandlers({ nextPageClickHandler, prevPageClickHandler, inputPageChangeHandler, inputPageInputHandler })
                eventUploadFetch(page)
            }

            removePaginationHandlers({ nextPageClickHandler, prevPageClickHandler, inputPageChangeHandler, inputPageInputHandler })

            pagination({
                data,
                nextPageClickHandler,
                prevPageClickHandler,
                inputPageChangeHandler,
                inputPageInputHandler
            });
        })
        .catch(error => console.error(error))
}

eventUploadFetch(1)

// agregar productos


if (formProductos instanceof HTMLFormElement) {
    formProductos.addEventListener("submit", event => {
        event.preventDefault()

        const inputPrice = document.querySelector('#inputPrice')
        const inputDescription = document.querySelector('#inputDescription')
        const inputCode = document.querySelector('#inputCode')
        const inputCategory = document.querySelector('#inputCategory')
        const inputStock = document.querySelector('#inputStock')
        const inputTitle = document.querySelector('#inputTitle')
        const inputThumbnail = document.querySelector('#inputThumbnail')
    
        if (
          inputPrice instanceof HTMLInputElement &&
          inputDescription instanceof HTMLInputElement &&
          inputCode instanceof HTMLInputElement &&
          inputCategory instanceof HTMLInputElement &&
          inputStock instanceof HTMLInputElement &&
          inputTitle instanceof HTMLInputElement &&
          inputThumbnail instanceof HTMLInputElement 
        ) {
            const data = {
                price: inputPrice.value,
                title: inputTitle.value,
                description: inputDescription.value,
                code: inputCode.value,
                stock: inputStock.value,
                category: inputCategory.value,
                thumbnails: inputThumbnail.value
            }

            fetch("/api/products", {
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            })
        }
    })
}
