define(['jquery'], function($) {
    return {
        /**
         * @description: Use jquery to show error message,
         */
        showError: function(message) {
            $("#loading-symbol").hide();
            $("#error-symbol").show();
            $("#message").text(message);
        }
    }
});