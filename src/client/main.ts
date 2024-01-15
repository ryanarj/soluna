import{
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    PublicKey,
    Transaction,
    TransactionInstruction,
    sendAndConfirmTransaction
} from '@solana/web3.js';
import path from 'path';

const PROGRAM_KEYPAIR_PATH = path.join(path.resolve(__dirname, '../../dist/program'), 'program-keypair.json');

async function main() {
    console.log("Startup");
    var fs = require('mz/fs');
    let conn = new Connection('https://api.devnet.solana.com', 'confirmed');
    const secretKeyStr = await fs.readFile(
        PROGRAM_KEYPAIR_PATH, {encoding: 'utf8'}
    );
    const secretKey = Uint8Array.from(JSON.parse(secretKeyStr));
    const programKeypair = Keypair.fromSecretKey(secretKey);
    let programId: PublicKey = programKeypair.publicKey;

    const triggerKeypair = Keypair.generate()
    const airdropRequest = await conn.requestAirdrop(
        triggerKeypair.publicKey,
        LAMPORTS_PER_SOL,
    );
    await conn.confirmTransaction(airdropRequest);

    console.log('--Pinging Program ', programId.toBase58());
    const instruction = new TransactionInstruction({
        keys: [{pubkey: triggerKeypair.publicKey, isSigner: false, isWritable: true}],
        programId,
        data: Buffer.alloc(0),
    });
    await sendAndConfirmTransaction(conn, new Transaction().add(instruction), [triggerKeypair]);

}

main().then(
    () => process.exit(),
    err => {
        console.error(err);
        process.exit(-1);
    },
)