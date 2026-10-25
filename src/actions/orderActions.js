import axios from 'axios'
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

const api = import.meta.env.VITE_API

const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || 'Something went wrong'

// Submit checkout — creates orders and/or installment applications
// checkoutPayload: { checkoutSessionId, items, shippingInfo, paymentMethod }
export const submitCheckout = (checkoutPayload) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_ORDER_REQUEST })
    const { data } = await axios.post(`${api}/checkout`, checkoutPayload, {
      withCredentials: true,
    })
    dispatch({ type: CREATE_ORDER_SUCCESS, payload: data.data || data })
  } catch (error) {
    dispatch({
      type: CREATE_ORDER_FAIL,
      payload: getErrorMessage(error),
    })
  }
}

export const resetCheckout = () => (dispatch) => {
  dispatch({ type: CREATE_ORDER_RESET })
}

// Get current user's orders and applications
export const getMyOrders = () => async (dispatch) => {
  try {
    dispatch({ type: MY_ORDERS_REQUEST })
    const { data } = await axios.get(`${api}/orders/me`, {
      withCredentials: true,
    })
    dispatch({
      type: MY_ORDERS_SUCCESS,
      payload: {
        orders: data.orders || data.data?.orders || [],
      },
    })
  } catch (error) {
    dispatch({ type: MY_ORDERS_FAIL, payload: getErrorMessage(error) })
  }
}

// Get single order details
export const getOrderDetails = (orderId) => async (dispatch) => {
  try {
    dispatch({ type: ORDER_DETAILS_REQUEST })
    const { data } = await axios.get(`${api}/order/${orderId}`, {
      withCredentials: true,
    })
    dispatch({
      type: ORDER_DETAILS_SUCCESS,
      payload: data.order || data.data?.order,
    })
  } catch (error) {
    dispatch({ type: ORDER_DETAILS_FAIL, payload: getErrorMessage(error) })
  }
}

// Get single installment application details
// ── Admin actions ─────────────────────────────────────────────────────────────

export const getAdminOrders = () => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_ORDERS_REQUEST })
    const { data } = await axios.get(`${api}/admin/orders`, {
      withCredentials: true,
    })
    dispatch({
      type: ADMIN_ORDERS_SUCCESS,
      payload: data.orders || data.data?.orders || [],
    })
  } catch (error) {
    dispatch({ type: ADMIN_ORDERS_FAIL, payload: getErrorMessage(error) })
  }
}

export const updateOrderStatus = (orderId, statusData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_ORDER_STATUS_REQUEST })
    const { data } = await axios.put(
      `${api}/admin/order/${orderId}/status`,
      statusData,
      { withCredentials: true }
    )
    const order = data.order || data.data?.order
    dispatch({ type: UPDATE_ORDER_STATUS_SUCCESS, payload: order })
    return { success: true, order }
  } catch (error) {
    const message = getErrorMessage(error)
    dispatch({ type: UPDATE_ORDER_STATUS_FAIL, payload: message })
    return { success: false, message }
  }
}

export const resetUpdateOrderStatus = () => (dispatch) => {
  dispatch({ type: UPDATE_ORDER_STATUS_RESET })
}

export const clearOrderErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS })
}

export const cancelOrder = (orderId) => async (dispatch) => {
  try {
    const { data } = await axios.put(
      `${api}/order/${orderId}/cancel`,
      {},
      { withCredentials: true }
    );
    dispatch(getMyOrders());
    return { success: true, data };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
};
