import { sendData, loadData, updateData, deleteData } from "./ajaxCalls";

// ====================================== GENERAL FUNCTIONS =======================================

const assignLoginPage = () => location.assign("/login");

// ================================================================================================

// ==================================== DOM-RELATED FUNCTIONS ==================================== //

// IT RENDERS THE DROPDOWN SHOWN WHEN MOUSE HOVERS THROUGH CART ICON IN THE HEADER

export const renderCartDropDown = ({ cartItems, value }) => {
  const cartContainer = document.querySelector(".nav-cart__items");
  cartContainer.innerText = ""; // CLEANS ANY CONTENT IF THERE IS ANY
  // THIS CHANGES THE TOTAL ITEMS ADDED TO THE CART
  document.querySelector(".nav-cart span").innerText =
  cartItems.length > 0 ? cartItems.length : "";
  // SETS THE TOTAL VALUE OF THE CART
  document.querySelector('.nav-cart__total-price').innerText = `$ ${value}`;

  if (cartItems.length === 0) {
    return;
  }

  cartItems.forEach(({ product }) => {
    const markup = `  
          <div class="nav-cart__item clearfix">
            <div class="nav-cart__img">
              <a href=/product/${product.sex}/${product.slug}>
                <img src="/img/products/${product.images[0]}" alt=${product.name} photo>
              </a>
            </div>
            <div class="nav-cart__title">
              <a href=/product/${product.sex}/${product.slug}>
                ${product.name}
              </a>
              <div class="nav-cart__price">
                <span>1 x</span>
                <span>${product.price}</span>
              </div>
            </div>
          </div>
        </div>
        `;

    cartContainer.insertAdjacentHTML("beforeend", markup);
  });
};

// RENDERS ALL THE RECEIVED PRODUCTS FROM THE API IN /products PAGE. AT THE END, IT CALLS pagination()
// WHICH IN TURN WILL APPLY ALL THE LOGIC NEEDED TO PROVIDE PAGINATION FOR THE RESULTS AND WILL RENDER
// IN THE PAGE.

export const renderProductsCard = ({ data, currentPage, totalResults }) => {
  const totalProductsPerPage = document.querySelector(".total-products-page");
  const totalProducts = document.querySelector(".total-products");
  const productsContainer = document.querySelector(".catalog .row .row-8");
  const paginationContainer = document.querySelector(".pagination");

  totalProductsPerPage.innerText = data.length <= 12 ? data.length : 12;
  totalProducts.innerText = totalResults;
  productsContainer.innerHTML = "";
  paginationContainer.innerHTML = "";

  data.forEach((product) => {
    const markup = `
          <div class="col-lg-3 col-md col-sm-6 product" data-product-id=${product._id}>
              <div class="product__img-holder">
              <a href="/product/${product.sex}/${product.slug}" class="product__link">
                  <img src="/img/products/${product.images[0]}" alt="${product.name} image" class="product__img">
                  <img src="/img/products/${product.images[0]}" alt="${product.name} image" class="product__img-back">
              </a>
                  <div class="product__actions">
                      <button class="button__action button-cart product__quickview">
                          <i class="ui-bag"></i>
                          <span>Cart</span>
                      </a>
                      <button class="button__action button-wishlist product__add-to-wishlist">
                          <i class="ui-heart"></i>
                          <span>Wishlist</span>
                      </a>
                  </div>
              </div>
      
              <div class="product__details">
                  <h3 class="product__title">
                      <a href="/product/${product.sex}/${product.slug}">${product.name}
                  </h3>
              </div>
      
              <span class="product__price">
                  <ins>
                      <span class="amount">$ ${product.price}</span>
                  </ins>
              </span>
          </div>
          `;

    productsContainer.insertAdjacentHTML("beforeend", markup);
  });

  // AFTER ALL THE PRODUCTS ARE INSERTED IN THE PRODUCTS CONTAINER, pagination() RUNS AND GIVES BACK ALL
  // THE RESULTS SEPARATED IN PAGES.

  const paginatedResults = pagination(currentPage, totalResults); // RETURNS THE NAV ELEMENT WITH THE PAGINATION READY TO BE INSERTED

  paginationContainer.insertAdjacentElement("beforeend", paginatedResults);

  // FUNCTION RESPONSIBLE TO ADD AN EVENT TO CART AND WISHLIST BUTTONS. THIS FUNCTION NEEDS TO BE CALLED HERE BECAUSE AS THE PRODUCT LISTS
  // ARE DINAMICALLY RENDERED, THE TWO ELEMENTS - CART AND WISHLIST BUTTONS - WERE APPENDED IN THIS POINT.

  selectButtonsAndAppendEventListener();
};

