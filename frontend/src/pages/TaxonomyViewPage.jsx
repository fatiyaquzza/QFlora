import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import AdminLayout from "../components/AdminLayout";
import { FaChevronRight, FaTrash } from "react-icons/fa";
import Fuse from 'fuse.js';

function TaxonomyViewPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [taxonomyData, setTaxonomyData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState({
    loading: false,
    message: "",
  });

  useEffect(() => {
    fetchTaxonomyData();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim() || taxonomyData.length === 0) {
      setFilteredData(taxonomyData);
      return;
    }

    const fuse = new Fuse(taxonomyData, {
      keys: [
        'taxonomy.species.name',
        'taxonomy.genus.name',
        'taxonomy.family.name'
      ],
      includeScore: true,
      threshold: 0.4,
      minMatchCharLength: 3,
      ignoreLocation: true,
    });

    const results = fuse.search(searchTerm).map(result => result.item);
    setFilteredData(results);
  }, [searchTerm, taxonomyData]);

  const fetchTaxonomyData = async () => {
    try {
      setLoading(true);
      const taxonomyRes = await axiosClient.get("/api/taxonomy/full");

      const processedData = taxonomyRes.data.species
        .map((species) => {
          const genus = taxonomyRes.data.genuses.find(
            (g) => g.id === species.genus_id
          );
          if (!genus) return null;

          const family = taxonomyRes.data.families.find(
            (f) => f.id === genus.family_id
          );
          if (!family) return null;

          const order = taxonomyRes.data.orders.find(
            (o) => o.id === family.order_id
          );
          if (!order) return null;

          const subclass = taxonomyRes.data.subclasses.find(
            (sc) => sc.id === order.subclass_id
          );
          if (!subclass) return null;

          const classData = taxonomyRes.data.classes.find(
            (c) => c.id === subclass.class_id
          );
          if (!classData) return null;

          const division = taxonomyRes.data.divisions.find(
            (d) => d.id === classData.division_id
          );
          if (!division) return null;

          const superdivision = taxonomyRes.data.superdivisions.find(
            (sd) => sd.id === division.superdivision_id
          );
          if (!superdivision) return null;

          const subkingdom = taxonomyRes.data.subkingdoms.find(
            (sk) => sk.id === superdivision.subkingdom_id
          );
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
              species: { id: species.id, name: species.name },
            },
          };
        })
        .filter(Boolean);

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
      const species = taxonomyRes.data.species.find(
        (s) => s.name === selectedSpecies.taxonomy.species.name
      );
      if (!species) {
        throw new Error("Species tidak ditemukan");
      }

      const genus = taxonomyRes.data.genuses.find(
        (g) => g.id === species.genus_id
      );
      const otherSpeciesInGenus = taxonomyRes.data.species.filter(
        (s) => s.genus_id === genus.id && s.id !== species.id
      );

      const family = taxonomyRes.data.families.find(
        (f) => f.id === genus.family_id
      );
      const otherGenusInFamily = taxonomyRes.data.genuses.filter(
        (g) => g.family_id === family.id && g.id !== genus.id
      );

      const order = taxonomyRes.data.orders.find(
        (o) => o.id === family.order_id
      );
      const otherFamilyInOrder = taxonomyRes.data.families.filter(
        (f) => f.order_id === order.id && f.id !== family.id
      );

      const subclass = taxonomyRes.data.subclasses.find(
        (sc) => sc.id === order.subclass_id
      );
      const otherOrderInSubclass = taxonomyRes.data.orders.filter(
        (o) => o.subclass_id === subclass.id && o.id !== order.id
      );

      const classData = taxonomyRes.data.classes.find(
        (c) => c.id === subclass.class_id
      );
      const otherSubclassInClass = taxonomyRes.data.subclasses.filter(
        (sc) => sc.class_id === classData.id && sc.id !== subclass.id
      );

      const division = taxonomyRes.data.divisions.find(
        (d) => d.id === classData.division_id
      );
      const otherClassInDivision = taxonomyRes.data.classes.filter(
        (c) => c.division_id === division.id && c.id !== classData.id
      );

      const superdivision = taxonomyRes.data.superdivisions.find(
        (sd) => sd.id === division.superdivision_id
      );
      const otherDivisionInSuperdivision = taxonomyRes.data.divisions.filter(
        (d) => d.superdivision_id === superdivision.id && d.id !== division.id
      );

      const subkingdom = taxonomyRes.data.subkingdoms.find(
        (sk) => sk.id === superdivision.subkingdom_id
      );
      const otherSuperdivisionInSubkingdom =
        taxonomyRes.data.superdivisions.filter(
          (sd) =>
            sd.subkingdom_id === subkingdom.id && sd.id !== superdivision.id
        );

      // Start deleting from species level up
      setDeleteStatus({ loading: true, message: "Menghapus species..." });
      try {
        await axiosClient.delete(
          `/api/taxonomy/species/${selectedSpecies.taxonomy.species.id}`
        );
      } catch (err) {
        if (err.response?.status === 400) {
          setDeleteStatus({
            loading: false,
            message: `⚠️ ${err.response.data.error}. Terdapat ${err.response.data.usedIn} tanaman yang menggunakan species ini.`,
          });
          return;
        }
        throw err;
      }

      // Check and delete genus if no other species
      if (otherSpeciesInGenus.length === 0) {
        setDeleteStatus({ loading: true, message: "Menghapus genus..." });
        await axiosClient.delete(
          `/api/taxonomy/genus/${selectedSpecies.taxonomy.genus.id}`
        );

        // Check and delete family if no other genus
        if (otherGenusInFamily.length === 0) {
          setDeleteStatus({ loading: true, message: "Menghapus family..." });
          await axiosClient.delete(
            `/api/taxonomy/family/${selectedSpecies.taxonomy.family.id}`
          );

          // Check and delete order if no other family
          if (otherFamilyInOrder.length === 0) {
            setDeleteStatus({ loading: true, message: "Menghapus order..." });
            await axiosClient.delete(
              `/api/taxonomy/order/${selectedSpecies.taxonomy.order.id}`
            );

            // Check and delete subclass if no other order
            if (otherOrderInSubclass.length === 0) {
              setDeleteStatus({
                loading: true,
                message: "Menghapus subclass...",
              });
              await axiosClient.delete(
                `/api/taxonomy/subclass/${selectedSpecies.taxonomy.subclass.id}`
              );

              // Check and delete class if no other subclass
              if (otherSubclassInClass.length === 0) {
                setDeleteStatus({
                  loading: true,
                  message: "Menghapus class...",
                });
                await axiosClient.delete(
                  `/api/taxonomy/class/${selectedSpecies.taxonomy.class.id}`
                );

                // Check and delete division if no other class
                if (otherClassInDivision.length === 0) {
                  setDeleteStatus({
                    loading: true,
                    message: "Menghapus division...",
                  });
                  await axiosClient.delete(
                    `/api/taxonomy/division/${selectedSpecies.taxonomy.division.id}`
                  );

                  // Check and delete superdivision if no other division
                  if (otherDivisionInSuperdivision.length === 0) {
                    setDeleteStatus({
                      loading: true,
                      message: "Menghapus superdivision...",
                    });
                    await axiosClient.delete(
                      `/api/taxonomy/superdivision/${selectedSpecies.taxonomy.superdivision.id}`
                    );

                    // Check and delete subkingdom if no other superdivision
                    if (otherSuperdivisionInSubkingdom.length === 0) {
                      setDeleteStatus({
                        loading: true,
                        message: "Menghapus subkingdom...",
                      });
                      await axiosClient.delete(
                        `/api/taxonomy/subkingdom/${selectedSpecies.taxonomy.subkingdom.id}`
                      );
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
      fetchTaxonomyData();
    } catch (err) {
      console.error("Error deleting taxonomy:", err);
      setDeleteStatus({
        loading: false,
        message:
          "Gagal menghapus: " + (err.response?.data?.error || err.message),
      });
    }
  };

  const TaxonomyCard = ({ data }) => (
    <div className="relative p-5 bg-green-50 rounded-lg border border-green-200 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            {data.taxonomy.species.name}
          </h3>
          <p className="text-sm text-gray-500 italic">
            {data.taxonomy.genus.name}
          </p>
        </div>
        <button
          onClick={() => handleDelete(data)}
          className="p-2 text-red-500 rounded-full hover:bg-red-100 transition-colors"
          aria-label="Delete taxonomy"
        >
          <FaTrash />
        </button>
      </div>

      <div className="my-4 border-t border-green-200"></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
        {Object.entries(data.taxonomy)
          .filter(([, value]) => value && value.name)
          .map(([key, value]) => (
            <div key={key} className="flex items-center">
              <span className="font-semibold capitalize text-gray-600 w-28">
                {key.replace("_", " ")}
              </span>
              <FaChevronRight className="mx-2 text-gray-400" size={10} />
              <span className="text-gray-800 truncate">{value.name}</span>
            </div>
          ))}
        {data.taxonomy.kingdom && (
          <div className="flex items-center">
            <span className="font-semibold capitalize text-gray-600 w-28">
              Kingdom
            </span>
            <FaChevronRight className="mx-2 text-gray-400" size={10} />
            <span className="text-gray-800 truncate">{data.taxonomy.kingdom}</span>
          </div>
        )}
      </div>
    </div>
  );

  const DeleteModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-bold mb-4">Konfirmasi Penghapusan</h3>
        <p className="mb-4">
          Anda akan menghapus species "{selectedSpecies?.taxonomy.species.name}
          ". Tindakan ini juga akan menghapus tingkatan klasifikasi di atasnya
          yang tidak memiliki relasi dengan species lain.
        </p>
        {deleteStatus.message && (
          <div
            className={`mb-4 p-3 rounded ${
              deleteStatus.message.startsWith("⚠️")
                ? "bg-yellow-50 text-yellow-800 border border-yellow-200"
                : "bg-blue-50 text-blue-800"
            }`}
          >
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
      <div className="mt-4 bg-white border-2 rounded-xl p-6 shadow-lg font-Poppins">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Data Klasifikasi Taksonomi
          </h1>
          <Link
            to="/taxonomy/add"
            className="px-5 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
          >
            Tambah
          </Link>
        </div>
        
        <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari berdasarkan nama species, genus, atau family..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M16.65 10.35a6.3 6.3 0 11-12.6 0 6.3 6.3 0 0112.6 0z"></path></svg>
              </div>
            </div>
          </div>

        {showDeleteModal && <DeleteModal />}

        {loading ? (
          <p className="text-center text-gray-500">Memuat data...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            {searchTerm
              ? "Tidak ada hasil yang cocok dengan pencarian"
              : "Belum ada data taksonomi"}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredData.map((item, index) => (
              <TaxonomyCard key={index} data={item} />
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default TaxonomyViewPage;
