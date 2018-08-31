define(['jquery'], function($) {
    return {
        showError: function(message) {
            // window.alert(message);
            $("#loading-symbol").hide();
            $("#error-symbol").show();
            $("#message").text(message);
        }
    }
});