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
    protected $guarded = [
        'id',
    ];

    protected $casts = [
        'processed_at'  => 'datetime',
        'created_at'    => 'datetime',
        'updated_at'    => 'datetime',
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
