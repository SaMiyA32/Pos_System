import { add_item, update_item, delete_item, get_items, get_item_details } from "../model/ItemModel.js";

class ManageItemFromController {
    constructor() {
        this.initializeItemEvents();
    }

    initializeItemEvents() {
        $('#item-form').on('submit', (e) => this.handleItemSubmit(e));
        $('#item-cancel-btn').on('click', () => this.resetItemForm());
        $(document).on('click', '.edit-item', (e) => this.handleEditItem(e));
        $(document).on('click', '.delete-item', (e) => this.handleDeleteItem(e));
    }

    // ==================== Load Items =======================
    load_items_tbl() {
        $('#items-tbl-body').empty();

        let item_list = get_items();

        if (item_list.length === 0) {
            $('#items-tbl-body').append('<tr><td colspan="5" class="text-center text-muted">No items found</td></tr>');
            return;
        }

        item_list.map((obj) => {
            let tbl_row = `<tr>
                <td>${obj.code}</td>
                <td>${obj.name}</td>
                <td>LKR ${obj.price.toFixed(2)}</td>
                <td>${obj.quantity}</td>
                <td class="action-buttons">
                    <button class="btn btn-sm btn-warning edit-item" data-code="${obj.code}">Edit</button>
                    <button class="btn btn-sm btn-danger delete-item" data-code="${obj.code}">Delete</button>
                </td>
            </tr>`;
            $("#items-tbl-body").append(tbl_row);
        });
    }

    // ==================== Add/Update Item =======================
    handleItemSubmit(e) {
        e.preventDefault();

        let code = $("#item-code").val();
        let name = $("#item-name").val();
        let price = parseFloat($("#item-price").val());
        let quantity = parseInt($("#item-quantity").val());

        if ($("#item-code-edit").val()) {
            // Update existing item
            update_item(code, name, price, quantity);
            this.showAlert('Item updated successfully!', 'success');
        } else {
            // Add new item
            if (get_item_details(code)) {
                this.showAlert('Item code already exists!', 'error');
                return;
            }
            add_item(code, name, price, quantity);
            this.showAlert('Item added successfully!', 'success');
        }

        this.resetItemForm();
        this.load_items_tbl();

        // Refresh order form dropdown
        if (window.manageOrderController) {
            window.manageOrderController.load_order_form();
        }
    }

    // ==================== Edit Item =======================
    handleEditItem(e) {
        let itemCode = $(e.target).data('code');
        let item_obj = get_item_details(itemCode);

        if (item_obj) {
            $("#item-code-edit").val(item_obj.code);
            $("#item-code").val(item_obj.code);
            $("#item-name").val(item_obj.name);
            $("#item-price").val(item_obj.price);
            $("#item-quantity").val(item_obj.quantity);
            $("#item-form-title").text('Edit Item');
            $("#item-submit-btn").text('Update Item');
            $("#item-cancel-btn").show();
            $("#item-code").prop('readonly', true);
        }
    }

    // ==================== Delete Item =======================
    handleDeleteItem(e) {
        let itemCode = $(e.target).data('code');
        let item_obj = get_item_details(itemCode);

        if (item_obj && confirm(`Are you sure you want to delete item: ${item_obj.name}?`)) {
            delete_item(itemCode);
            this.load_items_tbl();

            // Refresh order form dropdown
            if (window.manageOrderController) {
                window.manageOrderController.load_order_form();
            }

            this.showAlert('Item deleted successfully!', 'success');
        }
    }

    resetItemForm() {
        $('#item-form')[0].reset();
        $('#item-code-edit').val('');
        $('#item-form-title').text('Add New Item');
        $('#item-submit-btn').text('Add Item');
        $('#item-cancel-btn').hide();
        $('#item-code').prop('readonly', false);
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

export default ManageItemFromController;