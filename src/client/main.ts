import{
    Connection,
    Keypair,
    PublicKey,
    Transaction
} from '@solana/web3.js';
import path from 'path';

const PROGRAM_KEYPAIR_PATH = path.join(path.resolve(__dirname, '../../dist/program'), 'program-keypair.json');

async function main() {
    console.log("Startup");
    let conn = new Connection('https://api.devnet.solana.com', 'confirmed');
    
}