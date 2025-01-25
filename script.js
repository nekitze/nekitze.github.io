let offset = 0;
let limit = 100;
const tableBody = document.querySelector('#tokenTable tbody');
const loader = document.createElement('div');

loader.style.cssText = `
    width: 100%;
    height: 50px;
    text-align: center;
    line-height: 50px;
    font-size: 18px;
`;

function loadMoreTokens() {
    fetch(`https://tokens.jup.ag/tokens?tags=lst,community&limit=${limit}&offset=${offset}`)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                loader.remove();
                return;
            }

            data.forEach(token => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>
                        <div class="row-container">
                            <img src="${token.logoURI}" alt="${token.name} logo" class="token-logo">
                            <div>${token.name}</div>
                        </div>
                    </td>
                    <td>${token.daily_volume}</td>
                `;
                tableBody.appendChild(row);
            });

            offset+=limit;
        })
        .catch(error => console.error('Ошибка:', error));
}

function handleScroll() {
    const scrollBottom = window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 200;

    if (scrollBottom && !loader.parentNode) {
        tableBody.appendChild(loader);
        loadMoreTokens();
    } else if (!scrollBottom && loader.parentNode) {
        loader.remove();
    }
}

window.onload = function() {
    document.documentElement.style.cssText = '';
};

window.addEventListener('scroll', handleScroll);

loadMoreTokens();