// Create a global namespace for our application
(function(global) {
    'use strict';

    const DEFAULT_VALUE = "default value";

    // Initialize the global object if it doesn't exist
    global.AppState = {
        serviceID: localStorage.getItem("serviceID") || DEFAULT_VALUE,
        businessName: localStorage.getItem("businessName") || DEFAULT_VALUE,
        businessEmail: localStorage.getItem("businessEmail") || DEFAULT_VALUE,
        signInEmail: localStorage.getItem("signInEmail") || DEFAULT_VALUE,
        provider: localStorage.getItem("provider") || DEFAULT_VALUE,

        // Update functions
        updateServID: function(input) {
            this.serviceID = input;
            localStorage.setItem("serviceID", input);
        },

        updateUserEmail: function(input) {
            this.signInEmail = input;
            localStorage.setItem("signInEmail", input);
        },

        updateProvider: function(input) {
            this.provider = input;
            localStorage.setItem("provider", input);
        },

        updateBusinessName: function(input) {
            this.businessName = input;
            localStorage.setItem("businessName", input);
        },

        updateBusinessEmail: function(input) {
            this.businessEmail = input;
            localStorage.setItem("businessEmail", input);
        }
    };

    // Expose variables directly on window
    global.serviceID = global.AppState.serviceID;
    global.businessName = global.AppState.businessName;
    global.businessEmail = global.AppState.businessEmail;
    global.signInEmail = global.AppState.signInEmail;
    global.provider = global.AppState.provider;

    // Expose update functions directly on window
    global.updateServID = function(input) {
        global.AppState.updateServID(input);
        global.serviceID = input;
    };

    global.updateUserEmail = function(input) {
        global.AppState.updateUserEmail(input);
        global.signInEmail = input;
    };

    global.updateProvider = function(input) {
        global.AppState.updateProvider(input);
        global.provider = input;
    };

    global.updateBusinessName = function(input) {
        global.AppState.updateBusinessName(input);
        global.businessName = input;
    };

    global.updateBusinessEmail = function(input) {
        global.AppState.updateBusinessEmail(input);
        global.businessEmail = input;
    };

    // Also expose DEFAULT_VALUE
    global.DEFAULT_VALUE = DEFAULT_VALUE;

})(typeof window !== 'undefined' ? window : global);
