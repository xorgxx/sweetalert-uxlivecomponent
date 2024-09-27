import {coreController} from './coreController.js';

export default class extends coreController {
    modal(event) {
        event.preventDefault();
        event.stopPropagation();

        // Initialize stimulus attributes with default values
        this.initializeStimulusAtt();

        swal.fire({
            title: this.titleValue,
            text: this.textValue,
            icon: this.iconValue,
            showCancelButton: this.showCancelButtonValue,
            confirmButtonText: this.confirmButtonTextValue,
            allowOutsideClick: false,
            preConfirm: async () => {
                try {
                    // First request: fetch form with timeout
                    const formResponse = await this.fetch([]);
                    // Return the response for validation
                    return formResponse; 
                } catch (error) {
                    swal.showValidationMessage(`Request failed: ${error.message}`);
                    // Indicates validation failed
                    return false; 
                }
            },
        });
        // Automatically trigger the confirmation button after the first step
        swal.clickConfirm(); 
    }

    async fetch(data) {
        const controller = new AbortController();
        const {signal} = controller;

        try {
            // Timeout pour la requête fetchForm
            const response = await this.withTimeout(
                this.fetchForm(data, signal),
                10000, // Timeout de 10 secondes
                controller
            );

            // Update SweetAlert after fetch response
            return swal.fire({
                // icon: 'success',
                title: this.titleValue,
                html: response,
                showCancelButton: this.showCancelButtonValue,
                confirmButtonText: this.confirmButtonTextValue,
                allowOutsideClick: false,
                preConfirm: async () => {
                    try {
                        // Second request: form submission with timeout
                        await this.handleFormSubmit();
                    } catch (error) {
                        swal.showValidationMessage(`Form submission failed: ${error.message}`);
                        return false; // Notify SweetAlert that validation failed
                    }
                },
            });

        } catch (error) {
            swal.fire({
                icon: 'error',
                title: 'Connection failed',
                text: error.message,
            });
        }
    }

    async handleFormSubmit() {
        const formController = new AbortController();
        const {signal: formSignal} = formController;

        try {
            // Timeout for form submission
            await this.withTimeout(
                this.submitForm( formSignal),
                10000, // Timeout of 10 seconds for form submission
                formController
            );
        } catch (error) {
            // Added error message here if submission fails
            swal.showValidationMessage(`Request failed: ${error.message}`);
            throw error; // Rerun the error to capture it in the fetch
        }
    }

    // Function to manage the timeout and cancel the request if it exceeds the time limit
    withTimeout(promise, ms, controller) {
        return Promise.race([
            promise,
            new Promise((_, reject) =>
                setTimeout(() => {
                    controller.abort(); // Cancel the request if it takes too long
                    reject(new Error("Request timed out"));
                }, ms)
            )
        ]);
    }
}