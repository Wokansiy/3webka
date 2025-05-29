const artData = [
    {
        id: 1,
        title: "Blue Waves",
        category: "abstract",
        image: "BreakingWaves-Piha-SamuelEarp-oilpainting.jpg",
        description: "Vibrant abstract art with flowing blue patterns.",
        discount: "10%",
        price: 2500
    },
    {
        id: 2,
        title: "Mountain Dawn",
        category: "landscape",
        image: "jonathan-padilla-dawn-mountains-jpadilla2020.jpg",
        description: "Serene landscape of mountains at sunrise.",
        discount: null,
        price: 3200
    },
    {
        id: 3,
        title: "Portrait Study",
        category: "portrait",
        image: "Bacon-Francis-Three-Studies-for-Self-Portrait-901-s001-2.jpg",
        description: "Detailed portrait with expressive colors.",
        discount: "15%",
        price: 2800
    },
    {
        id: 4,
        title: "Starry Night",
        category: "abstract",
        image: "Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
        description: "Abstract interpretation of a starry sky.",
        discount: null,
        price: 3500
    },
];

const newsData = [
    { id: 1, title: "Нова колекція абстрактних картин!", date: "2025-05-26 10:00", content: "Досліджуйте нашу нову колекцію абстрактних картин, натхненних космосом.", important: true },
    { id: 2, title: "Розпродаж пейзажів", date: "2025-05-25 15:30", content: "Знижки до 20% на всі космічні пейзажі цього тижня.", important: false },
    { id: 3, title: "Виставка портретів", date: "2025-05-24 09:00", content: "Відвідайте нашу віртуальну виставку зоряних портретів.", important: true },
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cardContainer = document.getElementById("card-container");
const cartAside = document.getElementById("cart-aside");
const cartItems = document.getElementById("cart-items");
const cartSummary = document.getElementById("cart-summary");
const categoryFilter = document.getElementById("category");
const cartSort = document.getElementById("cart-sort");
const priceMin = document.getElementById("price-min");
const priceMax = document.getElementById("price-max");
const searchKeywords = document.getElementById("search-keywords");
const subscriptionModal = document.getElementById("subscription-modal");
const adModal = document.getElementById("ad-modal");
const subscribeBtn = document.getElementById("subscribe-btn");
const declineBtn = document.getElementById("decline-btn");
const closeAdBtn = document.getElementById("close-ad-btn");
const countdownEl = document.getElementById("countdown");
const addMoreBtn = document.getElementById("add-more");
const closeCartBtn = document.getElementById("close-cart");
const cartToggle = document.getElementById("cart-toggle");
const cartCount = document.getElementById("cart-count");
const newsSidebar = document.getElementById("news-sidebar");
const newsContent = document.getElementById("news-content");
const productPage = document.getElementById("product-page");
const chartCanvas = document.getElementById("popularity-chart");
const chartButtons = document.querySelectorAll(".chart-btn");
const backToTop = document.getElementById("back-to-top");

let chartInstance = null;

function renderCards(category = "all") {
    cardContainer.innerHTML = "";
    const filteredData = category === "all" ? artData : artData.filter(item => item.category === category);

    filteredData.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "card";
        card.style.zIndex = index + 1;
        card.innerHTML = `
      <div style="position: relative;">
        <img src="${item.image}" alt="${item.title}">
        ${item.discount ? `<span class="discount-badge">${item.discount} Знижка</span>` : ""}
      </div>
      <div class="card-content">
        <h3>${item.title}</h3>
        <p>Ціна: ${item.price} грн</p>
      </div>
    `;
        card.addEventListener("click", () => {
            document.querySelectorAll(".container").forEach(container => container.classList.add("hidden"));
            document.getElementById("product").classList.remove("hidden");
            renderProductPage(item);
        });
        cardContainer.appendChild(card);
    });
}

