let products = [];
let saveForLater = [];

const getProducts = () => {
  return fetch("http://localhost:3000/products")
    .then(result => result.json())
    .then(response => {
      products = response;
      console.log('Products fetched:', products);
      createProductsList();
    })
    .catch(error => {
      console.error("Error fetching products:", error);
    });
};

const getSaveForLater = () => {
  return fetch("http://localhost:3000/saveForLater")
    .then(result => result.json())
    .then(response => {
      saveForLater = response;
      console.log('Save for Later fetched:', saveForLater);
      createSaveForLaterList();
    })
    .catch(error => {
      console.error("Error fetching saved items:", error);
    });
};

const createProductsList = () => {
  let productList = "";
  products.forEach(product => {
    productList += renderProductCard(product);
  });
  document.getElementById("productlist").innerHTML = productList;
};

const renderProductCard = (product) => {
  return `
    <div class="card mb-3" style="max-width: 400px;">
      <div class="row g-0">
        <div class="col-md-4">
          <img src="${product.image}" class="img-fluid rounded-start" alt="${product.title}">
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">${product.title}</h5>
            <p class="card-text">${product.description}</p>
            <p class="card-text"><small class="text-muted">$${product.price}</small></p>
            <button type="button" class="btn btn-primary" onclick="saveForLaterHandler(${product.id})">Save for Later</button>
          </div>
        </div>
      </div>
    </div>
  `;
};

const createSaveForLaterList = () => {
  let saveForLaterList = "";
  saveForLater.forEach(product => {
    saveForLaterList += renderSaveForLaterCard(product);
  });
  document.getElementById("saved-list").innerHTML = saveForLaterList;
};

const renderSaveForLaterCard = (product) => {
  return `
    <div class="card mb-3" style="max-width: 400px;">
      <div class="row g-0">
        <div class="col-md-4">
          <img src="${product.image}" class="img-fluid rounded-start" alt="${product.title}">
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">${product.title}</h5>
            <p class="card-text">${product.description}</p>
            <p class="card-text"><small class="text-muted">$${product.price}</small></p>
            <button type="button" class="btn btn-danger" onclick="deleteFromSaveForLater(${product.id})">Remove</button>
          </div>
        </div>
      </div>
    </div>
  `;
};

const saveForLaterHandler = (id) => {
  const product = products.find(p => p.id === id);
  console.log('Clicked product:', product);
  
  if (product && !isProductAlreadySaved(id)) {
    fetch("http://localhost:3000/saveForLater", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    })
      .then(() => {
        console.log('Product saved successfully for later.');
        getSaveForLater(); // Update the saveForLater list after successful save
      })
      .catch(error => {
        console.error("Error saving product for later:", error);
      });
  } else {
    console.log('Product is already saved for later or not found in products list.');
    alert("Product is already saved for later or not found in products list.");
  }
};

const deleteFromSaveForLater = (id) => {
  fetch(`http://localhost:3000/saveForLater/${id}`, {
    method: 'DELETE'
  })
    .then(() => {
      console.log('Product removed successfully from save for later.');
      getSaveForLater(); // Update the saveForLater list after successful removal
    })
    .catch(error => {
      console.error("Error removing product from save for later:", error);
    });
};

const isProductAlreadySaved = (id) => {
  return saveForLater.some(product => product.id === id);
};

document.addEventListener('DOMContentLoaded', function () {
  getProducts();
  getSaveForLater();
});