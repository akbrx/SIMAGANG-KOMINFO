<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use App\Models\Student;
use App\Models\Submission;
use Exception;
use Illuminate\Support\Facades\DB;

class StudentSubmissionController extends Controller
{
    /**
     * Helper function untuk men-generate token unik
     * agar tidak ada duplikasi di tabel submissions.
     */
    private function generateUniqueToken()
    {
        do {
            // Generate string acak sepanjang 10 karakter
            $token = Str::random(10);
        } while (Submission::where('unique_token', $token)->exists()); // Pastikan belum ada di database

        return $token;
    }

    /**
     * [Endpoint POST /api/submission]
     * Menerima pengajuan surat magang dari mahasiswa/siswa.
     */
    public function store(Request $request)
    {
        // 1. VALIDASI DATA MASUKAN
        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:255',
            'jurusan' => 'nullable|string|max:255',
            'nomor_telepon' => 'nullable|string|max:15',
            'email' => 'required|email|max:255', 
            'asal_sekolah' => 'nullable|string|max:255',
            'durasi_magang' => 'required|string|max:100',
            'submission_file' => 'required|file|mimes:pdf,doc,docx|max:5120', // Maks 5MB
        ], [
            // Pesan Error dalam Bahasa Indonesia
            'submission_file.required' => 'File surat pengajuan magang wajib diunggah.',
            // ... pesan error lain sesuai kebutuhan
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            // 2. SELALU BUAT RECORD STUDENT BARU UNTUK SETIAP PENGAJUAN
            // Ini memungkinkan mahasiswa mengajukan ulang jika token lama hilang.
            $student = Student::create(
                $request->only(['nama', 'jurusan', 'nomor_telepon', 'email', 'asal_sekolah'])
            );
            
            // 3. FILE UPLOAD
            $file = $request->file('submission_file');
            // Simpan file ke folder 'public/submissions'
            $filePath = $file->store('submissions', 'public'); 

            // 4. GENERATE TOKEN UNIK
            $uniqueToken = $this->generateUniqueToken();

            // 5. SIMPAN SUBMISSION BARU
            $submission = Submission::create([
                'student_id' => $student->id,
                'unique_token' => $uniqueToken,
                'durasi_magang' => $request->durasi_magang,
                'submission_file' => $filePath, // Simpan path file
                'status' => 'pending', // Default status
            
            ]);
            DB::commit();

            // 6. RESPONSE SUKSES
            return response()->json([
                'success' => true,
                'message' => 'Pengajuan surat berhasil diunggah. Mohon simpan token unik ini untuk melacak status surat Anda.',
                'unique_token' => $uniqueToken,
            ], 201);

        } catch (Exception $e) {
            DB::rollBack(); // Jika ada error, batalkan semua perubahan di database
                // Tambahkan logika untuk menghapus file yang mungkin sudah terlanjur terupload
            if (isset($filePath)) {
                Storage::disk('public')->delete($filePath);
            }
            // Error handling jika ada masalah server
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat memproses pengajuan: ' . $e->getMessage(),
            ], 500);
        }

    }

    /**
     * [Endpoint GET /api/tracking/{token}]
     * Menampilkan status pengajuan berdasarkan token unik.
     */
    public function show($token)
    {
        // 1. Validasi Token (Memastikan formatnya sesuai dengan Str::random(10))
        if (!preg_match('/^[a-zA-Z0-9]{10}$/', $token)) {
            return response()->json([
                'success' => false,
                'message' => 'Format token pengajuan tidak valid.'
            ], 400); // 400 Bad Request
        }
        // Cari submission berdasarkan unique_token
        $submission = Submission::where('unique_token', $token)
                                ->with('student') // Ambil data student sekalian
                                ->first();

        if (!$submission) {
            return response()->json([
                'success' => false,
                'message' => 'Token pengajuan tidak ditemukan atau tidak valid.',
            ], 404);
        }

        // Tampilkan data yang relevan untuk tracking
        return response()->json([
            'success' => true,
            'data' => [
                'token' => $submission->unique_token,
                'status' => ucfirst($submission->status), // Uppercase first letter
                'durasi_magang' => $submission->durasi_magang,
                'processed_at' => $submission->processed_at ? $submission->processed_at->format('d M Y H:i') : null,
                'admin_notes' => $submission->admin_notes,
                'student_name' => $submission->student->nama, // Ambil nama student
                'student_email' => $submission->student->email, // Ambil email student
            ]
        ]);
    }
}