function renderProductPage(item) {
    productPage.innerHTML = `
    <img src="${item.image}" alt="${item.title}">
    <h2>${item.title}</h2>
    <p>Ціна: ${item.price} грн</p>
    <p>${item.description}</p>
    <input type="number" class="quantity" min="1" value="1">
    <button class="add-to-cart" data-id="${item.id}">Додати до кошика</button>
    <button class="back-btn">Повернутися до галереї</button>
  `;
    productPage.querySelector(".add-to-cart").addEventListener("click", () => {
        const quantity = parseInt(productPage.querySelector(".quantity").value);
        const cartItem = cart.find(cartItem => cartItem.id === item.id);
        if (cartItem) {
            cartItem.quantity += quantity;
        } else {
            cart.push({ ...item, quantity });
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
        updateCharts();
        updateCartCount();
    });
    productPage.querySelector(".back-btn").addEventListener("click", () => {
        document.querySelectorAll(".container").forEach(container => container.classList.add("hidden"));
        document.getElementById("home").classList.remove("hidden");
    });
}

function renderCart() {
    cartItems.innerHTML = "";
    let sortBy = cartSort.value;
    let minPrice = parseFloat(priceMin.value) || 0;
    let maxPrice = parseFloat(priceMax.value) || Infinity;
    let keywords = searchKeywords.value.toLowerCase();

    let filteredCart = [...cart];
    if (keywords) {
        filteredCart = filteredCart.filter(item =>
            item.title.toLowerCase().includes(keywords) ||
            item.description.toLowerCase().includes(keywords) ||
            item.category.toLowerCase().includes(keywords)
        );
    }
    filteredCart = filteredCart.filter(item => item.price >= minPrice && item.price <= maxPrice);

    filteredCart.sort((a, b) => {
        if (sortBy === "name-asc") return a.title.localeCompare(b.title);
        if (sortBy === "name-desc") return b.title.localeCompare(a.title);
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
    });

    filteredCart.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "card";
        card.style.zIndex = index + 1;
        card.innerHTML = `
      <div style="position: relative;">
        <img src="${item.image}" alt="${item.title}">
        ${item.discount ? `<span class="discount-badge">${item.discount} Знижка</span>` : ""}
      </div>
      <div class="card-content">
        <h3>${item.title}</h3>
        <p>Ціна: ${item.price} грн</p>
        <input type="number" class="quantity" min="1" value="${item.quantity}">
        <button class="remove-from-cart" data-id="${item.id}">Видалити</button>
      </div>
    `;
        cartItems.appendChild(card);
    });

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartSummary.innerHTML = `<p>Загальна сума: ${total} грн</p>`;

    document.querySelectorAll(".quantity").forEach(input => {
        input.addEventListener("change", () => {
            const id = parseInt(input.nextElementSibling.dataset.id);
            const cartItem = cart.find(item => item.id === id);
            cartItem.quantity = parseInt(input.value) || 1;
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCart();
            updateCharts();
            updateCartCount();
        });
    });

    document.querySelectorAll(".remove-from-cart").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.dataset.id);
            cart = cart.filter(item => item.id !== id);
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCart();
            updateCharts();
            updateCartCount();
        });
    });
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function renderNews() {
    newsSidebar.innerHTML = "";
    newsData.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(item => {
        const newsItem = document.createElement("div");
        newsItem.className = `news-item ${item.important ? "important" : ""}`;
        newsItem.textContent = `${item.title} (${item.date})`;
        newsItem.addEventListener("click", () => {
            newsContent.innerHTML = `<h3>${item.title}</h3><p>${item.content}</p><p>${item.date}</p>`;
        });
        newsSidebar.appendChild(newsItem);
    });
}

function updateCharts(type = "pie") {
    if (chartInstance) chartInstance.destroy();
    const categories = [...new Set(artData.map(item => item.category))];
    const quantities = categories.map(cat =>
        cart.filter(item => item.category === cat).reduce((sum, item) => sum + item.quantity, 0)
    );
    const total = quantities.reduce((sum, qty) => sum + qty, 0);
    const relative = quantities.map(qty => total ? (qty / total * 100).toFixed(1) : 0);

    chartInstance = new Chart(chartCanvas, {
        type: type,
        data: {
            labels: categories,
            datasets: [{
                label: type === "pie" ? "Відносна популярність (%)" : "Кількість",
                data: type === "pie" ? relative : quantities,
                backgroundColor: ["#ff00cc", "#3333ff", "#00ffcc"],
                borderColor: "#00ffcc",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { labels: { color: "#fff" } },
                title: { display: true, text: "Популярність товарів", color: "#fff" }
            },
            scales: type !== "pie" ? {
                y: { beginAtZero: true, ticks: { color: "#fff" } },
                x: { ticks: { color: "#fff" } }
            } : {}
        }
    });

    chartButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.type === type));
}

categoryFilter.addEventListener("change", () => renderCards(categoryFilter.value));
cartSort.addEventListener("change", renderCart);
priceMin.addEventListener("input", renderCart);
priceMax.addEventListener("input", renderCart);
searchKeywords.addEventListener("input", renderCart);

cartToggle.addEventListener("click", () => {
    cartAside.classList.toggle("open");
    renderCart();
    updateCharts();
});

closeCartBtn.addEventListener("click", () => {
    cartAside.classList.remove("open");
});

addMoreBtn.addEventListener("click", () => {
    cartAside.classList.remove("open");
    document.querySelectorAll(".container").forEach(container => container.classList.add("hidden"));
    document.getElementById("home").classList.remove("hidden");
});

chartButtons.forEach(btn => {
    btn.addEventListener("click", () => updateCharts(btn.dataset.type));
});

if (!localStorage.getItem("subscribed")) {
    setTimeout(() => {
        subscriptionModal.classList.add("show");
    }, 5000);
}

subscribeBtn.addEventListener("click", () => {
    localStorage.setItem("subscribed", "true");
    subscriptionModal.classList.remove("show");
    alert("Дякуємо за приєднання до космічної подорожі!");
});

declineBtn.addEventListener("click", () => {
    subscriptionModal.classList.remove("show");
});

let adTriggered = false;
function showAdModal() {
    if (!adTriggered) {
        adModal.classList.add("show");
        adTriggered = true;
        let countdown = 5;
        countdownEl.textContent = countdown;
        const countdownInterval = setInterval(() => {
            countdown--;
            countdownEl.textContent = countdown;
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                closeAdBtn.disabled = false;
            }
        }, 1000);
    }
}

setTimeout(showAdModal, 10000);
window.addEventListener("scroll", () => {
    const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    if (scrollPercent > 50) showAdModal();
    backToTop.classList.toggle("hidden", scrollPercent < 66.67);
});

closeAdBtn.addEventListener("click", () => {
    adModal.classList.remove("show");
});

backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        cartAside.classList.remove("open");
        document.querySelectorAll(".container").forEach(container => container.classList.add("hidden"));
        document.getElementById(link.getAttribute("href").slice(1)).classList.remove("hidden");
        if (link.getAttribute("href") === "#news") {
            renderNews();
        }
    });
});

renderCards();
renderNews();
updateCartCount();