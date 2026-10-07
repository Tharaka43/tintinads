<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$controller = new App\Http\Controllers\AdminAgentController();
$response = $controller->index(new Illuminate\Http\Request());
echo $response->getContent();
