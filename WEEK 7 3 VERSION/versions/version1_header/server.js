const app = require('../../templates/server-base');
const authRoutes = require('../../routes/authRoutes');

app.use('/api', authRoutes);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`✅ Version 1 (Header) running on port ${PORT}`));
