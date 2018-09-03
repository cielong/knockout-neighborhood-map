"use strict";
define(['jquery',], function($) {
    return {
        /**
         * @description: Use jquery to show error message,
         */
        showError: function(message) {
            $(".status-message").hide();
            $(".error-message").show();
            $(".message").text(message);
        },
        showWarning: () => {
            $(".warning-message").fadeIn("fast").fadeOut(5000);
        },
    }
});