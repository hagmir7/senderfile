$('#validationcheckjq1').mousedown(function () {
    if (!$(this).is(':checked')) {
        Swal.fire({
            title: 'Terms and conditions',
            html: "<iframe src='/conditions' frameborder='0' width='100%' height='3800px'></iframe>",
            width: '80%',
            input: 'checkbox',
            inputValue: 0,
            inputPlaceholder:
                'j\'accepter les conditions d\'utilisations!',
            confirmButtonText:
                'Continue <i class="fa fa-arrow-right"></i>',
            inputValidator: (result) => {
                if (!result) {
                    return 'Vous devez accepter les conditions d\'utilisations!'
                } else {
                    $('#validationcheckjq1').click();
                }
            }
        });
    }
});


function getClientDetails() {
    $('#products-review-table > tbody').find("tr").remove();
    $("#fclient-ville").text($("#cities option:selected").text());
    $("#fclient-secteur").text($("#secteurs option:selected").text());
    $("#fclient-magasin").text($("#magasins option:selected").text());
    $("#sclient-name").text($("#clients option:selected").text());

    $("#sclient-adress").text($("#adresse_actuelle").val());
    $("#sclient-contact").text($("#phone_actuelle").val());
    $("#sclient-adress-supp").text($("#adresse_sup").val());
    $("#sclient-contact-supp").text($("#phone_sup").val());
    $("#mode-livraison-review").text($("#type_livraison").val());
    $("#fragile_review").text($("#fragile").is(':checked') ? "Oui" : "Non");
    let val_fragilite = $("#fragile").is(':checked') ? $("#fragile_valeur").val() : null;
    $("#fragile_valeur_review").text(val_fragilite);
    $("#commentaire_review").text($("#commentaire").val());

    let quantites = [].slice.call($("[name='quantite[]']")).map(e => $(e).val());
    let somme = quantites.reduce(function (a, b) {
        return a + Number(b)
    }, 0);
    $("#quantite-review").text(somme);
    $("#quantite-table-review").text(somme);

    let poids = [].slice.call($("[name='poid[]']")).map(e => $(e).val());
    let i = 0;
    let sommePoids = poids.reduce(function (a, b) {
        return a + Number(b) * Number(quantites[i])
    }, i);
    $("#poid-review").text(sommePoids);
    $("#poid-final-review").text(sommePoids);

    let todaysDate = new Date();
    let date = todaysDate.getFullYear() + '-' + (todaysDate.getMonth() + 1) + '-' + todaysDate.getDate();
    $("#booking-date-review").text(date);


    let now = new Date();
    now.setDate(now.getDate() + 7);
    let expectedDelivary = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
    $("#Expected-delivary-review").text(expectedDelivary);

    let montants = [].slice.call($("[name='montant[]']")).map(e => $(e).val());
    let sommeMontant = montants.reduce(function (a, b) {
        return a + Number(b)
    }, 0);
    $("#montant-review").text(sommeMontant);
    $("#montant-table-review").text(sommeMontant);


    let products = [].slice.call($("[name='products[]']")).map(e => $(e).children("option:selected").text());
    for (let i = 0; i < montants.length; i++) {
        $('#products-review-table tbody').append('<tr><td>' + products[i] + '</td><td>' + poids[i] + '</td><td>' + quantites[i] + '</td><td>' + montants[i] + '</td></tr>');
    }

    $("#fragilite-review").text(Number(this.checked))

}

