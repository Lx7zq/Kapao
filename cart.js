const cart = {};

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const productId = button.getAttribute('data-product-id');
        const price = parseFloat(button.getAttribute('data-price'));
        if (!cart[productId]) {
            cart[productId] = { quantity: 1, price: price };
        } else {
            cart[productId].quantity++;
        }
        updateCartDisplay();
    });
});

function updateCartDisplay() {
    const cartElement = document.getElementById("cart");
    cartElement.innerHTML = "";

    let totalPrice = 0;
    for (const productId in cart) {
        const item = cart[productId];
        const itemTotalPrice = item.quantity * item.price;
        totalPrice += itemTotalPrice;
        const productElement = document.createElement("div");
        productElement.classList.add("product-item");
        productElement.style.padding = "1%";

        const productInfo = document.createElement("p");
        productInfo.textContent = `เมนูที่ ${productId}: ${item.quantity} x $${item.price} = $${itemTotalPrice}`;
        productElement.appendChild(productInfo);

        const deleteButton = createDeleteButton(productId);
        productElement.appendChild(deleteButton);

        cartElement.appendChild(productElement);
    }

    if (Object.keys(cart).length === 0) {
        cartElement.innerHTML = "<div><p>Non Product</p></div>";
    } else {
        const totalPriceElement = document.createElement("p");
        totalPriceElement.textContent = `Total Price: $${totalPrice}`;
        totalPriceElement.style.background = "#C1FFC1";
        totalPriceElement.style.padding = "10px";
        totalPriceElement.style.borderRadius = "8px";
        cartElement.appendChild(totalPriceElement);
    }
}

function createDeleteButton(productId) {
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.classList.add("delete-button-after");
    deleteButton.setAttribute("data-product-id", productId);

    deleteButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 delete-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
    `;

    deleteButton.addEventListener("click", () => {
        delete cart[productId];
        updateCartDisplay();
    });
    return deleteButton;
}

const confirmButton = document.getElementById('confirmButton');
confirmButton.addEventListener('click', () => {
    const invoiceContent = generateInvoiceContent();

    Swal.fire({
        title: "Invoice",
        html: `${invoiceContent}`,
        showCancelButton: true,
        confirmButtonText: "Download PDF",
    }).then((result) => {
        if (result.isConfirmed) {
            downloadPDF(invoiceContent);
        }
    });
});

function calculateTotalPrice() {
    let totalPrice = 0;
    for (const productId in cart) {
        const item = cart[productId];
        const itemTotalPrice = item.quantity * item.price;
        totalPrice += itemTotalPrice;
    }
    return totalPrice;
}

function getCurrentDateTime() {
    const now = new Date();
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false };
    const formattedDate = now.toLocaleDateString('en-US', dateOptions);
    const formattedTime = now.toLocaleTimeString('en-US', timeOptions);
    return `${formattedDate} ${formattedTime}`;
}

function generateInvoiceContent() {
    let invoiceContent = '<h2></h2>';

    for (const productId in cart) {
        const item = cart[productId];
        const itemTotalPrice = item.quantity * item.price;
        invoiceContent += `<p> เมนู: ${productId}: ${item.quantity} x $${item.price} = $${itemTotalPrice}</p>`;
    }

    const totalPrice = calculateTotalPrice();
    invoiceContent += `<p>Total Price: $${totalPrice}</p>`;

    invoiceContent += `<p>Date and Time: ${getCurrentDateTime()}</p>`;

    return invoiceContent;
}

function downloadPDF(content) {
    html2pdf().from(content).save();
}