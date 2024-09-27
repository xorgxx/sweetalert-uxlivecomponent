<?php

    namespace App\Controller;


    use App\Services\FormHandlerService;
    use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

    #[Route('/index')]
    final class NeoxDashSetupController extends AbstractController
    {

        public function __construct(readonly private FormHandlerService $formHandlerService)
        {
        }


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


        #[Route('/{id}/edit', name: 'app_neox_dash_setup_edit', methods: [
            'GET', 'POST'
        ])]
        public function edit(Request $request, NeoxDashSetup $neoxDashSetup): Response | JsonResponse
        {
            
            // Determine the template to use for rendering
            $setup = [
                // full html form
                "new"   => '@NeoxDashBoardBundle/neox_dash_setup/edit.html.twig',
                // only form
                "_form" => '@NeoxDashBoardBundle/neox_dash_setup/_form.html.twig',
                // name route without _index | _new ....
                "route" => 'app_neox_dash_setup'
            ];

            // build Form entity Generic
            $form = $this->formHandlerService->handleCreateForm($neoxDashSetup, NeoxDashSetupType::class, $setup);

            // Merge form
            $form->handleRequest($request);

            /*
             * Call to the generic form management service, with support for turbo-stream
             * For kipping this code flexible to return your need
             */
            [$return, $form] = $this->formHandlerService->handleForm($request, $form, $neoxDashSetup, $setup);
            return match ($return[ "status" ]) {
                "redirect"  => $return[ "submit" ] ? $this->redirectToRoute($setup["route"] . '_index') : null,
                "ajax"      => $return[ "submit" ] ? new JsonResponse(true) : $this->render($setup["_form"], [
                    'form' => $form->createView(),
                ]),
                "turbo"     => $return[ "submit" ] ? $return[ "data" ] : $this->render($setup["new"], [
                    'form' => $form->createView(),
                ]),
                default     => $this->render($setup["new"], [ 'form' => $form->createView(), ]),
            };
        }

    }
