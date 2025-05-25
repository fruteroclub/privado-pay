import express, { Request, Response } from 'express';
import { bridgeToCChain } from './bridge-cchain-orchestation';
import { setOrder } from './call-fuji-contract';
import { parseUnits } from 'viem';

const app = express();
app.use(express.json());

// Endpoint para bridgeToCChain
app.post('/bridge', async (req: Request, res: Response) => {
    try {
        const receipt = await bridgeToCChain();
        res.json({ success: true, receipt });
    } catch (error) {
        console.error('Error en bridge:', error);
        res.status(500).json({ error: 'Error al ejecutar bridge' });
    }
});

// Endpoint para setOrder
app.post('/order', async (req: Request, res: Response) => {
    try {
        const { orderId, amount } = req.body;
        
        if (!orderId || !amount) {
            return res.status(400).json({ error: 'Se requieren orderId y amount' });
        }

        // Convertir amount a bigint usando parseUnits
        const amountInWei = parseUnits(amount.toString(), 6);

        const receipt = await setOrder(orderId, amountInWei);
        res.json({ success: true, receipt });
    } catch (error) {
        console.error('Error en setOrder:', error);
        res.status(500).json({ error: 'Error al ejecutar setOrder' });
    }
});

// Endpoint para verificar el estado de una transacción
app.get('/transaction/:hash', async (req: Request, res: Response) => {
    try {
        const { hash } = req.params;
        // Aquí podrías implementar la lógica para verificar el estado de la transacción
        res.json({
            success: true,
            hash: hash,
            status: 'pending' // Implementar lógica real de verificación
        });
    } catch (error) {
        console.error('Error al verificar transacción:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
}); 