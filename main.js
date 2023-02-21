const fetch = require('node-fetch');

function getReceiptData() {
    return fetch('https://interview-task-api.mca.dev/qr-scanner-codes/alpha-qr-gFpwhsQ8fkY1')
        .then(response => response.json())
        .catch(error => console.error(`An error occurred while fetching the data: ${error.message}`));
}

async function groupProductsByOrigin() {
    try {
        const data = await getReceiptData();
        const domesticProducts = [];
        const importedProducts = [];

        for (let i = 0; i < data.length; i++) {
            const product = data[i];
            const description = product.description.length > 10 ? product.description.substring(0, 10) + '...' : product.description;
            const name = product.name;
            const price = product.price;
            const weight = product.weight ? product.weight : 'N/A';
            const productDetails = { name, price, description, weight };

            if (product.domestic) {
                domesticProducts.push(productDetails);
            } else {
                importedProducts.push(productDetails);
            }
        }

        domesticProducts.sort((a, b) => a.name.localeCompare(b.name));
        importedProducts.sort((a, b) => a.name.localeCompare(b.name));

        console.log('Domestic:');
        for (let i = 0; i < domesticProducts.length; i++) {
            const product = domesticProducts[i];
            const priceStr = 'Price: $' + product.price;
            const weightStr = 'Weight: ' + product.weight + 'g';
            console.log(`${product.name} - ${priceStr} - ${product.description} - ${weightStr}`);
        }
        const domesticTotal = domesticProducts.reduce((acc, product) => acc + product.price, 0);
        console.log(`Domestic cost: $${domesticTotal}`);
        console.log('\nImported:');
        for (let i = 0; i < importedProducts.length; i++) {
            const product = importedProducts[i];
            const priceStr = 'Price: $' + product.price;
            const weightStr = 'Weight: ' + product.weight + 'g';
            console.log(`${product.name} - ${priceStr} - ${product.description} - ${weightStr}`);
        }
        const importedTotal = importedProducts.reduce((acc, product) => acc + product.price, 0);
        console.log(`Imported cost: $${importedTotal}`);

        console.log('\nNumber of Purchased Products:');
        console.log(`Domestic count: ${domesticProducts.length}`);
        console.log(`Imported count: ${importedProducts.length}`);
    } catch (error) {
        console.error(`An error occurred while processing the data: ${error.message}`);
    }
}

groupProductsByOrigin();