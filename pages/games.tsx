import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { addDoc, collection, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';
import { getGameIcon } from '@/utils/gameIcons';
import { gameIcons } from '@/utils/gameIcons';

export default function Games() {
  const { games, loading } = useApp();
  const [newGame, setNewGame] = useState({
    name: '',
    winPoints: 0,
    participationPoints: 0,
  });
  const [showIconSelector, setShowIconSelector] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'games'), {
        ...newGame,
        createdAt: new Date(),
      });
      setNewGame({ name: '', winPoints: 0, participationPoints: 0 });
      toast.success('¡Juego agregado exitosamente!');
    } catch (error) {
      toast.error('Error al agregar el juego');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'games', id));
      toast.success('¡Juego eliminado exitosamente!');
    } catch (error) {
      toast.error('Error al eliminar el juego');
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Agregar Nuevo Juego</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Juego
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="text"
                value={newGame.name}
                onChange={(e) => setNewGame({ ...newGame, name: e.target.value })}
                className="h-12 mt-1 block w-full rounded-lg border-gray-300 shadow-sm 
                  focus:border-indigo-500 focus:ring-indigo-500 
                  placeholder-gray-400 text-gray-900 text-base px-4"
                placeholder="Ej: Ping Pong"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {getGameIcon(newGame.name)({ className: 'h-6 w-6 text-gray-400' })}
              </div>
            </div>
            <div className="mt-2">
              <button
                type="button"
                onClick={() => setShowIconSelector(!showIconSelector)}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Ver Iconos y Juegos sugeridos
              </button>
              {showIconSelector && (
                <div className="mt-2 grid grid-cols-3 gap-2 p-2 bg-gray-50 rounded-md text-blue-900">
                  {Object.entries(gameIcons).map(([name, Icon]) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => {
                        setNewGame({ ...newGame, name });
                        setShowIconSelector(false);
                      }}
                      className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-sm">{name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Puntos por Victoria
              </label>
              <input
                type="number"
                value={newGame.winPoints}
                onChange={(e) =>
                  setNewGame({ ...newGame, winPoints: Number(e.target.value) })
                }
                className="h-12 mt-1 block w-full rounded-lg border-gray-300 shadow-sm 
                  focus:border-indigo-500 focus:ring-indigo-500 
                  placeholder-gray-400 text-gray-900 text-base px-4"
                placeholder="Ej: 3"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Puntos por Participación
              </label>
              <input
                type="number"
                value={newGame.participationPoints}
                onChange={(e) =>
                  setNewGame({
                    ...newGame,
                    participationPoints: Number(e.target.value),
                  })
                }
                className="h-12 mt-1 block w-full rounded-lg border-gray-300 shadow-sm 
                  focus:border-indigo-500 focus:ring-indigo-500 
                  placeholder-gray-400 text-gray-900 text-base px-4"
                placeholder="Ej: 1"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Agregar Juego
          </button>
        </form>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Lista de Juegos</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Juego
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Puntos Victoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Puntos Participación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {games.map((game) => (
                <tr key={game.id} className="text-blue-900">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-blue-900">
                      {getGameIcon(game.name)({ className: 'h-5 w-5 mr-2 text-gray-500' })}
                      {game.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {game.winPoints}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {game.participationPoints}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(game.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 