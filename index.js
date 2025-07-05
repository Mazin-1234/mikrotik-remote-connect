// 📦 dependencies: express, mikronode-ng
const express = require('express');
const MikroNode = require('mikronode-ng');
const app = express();
const PORT = process.env.PORT || 3000;

const MT_HOST = '109.200.187.202';
const MT_PORT = 9921;
const MT_USER = 'admin';
const MT_PASS = 'm992019';

app.get('/', (req, res) => {
  res.send(\`
    <html>
      <head><title>اتصال بالمايكروتك</title></head>
      <body style="text-align:center; margin-top:50px; font-family:sans-serif">
        <h2>🔌 الاتصال عن بعد بالمايكروتك</h2>
        <button onclick="window.location.href='/connect'" style="padding: 15px 30px; font-size: 18px; cursor: pointer;">اتصل الآن</button>
      </body>
    </html>
  \`);
});

app.get('/connect', async (req, res) => {
  try {
    const device = MikroNode(MT_HOST, MT_PORT);
    const connection = await device.connect(MT_USER, MT_PASS);
    const chan = connection.openChannel();

    await chan.write('/system/identity/print');
    const data = await chan.read();
    const parsed = MikroNode.parseItems(data);
    const identity = parsed[0]['name'];

    connection.close();
    res.send(\`<h3>✅ تم الاتصال بنجاح. اسم الراوتر: \${identity}</h3>\`);
  } catch (err) {
    res.send(\`<h3>❌ فشل الاتصال: \${err.message}</h3>\`);
  }
});

app.listen(PORT, () => {
  console.log(\`🚀 الخادم يعمل على http://localhost:\${PORT}\`);
});
