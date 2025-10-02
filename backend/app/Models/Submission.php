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
        'start_date',
        'end_date',
        'submission_file',
        'submission_date',
        'status',
        'admin_notes',
        'processed_by',
        'processed_at',
    ];

    protected $casts = [
        'processed_at'    => 'datetime:d F Y H:i', // <<< INI UNTUK processed_at
        'created_at'      => 'datetime:d F Y H:i', // Ini untuk created_at
        'updated_at'      => 'datetime:d F Y H:i',
    ];
    protected function serializeDate(\DateTimeInterface $date)
    {
        return Carbon::parse($date)->setTimezone(config('app.timezone'))->format('d F Y H:i');
    }

    

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
