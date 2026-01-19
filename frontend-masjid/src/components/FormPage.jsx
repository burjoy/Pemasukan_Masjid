import { useState } from "react";

function FormPage() {
  const [namaKeluarga, setNamaKeluarga] = useState("");
  const [jumlahAnggotaKeluarga, setJumlahAnggotaKeluarga] = useState(0);
  const [tanggal, setTanggal] = useState("");
  const [pemasukan, setPemasukan] = useState(0);
  const [showContinuation, setShowContinuation] = useState(false);
  const [zakatEntries, setZakatEntries] = useState([]);

  const handleInitialSubmit = (e) => {
    e.preventDefault();

    if (!namaKeluarga || jumlahAnggotaKeluarga < 1 || !tanggal) {
      alert("Please fill in all required fields");
      return;
    }

    const entries = Array.from({ length: jumlahAnggotaKeluarga }, () => ({
      tipe: "uang",
      jumlah: "",
      satuan: "Rupiah",
      karat: ""
    }));

    setZakatEntries(entries);
    setShowContinuation(true);
  };

  const handleTipeChange = (index, value) => {
    const updatedEntries = [...zakatEntries];
    updatedEntries[index].tipe = value;

    if (value === "uang") {
      updatedEntries[index].satuan = "Rupiah";
      updatedEntries[index].karat = "";
    } else if (value === "beras") {
      updatedEntries[index].satuan = "Kilogram";
      updatedEntries[index].karat = "";
    } else if (value === "emas") {
      updatedEntries[index].satuan = "Gram";
      updatedEntries[index].karat = "24";
    }

    setZakatEntries(updatedEntries);
  };

  const handleNamaKeluargaChange = (index, value) => {
    const updatedEntries = [...zakatEntries];
    updatedEntries[index].namaKeluarga = value;
    setZakatEntries(updatedEntries);
  }

  const handleJumlahChange = (index, value) => {
    const updatedEntries = [...zakatEntries];
    updatedEntries[index].jumlah = value;
    setZakatEntries(updatedEntries);
  };

  const handleKaratChange = (index, value) => {
    const updatedEntries = [...zakatEntries];
    updatedEntries[index].karat = value;
    setZakatEntries(updatedEntries);
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();

    const allFilled = zakatEntries.every(entry => {
      if (entry.tipe === "emas") {
        return entry.jumlah && entry.karat;
      }
      return entry.jumlah;
    });

    if (!allFilled) {
      alert("Please fill in all zakat entries");
      return;
    }

    console.log("Final submission:", {
      namaKeluarga,
      totalPemasukan: pemasukan,
      zakatEntries
    });

    console.log("Form submitted:", zakatEntries);

    alert("Form submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-8 sm:px-8">
            <h2 className="text-3xl font-bold text-white text-center">
              Form Zakat/Sedekah
            </h2>
            <p className="mt-2 text-emerald-50 text-center text-sm sm:text-base">
              Silakan isi formulir di bawah ini dengan lengkap
            </p>
          </div>

          <div className="px-6 py-8 sm:px-8">
            {!showContinuation ? (
              <form onSubmit={handleInitialSubmit} className="space-y-6">
                <div>
                  <label htmlFor="namaKeluarga" className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Keluarga <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="namaKeluarga"
                    type="text"
                    placeholder="Masukkan nama keluarga"
                    value={namaKeluarga}
                    onChange={(e) => setNamaKeluarga(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="tanggal" className="block text-sm font-semibold text-gray-700 mb-2">
                    Tanggal <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="Tanggal"
                    type="date"
                    placeholder="Masukkan tanggal"
                    value={tanggal || ""}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                    required
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Masukkan Tanggal
                  </p>
                </div>

                <div>
                  <label htmlFor="jumlah_anggota_keluarga" className="block text-sm font-semibold text-gray-700 mb-2">
                    Jumlah Anggota Keluarga <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="jumlah_anggota_keluarga"
                    type="number"
                    min={0}
                    max={10}
                    placeholder="Masukkan jumlah anggota keluarga"
                    value={jumlahAnggotaKeluarga || ""}
                    onChange={(e) => setJumlahAnggotaKeluarga(Number(e.target.value))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                    required
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Masukkan jumlah anggota keluarga Anda
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Lanjutkan
                </button>
              </form>
            ) : (
              <form onSubmit={handleFinalSubmit} className="space-y-8">
                <div className="bg-emerald-50 border-l-4 border-emerald-600 p-4 rounded-r-lg">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <p className="text-sm font-medium text-emerald-900">
                      <span className="font-semibold">Nama Keluarga:</span> {namaKeluarga}
                    </p>
                    <p className="text-sm font-medium text-emerald-900">
                      <span className="font-semibold">Jumlah Anggota Keluarga:</span> {jumlahAnggotaKeluarga}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-800 pb-2 border-b-2 border-emerald-200">
                    Detail Zakat/Sedekah
                  </h3>

                  {zakatEntries.map((entry, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-xl p-6 space-y-4 border-2 border-gray-200 hover:border-emerald-300 transition-all"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-700">
                          Kategori {index + 1}
                        </h4>
                        <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-3 py-1 rounded-full">
                          {entry.tipe.charAt(0).toUpperCase() + entry.tipe.slice(1)}
                        </span>
                      </div>

                      <div>
                          <label htmlFor={`namaKeluarga-${index}`} className="block text-sm font-semibold text-gray-700 mb-2">
                            Nama Anggota Keluarga <span className="text-red-500">*</span>
                          </label>
                          <input
                            id={`namaKeluarga-${index}`}
                            type="name"
                            value={entry.namaKeluarga}
                            onChange={(e) => handleNamaKeluargaChange(index, e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                            required
                          />
                        </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor={`tipe-${index}`} className="block text-sm font-semibold text-gray-700 mb-2">
                            Tipe Pemasukan <span className="text-red-500">*</span>
                          </label>
                          <select
                            id={`tipe-${index}`}
                            value={entry.tipe}
                            onChange={(e) => handleTipeChange(index, e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none bg-white"
                            required
                          >
                            <option value="uang">Uang</option>
                            <option value="beras">Beras</option>
                            <option value="emas">Emas</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor={`jumlah-${index}`} className="block text-sm font-semibold text-gray-700 mb-2">
                            Jumlah yang Dikeluarkan ({entry.satuan}) <span className="text-red-500">*</span>
                          </label>
                          <input
                            id={`jumlah-${index}`}
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder={`Jumlah dalam ${entry.satuan}`}
                            value={entry.jumlah}
                            onChange={(e) => handleJumlahChange(index, e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                            required
                          />
                        </div>

                        {entry.tipe === "emas" && (
                          <div className="sm:col-span-2">
                            <label htmlFor={`karat-${index}`} className="block text-sm font-semibold text-gray-700 mb-2">
                              Karat Emas <span className="text-red-500">*</span>
                            </label>
                            <select
                              id={`karat-${index}`}
                              value={entry.karat}
                              onChange={(e) => handleKaratChange(index, e.target.value)}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none bg-white"
                              required
                            >
                              <option value="24">24 Karat</option>
                              <option value="22">22 Karat</option>
                              <option value="20">20 Karat</option>
                              <option value="18">18 Karat</option>
                              <option value="16">16 Karat</option>
                              <option value="14">14 Karat</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowContinuation(false);
                      setZakatEntries([]);
                    }}
                    className="w-full sm:w-auto px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200"
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Submit
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormPage;
