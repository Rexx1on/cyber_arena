function oyuncuListesiniOku() {
    try {
        const kayitlar = JSON.parse(localStorage.getItem("oyuncular") || "[]");
        return Array.isArray(kayitlar) ? kayitlar : [];
    } catch {
        return [];
    }
}

let oyuncuListesi = oyuncuListesiniOku();

function oyuncuKaydet(olay) {
    olay.preventDefault();

    const form = olay.currentTarget;
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const ad = document.getElementById("adSoyad").value.trim();
    const nickname = document.getElementById("nickname").value.trim();
    const yas = document.getElementById("yas").value;
    const eposta = document.getElementById("eposta").value.trim();
    const oyunAdi = document.getElementById("oyunSecim").value;
    const katilimTuru = document.querySelector('input[name="katilim"]:checked')?.value || "Bireysel";

    if (!ad || !nickname || !yas || !eposta || !oyunAdi) {
        alert("Lütfen tüm alanları doldurun.");
        return;
    }

    oyuncuListesi = oyuncuListesiniOku();
    oyuncuListesi.push({ adSoyad: ad, nickname, yas, eposta, oyunAdi, katilimTuru });
    try {
        localStorage.setItem("oyuncular", JSON.stringify(oyuncuListesi));
    } catch {
        alert("Kayıt tarayıcıya kaydedilemedi. Tarayıcı depolama ayarlarını kontrol edin.");
        return;
    }
    alert(`Tebrikler ${nickname}! Turnuva kaydınız başarıyla alındı.`);
    window.location.assign(new URL("takimlar.html", window.location.href));
}

function tabloyuDoldur() {
    const tabloGovdesi = document.getElementById("tabloGovdesi");
    const sayac = document.getElementById("oyuncuSayisi");
    if (!tabloGovdesi || !sayac) return;

    oyuncuListesi = oyuncuListesiniOku();
    sayac.textContent = String(oyuncuListesi.length);
    tabloGovdesi.replaceChildren();

    if (oyuncuListesi.length === 0) {
        const satir = document.createElement("tr");
        const hucre = document.createElement("td");
        hucre.colSpan = 7;
        hucre.textContent = "Henüz kayıtlı oyuncu bulunmuyor.";
        satir.append(hucre);
        tabloGovdesi.append(satir);
        return;
    }

    oyuncuListesi.forEach((oyuncu, sira) => {
        const satir = document.createElement("tr");
        [sira + 1, oyuncu.nickname, oyuncu.adSoyad, oyuncu.yas, oyuncu.oyunAdi, oyuncu.katilimTuru, oyuncu.eposta].forEach((deger) => {
            const hucre = document.createElement("td");
            hucre.textContent = String(deger ?? "");
            satir.append(hucre);
        });
        tabloGovdesi.append(satir);
    });
}

function verileriTemizle() {
    if (!confirm("Tüm turnuva kayıtlarını silmek istediğinize emin misiniz?")) return;
    localStorage.removeItem("oyuncular");
    oyuncuListesi = [];
    tabloyuDoldur();
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("kayitFormu");
    if (form) form.addEventListener("submit", oyuncuKaydet);
    tabloyuDoldur();
});
