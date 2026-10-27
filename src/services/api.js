const BASE_URL = 'https://dummyjson.com';

const EQUIPOS_DEMO = [
  ['América', 'Chivas', 'Liga MX'],
  ['Pumas', 'América', 'Liga MX'],
  ['Villarreal', 'Real Betis', 'LaLiga'],
  ['Real Betis', 'Getafe CF', 'LaLiga'],
  ['Man City', 'Arsenal', 'Premier League'],
  ['Chelsea', 'Liverpool', 'Premier League'],
  ['Roma', 'Lazio', 'Serie A'],
  ['Bayern', 'Dortmund', 'Bundesliga'],
  ['Leipzig', 'Leverkusen', 'Bundesliga'],
  ['Cruz Azul', 'Tigres', 'Liga MX'],
  ['Monterrey', 'Toluca', 'Liga MX'],
  ['Real Madrid', 'Barcelona', 'LaLiga'],
];

const ESTADOS = ['Acertada', 'Pendiente', 'En vivo', 'Fallada'];

export const mapProductToMatch = (item) => {
  const index = item.id % EQUIPOS_DEMO.length;
  const [local, visitante, ligaDefault] = EQUIPOS_DEMO[index];
  
  const hasVs = item.title && item.title.includes(' vs ');
  const partidoNombre = hasVs ? item.title : `${local} vs ${visitante} (${item.title})`;

  const probabilidad = Math.min(95, Math.max(35, Math.round((item.rating || 3.5) * 18)));
  const estado = item.estadoCustom || ESTADOS[item.id % ESTADOS.length];
  const ganador = item.brand || (probabilidad > 60 ? local : 'Empate');

  return {
    id: item.id,
    title: partidoNombre,
    category: item.category || ligaDefault,
    fecha: item.fechaCustom || '18 oct, 12:00 p.m.',
    ganadorPrevisto: ganador,
    probabilidad,
    estado,
    price: item.price || probabilidad,
  };
};

// 1. Login oficial con DummyJSON + Soporte para usuarios recién registrados
export const loginUser = async (username, password) => {
  // Verificar si es un usuario que se registró en esta sesión
  const localUsers = JSON.parse(localStorage.getItem('pronostika_registered_users') || '[]');
  const foundLocal = localUsers.find(
    (u) =>
      (u.username.toLowerCase() === username.trim().toLowerCase() ||
        u.email.toLowerCase() === username.trim().toLowerCase()) &&
      u.password === password.trim()
  );
  if (foundLocal) return foundLocal;

  // Permitir que si el usuario escribe un correo (ej. carlos@gmail.com) y usa emilyspass, o usuario de DummyJSON
  const response = await fetch(`${BASE_URL}/auth/login`, {
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

// 2. Registro de nuevo usuario (POST real a DummyJSON + persistencia local)
export const registerUserApi = async ({ firstName, lastName, username, email, password }) => {
  const response = await fetch(`${BASE_URL}/users/add`, {
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

// 3. Login con Google / GitHub personalizado con el nombre del usuario
export const socialLoginApi = async (provider, customName, customEmail) => {
  const parts = customName.trim().split(' ');
  const firstName = parts[0] || 'Usuario';
  const lastName = parts.slice(1).join(' ') || provider;
  const username = customEmail
    ? customEmail.split('@')[0]
    : `${firstName.toLowerCase()}_${provider.toLowerCase()}`;

  // Hacemos una petición real a DummyJSON para validar conexión con la API
  await fetch(`${BASE_URL}/users/1`);

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

// 4. Obtener partidos
export const fetchMatches = async () => {
  const response = await fetch(`${BASE_URL}/products?limit=100`);
  if (!response.ok) {
    throw new Error('Error al cargar los pronósticos desde el servidor.');
  }
  const data = await response.json();
  return data.products.map(mapProductToMatch);
};

// 5. CRUD: Crear (POST)
export const createMatchApi = async (newMatchData) => {
  const response = await fetch(`${BASE_URL}/products/add`, {
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
    throw new Error('No se pudo crear el pronóstico en la API.');
  }
  return await response.json();
};

// 6. CRUD: Editar (PUT)
export const updateMatchApi = async (id, updatedData) => {
  const targetId = id > 194 ? 1 : id;
  const response = await fetch(`${BASE_URL}/products/${targetId}`, {
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
    throw new Error('Error al actualizar el pronóstico en la API.');
  }
  return await response.json();
};

// 7. CRUD: Eliminar (DELETE)
export const deleteMatchApi = async (id) => {
  const targetId = id > 194 ? 1 : id;
  const response = await fetch(`${BASE_URL}/products/${targetId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Error al eliminar el pronóstico en la API.');
  }
  return await response.json();
};