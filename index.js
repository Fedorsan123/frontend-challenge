const apiKey = 'live_qFix6yiU9zpobOV4gTCU8RXYkbbeHlJ3C6u5DD8zd68yKj8T5i4ISPFbc2caJdDS'; 


let isLoading = false;
let page = 1; 
let favoriteCats = []; 
let allCats = []; 
let currentView = 'all'; 

// Функция для загрузки картинок
async function loadCatImages() {
    if (isLoading || currentView === 'favorites') return; 
    isLoading = true; 

    try {
        const url = `https://api.thecatapi.com/v1/images/search?limit=15&page=${page}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-api-key': apiKey,
            },
        });

        if (!response.ok) {
            throw new Error('Ошибка при загрузке данных');
        }

        const data = await response.json();
        allCats.push(...data); 
        displayCatImages(allCats); 
        page++;
    } catch (error) {
        console.error('Ошибка запроса: ', error);
    } finally {
        isLoading = false;
    }
}

// Функция для отображения картинок в main
function displayCatImages(images) {
    const main = document.getElementById('main');
    main.innerHTML = '';

    images.forEach(img => {
        const imgElement = document.createElement('div');
        imgElement.classList.add('cat_img');
        imgElement.style.backgroundImage = `url(${img.url})`;

        const favoriteButton = document.createElement('button');
        favoriteButton.classList.add('favorite_button');
        favoriteButton.innerHTML = ` 
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_1_2188)">
                    <path d="M24 42.7L21.1 40.06C10.8 30.72 4 24.56 4 17C4 10.84 8.84 6 15 6C18.48 6 21.82 7.62 24 10.18C26.18 7.62 29.52 6 33 6C39.16 6 44 10.84 44 17C44 24.56 37.2 30.72 26.9 40.08L24 42.7Z" 
                          fill="none" 
                          stroke="#FF3A00" 
                          stroke-width="2"/>
                </g>
                <defs>
                    <clipPath id="clip0_1_2188">
                        <rect width="48" height="48" fill="white"/>
                    </clipPath>
                </defs>
            </svg>
        `;


        if (favoriteCats.some(favCat => favCat.id === img.id)) {
            favoriteButton.classList.add('active');
        }

        favoriteButton.addEventListener('click', () => {
            if (favoriteCats.some(favCat => favCat.id === img.id)) {
                favoriteCats = favoriteCats.filter(cat => cat.id !== img.id);
                favoriteButton.classList.remove('active');

                if (currentView === 'favorites') {
                    imgElement.remove();
                }
            } else {
                favoriteCats.push(img); 
                favoriteButton.classList.add('active');
            }
        });

        imgElement.appendChild(favoriteButton);
        main.appendChild(imgElement);
    });
}

// Функция для переключения между всеми котиками и избранными
function setupCategorySwitching() {
    const allCatsLink = document.getElementById('all-cats-link');
    const favoriteCatsLink = document.getElementById('favorite-cats-link');

    allCatsLink.addEventListener('click', (e) => {
        e.preventDefault();
        currentView = 'all'; 
        displayCatImages(allCats); 
    });

    favoriteCatsLink.addEventListener('click', (e) => {
        e.preventDefault();
        currentView = 'favorites'; 
        displayCatImages(favoriteCats); 
    });
}

// Функция для проверки прокрутки
function checkScroll() {
    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollPosition >= documentHeight - 10) {
        loadCatImages();
    }
}

window.addEventListener('scroll', checkScroll);
setupCategorySwitching(); 
loadCatImages(); 
