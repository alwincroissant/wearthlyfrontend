import {
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAIL,
  CREATE_ORDER_RESET,
  MY_ORDERS_REQUEST,
  MY_ORDERS_SUCCESS,
  MY_ORDERS_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
  ADMIN_ORDERS_REQUEST,
  ADMIN_ORDERS_SUCCESS,
  ADMIN_ORDERS_FAIL,
  UPDATE_ORDER_STATUS_REQUEST,
  UPDATE_ORDER_STATUS_SUCCESS,
  UPDATE_ORDER_STATUS_FAIL,
  UPDATE_ORDER_STATUS_RESET,
  CLEAR_ERRORS,
} from '../constants/orderConstants'

// ── Checkout / Create Order reducer ──────────────────────────────────────────
export const checkoutReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATE_ORDER_REQUEST:
      return { loading: true }
    case CREATE_ORDER_SUCCESS:
      return { loading: false, success: true, results: action.payload }
    case CREATE_ORDER_FAIL:
      return { loading: false, error: action.payload }
    case CREATE_ORDER_RESET:
      return {}
    case CLEAR_ERRORS:
      return { ...state, error: null }
    default:
      return state
  }
}

// ── My Orders (customer history) ─────────────────────────────────────────────
export const myOrdersReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case MY_ORDERS_REQUEST:
      return { ...state, loading: true }
    case MY_ORDERS_SUCCESS:
      return {
        loading: false,
        orders: action.payload.orders,
      }
    case MY_ORDERS_FAIL:
      return { ...state, loading: false, error: action.payload }
    case CLEAR_ERRORS:
      return { ...state, error: null }
    default:
      return state
  }
}

// ── Order Details ─────────────────────────────────────────────────────────────
export const orderDetailsReducer = (state = { order: null }, action) => {
  switch (action.type) {
    case ORDER_DETAILS_REQUEST:
      return { loading: true, order: null }
    case ORDER_DETAILS_SUCCESS:
      return { loading: false, order: action.payload }
    case ORDER_DETAILS_FAIL:
      return { loading: false, error: action.payload, order: null }
    case CLEAR_ERRORS:
      return { ...state, error: null }
    default:
      return state
  }
}

// ── Admin: All Orders ─────────────────────────────────────────────────────────
export const adminOrdersReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case ADMIN_ORDERS_REQUEST:
      return { ...state, loading: true }
    case ADMIN_ORDERS_SUCCESS:
      return { loading: false, orders: action.payload }
    case ADMIN_ORDERS_FAIL:
      return { ...state, loading: false, error: action.payload }
    case CLEAR_ERRORS:
      return { ...state, error: null }
    default:
      return state
  }
}

// ── Admin: Update Order Status ────────────────────────────────────────────────
export const updateOrderStatusReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_ORDER_STATUS_REQUEST:
      return { loading: true }
    case UPDATE_ORDER_STATUS_SUCCESS:
      return { loading: false, success: true, order: action.payload }
    case UPDATE_ORDER_STATUS_FAIL:
      return { loading: false, error: action.payload }
    case UPDATE_ORDER_STATUS_RESET:
      return {}
    default:
      return state
  }
}
