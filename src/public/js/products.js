const socket = io()

const getCartIdFromURL = () => {
    const cartLink = document?.getElementById('cart')
    const hrefValue = cartLink?.getAttribute('href')
    return hrefValue?.match(/\/products\/carts\/(.+)/)?.[1]
}

const showToast = (text, background) => {
    Toastify({
        text,
        duration: 2000,
        newWindow: true,
        close: true,
        gravity: 'top',
        position: 'right',
        stopOnFocus: true,
        style: { background },
        onClick: function () {},
    }).showToast()
}

const handleRequest = async (url, method) => {
    try {
        const res = await fetch(url, { method })
        const result = await res.json();
        if (result.status === 'error') throw new Error(result.error)
        return result
    } catch (error) {
        console.log(error)
    }
}

const addCart = async (id) => {
    const cartId = getCartIdFromURL()
    if (cartId) {
        const result = await handleRequest(`/api/carts/${cartId}/product/${id}`, 'POST')
        if (result) showToast('Product added to cart successfully', '#7dd56f')
    }
}

const deleteProduct = async (id) => {
    const userCart = window.location.pathname.match(/\/products\/carts\/(.+)/)?.[1]
    if (userCart) {
        const result = await handleRequest(`/api/carts/${userCart}/product/${id}`, 'DELETE')
        if (result) {
            socket.emit('cartList', result)
            showToast('Product deleted from cart successfully', '#E93C3C')
        }
    }
}

const purchaseProducts = async () => {
    const cartEmpty = window.location.pathname.match(/\/products\/carts\/(.+)/)?.[1]
    if (cartEmpty) {
        Swal.fire({
            title: 'Confirm the purchase?',
            text: 'Products out of stock will not be added to the purchase!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#7dd56f',
            cancelButtonColor: '#E93C3C',
            confirmButtonText: 'Yes, confirm!',
        }).then((result) => {
            if (result.isConfirmed) {
                setTimeout(() => {
                    window.location.href = `/api/carts/${cartEmpty}/purchase`
                }, 500)
            }
        })
    }
}

const cartBody = document.querySelector('#cartBody')
const generateProductHTML = (prod) => {
    return `
        <div class="card rounded-3 mb-4" style="position: relative;">
            <button class="btn btn-danger px-2 py-1 rounded-3" 
            style="position: absolute; top:0; right:0"
            onclick="deleteProduct('${prod.product._id}')"
            >X</button>
            <div class="card-body p-4">
                <div class="row d-flex justify-content-between align-items-center">
                    <div class="col-md-2 col-lg-2 col-xl-2">
                        <img src="/img/${prod.product.thumbnails[0]}" alt="${prod.product.title}" class="img-fluid" />
                    </div>
                    <div class="col-md-3 col-lg-3 col-xl-3">
                        <p class="lead fw-normal mb-2">${prod.product.title}</p>
                        <p><span class="text-muted">Category:</span>${prod.product.category}</p>
                    </div>
                    <div class="col-md-3 col-lg-3 col-xl-2 d-flex flex-column text-center">
                        <label class="fw-bold">Quantity</label>
                        <input type="number" value=${prod.quantity} class="form-control form-control-sm text-center fw-bold" readonly />
                    </div>
                    <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                        <h5 class="mb-0">$${prod.product.price}</h5>
                    </div>
                    <div class="col-md-1 col-lg-1 col-xl-1 text-end">
                        <a href="#!" class="text-danger"><i class="fas fa-trash fa-lg"></i></a>
                    </div>
                </div>
            </div>
        </div>
    `
}

socket.on('updatedCarts', (data) => {
    const productsHTML = data.payload.products.map((prod) => generateProductHTML(prod)).join('')

    if (data.payload.products.length > 0) {
        cartBody.innerHTML = `
            <div class="container h-100 py-5" id="cartBody">
                <div class="row d-flex justify-content-center align-items-center h-100">
                    <div class="col-10">

                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <h3 class="fw-normal mb-0 text-black">Shopping Cart</h3>
                            <div>
                                <p class="mb-0"><span class="text-muted">Sort by:</span>
                                    <a href="#!" class="text-body">price<i class="fas fa-angle-down mt-1"></i></a>
                                </p>
                            </div>
                            ${productsHTML}
                            <div class="card">
                                <div class="card-body text-center">
                                    <button type="button" class="btn btn-warning btn-block btn-lg" onclick="purchaseProducts()">Buy Now</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    } else {
        cartBody.innerHTML = `
            <div class="container h-100 py-5 text-center">
                <h2 class="p-5">Cart Empty</h2>
            </div>
        `
    }
})

