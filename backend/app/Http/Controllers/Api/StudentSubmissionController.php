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
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Mail;
use App\Mail\SubmissionTrackingLinkMail;
use Carbon\Carbon;

class StudentSubmissionController extends Controller
{
    private function generateUniqueToken()
    {
        do {
            $token = Str::random(10);
        } while (Submission::where('unique_token', $token)->exists());
        return $token;
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'jurusan' => 'nullable|string|max:255',
            'nomor_telepon' => 'nullable|string|max:15',
            'asal_sekolah' => 'nullable|string|max:255',
            'durasi_magang' => 'required|string|max:100',
            'submission_file' => 'required|file|mimes:pdf,doc,docx|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'Validasi gagal', 'errors' => $validator->errors()], 422);
        }

        // Cek apakah email sudah ada. Ini adalah logika pengamanan utama.
        $studentExists = Student::where('email', $request->email)->exists();

        if ($studentExists) {
            // Jika email sudah ada, JANGAN BUAT SUBMISSION BARU.
            // Kirim magic link untuk verifikasi dan pengelolaan.
            $this->sendTrackingLink($request);
            return response()->json([
                'success' => true,
                'email_exists' => true,
                'message' => 'Email ini sudah terdaftar. Kami telah mengirimkan tautan ke email Anda untuk mengelola pengajuan yang sudah ada.',
            ]);
        }

        // Jika email benar-benar baru, lanjutkan membuat pengajuan.
        DB::beginTransaction();
        try {
            $student = Student::create($request->only(['nama', 'email', 'jurusan', 'nomor_telepon', 'asal_sekolah']));
            $file = $request->file('submission_file');
            $filePath = $file->store('submissions', 'public');
            $uniqueToken = $this->generateUniqueToken();

            Submission::create([
                'student_id' => $student->id,
                'unique_token' => $uniqueToken,
                'durasi_magang' => $request->durasi_magang,
                'submission_file' => $filePath,
                'original_filename' => $file->getClientOriginalName(),
                'status' => 'DIAJUKAN',
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'email_exists' => false,
                'message' => 'Pengajuan berhasil diunggah. Mohon simpan ID ini untuk melacak status surat Anda.',
                'unique_token' => $uniqueToken,
            ], 201);

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error saat submission baru: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Terjadi kesalahan pada server.'], 500);
        }
    }

    public function sendTrackingLink(Request $request)
    {
        $validator = Validator::make($request->all(), ['email' => 'required|email']);
        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'Format email tidak valid.'], 422);
        }
        
        $email = $request->input('email');
        if (!Student::where('email', $email)->exists()) {
             return response()->json(['success' => false, 'message' => 'Email tidak ditemukan di sistem kami.'], 404);
        }

        $signedUrl = URL::temporarySignedRoute(
            'submission.verify-link',
            now()->addMinutes(15),
            ['email' => $email]
        );
        
        Mail::to($email)->send(new SubmissionTrackingLinkMail($signedUrl));

        return response()->json(['success' => true, 'message' => 'Tautan pelacakan telah dikirim ke email Anda.']);
    }

    public function verifyLinkAndRedirect(Request $request)
    {
        $student = Student::where('email', $request->email)->firstOrFail();

        $token = Str::random(40);
        $student->portal_token = hash('sha256', $token);
        $student->portal_token_expires_at = now()->addMinutes(5);
        $student->save();

        $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
        
        return redirect()->away($frontendUrl . '/portal?token=' . $token);
    }

    public function getSubmissionsForPortal(Request $request)
    {
        $token = $request->bearerToken();
        if (!$token) {
            return response()->json(['success' => false, 'message' => 'Unauthorized: Token tidak ada.'], 401);
        }

        $hashedToken = hash('sha256', $token);
        $student = Student::where('portal_token', $hashedToken)
                          ->where('portal_token_expires_at', '>', now())
                          ->first();
        
        if (!$student) {
            return response()->json(['success' => false, 'message' => 'Unauthorized: Token tidak valid atau sudah kedaluwarsa.'], 401);
        }

        $student->portal_token = null;
        $student->portal_token_expires_at = null;
        $student->save();

        $submissions = Submission::where('student_id', $student->id)->with('student')->latest()->get();
        return response()->json(['success' => true, 'data' => $submissions]);
    }

    public function update(Request $request, $token)
    {
        $submission = Submission::where('unique_token', $token)->firstOrFail();
        if ($submission->status !== 'DIAJUKAN') {
            return response()->json(['success' => false, 'message' => 'Pengajuan ini sudah diproses dan tidak dapat diubah lagi.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:255',
            'jurusan' => 'nullable|string|max:255',
            'nomor_telepon' => 'nullable|string|max:15',
            'asal_sekolah' => 'nullable|string|max:255',
            'durasi_magang' => 'required|string|max:100',
            'submission_file' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();
        try {
            $submission->student->update($request->only(['nama', 'jurusan', 'nomor_telepon', 'asal_sekolah']));
            $submission->durasi_magang = $request->durasi_magang;

            if ($request->hasFile('submission_file')) {
                Storage::disk('public')->delete($submission->submission_file);
                $newFilePath = $request->file('submission_file')->store('submissions', 'public');
                $submission->submission_file = $newFilePath;
                $submission->original_filename = $request->file('submission_file')->getClientOriginalName();
            }
            $submission->save();
            DB::commit();

            return response()->json(['success' => true, 'message' => 'Data pengajuan berhasil diperbarui.']);
        } catch (Exception $e) {
            DB::rollBack();
            Log::error("Gagal update submission {$token}: " . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Terjadi kesalahan pada server.'], 500);
        }
    }

    public function show($token)
    {
        if (!preg_match('/^[a-zA-Z0-9]{10}$/', $token)) {
            return response()->json(['success' => false, 'message' => 'Format token pengajuan tidak valid.'], 400);
        }

        $submission = Submission::where('unique_token', $token)->with('student')->first();
        if (!$submission) {
            return response()->json(['success' => false, 'message' => 'Token pengajuan tidak ditemukan atau tidak valid.'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'token' => $submission->unique_token,
                'status' => ucfirst($submission->status),
                'durasi_magang' => $submission->durasi_magang,
                'admin_notes' => $submission->admin_notes,
                'student_name' => $submission->student->nama,
                'student_email' => $submission->student->email,
                'asal_sekolah' => $submission->student->asal_sekolah,
                'jurusan' => $submission->student->jurusan,
                'file_url' => $submission->submission_file ? Storage::url($submission->submission_file) : null,
                'created_at' => $submission->created_at,
                'processed_at' => $submission->processed_at,
                'updated_at' => $submission->updated_at,
                'accepted_at' => $submission->accepted_at,
                'rejected_at' => $submission->rejected_at,
            ]
        ]);
    }
}