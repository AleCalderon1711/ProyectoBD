export default function Login() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded border border-gray-200 bg-white p-8">
        <div className="mb-6 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded bg-gray-200 text-xs text-gray-500">
            LOGO
          </div>
        </div>

        <form className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm text-gray-600">Correo</label>
            <input
              type="email"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              placeholder="correo@empresa.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-600">Contraseña</label>
            <input
              type="password"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            className="mt-2 rounded bg-gray-800 py-2 text-sm text-white hover:bg-gray-700"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  )
}
