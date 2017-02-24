var Ticket = (function ($) {
    "use strict";

    var _bind_events = function () {
        $(document).on("click", ".open-ticket", _open_ticket);
        $(document).on("click", "#create-ticket", _create_ticket);
        $(document).on("submit", ".comment-form", _submit_comment);
        $(document).on("submit", ".ticket-status-form", _save_properties);
    };

    var _create_ticket = function (e) {
        var form = $("#create-ticket-form");
        var submit = $(e.target);

        submit.prop("disabled", true);

        form.submit({
            url: Globals.ajax_url,
            action: "support_create_ticket",
            extras: {
                _ajax_nonce: Globals.ajax_nonce
            },
            success: function (response) {
                $("#create-modal").modal('toggle');

                form.find(".form-control").each(function (index, element) {
                    $(element).val("");
                });

                App.load_tickets();
            },
            complete: function () {
                submit.prop("disabled", false);
            }
        });
    };

    var _open_ticket = function (e) {
        var target = $(e.target);
        var id = target.data("id");

        if (!App.open_tab(id)) {
            target.prop("disabled", true);

            $.ajax({
                url: Globals.ajax_url,
                dataType: "json",
                data: {
                    id: id,
                    action: "support_load_ticket",
                    _ajax_nonce: Globals.ajax_nonce
                },
                success: function (data) {
                    App.new_tab(data);

                    $("#" + id).find(".loader-mask").html(App.ajax_loader(Globals.strings.loading_generic));

                    load_sidebar(data.id);
                    load_comments(data.id);
                },
                complete: function () {
                    target.prop("disabled", false);

                    setTimeout(function () {
                        var ticket = $("#" + id);

                        ticket.find(".ticket-detail").fadeToggle();
                        ticket.find(".loader-mask").hide();
                    }, 1000);
                }
            });
        }
    };

    var _save_properties = function (e) {
        e.preventDefault();

        var form = $(e.target);
        var sidebar = form.parents(".sidebar");

        form.find(".button-submit").prop("disabled", true);
        sidebar.addClass("saving");

        form.submit({
            url: Globals.ajax_url,
            action: "support_update_ticket",
            method: "post",
            extras: {
              _ajax_nonce: Globals.ajax_nonce
            },
            success: function (response) {
                var message = $("<div style=\"border-radius: 0; margin: 0\" class=\"alert alert-success fade in\">" +
                                    "<a href=\"#\" class=\"close\" data-dismiss=\"alert\">×</a>" +
                                    response.data +
                                "</div>");

                sidebar.find(".message").html(message);
                sidebar.removeClass("saving");

                load_sidebar(response.ticket_id);
                App.load_tickets();
            },
            complete: function (xhr) {
                sidebar.removeClass("saving");
                form.find(".button-submit").prop("disabled", false);
            }
        });
    };

    var load_sidebar = function (id) {
        var sidebar = $("#" + id).find(".sidebar");

        if (!sidebar.hasClass("saving")) {
            $.ajax({
                url: Globals.ajax_url,
                dataType: "json",
                data: {
                    id: id,
                    action: "support_ticket_sidebar",
                    _ajax_nonce: Globals.ajax_nonce
                },
                success: function (response) {
                    var collapsed = [];
                    var message = sidebar.find(".message");

                    sidebar.find(".panel").each(function (index, element) {
                        var panel = $(element);

                        if (panel.find(".panel-collapse").attr("aria-expanded") === "false") {
                            collapsed.push(panel.data("id"));
                        }
                    });

                    sidebar.html(response.data);
                    sidebar.find(".message").html(message);

                    sidebar.find(".panel").each(function (index, element) {
                        var panel = $(element);

                        if (collapsed.indexOf(panel.data("id")) !== -1) {
                            panel.find(".panel-collapse")
                                .removeClass("in")
                                .addClass("collapse")
                                .attr("aria-expanded", false);
                        }
                    });
                }
            });
        }
    };

    var load_comments = function (id) {
        var pane = $("#" + id);
        var comments = pane.find(".comments");

        if (comments.find(".editor.active").length === 0 && comments.find(".alert").length === 0) {
            $.ajax({
                url: Globals.ajax_url,
                dataType: "json",
                data: {
                    action: "support_list_comments",
                    id: id,
                    _ajax_nonce: Globals.ajax_nonce
                },
                success: function (response) {
                    comments.html(response.data);
                }
            });
        }
    };

    var _submit_comment = function (e) {
        e.preventDefault();

        var form = $(e.target);
        var comments = form.parents(".discussion-area").find(".comments");
        var content = form.find(".editor-content");
        var submit_button = form.find(".button-submit");
        var data = form.serializeArray();

        submit_button.prop("disabled", true);
        data.push({ name: "_ajax_nonce", value:  Globals.ajax_nonce });

        $.ajax({
            url: Globals.ajax_url + "?action=support_submit_comment",
            dataType: "json",
            method: "post",
            data: data,
            success: function (response) {
                var comment = $(response.data);

                comment.hide();
                comments.append(comment);
                comment.fadeToggle();
                content.val("");

                load_sidebar(response.ticket);
            },
            complete: function () {
                submit_button.prop("disabled", false);
            }
        });
    };

    var initialize = function () {
        _bind_events();

        var looper = function(callback) {
            return function () {
                $("div.tab-pane").each(function (index, element) {
                    var id = $(element).attr("id");

                    if (!isNaN(id)) {
                        callback(id);
                    }
                });
            };
        };

        setInterval(looper(load_comments), 1000 * 15);
        setInterval(looper(load_sidebar), 1000 * 30);
    };

    return {
        load_sidebar: load_sidebar,
        load_comments: load_comments,
        initialize: initialize
    };

})(jQuery);

jQuery(document).ready(function () {
    Ticket.initialize();
});