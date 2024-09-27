# SweetAlert Integration with UX Live Component { Symfony 7 }

This guide explains how to integrate **SweetAlert** with **Symfony UX Live Components** for a streamlined and transparent notification system. The final goal is to set up a notification system using SweetAlert and Symfony's live components, with easy configuration and installation. Before starting, ensure you have installed the following libraries:

- **Symfony UX Live Component**
- **Symfony UX Turbo**
- **Stimulus**
- **SweetAlert2**
- **Bootstrap**

## Installation (BETA VERSION)

Since this is a beta version, follow the installation steps carefully:

1. **Copy and paste the files** into the appropriate directories:
    - Place all files from `assets/dist/*` into your `assets/controllers/` directory.
    - Copy `Services/FormHandlerService.php` into your `src/Services/` directory.


2. Ensure you’ve set up **turbo**, **Stimulus**, **UX Live Component**, **Bootstrap**, and **SweetAlert** correctly in your project.

## Example Usage

Here’s an example of how to use the setup in your Twig file:

```twig
   <a {{ stimulus_controller('neox-modal', {
       title: 'Configuration ...' ,
       text: 'Do you want to continue' ,
       idElement: "NeoxDashHeader",   <== this is the id of the element component very important
       url: path('[route-to-your-from]', { id: ["id-what-ever"] })
   
   }) }}
       data-modal="modal"
       data-action="click->neox-modal#modal"
       class="nav-link"
       href="#"
   >
       <twig:ux:icon class="flex-shrink-0 icon-normal" name="fa6-solid:user-gear" width="30" style="height: auto;" color="black" />
   </a >
   
   `idElement: "NeoxDashHeader"` is the **ID of the component element**, and it is crucial for communication 
   with your Live Component. This ID is typically the **same name as the component itself**, allowing you 
   to interact with it seamlessly.
   
   ### Example:
   For a component located at `Twig/Components/NeoxDashHeader.php`, you would set the `idElement` as 
   `"NeoxDashHeader"` to reference this specific component in your JavaScript code. This ID allows you 
   to "speak" directly with the component when triggering actions or updates from JavaScript.

```
In controller file (you can customize it to suit your needs):
```php
     #[Route('/new', name: 'app_neox_dash_setup_new', methods: [ 'GET', 'POST' ])]
        public function new(Request $request): Response | JsonResponse
        {
            // Determine the template to use for rendering
            $setup = [
                // full html form
                "new"   => '@NeoxDashBoardBundle/neox_dash_setup/new.html.twig',
                // only form
                "_form" => '@NeoxDashBoardBundle/neox_dash_setup/_form.html.twig',
                // name route without _index | _new ....
                "route" => 'app_neox_dash_setup'
            ];
            // build entity
            $neoxDashSetup = new NeoxDashSetup();

            // build Form entity Generic
            $form = $this->formHandlerService->handleCreateForm($neoxDashSetup, NeoxDashSetupType::class, $setup);

            // Build form
            $form->handleRequest($request);

            /*
             * Call to the generic form management service, with support for turbo-stream
             * For kipping this code flexible to return your need
             */
            [$return, $form]  = $this->formHandlerService->handleForm($request, $form, $neoxDashSetup, $setup);
            return match ($return[ "status" ]) {
                "redirect"  => $return[ "submit" ] ? $this->redirectToRoute($setup["route"] . '_index') : null,
                "ajax"      => $return[ "submit" ] ? "ok" : $this->render($setup["_form"], [
                    'form' => $form->createView(),
                ]),
                "turbo"     => $return[ "submit" ] ? $return[ "data" ] : $this->render($setup["new"], [
                    'form' => $form->createView(),
                ]),
                default     => $this->render($setup["new"], [ 'form' => $form->createView(), ]),
            };

        }
```
This button triggers a SweetAlert notification from the **NeoxDashHeader** component.

## Changelog

- Initial beta release.
- Integrated SweetAlert notifications with UX Live Components.

## Tools

- **Reusable Bundle Generator**: A generic skeleton for creating reusable Symfony bundles (coming soon!).

## Contributing

If you want to contribute to this bundle (thank you!), please follow these guidelines:
- Submit issues or pull requests for improvements or bug fixes.

## Todo

- Consider bundling this functionality into a reusable Symfony bundle in the future.

## Thanks

Thank you for using this guide! We hope it simplifies your integration of SweetAlert with Symfony UX Live Components.