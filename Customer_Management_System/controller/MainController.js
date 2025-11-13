import ManageCustomerFromController from "./ManageCustomerFromController.js";
import ManageItemFromController from "./ManageItemFromController.js";
import ManageOrderFromController from "./ManageOrderFromController.js";

class MainController {
    constructor() {
        this.initializeControllers();
        this.initializeTabEvents();
    }

    initializeControllers() {
        // Initialize all controllers
        window.manageCustomerController = new ManageCustomerFromController();
        window.manageItemController = new ManageItemFromController();
        window.manageOrderController = new ManageOrderFromController();
    }

    initializeTabEvents() {
        $('a[data-bs-toggle="tab"]').on('shown.bs.tab', (e) => this.handleTabChange(e));
    }

    handleTabChange(e) {
        let target = $(e.target).attr('href');

        switch (target) {
            case '#customers':
                if (window.manageCustomerController) {
                    window.manageCustomerController.load_customers_tbl();
                }
                break;
            case '#items':
                if (window.manageItemController) {
                    window.manageItemController.load_items_tbl();
                }
                break;
            case '#orders':
                if (window.manageOrderController) {
                    window.manageOrderController.load_order_form();
                    window.manageOrderController.load_cart();
                }
                break;
            case '#history':
                if (window.manageOrderController) {
                    window.manageOrderController.load_orders_tbl();
                }
                break;
        }
    }

    initializeApplication() {
        // Load initial data for all tabs
        if (window.manageCustomerController) {
            window.manageCustomerController.load_customers_tbl();
        }
        if (window.manageItemController) {
            window.manageItemController.load_items_tbl();
        }
        if (window.manageOrderController) {
            window.manageOrderController.load_order_form();
            window.manageOrderController.load_cart();
            window.manageOrderController.load_orders_tbl();
        }
    }
}

// Initialize Main Controller
$(document).ready(function() {
    window.mainController = new MainController();
});

export default MainController;