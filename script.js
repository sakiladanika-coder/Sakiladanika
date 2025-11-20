
        // Codingan ini dipakai biar JavaScript nunggu dulu sampai halaman webnya benar-benar muncul semua.
        document.addEventListener('DOMContentLoaded', function() {
            
            // Codingan ini buat ngambil elemen penting di kalkulator seperti layar angka, gambar status, dan semua tombol.
            const display = document.getElementById('display');
            const statusImage = document.getElementById('statusImage');
            const buttons = document.querySelectorAll('.btn-calc');

            //   Tiga gambar ini disiapin untuk nunjukin kondisi kalkulator: normal, sukses, atau error. 
            const imgNormal = 'https://placehold.co/400x100/374151/E5E7EB?text=Kalkulator';
            const imgSuccess = 'https://placehold.co/400x100/16A34A/FFFFFF?text=Sukses!';
            const imgError = 'https://placehold.co/400x100/DC2626/FFFFFF?text=Error!';

            /**
               Fungsi ini buat ganti gambar status sesuai keadaan kalkulator: sukses (hijau), error (merah), normal (abu). 
             */
            function changeImage(state) {
                if (state === 'success') {
                    statusImage.src = imgSuccess;
                    statusImage.alt = "Perhitungan Sukses";
                } else if (state === 'error') {
                    statusImage.src = imgError;
                    statusImage.alt = "Error Perhitungan";
                } else {
                    //  Kalau nggak sukses atau error, dia balik ke gambar normal lagi.
                    statusImage.src = imgNormal;
                    statusImage.alt = "Status Kalkulator";
                }
            }

            /**
              Fungsi ini buat hapus semua isi layar, dan balikin gambar status ke normal.
             */
            function clearDisplay() {
                display.value = '';
                changeImage('normal'); // Memanggil function untuk merubah gambar
            }

            /**
              Fungsi ini buat ngapus satu karakter terakhir, kayak tombol backspace.
             */
            function deleteLastChar() {
                display.value = display.value.slice(0, -1);
            }

            /**
              Fungsi ini buat nambahin angka atau operator ke layar.
             */
            function appendToDisplay(value) {
                display.value += value;
            }

            /**
               Fungsi ini function utama buat ngitung hasil kalkulator: dia yang ngitung hasilnya. Kalau kosong error. Kalau bisa dihitung tampilkan hasil. Kalau ada salah tampil error dan reset.
             */
            function calculateResult() {
                //  Kalau layar kosong, dianggap error.
                if (display.value === '') {
                    changeImage('error');
                    display.value = 'Kosong!';
                    //  Setelah 1,5 detik layarnya dibersihkan otomatis.
                    setTimeout(clearDisplay, 1500);
                    return;
                }

                try {
                    // Kodingan ini buat ngitung isi layar eval()
                    let result = eval(display.value
                        .replace(/%/g, '/100') //  Di sini kalkulator mulai ngitung. Tanda % diubah jadi /100 biar bisa hitung persen. 
                    ); 
                    
                    //  Kalau hasilnya angka valid, tampilkan. Kalau nggak valid, lempar error.
                    if (isFinite(result)) {
                        display.value = result;
                        changeImage('success'); //  Mengubah gambar jadi sukses
                    } else {
                        throw new Error("Hasil tidak valid");
                    }

                } catch (error) {
                    console.error("Error kalkulasi:", error);
                    display.value = 'Error';
                    changeImage('error'); //  Gambar menjadi error
                    setTimeout(clearDisplay, 1500);
                }
            }


            //  Bagian ini ngecek tombol apa yang ditekan, terus menjalankan fungsinya.
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    const value = button.getAttribute('data-value');

                    //  Ini bagian logika tombol: C buat hapus semua, DEL hapus satu, = hitung.
                    switch(value) {
                        case 'C':
                            //  Kalau tekan C, layar dibersihin total 
                            clearDisplay();
                            break;
                        case 'DEL':
                            //  Kalau tekan DEL, hapus 1 karakter paling belakang
                            deleteLastChar();
                            break;
                        case '=':
                            //  Kalau tekan =, kalkulator melakukan perhitungan
                            calculateResult();
                            break;
                        default:
                            //  Kalau barusan sukses/error, layar dibersihin dulu baru nambah angka baru.
                            if (statusImage.src === imgSuccess || statusImage.src === imgError) {
                                clearDisplay();
                            }
                            appendToDisplay(value);
                            break;
                    }
                });
            });

            //  Ini supaya kalkulator bisa dipakai lewat keyboard: angka, operator, enter, dll.
            document.addEventListener('keydown', (e) => {
                const key = e.key;

                if (key >= '0' && key <= '9' || key === '.' || key === '+' || key === '-' || key === '*' || key === '/' || key === '%') {
                    if (statusImage.src === imgSuccess || statusImage.src === imgError) {
                        clearDisplay();
                    }
                    appendToDisplay(key);
                    e.preventDefault();
                } else if (key === 'Enter' || key === '=') {
                    calculateResult();
                    e.preventDefault();
                } else if (key === 'Backspace') {
                    deleteLastChar();
                    e.preventDefault();
                } else if (key === 'Escape' || key.toLowerCase() === 'c') {
                    clearDisplay();
                    e.preventDefault();
                }
            });

        });
   