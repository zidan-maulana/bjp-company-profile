export type Locale = "id" | "en";

export interface Translations {
  nav: {
    about: string;
    services: string;
    standards: string;
    portfolio: string;
    contact: string;
    cta: string;
  };
  hero: {
    headlineLine1: string;
    headlineLine2: string;
    stat1Value: string;
    stat1Label: string;
    stat2Value: string;
    stat2Label: string;
    specBadge: string;
    specDesc: string;
    ctaConsult: string;
    ctaPortfolio: string;
  };
  about: {
    eyebrow: string;
    statement: string;
    titleLine1: string;
    titleLine2: string;
    desc1: string;
    desc2: string;
    quoteText: string;
    quoteAuthor: string;
    quoteRole: string;
    milestone1Year: string;
    milestone1Title: string;
    milestone1Desc: string;
    milestone2Year: string;
    milestone2Title: string;
    milestone2Desc: string;
    milestone3Year: string;
    milestone3Title: string;
    milestone3Desc: string;
  };
  services: {
    eyebrow: string;
    title: string;
    subtitle: string;
    titleSection: string;
    contactBtn: string;
    ctaText: string;
    items: {
      id: string;
      number: string;
      title: string;
      subtitle: string;
      desc: string;
      capabilities: string[];
    }[];
  };
  standards: {
    eyebrow: string;
    title: string;
    editorial: string;
    btnServices: string;
    btnContact: string;
    cards: {
      id: string;
      title: string;
      desc: string;
      badges: string[];
    }[];
  };
  portfolio: {
    eyebrow: string;
    title: string;
    subtitle: string;
    pageLabel: string;
    prevBtn: string;
    nextBtn: string;
    items: {
      id: string;
      title: string;
      spec: string;
      image: string;
    }[];
  };
  consultation: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    subtitleLine1: string;
    subtitleLine2: string;
    subtitleLine3: string;
    directChatLabel: string;
    directChatDesc: string;
    directChatBtn: string;
    formTitle: string;
    formSubtitle: string;
    labels: {
      name: string;
      email: string;
      phone: string;
      company: string;
      service: string;
      specs: string;
    };
    placeholders: {
      name: string;
      email: string;
      phone: string;
      company: string;
      specs: string;
    };
    serviceOptions: {
      injection: string;
      blowing: string;
      cnc: string;
      trial: string;
      repair: string;
    };
    submitBtn: string;
    submittingBtn: string;
    successTitle: string;
    successDesc: string;
    sendAnother: string;
  };
  footer: {
    block1Title: string;
    block2Title: string;
    block3Title: string;
    links: {
      about: string;
      standards: string;
      portfolio: string;
      contact: string;
      serviceInjection: string;
      serviceBlowing: string;
      serviceCnc: string;
      serviceModif: string;
      steel: string;
      tolerance: string;
      dfm: string;
      warranty: string;
      linkedin: string;
      whatsapp: string;
      instagram: string;
    };
    terms: string;
    privacy: string;
    copyright: string;
    established: string;
  };
}

