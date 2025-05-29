import React, { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import AdminLayout from "../components/AdminLayout";
import { FaChevronRight, FaTrash } from "react-icons/fa";

function TaxonomyViewPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [taxonomyData, setTaxonomyData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState({ loading: false, message: "" });

  useEffect(() => {
    fetchTaxonomyData();
  }, []);

  const fetchTaxonomyData = async () => {
    try {
      setLoading(true);
      const taxonomyRes = await axiosClient.get("/api/taxonomy/full");
      
      const processedData = taxonomyRes.data.species.map(species => {
        const genus = taxonomyRes.data.genuses.find(g => g.id === species.genus_id);
        if (!genus) return null;

        const family = taxonomyRes.data.families.find(f => f.id === genus.family_id);
        if (!family) return null;

        const order = taxonomyRes.data.orders.find(o => o.id === family.order_id);
        if (!order) return null;

        const subclass = taxonomyRes.data.subclasses.find(sc => sc.id === order.subclass_id);
        if (!subclass) return null;

        const classData = taxonomyRes.data.classes.find(c => c.id === subclass.class_id);
        if (!classData) return null;

        const division = taxonomyRes.data.divisions.find(d => d.id === classData.division_id);
        if (!division) return null;

        const superdivision = taxonomyRes.data.superdivisions.find(sd => sd.id === division.superdivision_id);
        if (!superdivision) return null;

        const subkingdom = taxonomyRes.data.subkingdoms.find(sk => sk.id === superdivision.subkingdom_id);
        if (!subkingdom) return null;

        return {
          taxonomy: {
            kingdom: "Plantae",
            subkingdom: { id: subkingdom.id, name: subkingdom.name },
            superdivision: { id: superdivision.id, name: superdivision.name },
            division: { id: division.id, name: division.name },
            class: { id: classData.id, name: classData.name },
            subclass: { id: subclass.id, name: subclass.name },
            order: { id: order.id, name: order.name },
            family: { id: family.id, name: family.name },
            genus: { id: genus.id, name: genus.name },
            species: { id: species.id, name: species.name }
          }
        };
      }).filter(Boolean);

      const sortedData = processedData.sort((a, b) => 
        a.taxonomy.species.name.localeCompare(b.taxonomy.species.name)
      );

      setTaxonomyData(sortedData);
    } catch (err) {
      console.error("Error fetching taxonomy data:", err);
      setError("Gagal memuat data taksonomi");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = taxonomyData.filter(item => 
    item.taxonomy.species.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.taxonomy.genus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.taxonomy.family.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (speciesData) => {
    setSelectedSpecies(speciesData);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedSpecies) return;
    
    try {
      setDeleteStatus({ loading: true, message: "Memeriksa relasi..." });
      
      // Get all relationships first
      const taxonomyRes = await axiosClient.get("/api/taxonomy/full");
      const species = taxonomyRes.data.species.find(s => s.name === selectedSpecies.taxonomy.species.name);
      if (!species) {
        throw new Error("Species tidak ditemukan");
      }

      const genus = taxonomyRes.data.genuses.find(g => g.id === species.genus_id);
      const otherSpeciesInGenus = taxonomyRes.data.species.filter(s => 
        s.genus_id === genus.id && s.id !== species.id
      );

      const family = taxonomyRes.data.families.find(f => f.id === genus.family_id);
      const otherGenusInFamily = taxonomyRes.data.genuses.filter(g => 
        g.family_id === family.id && g.id !== genus.id
      );

      const order = taxonomyRes.data.orders.find(o => o.id === family.order_id);
      const otherFamilyInOrder = taxonomyRes.data.families.filter(f => 
        f.order_id === order.id && f.id !== family.id
      );

      const subclass = taxonomyRes.data.subclasses.find(sc => sc.id === order.subclass_id);
      const otherOrderInSubclass = taxonomyRes.data.orders.filter(o => 
        o.subclass_id === subclass.id && o.id !== order.id
      );

      const classData = taxonomyRes.data.classes.find(c => c.id === subclass.class_id);
      const otherSubclassInClass = taxonomyRes.data.subclasses.filter(sc => 
        sc.class_id === classData.id && sc.id !== subclass.id
      );

      const division = taxonomyRes.data.divisions.find(d => d.id === classData.division_id);
      const otherClassInDivision = taxonomyRes.data.classes.filter(c => 
        c.division_id === division.id && c.id !== classData.id
      );

      const superdivision = taxonomyRes.data.superdivisions.find(sd => sd.id === division.superdivision_id);
      const otherDivisionInSuperdivision = taxonomyRes.data.divisions.filter(d => 
        d.superdivision_id === superdivision.id && d.id !== division.id
      );

      const subkingdom = taxonomyRes.data.subkingdoms.find(sk => sk.id === superdivision.subkingdom_id);
      const otherSuperdivisionInSubkingdom = taxonomyRes.data.superdivisions.filter(sd => 
        sd.subkingdom_id === subkingdom.id && sd.id !== superdivision.id
      );

      // Start deleting from species level up
      setDeleteStatus({ loading: true, message: "Menghapus species..." });
      try {
        await axiosClient.delete(`/api/taxonomy/species/${selectedSpecies.taxonomy.species.id}`);
      } catch (err) {
        if (err.response?.status === 400) {
          setDeleteStatus({ 
            loading: false, 
            message: `⚠️ ${err.response.data.error}. Terdapat ${err.response.data.usedIn} tanaman yang menggunakan species ini.`
          });
          return;
        }
        throw err;
      }

      // Check and delete genus if no other species
      if (otherSpeciesInGenus.length === 0) {
        setDeleteStatus({ loading: true, message: "Menghapus genus..." });
        await axiosClient.delete(`/api/taxonomy/genus/${selectedSpecies.taxonomy.genus.id}`);

        // Check and delete family if no other genus
        if (otherGenusInFamily.length === 0) {
          setDeleteStatus({ loading: true, message: "Menghapus family..." });
          await axiosClient.delete(`/api/taxonomy/family/${selectedSpecies.taxonomy.family.id}`);

          // Check and delete order if no other family
          if (otherFamilyInOrder.length === 0) {
            setDeleteStatus({ loading: true, message: "Menghapus order..." });
            await axiosClient.delete(`/api/taxonomy/order/${selectedSpecies.taxonomy.order.id}`);

            // Check and delete subclass if no other order
            if (otherOrderInSubclass.length === 0) {
              setDeleteStatus({ loading: true, message: "Menghapus subclass..." });
              await axiosClient.delete(`/api/taxonomy/subclass/${selectedSpecies.taxonomy.subclass.id}`);

              // Check and delete class if no other subclass
              if (otherSubclassInClass.length === 0) {
                setDeleteStatus({ loading: true, message: "Menghapus class..." });
                await axiosClient.delete(`/api/taxonomy/class/${selectedSpecies.taxonomy.class.id}`);

                // Check and delete division if no other class
                if (otherClassInDivision.length === 0) {
                  setDeleteStatus({ loading: true, message: "Menghapus division..." });
                  await axiosClient.delete(`/api/taxonomy/division/${selectedSpecies.taxonomy.division.id}`);

                  // Check and delete superdivision if no other division
                  if (otherDivisionInSuperdivision.length === 0) {
                    setDeleteStatus({ loading: true, message: "Menghapus superdivision..." });
                    await axiosClient.delete(`/api/taxonomy/superdivision/${selectedSpecies.taxonomy.superdivision.id}`);

                    // Check and delete subkingdom if no other superdivision
                    if (otherSuperdivisionInSubkingdom.length === 0) {
                      setDeleteStatus({ loading: true, message: "Menghapus subkingdom..." });
                      await axiosClient.delete(`/api/taxonomy/subkingdom/${selectedSpecies.taxonomy.subkingdom.id}`);
                    }
                  }
                }
              }
            }
          }
        }
      }

      setShowDeleteModal(false);
      setDeleteStatus({ loading: false, message: "" });
      fetchTaxonomyData(); // Refresh the data
    } catch (err) {
      console.error("Error deleting taxonomy:", err);
      setDeleteStatus({ 
        loading: false, 
        message: "Gagal menghapus: " + (err.response?.data?.error || err.message)
      });
    }
  };

  const TaxonomyCard = ({ data }) => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="mb-4 border-b pb-3 flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{data.taxonomy.species.name}</h3>
          <p className="text-gray-600 italic">{data.taxonomy.genus.name}</p>
        </div>
        <button
          onClick={() => handleDelete(data)}
          className="text-red-600 hover:text-red-800 p-2"
          title="Hapus klasifikasi"
        >
          <FaTrash size={18} />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <span className="font-semibold w-32">Kingdom</span>
            <FaChevronRight className="mx-2 text-gray-400" />
            <span>{data.taxonomy.kingdom}</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="font-semibold w-32">Subkingdom</span>
            <FaChevronRight className="mx-2 text-gray-400" />
            <span>{data.taxonomy.subkingdom.name}</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="font-semibold w-32">Superdivision</span>
            <FaChevronRight className="mx-2 text-gray-400" />
            <span>{data.taxonomy.superdivision.name}</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="font-semibold w-32">Division</span>
            <FaChevronRight className="mx-2 text-gray-400" />
            <span>{data.taxonomy.division.name}</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="font-semibold w-32">Class</span>
            <FaChevronRight className="mx-2 text-gray-400" />
            <span>{data.taxonomy.class.name}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <span className="font-semibold w-32">Subclass</span>
            <FaChevronRight className="mx-2 text-gray-400" />
            <span>{data.taxonomy.subclass.name}</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="font-semibold w-32">Order</span>
            <FaChevronRight className="mx-2 text-gray-400" />
            <span>{data.taxonomy.order.name}</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="font-semibold w-32">Family</span>
            <FaChevronRight className="mx-2 text-gray-400" />
            <span>{data.taxonomy.family.name}</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="font-semibold w-32">Genus</span>
            <FaChevronRight className="mx-2 text-gray-400" />
            <span>{data.taxonomy.genus.name}</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="font-semibold w-32">Species</span>
            <FaChevronRight className="mx-2 text-gray-400" />
            <span>{data.taxonomy.species.name}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const DeleteModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-bold mb-4">Konfirmasi Penghapusan</h3>
        <p className="mb-4">
          Anda akan menghapus species "{selectedSpecies?.taxonomy.species.name}". 
          Tindakan ini juga akan menghapus tingkatan klasifikasi di atasnya yang tidak memiliki relasi dengan species lain.
        </p>
        {deleteStatus.message && (
          <div className={`mb-4 p-3 rounded ${
            deleteStatus.message.startsWith("⚠️") 
              ? "bg-yellow-50 text-yellow-800 border border-yellow-200"
              : "bg-blue-50 text-blue-800"
          }`}>
            {deleteStatus.message}
          </div>
        )}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => {
              setShowDeleteModal(false);
              setDeleteStatus({ loading: false, message: "" });
            }}
            disabled={deleteStatus.loading}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            {deleteStatus.message.startsWith("⚠️") ? "Tutup" : "Batal"}
          </button>
          {!deleteStatus.message.startsWith("⚠️") && (
            <button
              onClick={confirmDelete}
              disabled={deleteStatus.loading}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-300"
            >
              {deleteStatus.loading ? "Menghapus..." : "Hapus"}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">Data Klasifikasi Taksonomi</h1>
          
          <div className="mb-6">
            <input
              type="text"
              placeholder="Cari berdasarkan nama species, genus, atau family..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border rounded-lg"
            />
          </div>

          {showDeleteModal && <DeleteModal />}

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Memuat data...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              {searchTerm ? "Tidak ada hasil yang cocok dengan pencarian" : "Belum ada data taksonomi"}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredData.map((item, index) => (
                <TaxonomyCard key={index} data={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default TaxonomyViewPage; 