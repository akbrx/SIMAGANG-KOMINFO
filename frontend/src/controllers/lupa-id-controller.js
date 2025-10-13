// /src/controllers/lupa-token-controller.js

import { LupaIdView } from "../views/lupa-id-view.js"; // DIUBAH
import { LupaIdModel } from "../models/lupa-id-model.js"; // DIUBAH
import { showNotification } from "../app.js";

export class LupaIdController {
  constructor() {
    this.view = new LupaIdView();
    this.model = new LupaIdModel();
  }

  showLupaIdPage() {
    this.view.render();
    this.setupEventListeners(); // Panggil fungsi untuk menghidupkan form
  }

  setupEventListeners() {
    const form = document.getElementById("form-lupa-id");
    if (!form) return;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const emailInput = document.getElementById("email-input");
      const submitButton = form.querySelector('button[type="submit"]');
      const email = emailInput.value;

      const originalButtonHTML = submitButton.innerHTML;

      // Tampilkan status loading
      submitButton.disabled = true;
      submitButton.classList.add("button--loading"); // Tambah class untuk centering
      submitButton.innerHTML = '<div class="button-loader"></div>';

      try {
        const result = await this.model.kirimLink(email);

        if (result.success) {
          // Tipe 'success' untuk pesan berhasil
          showNotification("Permintaan Berhasil", result.message, "success");
        } else {
          // Tipe 'warning' untuk pesan informasi
          showNotification("Informasi", result.message, "warning");
        }

        emailInput.value = "";
      } catch (error) {
        // Tipe 'warning' atau 'error' untuk kesalahan
        showNotification("Terjadi Kesalahan", error.message, "warning");
      } finally {
        // Kembalikan tombol ke kondisi semula
        submitButton.disabled = false;
        submitButton.classList.remove("button--loading"); // Hapus class loading
        submitButton.innerHTML = originalButtonHTML;
      }
    });
  }
}
