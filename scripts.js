// Detectar Phantom
const getProvider = () => {
    if ("solana" in window) {
        const provider = window.solana;
        if (provider.isPhantom) return provider;
    }
    alert("Instala la wallet Phantom para continuar.");
    return null;
};

// Evento del botón
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("crearTokenBtn").addEventListener("click", crearToken);
});

async function crearToken() {
    const provider = getProvider();
    if (!provider) return;

    // Conectar Phantom
    await provider.connect();
    const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl("mainnet-beta"));

    const publicKey = provider.publicKey;

    // Datos del formulario
    const nombre = document.getElementById("tokenName").value.trim();
    const simbolo = document.getElementById("tokenSymbol").value.trim();
    const cantidadTotal = parseInt(document.getElementById("tokenAmount").value.trim());
    const decimales = 9;

    if (!nombre || !simbolo || !cantidadTotal) {
        alert("Completa todos los campos antes de crear el token.");
        return;
    }

    try {
        // Crear Mint (token)
        const mint = await splToken.createMint(
            connection,
            provider,          // pagador
            publicKey,         // autoridad de creación
            publicKey,         // autoridad de congelación
            decimales
        );

        // Crear cuenta asociada para ti
        const userTokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
            connection,
            provider,
            mint,
            publicKey
        );

        // Mint (crear la cantidad total)
        await splToken.mintTo(
            connection,
            provider,
            mint,
            userTokenAccount.address,
            publicKey,
            cantidadTotal * (10 ** decimales)
        );

        alert(`TOKEN CREADO EXITOSAMENTE ✔\nMint Address: ${mint.toBase58()}`);

    } catch (error) {
        console.error(error);
        alert("Ocurrió un error creando el token: " + error.message);
    }
}
