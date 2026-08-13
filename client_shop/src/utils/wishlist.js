const WISHLIST_KEY = "camera_shop_wishlist";

export const getWishlist = () => {
  try {
    const data = JSON.parse(localStorage.getItem(WISHLIST_KEY));

    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
};

export const saveWishlist = (items) => {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));

  window.dispatchEvent(
    new CustomEvent("wishlistUpdated", {
      detail: {
        count: items.length,
      },
    }),
  );
};

export const isInWishlist = (productId) => {
  return getWishlist().some((item) => String(item._id) === String(productId));
};

export const addToWishlist = (product) => {
  const items = getWishlist();

  const exists = items.some((item) => String(item._id) === String(product._id));

  if (exists) {
    return items;
  }

  const productData = {
    _id: product._id,

    name: product.name,

    price: product.price,

    img1: product.img1,

    description: product.description,

    category: product.category,
  };

  const updated = [productData, ...items];

  saveWishlist(updated);

  return updated;
};

export const removeFromWishlist = (productId) => {
  const items = getWishlist();

  const updated = items.filter(
    (item) => String(item._id) !== String(productId),
  );

  saveWishlist(updated);

  return updated;
};

export const toggleWishlist = (product) => {
  const favorite = isInWishlist(product._id);

  if (favorite) {
    const items = removeFromWishlist(product._id);

    return {
      added: false,
      items,
    };
  }

  const items = addToWishlist(product);

  return {
    added: true,
    items,
  };
};
