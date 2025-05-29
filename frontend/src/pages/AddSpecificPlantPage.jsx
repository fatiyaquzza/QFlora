import React, { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import AdminLayout from "../components/AdminLayout";
import { useNavigate } from "react-router-dom";

function AddSpecificPlantPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({
    name: "",
    latin_name: "",
    image_url: "",
    plant_type_id: "",
    overview: "",
    description: "",
    benefits: "",
    characteristics: "",
    origin: "",
    cultivation: "",
    source_ref: "",
    eng_name: "",
    arab_name: "",
  });

  // Add state for chemical components
  const [chemicalComponents, setChemicalComponents] = useState([]);
  const [selectedChemicalComponents, setSelectedChemicalComponents] = useState([]);

  // Add touched state
  const [touched, setTouched] = useState({
    name: false,
    latin_name: false,
    image_url: false,
    plant_type_id: false,
    overview: false,
    description: false,
    benefits: false,
    characteristics: false,
    origin: false,
    cultivation: false,
    source_ref: false,
    eng_name: false,
    arab_name: false,
    chemical_components: false,
  });

  // Store only the selected species ID for the final classification
  const [selectedSpeciesId, setSelectedSpeciesId] = useState(null);

  // All taxonomy data
  const [taxonomyData, setTaxonomyData] = useState({
    subkingdoms: [],
    superdivisions: [],
    divisions: [],
    classes: [],
    subclasses: [],
    orders: [],
    families: [],
    genuses: [], // Note: Backend returns 'genuses' but we'll use 'genera' in our frontend
    species: [],
  });

  // States for taxonomy dropdown options (filtered)
  const [subkingdoms, setSubkingdoms] = useState([]);
  const [superdivisions, setSuperdivisions] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subclasses, setSubclasses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [families, setFamilies] = useState([]);
  const [genera, setGenera] = useState([]);
  const [species, setSpecies] = useState([]);

  // Selected taxonomy items
  const [selectedSubkingdom, setSelectedSubkingdom] = useState("");
  const [selectedSuperdivision, setSelectedSuperdivision] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubclass, setSelectedSubclass] = useState("");
  const [selectedOrder, setSelectedOrder] = useState("");
  const [selectedFamily, setSelectedFamily] = useState("");
  const [selectedGenus, setSelectedGenus] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Add state for plant types
  const [plantTypes, setPlantTypes] = useState([]);

  // Fetch plant types on component mount
  useEffect(() => {
    const fetchPlantTypes = async () => {
      try {
        const response = await axiosClient.get("/api/plant-types");
        setPlantTypes(response.data);
        // Set default plant type if available
        if (response.data.length > 0) {
          setForm((prev) => ({ ...prev, plant_type_id: response.data[0].id }));
        }
      } catch (err) {
        console.error("Error fetching plant types:", err);
      }
    };
    fetchPlantTypes();
  }, []);

  useEffect(() => {
    const fetchAllTaxonomyData = async () => {
      try {
        const response = await axiosClient.get("/api/taxonomy/full");
        setTaxonomyData(response.data);

        setSubkingdoms(response.data.subkingdoms);
      } catch (err) {
        console.error("Error fetching taxonomy data:", err);
        setError("Gagal memuat data taksonomi. Silakan coba lagi.");
      }
    };

    fetchAllTaxonomyData();
  }, []);

  useEffect(() => {
    if (selectedSubkingdom) {
      const filtered = taxonomyData.superdivisions.filter(
        (item) => item.subkingdom_id.toString() === selectedSubkingdom
      );
      setSuperdivisions(filtered);

      setSelectedSuperdivision("");
      setSelectedDivision("");
      setSelectedClass("");
      setSelectedSubclass("");
      setSelectedOrder("");
      setSelectedFamily("");
      setSelectedGenus("");
      setSelectedSpeciesId(null);
      setDivisions([]);
      setClasses([]);
      setSubclasses([]);
      setOrders([]);
      setFamilies([]);
      setGenera([]);
      setSpecies([]);
    }
  }, [selectedSubkingdom, taxonomyData.superdivisions]);

  useEffect(() => {
    if (selectedSuperdivision) {
      const filtered = taxonomyData.divisions.filter(
        (item) => item.superdivision_id.toString() === selectedSuperdivision
      );
      setDivisions(filtered);

      // Reset lower levels
      setSelectedDivision("");
      setSelectedClass("");
      setSelectedSubclass("");
      setSelectedOrder("");
      setSelectedFamily("");
      setSelectedGenus("");
      setSelectedSpeciesId(null);
      setClasses([]);
      setSubclasses([]);
      setOrders([]);
      setFamilies([]);
      setGenera([]);
      setSpecies([]);
    }
  }, [selectedSuperdivision, taxonomyData.divisions]);

  useEffect(() => {
    if (selectedDivision) {
      const filtered = taxonomyData.classes.filter(
        (item) => item.division_id.toString() === selectedDivision
      );
      setClasses(filtered);

      // Reset lower levels
      setSelectedClass("");
      setSelectedSubclass("");
      setSelectedOrder("");
      setSelectedFamily("");
      setSelectedGenus("");
      setSelectedSpeciesId(null);
      setSubclasses([]);
      setOrders([]);
      setFamilies([]);
      setGenera([]);
      setSpecies([]);
    }
  }, [selectedDivision, taxonomyData.classes]);

  // Filter subclasses when class changes
  useEffect(() => {
    if (selectedClass) {
      const filtered = taxonomyData.subclasses.filter(
        (item) => item.class_id.toString() === selectedClass
      );
      setSubclasses(filtered);

      // Reset lower levels
      setSelectedSubclass("");
      setSelectedOrder("");
      setSelectedFamily("");
      setSelectedGenus("");
      setSelectedSpeciesId(null);
      setOrders([]);
      setFamilies([]);
      setGenera([]);
      setSpecies([]);
    }
  }, [selectedClass, taxonomyData.subclasses]);

  // Filter orders when subclass changes
  useEffect(() => {
    if (selectedSubclass) {
      const filtered = taxonomyData.orders.filter(
        (item) => item.subclass_id.toString() === selectedSubclass
      );
      setOrders(filtered);

      // Reset lower levels
      setSelectedOrder("");
      setSelectedFamily("");
      setSelectedGenus("");
      setSelectedSpeciesId(null);
      setFamilies([]);
      setGenera([]);
      setSpecies([]);
    }
  }, [selectedSubclass, taxonomyData.orders]);

  // Filter families when order changes
  useEffect(() => {
    if (selectedOrder) {
      const filtered = taxonomyData.families.filter(
        (item) => item.order_id.toString() === selectedOrder
      );
      setFamilies(filtered);

      // Reset lower levels
      setSelectedFamily("");
      setSelectedGenus("");
      setSelectedSpeciesId(null);
      setGenera([]);
      setSpecies([]);
    }
  }, [selectedOrder, taxonomyData.families]);

  // Filter genera when family changes
  useEffect(() => {
    if (selectedFamily) {
      const filtered = taxonomyData.genuses.filter(
        (item) => item.family_id.toString() === selectedFamily
      );
      setGenera(filtered);

      // Reset lower levels
      setSelectedGenus("");
      setSelectedSpeciesId(null);
      setSpecies([]);
    }
  }, [selectedFamily, taxonomyData.genuses]);

  // Filter species when genus changes
  useEffect(() => {
    if (selectedGenus) {
      const filtered = taxonomyData.species.filter(
        (item) => item.genus_id.toString() === selectedGenus
      );
      setSpecies(filtered);

      // Reset species
      setSelectedSpeciesId(null);
    }
  }, [selectedGenus, taxonomyData.species]);

  useEffect(() => {
    const fetchChemicalComponents = async () => {
      try {
        const response = await axiosClient.get("/api/chemical-components");
        setChemicalComponents(response.data);
      } catch (err) {
        console.error("Error fetching chemical components:", err);
      }
    };
    fetchChemicalComponents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleSubmitPlantDetails = async (e) => {
    e.preventDefault();
    setError("");

    const requiredFields = [
      "name",
      "latin_name",
      "image_url",
      "plant_type_id",
      "overview",
      "description",
      "benefits",
      "characteristics",
      "origin",
      "cultivation",
      "source_ref",
      "eng_name",
      "arab_name"
    ];

    if (selectedChemicalComponents.length === 0) {
      setTouched(prev => ({ ...prev, chemical_components: true }));
      setError("Pilih minimal satu komponen kimia");
      return;
    }

    for (const field of requiredFields) {
      if (!form[field] || form[field].toString().trim() === "") {
        setTouched((prev) => ({ ...prev, [field]: true }));

        document
          .querySelector(`[name="${field}"]`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });

        return;
      }
    }

    setCurrentStep(2);
  };

  const handleSubmitClassification = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!selectedSpeciesId) {
      setError("Silahkan pilih klasifikasi hingga tingkat spesies");
      setIsLoading(false);
      return;
    }

    try {
      const plantData = {
        ...form,
        species_id: selectedSpeciesId,
        chemical_component_ids: selectedChemicalComponents
      };

      await axiosClient.post("/specific-plants", plantData);
      navigate("/specific-plants");
    } catch (err) {
      console.error("Error saving plant data:", err);
      setError(
        err.response?.data?.message || "Terjadi kesalahan saat menyimpan data"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderChemicalComponentsSelect = () => {
    const filteredComponents = chemicalComponents.filter(comp => 
      comp.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Kandungan Kimia
        </label>
        <div className="relative border rounded-lg p-4 space-y-3">
          {/* Search input */}
          <div className="sticky top-0 bg-white pb-2">
            <input
              type="text"
              placeholder="Cari komposisi kimia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Selected count */}
          <div className="text-sm text-gray-600 mb-2">
            {selectedChemicalComponents.length} komposisi terpilih
          </div>

          {/* Checkbox list container with scrollbar */}
          <div className="max-h-60 overflow-y-auto space-y-2">
            {filteredComponents.map((component) => (
              <div key={component.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                <input
                  type="checkbox"
                  id={`comp-${component.id}`}
                  value={component.id}
                  checked={selectedChemicalComponents.includes(component.id.toString())}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedChemicalComponents(prev =>
                      e.target.checked
                        ? [...prev, value]
                        : prev.filter(id => id !== value)
                    );
                    setTouched(prev => ({ ...prev, chemical_components: true }));
                  }}
                  className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                />
                <label htmlFor={`comp-${component.id}`} className="text-sm text-gray-700 cursor-pointer select-none">
                  {component.name}
                </label>
              </div>
            ))}
          </div>

          {/* Show message if no results */}
          {filteredComponents.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              Tidak ada komposisi kimia yang cocok dengan pencarian
            </div>
          )}
        </div>
        
        {touched.chemical_components && selectedChemicalComponents.length === 0 && (
          <p className="text-sm text-red-500 mt-1">
            Pilih minimal satu komponen kimia
          </p>
        )}
      </div>
    );
  };

  const renderStepOne = () => {
    return (
      <form onSubmit={handleSubmitPlantDetails} className="space-y-4 mx-auto">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Tumbuhan
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`w-full p-2 border rounded transition-colors ${
                touched.name && !form.name
                  ? "border-red-500"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              placeholder="Masukkan nama tumbuhan"
              required
            />
            {touched.name && !form.name && (
              <p className="text-sm text-red-500 mt-1">
                Nama tumbuhan wajib diisi
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Latin
            </label>
            <input
              type="text"
              name="latin_name"
              value={form.latin_name}
              onChange={handleChange}
              className={`w-full p-2 border rounded transition-colors ${
                touched.latin_name && !form.latin_name
                  ? "border-red-500"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              placeholder="Masukkan nama latin"
              required
            />
            {touched.latin_name && !form.latin_name && (
              <p className="text-sm text-red-500 mt-1">
                Nama latin wajib diisi
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Inggris
            </label>
            <input
              type="text"
              name="eng_name"
              value={form.eng_name}
              onChange={handleChange}
              className={`w-full p-2 border rounded transition-colors ${
                touched.eng_name && !form.eng_name
                  ? "border-red-500"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              placeholder="Masukkan nama inggris"
              required
            />
            {touched.eng_name && !form.eng_name && (
              <p className="text-sm text-red-500 mt-1">
                Nama inggris wajib diisi
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Arab
            </label>
            <input
              type="text"
              name="arab_name"
              value={form.arab_name}
              onChange={handleChange}
              className={`w-full p-2 border rounded transition-colors ${
                touched.arab_name && !form.arab_name
                  ? "border-red-500"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              placeholder="Masukkan nama arab"
              required
            />
            {touched.arab_name && !form.arab_name && (
              <p className="text-sm text-red-500 mt-1">Nama arab wajib diisi</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL Gambar
            </label>
            <input
              type="text"
              name="image_url"
              value={form.image_url}
              onChange={handleChange}
              className={`w-full p-2 border rounded transition-colors ${
                touched.image_url && !form.image_url
                  ? "border-red-500"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              placeholder="Masukkan URL gambar"
              required
            />
            {touched.image_url && !form.image_url && (
              <p className="text-sm text-red-500 mt-1">
                URL gambar wajib diisi
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jenis Tanaman
            </label>
            <select
              name="plant_type_id"
              value={form.plant_type_id}
              onChange={handleChange}
              className={`w-full p-2 border rounded transition-colors ${
                touched.plant_type_id && !form.plant_type_id
                  ? "border-red-500"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              required
            >
              <option value="">Pilih jenis tanaman</option>
              {plantTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            {touched.plant_type_id && !form.plant_type_id && (
              <p className="text-sm text-red-500 mt-1">
                Jenis tanaman wajib dipilih
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ringkasan
          </label>
          <textarea
            name="overview"
            value={form.overview}
            onChange={handleChange}
            className={`w-full p-2 border rounded transition-colors ${
              touched.overview && !form.overview
                ? "border-red-500"
                : "border-gray-300 hover:border-gray-400"
            }`}
            placeholder="Masukkan ringkasan tumbuhan"
            required
          ></textarea>
          {touched.overview && !form.overview && (
            <p className="text-sm text-red-500 mt-1">Ringkasan wajib diisi</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Deskripsi
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className={`w-full p-2 border rounded transition-colors ${
              touched.description && !form.description
                ? "border-red-500"
                : "border-gray-300 hover:border-gray-400"
            }`}
            placeholder="Masukkan deskripsi tumbuhan"
            required
          ></textarea>
          {touched.description && !form.description && (
            <p className="text-sm text-red-500 mt-1">Deskripsi wajib diisi</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Manfaat
          </label>
          <textarea
            name="benefits"
            value={form.benefits}
            onChange={handleChange}
            className={`w-full p-2 border rounded transition-colors ${
              touched.benefits && !form.benefits
                ? "border-red-500"
                : "border-gray-300 hover:border-gray-400"
            }`}
            placeholder="Masukkan manfaat tumbuhan"
            required
          ></textarea>
          {touched.benefits && !form.benefits && (
            <p className="text-sm text-red-500 mt-1">Manfaat wajib diisi</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ciri-ciri
          </label>
          <textarea
            name="characteristics"
            value={form.characteristics}
            onChange={handleChange}
            className={`w-full p-2 border rounded transition-colors ${
              touched.characteristics && !form.characteristics
                ? "border-red-500"
                : "border-gray-300 hover:border-gray-400"
            }`}
            placeholder="Masukkan ciri-ciri tumbuhan"
            required
          ></textarea>
          {touched.characteristics && !form.characteristics && (
            <p className="text-sm text-red-500 mt-1">Ciri-ciri wajib diisi</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Asal
          </label>
          <textarea
            name="origin"
            value={form.origin}
            onChange={handleChange}
            className={`w-full p-2 border rounded transition-colors ${
              touched.origin && !form.origin
                ? "border-red-500"
                : "border-gray-300 hover:border-gray-400"
            }`}
            placeholder="Masukkan asal tumbuhan"
            required
          ></textarea>
          {touched.origin && !form.origin && (
            <p className="text-sm text-red-500 mt-1">Asal wajib diisi</p>
          )}
        </div>

        {renderChemicalComponentsSelect()}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Budidaya
          </label>
          <textarea
            name="cultivation"
            value={form.cultivation}
            onChange={handleChange}
            className={`w-full p-2 border rounded transition-colors ${
              touched.cultivation && !form.cultivation
                ? "border-red-500"
                : "border-gray-300 hover:border-gray-400"
            }`}
            placeholder="Masukkan cara budidaya tumbuhan"
            required
          ></textarea>
          {touched.cultivation && !form.cultivation && (
            <p className="text-sm text-red-500 mt-1">Budidaya wajib diisi</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sumber Referensi
          </label>
          <textarea
            name="source_ref"
            value={form.source_ref}
            onChange={handleChange}
            className={`w-full p-2 border rounded transition-colors ${
              touched.source_ref && !form.source_ref
                ? "border-red-500"
                : "border-gray-300 hover:border-gray-400"
            }`}
            placeholder="Masukkan sumber referensi"
            required
          ></textarea>
          {touched.source_ref && !form.source_ref && (
            <p className="text-sm text-red-500 mt-1">
              Sumber referensi wajib diisi
            </p>
          )}
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/specific-plants")}
            className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 disabled:bg-green-400"
            disabled={isLoading}
          >
            {isLoading ? "Menyimpan..." : "Lanjut ke Klasifikasi"}
          </button>
        </div>
      </form>
    );
  };

  const renderStepTwo = () => {
    return (
      <form onSubmit={handleSubmitClassification} className="space-y-4 mx-auto">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="bg-green-50 p-4 rounded-lg mb-4 border border-green-200">
          <h3 className="text-green-800 font-medium">
            Data tumbuhan berhasil disimpan!
          </h3>
          <p className="text-green-700 text-sm">
            Silahkan lengkapi klasifikasi taksonomi untuk tumbuhan {form.name}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kingdom
            </label>
            <input
              type="text"
              value="Plantae"
              className="w-full p-2 border rounded bg-gray-100"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subkingdom
            </label>
            <select
              value={selectedSubkingdom}
              onChange={(e) => setSelectedSubkingdom(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Pilih Subkingdom</option>
              {subkingdoms.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Superdivision
            </label>
            <select
              value={selectedSuperdivision}
              onChange={(e) => setSelectedSuperdivision(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={!selectedSubkingdom}
              required
            >
              <option value="">Pilih Superdivision</option>
              {superdivisions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Division
            </label>
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={!selectedSuperdivision}
              required
            >
              <option value="">Pilih Division</option>
              {divisions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={!selectedDivision}
              required
            >
              <option value="">Pilih Class</option>
              {classes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subclass
            </label>
            <select
              value={selectedSubclass}
              onChange={(e) => setSelectedSubclass(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={!selectedClass}
              required
            >
              <option value="">Pilih Subclass</option>
              {subclasses.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order
            </label>
            <select
              value={selectedOrder}
              onChange={(e) => setSelectedOrder(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={!selectedSubclass}
              required
            >
              <option value="">Pilih Order</option>
              {orders.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Family
            </label>
            <select
              value={selectedFamily}
              onChange={(e) => setSelectedFamily(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={!selectedOrder}
              required
            >
              <option value="">Pilih Family</option>
              {families.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Genus
            </label>
            <select
              value={selectedGenus}
              onChange={(e) => setSelectedGenus(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={!selectedFamily}
              required
            >
              <option value="">Pilih Genus</option>
              {genera.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Species
            </label>
            <select
              value={selectedSpeciesId || ""}
              onChange={(e) => setSelectedSpeciesId(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={!selectedGenus}
              required
            >
              <option value="">Pilih Species</option>
              {species.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700"
          >
            Kembali
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 disabled:bg-green-400"
            disabled={isLoading}
          >
            {isLoading ? "Menyimpan..." : "Simpan Klasifikasi"}
          </button>
        </div>
      </form>
    );
  };

  return (
    <AdminLayout>
      <div className="mt-4 bg-white border-2 rounded-xl p-4 shadow overflow-x-auto font-Poppins">
        <div className="px-2 pt-2">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-black">
              Tambah Tumbuhan Spesifik
            </h1>
            <button
              className="px-4 py-2 text-sm text-white bg-gray-600 rounded hover:bg-gray-700"
              onClick={() => navigate("/specific-plants")}
            >
              Kembali
            </button>
          </div>

          <div className="w-full mb-8">
            <div className="flex items-center">
              <div
                className={`flex-1 border-t-2 ${
                  currentStep >= 1 ? "border-green-500" : "border-gray-300"
                }`}
              ></div>
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-white ${
                  currentStep >= 1 ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                1
              </div>
              <div
                className={`flex-1 border-t-2 ${
                  currentStep >= 2 ? "border-green-500" : "border-gray-300"
                }`}
              ></div>
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-white ${
                  currentStep >= 2 ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                2
              </div>
              <div className="flex-1 border-t-2 border-gray-300"></div>
            </div>
            <div className="flex text-xs md:text-sm justify-between px-5 mt-2 ">
              <div
                className={`${
                  currentStep >= 1
                    ? "text-green-500 font-semibold"
                    : "text-gray-500"
                }`}
              >
                Detail Tumbuhan
              </div>
              <div
                className={`${
                  currentStep >= 2
                    ? "text-green-500 font-semibold"
                    : "text-gray-500"
                }`}
              >
                Klasifikasi
              </div>
            </div>
          </div>

          <div className="border-t border-gray-300 mb-4"></div>

          {currentStep === 1 && renderStepOne()}
          {currentStep === 2 && renderStepTwo()}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AddSpecificPlantPage;