function getRamassageDetails() {
    $('#products-review-table > tbody').find("tr").remove();
    $("#magasins_review").text($("#magasins option:selected").text());
    $("#secteurs_review").text($("#secteurs option:selected").text());
    $("#cities_review").text($("#cities option:selected").text());
    $("#motif_review").text($("#motif").val());
    $("#date_ramm_review").text($("#date_ramm").val());
    $("#cities_ramassage_review").text($("#cities_ramassage option:selected").text());
    $("#secteurs_ramassage_review").text($("#secteurs_ramassage option:selected").text());
    $("#adresse_ramassage_review").text($("#adresse_ramassage").val());
    $("#fragile_review").text($("#fragile").is(':checked') ? "Oui" : "Non");
    let val_fragilite = $("#fragile").is(':checked') ? $("#fragile_valeur").val() : null;
    $("#fragile_valeur_review").text(val_fragilite);
    $("#commentaire_review").text($("#commentaire").val());

    let quantites = [].slice.call($("[name='quantite[]']")).map(e => $(e).val());
    let somme = quantites.reduce(function (a, b) {
        return a + Number(b)
    }, 0);
    $("#quantite-review").text(somme);

    let poids = [].slice.call($("[name='poid[]']")).map(e => $(e).val());
    let i = 0;
    let sommePoids = poids.reduce(function (a, b) {
        return a + Number(b) * Number(quantites[i])
    }, i);
    $("#poid-final-review").text(sommePoids);

    let products = [].slice.call($("[name='products[]']")).map(e => $(e).children("option:selected").text());
    for (let i = 0; i < quantites.length; i++) {
        $('#products-review-table tbody').append('<tr><td>' + products[i] + '</td><td>' + poids[i] + '</td><td>' + quantites[i] + '</td></tr>');
    }
}


    //get client adress & tel
    $('#clients').change(function () {
        var client_id = $('#clients').val();
        if (client_id != '') {
            $.ajax({
                url: `get-client-adress/${client_id}`,
                type: "POST",
                data: {
                    "_token": $("#_token").val(),
                    client_id: client_id
                },
                success: function (data) {
                    $('#adresse_actuelle').val(data.adress);
                    $('#phone_actuelle').val(data.phone);
                }
            });
        } else {
            $('#adresse_actuelle').val('');
            $('#phone_actuelle').val('');
            console.error("Error");
        }
    });

    //get city by country
    $('#countries').change(function () {
        var country_id = $('#countries').val();
        if (country_id != '') {
            $.ajax({
                url: `/get-cities-by-country`,
                type: "POST",
                data: {
                    "_token": $("#_token").val(),
                    country_id: country_id
                },
                success: function (data) {
                    $('#city').html(data);
                }
            });
        } else {
            $('#city').html('<option value="">Select another country</option>');
            console.error("Error");
        }
    });

    //get secteur by city
    $('#cities').change(function () {
        var city_id = $('#cities').val();
        if (city_id != '') {
            $.ajax({
                url: `/get-sectors-by-city`,
                type: "POST",
                data: {
                    "_token": $("#_token").val(),
                    city_id: city_id
                },
                success: function (data) {
                    $('#secteurs').html(data);
                }
            });
        } else {
            $('#secteurs').html('<option value="">Select Secteur</option>');
            console.error("Error");
        }
    });

    //get secteur by city
    $('#cities_ramassage').change(function () {
        var city_id = $('#cities_ramassage').val();
        if (city_id != '') {
            $.ajax({
                url: `/get-sectors-by-city`,
                type: "POST",
                data: {
                    "_token": $("#_token").val(),
                    city_id: city_id
                },
                success: function (data) {
                    $('#secteurs_ramassage').html(data);
                }
            });
        } else {
            $('#secteurs_ramassage').html('<option value="">Select Secteur</option>');
            console.error("Error");
        }
    });

    //get magasin by secteur
    $('#secteurs').change(function () {
        var secteur_id = $('#secteurs').val();
        if (secteur_id != '') {
            $.ajax({
                url: `/get-stock-by-secteur`,
                type: "POST",
                data: {
                    "_token": $("#_token").val(),
                    secteur_id: secteur_id
                },
                success: function (data) {
                    $('#magasins').html(data);
                }
            });
        } else {
            $('#magasins').html('<option value="">Select Magasin</option>');
            console.error("Error");
        }
    });

    //validation check display submit
    $("#validationcheckjq1").click(function () {
        if (!$(this).is(':checked')) {
            $("#submit-btn").hide();
        } else {
            $("#submit-btn").show();
        }
    });

    //validation check display submit
    $("#fragile").click(function () {
        if (!$(this).is(':checked')) {
            $("#fragile_valeur_div").hide();
        } else {
            $("#fragile_valeur_div").show();
        }
    });

    //validation check display submit
    setTimeout(check_fragile, 2000);

    function check_fragile() {
        if ($("#fragile").is(':checked')) {
            $("#fragile_valeur_div").show();
        }
    }

    $("#addClientForm").submit(function (event) {
        let formData = {
            _token: $("#_token").val(),
            lastname: $("#lastname").val(),
            firstname: $("#firstname").val(),
            phone: $("#phone").val(),
            email: $("#email").val(),
            Adresse: $("#Adresse").val(),
            ville: $("#city").val()
        };

        $.ajax({
            type: "POST",
            url: "/sclientstore",
            data: formData,
            dataType: "json",
            encode: true,
        }).done(function (data) {
            if (!data.success) {
                if (data.errors.lastname) {
                    $("#lastname").addClass("has-error");
                    $("#lastname-group").append(
                        '<div class="invalid-feedback d-block">' +
                        '<ul>' +
                        data.errors.lastname.map(function (item) {
                            return '<li>' + item + '</li>';
                        })
                        + '<ul>'
                        + "</div>"
                    );
                }

                if (data.errors.firstname) {
                    $("#firstname").addClass("has-error");
                    $("#firstname-group").append(
                        '<div class="invalid-feedback d-block">' +
                        '<ul>' +
                        data.errors.firstname.map(function (item) {
                            return '<li>' + item + '</li>';
                        })
                        + '</ul>'
                        + "</div>"
                    );
                }

                if (data.errors.email) {
                    $("#email").addClass("has-error");
                    $("#email-group").append(
                        '<div class="invalid-feedback d-block">' +
                        '<ul>' +
                        data.errors.email.map(function (item) {
                            return '<li>' + item + '</li>';
                        })
                        + '</ul>'
                        + "</div>"
                    );
                }

                if (data.errors.phone) {
                    $("#phone").addClass("has-error");
                    $("#phone-group").append(
                        '<div class="invalid-feedback d-block">' +
                        '<ul>' +
                        data.errors.phone.map(function (item) {
                            return '<li>' + item + '</li>';
                        })
                        + '<ul>'
                        + "</div>"
                    );
                }

                if (data.errors.ville) {
                    $("#city").addClass("has-error");
                    $("#city-group").append(
                        '<div class="invalid-feedback d-block">' +
                        '<ul>' +
                        data.errors.ville.map(function (item) {
                            return '<li>' + item + '</li>';
                        })
                        + '<ul>'
                        + "</div>"
                    );
                }


            } else {
                console.log(data.success);
                $("#addClientForm .alert-success").toggleClass('d-none');
                $("#addClientForm .alert-success").text(data.message);
                $("#clients").append('<option value="' + data.data.id + '">' + data.data.firstname + ' ' + data.data.lastname + '</option>')
                $("#addClientForm").trigger('reset');

            }
        });
        event.preventDefault();
    });


    $("#addProductBtn").on('click', function (e) {
        e.preventDefault();
        // make a random name for the products to differentiate them
        randomName = makeName();

        //clone the primary product empty it then assigne the id to it
        let theClone = $("#product-row-to-clone").find('.products').select2("destroy").end().clone();
        theClone.attr('id', randomName).find('input').val('').end();

        // get the remove btn
        let removeProductBtn = theClone.find(".remove-product-btn");
        // remove it's d-none attr to show it
        removeProductBtn.removeClass('d-none');
        // add a click event listener to it
        removeProductBtn.on('click', function (event) {
            event.preventDefault();
            event.target.closest(".product-row-to-clone").remove();
        });

        theClone.appendTo('#products-rows');

        $('#products-rows').find('.products').select2();
        createEvent(randomName);
    });

    function makeName() {
        let text = "";
        let possible = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        for (let i = 0; i < 6; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    function createEvent(name) {
        let name2 = '';
        if (name.length) {
            name2 = '#' + name + " ";
        }
        //get product infos
        $(name2 + '.products').on("change", function (e) {
            var prod_id = $(this).val();
            if (prod_id != '') {
                $.ajax({
                    url: `get-product-infos/${prod_id}`,
                    type: "POST",
                    data: {
                        "_token": "{{ csrf_token() }}",
                        prod_id: prod_id
                    },
                    success: function (data) {
                        console.log($(e.target).closest(".product-row-to-clone").find('.prod_hauteur'));
                        $(e.target).closest(".product-row-to-clone").find('.prod_hauteur').val(data.hauteur);
                        $(e.target).closest(".product-row-to-clone").find('.prod_largeur').val(data.largeur);
                        $(e.target).closest(".product-row-to-clone").find('.prod_profondeur').val(data.profondeur);
                        $(e.target).closest(".product-row-to-clone").find('.prod_poids').val(data.poids);
                    }
                });
            } else {
                $(e.target).closest(".product-row-to-clone").find('.prod_hauteur').val('');
                $(e.target).closest(".product-row-to-clone").find('.prod_largeur').val('');
                $(e.target).closest(".product-row-to-clone").find('.prod_profondeur').val('');
                $(e.target).closest(".product-row-to-clone").find('.prod_poids').val('');
                console.error("Error");
            }
        });
    }

    createEvent(''); // the function should be called in order for the first one to word

    $('#validationcheckjq1').mousedown(function () {
        if (!$(this).is(':checked')) {
            Swal.fire({
                title: 'Terms and conditions',
                html: "<iframe src='/conditions' frameborder='0' width='100%' style='min-height: 400px'></iframe>",
                width: '80%',
                input: 'checkbox',
                inputValue: 0,
                inputPlaceholder:
                    'j\'accepter les conditions d\'utilisations!',
                confirmButtonText:
                    'Continue <i class="fa fa-arrow-right"></i>',
                inputValidator: (result) => {
                    if (!result) {
                        return 'Vous devez accepter les conditions d\'utilisations!'
                    } else {
                        $('#validationcheckjq1').click();
                    }
                }
            });
        }
    });


    $("#createProductForm").submit(function (event) {
        let formData = {
            _token: $("#_token").val(),
            code: $("#code").val(),
            ref: $("#ref").val(),
            desc: $("#desc").val(),
            name: $("#name-produit").val(),
            hauteur: $("#hauteur").val(),
            largeur: $("#largeur").val(),
            profondeur: $("#profondeur").val(),
            poids: $("#poids").val()
        };

        $.ajax({
            type: "POST",
            url: "/productstoreajax",
            data: formData,
            dataType: "json",
            encode: true,
        }).done(function (data) {
            console.log(data);
            if (!data.success) {
                if (data.errors.name) {
                    $("#name-produit").addClass("has-error");
                    $("#name-produit-group").append(
                        '<div class="invalid-feedback d-block">' +
                        '<ul>' +
                        data.errors.name.map(function (item) {
                            return '<li>' + item + '</li>';
                        })
                        + '<ul>'
                        + "</div>"
                    );
                }

                if (data.errors.code) {
                    $("#code").addClass("has-error");
                    $("#code-group").append(
                        '<div class="invalid-feedback d-block">' +
                        '<ul>' +
                        data.errors.code.map(function (item) {
                            return '<li>' + item + '</li>';
                        })
                        + '</ul>'
                        + "</div>"
                    );
                }

                if (data.errors.desc) {
                    $("#desc").addClass("has-error");
                    $("#desc-group").append(
                        '<div class="invalid-feedback d-block">' +
                        '<ul>' +
                        data.errors.desc.map(function (item) {
                            return '<li>' + item + '</li>';
                        })
                        + '</ul>'
                        + "</div>"
                    );
                }

                if (data.errors.ref) {
                    $("#ref").addClass("has-error");
                    $("#ref-group").append(
                        '<div class="invalid-feedback d-block">' +
                        '<ul>' +
                        data.errors.ref.map(function (item) {
                            return '<li>' + item + '</li>';
                        })
                        + '<ul>'
                        + "</div>"
                    );
                }

                if (data.errors.hauteur) {
                    $("#hauteur").addClass("has-error");
                    $("#hauteur-group").append(
                        '<div class="invalid-feedback d-block">' +
                        '<ul>' +
                        data.errors.hauteur.map(function (item) {
                            return '<li>' + item + '</li>';
                        })
                        + '<ul>'
                        + "</div>"
                    );
                }

                if (data.errors.largeur) {
                    $("#largeur").addClass("has-error");
                    $("#largeur-group").append(
                        '<div class="invalid-feedback d-block">' +
                        '<ul>' +
                        data.errors.largeur.map(function (item) {
                            return '<li>' + item + '</li>';
                        })
                        + '<ul>'
                        + "</div>"
                    );
                }

                if (data.errors.profondeur) {
                    $("#profondeur").addClass("has-error");
                    $("#profondeur-group").append(
                        '<div class="invalid-feedback d-block">' +
                        '<ul>' +
                        data.errors.profondeur.map(function (item) {
                            return '<li>' + item + '</li>';
                        })
                        + '<ul>'
                        + "</div>"
                    );
                }

                if (data.errors.poids) {
                    $("#poids").addClass("has-error");
                    $("#poids-group").append(
                        '<div class="invalid-feedback d-block">' +
                        '<ul>' +
                        data.errors.poids.map(function (item) {
                            return '<li>' + item + '</li>';
                        })
                        + '<ul>'
                        + "</div>"
                    );
                }


            } else {
                $("#createProductForm .alert-success").removeClass('d-none');
                $("#createProductForm .alert-success").text(data.message);
                $(".products").eq(0).append('<option value="' + data.data.id + '">' + data.data.name + '</option>')
                $("#createProductForm").trigger('reset');

            }
        });
        event.preventDefault();
    });


    $("#multiStepsEmail").focusout(function () {
        let emailData = {
            _token: $("#_token").val(),
            email: $("#multiStepsEmail").val()
        }

        //find if there is a loader actif next to this input and remove it
        $("#multiStepsEmail").parent().find('.loader').eq(0).remove();
        // add a loader animation to the input to indicate search starts
        $("#multiStepsEmail").parent().append('<div class="loader"><i class="loader-icon"></i></div>');

        $.ajax({
            type: "POST",
            url: "/verifyemailavailability",
            data: emailData,
            dataType: "json",
            encode: true,
        }).done(function (data) {
            $("#multiStepsEmail").parent().find('.loader').eq(0).remove();
            if (!data.success) {
                if (data.errors.email) {
                    $("#multiStepsEmail").removeClass("is-valid");
                    $("#multiStepsEmail").addClass("is-invalid");

                    $("#multiStepsEmail").parent().find(".invalid-feedback").eq(0).remove();
                    $("#multiStepsEmail").parent().find(".valid-feedback").eq(0).remove();

                    $("#multiStepsEmail").parent().append(
                        '<div class="fv-plugins-message-container invalid-feedback">' +
                        '<div data-field="multiStepsEmail">' +
                        data.errors.email
                        + '</div></div>'
                    );
                }
            } else {
                $("#multiStepsEmail").parent().find(".invalid-feedback").eq(0).remove();
                $("#multiStepsEmail").parent().find(".valid-feedback").eq(0).remove();
                $("#multiStepsEmail").removeClass("is-invalid");
                $("#multiStepsEmail").addClass("is-valid");

                $("#multiStepsEmail").parent().append(
                    '<div class="fv-plugins-message-container valid-feedback">' +
                    '<div data-field="multiStepsEmail">' +
                    data.message
                    + '</div></div>'
                );
            }

        });

    });


    $("#multiStepsUsername").focusout(function () {
        let emailData = {
            _token: $("#_token").val(),
            username: $("#multiStepsUsername").val()
        }

        //find if there is a loader actif next to this input and remove it
        $("#multiStepsUsername").parent().find('.loader').eq(0).remove();
        // add a loader animation to the input to indicate search starts
        $("#multiStepsUsername").parent().append('<div class="loader"><i class="loader-icon"></i></div>');

        $.ajax({
            type: "POST",
            url: "/verifyusernameavailability",
            data: emailData,
            dataType: "json",
            encode: true,
        }).done(function (data) {
            $("#multiStepsUsername").parent().find('.loader').eq(0).remove();
            if (!data.success) {
                if (data.errors.username) {
                    $("#multiStepsUsername").removeClass("is-valid");
                    $("#multiStepsUsername").addClass("is-invalid");

                    $("#multiStepsUsername").parent().find(".invalid-feedback").eq(0).remove();
                    $("#multiStepsUsername").parent().find(".valid-feedback").eq(0).remove();

                    $("#multiStepsUsername").parent().append(
                        '<div class="fv-plugins-message-container invalid-feedback">' +
                        '<div data-field="multiStepsEmail">' +
                        data.errors.username
                        + '</div></div>'
                    );
                }
            } else {
                $("#multiStepsUsername").removeClass("is-invalid");
                $("#multiStepsUsername").addClass("is-valid");

                $("#multiStepsUsername").parent().find(".invalid-feedback").eq(0).remove();
                $("#multiStepsUsername").parent().find(".valid-feedback").eq(0).remove();

                $("#multiStepsUsername").parent().append(
                    '<div class="fv-plugins-message-container valid-feedback">' +
                    '<div data-field="multiStepsEmail">' +
                    data.message
                    + '</div></div>'
                );
            }

        });

    });



