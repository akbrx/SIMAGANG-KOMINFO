<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Submission;

class Student extends Model
{
    use HasFactory;
    protected $fillable = [
        'nama',
        'jurusan',
        'nomor_telepon',
        'email',
        'created_at',
        'updated_at'
    ];
    protected $casts = [
        'created_at'      => 'datetime:d F Y H:i', // Ini untuk created_at
        'updated_at'      => 'datetime:d F Y H:i',
    ];
    
    public function submissions()
    {
        return $this->hasMany(Submission::class);
    }
}
