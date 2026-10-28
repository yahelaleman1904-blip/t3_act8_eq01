const DUMMY_BASE_URL = 'https://dummyjson.com';
const ESPN_BASE_URL = 'https://site.api.espn.com/apis/site/v2/sports/soccer';

const ESPN_LEAGUES = [
  { code: 'esp.1', name: 'LaLiga' },
  { code: 'mex.1', name: 'Liga MX' },
  { code: 'eng.1', name: 'Premier League' },
  { code: 'ita.1', name: 'Serie A' },
  { code: 'ger.1', name: 'Bundesliga' },
  { code: 'fra.1', name: 'Ligue 1' },
  { code: 'uefa.champions', name: 'Champions League' },
];

// Catálogo oficial con escudos reales del CDN de ESPN como respaldo garantizado
const PARTIDOS_ESPN_OFICIALES = [
  {
    localName: 'Real Madrid',
    awayName: 'FC Barcelona',
    league: 'LaLiga',
    localLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/86.png',
    awayLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/83.png',
  },
  {
    localName: 'Real Betis',
    awayName: 'Getafe CF',
    league: 'LaLiga',
    localLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/244.png',
    awayLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/2922.png',
  },
  {
    localName: 'Atlético Madrid',
    awayName: 'Villarreal',
    league: 'LaLiga',
    localLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/1068.png',
    awayLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/102.png',
  },
  {
    localName: 'América',
    awayName: 'Guadalajara',
    league: 'Liga MX',
    localLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/227.png',
    awayLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/219.png',
  },
  {
    localName: 'Cruz Azul',
    awayName: 'Pumas UNAM',
    league: 'Liga MX',
    localLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/218.png',
    awayLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/233.png',
  },
  {
    localName: 'Tigres UANL',
    awayName: 'Monterrey',
    league: 'Liga MX',
    localLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/232.png',
    awayLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/220.png',
  },
  {
    localName: 'Toluca',
    awayName: 'Pachuca',
    league: 'Liga MX',
    localLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/223.png',
    awayLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/234.png',
  },
  {
    localName: 'Man City',
    awayName: 'Arsenal',
    league: 'Premier League',
    localLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/382.png',
    awayLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/359.png',
  },
  {
    localName: 'Liverpool',
    awayName: 'Chelsea',
    league: 'Premier League',
    localLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/364.png',
    awayLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/363.png',
  },
  {
    localName: 'PSG',
    awayName: 'Marseille',
    league: 'Ligue 1',
    localLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/160.png',
    awayLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/176.png',
  },
  {
    localName: 'Bayern Munich',
    awayName: 'Borussia Dortmund',
    league: 'Bundesliga',
    localLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/132.png',
    awayLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/124.png',
  },
  {
    localName: 'Inter Milan',
    awayName: 'AC Milan',
    league: 'Serie A',
    localLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/110.png',
    awayLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/103.png',
  },
];

const ESTADOS = ['Acertada', 'Pendiente', 'En vivo', 'Fallada'];

const mapEspnEventToMatch = (event, leagueName, indexFallback) => {
  const competition = event.competitions?.[0] || {};
  const competitors = competition.competitors || [];

  const homeTeam = competitors.find((c) => c.homeAway === 'home') || competitors[0] || {};
  const awayTeam = competitors.find((c) => c.homeAway === 'away') || competitors[1] || {};

  const localName = homeTeam.team?.shortDisplayName || homeTeam.team?.displayName || 'Local';
  const awayName = awayTeam.team?.shortDisplayName || awayTeam.team?.displayName || 'Visitante';

  const localLogo = homeTeam.team?.logo || 'https://a.espncdn.com/i/teamlogos/soccer/500/86.png';
  const awayLogo = awayTeam.team?.logo || 'https://a.espncdn.com/i/teamlogos/soccer/500/83.png';

  const eventDate = event.date ? new Date(event.date) : new Date();
  const fechaFormateada = eventDate.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  const state = event.status?.type?.state;
  let estado = 'Pendiente';
  if (state === 'in') {
    estado = 'En vivo';
  } else if (state === 'post') {
    const homeScore = parseInt(homeTeam.score || '0', 10);
    const awayScore = parseInt(awayTeam.score || '0', 10);
    estado = homeScore >= awayScore ? 'Acertada' : 'Fallada';
  }

  const rawId = Number(event.id) || indexFallback + 1000;
  const probabilidad = 52 + (rawId % 38);

  let ganadorPrevisto = localName;
  if (probabilidad < 58) {
    ganadorPrevisto = 'Empate';
  } else if (rawId % 3 === 0) {
    ganadorPrevisto = awayName;
  }

  const scoreText =
    state === 'in' || state === 'post'
      ? ` (${homeTeam.score ?? 0} - ${awayTeam.score ?? 0})`
      : '';

  return {
    id: rawId,
    title: `${localName} vs ${awayName}${scoreText}`,
    localName,
    awayName,
    localLogo,
    awayLogo,
    category: leagueName,
    fecha: fechaFormateada,
    ganadorPrevisto,
    probabilidad,
    estado,
  };
};

