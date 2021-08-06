(function ($) {
  "use strict";

  var $window = $(window);

  $window.on("load", function () {
    // Preloader
    $(".loader").fadeOut();
    $(".loader-mask").delay(350).fadeOut("slow");

    $window.trigger("resize");
  });

  // Init
  initOwlCarousel();
  initFlickity();

  $window.on("resize", function () {
    hideSidenav();
    megaMenu();
  });

  /* Detect Browser Size
  -------------------------------------------------------*/
  var minWidth;
  if (Modernizr.mq("(min-width: 0px)")) {
    // Browsers that support media queries
    minWidth = function (width) {
      return Modernizr.mq("(min-width: " + width + "px)");
    };
  } else {
    // Fallback for browsers that does not support media queries
    minWidth = function (width) {
      return $window.width() >= width;
    };
  }

  /* Mobile Detect
  -------------------------------------------------------*/
  if (
    /Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(
      navigator.userAgent || navigator.vendor || window.opera
    )
  ) {
    $("html").addClass("mobile");
    $(".dropdown-toggle").attr("data-toggle", "dropdown");
  } else {
    $("html").removeClass("mobile");
  }

  /* Sticky Navigation
  -------------------------------------------------------*/
  var $stickyNav = $(".nav--sticky");
  var $nav = $(".nav");

  $window.scroll(function () {
    scrollToTop();

    if (($window.scrollTop() > 2) & minWidth(992)) {
      $stickyNav.addClass("sticky");
      $nav.addClass("sticky");
    } else {
      $stickyNav.removeClass("sticky");
      $nav.removeClass("sticky");
    }
  });

  function stickyNavRemove() {
    if (!minWidth(992)) {
      $stickyNav.removeClass("sticky");
    }
  }

  /* Mobile Navigation
  -------------------------------------------------------*/
  var $sidenav = $("#sidenav"),
    $main = $("#main"),
    $navIconToggle = $("#nav-icon-toggle");

  $navIconToggle.on("click", function (e) {
    e.stopPropagation();
    $(this).toggleClass("nav-icon-toggle--is-open");
    $sidenav.toggleClass("sidenav--is-open");
    $main.toggleClass("main--is-open");
  });

  function resetNav() {
    $navIconToggle.removeClass("nav-icon-toggle--is-open");
    $sidenav.removeClass("sidenav--is-open");
    $main.removeClass("main--is-open");
  }

  function hideSidenav() {
    if (minWidth(992)) {
      resetNav();
      setTimeout(megaMenu, 500);
    }
  }

  $main.on("click", function () {
    resetNav();
  });

  var $dropdownTrigger = $(".nav__dropdown-trigger"),
    $navDropdownMenu = $(".nav__dropdown-menu"),
    $navDropdown = $(".nav__dropdown");

  if ($("html").hasClass("mobile")) {
    $("body").on("click", function () {
      $navDropdownMenu.addClass("hide-dropdown");
    });

    $navDropdown.on("click", "> a", function (e) {
      e.preventDefault();
    });

    $navDropdown.on("click", function (e) {
      e.stopPropagation();
      $navDropdownMenu.removeClass("hide-dropdown");
    });
  }

  /* Sidenav Menu
  -------------------------------------------------------*/

  $(".sidenav__menu-toggle").on("click", function (e) {
    e.preventDefault();

    var $this = $(this);

    $this.parent().siblings().removeClass("sidenav__menu--is-open");
    $this.parent().siblings().find("li").removeClass("sidenav__menu--is-open");
    $this.parent().find("li").removeClass("sidenav__menu--is-open");
    $this.parent().toggleClass("sidenav__menu--is-open");

    if ($this.next().hasClass("show")) {
      $this.next().removeClass("show").slideUp(350);
    } else {
      $this
        .parent()
        .parent()
        .find("li .sidenav__menu-dropdown")
        .removeClass("show")
        .slideUp(350);
      $this.next().toggleClass("show").slideToggle(350);
    }
  });

  /* Mega Menu
  -------------------------------------------------------*/
  function megaMenu() {
    $(".nav__megamenu").each(function () {
      var $this = $(this);

      $this.css("width", $(".container").width());
      var offset = $this.closest(".nav__dropdown").offset();
      offset = offset.left;
      var containerOffset = $(window).width() - $(".container").outerWidth();
      containerOffset = containerOffset / 2;
      offset = offset - containerOffset - 15;
      $this.css("left", -offset);
    });
  }

  /* Accordion
  -------------------------------------------------------*/
  var $accordion = $(".accordion");

  function toggleChevron(e) {
    $(e.target)
      .prev(".accordion__heading")
      .find("a")
      .toggleClass("accordion--is-open accordion--is-closed");
  }
  $accordion.on("hide.bs.collapse", toggleChevron);
  $accordion.on("show.bs.collapse", toggleChevron);

  /* Tabs
  -------------------------------------------------------*/
  $(".tabs__link").on("click", function (e) {
    var currentAttrValue = $(this).attr("href");
    $(".tabs__content " + currentAttrValue)
      .stop()
      .fadeIn(1000)
      .siblings()
      .hide();
    $(this).parent("li").addClass("active").siblings().removeClass("active");
    e.preventDefault();
  });

  /* Owl Carousel
  -------------------------------------------------------*/
  function initOwlCarousel() {
    // Featured Posts
    $("#owl-hero").owlCarousel({
      center: true,
      items: 1,
      loop: true,
      nav: true,
      navSpeed: 500,
      navText: ['<i class="ui-arrow-left">', '<i class="ui-arrow-right">'],
    });

    // Gallery post
    $("#owl-single").owlCarousel({
      items: 1,
      loop: true,
      nav: true,
      animateOut: "fadeOut",
      navText: ['<i class="ui-arrow-left">', '<i class="ui-arrow-right">'],
    });

    // Testimonials
    $("#owl-testimonials").owlCarousel({
      items: 1,
      loop: true,
      nav: true,
      dots: false,
      navText: ['<i class="ui-arrow-left">', '<i class="ui-arrow-right">'],
    });
  }

  /* Flickity Slider
  -------------------------------------------------------*/

  function initFlickity() {
    // main large image (shop product)
    $("#gallery-main").flickity({
      cellAlign: "center",
      contain: true,
      wrapAround: true,
      autoPlay: false,
      prevNextButtons: true,
      percentPosition: true,
      imagesLoaded: true,
      lazyLoad: 1,
      pageDots: false,
      selectedAttraction: 0.1,
      friction: 0.6,
      rightToLeft: false,
      arrowShape: "M 25,50 L 65,90 L 70,90 L 30,50  L 70,10 L 65,10 Z",
    });

    // thumbs
    $("#gallery-thumbs").flickity({
      asNavFor: "#gallery-main",
      contain: true,
      cellAlign: "left",
      wrapAround: false,
      autoPlay: false,
      prevNextButtons: false,
      percentPosition: true,
      imagesLoaded: true,
      pageDots: false,
      selectedAttraction: 0.1,
      friction: 0.6,
      rightToLeft: false,
    });

    var $gallery = $(".mfp-hover");

    $gallery.on("dragStart.flickity", function (event, pointer) {
      $(this).addClass("is-dragging");
    });

    $gallery.on("dragEnd.flickity", function (event, pointer) {
      $(this).removeClass("is-dragging");
    });

    $gallery.magnificPopup({
      delegate: ".lightbox-img, .lightbox-video",
      callbacks: {
        elementParse: function (item) {
          if (item.el.context.className === "lightbox-video") {
            item.type = "iframe";
          } else {
            item.type = "image";
          }
        },
      },
      type: "image",
      closeBtnInside: false,
      gallery: {
        enabled: true,
      },
    });
  }

  /* Payment Method Accordion
  -------------------------------------------------------*/
  var methods = $(".payment_methods > li > .payment_box").hide();
  methods.first().slideDown("easeOutExpo");

  $(".payment_methods > li > input").change(function () {
    var current = $(this).parent().children(".payment_box");
    methods.not(current).slideUp("easeInExpo");
    $(this).parent().children(".payment_box").slideDown("easeOutExpo");

    return false;
  });

  /* Quantity
  -------------------------------------------------------*/
  $(function () {
    // Increase
    jQuery(document).on("click", ".plus", function (e) {
      e.preventDefault();
      var quantityInput = jQuery(this).parents(".quantity").find("input.qty"),
        newValue = parseInt(quantityInput.val(), 10) + 1,
        maxValue = parseInt(quantityInput.attr("max"), 10);

      if (!maxValue) {
        maxValue = 9999999999;
      }

      if (newValue <= maxValue) {
        quantityInput.val(newValue);
        quantityInput.change();
      }
    });

    // Decrease
    jQuery(document).on("click", ".minus", function (e) {
      e.preventDefault();
      var quantityInput = jQuery(this).parents(".quantity").find("input.qty"),
        newValue = parseInt(quantityInput.val(), 10) - 1,
        minValue = parseInt(quantityInput.attr("min"), 10);

      if (!minValue) {
        minValue = 1;
      }

      if (newValue >= minValue) {
        quantityInput.val(newValue);
        quantityInput.change();
      }
    });
  });

  /* Sign In Popup
  -------------------------------------------------------*/
  // $("#top-bar__sign-in, .product__quickview").magnificPopup({
  //   type: "ajax",
  //   alignTop: false,
  //   overflowY: "scroll",
  //   removalDelay: 300,
  //   mainClass: "mfp-fade",
  //   callbacks: {
  //     ajaxContentAdded: function () {
  //       initFlickity();
  //     },
  //     close: function () {
  //       var $productImgHolder = $(".product__img-holder");
  //       $productImgHolder.addClass("processed");
  //       function removeProcessing() {
  //         $productImgHolder.removeClass("processed");
  //       }
  //       setTimeout(removeProcessing, 50);
  //     },
  //   },
  // });

  /* Quickview
  -------------------------------------------------------*/
  $(".product__quickview").on("click", function () {
    var product = $(".product");

    function removeProcessing() {
      product.removeClass("processing");
    }

    product.addClass("processing");
    setTimeout(removeProcessing, 500);
  });

  /* ---------------------------------------------------------------------- */
  /*  Contact Form
  /* ---------------------------------------------------------------------- */

  // var submitContact = $("#submit-message"),
  //   message = $("#msg");

  // submitContact.on("click", function (e) {
  //   e.preventDefault();

  //   var $this = $(this);

  //   $.ajax({
  //     type: "POST",
  //     url: "contact.php",
  //     dataType: "json",
  //     cache: false,
  //     data: $("#contact-form").serialize(),
  //     success: function (data) {
  //       if (data.info !== "error") {
  //         $this
  //           .parents("form")
  //           .find("input[type=text],input[type=email],textarea,select")
  //           .filter(":visible")
  //           .val("");
  //         message
  //           .hide()
  //           .removeClass("success")
  //           .removeClass("error")
  //           .addClass("success")
  //           .html(data.msg)
  //           .fadeIn("slow")
  //           .delay(5000)
  //           .fadeOut("slow");
  //       } else {
  //         message
  //           .hide()
  //           .removeClass("success")
  //           .removeClass("error")
  //           .addClass("error")
  //           .html(data.msg)
  //           .fadeIn("slow")
  //           .delay(5000)
  //           .fadeOut("slow");
  //       }
  //     },
  //   });
  // });

  /* Scroll to Top
  -------------------------------------------------------*/
  function scrollToTop() {
    var scroll = $window.scrollTop();
    var $backToTop = $("#back-to-top");
    if (scroll >= 50) {
      $backToTop.addClass("show");
    } else {
      $backToTop.removeClass("show");
    }
  }

  $('a[href="#top"]').on("click", function () {
    $("html, body").animate({ scrollTop: 0 }, 1000, "easeInOutQuint");
    return false;
  });
})(jQuery);

