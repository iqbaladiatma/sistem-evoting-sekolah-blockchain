// SPDX-License-Identifier: MIT
// Menentukan versi compiler Solidity yang akan kita gunakan
pragma solidity ^0.8.20;

// Ini adalah awal dari smart contract kita, bernama "Voting"
contract Voting {

    // --- STATE VARIABLES ---
    // Variabel yang menyimpan data di dalam blockchain

    // Alamat admin (panitia/guru) yang punya hak khusus
    address public admin;

    // Struktur data untuk merepresentasikan seorang Kandidat
    struct Candidate {
        uint id;          // ID unik untuk setiap kandidat
        string name;      // Nama kandidat
        uint voteCount;   // Jumlah suara yang diterima
    }

    // Struktur data untuk merepresentasikan seorang Pemilih
    struct Voter {
        bool isAuthorized; // Apakah dia berhak memilih?
        bool hasVoted;     // Apakah dia sudah memilih?
        uint votedFor;     // ID kandidat yang dia pilih
    }

    // 'mapping' adalah seperti kamus atau database sederhana di Solidity
    // Menyimpan daftar kandidat, diakses melalui ID-nya
    mapping(uint => Candidate) public candidates;
    // Menyimpan daftar pemilih, diakses melalui alamat dompet (wallet address) mereka
    mapping(address => Voter) public voters;

    // Variabel untuk menghitung jumlah total kandidat
    uint public candidatesCount;

    // --- EVENTS ---
    // Event berfungsi seperti notifikasi. Aplikasi frontend kita bisa "mendengarkan"
    // event ini untuk tahu kapan sesuatu yang penting terjadi di blockchain.
    event VotedEvent(uint indexed candidateId, address indexed voter);
    event CandidateAdded(uint indexed candidateId, string name);
    event VoterAuthorized(address indexed voter);


    // --- MODIFIER ---
    // Modifier adalah seperti "penjaga gerbang" untuk sebuah fungsi.
    // Kita bisa gunakan ini untuk memastikan hanya orang tertentu yang bisa menjalankan fungsi.
    modifier onlyAdmin() {
        // 'require' akan menghentikan eksekusi jika kondisinya tidak terpenuhi
        require(msg.sender == admin, "Error: Hanya admin yang bisa menjalankan fungsi ini.");
        _; // Simbol ini berarti "lanjutkan eksekusi fungsi aslinya"
    }


    // --- CONSTRUCTOR ---
    // Constructor adalah fungsi spesial yang hanya dijalankan SEKALI,
    // yaitu pada saat smart contract pertama kali di-deploy ke blockchain.
    constructor() {
        // Orang yang men-deploy contract ini secara otomatis menjadi admin
        admin = msg.sender;
    }


    // --- FUNCTIONS ---
    // Fungsi-fungsi yang bisa dipanggil oleh pengguna atau admin

    /**
     * @dev Fungsi untuk menambah kandidat baru. Hanya bisa dipanggil oleh admin.
     * @param _name Nama kandidat yang akan ditambahkan.
     */
    function addCandidate(string memory _name) public onlyAdmin {
        candidatesCount++; // Tambah jumlah kandidat
        // Buat kandidat baru di dalam mapping
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        // Kirim notifikasi/event
        emit CandidateAdded(candidatesCount, _name);
    }

    /**
     * @dev Fungsi untuk memberikan hak suara kepada seorang pemilih. Hanya bisa dipanggil oleh admin.
     * @param _voterAddress Alamat dompet (wallet address) siswa yang diberi hak suara.
     */
    function authorizeVoter(address _voterAddress) public onlyAdmin {
        voters[_voterAddress].isAuthorized = true;
        emit VoterAuthorized(_voterAddress);
    }

    /**
     * @dev Fungsi utama bagi siswa untuk memberikan suaranya.
     * @param _candidateId ID kandidat yang dipilih.
     */
    function vote(uint _candidateId) public {
        // Pengecekan keamanan sebelum memproses suara
        require(voters[msg.sender].isAuthorized, "Error: Anda tidak punya hak suara.");
        require(!voters[msg.sender].hasVoted, "Error: Anda sudah pernah memilih.");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Error: Kandidat tidak valid.");

        // Tandai bahwa pemilih ini sudah selesai memilih
        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedFor = _candidateId;

        // Tambahkan 1 suara untuk kandidat yang dipilih
        candidates[_candidateId].voteCount++;

        // Kirim notifikasi/event bahwa suara telah masuk
        emit VotedEvent(_candidateId, msg.sender);
    }
}