// 1. Login oficial con DummyJSON + Usuarios registrados
export const loginUser = async (username, password) => {
  const localUsers = JSON.parse(localStorage.getItem('pronostika_registered_users') || '[]');
  const foundLocal = localUsers.find(
    (u) =>
      (u.username.toLowerCase() === username.trim().toLowerCase() ||
        u.email.toLowerCase() === username.trim().toLowerCase()) &&
      u.password === password.trim()
  );
  if (foundLocal) return foundLocal;

  const response = await fetch(`${DUMMY_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: username.trim(),
      password: password.trim(),
      expiresInMins: 60,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Usuario o contraseña incorrectos');
  }
  return data;
};

// 2. Registro de nuevo usuario
export const registerUserApi = async ({ firstName, lastName, username, email, password }) => {
  const response = await fetch(`${DUMMY_BASE_URL}/users/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      username: username.trim(),
      email: email.trim(),
      password: password.trim(),
    }),
  });

  if (!response.ok) {
    throw new Error('Error al registrar el usuario en la API.');
  }

  const data = await response.json();
  const newUser = {
    id: data.id || Date.now(),
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    username: username.trim(),
    email: email.trim(),
    password: password.trim(),
    image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username.trim())}`,
  };

  const localUsers = JSON.parse(localStorage.getItem('pronostika_registered_users') || '[]');
  localUsers.push(newUser);
  localStorage.setItem('pronostika_registered_users', JSON.stringify(localUsers));

  return newUser;
};

// 3. Login Social
export const socialLoginApi = async (provider, customName, customEmail) => {
  const parts = customName.trim().split(' ');
  const firstName = parts[0] || 'Usuario';
  const lastName = parts.slice(1).join(' ') || provider;
  const username = customEmail
    ? customEmail.split('@')[0]
    : `${firstName.toLowerCase()}_${provider.toLowerCase()}`;

  await fetch(`${DUMMY_BASE_URL}/users/1`);

  return {
    id: Date.now(),
    firstName,
    lastName,
    username,
    email: customEmail || `${username}@${provider.toLowerCase()}.com`,
    provider,
    image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(firstName + lastName)}`,
  };
};

// 4. Obtener partidos combinando ESPN API en vivo + DummyJSON para garantizar 60+ registros paginables
export const fetchMatches = async () => {
  let espnMatches = [];

  // A) Intentar obtener la jornada actual directamente de ESPN (sin el parámetro dates que bloqueaba)
  try {
    const requests = ESPN_LEAGUES.map(async (league) => {
      try {
        const res = await fetch(`${ESPN_BASE_URL}/${league.code}/scoreboard`);
        if (!res.ok) return [];
        const data = await res.json();
        const events = data.events || [];
        return events.map((ev, idx) => mapEspnEventToMatch(ev, league.name, idx));
      } catch {
        return [];
      }
    });

    const results = await Promise.all(requests);
    espnMatches = results.flat();
  } catch {
    espnMatches = [];
  }

  // B) Complementar con DummyJSON mapeado a los clubes y escudos reales de ESPN para tener suficientes páginas (10, 20, 40, 50)
  let dummyMapped = [];
  try {
    const res = await fetch(`${DUMMY_BASE_URL}/products?limit=60`);
    const data = await res.json();
    dummyMapped = (data.products || []).map((item, idx) => {
      const baseMatch = PARTIDOS_ESPN_OFICIALES[idx % PARTIDOS_ESPN_OFICIALES.length];
      const probabilidad = Math.min(94, Math.max(45, Math.round((item.rating || 4) * 18)));
      const dia = 15 + (idx % 14);
      return {
        id: item.id,
        title: `${baseMatch.localName} vs ${baseMatch.awayName} (J${(idx % 17) + 1})`,
        localName: baseMatch.localName,
        awayName: baseMatch.awayName,
        localLogo: baseMatch.localLogo,
        awayLogo: baseMatch.awayLogo,
        category: baseMatch.league,
        fecha: `${dia} oct, ${(12 + (idx % 9))}:00 h`,
        ganadorPrevisto: probabilidad > 62 ? baseMatch.localName : idx % 3 === 0 ? 'Empate' : baseMatch.awayName,
        probabilidad,
        estado: ESTADOS[idx % ESTADOS.length],
      };
    });
  } catch {
    // Si incluso DummyJSON fallara, generamos directamente desde PARTIDOS_ESPN_OFICIALES
    dummyMapped = PARTIDOS_ESPN_OFICIALES.map((baseMatch, idx) => ({
      id: idx + 1,
      title: `${baseMatch.localName} vs ${baseMatch.awayName}`,
      localName: baseMatch.localName,
      awayName: baseMatch.awayName,
      localLogo: baseMatch.localLogo,
      awayLogo: baseMatch.awayLogo,
      category: baseMatch.league,
      fecha: '28 oct, 19:00 h',
      ganadorPrevisto: baseMatch.localName,
      probabilidad: 65 + (idx % 25),
      estado: ESTADOS[idx % ESTADOS.length],
    }));
  }

  return [...espnMatches, ...dummyMapped];
};

// 5. CRUD: Crear (POST)
export const createMatchApi = async (newMatchData) => {
  const response = await fetch(`${DUMMY_BASE_URL}/products/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: newMatchData.title,
      category: newMatchData.category,
      brand: newMatchData.ganadorPrevisto,
      price: Number(newMatchData.probabilidad),
    }),
  });

  if (!response.ok) {
    throw new Error('No se pudo registrar el pronóstico.');
  }
  return await response.json();
};

// 6. CRUD: Editar (PUT)
export const updateMatchApi = async (id, updatedData) => {
  const targetId = (Number(id) % 100) + 1;
  const response = await fetch(`${DUMMY_BASE_URL}/products/${targetId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: updatedData.title,
      category: updatedData.category,
      brand: updatedData.ganadorPrevisto,
      price: Number(updatedData.probabilidad),
    }),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar el pronóstico.');
  }
  return await response.json();
};

// 7. CRUD: Eliminar (DELETE)
export const deleteMatchApi = async (id) => {
  const targetId = (Number(id) % 100) + 1;
  const response = await fetch(`${DUMMY_BASE_URL}/products/${targetId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Error al eliminar el pronóstico.');
  }
  return await response.json();
};