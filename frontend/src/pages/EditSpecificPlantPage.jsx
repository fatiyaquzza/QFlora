import React, { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import AdminLayout from "../components/AdminLayout";
import { useNavigate, useParams } from "react-router-dom";

function EditSpecificPlantPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get plant ID from URL
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

  const [chemicalComponents, setChemicalComponents] = useState([]);
  const [selectedChemicalComponents, setSelectedChemicalComponents] = useState(
    []
  );

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
    genuses: [],
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

  // Fetch plant data on component mount
  useEffect(() => {
    const fetchPlantData = async () => {
      try {
        // First fetch taxonomy data
        const taxonomyRes = await axiosClient.get("/api/taxonomy/full");
        console.log("Taxonomy Data:", taxonomyRes.data);

        // Store taxonomy data first
        const taxonomyData = taxonomyRes.data;
        setTaxonomyData(taxonomyData);

        // Set initial subkingdoms
        setSubkingdoms(taxonomyData.subkingdoms || []);

        // Then fetch plant data and other data
        const [plantRes, typesRes, chemicalsRes] = await Promise.all([
          axiosClient.get(`/specific-plants/${id}`),
          axiosClient.get("/api/plant-types"),
          axiosClient.get("/api/chemical-components"),
        ]);

        console.log("Plant Data:", plantRes.data);

        // Set form data
        setForm(plantRes.data);

        // Set plant types
        setPlantTypes(typesRes.data);

        // Set chemical components
        setChemicalComponents(chemicalsRes.data);

        // Set selected chemical components
        const selectedChemIds =
          plantRes.data.chemical_components?.map((comp) =>
            comp.id.toString()
          ) || [];
        setSelectedChemicalComponents(selectedChemIds);

        // If we have a species_id, fetch its complete classification
        if (plantRes.data.species_id) {
          try {
            // Find the species in taxonomy data
            const species = taxonomyData.species.find(
              (s) => s.id === plantRes.data.species_id
            );
            if (species) {
              console.log("Found species:", species);

              // Find genus
              const genus = taxonomyData.genuses.find(
                (g) => g.id === species.genus_id
              );
              if (genus) {
                // Find family
                const family = taxonomyData.families.find(
                  (f) => f.id === genus.family_id
                );
                if (family) {
                  // Find order
                  const order = taxonomyData.orders.find(
                    (o) => o.id === family.order_id
                  );
                  if (order) {
                    // Find subclass
                    const subclass = taxonomyData.subclasses.find(
                      (sc) => sc.id === order.subclass_id
                    );
                    if (subclass) {
                      // Find class
                      const classData = taxonomyData.classes.find(
                        (c) => c.id === subclass.class_id
                      );
                      if (classData) {
                        // Find division
                        const division = taxonomyData.divisions.find(
                          (d) => d.id === classData.division_id
                        );
                        if (division) {
                          // Find superdivision
                          const superdivision =
                            taxonomyData.superdivisions.find(
                              (sd) => sd.id === division.superdivision_id
                            );
                          if (superdivision) {
                            // Find subkingdom
                            const subkingdom = taxonomyData.subkingdoms.find(
                              (sk) => sk.id === superdivision.subkingdom_id
                            );

                            if (subkingdom) {
                              console.log("Complete classification found:", {
                                subkingdom,
                                superdivision,
                                division,
                                classData,
                                subclass,
                                order,
                                family,
                                genus,
                                species,
                              });

                              // Set all taxonomy data as strings
                              setSelectedSubkingdom(subkingdom.id.toString());
                              setSelectedSuperdivision(
                                superdivision.id.toString()
                              );
                              setSelectedDivision(division.id.toString());
                              setSelectedClass(classData.id.toString());
                              setSelectedSubclass(subclass.id.toString());
                              setSelectedOrder(order.id.toString());
                              setSelectedFamily(family.id.toString());
                              setSelectedGenus(genus.id.toString());
                              setSelectedSpeciesId(species.id.toString());

                              // Filter and set options for each level
                              const filteredSuperdivisions =
                                taxonomyData.superdivisions.filter(
                                  (sd) => sd.subkingdom_id === subkingdom.id
                                );
                              setSuperdivisions(filteredSuperdivisions);

                              const filteredDivisions =
                                taxonomyData.divisions.filter(
                                  (d) => d.superdivision_id === superdivision.id
                                );
                              setDivisions(filteredDivisions);

                              const filteredClasses =
                                taxonomyData.classes.filter(
                                  (c) => c.division_id === division.id
                                );
                              setClasses(filteredClasses);

                              const filteredSubclasses =
                                taxonomyData.subclasses.filter(
                                  (sc) => sc.class_id === classData.id
                                );
                              setSubclasses(filteredSubclasses);

                              const filteredOrders = taxonomyData.orders.filter(
                                (o) => o.subclass_id === subclass.id
                              );
                              setOrders(filteredOrders);

                              const filteredFamilies =
                                taxonomyData.families.filter(
                                  (f) => f.order_id === order.id
                                );
                              setFamilies(filteredFamilies);

                              const filteredGenera =
                                taxonomyData.genuses.filter(
                                  (g) => g.family_id === family.id
                                );
                              setGenera(filteredGenera);

                              const filteredSpecies =
                                taxonomyData.species.filter(
                                  (s) => s.genus_id === genus.id
                                );
                              setSpecies(filteredSpecies);
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          } catch (err) {
            console.error("Error building classification:", err);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Gagal memuat data. Silakan coba lagi.");
      }
    };

    if (id) {
      fetchPlantData();
    }
  }, [id]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmitPlantDetails = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedData = {
        ...form,
        chemical_component_ids: selectedChemicalComponents,
      };

      await axiosClient.put(`/specific-plants/${id}`, updatedData);
      setCurrentStep(2);
    } catch (err) {
      console.error("Error updating plant:", err);
      setError("Gagal memperbarui data tanaman. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle classification submission
  const handleSubmitClassification = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Updating plant with species_id:", selectedSpeciesId);

      // Update the specific plant with the new species_id
      await axiosClient.put(`/specific-plants/${id}`, {
        species_id: parseInt(selectedSpeciesId),
      });

      navigate("/specific-plants");
    } catch (err) {
      console.error("Error updating classification:", err);
      setError("Gagal memperbarui klasifikasi. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Replace the chemical_comp textarea with this new component
  const renderChemicalComponentsSelect = () => {
    const filteredComponents = chemicalComponents.filter((comp) =>
      comp.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <div
                key={component.id}
                className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded"
              >
                <input
                  type="checkbox"
                  id={`comp-${component.id}`}
                  value={component.id}
                  checked={selectedChemicalComponents.includes(
                    component.id.toString()
                  )}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedChemicalComponents((prev) =>
                      e.target.checked
                        ? [...prev, value]
                        : prev.filter((id) => id !== value)
                    );
                  }}
                  className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                />
                <label
                  htmlFor={`comp-${component.id}`}
                  className="text-sm text-gray-700 cursor-pointer select-none"
                >
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
      </div>
    );
  };

  // --- CASCADE LOGIC FOR EDIT PAGE ---
  // When a parent is changed, only reset lower levels, not upper ones
  // Subkingdom
  const handleSubkingdomChange = (value) => {
    setSelectedSubkingdom(value);
    const filteredSuperdivisions = taxonomyData.superdivisions.filter(
      (sd) => sd.subkingdom_id === parseInt(value)
    );
    setSuperdivisions(filteredSuperdivisions);
    setSelectedSuperdivision("");
    setDivisions([]);
    setSelectedDivision("");
    setClasses([]);
    setSelectedClass("");
    setSubclasses([]);
    setSelectedSubclass("");
    setOrders([]);
    setSelectedOrder("");
    setFamilies([]);
    setSelectedFamily("");
    setGenera([]);
    setSelectedGenus("");
    setSpecies([]);
    setSelectedSpeciesId(null);
  };

  // Superdivision
  const handleSuperdivisionChange = (value) => {
    setSelectedSuperdivision(value);
    const filteredDivisions = taxonomyData.divisions.filter(
      (d) => d.superdivision_id === parseInt(value)
    );
    setDivisions(filteredDivisions);
    setSelectedDivision("");
    setClasses([]);
    setSelectedClass("");
    setSubclasses([]);
    setSelectedSubclass("");
    setOrders([]);
    setSelectedOrder("");
    setFamilies([]);
    setSelectedFamily("");
    setGenera([]);
    setSelectedGenus("");
    setSpecies([]);
    setSelectedSpeciesId(null);
  };

  // Division
  const handleDivisionChange = (value) => {
    setSelectedDivision(value);
    const filteredClasses = taxonomyData.classes.filter(
      (c) => c.division_id === parseInt(value)
    );
    setClasses(filteredClasses);
    setSelectedClass("");
    setSubclasses([]);
    setSelectedSubclass("");
    setOrders([]);
    setSelectedOrder("");
    setFamilies([]);
    setSelectedFamily("");
    setGenera([]);
    setSelectedGenus("");
    setSpecies([]);
    setSelectedSpeciesId(null);
  };

  // Class
  const handleClassChange = (value) => {
    setSelectedClass(value);
    const filteredSubclasses = taxonomyData.subclasses.filter(
      (sc) => sc.class_id === parseInt(value)
    );
    setSubclasses(filteredSubclasses);
    setSelectedSubclass("");
    setOrders([]);
    setSelectedOrder("");
    setFamilies([]);
    setSelectedFamily("");
    setGenera([]);
    setSelectedGenus("");
    setSpecies([]);
    setSelectedSpeciesId(null);
  };

  // Subclass
  const handleSubclassChange = (value) => {
    setSelectedSubclass(value);
    const filteredOrders = taxonomyData.orders.filter(
      (o) => o.subclass_id === parseInt(value)
    );
    setOrders(filteredOrders);
    setSelectedOrder("");
    setFamilies([]);
    setSelectedFamily("");
    setGenera([]);
    setSelectedGenus("");
    setSpecies([]);
    setSelectedSpeciesId(null);
  };

  // Order
  const handleOrderChange = (value) => {
    setSelectedOrder(value);
    const filteredFamilies = taxonomyData.families.filter(
      (f) => f.order_id === parseInt(value)
    );
    setFamilies(filteredFamilies);
    setSelectedFamily("");
    setGenera([]);
    setSelectedGenus("");
    setSpecies([]);
    setSelectedSpeciesId(null);
  };

  // Family
  const handleFamilyChange = (value) => {
    setSelectedFamily(value);
    const filteredGenera = taxonomyData.genuses.filter(
      (g) => g.family_id === parseInt(value)
    );
    setGenera(filteredGenera);
    setSelectedGenus("");
    setSpecies([]);
    setSelectedSpeciesId(null);
  };

  // Genus
  const handleGenusChange = (value) => {
    setSelectedGenus(value);
    const filteredSpecies = taxonomyData.species.filter(
      (s) => s.genus_id === parseInt(value)
    );
    setSpecies(filteredSpecies);
    setSelectedSpeciesId(null);
  };

  // Render step one (plant details)
  const renderStepOne = () => (
    <form onSubmit={handleSubmitPlantDetails} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Tanaman
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Latin
          </label>
          <input
            type="text"
            name="latin_name"
            value={form.latin_name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL Gambar
          </label>
          <input
            type="text"
            name="image_url"
            value={form.image_url}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipe Tanaman
          </label>
          <select
            name="plant_type_id"
            value={form.plant_type_id}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Pilih Tipe Tanaman</option>
            {plantTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Inggris
          </label>
          <input
            type="text"
            name="eng_name"
            value={form.eng_name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Arab
          </label>
          <input
            type="text"
            name="arab_name"
            value={form.arab_name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ringkasan
        </label>
        <textarea
          name="overview"
          value={form.overview}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows="3"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Deskripsi
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows="3"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Manfaat
        </label>
        <textarea
          name="benefits"
          value={form.benefits}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows="3"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Karakteristik
        </label>
        <textarea
          name="characteristics"
          value={form.characteristics}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows="3"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Asal
        </label>
        <textarea
          name="origin"
          value={form.origin}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows="3"
          required
        />
      </div>

      {renderChemicalComponentsSelect()}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Budidaya
        </label>
        <textarea
          name="cultivation"
          value={form.cultivation}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows="3"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Referensi
        </label>
        <textarea
          name="source_ref"
          value={form.source_ref}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows="3"
          required
        />
      </div>

      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => navigate("/specific-plants")}
          className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 disabled:bg-green-300"
        >
          {isLoading ? "Menyimpan..." : "Lanjut ke Klasifikasi"}
        </button>
      </div>
    </form>
  );

  const renderStepTwo = () => (
    <form onSubmit={handleSubmitClassification} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subkingdom
          </label>
          <select
            value={selectedSubkingdom || ""}
            onChange={(e) => handleSubkingdomChange(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Pilih Subkingdom</option>
            {subkingdoms.map((sk) => (
              <option key={sk.id} value={sk.id.toString()}>
                {sk.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Superdivision
          </label>
          <select
            value={selectedSuperdivision || ""}
            onChange={(e) => handleSuperdivisionChange(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Pilih Superdivision</option>
            {superdivisions.map((sd) => (
              <option key={sd.id} value={sd.id.toString()}>
                {sd.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Division
          </label>
          <select
            value={selectedDivision || ""}
            onChange={(e) => handleDivisionChange(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Pilih Division</option>
            {divisions.map((d) => (
              <option key={d.id} value={d.id.toString()}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Class
          </label>
          <select
            value={selectedClass || ""}
            onChange={(e) => handleClassChange(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Pilih Class</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id.toString()}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subclass
          </label>
          <select
            value={selectedSubclass || ""}
            onChange={(e) => handleSubclassChange(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Pilih Subclass</option>
            {subclasses.map((sc) => (
              <option key={sc.id} value={sc.id.toString()}>
                {sc.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Order
          </label>
          <select
            value={selectedOrder || ""}
            onChange={(e) => handleOrderChange(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Pilih Order</option>
            {orders.map((o) => (
              <option key={o.id} value={o.id.toString()}>
                {o.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Family
          </label>
          <select
            value={selectedFamily || ""}
            onChange={(e) => handleFamilyChange(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Pilih Family</option>
            {families.map((f) => (
              <option key={f.id} value={f.id.toString()}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Genus
          </label>
          <select
            value={selectedGenus || ""}
            onChange={(e) => handleGenusChange(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Pilih Genus</option>
            {genera.map((g) => (
              <option key={g.id} value={g.id.toString()}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Species
          </label>
          <select
            value={selectedSpeciesId || ""}
            onChange={(e) => setSelectedSpeciesId(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Pilih Species</option>
            {species.map((s) => (
              <option key={s.id} value={s.id.toString()}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => setCurrentStep(1)}
          className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
        >
          Kembali
        </button>
        <button
          type="submit"
          disabled={isLoading || !selectedSpeciesId}
          className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 disabled:bg-green-300"
        >
          {isLoading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Edit Tanaman Spesifik</h1>

        {/* Progress steps */}
        <div className="mb-8">
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 1 ? "bg-green-600 text-white" : "bg-gray-300"
              }`}
            >
              1
            </div>
            <div className="flex-1 h-1 mx-4 bg-gray-300">
              <div
                className={`h-full ${
                  currentStep === 2 ? "bg-green-600" : "bg-gray-300"
                }`}
              />
            </div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 2 ? "bg-green-600 text-white" : "bg-gray-300"
              }`}
            >
              2
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-sm">Detail Tanaman</span>
            <span className="text-sm">Klasifikasi</span>
          </div>
        </div>

        {/* Form steps */}
        {currentStep === 1 ? renderStepOne() : renderStepTwo()}
      </div>
    </AdminLayout>
  );
}

export default EditSpecificPlantPage;
