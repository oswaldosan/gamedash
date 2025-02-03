import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { addDoc, collection, deleteDoc, doc, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';
import { UserIcon, IdentificationIcon, GlobeAmericasIcon } from '@heroicons/react/24/outline';
import { getCountryFromNumber } from '@/utils/countryConfig';

export default function Players() {
  const { players, loading } = useApp();
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    playerNumber: '',
    country: '',
    color: '',
  });

  // Obtener el último número correlativo
  useEffect(() => {
    const getNextPlayerNumber = async () => {
      const playersQuery = query(collection(db, 'players'), orderBy('playerNumber', 'desc'));
      const snapshot = await getDocs(playersQuery);
      const lastPlayer = snapshot.docs[0];
      const nextNumber = lastPlayer ? (lastPlayer.data().playerNumber || 0) + 1 : 1;
      setNewPlayer(prev => ({ ...prev, playerNumber: nextNumber.toString() }));
    };

    getNextPlayerNumber();
  }, [players]); // Se actualiza cuando cambia la lista de jugadores

  const handlePlayerNumberChange = (value: string) => {
    if (/^\d*$/.test(value)) {
      setNewPlayer(prev => {
        const countryConfig = getCountryFromNumber(value);
        return {
          ...prev,
          playerNumber: value,
          country: countryConfig?.name || '',
          color: countryConfig?.color || '',
        };
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const countryConfig = getCountryFromNumber(newPlayer.playerNumber);
      if (!countryConfig) {
        toast.error('Número de jugador no válido para ningún país');
        return;
      }

      await addDoc(collection(db, 'players'), {
        name: newPlayer.name,
        playerNumber: newPlayer.playerNumber,
        country: countryConfig.name,
        color: countryConfig.color,
        totalPoints: 0,
        createdAt: new Date(),
      });
      setNewPlayer({ name: '', playerNumber: '', country: '', color: '' });
      toast.success('¡Jugador registrado exitosamente!');
    } catch (error) {
      toast.error('Error al registrar el jugador' + error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'players', id));
      toast.success('¡Jugador eliminado exitosamente!');
    } catch (error) {
      toast.error('Error al eliminar el jugador' + error);
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Jugador
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IdentificationIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={newPlayer.playerNumber}
                  onChange={(e) => handlePlayerNumberChange(e.target.value)}
                  className="h-12 block w-full rounded-lg border-gray-300 pl-10 
                    focus:border-indigo-500 focus:ring-indigo-500 
                    placeholder-gray-400 text-gray-900 text-base"
                  placeholder="Ej: 08"
                  required
                  pattern="\d+"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                País
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <GlobeAmericasIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={newPlayer.country}
                  className="h-12 block w-full rounded-lg border-gray-300 pl-10 
                    focus:border-indigo-500 focus:ring-indigo-500 
                    placeholder-gray-400 text-gray-900 text-base bg-gray-50"
                  placeholder="País se detectará automáticamente"
                  disabled
                />
              </div>
            </div>
          </div>

          {newPlayer.country && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Detalles del País
                  </label>
                  <div className="flex items-center space-x-2">
                    <GlobeAmericasIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-900">{newPlayer.country}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color Asignado
                  </label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    getCountryFromNumber(newPlayer.playerNumber)?.bgColor || ''
                  } ${
                    getCountryFromNumber(newPlayer.playerNumber)?.textColor || ''
                  }`}>
                    {newPlayer.color || 'No asignado'}
                  </span>
                </div>
              </div>
            </div>
          )}

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
                  Número
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  País
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
                      <div className={`h-8 w-8 rounded-full ${
                        getCountryFromNumber(player.playerNumber)?.bgColor || 'bg-gray-100'
                      } flex items-center justify-center`}>
                        <UserIcon className={`h-4 w-4 ${
                          getCountryFromNumber(player.playerNumber)?.textColor || 'text-gray-600'
                        }`} />
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-900">
                        {player.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 font-medium">
                      {player.playerNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        getCountryFromNumber(player.playerNumber)?.bgColor || 'bg-gray-100'
                      } ${
                        getCountryFromNumber(player.playerNumber)?.textColor || 'text-gray-800'
                      }`}>
                        {getCountryFromNumber(player.playerNumber)?.name || 'País no definido'}
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