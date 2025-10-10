<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SubmissionTrackingLinkMail extends Mailable
{
    use Queueable, SerializesModels;

    public $signedUrl;

    public function __construct(string $signedUrl)
    {
        $this->signedUrl = $signedUrl;
    }

    public function build()
    {
        return $this->subject('Tautan Aman untuk Mengelola Pengajuan Anda')
                    ->view('emails.submission-tracking-link');
    }
}