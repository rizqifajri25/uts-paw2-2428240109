const express = require('express');
const router = express.Router();
const c = require('../controllers/terjemahanController');
const cekApiKey = require('../middlewares/cekApiKey');

// --- Pengecekan Keamanan (Mencegah error 'argument handler must be a function') ---
const handlers = {
  'c.getAll': c?.getAll,
  'c.getById': c?.getById,
  'c.create': c?.create,
  'c.update': c?.update,
  'c.remove': c?.remove,
  'cekApiKey': typeof cekApiKey === 'function' ? cekApiKey : (cekApiKey?.cekApiKey || cekApiKey?.default)
};

Object.entries(handlers).forEach(([name, fn]) => {
  if (typeof fn !== 'function') {
    console.error(`\n ERROR EXPORT/IMPORT: Handler "${name}" bernilai UNDEFINED atau bukan function!`);
    console.error(`   -> Periksa file controller/middleware terkait dan pastikan sudah di-export dengan benar.\n`);
  }
});

const middlewareApiKey = typeof cekApiKey === 'function' ? cekApiKey : (cekApiKey?.cekApiKey || cekApiKey?.default);

// --- Definisi Route ---
router.get('/', c.getAll);
router.get('/:id', c.getById);
router.post('/', middlewareApiKey, c.create);
router.put('/:id', middlewareApiKey, c.update);
router.delete('/:id', middlewareApiKey, c.remove);

module.exports = router;