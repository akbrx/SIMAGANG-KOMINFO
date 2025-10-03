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
use Illuminate\Support\Facades\Log;
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
        // 1. VALIDASI DATA MASUKAN (Tetap sama)
        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:255',
            'jurusan' => 'nullable|string|max:255',
            'nomor_telepon' => 'nullable|string|max:15',
            'email' => 'required|email|max:255',
            'asal_sekolah' => 'nullable|string|max:255',
            'durasi_magang' => 'required|string|max:100',
            'submission_file' => 'required|file|mimes:pdf,doc,docx|max:5120',
        ], [
            'submission_file.required' => 'File surat pengajuan magang wajib diunggah.',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'Validasi gagal', 'errors' => $validator->errors()], 422);
        }

        // PERUBAHAN DIMULAI DARI SINI
        DB::beginTransaction(); // Memulai transaksi database

        try {
            // 2. CARI ATAU BUAT RECORD STUDENT (LEBIH EFISIEN)
            // Menggunakan email sebagai kunci unik untuk menghindari duplikasi data student.
            $student = Student::updateOrCreate(
                ['email' => $request->email], // Kondisi pencarian
                $request->only(['nama', 'jurusan', 'nomor_telepon', 'asal_sekolah']) // Data untuk update atau create
            );

            // 3. BUAT HASH UNTUK PENGECEKAN DUPLIKASI
            $fileContent = file_get_contents($request->file('submission_file')->getRealPath());
            
            // Gabungkan semua data relevan menjadi satu string. Urutan harus konsisten!
            $dataToHash = trim($request->input('nama')) . '|' .
              trim($request->input('email')) . '|' .
              trim($request->input('jurusan')) . '|' .
              trim($request->input('asal_sekolah')) . '|' .
              trim($request->input('nomor_telepon')) . '|' .
              trim($request->input('durasi_magang')) . '|' .
              $fileContent;
            $submissionHash = hash('sha256', $dataToHash);
            // Coba cari submission terakhir dari student ini untuk perbandingan

            // 4. CEK APAKAH HASH SUDAH ADA
            $existingSubmission = Submission::where('submission_hash', $submissionHash)->first();

            if ($existingSubmission) {
                // JIKA SUDAH ADA, kembalikan token yang lama tanpa membuat data baru
                DB::rollBack(); // Batalkan transaksi karena tidak ada data baru yang dibuat
                return response()->json([
                    'success' => true,
                    'message' => 'Pengajuan dengan data identik sudah pernah ada. Berikut adalah token lacak Anda.',
                    'unique_token' => $existingSubmission->unique_token,
                ]);
            }

            // 5. JIKA HASH BELUM ADA, LANJUTKAN PROSES SEPERTI BIASA
            $file = $request->file('submission_file');
            $filePath = $file->store('submissions', 'public');

            $uniqueToken = $this->generateUniqueToken();

            Submission::create([
                'student_id' => $student->id,
                'unique_token' => $uniqueToken,
                'submission_hash' => $submissionHash, // <-- SIMPAN HASH DI SINI
                'durasi_magang' => $request->durasi_magang,
                'submission_file' => $filePath,
                'status' => 'DIAJUKAN', // Status awal
            ]);

            DB::commit(); // Konfirmasi semua perubahan di database

            // 6. RESPONSE SUKSES
            return response()->json([
                'success' => true,
                'message' => 'Pengajuan surat berhasil diunggah. Mohon simpan token unik ini untuk melacak status surat Anda.',
                'unique_token' => $uniqueToken,
            ], 201);

        } catch (Exception $e) {
            DB::rollBack();
            if (isset($filePath)) {
                Storage::disk('public')->delete($filePath);
            }
            
            // Log error untuk debugging
            Log::error('Error saat submission: ' . $e->getMessage());

            return response()->json(['success' => false, 'message' => 'Terjadi kesalahan pada server.'], 500);
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
                'admin_notes' => $submission->admin_notes,
                'student_name' => $submission->student->nama, // Ambil nama student
                'student_email' => $submission->student->email, // Ambil email student
                'asal_sekolah' => $submission->student->asal_sekolah, // Ditambahkan
                'jurusan' => $submission->student->jurusan,       // Ditambahkan
                'file_url' => $submission->submission_file ? asset('storage/' . $submission->submission_file) : null,                      // Ditambahkan
                'created_at' => $submission->created_at->format('d M Y H:i'), // Ditambahkan
                'processed_at' => $submission->processed_at ? $submission->processed_at->format('d M Y H:i') : null,
            ]
        ]);
    }
}