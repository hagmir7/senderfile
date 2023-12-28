/**
 *  Page auth register multi-steps
 */

'use strict';

// Select2 (jquery)
$(function () {
    var select2 = $('.select2');

    // select2
    if (select2.length) {
        select2.each(function () {
            var $this = $(this);
            $this.wrap('<div class="position-relative"></div>');
            $this.select2({
                placeholder: 'Veuillez sélectionner',
                dropdownParent: $this.parent()
            });
        });
    }
});

// Multi Steps Validation
// --------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function (e) {
    (function () {
        const stepsValidation = document.querySelector('#livraison-validation');
        if (typeof stepsValidation !== undefined && stepsValidation !== null) {
            // Multi Steps form
            const stepsValidationForm = stepsValidation.querySelector('#wizard-validation-form');
            // Form steps
            const stepsValidationFormStep1 = stepsValidationForm.querySelector('#account-details-vertical');
            const stepsValidationFormStep2 = stepsValidationForm.querySelector('#stockage-info-vertical');
            const stepsValidationFormStep3 = stepsValidationForm.querySelector('#personal-info-vertical');
            const review_submit = stepsValidationForm.querySelector('#review-submit');

            // Multi steps next prev button
            const stepsValidationNext = [].slice.call(stepsValidationForm.querySelectorAll('.btn-next'));
            const stepsValidationPrev = [].slice.call(stepsValidationForm.querySelectorAll('.btn-prev'));

            let validationStepper = new Stepper(stepsValidation, {
                linear: true
            });

            // Account details
            const multiSteps1 = FormValidation.formValidation(stepsValidationFormStep1, {
                fields: {
                    'products[]': {
                        validators: {
                            notEmpty: {
                                message: 'Veuillez choisir au moins un produit'
                            }
                        }
                    },
                    quantiteInputs: {
                        selector: ".quantiteInputs",
                        row: ".col-sm-12",
                        validators:{
                            notEmpty: {
                                message: 'Veuillez remplir la largeur'
                            },
                            callback: {
                                message : "l'une des valeurs de quantite est null ou non entier",
                                callback: function (){
                                    let quantities = [].slice.call($("[name='quantite[]']")).map(e => $(e).val());
                                    if(quantities.includes('')){
                                        return false;
                                    }

                                    for(var i = 0; i < quantities.length; i++){
                                        if (quantities[i].indexOf('.') !== -1){
                                            return false;
                                        }
                                    }
                                    return true;
                                }
                            }
                        }
                    },
                    'largeur[]': {
                        validators: {
                            notEmpty: {
                                message: 'Veuillez remplir la largeur'
                            },
                            numeric: {
                                message: "La valeur n'est pas un nombre",
                                // The default separators
                                thousandsSeparator: '',
                                decimalSeparator: '.',
                            },
                        }
                    },
                    'poid[]': {
                        validators: {
                            notEmpty: {
                                message: 'Veuillez remplir le poid'
                            },
                            numeric: {
                                message: "La valeur n'est pas un nombre",
                                // The default separators
                                thousandsSeparator: '',
                                decimalSeparator: '.',
                            },
                        }
                    },
                    'profondeur[]': {
                        validators: {
                            notEmpty: {
                                message: 'Veuillez remplir la profondeur'
                            },
                            numeric: {
                                message: "La valeur n'est pas un nombre",
                                // The default separators
                                thousandsSeparator: '',
                                decimalSeparator: '.',
                            },
                        }
                    },
                    'hauteur[]': {
                        validators: {
                            notEmpty: {
                                message: 'Veuillez remplir la hauteur'
                            },
                            numeric: {
                                message: "La valeur n'est pas un nombre",
                                // The default separators
                                thousandsSeparator: '',
                                decimalSeparator: '.',
                            },
                        }
                    },
                    fragile: {
                        validators: {
                            callback: {
                                callback: function (){
                                    let val = $("[name='fragile_valeur']").val()

                                    // if(!$("#fragile").is(':checked') && val.length !== 0){
                                    //     return {
                                    //         valid: false,
                                    //         message: "Ne spécifiez aucune valeur si votre colis n'est pas fragile!"
                                    //     }
                                    // }

                                    if($("#fragile").is(':checked') && val.length === 0){
                                        return {
                                            valid: false,
                                            message: "Vous devez specifier une valeur de fragilité!"
                                        }
                                    }

                                    return true;
                                }
                            }
                        }
                    },
                    fragile_valeur: {
                        validators :{
                            callback: {
                                callback: function (){
                                    let val = $("[name='fragile_valeur']").val();

                                    if(isNaN(val)){
                                        return {
                                            valid: false,
                                            message : "Cette doit être un digit ou un decimal!",
                                        };
                                    }

                                    if(val.length){
                                        $("#fragile").removeClass('is-invalid')
                                        .parent().parent().children('.invalid-feedback').remove();
                                    }

                                    return true;
                                }
                            },
                        }
                    }

                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap5: new FormValidation.plugins.Bootstrap5({
                        // Use this for enabling/changing valid/invalid class
                        // eleInvalidClass: '',
                        eleValidClass: '',
                        rowSelector: function (field, ele) {
                            // field is the field name
                            // ele is the field element
                            switch (field) {
                                case 'multiStepsFirstName':
                                    return '.col-sm-6';
                                case 'multiStepsAddress':
                                    return '.col-md-12';
                                default:
                                    return '.row';
                            }
                        }
                    }),
                    autoFocus: new FormValidation.plugins.AutoFocus(),
                    submitButton: new FormValidation.plugins.SubmitButton()
                },
                init: instance => {
                    instance.on('plugins.message.placed', function (e) {
                        if (e.element.parentElement.classList.contains('input-group')) {
                            e.element.parentElement.insertAdjacentElement('afterend', e.messageElement);
                        }
                    });
                }
            }).on('core.form.valid', function () {
                // Jump to the next step when all fields in the current step are valid
                validationStepper.next();
            });

            // Informations de livraison
            const multiSteps2 = FormValidation.formValidation(stepsValidationFormStep2, {
                fields: {
                    ville: {
                        validators: {
                            notEmpty: {
                                messages: "Vous devez choisir votre ville"
                            }
                        }
                    },
                    secteur: {
                        validators: {
                            notEmpty: {
                                messages: "Vous devez choisir votre secteur"
                            }
                        }
                    },
                    boutique: {
                        validators: {
                            notEmpty: {
                                messages: "Vous devez choisir un magasin de stock"
                            }
                        }
                    }
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap5: new FormValidation.plugins.Bootstrap5({
                        // Use this for enabling/changing valid/invalid class
                        // eleInvalidClass: '',
                        eleValidClass: '',
                        rowSelector: function (field, ele) {
                            // field is the field name
                            // ele is the field element
                            switch (field) {
                                case 'multiStepsFirstName':
                                    return '.col-sm-6';
                                case 'multiStepsAddress':
                                    return '.col-md-12';
                                default:
                                    return '.row';
                            }
                        }
                    }),
                    autoFocus: new FormValidation.plugins.AutoFocus(),
                    submitButton: new FormValidation.plugins.SubmitButton()
                }
            }).on('core.form.valid', function () {
                // Jump to the next step when all fields in the current step are valid
                validationStepper.next();
            });

            // Informations supplumentaires
            const multiSteps3 = FormValidation.formValidation(stepsValidationFormStep3, {
                fields: {

                    date_ramm: {
                        validators: {
                            notEmpty: {
                                message: 'Vous devez indiquer une date'
                            }
                        }
                    },
                    ville_ramassage: {
                        validators: {
                            notEmpty: {
                                messages: "Vous devez choisir votre ville"
                            }
                        }
                    },
                    secteur_ramassage: {
                        validators: {
                            notEmpty: {
                                messages: "Vous devez choisir votre secteur"
                            }
                        }
                    },
                    adresse_ramassage: {
                        validators: {
                            notEmpty: {
                                messages: "Vous devez choisir votre secteur"
                            }
                        }
                    },
                    validationcheckjq1: {
                        validators: {
                            notEmpty: {
                                message: "Vous devez accepter les terms et conditions d'utilisation"
                            }
                        }
                    }
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap5: new FormValidation.plugins.Bootstrap5({
                        // Use this for enabling/changing valid/invalid class
                        // eleInvalidClass: '',
                        eleValidClass: '',
                        rowSelector: function (field, ele) {
                            // field is the field name
                            // ele is the field element
                            switch (field) {
                                case 'multiStepsFirstName':
                                    return '.col-sm-6';
                                case 'multiStepsAddress':
                                    return '.col-md-12';
                                default:
                                    return '.row';
                            }
                        }
                    }),
                    autoFocus: new FormValidation.plugins.AutoFocus(),
                    submitButton: new FormValidation.plugins.SubmitButton()
                }
            }).on('core.form.valid', function () {
                // Jump to the next step when all fields in the current step are valid
                getRamassageDetails();

                validationStepper.next();
            });

            // Social links
            const multiSteps4 = FormValidation.formValidation(review_submit, {

                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap5: new FormValidation.plugins.Bootstrap5({
                        // Use this for enabling/changing valid/invalid class
                        // eleInvalidClass: '',
                        eleValidClass: '',
                        rowSelector: function (field, ele) {
                            // field is the field name
                            // ele is the field element
                            switch (field) {
                                case 'multiStepsCard':
                                    return '.col-md-12';

                                default:
                                    return '.col-dm-6';
                            }
                        }
                    }),
                    autoFocus: new FormValidation.plugins.AutoFocus(),
                    submitButton: new FormValidation.plugins.SubmitButton()
                },
                init: instance => {
                    instance.on('plugins.message.placed', function (e) {
                        if (e.element.parentElement.classList.contains('input-group')) {
                            e.element.parentElement.insertAdjacentElement('afterend', e.messageElement);
                        }
                    });
                }
            }).on('core.form.valid', function () {
                // You can submit the form
                // stepsValidationForm.submit()
                // or send the form data to server via an Ajax request
                // To make the demo simple, I just placed an alert
                let frag = Number($("#fragile").is(':checked'));
                let val_frag = $("#fragile").is(':checked') ? $("#fragile_valeur").val() : '';
                let formData = {
                    _token : $("#_token").val(),
                    date_ramm : $("#date_ramm").val(), 
                    fragile : frag,
                    fragile_valeur : val_frag,
                    commentaire : $("#commentaire").val(),
                    ville : $("#cities_ramassage").val(),
                    secteur : $("#secteurs_ramassage").val(),
                    boutique : $("#magasins").val(),
                    adresse_ramassage : $("#adresse_ramassage").val(),
                    validationcheckjq1 : $("#validationcheckjq1").val(),
                    products : [].slice.call($("[name='products[]']")).map(e => $(e).val()),
                    quantite : [].slice.call($("[name='quantite[]']")).map(e => $(e).val()),
                    hauteur : [].slice.call($("[name='hauteur[]']")).map(e => $(e).val()),
                    largeur : [].slice.call($("[name='largeur[]']")).map(e => $(e).val()),
                    profondeur : [].slice.call($("[name='profondeur[]']")).map(e => $(e).val()),
                    poid : [].slice.call($("[name='poid[]']")).map(e => $(e).val()),
                };


                $.ajax({
                    type: "POST",
                    url: '/create_ramassage',
                    data: formData,
                    dataType: "json",
                    encode: true,
                })
                    .done(function(data) {
                        console.log(data);
                    })
                    .fail(function (data) {
                        console.log(data);
                    });
            });

            stepsValidationNext.forEach(item => {
                item.addEventListener('click', event => {
                    // When click the Next button, we will validate the current step
                    switch (validationStepper._currentIndex) {
                        case 0:
                            multiSteps1.validate();
                            break;

                        case 1:
                            multiSteps2.validate();
                            break;

                        case 2:
                            multiSteps3.validate();
                            break;

                        case 3:
                            multiSteps4.validate();
                            break;

                        default:
                            break;
                    }
                });
            });

            stepsValidationPrev.forEach(item => {
                item.addEventListener('click', event => {
                    switch (validationStepper._currentIndex) {

                        case 3:
                            validationStepper.previous();
                            break;

                        case 2:
                            validationStepper.previous();
                            break;

                        case 1:
                            validationStepper.previous();
                            break;

                        case 0:

                        default:
                            break;
                    }
                });
            });
        }
    })();
});