// USED BY renderProductsList(). IT GENERATES AND RETURNS THE OPTION ELEMENTS BY CHECKING IF THE ITERABLE
// OPTION IS THE SAME AS THE SELECTED ONE.

const fillSelectWithOption = (iterableOption, selectedOption) => {
  const optionElements = [];

  iterableOption.map((option) => {
    if (option === selectedOption) {
      optionElements.push(
        `<option value=${option} selected>${option.replace(/^\w/, (c) =>
          c.toUpperCase()
        )}</option>`
      );
    } else {
      optionElements.push(
        `<option value=${option}>${option.replace(/^\w/, (c) =>
          c.toUpperCase()
        )}</option>`
      );
    }
  });

  return optionElements;
};

// RENDERS ALL THE RECEIVED PRODUCTS FROM THE API IN /cart AND /wishlist PAGES.

export const renderProductsList = (data) => {
  const listItemsContainer = document.querySelector("tbody", ".list-items");

  if (data.length === 0) {
    return listItemsContainer.insertAdjacentHTML(
      "beforeend",
      `<p class='text-center mt-5'>You haven't added any items to your cart! :(</p>`
    );
  }

  data.forEach(({ color, product, quantity, size, _id }, i) => {
    const sizeOptionMarkup = fillSelectWithOption(product.size, size);
    const colorOptionMarkup = fillSelectWithOption(product.color, color);

    const markup = `
      <tr class="cart_item" data-product-id=${_id}>
        <td class="product-thumbnail">
          <a href="/product/${product.sex}/${product.slug}" target="_blank">
            <img src="img/products/${product.images[0]}" alt="Product Image">
          </a>
        </td>
        <td class="product-name">
          <a href="/product/${product.sex}/${product.slug}" target="_blank">${
      product.name
    }</a>
          <div class="size-quantity">
            <p> Size: 
            <select class="select__product-list" name="size">
            ${sizeOptionMarkup}
            </select>
            <p>Color:
            <select class="select__product-list" name='color'>
            ${colorOptionMarkup}
            </select>
          </div>
        </td>
        <td class="product-price">
          <span class="amount amount--product">$ ${product.price}</span>
        </td>
        <td class="product-quantity">
          <div class="quantity buttons_added">
            <input type="button" value="-" class="minus">
            <input type="number" step="1" min="1" max=${
              product.quantity
            } value=${quantity} title="Quantity" class="input-text qty text">
            <input type="button" value="+" class="plus">
          </div>
          <p class="small text-muted">(${product.quantity} AVAILABLE)
        </td>
        <td class="product-subtotal">
          <span class="amount amount--total">$ ${(
            product.price * quantity
          ).toFixed(2)}</span>
        </td>
        <td class="product-remove">
          <button class="remove" title="Remove this item">
            <i class="ui-close"></i>
          </button>
        </td>
      </tr>
    `;

    listItemsContainer.insertAdjacentHTML("beforeend", markup);
  });
};

// ================================================================================================

// =========================== PAGINATION-RELATED FUNCTIONS ======================================= //

// MAIN PAGINATION FUNCTION
// ACTUAL STATUS: PARTLY PROCESSED IN BACKEND / PARTLY IN FRONTEND. CALCULATIONS LIKE SKIPPING, LIMITING AND PAGING ARE
// DONE IN BACKEND. HOWEVER, THE LOGIC TO POPULATE THE PAGE LINKS ARE DONE IN FRONTEND. UNSURE IF MOVE THIS LAST
// PART ALSO TO BACKEND AND FRONTEND RECEIVE THE PAGE LINKS READY.

