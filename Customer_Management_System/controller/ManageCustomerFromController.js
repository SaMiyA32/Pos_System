import { add_customer, update_customer, delete_customer, get_customers, get_customer_details } from "../model/CustomerModel.js";

class ManageCustomerFromController {
    constructor() {
        this.initializeCustomerEvents();
    }

    initializeCustomerEvents() {
        $('#customer-form').on('submit', (e) => this.handleCustomerSubmit(e));
        $('#customer-cancel-btn').on('click', () => this.resetCustomerForm());
        $(document).on('click', '.edit-customer', (e) => this.handleEditCustomer(e));
        $(document).on('click', '.delete-customer', (e) => this.handleDeleteCustomer(e));
    }

    // ==================== Load Customers =======================
    load_customers_tbl() {
        $('#customers-tbl-body').empty();

        let customer_list = get_customers();

        if (customer_list.length === 0) {
            $('#customers-tbl-body').append('<tr><td colspan="5" class="text-center text-muted">No customers found</td></tr>');
            return;
        }

        customer_list.map((obj) => {
            let tbl_row = `<tr>
                <td>${obj.id}</td>
                <td>${obj.name}</td>
                <td>${obj.contact}</td>
                <td>${obj.address}</td>
                <td class="action-buttons">
                    <button class="btn btn-sm btn-warning edit-customer" data-id="${obj.id}">Edit</button>
                    <button class="btn btn-sm btn-danger delete-customer" data-id="${obj.id}">Delete</button>
                </td>
            </tr>`;
            $("#customers-tbl-body").append(tbl_row);
        });
    }

    // ==================== Add/Update Customer =======================
    handleCustomerSubmit(e) {
        e.preventDefault();

        let id = $("#customer-id").val();
        let name = $("#customer-name").val();
        let contact = $("#customer-contact").val();
        let address = $("#customer-address").val();

        if (id) {
            // Update existing customer
            update_customer(parseInt(id), name, contact, address);
            this.showAlert('Customer updated successfully!', 'success');
        } else {
            // Add new customer
            add_customer(name, contact, address);
            this.showAlert('Customer added successfully!', 'success');
        }

        this.resetCustomerForm();
        this.load_customers_tbl();

        // Refresh order form dropdown
        if (window.manageOrderController) {
            window.manageOrderController.load_order_form();
        }
    }

    // ==================== Edit Customer =======================
    handleEditCustomer(e) {
        let customerId = $(e.target).data('id');
        let customer_obj = get_customer_details(customerId);

        if (customer_obj) {
            $("#customer-id").val(customer_obj.id);
            $("#customer-name").val(customer_obj.name);
            $("#customer-contact").val(customer_obj.contact);
            $("#customer-address").val(customer_obj.address);
            $("#customer-form-title").text('Edit Customer');
            $("#customer-submit-btn").text('Update Customer');
            $("#customer-cancel-btn").show();
        }
    }

    // ==================== Delete Customer =======================
    handleDeleteCustomer(e) {
        let customerId = $(e.target).data('id');
        let customer_obj = get_customer_details(customerId);

        if (customer_obj && confirm(`Are you sure you want to delete customer: ${customer_obj.name}?`)) {
            delete_customer(customerId);
            this.load_customers_tbl();

            // Refresh order form dropdown
            if (window.manageOrderController) {
                window.manageOrderController.load_order_form();
            }

            this.showAlert('Customer deleted successfully!', 'success');
        }
    }

    resetCustomerForm() {
        $('#customer-form')[0].reset();
        $('#customer-id').val('');
        $('#customer-form-title').text('Add New Customer');
        $('#customer-submit-btn').text('Add Customer');
        $('#customer-cancel-btn').hide();
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

export default ManageCustomerFromController;