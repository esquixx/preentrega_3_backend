const socket = io()

const form = document.getElementById('form')
const productsTable = document.querySelector('#productsTable')
const tbody = productsTable.querySelector('#tbody')

const showToast = (text, background, position) => {
    Toastify({
        text,
        duration: 2000,
        newWindow: true,
        close: true,
        gravity: 'top',
        position,
        stopOnFocus: true,
        style: {
            background,
            borderRadius: "10px",
            fontWeight: "600",
        },
        onClick: function () { }
    }).showToast()
}

const fetchProducts = async () => {
    const resultProducts = await fetch('/api/products?limit=100')
    const results = await resultProducts.json()
    if (results.status === 'error') {
        throw new Error(results.error)
    }
    return results.payload
}

const updateProductsList = async () => {
    const products = await fetchProducts()
    socket.emit('productList', products)
}

const handleFormSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData(form);
    const res = await fetch(form.action, {
        method: 'POST',
        body: formData,
    })

    try {
        if (!res.ok) {
            throw new Error('Failed to add product')
        } else {
            await updateProductsList()

            showToast('Product added successfully', '#7dd56f', 'right')

            form.reset()
        }
    } catch (error) {
        console.log(error)
    }
}

const deleteProduct = async (id) => {
    try {
        const res = await fetch(`/api/products/${id}`, {
            method: 'DELETE',
        })
        const result = await res.json()
        if (result.status === 'error') throw new Error(result.error)
        else await updateProductsList()

        showToast('Product deleted successfully', '#E93C3C', 'bottom')
    } catch (error) {
        console.log(error)
    }
}

const renderProducts = (products) => {
    tbody.innerHTML = ''

    products.forEach((item) => {
        const tr = document.createElement("tr")
        tr.innerHTML = `
            <td>${item.title}</td>
            <td>${item.description}</td>
            <td>${item.price}</td>
            <td>${item.code}</td>
            <td>${item.category}</td>
            <td>${item.stock}</td>
            <td>
                <button class="btn btn-danger" onclick="deleteProduct('${item._id}')" id="btnDelete">Eliminar</button>
                <button class="btn btn-info" onclick="updatedProduct('${item._id}')" id="btnUpdate">Update</button>
            </td>
            <td id="editForm_${item._id}" style="display: none">
                <div class="product-edit-form">
                    <label for="editStock">New Stock:</label>
                    <input type="number" id="editStock_${item._id}" >
                    <button class="btn btn-info" onclick="updateStock('${item._id}')">Update Stock</button>
                </div>
            </td>
        `
        tbody.appendChild(tr)
    })
}

form.addEventListener('submit', handleFormSubmit)

socket.on('updatedProducts', (products) => {
    renderProducts(products)
})

