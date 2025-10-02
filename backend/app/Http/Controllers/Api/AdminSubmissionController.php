<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Submission;
use Illuminate\Support\Facades\Validator;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\SubmissionResource;
use App\Models\Submission as SubmissionModel;


class AdminSubmissionController extends Controller
{
    // Daftar status yang valid (untuk validasi)
    private $validStatuses = ['pending', 'diproses', 'diterima', 'ditolak'];

    /**
     * [Endpoint GET /api/admin/submissions]
     * Menampilkan daftar semua pengajuan.
     */
    public function index(Request $request)
    {
        // Ambil semua submission, urutkan berdasarkan tanggal terbaru, dan ambil data student.
        $submissions = Submission::with('student')
            ->latest() // Urutkan dari yang terbaru
            ->paginate(15); // Gunakan paginate agar tidak memberatkan server

        return response()->json([
            'success' => true,
            'data' => $submissions
        ]);
    }

    /**
     * [Endpoint PUT /api/admin/submissions/{id}]
     * Mengubah status pengajuan oleh Admin.
     */
    public function update(Request $request, $id)
    {
        // 1. Validasi Input
        $validator = Validator::make($request->all(), [
            'status' => 'required|string|in:pending,diproses,diterima,ditolak',
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        // 2. Ambil data admin yang sedang login
        $admin = $request->user();

        // 3. Cari data pengajuan
        $submission = Submission::find($id);
        if (!$submission) {
            return response()->json(['success' => false, 'message' => 'Data pengajuan tidak ditemukan.'], 404);
        }   

        // 4. --- LOGIKA HYBRID ---
        
        // Cek apakah ini pertama kalinya pengajuan diproses
        if (is_null($submission->processed_at)) {
            // Jika ya, catat waktunya. Waktu ini TIDAK akan diubah lagi.
            $submission->processed_at = now();
        }
        
        // Kolom 'processed_by' SELALU di-update dengan ID admin terakhir
        // yang melakukan perubahan.
        $submission->processed_by = $admin->id;
        
        // Update status dan catatan selalu dijalankan
        $submission->status = $request->status;
        $submission->admin_notes = $request->admin_notes;
        
        $submission->save();

        // 5. Berikan response sukses
        return response()->json([
            'success' => true,
            'message' => 'Status pengajuan berhasil diperbarui.',
            'data' => new SubmissionResource($submission),
        ]);
    }
    public function downloadFile(Request $request, $id)
    {
        // 1. Cari data pengajuan berdasarkan ID
        $submission = Submission::find($id);

        // 2. Jika data pengajuan tidak ditemukan, kirim response 404
        if (!$submission) {
            return response()->json([
                'success' => false,
                'message' => 'Data pengajuan tidak ditemukan.',
            ], 404);
        }

        // 3. Cek apakah ada file yang tercatat di database dan file fisiknya ada di storage
        if (!$submission->submission_file || !Storage::disk('public')->exists($submission->submission_file)) {
            return response()->json([
                'success' => false,
                'message' => 'File untuk pengajuan ini tidak ditemukan di server.',
            ], 404);
        }

        // 4. Jika file ada, buat URL yang bisa diakses publik
        //    Pastikan kamu sudah menjalankan 'php artisan storage:link'
        $fileUrl = asset('storage/' . $submission->submission_file);

        // 5. Kirim response sukses berisi URL file
        return response()->json([
            'success' => true,
            'message' => 'URL file berhasil didapatkan.',
            'file_url' => $fileUrl,
        ]);
    }
}