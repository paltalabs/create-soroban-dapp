const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { Server, Contract } = require('@soroban-react-dapp/contracts/greeting');

app.use(bodyParser.json());

app.post('/authorize', async (req, res) => {
  const { newAddress } = req.body;

  if (!newAddress) {
    return res.status(400).json({ success: false, message: 'Dirección de wallet no proporcionada' });
  }

  try {
    const server = new Server('https://horizon-testnet.stellar.org');
    const contract = new Contract('CA2XIZ7CBSYZWCMZWUPUCBJ76WSHXRWOX7YDSKDUDXNJ75LE6K7VOY57');

    await contract.invoke({
      method: 'add_authorized_address',
      args: [
        nativeToScVal(newAddress, { type: "address" }),
      ],
      signAndSend: true
    });

    return res.json({ success: true, message: 'Dirección autorizada exitosamente' });
  } catch (error) {
    console.error('Error al autorizar dirección:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
