import { useState } from 'react';
import {
  Trophy,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  X,
} from 'lucide-react';
import { loginUser, registerUserApi, socialLoginApi } from '../services/api';

export default function LoginPage({ onLoginSuccess }) {
  // Modo: 'login' o 'register'
  const [mode, setMode] = useState('login');

  // Estados de formulario
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Estados de validación y carga
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Modal de Login Social (Google / GitHub)
  const [socialProvider, setSocialProvider] = useState(null);
  const [socialName, setSocialName] = useState('');
  const [socialEmail, setSocialEmail] = useState('');

  // Modal de ¿Olvidaste tu contraseña?
  const [forgotOpen, setForgotOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (mode === 'register') {
      if (!firstName.trim()) {
        errors.firstName = 'Ingresa tu nombre.';
        isValid = false;
      }
      if (!lastName.trim()) {
        errors.lastName = 'Ingresa tu apellido.';
        isValid = false;
      }
      if (!email.trim() || !email.includes('@')) {
        errors.email = 'Ingresa un correo válido.';
        isValid = false;
      }
    }

    if (!username.trim()) {
      errors.username = 'Ingresa tu nombre de usuario.';
      isValid = false;
    }
    if (!password.trim()) {
      errors.password = 'Ingresa tu contraseña.';
      isValid = false;
    } else if (password.trim().length < 4) {
      errors.password = 'La contraseña debe tener mínimo 4 caracteres.';
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccessMsg('');

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (mode === 'login') {
        const userData = await loginUser(username, password);
        onLoginSuccess(userData);
      } else {
        const newUser = await registerUserApi({
          firstName,
          lastName,
          username,
          email,
          password,
        });
        onLoginSuccess(newUser);
      }
    } catch (error) {
      setApiError('Usuario o contraseña incorrectos. Verifica tus datos o regístrate.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenSocial = (provider) => {
    setSocialProvider(provider);
    setSocialName('Carlos Alemán');
    setSocialEmail(
      provider === 'Google' ? 'carlos.aleman@gmail.com' : 'yahelaleman1904@github.com'
    );
  };

  const handleConfirmSocialLogin = async (e) => {
    e.preventDefault();
    if (!socialName.trim()) return;
    setIsLoading(true);
    try {
      const userData = await socialLoginApi(socialProvider, socialName, socialEmail);
      setSocialProvider(null);
      onLoginSuccess(userData);
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoUser = (u, p) => {
    setMode('login');
    setUsername(u);
    setPassword(p);
    setFieldErrors({});
    setApiError('');
  };

  return (
    <div className="min-h-screen flex bg-[#0F172A] text-[#F8FAFC]">
      {/* Mitad Izquierda: Estadio Nocturno */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 flex-col justify-between p-12">
        <img
          src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1400&q=80"
          alt="Estadio nocturno"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/60 to-transparent" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#10B981]/15 border border-[#10B981]/40 flex items-center justify-center text-[#10B981]">
            <Trophy className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Pronostika</span>
        </div>

        <div className="relative z-10 max-w-lg my-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] text-xs font-semibold tracking-wider uppercase mb-6">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            TEMPORADA 2026/27 EN VIVO
          </div>
          <h1 className="text-5xl font-extrabold leading-tight mb-4">
            Tus pronósticos merecen <span className="text-[#10B981]">ganar</span>
          </h1>
          <p className="text-[#94A3B8] text-lg leading-relaxed">
            Analiza cada partido con datos en tiempo real y convierte tu conocimiento del fútbol en victorias.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-12 pt-6 border-t border-slate-800/80">
          <div>
            <p className="text-3xl font-bold text-white">1.2M+</p>
            <p className="text-sm text-[#94A3B8]">Pronósticos</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">40+</p>
            <p className="text-sm text-[#94A3B8]">Ligas</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[#10B981]">87%</p>
            <p className="text-sm text-[#94A3B8]">Precisión IA</p>
          </div>
        </div>
      </div>

      {/* Mitad Derecha: Login / Registro */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-[#0F172A] overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">
              {mode === 'login' ? 'Bienvenido de nuevo' : 'Crea tu cuenta gratis'}
            </h2>
            <p className="text-[#94A3B8] text-sm">
              {mode === 'login'
                ? 'Inicia sesión para continuar con tus pronósticos.'
                : 'Regístrate por primera vez y comienza a pronosticar.'}
            </p>
          </div>

          {/* Botones de Inicio Rápido con Google y GitHub */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button
              type="button"
              onClick={() => handleOpenSocial('Google')}
              className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-white text-sm font-medium transition cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.2 8.9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6l3.7 2.9c2.2-2 3.7-5 3.7-8.7z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.3 14.8c-.2-.8-.4-1.6-.4-2.5s.2-1.7.4-2.5L1.6 7C.6 9 0 11.2 0 13.5s.6 4.5 1.6 6.5l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5l-3.7 2.9C3.5 21.4 7.4 24 12 24z"
                />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenSocial('GitHub')}
              className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-white text-sm font-medium transition cursor-pointer"
            >
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </button>
          </div>

          <div className="relative flex py-2 items-center mb-5">
            <div className="grow border-t border-[#334155]"></div>
            <span className="shrink mx-4 text-xs text-slate-500 uppercase">
              O con tus credenciales
            </span>
            <div className="grow border-t border-[#334155]"></div>
          </div>

          {apiError && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{apiError}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 flex items-center gap-3 text-[#10B981] text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {mode === 'register' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-200 mb-1.5">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Ej. Carlos"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E293B] border border-[#334155] text-white text-sm focus:outline-none focus:border-[#10B981]"
                    />
                    {fieldErrors.firstName && (
                      <p className="mt-1 text-xs text-red-400">{fieldErrors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-200 mb-1.5">
                      Apellido
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Ej. Alemán"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E293B] border border-[#334155] text-white text-sm focus:outline-none focus:border-[#10B981]"
                    />
                    {fieldErrors.lastName && (
                      <p className="mt-1 text-xs text-red-400">{fieldErrors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-200 mb-1.5">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@correo.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1E293B] border border-[#334155] text-white text-sm focus:outline-none focus:border-[#10B981]"
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>
                  )}
                </div>
              </>
            )}

            {/* Usuario */}
            <div>
              <label className="block text-xs font-medium text-slate-200 mb-1.5">
                Usuario {mode === 'login' && 'o Correo'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ej. emilys o tu usuario"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1E293B] border ${
                    fieldErrors.username ? 'border-red-500' : 'border-[#334155]'
                  } text-white text-sm focus:outline-none focus:border-[#10B981]`}
                />
              </div>
              {fieldErrors.username && (
                <p className="mt-1 text-xs text-red-400">{fieldErrors.username}</p>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-200">Contraseña</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setForgotOpen(true);
                      setRecoverySent(false);
                    }}
                    className="text-xs text-[#10B981] hover:underline cursor-pointer"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#1E293B] border ${
                    fieldErrors.password ? 'border-red-500' : 'border-[#334155]'
                  } text-white text-sm focus:outline-none focus:border-[#10B981]`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-red-400">{fieldErrors.password}</p>
              )}
            </div>

            {/* Botones rápidos de cuentas de DummyJSON */}
            {mode === 'login' && (
              <div className="p-3 rounded-xl bg-[#1E293B]/60 border border-[#334155]">
                <p className="text-[11px] text-[#94A3B8] mb-2">
                  Cuentas oficiales de DummyJSON (clic para autocompletar):
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => fillDemoUser('emilys', 'emilyspass')}
                    className="px-2.5 py-1 rounded-lg bg-[#0F172A] hover:bg-[#10B981]/20 border border-[#334155] text-xs text-[#10B981] font-medium cursor-pointer"
                  >
                    Emily (emilys)
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoUser('michaelw', 'michaelwpass')}
                    className="px-2.5 py-1 rounded-lg bg-[#0F172A] hover:bg-[#10B981]/20 border border-[#334155] text-xs text-[#10B981] font-medium cursor-pointer"
                  >
                    Michael (michaelw)
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoUser('sophiab', 'sophiabpass')}
                    className="px-2.5 py-1 rounded-lg bg-[#0F172A] hover:bg-[#10B981]/20 border border-[#334155] text-xs text-[#10B981] font-medium cursor-pointer"
                  >
                    Sophia (sophiab)
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-slate-950 font-bold text-sm transition cursor-pointer disabled:opacity-60"
            >
              {isLoading
                ? 'Procesando...'
                : mode === 'login'
                ? 'Entrar'
                : 'Registrarme y Entrar'}
            </button>
          </form>

          {/* Cambiar entre Login y Registro */}
          <p className="mt-6 text-center text-sm text-[#94A3B8]">
            {mode === 'login' ? (
              <>
                ¿Primera vez en Pronostika?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setApiError('');
                    setFieldErrors({});
                  }}
                  className="text-[#10B981] font-semibold cursor-pointer hover:underline"
                >
                  Regístrate gratis
                </button>
              </>
            ) : (
              <>
                ¿Ya tienes una cuenta?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setApiError('');
                    setFieldErrors({});
                  }}
                  className="text-[#10B981] font-semibold cursor-pointer hover:underline"
                >
                  Inicia sesión aquí
                </button>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Modal interactivo para Login con Google / GitHub */}
      {socialProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#1E293B] border border-[#334155] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">
                Continuar con {socialProvider}
              </h3>
              <button
                onClick={() => setSocialProvider(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[#94A3B8] mb-4">
              Ingresa tu nombre para personalizar tu perfil en el Dashboard de Pronostika:
            </p>
            <form onSubmit={handleConfirmSocialLogin} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Tu Nombre y Apellido</label>
                <input
                  type="text"
                  required
                  value={socialName}
                  onChange={(e) => setSocialName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0F172A] border border-[#334155] text-white text-sm focus:outline-none focus:border-[#10B981]"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Correo de {socialProvider}
                </label>
                <input
                  type="email"
                  required
                  value={socialEmail}
                  onChange={(e) => setSocialEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0F172A] border border-[#334155] text-white text-sm focus:outline-none focus:border-[#10B981]"
                />
              </div>
              <button
                type="submit"
                className="w-full mt-2 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-slate-950 font-bold text-sm cursor-pointer"
              >
                Autenticar como {socialName || 'Usuario'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Recuperación de Contraseña */}
      {forgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#1E293B] border border-[#334155] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">Recuperar contraseña</h3>
              <button
                onClick={() => setForgotOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {recoverySent ? (
              <div className="text-center py-4">
                <CheckCircle2 className="w-10 h-10 text-[#10B981] mx-auto mb-3" />
                <p className="text-sm text-white font-semibold mb-1">¡Enlace enviado!</p>
                <p className="text-xs text-[#94A3B8] mb-4">
                  Enviamos las instrucciones de acceso a {recoveryEmail}.
                </p>
                <button
                  onClick={() => setForgotOpen(false)}
                  className="w-full py-2 rounded-xl bg-[#10B981] text-slate-950 font-bold text-xs cursor-pointer"
                >
                  Entendido
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (recoveryEmail.trim()) setRecoverySent(true);
                }}
                className="space-y-3"
              >
                <p className="text-xs text-[#94A3B8]">
                  Ingresa tu correo y te enviaremos un enlace temporal para restablecer tu acceso.
                </p>
                <input
                  type="email"
                  required
                  placeholder="tu@correo.com"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F172A] border border-[#334155] text-white text-sm focus:outline-none focus:border-[#10B981]"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-slate-950 font-bold text-sm cursor-pointer"
                >
                  Enviar enlace
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}