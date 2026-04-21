# 🚀 Deployment: Vercel + Railway

Esta guía explica cómo desplegar Apalabrados:
- **Frontend** (React) → Vercel
- **Backend** (Node.js) → Railway

---

## PASO 1: Desplegar Backend en Railway

### 1.1 Crea cuenta en Railway
Visita: https://railway.app (gratis con GitHub)

### 1.2 Nuevo proyecto desde Git
1. Click en "New Project"
2. Selecciona "Deploy from GitHub Repo"
3. Conecta tu cuenta GitHub
4. Selecciona tu repo `Scrabble`

### 1.3 Configura el proyecto
En Railway:
1. Click en "Add Variables"
2. Agrega: `NODE_ENV=production`

En el archivo `package.json` de raíz, cambia el script de start a:
```json
"start": "npm --prefix server start"
```

### 1.4 Espera el deploy
Railway:
1. Verá que detecta Node.js
2. Hará build y deploy automáticamente
3. Te dará una URL como: `https://apalabrados-backend-prod.up.railway.app`

### 1.5 Copia la URL del servidor
Necesitarás esta URL para el siguiente paso.

---

## PASO 2: Desplegar Frontend en Vercel

### 2.1 Actualiza la URL del servidor

Abre `client/src/socket/socket.js` y actualiza:

```javascript
const SERVER_URL =
  import.meta.env.VITE_SERVER_URL ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3001'
    : 'https://TU-URL-DE-RAILWAY.railway.app') // ← Cambia aquí
```

Reemplaza `TU-URL-DE-RAILWAY` con la URL que obtuviste en Railway.

### 2.2 Pushea cambios a Git

```bash
git add client/src/socket/socket.js
git commit -m "Update backend URL for production"
git push origin main
```

### 2.3 Deploy en Vercel

1. Visita: https://vercel.com (inicia con GitHub)
2. Click "Add New..." → "Project"
3. Selecciona tu repo `Scrabble`
4. Vercel detectará automáticamente que es un proyecto Next/React
5. En "Root Directory" selecciona: `client`
6. Click "Deploy"

Vercel hará el build y publicará automáticamente.

### 2.4 Tu app está en vivo
Vercel te dará una URL como: `https://scrabble-xxxx.vercel.app`

---

## PASO 3: Prueba la app

### En tu navegador:
1. Abre: `https://scrabble-xxxx.vercel.app`
2. Crea una sala
3. Abre en otra pestaña el mismo link
4. ¡A jugar!

### Variables de entorno (Vercel, opcional):
Si necesitas cambiar la URL del backend:

En Vercel → Project Settings → Environment Variables:
```
VITE_SERVER_URL=https://tu-backend.railway.app
```

---

## ⚙️ Actualizar la app

Cada vez que hagas `git push`:
1. **Railway**: Detecta cambios en `server/` → rebuild automático
2. **Vercel**: Detecta cambios en `client/` → rebuild automático

Solo pushea una vez y ambos se actualizan.

---

## 🔗 URLs Finales

Después del deploy tendrás:
- **Frontend**: https://scrabble-xxxx.vercel.app
- **Backend**: https://apalabrados-backend-prod.up.railway.app

---

## 🆘 Troubleshooting

### Error: "Cannot connect to server"
- Verifica que la URL en `socket.js` sea correcta
- Asegúrate que Railway tiene el deploy exitoso

### Error: "Build failed en Vercel"
- Verifica que `client/package.json` tiene las dependencias correctas
- Ejecuta localmente: `npm --prefix client run build`

### Error: "Build failed en Railway"
- Verifica que `server/package.json` es correcto
- Ejecuta localmente: `npm --prefix server start`

### Socket.io errors en browser console
- Abre DevTools (F12) → Console
- Verifica que la URL del servidor es correcta

---

## 💡 Tips

- Railway es **gratis** para primeras 500 horas/mes
- Vercel es **gratis** para proyectos públicos
- Ambos sirven automáticamente con HTTPS
- Los cambios se despliegan en ~2-5 minutos

¡Listo! 🎮
