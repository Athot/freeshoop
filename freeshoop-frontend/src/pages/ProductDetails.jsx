import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Pencil, Trash2 } from "lucide-react";
import {
  addedToCart,
  addReview,
  getAllReview,
  IMAGE_BASE_URL,
} from "../api/api";

const ProductDetails = () => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const product = location.state?.product;
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [helpfulReviews, setHelpfulReviews] = useState([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const handleHelpful = (reviewId) => {
    setHelpfulReviews((prev) =>
      prev.includes(reviewId)
        ? prev.filter((id) => id != reviewId)
        : [...prev, reviewId],
    );
  };

  useEffect(() => {
    fetchReview();
  }, []);
  const fetchReview = async () => {
    const res = await getAllReview(token, product.id);
    if (res) {
      setReviews(res);
    }
  };

  const averageRatings =
    reviews.length > 0
      ? reviews.reduce((total, review) => total + review.rating, 0) /
        reviews.length
      : 0;

  // button to submit the review
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (selectedRating === 0) {
      alert("Please select a star rating.");
      return;
    }

    if (!reviewComment.trim()) {
      alert("Please write your review.");
      return;
    }

    const newReview = {
      productId: product.id,
      rating: selectedRating,
      comment: reviewComment.trim(),
    };
    const res = await addReview(token, newReview);
    if (res) {
      alert("Your review has been submitted successfully!");
      setReviews((prev) => [newReview, ...prev]);

      setSelectedRating(0);
      setHoverRating(0);
      setReviewComment("");
    }
  };

  const totalReviews = reviews.length;
  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8faf4] px-4">
        <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
        <Link
          to="/products"
          className="mt-5 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  const productImages = product?.images?.length
    ? product.images
    : product?.images
      ? [product.images]
      : [];

  const [selectedImage, setSelectedImage] = useState(0);

  const description =
    product.description ||
    `Enjoy fresh, delicious ${product.label.toLowerCase()}, carefully selected for quality and taste. Perfect for everyday meals and a healthy lifestyle.`;

  const handleAddToCart = async () => {
    try {
      const cartData = {
        userId: userId,
        productId: product.id,
        quantity: quantity,
      };
      const res = await addedToCart(token, cartData);

      if (res) {
        setAdded(true);
        alert("Item added successful");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf4]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/products"
            className="text-2xl font-extrabold tracking-tight text-gray-900"
          >
            Fruits<span className="text-green-600">.</span>
          </Link>

          <Link
            to="/cart"
            className="rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            🛒 View Cart
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        {/* Breadcrumb */}
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link to="/products" className="hover:text-green-700">
            Home
          </Link>
          <span>/</span>
          <span>{product.categoryName}</span>
          <span>/</span>
          <span className="font-medium text-gray-900">{product.brand}</span>
        </nav>

        {/* Product information */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Product image */}

          {/* Product image gallery */}
          <section className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
            <div className="grid grid-cols-[64px_minmax(0,1fr)] gap-3 sm:grid-cols-[80px_minmax(0,1fr)] sm:gap-4">
              {/* Thumbnail images */}
              <div className="flex flex-col gap-3">
                {productImages.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    aria-label={`View product image ${index + 1}`}
                    aria-pressed={selectedImage === index}
                    className={`aspect-square overflow-hidden rounded-xl border-2 bg-gray-50 transition ${
                      selectedImage === index
                        ? "border-green-600 ring-2 ring-green-100"
                        : "border-transparent hover:border-green-300"
                    }`}
                  >
                    <img
                      src={`${IMAGE_BASE_URL}${image}`}
                      alt={`${product.label} view ${index + 1}`}
                      className="h-full w-full object-contain p-1"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>

              {/* Main image */}
              <div className="flex min-h-75 items-center justify-center overflow-hidden rounded-2xl bg-[#f8faf4] sm:min-h-[460px]">
                <img
                  key={productImages[selectedImage]}
                  src={`${IMAGE_BASE_URL}${productImages[selectedImage]}`}
                  alt={product.label}
                  className="h-full max-h-115 w-full object-contain p-4 transition duration-300 sm:p-8"
                />
              </div>
            </div>

            {/* Product badges */}
            <div className="mt-5 flex flex-wrap gap-3">
              <span className="rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
                🌿 Fresh Produce
              </span>

              {/* {product.badge && (
                <span className="rounded-full bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700">
                  ⭐ {product.badge}
                </span>
              )} */}
            </div>
          </section>

          {/* Product details */}
          <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-9">
            <p className="text-sm font-semibold uppercase tracking-widest text-green-600">
              {product.category}
            </p>

            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {product.brand}
            </h1>

            {/* product ratings */}
            <div className="mt-4 flex flew-wrap items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-lg ${
                      star <= Math.round(averageRatings)
                        ? "text-amber-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-green-700">
                ₹{Number(product.price).toFixed(2)}
              </span>
              {/* <span className="text-gray-500">/ {product.unit}</span> */}
            </div>

            <p className="mt-6 leading-7 text-gray-600">{description}</p>

            {/* Benefits */}
            <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-green-50 p-3 text-center">
                <div className="text-2xl">🌱</div>
                <p className="mt-2 text-sm font-semibold text-gray-800">
                  Fresh Produce
                </p>
              </div>

              <div className="rounded-xl bg-green-50 p-3 text-center">
                <div className="text-2xl">🚚</div>
                <p className="mt-2 text-sm font-semibold text-gray-800">
                  Home Delivery
                </p>
              </div>

              <div className="rounded-xl bg-green-50 p-3 text-center">
                <div className="text-2xl">💚</div>
                <p className="mt-2 text-sm font-semibold text-gray-800">
                  Quality Picks
                </p>
              </div>
            </div>

            {/* Quantity selector */}
            <div className="mt-8">
              <label className="mb-3 block text-sm font-semibold text-gray-800">
                Select Quantity
              </label>

              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-xl border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    className="px-4 py-3 text-lg text-gray-700 hover:text-green-700 disabled:opacity-40"
                  >
                    −
                  </button>

                  <span className="min-w-10 text-center font-semibold">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                    disabled={quantity >= 99}
                    aria-label="Increase quantity"
                    className="px-4 py-3 text-lg text-gray-700 hover:text-green-700 disabled:opacity-40"
                  >
                    +
                  </button>
                </div>

                <p className="text-sm text-gray-500">
                  Total:{" "}
                  <span className="font-bold text-gray-900">
                    ₹{(Number(product.price) * quantity).toFixed(2)}
                  </span>
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 rounded-xl bg-green-600 px-5 py-4 font-bold text-white transition hover:bg-green-700"
              >
                {added ? "✓ Added to Cart" : "🛒 Add to Cart"}
              </button>

              <Link
                to="/cart"
                className="flex-1 rounded-xl border border-green-600 px-5 py-4 text-center font-bold text-green-700 transition hover:bg-green-50"
              >
                Go to Cart
              </Link>
            </div>

            {added && (
              <p className="mt-4 text-sm font-medium text-green-700">
                {quantity} {quantity === 1 ? "item" : "items"} added to your
                cart successfully!
              </p>
            )}

            <div className="mt-7 border-t border-gray-100 pt-5 text-sm leading-7 text-gray-500">
              <p>✓ Carefully selected products</p>
              <p>✓ Convenient online shopping</p>
              <p>✓ Simple and secure checkout experience</p>
            </div>
          </section>
        </div>

        {/* Description section */}
        <section className="mt-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold text-gray-900">
            About {product.name}
          </h2>
          <p className="mt-3 max-w-3xl leading-7 text-gray-600">
            {description} Explore more products in our{" "}
            <Link
              to="/products"
              className="font-semibold text-green-700 hover:underline"
            >
              fresh collection
            </Link>{" "}
            and find something you love.
          </p>
        </section>

        {/* customer review sections */}
        <section
          className="
        mt-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Customer Reviews
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                See what customers are saying about this product
              </p>
            </div>

            <span
              className="rounded-full bg-green-50
          px-4 py-2 text-sm font-semibold text-green-700"
            >
              {totalReviews} reviews
            </span>
          </div>

          {/* review list */}
          <div className="space-y-5">
            {reviews?.map((review) => (
              <div
                key={review.id}
                className="border-b border-gray-100 pb-5 last:border-0 last:pb-0"
              >
                {/* Customer information */}
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center
          rounded-full bg-green-100 font-bold text-green-700"
                  >
                    {review.userName
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>

                  <h3 className="font-semibold text-gray-900">
                    {review.userName}
                  </h3>
                </div>

                {/* Rating and comment heading */}
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-xl ${
                          star <= review.rating
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  <span className="font-semibold text-gray-900">
                    {review.rating === 5
                      ? "Excellent product."
                      : review.rating === 4
                        ? "Very good product."
                        : review.rating === 3
                          ? "Good product."
                          : review.rating === 2
                            ? "Below expectations."
                            : "Poor product."}
                  </span>
                </div>

                {/* Review date */}
                <p className="text-sm text-gray-500">
                  Reviewed on{" "}
                  {new Date(review.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>

                {/* Customer comment */}
                <p className="mt-2 text-sm leading-6 text-gray-700">
                  {review.comment}
                </p>

                {/* Edit and Delete buttons */}
                {/* Only show these to the review owner */}
                {/* {
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      // onClick={() => handleEditReview(review)}
                      className="rounded-lg p-2 text-blue-600 transition
            hover:bg-blue-50"
                      title="Edit review"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      type="button"
                      // onClick={() => handleDeleteReview(review.id)}
                      className="rounded-lg p-2 text-red-600 transition
            hover:bg-red-50"
                      title="Delete review"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                } */}
                {/* Helpful button */}
                {/* for future changes */}
                {/* <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => handleHelpful(review.id)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                      helpfulReviews.includes(review.id)
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-50 text-gray-500 hover:bg-green-50 hover:text-green-700"
                    }`}
                  >
                    👍 Helpful {helpfulReviews.includes(review.id) ? "1" : "0"}
                  </button>
                </div> */}
              </div>
            ))}
          </div>
        </section>

        {/* Write a Review Section */}
        <section className="mt-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Write a Review</h2>
            <p className="mt-1 text-sm text-gray-500">
              Share your experience with this product.
            </p>
          </div>

          <form onSubmit={handleSubmitReview}>
            {/* Star Selection */}
            <div className="mb-6">
              <label className="mb-3 block text-sm font-semibold text-gray-800">
                Your Rating
              </label>

              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSelectedRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className={`text-3xl transition hover:scale-110 ${
                      star <= (hoverRating || selectedRating)
                        ? "text-amber-400"
                        : "text-gray-300"
                    }`}
                    aria-label={`Rate ${star} out of 5 stars`}
                  >
                    ★
                  </button>
                ))}

                <span className="ml-2 text-sm text-gray-500">
                  {selectedRating > 0
                    ? `${selectedRating} out of 5`
                    : "Select your rating"}
                </span>
              </div>
            </div>

            {/* Review Comment */}
            <div className="mb-6">
              <label
                htmlFor="reviewComment"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                Your Review
              </label>

              <textarea
                id="reviewComment"
                rows="5"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Tell us about the product quality, freshness and your experience..."
                maxLength={500}
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
              />

              <p className="mt-2 text-right text-xs text-gray-400">
                {reviewComment.length}/500 characters
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="rounded-xl bg-green-600 px-7 py-3.5 font-semibold text-white transition hover:bg-green-700"
            >
              Submit Review
            </button>
          </form>
        </section>
      </main>

      <footer className="mt-8 border-t border-gray-100 bg-white px-4 py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Fruits. Freshness delivered with care.
      </footer>
    </div>
  );
};

export default ProductDetails;