// ================= END OF jQUERY ========================== //
// ---------------------------------------------------------- //

import { sendData, loadData, updateData, deleteData } from "./ajaxCalls";
import {
  renderCartDropDown,
  renderProductsCard,
  renderProductsList,
  selectButtonsAndAppendEventListener,
} from "./helpers";

const searchForm = document.querySelector(".nav__search-form");
const cartNavbar = document.querySelector(".nav-cart");
const loginForm = document.querySelector(".login--form");
const homePage = document.querySelector("#home--page");
const productsPage = document.querySelector("#products--page");
const cartAndWishlistPage = document.querySelector("#cart-wishlist--page");

// DELEGATION

searchForm.addEventListener("submit", async (evt) => {
  evt.preventDefault();

  const keyword = searchForm.querySelector("input").value;

  if (!keyword) {
    return;
  }

  location.assign(`/products/search?keyword=${keyword}`);
});

if (cartNavbar) {
  (async () => {
    const { userId } = cartNavbar.dataset;
    const { data } = await loadData(`/users/${userId}/carts`);

    renderCartDropDown(data.cart);
  })();
}

if (loginForm) {
  loginForm.addEventListener("submit", async (evt) => {
    evt.preventDefault();

    const [email, password] = loginForm.querySelectorAll("input");

    await sendData(
      { email: email.value, password: password.value },
      "/users/login"
    );
  });
}

