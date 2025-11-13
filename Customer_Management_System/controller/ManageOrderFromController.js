import { add_to_cart, remove_from_cart, clear_cart, place_order, get_orders, get_current_order } from "../model/OrderModel.js";
import { get_customers } from "../model/CustomerModel.js";
import { get_items } from "../model/ItemModel.js";

class ManageOrderFromController {
    constructor() {
        this.initializeOrderEvents();
    }

    initializeOrderEvents() {
        $('#add-to-cart').on('click', () => this.handleAddToCart());
        $('#clear-cart-btn').on('click', () => this.handleClearCart());
        $('#place-order-btn').on('click', () => this.handlePlaceOrder());
        $(document).on('click', '.remove-from-cart', (e) => this.handleRemoveFromCart(e));
    }

    // ==================== Load Order Form =======================
    load_order_form() {

        let customerSelect = $('#order-customer');
        customerSelect.empty().append('<option value="">Choose a customer...</option>');

        let customer_list = get_customers();
        customer_list.forEach(customer => {
            customerSelect.append(`<option value="${customer.id}">${customer.name}</option>`);
        });

        let itemSelect = $('#order-item');
        itemSelect.empty().append('<option value="">Choose an item...</option>');

        let item_list = get_items();
        item_list.forEach(item => {
            if (item.quantity > 0) {
                itemSelect.append(`<option value="${item.code}">${item.name} (Stock: ${item.quantity})</option>`);
            }
        });

        // Set order ID
        let currentOrder = get_current_order();
        $('#order-id').val(currentOrder.id);
    }

    // ==================== Load Cart =======================
    load_cart() {
        let cartList = $('#cart-items-list');
        let currentOrder = get_current_order();
        let items = currentOrder.items;

        if (items.length === 0) {
            cartList.html('<div class="text-muted text-center py-3">No items in cart</div>');
            $('#place-order-btn').prop('disabled', true);
            this.update_order_totals();
            return;
        }

        let cartHTML = '';
        items.forEach(item => {
            cartHTML += `
                <div class="cart-item">
                    <div class="row">
                        <div class="col-6">
                            <strong>${item.name}</strong><br>
                            <small class="text-muted">Code: ${item.code}</small>
                        </div>
                        <div class="col-2">LKR ${item.price.toFixed(2)}</div>
                        <div class="col-2">Qty: ${item.quantity}</div>
                        <div class="col-2">
                            <button class="btn btn-sm btn-danger remove-from-cart" data-code="${item.code}">Remove</button>
                        </div>
                    </div>
                </div>
            `;
        });

        cartList.html(cartHTML);
        $('#place-order-btn').prop('disabled', false);
        this.update_order_totals();
    }

    // ==================== Add to Cart =======================
    handleAddToCart() {
        let itemCode = $("#order-item").val();
        let quantity = parseInt($("#order-quantity").val());

        if (!itemCode) {
            this.showAlert('Please select an item!', 'error');
            return;
        }

        if (!quantity || quantity < 1) {
            this.showAlert('Please enter a valid quantity!', 'error');
            return;
        }

        try {
            add_to_cart(itemCode, quantity);
            this.load_cart();
            this.load_order_form(); // Refresh stock information
            $("#order-quantity").val(1);
            this.showAlert('Item added to cart!', 'success');
        } catch (error) {
            this.showAlert(error.message, 'error');
        }
    }

    // ==================== Remove from Cart =======================
    handleRemoveFromCart(e) {
        let itemCode = $(e.target).data('code');
        remove_from_cart(itemCode);
        this.load_cart();
        this.load_order_form(); // Refresh stock information
        this.showAlert('Item removed from cart!', 'info');
    }

    // ==================== Clear Cart =======================
    handleClearCart() {
        clear_cart();
        this.load_cart();
        this.showAlert('Cart cleared!', 'info');
    }

    // ==================== Place Order =======================
    handlePlaceOrder() {
        let customerId = $("#order-customer").val();

        if (!customerId) {
            this.showAlert('Please select a customer!', 'error');
            return;
        }

        try {
            let order = place_order(customerId);
            this.load_cart();
            this.load_order_form();

            // Refresh items table
            if (window.manageItemController) {
                window.manageItemController.load_items_tbl();
            }

            this.showAlert(`Order ${order.id} placed successfully! Total: LKR ${order.total.toFixed(2)}`, 'success');
        } catch (error) {
            this.showAlert(error.message, 'error');
        }
    }

    // ==================== Load Order History =======================
    load_orders_tbl() {
        $('#orders-tbl-body').empty();

        let order_list = get_orders();

        if (order_list.length === 0) {
            $('#orders-tbl-body').append('<tr><td colspan="6" class="text-center text-muted">No orders found</td></tr>');
            return;
        }

        order_list.map((order) => {
            let itemsHTML = order.items.map(item =>
                `<span class="badge bg-secondary order-item-badge">${item.name} (${item.quantity})</span>`
            ).join('');

            let tbl_row = `<tr>
                <td>${order.id}</td>
                <td>${order.customerName}</td>
                <td>${itemsHTML}</td>
                <td>LKR ${order.total.toFixed(2)}</td>
                <td>${new Date(order.date).toLocaleString()}</td>
                <td>
                    <button class="btn btn-sm btn-info view-order" data-id="${order.id}">View</button>
                </td>
            </tr>`;
            $("#orders-tbl-body").append(tbl_row);
        });
    }

    update_order_totals() {
        let currentOrder = get_current_order();
        let total = currentOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        $("#order-subtotal").text(`LKR ${total.toFixed(2)}`);
        $("#order-total").text(`LKR ${total.toFixed(2)}`);
    }

    showAlert(message, type = 'info') {
        // Remove existing alerts
        $('.alert').remove();

        const alertClass = type === 'error' ? 'alert-danger' :
            type === 'success' ? 'alert-success' : 'alert-info';

        const alertHTML = `
            <div class="alert ${alertClass} alert-dismissible fade show" role="alert" style="position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px;">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;

        $('body').append(alertHTML);

        setTimeout(() => {
            $('.alert').alert('close');
        }, 3000);
    }
}

export default ManageOrderFromController;