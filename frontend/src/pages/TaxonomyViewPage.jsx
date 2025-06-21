import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import AdminLayout from "../components/AdminLayout";
import { FaChevronRight, FaTrash } from "react-icons/fa";
import Fuse from "fuse.js";

function TaxonomyViewPage() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [taxonomyData, setTaxonomyData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
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
        "taxonomy.species.name",
        "taxonomy.genus.name",
        "taxonomy.family.name",
      ],
      includeScore: true,
      threshold: 0.4,
      minMatchCharLength: 3,
      ignoreLocation: true,
    });

    const results = fuse.search(searchTerm).map((result) => result.item);
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
            <span className="text-gray-800 truncate">
              {data.taxonomy.kingdom}
            </span>
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

  const Pagination = ({ totalItems }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    const handlePageClick = (pageNumber) => {
      setCurrentPage(pageNumber);
      window.scrollTo(0, 0);
    };

    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center mt-8 space-x-2">
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-50 border"
          }`}
        >
          Previous
        </button>
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => handlePageClick(number)}
            className={`px-3 py-1 rounded ${
              currentPage === number
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border"
            }`}
          >
            {number}
          </button>
        ))}
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded ${
            currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-50 border"
          }`}
        >
          Next
        </button>
      </div>
    );
  };

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <AdminLayout>
      <div className="mt-4 bg-white border-2 rounded-xl p-6 shadow-lg font-Poppins">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          {/* Judul */}
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <h1 className="text-xl font-semibold text-gray-800 whitespace-nowrap py-2">
              Data Klasifikasi Taksonomi
            </h1>
          </div>

          {/* Search + Tombol Aksi */}
          <div className="flex gap-3">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Cari klasifikasi..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full py-2.5 pl-10 pr-4 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <button
              className="px-4 py-2 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
              onClick={() => navigate("/taxonomy/add")}
            >
              + Tambah
            </button>
          </div>
        </div>

        {showDeleteModal && <DeleteModal />}

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600">
                Memuat data klasifikasi...
              </span>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {currentItems.map((item, index) => (
                <TaxonomyCard key={index} data={item} />
              ))}
            </div>
            <Pagination totalItems={filteredData.length} />
            {filteredData.length > 0 && (
              <div className="text-center text-sm text-gray-600 mt-4">
                Menampilkan {indexOfFirstItem + 1} -{" "}
                {Math.min(indexOfLastItem, filteredData.length)} dari{" "}
                {filteredData.length} data
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}

export default TaxonomyViewPage;