if (homePage) {
  selectButtonsAndAppendEventListener();
}

if (productsPage) {
  // PRODUCTS PAGE FUNCTIONS. INTERESTING TO READ LATER MORE ABOUT THE ABORT CONTROLLER API TO CANCEL PENDING AJAX REQUESTS AND ALLOW ONLY THE LAST ONES.
  // TO-DO: MAKE PRODUCTS CONTAINER TO HAVE A FIXED HEIGHT.

  const sortOptions = productsPage.querySelector(".sort-options");
  const sexFilterOptions = productsPage.querySelector(".sex-select");
  const categoryFilterOptions = productsPage.querySelector(".category-select");
  const sizeFilterOptions = productsPage.querySelector(".size-select");
  const colorFilterOptions = productsPage.querySelector(".color-select");
  const priceFilter = productsPage.querySelector(".btn-price-filter");

  (async () => {
    const { pathname, search } = window.location;

    const products = await loadData(`${pathname}${search}`); // { status: "success", data: { [Array of Products], results: 4 } }
    let selectedFields = {}; // EXPECTED RESULT: { size: ['l', 's', 'm'], color: ['red', 'green', 'blue'], sort: '-price' }
    let lastSelectedFilter = ""; // USED TO REMOVE THE NATURE OF select TAG WHERE EACH TIME IT IS CLICKED WOULD SEND AN AJAX CALL
    // TO THE FILTER OPTION ALREADY SELECTED

    renderProductsCard(products);

    async function requestFilteredProducts() {
      const { pathname } = window.location;

      // URLSearchParams CONVERTS THE OBJECT INTO A QUERYSTRING.
      // VERY LIMITED THOUGH BECAUSE IT DOES NOT WORK WITH RECURSIVE OBJECTS
      // (in this case, look for qs or querystring modules)

      const queryString = new URLSearchParams(selectedFields).toString();

      const res = await loadData(`${pathname}?${queryString}`);

      renderProductsCard(res);
    }

    // CENTRALIZED FUNCTION TO CHANGE selectedFields (kind of) GLOBAL STATE.

    async function changeSelectedFieldsState(filterObject, isChecked = null) {
      const [key, value] = Object.entries(filterObject)[0];

      if (key === "price" || key === "sort") {
        selectedFields[key] = filterObject[key];

        return await requestFilteredProducts();
      }

      // CHECKS IF THERE IS AN EXISTING KEY INSIDE selectedFields
      const hasKey = Object.keys(selectedFields).includes(key);

      if (isChecked) {
        hasKey
          ? selectedFields[key].push(value[0])
          : (selectedFields[key] = filterObject[key]);
      } else {
        selectedFields[key] = selectedFields[key].filter(
          (field) => field !== value[0]
        );
      }

      await requestFilteredProducts();
    }

    const filterProducts = async (evt, filterType) => {
      if (evt.target.classList.value.includes("checkbox-label")) {
        const isChecked = !evt.target.control.checked;
        const [query] = evt.target.control.id.split(`-${filterType}`);
        const filter = {};
        filter[filterType] = [query];

        changeSelectedFieldsState(filter, isChecked);
      }
    };

    sortOptions.addEventListener("click", async (evt) => {
      if (evt.target.value != lastSelectedFilter) {
        lastSelectedFilter = evt.target.value;

        await changeSelectedFieldsState({ sort: lastSelectedFilter });
      }
    });

    if (sexFilterOptions) {
      sexFilterOptions.addEventListener(
        "click",
        async (evt) => await filterProducts(evt, "sex")
      );
    }

    categoryFilterOptions.addEventListener(
      "click",
      async (evt) => await filterProducts(evt, "category")
    );

    sizeFilterOptions.addEventListener("click", async (evt) => {
      await filterProducts(evt, "size");
    });

    colorFilterOptions.addEventListener("click", async (evt) => {
      await filterProducts(evt, "color");
    });

    // REMIND TO IMPLEMENT AN ACCORDION IN FRONTEND
    priceFilter.addEventListener("click", async () => {
      const priceRange = productsPage.querySelector("#amount").value;
      const price = priceRange.replace(/\$/g, "");

      await changeSelectedFieldsState({ price });
    });
  })();
}

