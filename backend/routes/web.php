<?php

use App\Http\Controllers\Api\StudentSubmissionController;
use Illuminate\Support\Facades\Route;

// Rute ini HANYA untuk memverifikasi magic link dan me-redirect ke frontend
Route::get('/verify-submission-link', [StudentSubmissionController::class, 'verifyLinkAndRedirect'])
    ->name('submission.verify-link') // Beri nama untuk dipanggil
    ->middleware('signed');         // WAJIB, untuk keamanan