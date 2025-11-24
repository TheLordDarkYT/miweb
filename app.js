// Detectar wallet
const getWallet = () => {
    if ("solana" in window) {
        return window.solana;
    }
    alert("Por favor instala Phantom Wallet.");
    return null;
};

// Conectar la wallet
async function connectWallet() {
    const wallet = getWallet();
    if (!wallet) return;

    try {
        const response = await wallet.connect();
        window.userPublicKey = response.publicKey;
        alert("Wallet conectada: " + window.userPublicKey.toString());
    } catch (err) {
        console.error("Error conectando wallet:", err);
    }
}

document.getElementById("connectWalletBtn")?.addEventListener("click", connectWallet);

// Crear Token SPL
async function createToken(event) {
    event.preventDefault();

    if (!window.userPublicKey) {
        alert("Conecta primero tu wallet.");
        return;
    }

    const name = document.getElementById("token-name").value;
    const symbol = document.getElementById("token-symbol").value;
    const decimals = parseInt(document.getElementById("token-decimals").value);
    const supply = parseInt(document.getElementById("token-supply").value);

    const revokeFreeze = document.getElementById("freeze-authority").checked;
    const revokeMint = document.getElementById("mint-authority").checked;

    const connection = new solanaWeb3.Connection(
        "https://api.mainnet-beta.solana.com",
        "confirmed"
    );

    // Crear mint
    const mint = solanaWeb3.Keypair.generate();

    const lamportsForMint = await connection.getMinimumBalanceForRentExemption(
        solanaWeb3.MINT_SIZE
    );

    const transaction = new solanaWeb3.Transaction();

    // Crear cuenta del token
    transaction.add(
        solanaWeb3.SystemProgram.createAccount({
            fromPubkey: window.userPublicKey,
            newAccountPubkey: mint.publicKey,
            space: solanaWeb3.MINT_SIZE,
            lamports: lamportsForMint,
            programId: solanaWeb3.TOKEN_PROGRAM_ID
        })
    );

    // Inicializar mint
    transaction.add(
        solanaWeb3.Token.createInitMintInstruction(
            solanaWeb3.TOKEN_PROGRAM_ID,
            mint.publicKey,
            decimals,
            window.userPublicKey,
            window.userPublicKey
        )
    );

    // Crear cuenta asociada
    const associatedToken = await solanaWeb3.Token.getAssociatedTokenAddress(
        solanaWeb3.ASSOCIATED_TOKEN_PROGRAM_ID,
        solanaWeb3.TOKEN_PROGRAM_ID,
        mint.publicKey,
        window.userPublicKey
    );

    transaction.add(
        solanaWeb3.Token.createAssociatedTokenAccountInstruction(
            solanaWeb3.ASSOCIATED_TOKEN_PROGRAM_ID,
            solanaWeb3.TOKEN_PROGRAM_ID,
            mint.publicKey,
            associatedToken,
            window.userPublicKey,
            window.userPublicKey
        )
    );

    // Mint del supply inicial
    transaction.add(
        solanaWeb3.Token.createMintToInstruction(
            solanaWeb3.TOKEN_PROGRAM_ID,
            mint.publicKey,
            associatedToken,
            window.userPublicKey,
            [],
            supply * Math.pow(10, decimals)
        )
    );

    // Revocar autoridad de mint
    if (revokeMint) {
        transaction.add(
            solanaWeb3.Token.createSetAuthorityInstruction(
                solanaWeb3.TOKEN_PROGRAM_ID,
                mint.publicKey,
                null,
                "MintTokens",
                window.userPublicKey,
                []
            )
        );
    }

    // Revocar freeze authority
    if (revokeFreeze) {
        transaction.add(
            solanaWeb3.Token.createSetAuthorityInstruction(
                solanaWeb3.TOKEN_PROGRAM_ID,
                mint.publicKey,
                null,
                "FreezeAccount",
                window.userPublicKey,
                []
            )
        );
    }

    // Firmar y enviar transacción
    try {
        let signature = await window.solana.signAndSendTransaction(transaction, [mint]);
        alert("Token creado correctamente.\nMint Address: " + mint.publicKey.toString());
    } catch (err) {
        console.error(err);
        alert("Error creando token.");
    }
}

document.querySelector("form")?.addEventListener("submit", createToken);
