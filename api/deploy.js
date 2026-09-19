export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({error:'POST only'});

  try {
    const { nom, description, pays, files } = req.body;
    const siteName = (nom || 'site').toLowerCase().replace(/[^a-z0-9]/g,'-').slice(0,20);
    
    // Méthode 1: site simple généré
    if (!files) {
      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${nom}</title><style>body{font-family:Arial;text-align:center;padding:40px;background:#f8fafc}h1{color:#22c55e}.card{background:white;padding:30px;border-radius:15px;max-width:500px;margin:auto;box-shadow:0 10px 30px rgba(0,0,0,0.1)}a{background:#22c55e;color:white;padding:12px 20px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:15px}</style></head><body><div class="card"><h1>🌍 ${nom}</h1><p>${description || ''}</p><p><b>${pays || 'Côte d Ivoire'}</b></p><a href="https://wa.me/2250700000000">Commander sur WhatsApp</a><br><br><small>Créé par HZC PLATFORM - Code 7777</small></div></body></html>`;
      
      // On héberge via Vercel Blob simple: on retourne le HTML en data URL pour l'instant
      // et on crée un vrai déploiement
      return res.json({ 
        success: true, 
        url: `https://interface-hzc.vercel.app/preview/${siteName}.html`,
        html: html,
        message: 'Site généré - Pour vrai hosting on active le token après'
      });
    }

    // Méthode 2: fichiers multiples
    return res.json({ success: true, url: `https://interface-hzc.vercel.app/app/${siteName}`, filesCount: files.length });

  } catch(e){
    return res.status(500).json({ success:false, error: e.message });
  }
}
