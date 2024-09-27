import {Controller} from '@hotwired/stimulus';
import {getComponent} from '@symfony/ux-live-component';

export class coreController extends Controller {
    static values = {
        // Valeurs par défaut pour SweetAlert
        showCancelButton: {type: Boolean, default: true},
        showConfirmButton: {type: Boolean, default: true},
        showDenyButton: {type: Boolean, default: false},
        denyButtonText: {type: String, default: 'Annuler'},
        cancelButtonText: {type: String, default: 'Fermer'},
        confirmButtonText: {type: String, default: 'Envoyer'},
        title: {type: String, default: 'Recherche ...'},
        text: {type: String, default: 'Recherche ...'},
        locale: {type: String, default: 'fr'},
        toast: {type: Boolean, default: false},
        background: {type: String, default: '#abd3c0'},
        icon: {type: String, default: 'info'},
        position: {type: String, default: 'center'},
        replie: {type: String, default: 'Recherche ...'},
        url: {type: String, default: 'Fetching ...'},
        idElement: {type: String, default: 'element'},
    };


    initializeStimulusAtt() {
        // Initialize values based on data- attributes
        this.#initializeStAttValues();
    }

    initializeDataAtt() {
        // Initialize values based on data- attributes
        this.#initializeDataAttValues();
    }

    async fetchForm(body, signal) {

        swal.update({
            'text': `Loading form waiting ...`,
            'icon': "question"
        })
        swal.showLoading()

        let $f = JSON.stringify(body);
        return fetch(this.urlValue, {
            method: "post",
            body: $f,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            signal,
            credentials: 'include'
        })
            .then(await this.#handleResponse)
            .catch(this.#handleError)
    }

    async submitForm( signal ) {
        const $elem = document.getElementById("swal2-html-container");
        const $form = $elem.querySelector("form");
        const formData = new FormData($form);
        const inputFields = [...$form.querySelectorAll('input, textarea, select')];

        // Check required fields
        const formIsValid = inputFields.every(field => !field.hasAttribute('required') || field.value.trim());

        if (!formIsValid) {
            inputFields.forEach(field => {
                if (field.hasAttribute('required') && !field.value.trim()) {
                    field.classList.add("is-invalid");
                } else {
                    field.classList.remove("is-invalid");
                }
            });
            // Added error message here if submission fails
            swal.showValidationMessage(`Request failed: ${error.message}`);
            return;
        }

        swal.update({
            'text': `Submit form waiting ...`,
            'html': "",
            'icon': "question"
        })
        swal.showLoading()

        // Send the request with the form data
        return fetch($form.action, {
            method: $form.method,
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
            },
            signal,
            credentials: 'include'
        })
            .then(this.#handleResponse)
            .then(data => {
                if (data == "true") {
                    swal.close()
                    $form.reset()
                    swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Your work has been saved",
                        showConfirmButton: false,
                        timer: 1500 // This is the SweetAlert timer
                    });
                    // 🦖🦖🦖 here is the magic to render the live component selection only when the form is submitted!!
                    const component = document.querySelector(`[data-live-name-value="${this.idElementValue}"]`).__component;
                    // or call an action
                    component.action('refresh');
                    // then, trigger a re-render to get the fresh HTML
                    // component.render();

                } else {
                    // Update the UI with the retrieved data
                    swal.fire({
                        // icon: '',
                        title: this.titleValue,
                        html: data,
                        showCancelButton: this.showCancelButtonValue,
                        confirmButtonText: this.confirmButtonTextValue,
                        allowOutsideClick: false,
                        preConfirm: () => this.submitForm("formNeox"),
                    });
                    swal.showValidationMessage(
                        `${error}`
                    );
                }
            })
            .catch(this.#handleError)
    }

    async #handleResponse(result) {
        if (!result.ok) {
            throw new Error(`Network error: ${result.status} - ${result.statusText}`);
        }
        return result.text();
    }

    #handleError(error) {
        swal.update({
            'text': `Request failed !!`,
            'icon': "warning"
        });
        swal.showValidationMessage(
            `${error}`
        );
    }

    // Get by stimulus attributes 
    #initializeStAttValues() {
        for (const key of Object.keys(this.constructor.values)) {
            // We use the Stimulus attributes
            const dataValue = this[`${key}Value`];

            // We apply the default value if no value is provided
            this[key + 'Value'] = dataValue || this.constructor.values[key].default;
        }
    }

    // Get by data-attributes
    #initializeDataAttValues() {
        // Check and apply values passed via data attributes-
        for (const key in this.constructor.values) {
            const dataValue = this.element.dataset[key];
            // const dataValue = this.[key].Value
            this[key + 'Value'] = dataValue !== undefined
                ? this.convertDataValue(dataValue)
                : this.constructor.values[key].default;
        }
    }

    #convertDataValue(value) {
        // Convert values to appropriate types
        if (value === 'true') return true;
        if (value === 'false') return false;
        const numberValue = Number(value);
        return isNaN(numberValue) ? value : numberValue;
    }

}