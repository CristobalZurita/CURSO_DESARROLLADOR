// ============================================
// auth.js — Fake backend de autenticación
// ============================================

window.FakeBackendAuth = (() => {
  const USERS_KEY = 'raices_auth_users';
  const SESSION_KEY = 'raices_auth_session';
  const LEGACY_TREE_KEY = 'raices_tree';
  const USERNAME_REGEX = /^[a-z0-9._-]{3,24}$/;
  const MIN_PASSWORD_LENGTH = 4;

  const ADMIN_ACCOUNT = {
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    createdAt: new Date().toISOString(),
    profile: null,
  };

  function normalizeUsername(value) {
    return String(value || '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '');
  }

  function validateUsername(username) {
    return USERNAME_REGEX.test(username);
  }

  function validatePassword(password) {
    return typeof password === 'string' && password.trim().length >= MIN_PASSWORD_LENGTH;
  }

  function getTreeStorageKey(username) {
    return `raices_tree_${normalizeUsername(username)}`;
  }

  function getUsers() {
    try {
      const raw = localStorage.getItem(USERS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function ensureAdminAccount() {
    const users = getUsers();
    const hasAdmin = users.some((user) => user.username === ADMIN_ACCOUNT.username);
    if (!hasAdmin) {
      users.unshift(ADMIN_ACCOUNT);
      saveUsers(users);
    }
  }

  function bootstrap() {
    ensureAdminAccount();
  }

  function findUser(username) {
    const users = getUsers();
    return users.find((user) => user.username === username) || null;
  }

  function persistSession(user) {
    const session = {
      username: user.username,
      role: user.role,
      loginAt: new Date().toISOString(),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  }

  function getSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed?.username || !parsed?.role) return null;
      return parsed;
    } catch (_) {
      return null;
    }
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
  }

  function migrateLegacyTreeIfNeeded(username) {
    const userTreeKey = getTreeStorageKey(username);
    if (localStorage.getItem(userTreeKey)) return;

    const legacyTree = localStorage.getItem(LEGACY_TREE_KEY);
    if (!legacyTree) return;

    try {
      const parsed = JSON.parse(legacyTree);
      if (!parsed?.usuario?.nombre) return;
      localStorage.setItem(userTreeKey, legacyTree);
      localStorage.removeItem(LEGACY_TREE_KEY);
    } catch (_) {
      // Si el JSON es inválido, ignorar.
    }
  }

  function loginOrRegister(usernameRaw, passwordRaw) {
    bootstrap();

    const username = normalizeUsername(usernameRaw);
    const password = String(passwordRaw || '');

    if (!validateUsername(username)) {
      return {
        ok: false,
        code: 'INVALID_USERNAME',
        message: 'Usuario inválido. Usa 3-24 caracteres: letras, números, punto, guion o guion bajo.',
      };
    }

    if (!validatePassword(password)) {
      return {
        ok: false,
        code: 'INVALID_PASSWORD',
        message: `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`,
      };
    }

    const users = getUsers();
    const existing = users.find((user) => user.username === username);

    if (existing) {
      if (existing.password !== password) {
        return {
          ok: false,
          code: 'BAD_PASSWORD',
          message: 'Contraseña incorrecta.',
        };
      }

      const session = persistSession(existing);
      if (existing.role === 'user') {
        migrateLegacyTreeIfNeeded(existing.username);
      }

      return {
        ok: true,
        mode: 'login',
        user: { username: existing.username, role: existing.role, profile: existing.profile || null },
        session,
      };
    }

    const newUser = {
      username,
      password,
      role: 'user',
      createdAt: new Date().toISOString(),
      profile: null,
    };

    users.push(newUser);
    saveUsers(users);

    const session = persistSession(newUser);

    return {
      ok: true,
      mode: 'register',
      user: { username: newUser.username, role: newUser.role, profile: null },
      session,
    };
  }

  function saveUserProfile(usernameRaw, profile) {
    const username = normalizeUsername(usernameRaw);
    const users = getUsers();
    const idx = users.findIndex((user) => user.username === username);
    if (idx < 0) return false;

    users[idx] = {
      ...users[idx],
      profile: {
        nombre: profile?.nombre || '',
        edad: Number(profile?.edad) || 0,
        anioNacimiento: Number(profile?.anioNacimiento) || 0,
        anioActual: Number(profile?.anioActual) || (Number(profile?.anioNacimiento) && Number(profile?.edad)
          ? Number(profile.anioNacimiento) + Number(profile.edad)
          : 0),
      },
    };

    saveUsers(users);
    return true;
  }

  function getUserProfile(usernameRaw) {
    const username = normalizeUsername(usernameRaw);
    const user = findUser(username);
    return user?.profile || null;
  }

  function hasTree(usernameRaw) {
    const username = normalizeUsername(usernameRaw);
    const raw = localStorage.getItem(getTreeStorageKey(username));
    if (!raw) return false;

    try {
      const parsed = JSON.parse(raw);
      return Boolean(parsed?.usuario?.nombre);
    } catch (_) {
      return false;
    }
  }

  function getUsersSummary() {
    return getUsers().map((user) => ({
      username: user.username,
      role: user.role,
      createdAt: user.createdAt || null,
      hasTree: user.role === 'admin' ? false : hasTree(user.username),
      profileName: user.profile?.nombre || '',
    }));
  }

  function deleteUser(usernameRaw) {
    const username = normalizeUsername(usernameRaw);
    if (!username || username === ADMIN_ACCOUNT.username) {
      return {
        ok: false,
        code: 'FORBIDDEN',
        message: 'No se puede eliminar la cuenta admin.',
      };
    }

    const users = getUsers();
    const filtered = users.filter((user) => user.username !== username);

    if (filtered.length === users.length) {
      return {
        ok: false,
        code: 'NOT_FOUND',
        message: 'Usuario no encontrado.',
      };
    }

    saveUsers(filtered);
    localStorage.removeItem(getTreeStorageKey(username));

    const session = getSession();
    if (session?.username === username) {
      logout();
    }

    return {
      ok: true,
      message: `Usuario ${username} eliminado.`,
    };
  }

  return {
    bootstrap,
    loginOrRegister,
    logout,
    getSession,
    getUsersSummary,
    deleteUser,
    getTreeStorageKey,
    saveUserProfile,
    getUserProfile,
  };
})();
