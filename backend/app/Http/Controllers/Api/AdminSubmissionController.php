<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Submission;
use Illuminate\Support\Facades\Validator;
use Exception;

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
        // 1. Validasi Input Admin
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:' . implode(',', $this->validStatuses),
            'admin_notes' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            // 2. Cari Submission
            $submission = Submission::find($id);

            if (!$submission) {
                return response()->json([
                    'success' => false,
                    'message' => 'Pengajuan tidak ditemukan.'
                ], 404);
            }

            // 3. Update Status dan Catatan
            $submission->update([
                'status' => $request->status,
                'admin_notes' => $request->admin_notes,
                'processed_at' => now(), // Catat waktu diproses
            ]);

            // 4. Response Sukses
            return response()->json([
                'success' => true,
                'message' => 'Status pengajuan berhasil diperbarui.',
                'data' => $submission->load('student') // Muat ulang dengan data student
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat memperbarui status: ' . $e->getMessage(),
            ], 500);
        }
    }
}