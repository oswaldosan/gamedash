import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { addDoc, collection, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';
import { UserIcon, PhoneIcon } from '@heroicons/react/24/outline';

export default function Players() {
  const { players, loading } = useApp();
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    phoneNumber: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'players'), {
        ...newPlayer,
        totalPoints: 0,
        createdAt: new Date(),
      });
      setNewPlayer({ name: '', phoneNumber: '' });
      toast.success('¡Jugador registrado exitosamente!');
    } catch (error) {
      toast.error('Error al registrar el jugador');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'players', id));
      toast.success('¡Jugador eliminado exitosamente!');
    } catch (error) {
      toast.error('Error al eliminar el jugador');
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Registrar Nuevo Jugador</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={newPlayer.name}
                onChange={(e) =>
                  setNewPlayer({ ...newPlayer, name: e.target.value })
                }
                className="h-12 block w-full rounded-lg border-gray-300 pl-10 
                  focus:border-indigo-500 focus:ring-indigo-500 
                  placeholder-gray-400 text-gray-900 text-base"
                placeholder="Ej: Juan Pérez"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Teléfono
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                value={newPlayer.phoneNumber}
                onChange={(e) =>
                  setNewPlayer({ ...newPlayer, phoneNumber: e.target.value })
                }
                className="h-12 block w-full rounded-lg border-gray-300 pl-10 
                  focus:border-indigo-500 focus:ring-indigo-500 
                  placeholder-gray-400 text-gray-900 text-base"
                placeholder="Ej: +52 123 456 7890"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-12 inline-flex justify-center items-center rounded-lg border 
              border-transparent bg-indigo-600 px-6 text-base font-medium text-white 
              shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 
              focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          >
            Registrar Jugador
          </button>
        </form>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Lista de Jugadores</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teléfono
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Puntos Totales
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {players.map((player) => (
                <tr key={player.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <UserIcon className="h-4 w-4 text-indigo-600" />
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-900">
                        {player.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-500">
                        {player.phoneNumber}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      {player.totalPoints} puntos
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(player.id)}
                      className="text-red-600 hover:text-red-900 transition-colors"
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