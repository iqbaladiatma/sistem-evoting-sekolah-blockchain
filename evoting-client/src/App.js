import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { contractAddress, contractABI } from "./contractInfo";
import "./App.css";

function App() {
  // State untuk menyimpan akun pengguna yang terhubung
  const [account, setAccount] = useState(null);
  // State untuk menyimpan instance dari smart contract
  const [contract, setContract] = useState(null);
  // State untuk menyimpan alamat admin dari contract
  const [adminAddress, setAdminAddress] = useState(null);

  const [newCandidateName, setNewCandidateName] = useState(""); // Untuk input nama kandidat

  const [voterToAuthorize, setVoterToAuthorize] = useState(""); // Untuk input alamat pemilih

  const [candidates, setCandidates] = useState([]); // Untuk menyimpan daftar kandidat

  const [voterStatus, setVoterStatus] = useState({ isAuthorized: false, hasVoted: false });

  const [isVoting, setIsVoting] = useState(false); // Untuk loading state saat vote

  // Fungsi untuk menghubungkan dompet MetaMask
  const connectWallet = async () => {
    // Cek apakah MetaMask terinstall
    if (window.ethereum) {
      try {
        // Minta izin untuk mengakses akun
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]); // Simpan akun pertama

        // Siapkan koneksi ke blockchain
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        // Buat instance dari smart contract
        const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);

        // Simpan state
        setContract(contractInstance);

        console.log("Dompet berhasil terhubung!");
      } catch (error) {
        console.error("Gagal menghubungkan dompet:", error);
      }
    } else {
      alert("Harap install MetaMask untuk menggunakan aplikasi ini.");
    }
  };

  // Fungsi untuk mengambil alamat admin dari smart contract
  const getAdmin = useCallback(async () => {
    if (contract) {
      try {
        const admin = await contract.admin();
        console.log("Admin address from contract:", admin);
        console.log("Current account:", account);
        setAdminAddress(admin);
      } catch (error) {
        console.error("Gagal mengambil data admin:", error);
        alert("Error: Tidak dapat mengambil data admin. Pastikan contract sudah di-deploy dengan benar.");
      }
    }
  }, [contract, account]);

  // ... setelah fungsi getAdmin()

  // FUNGSI BARU: Menambah kandidat
  const handleAddCandidate = async () => {
    if (contract && newCandidateName.trim()) {
      try {
        console.log("Adding candidate:", newCandidateName);
        const tx = await contract.addCandidate(newCandidateName.trim());
        console.log("Transaction sent:", tx.hash);
        await tx.wait(); // Tunggu transaksi selesai
        console.log("Transaction confirmed!");
        setNewCandidateName(""); // Kosongkan input
        getCandidates(); // Refresh daftar kandidat
        alert("Kandidat berhasil ditambahkan!");
      } catch (error) {
        console.error("Gagal menambah kandidat:", error);
        const reason = error.reason || error.message || "Transaksi gagal";
        alert(`Gagal menambah kandidat: ${reason}`);
      }
    } else {
      alert("Silakan masukkan nama kandidat yang valid.");
    }
  };

  // FUNGSI BARU: Memberi hak suara
  const handleAuthorizeVoter = async () => {
    if (contract && voterToAuthorize.trim()) {
      try {
        // Validasi alamat Ethereum
        if (!ethers.isAddress(voterToAuthorize.trim())) {
          alert("Alamat wallet tidak valid. Pastikan format alamat benar.");
          return;
        }
        
        console.log("Authorizing voter:", voterToAuthorize.trim());
        const tx = await contract.authorizeVoter(voterToAuthorize.trim());
        console.log("Transaction sent:", tx.hash);
        await tx.wait(); // Tunggu transaksi selesai
        console.log("Transaction confirmed!");
        setVoterToAuthorize(""); // Kosongkan input
        alert("Pemilih berhasil diberi hak suara!");
      } catch (error) {
        console.error("Gagal memberi hak suara:", error);
        const reason = error.reason || error.message || "Transaksi gagal";
        alert(`Gagal memberi hak suara: ${reason}`);
      }
    } else {
      alert("Silakan masukkan alamat wallet yang valid.");
    }
  };

  // FUNGSI BARU: Mengambil daftar kandidat
  const getCandidates = useCallback(async () => {
    if (contract) {
      try {
        const count = await contract.candidatesCount();
        const candidatesArray = [];
        for (let i = 1; i <= count; i++) {
          const candidate = await contract.candidates(i);
          candidatesArray.push(candidate);
        }
        setCandidates(candidatesArray);
      } catch (error) {
        console.error("Gagal mengambil daftar kandidat:", error);
      }
    }
  }, [contract]);

  // ... setelah fungsi getCandidates()

  // FUNGSI BARU: Memeriksa status pemilih saat ini
  const checkVoterStatus = useCallback(async () => {
    if (contract && account) {
      try {
        const voter = await contract.voters(account);
        setVoterStatus({ isAuthorized: voter.isAuthorized, hasVoted: voter.hasVoted });
      } catch (error) {
        console.error("Gagal memeriksa status pemilih:", error);
      }
    }
  }, [contract, account]);

  // FUNGSI BARU: Memberikan suara
  const handleVote = async (candidateId) => {
    if (contract) {
      try {
        setIsVoting(true); // Mulai loading
        const tx = await contract.vote(candidateId);
        await tx.wait(); // Tunggu transaksi selesai
        setIsVoting(false); // Selesai loading
        checkVoterStatus(); // Perbarui status pemilih
        getCandidates(); // Perbarui jumlah suara kandidat
        alert("Suara Anda berhasil dicatat!");
      } catch (error) {
        setIsVoting(false); // Selesai loading
        console.error("Gagal memberikan suara:", error);
        // Mengambil pesan error yang lebih spesifik dari kontrak
        const reason = error.reason || "Transaksi gagal.";
        alert(`Gagal: ${reason}`);
      }
    }
  };

  // useEffect akan berjalan saat komponen pertama kali dimuat
  // dan saat state 'contract' berubah.
  // Modifikasi useEffect
  // Modifikasi useEffect
  useEffect(() => {
    if (contract && account) {
      getAdmin();
      getCandidates();
      checkVoterStatus();
    }
  }, [contract, account, getAdmin, getCandidates, checkVoterStatus]); // Fix lint: include all dependencies

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sistem E-Voting Sekolah</h1>
        {account ? (
          <p>
            Terhubung dengan Akun: <span>{account}</span>
          </p>
        ) : (
          <button onClick={connectWallet} className="connect-button" disabled={isVoting}>
            Hubungkan Dompet
          </button>
        )}
      </header>

      <main className="main-content">
        {/* DEBUG INFO */}
        {account && (
          <div className="debug-info" style={{background: '#f0f0f0', padding: '10px', margin: '10px 0', fontSize: '12px'}}>
            <strong>Debug Info:</strong><br/>
            Current Account: {account}<br/>
            Admin Address: {adminAddress || 'Loading...'}<br/>
            Is Admin: {account && adminAddress ? (account.toLowerCase() === adminAddress.toLowerCase() ? 'YES' : 'NO') : 'Unknown'}
          </div>
        )}

        {/* PANEL ADMIN */}
        {account && account.toLowerCase() === adminAddress?.toLowerCase() && (
          <div className="admin-panel">
            <h2>🔧 Panel Admin</h2>
            <p style={{color: 'green', fontWeight: 'bold'}}>✅ Anda adalah Admin sistem</p>
            <div className="form-group">
              <h3>Tambah Kandidat Baru</h3>
              <input 
                type="text" 
                placeholder="Nama Kandidat" 
                value={newCandidateName} 
                onChange={(e) => setNewCandidateName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCandidate()}
              />
              <button onClick={handleAddCandidate} disabled={!newCandidateName.trim()}>Tambah</button>
            </div>
            <div className="form-group">
              <h3>Beri Hak Suara</h3>
              <input 
                type="text" 
                placeholder="Alamat Dompet Pemilih (0x...)" 
                value={voterToAuthorize} 
                onChange={(e) => setVoterToAuthorize(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAuthorizeVoter()}
              />
              <button onClick={handleAuthorizeVoter} disabled={!voterToAuthorize.trim()}>Beri Hak</button>
            </div>
          </div>
        )}

        {/* PANEL PEMILIH - Muncul jika bukan admin */}
        {account && adminAddress && account.toLowerCase() !== adminAddress.toLowerCase() && (
          <div className="voter-panel">
            <h2>👤 Status Pemilih</h2>
            {voterStatus.isAuthorized ? (
              voterStatus.hasVoted ? (
                <p className="status-voted">✅ Anda sudah memberikan suara. Terima kasih!</p>
              ) : (
                <p className="status-authorized">🟢 Anda memiliki hak suara. Silakan pilih kandidat Anda.</p>
              )
            ) : (
              <div>
                <p className="status-unauthorized">🔴 Anda belum memiliki hak suara. Hubungi panitia.</p>
                <p style={{fontSize: '12px', color: '#666'}}>Alamat Anda: {account}</p>
              </div>
            )}
          </div>
        )}

        {/* LOADING STATE */}
        {account && !adminAddress && (
          <div className="loading-panel">
            <h2>⏳ Memuat data kontrak...</h2>
            <p>Sedang mengambil informasi dari blockchain...</p>
          </div>
        )}

        {/* DAFTAR KANDIDAT */}
        <div className="candidate-list">
          <h2>Daftar Kandidat</h2>
          {candidates.length === 0 ? (
            <p>Belum ada kandidat yang ditambahkan.</p>
          ) : (
            <ul>
              {candidates.map((candidate) => (
                <li key={Number(candidate.id)}>
                  <div className="candidate-info">
                    <h3>{candidate.name}</h3>
                    <p>Jumlah Suara: {Number(candidate.voteCount)}</p>
                  </div>
                  <button className="vote-button" onClick={() => handleVote(candidate.id)} disabled={!voterStatus.isAuthorized || voterStatus.hasVoted || isVoting}>
                    {isVoting ? "Memproses..." : "Vote"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