if (cartAndWishlistPage) {
  const { userId } = document.querySelector(".nav-cart").dataset;
  const updateCartButton = cartAndWishlistPage.querySelector(".update-cart");
  const couponForm = cartAndWishlistPage.querySelector(".coupon");
  const subtotalCart = cartAndWishlistPage.querySelector(".subtotal--cart");
  const totalCart = cartAndWishlistPage.querySelector(".total--cart");
  const updatedCartItems = [];
  let hasCoupon = false; // CHANGES STATE ON LINE 747
  let discountPercent; // CHANGES STATE ON LINE 748

  (async () => {
    const { data } = await loadData(`/users/${userId}/carts/`);

    renderProductsList(data.cart);

    subtotalCart.innerText = `$ ${data.value || 0}`;
    totalCart.innerText = `$ ${data.value || 0}`;

    const itemsContainer = cartAndWishlistPage.querySelectorAll(".cart_item");

    if (itemsContainer) {
      // EACH ITEM ADDED TO THE CART
      itemsContainer.forEach((item) => {
        const buttons = item.querySelectorAll('input[type="button"]');
        const totalPrice = item.querySelector(".amount--total");
        const removeItem = item.querySelector(".remove");

        updatedCartItems.push({ id: item.dataset.productId });

        // EACH BUTTON IN THE ITEM LIST
        buttons.forEach((button) => {
          button.addEventListener("click", (evt) => {
            const clickedButton = evt.target;
            let multiplier = Number(item.querySelector(".input-text").value);
            const maxValue = Number(item.querySelector(".input-text").max);
            const [, productValue] = item
              .querySelector(".amount--product")
              .innerText.split("$ ");

            if (clickedButton.value === "+") {
              if (multiplier !== maxValue) {
                multiplier++;
              }
            } else {
              if (multiplier !== 1) {
                multiplier--;
              }
            }

            totalPrice.innerText = `$ ${(productValue * multiplier).toFixed(
              2
            )}`;

            calculateTotalValue();
          });
        });

        removeItem.addEventListener("click", async () => {
          const { productId } = item.dataset;

          await deleteData(`/users/${userId}/carts/${productId}`);

          // REMOVES THE ITEM LIST FROM THE DOM
          item.parentElement.removeChild(item);

          // CALCULATES ALL THE ITEMS ADDED TO THE CART AFTER THERE WAS A REMOVAL
          calculateTotalValue();

          // UPDATED THE AMOUNT OF ITEMS IN THE CART ON NAVBAR
          const { data } = await loadData(`/users/${userId}/carts`);

          renderCartDropDown(data.cart);
        });
      });
    }
  })();

  const calculateTotalValue = () => {
    let total = 0;
    let subTotal = 0;
    const updatedItemsContainer =
      cartAndWishlistPage.querySelectorAll(".cart_item");

    updatedItemsContainer.forEach((item) => {
      const [, currentValue] = item
        .querySelector(".amount--total")
        .innerText.split("$ ");

      total += hasCoupon
        ? Number(currentValue) - Number(currentValue) * (discountPercent / 100)
        : Number(currentValue);

      subTotal += Number(currentValue);
    });

    subtotalCart.innerText = `$ ${subTotal.toFixed(2)}`;
    totalCart.innerText = `$ ${total.toFixed(2)}`;
  };

  updateCartButton.addEventListener("click", async () => {
    updateCartButton.innerText = "Updating...";
    let index;

    cartAndWishlistPage.querySelectorAll(".cart_item").forEach((item) => {
      const [{ value: size }, { value: color }] = item.querySelectorAll(
        ".select__product-list"
      );
      const quantity = item.querySelector(".qty").value;

      index = updatedCartItems
        .map((field) => field.id)
        .indexOf(item.dataset.productId);

      updatedCartItems[index] = {
        id: item.dataset.productId,
        size,
        color,
        quantity,
      };
    });

    await updateData(updatedCartItems, `/users/${userId}/carts`);

    updateCartButton.innerText = "Update Cart";
  });

  couponForm.addEventListener("submit", async (evt) => {
    evt.preventDefault();

    const couponCode = couponForm.querySelector("input").value;
    const { data } = await loadData(
      `/coupons/user/${userId}/code/${couponCode}`
    );

    if (data) {
      hasCoupon = true;
      discountPercent = data.discountPercent;

      const discountMarkup = `
        <tr class='discount'>
          <th>${couponCode}</th>
        <td>
          <span>- ${data.discountPercent} %</span>
        </td>
        </tr>
      `;

      document
        .querySelector(".order-total")
        .insertAdjacentHTML("beforebegin", discountMarkup);

      calculateTotalValue();

      couponForm.querySelector("input").disabled = true;
      couponForm.querySelector("button").disabled = true;
      couponForm.querySelector("button").style.cursor = "not-allowed";
    } else {
      couponForm.insertAdjacentHTML(
        "afterend",
        `<p>Please check if the provided coupon code is spelled correctly.</p>`
      );
    }

    couponForm.querySelector("input").value = "";
  });
}