export const translations: Record<Locale, Translations> = {
  id: {
    nav: {
      about: "TENTANG KAMI",
      services: "LAYANAN",
      standards: "STANDAR MUTU",
      portfolio: "PORTOFOLIO",
      contact: "KONTAK",
      cta: "MINTA PENAWARAN",
    },
    hero: {
      headlineLine1: "Fabrikasi mold presisi",
      headlineLine2: "plastik injeksi & blowing.",
      stat1Value: "100%",
      stat1Label: "Garansi Purna Jual",
      stat2Value: "24+ TAHUN",
      stat2Label: "Pengalaman Manufaktur",
      specBadge: "BAJA TOOL STEEL PREMIUM",
      specDesc: "Spesialis mold injeksi & blowing presisi tinggi dengan baja impor Stavax & DIN 1.2316 bersertifikasi resmi.",
      ctaConsult: "KONSULTASI DESAIN MOLD",
      ctaPortfolio: "LIHAT PORTOFOLIO",
    },
    about: {
      eyebrow: "SEJAK 2001 DI KALIDERES, JAKARTA BARAT",
      statement: "Beroperasi sejak 2001, Baruna Jaya Plastik memproduksi cetakan injeksi dan blowing presisi berbasis baja perkakas untuk memastikan kestabilan dimensi part serta kelancaran lini perakitan Anda.",
      titleLine1: "Dedikasi presisi tinggi untuk",
      titleLine2: "industri manufaktur plastik nasional.",
      desc1: "Baruna Jaya Plastik berawal dari bengkel perkakas presisi independen yang didirikan pada tahun 2001. Dengan konsistensi menjaga toleransi sub-mikron dan pemilihan baja bersertifikasi, kami bertransformasi menjadi mitra strategis bagi ratusan prinsipal manufaktur otomotif, kemasan konsumer, dan elektronik.",
      desc2: "Setiap cetakan yang kami bangun mengintegrasikan simulasi aliran lelehan DFM, perlakuan panas vakum bertahap, dan pemesinan CNC multi-aksial untuk memastikan umur pakai mold mencapai jutaan siklus tanpa penurunan akurasi dimensi.",
      quoteText: "Ketelitian cetakan adalah fondasi efisiensi lini produksi Anda. Kami memperlakukan setiap mikron baja sebagai komitmen kualitas jangka panjang.",
      quoteAuthor: "Bambang Sudibyo",
      quoteRole: "Kepala Rekayasa Tooling & Pendiri",
      milestone1Year: "2001",
      milestone1Title: "Pendirian Workshop Kalideres",
      milestone1Desc: "Fasilitas awal permesinan konvensional dan perkakas cetak tangan presisi didirikan.",
      milestone2Year: "2012",
      milestone2Title: "Modernisasi CNC & Wire EDM",
      milestone2Desc: "Ekspansi mesin CNC berkecepatan tinggi dan instalasi stasiun inspeksi optik digital.",
      milestone3Year: "2024",
      milestone3Title: "Fasilitas Multi-Cavity Lanjutan",
      milestone3Desc: "Implementasi hot runner multi-kavitasi dan simulasi mold flow untuk kemasan berkecepatan tinggi.",
    },
    services: {
      eyebrow: "KAPABILITAS & LAYANAN UTAMA",
      title: "Solusi cetakan terintegrasi dari desain hingga siap produksi.",
      subtitle: "Didukung armada mesin CNC, Wire Cut EDM, dan perlakuan termal terkontrol untuk memenuhi standar toleransi paling ketat.",
      titleSection: "Layanan Kami",
      contactBtn: "HUBUNGI KAMI",
      ctaText: "KONSULTASIKAN KEBUTUHAN INI",
      items: [
        {
          id: "01",
          number: "01",
          title: "Cetakan Injeksi Plastik",
          subtitle: "PLASTIC INJECTION MOLD",
          desc: "Fabrikasi mold injeksi presisi single maupun multi-cavity untuk komponen otomotif, bodi elektronik, kemasan medis, dan perlengkapan industri.",
          capabilities: [
            "Baja Stavax & DIN 1.2316",
            "Hot & Cold Runner System",
            "Multi-Cavity Presisi Tinggi",
          ],
        },
        {
          id: "02",
          number: "02",
          title: "Cetakan Blowing & Botol",
          subtitle: "PLASTIC BLOW MOLD",
          desc: "Pembuatan cetakan extrusion blow dan stretch blow untuk botol kosmetik, jeriken industri, wadah agrokimia, dan botol farmasi.",
          capabilities: [
            "Insert Pinch-Off Baja BeCu",
            "Saluran Pendingin Baffle Cepat",
            "Finishing Cavity Mirror Polish",
          ],
        },
        {
          id: "03",
          number: "03",
          title: "Pemesinan Presisi CNC & Tooling",
          subtitle: "PRECISION CNC MACHINING",
          desc: "Pemesinan komponen mold menggunakan CNC Milling, CNC Lathe, Wire Cut, dan Sinker EDM dengan toleransi hingga skala mikron.",
          capabilities: [
            "CNC Milling 3-Axis & 4-Axis",
            "Wire Cut & Sinker EDM Presisi",
            "Inspeksi Kekerasan HRC 48-52",
          ],
        },
        {
          id: "04",
          number: "04",
          title: "Servis & Modifikasi Mold",
          subtitle: "MOLD REPAIR & MODIFICATION",
          desc: "Perbaikan cepat untuk rekondisi parting line aus, penambalan cavity/core dengan las laser presisi, serta penggantian insert aus.",
          capabilities: [
            "Laser Welding & Micro TIG",
            "Rekondisi Parting Line Aus",
            "Modifikasi Core & Cavity",
          ],
        },
        {
          id: "05",
          number: "05",
          title: "Desain 3D CAD/CAM & Rekayasa",
          subtitle: "3D CAD/CAM & REVERSE DESIGN",
          desc: "Pemodelan 3D CAD/CAM dari sampel fisik atau gambar teknik 2D, analisis DFM aliran plastik, dan perancangan konstruksi mold.",
          capabilities: [
            "Reverse Engineering Sampel",
            "Analisis DFM & Mold Flow",
            "CAD 3D SolidWorks & NX",
          ],
        },
        {
          id: "06",
          number: "06",
          title: "Uji Coba & Garansi Sampel",
          subtitle: "MOLD TRIAL & QC SAMPLING",
          desc: "Uji coba cetak T0/T1 pada mesin injeksi untuk validasi parameter proses, verifikasi dimensi produk (FAI), dan penyerahan mold siap jalan.",
          capabilities: [
            "Uji Coba Cetak (Trial T0/T1)",
            "First Article Inspection (FAI)",
            "Garansi Siap Produksi Penuh",
          ],
        },
      ],
    },
    standards: {
      eyebrow: "STANDAR MUTU PRESISI",
      title: "Standar pengerjaan ketat untuk cetakan presisi tinggi.",
      editorial: "SETIAP MOLD DIKERJAKAN DENGAN SPESIFIKASI MATERIAL TERVERIFIKASI DAN KONTROL KUALITAS KETAT. DARI PEMESINAN HINGGA TRIAL AKHIR, STANDAR KAMI MEMASTIKAN CETAKAN LANGSUNG SIAP BEKERJA PADA LINI INJEKSI ANDA.",
      btnServices: "LAYANAN KAMI",
      btnContact: "HUBUNGI TIM KAMI",
      cards: [
        {
          id: "[01]",
          title: "Toleransi mikron pada geometri rumit",
          desc: "KAMI MENERAPKAN PEMESINAN CNC HIGH-SPEED, WIRE CUT, DAN SINKER EDM DENGAN TOLERANSI HINGGA ±0.01 MM UNTUK MENJAGA AKURASI PROFIL CORE DAN CAVITY.",
          badges: [
            "BAJA IMPOR BERSERTIFIKAT",
            "TOLERANSI ±0.01 MM",
            "CNC HIGH-SPEED",
            "WIRE CUT & SINKER EDM",
            "PROFIL KAVITAS PRESISI",
            "VERIFIKASI CMM / MIKRON",
          ],
        },
        {
          id: "[02]",
          title: "Transparansi progres & koordinasi teknis",
          desc: "TIM ENGINEERING KAMI MEMBERIKAN LAPORAN PROGRES BERKALA, DOKUMENTASI DFM, SERTA RESPON TEKNIS CEPAT DARI TAHAP DESAIN HINGGA MOLD DIKIRIM KE PABRIK ANDA.",
          badges: [
            "LAPORAN PROGRES RUTIN",
            "REVIEW DOKUMEN DFM",
            "KONSULTASI TEKNIK LANGSUNG",
            "JADWAL DELIVERY JELAS",
            "RESPON CEPAT WORKSHOP",
            "PENDAMPINGAN TEKNIS",
          ],
        },
        {
          id: "[03]",
          title: "Siklus injeksi cepat & ketahanan jangka panjang",
          desc: "PERANCANGAN SALURAN PENDINGIN KONFORMAL DAN HEAT TREATMENT HRC 48-52 MEMASTIKAN CYCLE TIME LEBIH SINGKAT SERTA KETAHANAN MOLD HINGGA JUTAAN SHOT.",
          badges: [
            "OPTIMASI CYCLE TIME",
            "COOLING CIRCUIT MERATA",
            "HEAT TREATMENT HRC 48-52",
            "SISTEM RUNNER EFISIEN",
            "KETAHANAN JUTAAN SHOT",
            "MINIMALISASI SINK MARK",
          ],
        },
        {
          id: "[04]",
          title: "Uji coba cetak komprehensif & garansi mold",
          desc: "SETIAP MOLD DIUJI LANGSUNG PADA MESIN INJEKSI DENGAN INSPEKSI FAI DAN PENGUKURAN DIMENSI SEBELUM SERAH TERIMA, DIDUKUNG GARANSI SERVIS LENGKAP.",
          badges: [
            "UJI TRIAL T0 / T1",
            "FIRST ARTICLE INSPECTION",
            "GARANSI FUNGSIONAL MOLD",
            "SERVIS LASER WELDING",
            "REKONDISI PARTING LINE",
            "DUKUNGAN TEKNIS PABRIK",
          ],
        },
      ],
    },
    portfolio: {
      eyebrow: "PORTOFOLIO KAMI",
      title: "Proyek fabrikasi mold untuk berbagai sektor industri.",
      subtitle: "DOKUMENTASI CETAKAN INJEKSI DAN BLOWING YANG TELAH KAMI FABRIKASI UNTUK MEMENUHI SPESIFIKASI KETAT MITRA INDUSTRI.",
      pageLabel: "HALAMAN",
      prevBtn: "Proyek sebelumnya",
      nextBtn: "Proyek selanjutnya",
      items: [
        {
          id: "01",
          title: "Mold Komponen Otomotif",
          spec: "INJECTION MOLD • 8-CAVITY • STAVAX 2316",
          image: "/portfolio/original-automotive-mold.jpg",
        },
        {
          id: "02",
          title: "Cetakan Botol Kosmetik",
          spec: "BLOW MOLD • MIRROR POLISH • PET/HDPE",
          image: "/portfolio/original-cosmetic-bottle-mold.jpg",
        },
        {
          id: "03",
          title: "Housing Konektor Presisi",
          spec: "MICRO TOLERANCE ±0.01 MM • PBT-GF",
          image: "/portfolio/original-precision-connector-mold.jpg",
        },
        {
          id: "04",
          title: "Cetakan Alat Kesehatan",
          spec: "CLEANROOM MOLD • MEDICAL GRADE PP",
          image: "/portfolio/original-medical-cleanroom-mold.jpg",
        },
        {
          id: "05",
          title: "Wadah Makanan Thin-Wall",
          spec: "HIGH-SPEED CYCLE • HOT RUNNER SYSTEM",
          image: "/portfolio/original-thinwall-food-mold.jpg",
        },
        {
          id: "06",
          title: "Insert Core & Cavity Presisi",
          spec: "CNC WIRE CUT & EDM • HARDNESS HRC 52",
          image: "/portfolio/original-cnc-wire-edm-mold.jpg",
        },
        {
          id: "07",
          title: "Tutup Botol & Flip-Top Cap",
          spec: "16-CAVITY CLOSURE • UNSCREWING MOLD",
          image: "/portfolio/original-bottle-cap-closure-mold.jpg",
        },
        {
          id: "08",
          title: "Kemasan Jeriken Industri 5L",
          spec: "EXTRUSION BLOW MOLD • HEAVY DUTY HDPE",
          image: "/portfolio/original-industrial-jerrycan-mold-v2.jpg",
        },
      ],
    },
    consultation: {
      eyebrow: "KONSULTASI TEKNIS & PENAWARAN",
      titleLine1: "Diskusikan proyek mold",
      titleLine2: "bersama tim engineering",
      subtitleLine1: "KIRIMKAN GAMBAR 2D/3D ATAU SPESIFIKASI PRODUK YANG DIBUTUHKAN.",
      subtitleLine2: "TIM TEKNIS KAMI AKAN MEREVIEW KELAYAKAN DFM",
      subtitleLine3: "DAN MENYIAPKAN ESTIMASI BIAYA SERTA JADWAL PENGERJAAN.",
      directChatLabel: "KONSULTASI CEPAT VIA WHATSAPP",
      directChatDesc: "Terhubung langsung dengan lead engineer untuk respon cepat dan pengiriman file teknis.",
      directChatBtn: "HUBUNGI VIA WHATSAPP",
      formTitle: "RENCANAKAN PROYEK MOLD ANDA",
      formSubtitle: "Isi formulir di bawah untuk mendapatkan estimasi biaya dalam 1x24 jam kerja.",
      labels: {
        name: "NAMA LENGKAP",
        email: "EMAIL PERUSAHAAN",
        phone: "NOMOR TELEPON / WA",
        company: "NAMA PERUSAHAAN / INDUSTRI",
        service: "JENIS LAYANAN YANG DIBUTUHKAN",
        specs: "SPESIFIKASI PRODUK & CATATAN TEKNIS",
      },
      placeholders: {
        name: "Contoh: Budi Prasetyo",
        email: "nama@perusahaan.co.id",
        phone: "081234567890",
        company: "PT Maju Manufaktur",
        specs: "Jelaskan dimensi produk, jenis material plastik (PP/PE/ABS/PC), perkiraan kavitasi, atau lampirkan informasi gambar desain...",
      },
      serviceOptions: {
        injection: "Pembuatan Mold Baru — Plastik Injeksi Presisi",
        blowing: "Pembuatan Mold Baru — Extrusion / Blow Mold (Botol & Jeriken)",
        cnc: "Jasa Pemesinan Presisi CNC Machining & Wire Cut EDM",
        trial: "Uji Coba Trial Mold & Injeksi Massal Produk Plastik",
        repair: "Modifikasi, Rekondisi & Perawatan Mold Eksisting",
      },
      submitBtn: "AJUKAN KONSULTASI PROYEK",
      submittingBtn: "MENYIMPAN DATA...",
      successTitle: "Permintaan Berhasil Terkirim",
      successDesc: "Terima kasih! Rincian proyek Anda telah tercatat di sistem kami dan Anda sedang dialihkan ke WhatsApp resmi Baruna Jaya Plastik untuk terhubung langsung dengan tim engineering.",
      sendAnother: "Kirim Form Baru",
    },
    footer: {
      block1Title: "NAVIGASI & LAYANAN",
      block2Title: "STANDAR TEKNIS",
      block3Title: "KANAL KOMUNIKASI",
      links: {
        about: "Tentang Kami",
        standards: "Standar Mutu",
        portfolio: "Portofolio",
        contact: "Kontak Workshop",
        serviceInjection: "Cetakan Injeksi Plastik",
        serviceBlowing: "Cetakan Blowing & Botol",
        serviceCnc: "Pemesinan Presisi CNC",
        serviceModif: "Servis & Modifikasi Mold®",
        steel: "Baja Stavax & DIN 1.2316",
        tolerance: "Toleransi Mikron ±0.01 MM",
        dfm: "Kajian DFM & Mold Flow",
        warranty: "Garansi Siap Produksi Penuh",
        linkedin: "LinkedIn",
        whatsapp: "WhatsApp Support",
        instagram: "Instagram",
      },
      terms: "SYARAT & KETENTUAN",
      privacy: "KEBIJAKAN PRIVASI",
      copyright: "©2026 BARUNA JAYA PLASTIK",
      established: "BERDIRI SEJAK 2001 • INDONESIA®",
    },
  },
  en: {
    nav: {
      about: "ABOUT US",
      services: "SERVICES",
      standards: "STANDARDS",
      portfolio: "PORTFOLIO",
      contact: "CONTACT",
      cta: "REQUEST QUOTE",
    },
    hero: {
      headlineLine1: "Precision mold fabrication",
      headlineLine2: "injection & blow molds.",
      stat1Value: "100%",
      stat1Label: "After-Sales Warranty",
      stat2Value: "24+ YEARS",
      stat2Label: "Tooling Experience",
      specBadge: "PREMIUM TOOL STEEL",
      specDesc: "High-precision injection & blow molds crafted with certified Stavax & DIN 1.2316 tool steels.",
      ctaConsult: "CONSULT MOLD DESIGN",
      ctaPortfolio: "VIEW PORTFOLIO",
    },
    about: {
      eyebrow: "FOUNDED 2001 IN JAKARTA",
      statement: "Operating since 2001, Baruna Jaya Plastik builds precision tool-steel injection and blow molds to ensure part dimensional stability and smooth assembly.",
      titleLine1: "High-precision dedication for",
      titleLine2: "the national plastic manufacturing industry.",
      desc1: "Baruna Jaya Plastik originated as an independent precision tooling workshop established in 2001. By consistently upholding sub-micron tolerances and certified tool steel metallurgy, we evolved into a trusted manufacturing partner for hundreds of automotive, packaging, and electronics principals.",
      desc2: "Every mold we engineer integrates DFM melt-flow simulation, staged vacuum heat treatment, and multi-axis CNC machining to guarantee tooling lifespans reaching millions of cycles without dimensional drift.",
      quoteText: "Tooling accuracy is the bedrock of your production efficiency. We treat every micron of steel as an enduring pledge of manufacturing excellence.",
      quoteAuthor: "Bambang Sudibyo",
      quoteRole: "Head of Tooling Engineering & Founder",
      milestone1Year: "2001",
      milestone1Title: "Kalideres Workshop Founded",
      milestone1Desc: "Initial facility established with precision conventional milling and manual hand tooling.",
      milestone2Year: "2012",
      milestone2Title: "CNC & Wire EDM Modernization",
      milestone2Desc: "Expanded high-speed CNC fleet and installed digital optical inspection metrology stations.",
      milestone3Year: "2024",
      milestone3Title: "Advanced Multi-Cavity Facility",
      milestone3Desc: "Implemented multi-cavity hot runners and comprehensive mold flow simulations for high-speed packaging.",
    },
    services: {
      eyebrow: "CORE CAPABILITIES",
      title: "Integrated tooling solutions from design to production.",
      subtitle: "High-speed CNC, Wire-Cut EDM, and vacuum heat treatment to meet exact engineering tolerances.",
      titleSection: "Our Services",
      contactBtn: "CONTACT US",
      ctaText: "CONSULT THIS SERVICE",
      items: [
        {
          id: "01",
          number: "01",
          title: "Plastic Injection Molds",
          subtitle: "PLASTIC INJECTION MOLD",
          desc: "Precision single and multi-cavity injection molds for automotive, electronics, medical, and industrial parts.",
          capabilities: [
            "Stavax & DIN 1.2316 Steels",
            "Hot & Cold Runner Systems",
            "High-Precision Multi-Cavity",
          ],
        },
        {
          id: "02",
          number: "02",
          title: "Blow Molds & Bottles",
          subtitle: "PLASTIC BLOW MOLD",
          desc: "Extrusion and stretch blow molds for cosmetic, chemical, agrochemical, and pharmaceutical containers.",
          capabilities: [
            "Beryllium-Copper Inserts",
            "High-Speed Baffle Cooling",
            "Mirror Polished Cavities",
          ],
        },
        {
          id: "03",
          number: "03",
          title: "Precision CNC Machining",
          subtitle: "PRECISION CNC MACHINING",
          desc: "Sub-micron machining using CNC Milling, Lathe, Wire Cut, and Sinker EDM for complex tooling dies.",
          capabilities: [
            "3-Axis & 4-Axis CNC Milling",
            "Precision Wire Cut & EDM",
            "HRC 48-52 Hardness Check",
          ],
        },
        {
          id: "04",
          number: "04",
          title: "Mold Repair & Service",
          subtitle: "MOLD REPAIR & MODIFICATION",
          desc: "Rapid repair for worn parting lines, laser welding restoration, and core/cavity modifications.",
          capabilities: [
            "Laser Welding & Micro TIG",
            "Parting Line Restoration",
            "Core & Cavity Modification",
          ],
        },
        {
          id: "05",
          number: "05",
          title: "3D CAD/CAM Engineering",
          subtitle: "3D CAD/CAM & REVERSE DESIGN",
          desc: "3D CAD/CAM modeling from physical samples or 2D prints, DFM mold flow analysis, and tooling design.",
          capabilities: [
            "Reverse Engineering",
            "DFM & Mold Flow Analysis",
            "SolidWorks & NX CAD/CAM",
          ],
        },
        {
          id: "06",
          number: "06",
          title: "Mold Trials & QC Sampling",
          subtitle: "MOLD TRIAL & QC SAMPLING",
          desc: "T0/T1 trial test runs on injection machines, First Article Inspection (FAI), and turnkey handover.",
          capabilities: [
            "T0/T1 Injection Trials",
            "First Article Inspection",
            "Production-Ready Guarantee",
          ],
        },
      ],
    },
    standards: {
      eyebrow: "PRECISION STANDARDS",
      title: "Rigorous standards for high-precision molds.",
      editorial: "EVERY MOLD IS CRAFTED WITH VERIFIED TOOL STEELS AND RIGID QUALITY CONTROL. FROM MACHINING TO FINAL TRIAL, OUR STANDARDS ENSURE MOLDS ARE PRODUCTION-READY FOR YOUR INJECTION LINES.",
      btnServices: "OUR SERVICES",
      btnContact: "CONTACT OUR TEAM",
      cards: [
        {
          id: "[01]",
          title: "Sub-micron tolerance on complex shapes",
          desc: "HIGH-SPEED CNC, WIRE CUT, AND SINKER EDM WITH TOLERANCES DOWN TO ±0.01 MM PRESERVE CORE AND CAVITY ACCURACY.",
          badges: [
            "CERTIFIED TOOL STEEL",
            "TOLERANCE ±0.01 MM",
            "HIGH-SPEED CNC",
            "WIRE CUT & SINKER EDM",
            "PRECISION CAVITIES",
            "CMM MICRON CHECK",
          ],
        },
        {
          id: "[02]",
          title: "Progress tracking & technical coordination",
          desc: "REGULAR PROGRESS REPORTS, DFM DOCUMENTATION, AND RAPID ENGINEERING RESPONSE FROM DESIGN TO DELIVERY.",
          badges: [
            "ROUTINE PROGRESS REPORTS",
            "DFM DOCUMENT REVIEW",
            "DIRECT TECH SUPPORT",
            "CLEAR DELIVERY TIMELINE",
            "FAST WORKSHOP RESPONSE",
            "ON-SITE ASSISTANCE",
          ],
        },
        {
          id: "[03]",
          title: "Fast injection cycles & long mold life",
          desc: "CONFORMAL COOLING CHANNELS AND HRC 48-52 VACUUM HEAT TREATMENT ENSURE FASTER CYCLES AND MILLION-SHOT LONGEVITY.",
          badges: [
            "CYCLE TIME OPTIMIZED",
            "CONFORMAL COOLING",
            "HRC 48-52 TREATMENT",
            "EFFICIENT RUNNER",
            "MILLION-SHOT ENDURANCE",
            "SINK MARK MITIGATION",
          ],
        },
        {
          id: "[04]",
          title: "Full mold trials & comprehensive warranty",
          desc: "EVERY MOLD IS TESTED ON INJECTION MACHINES WITH FAI INSPECTION AND DIMENSIONAL VERIFICATION BEFORE HANDOVER.",
          badges: [
            "T0 / T1 TRIAL TESTING",
            "FIRST ARTICLE INSPECTION",
            "FULL MOLD WARRANTY",
            "LASER WELDING REPAIR",
            "PARTING LINE SERVICE",
            "FACTORY TECH SUPPORT",
          ],
        },
      ],
    },
    portfolio: {
      eyebrow: "OUR PORTFOLIO",
      title: "Mold fabrication projects across key industries.",
      subtitle: "DOCUMENTED INJECTION AND BLOW MOLDS FABRICATED TO RIGID INDUSTRIAL PARTNER SPECIFICATIONS.",
      pageLabel: "PAGE",
      prevBtn: "Previous",
      nextBtn: "Next",
      items: [
        {
          id: "01",
          title: "Automotive Component Mold",
          spec: "INJECTION MOLD • 8-CAVITY • STAVAX 2316",
          image: "/portfolio/original-automotive-mold.jpg",
        },
        {
          id: "02",
          title: "Cosmetic Bottle Mold",
          spec: "BLOW MOLD • MIRROR POLISH • PET/HDPE",
          image: "/portfolio/original-cosmetic-bottle-mold.jpg",
        },
        {
          id: "03",
          title: "Precision Connector Housing",
          spec: "MICRO TOLERANCE ±0.01 MM • PBT-GF",
          image: "/portfolio/original-precision-connector-mold.jpg",
        },
        {
          id: "04",
          title: "Medical Device Mold",
          spec: "CLEANROOM MOLD • MEDICAL GRADE PP",
          image: "/portfolio/original-medical-cleanroom-mold.jpg",
        },
        {
          id: "05",
          title: "Thin-Wall Food Container",
          spec: "HIGH-SPEED CYCLE • HOT RUNNER SYSTEM",
          image: "/portfolio/original-thinwall-food-mold.jpg",
        },
        {
          id: "06",
          title: "Precision Core & Cavity Inserts",
          spec: "CNC WIRE CUT & EDM • HARDNESS HRC 52",
          image: "/portfolio/original-cnc-wire-edm-mold.jpg",
        },
        {
          id: "07",
          title: "Bottle Cap & Flip-Top Closure",
          spec: "16-CAVITY CLOSURE • UNSCREWING MOLD",
          image: "/portfolio/original-bottle-cap-closure-mold.jpg",
        },
        {
          id: "08",
          title: "5L Industrial Jerrycan Mold",
          spec: "EXTRUSION BLOW MOLD • HEAVY DUTY HDPE",
          image: "/portfolio/original-industrial-jerrycan-mold-v2.jpg",
        },
      ],
    },
    consultation: {
      eyebrow: "TECHNICAL CONSULTATION",
      titleLine1: "Discuss your mold project",
      titleLine2: "with our engineering team",
      subtitleLine1: "SEND YOUR 2D/3D DRAWINGS OR PRODUCT SPECIFICATIONS.",
      subtitleLine2: "OUR ENGINEERS WILL REVIEW DFM FEASIBILITY",
      subtitleLine3: "AND PROVIDE ESTIMATED COSTS AND LEAD TIME.",
      directChatLabel: "QUICK CHAT VIA WHATSAPP",
      directChatDesc: "Connect directly with our lead tooling engineer for rapid turnaround and technical drawing transfers.",
      directChatBtn: "CHAT VIA WHATSAPP",
      formTitle: "PLAN YOUR MOLD PROJECT",
      formSubtitle: "Complete the form below to receive a formal technical quotation within 24 business hours.",
      labels: {
        name: "FULL NAME",
        email: "WORK EMAIL",
        phone: "PHONE / WHATSAPP",
        company: "COMPANY NAME",
        service: "REQUIRED SERVICE",
        specs: "PRODUCT SPECS & NOTES",
      },
      placeholders: {
        name: "e.g. Robert Anderson",
        email: "name@company.com",
        phone: "+62 812-3456-7890",
        company: "Advanced Manufacturing Corp.",
        specs: "Describe part dimensions, resin type (PP/PE/ABS/PC), required cavity count, or note attached CAD drawing details...",
      },
      serviceOptions: {
        injection: "New Mold — Precision Plastic Injection",
        blowing: "New Mold — Extrusion / Blow Mold (Bottles)",
        cnc: "Precision CNC Machining & Wire Cut EDM",
        trial: "Mold Trial Testing & Mass Production",
        repair: "Mold Repair, Modification & Maintenance",
      },
      submitBtn: "SUBMIT PROJECT INQUIRY",
      submittingBtn: "SAVING INQUIRY...",
      successTitle: "Inquiry Sent Successfully",
      successDesc: "Thank you! Your project details have been recorded and you are being redirected to our WhatsApp for direct engineering consultation.",
      sendAnother: "Submit Another Form",
    },
    footer: {
      block1Title: "NAVIGATION & SERVICES",
      block2Title: "TECHNICAL STANDARDS",
      block3Title: "COMMUNICATION CHANNELS",
      links: {
        about: "About Us",
        standards: "Quality Standards",
        portfolio: "Portfolio",
        contact: "Workshop Contact",
        serviceInjection: "Plastic Injection Molds",
        serviceBlowing: "Blowing & Bottle Molds",
        serviceCnc: "CNC Precision Machining",
        serviceModif: "Mold Service & Modification®",
        steel: "Stavax & DIN 1.2316 Steel",
        tolerance: "Micron Tolerance ±0.01 MM",
        dfm: "DFM & Mold Flow Analysis",
        warranty: "Full Production-Ready Warranty",
        linkedin: "LinkedIn",
        whatsapp: "WhatsApp Support",
        instagram: "Instagram",
      },
      terms: "TERMS & CONDITIONS",
      privacy: "PRIVACY POLICY",
      copyright: "©2026 BARUNA JAYA PLASTIK",
      established: "ESTABLISHED 2001 • INDONESIA®",
    },
  },
};

