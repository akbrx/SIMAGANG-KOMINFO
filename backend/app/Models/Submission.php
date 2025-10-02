<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Student;
use Carbon\Carbon;

class Submission extends Model
{
    use HasFactory;

    // Tambahkan kolom yang bisa diisi
    protected $fillable = [
        'student_id',
        'unique_token', 
        'durasi_magang',
        'submission_file',
        'status',
        'admin_notes',
        'processed_by',
        'processed_at',
    ];

    protected $casts = [
        // 'processed_at'  => 'datetime:d F Y H:i',
        // 'created_at'    => 'datetime:d F Y H:i',
        // 'updated_at'    => 'datetime:d F Y H:i',
        'processed_at'  => 'datetime',
        'created_at'    => 'datetime',
        'updated_at'    => 'datetime',
    ];


    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