const pagination = (currentPage, totalResults) => {
  const totalPages = Math.ceil(totalResults / 12);
  const order = currentPage % 4;
  const firstPage = order === 0 ? currentPage - 3 : currentPage - (order - 1);
  const lastPage = totalPages > firstPage + 3 ? firstPage + 3 : totalPages;
  let isRightArrowEnabled;
  let length;

  if (totalPages <= 4) {
    length = totalPages;
    isRightArrowEnabled = false;
  } else {
    if (lastPage < totalPages) {
      length = 4;
      isRightArrowEnabled = true;
    } else {
      length = lastPage - (firstPage - 1);
      isRightArrowEnabled = false;
    }
  }

  return createAndAppendLinks(
    firstPage,
    isRightArrowEnabled,
    length,
    Number(currentPage)
  );
};

// IT CREATES AND APPENDS THE GENERATED LINKS FOR THE PAGINATION

const createAndAppendLinks = (
  firstPage,
  isRightArrowEnabled,
  length,
  currentPage
) => {
  const navElement = document.createElement("nav");
  navElement.classList.add("pagination__nav", "right", "clearfix");

  let leftArrow, rightArrow;

  // LEFT ARROW
  if (firstPage === 1 && currentPage === firstPage) {
    leftArrow = `<a href='#' class='pagination__page' aria-current="disabled"><i class="ui-arrow-left"></i></a>`;
  } else {
    leftArrow = `<a href='?page=${
      currentPage - 1
    }' class='pagination__page'><i class="ui-arrow-left"></i></a>`;
  }

  // RIGHT ARROW
  if (isRightArrowEnabled) {
    rightArrow = `<a href='?page=${
      firstPage + 4
    }' class="pagination__page"><i class="ui-arrow-right"></i></a>`;
  } else {
    rightArrow = `<a href='#' class='pagination__page' aria-current="disabled"><i class="ui-arrow-right"></i></a>`;
  }

  navElement.insertAdjacentHTML("beforeend", leftArrow);

  // ACTUAL PAGE LINKS
  for (let i = 0; i < length; i++) {
    const page = firstPage + i;
    let element;

    if (page === currentPage) {
      element = `
    <span class="pagination__page pagination__page--current">${page}</span>
      `;
    } else {
      element = `
    <a href="?page=${page}" class="pagination__page">${page}</a>
      `;
    }

    navElement.insertAdjacentHTML("beforeend", element);
  }

  navElement.insertAdjacentHTML("beforeend", rightArrow);

  return navElement;
};

// ================================================================================================

// ============================== CART & WISHLIST-RELATED FUNCTIONS ===============================

const reloadCartDropDown = async (user) => {
  const { data } = await loadData(`/users/${user}/carts`);

  renderCartDropDown(data.cart);
};

const PATCHOrDELETEProductsOnHome = async (element, request, path) => {
  const cartNavbar = document.querySelector(".nav-cart");

  if (!cartNavbar) {
    // IF IT GETS TO HERE, IT MEANS THAT USER IS NOT LOGGED IN.
    return assignLoginPage();
  }

  if (path.includes("carts")) {
    document.querySelector(".nav-cart span").innerText = "Loading...";
  }

  const { userId: user } = cartNavbar.dataset;
  const { productId: product } = element.closest(".product").dataset;

  if (request === "PATCH") {
    await updateData([{ product }], `/users/${user}${path}`);

    element.firstElementChild.style.color = "red";

    if (path.includes("carts")) {
      await reloadCartDropDown(user);
    }
  }
  if (request === "DELETE") {
    await deleteData(`/users/${user}${path}/product/${product}`);

    element.firstElementChild.style.color = "black";
    if (path.includes("carts")) {
      await reloadCartDropDown(user);
    }
  }
};

const addListenerToButtons = (buttonElement, path) => {
  buttonElement.forEach(async (button) => {
    button.addEventListener("click", async function () {
      button.classList.toggle("clicked");

      let requestType;

      button.classList.value.includes("clicked")
        ? (requestType = "PATCH")
        : (requestType = "DELETE");

      return PATCHOrDELETEProductsOnHome(button, requestType, path);
    });
  });
};

export const selectButtonsAndAppendEventListener = () => {
  const addToCartButton = document.querySelectorAll(".button-cart");
  const addToWishlistButton = document.querySelectorAll(".button-wishlist");

  addListenerToButtons(addToCartButton, "/carts");
  addListenerToButtons(addToWishlistButton, "/wishlists");
};

// ================================================================================================
