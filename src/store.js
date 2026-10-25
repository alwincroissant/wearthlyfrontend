import { createStore, applyMiddleware, combineReducers } from "redux";
import { thunk } from "redux-thunk";
import { authReducer } from "./reducers/userReducers";
import { profileReducer } from "./reducers/profileReducer";
import {
  productsReducer,
  newProductReducer,
  productReducer,
  productDetailsReducer,
  catalogReducer,
} from "./reducers/productReducers";
import {
  productReviewsReducer,
  myReviewReducer,
  newReviewReducer,
  deleteMyReviewReducer,
  adminReviewsReducer,
  reviewModerationReducer,
} from "./reducers/reviewReducers";
import { cartReducer } from "./reducers/cartReducers";
import {
  checkoutReducer,
  myOrdersReducer,
  orderDetailsReducer,
  adminOrdersReducer,
  updateOrderStatusReducer,
} from "./reducers/orderReducers";

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  // Product reducers — Reference: itcp318-s3a-2026/frontend/src/store.js
  products: productsReducer,
  newProduct: newProductReducer,
  product: productReducer,
  productDetails: productDetailsReducer,
  catalog: catalogReducer,
  // Reviews
  productReviews: productReviewsReducer,
  myReview: myReviewReducer,
  newReview: newReviewReducer,
  deleteMyReview: deleteMyReviewReducer,
  adminReviews: adminReviewsReducer,
  reviewModeration: reviewModerationReducer,
  // Cart
  cart: cartReducer,
  // Order / checkout
  checkout: checkoutReducer,
  myOrders: myOrdersReducer,
  orderDetails: orderDetailsReducer,
  // Admin order management
  adminOrders: adminOrdersReducer,
  updateOrderStatus: updateOrderStatusReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
