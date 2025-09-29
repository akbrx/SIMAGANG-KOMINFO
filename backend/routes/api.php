<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\StudentSubmissionController;
use App\Http\Controllers\Api\AdminSubmissionController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Di sinilah Anda dapat mendaftarkan route API untuk aplikasi Anda.
| Route ini dimuat oleh RouteServiceProvider dengan group middleware "api" 
| dan prefix URL "/api/".
|
*/

// Endpoint untuk Mahasiswa/Siswa (Guest)
// Route ini sudah memiliki prefix /api

// POST /api/submission: Endpoint untuk MENGIRIM pengajuan surat baru
Route::post('submission', [StudentSubmissionController::class, 'store']); 

// GET /api/tracking/{token}: Endpoint untuk MELACAK status surat
Route::get('tracking/{token}', [StudentSubmissionController::class, 'show']);
// Endpoint untuk Admin (Prefix /api/admin)
Route::prefix('admin')->group(function () {
    // GET /api/admin/submissions: Melihat semua pengajuan
    Route::get('submissions', [AdminSubmissionController::class, 'index']); 
    
    // PUT /api/admin/submissions/{id}: Mengubah status pengajuan
    Route::put('submissions/{id}', [AdminSubmissionController::class, 'update']); 
});