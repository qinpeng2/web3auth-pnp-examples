import { CHAIN_NAMESPACES, SafeEventEmitterProvider, WALLET_ADAPTERS } from "@web3auth/base";
import { Web3Auth } from "@web3auth/modal";
import { useEffect, useState } from "react";

import RPC from "./starkexRPC";

const clientId = "BEglQSgt4cUWcj6SKRdu5QkOXTsePmMcusG5EAoyjyOYKlVRjIF1iCNnMOTfpzCiunHRrMui8TIwQPXdkQ8Yxuk"; // get from https://dashboard.web3auth.io

function App() {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3Auth({
          clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.OTHER,
          },
          web3AuthNetwork: "cyan",
        });

        setWeb3auth(web3auth);

        await web3auth.initModal();
        if (web3auth.provider) {
          setProvider(web3auth.provider);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const login = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
    uiConsole("Logged in Successfully!");
  };

  const authenticateUser = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const idToken = await web3auth.authenticateUser();
    uiConsole(idToken);
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    uiConsole(user);
  };

  const logout = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setProvider(null);
  };

  const onGetStarkAccount = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider as SafeEventEmitterProvider);
    const starkaccounts = await rpc.getStarkAccount();
    uiConsole(starkaccounts);
  };

  const getStarkKey = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider as SafeEventEmitterProvider);
    const starkKey = await rpc.getStarkKey();
    uiConsole(starkKey);
  };

  const onMintRequest = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider as SafeEventEmitterProvider);
    const request = await rpc.onMintRequest();
    uiConsole(request);
  };

  const onDepositRequest = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider as SafeEventEmitterProvider);
    const request = await rpc.onDepositRequest();
    uiConsole(request);
  };

  const onWithdrawalRequest = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider as SafeEventEmitterProvider);
    const request = await rpc.onWithdrawalRequest();
    uiConsole(request);
  };

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  }

  const loggedInView = (
    <>
      <div className="flex-container">
        <div>
          <button onClick={getUserInfo} className="card">
            Get User Info
          </button>
        </div>
        <div>
          <button onClick={authenticateUser} className="card">
            Get ID Token
          </button>
        </div>
        <div>
          <button onClick={onGetStarkAccount} className="card">
            Get Stark Accounts
          </button>
        </div>
        <div>
          <button onClick={getStarkKey} className="card">
            Get Stark Key
          </button>
        </div>
        <div>
          <button onClick={onMintRequest} className="card">
            Mint Request
          </button>
        </div>
        <div>
          <button onClick={onDepositRequest} className="card">
            Deposit Request
          </button>
        </div>
        <div>
          <button onClick={onWithdrawalRequest} className="card">
            Withdraw Request
          </button>
        </div>
        <div>
          <button onClick={logout} className="card">
            Log Out
          </button>
        </div>
      </div>
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>
    </>
  );

  const unloggedInView = (
    <button onClick={login} className="card">
      Login
    </button>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="http://web3auth.io/" rel="noreferrer">
          Web3Auth
        </a>
        & NextJS12 StarkEx Example
      </h1>

      <div className="grid">{provider ? loggedInView : unloggedInView}</div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/examples/tree/main/web-modal-sdk/starkex/nextjs12-starkex-modal-example"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
      </footer>
    </div>
  );
}

export default App;
